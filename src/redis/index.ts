/*
 * @Author: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2024-01-15 16:25:54
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2025-01-16 11:23:09
 * @FilePath: \Vue3-ts-server\src\redis\index.ts
 * @Description:
 */
import * as redis from 'redis';
import redisOptions from './redisConfig';

const options = {
    host: redisOptions.host,
    port: redisOptions.port,
    password: redisOptions.password,
    detect_buffers: redisOptions.detect_buffers, // 传入buffer 返回也是buffer 否则会转换成String
    retry_strategy: (options: {[key: string]: any}) => {
    // 重连机制
        if (options.error && options.error.code === "ECONNREFUSED") {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error("The server refused the connection");
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error("Retry time exhausted");
        }
        if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
}

class Redis {
    client: redis.RedisClientType;
    constructor () {
        // 生成redis的client
        this.client = redis.createClient(options)
        if (!this.client.isOpen) this.connect()
    }

    async connect() {
        await this.client.connect().catch(err => { console.log('redisErr', err) })
        if (!this.client.isReady) throw 'redis is not ready'
    }

    close() {
        this.client.quit()
    }

    // 存储值
    async setValue (key: string, value: any, time?: number) {
        if (typeof value === 'string'){
            await this.client.set(key, value)
        }
        if (typeof value === 'object'){
            for (const item in value) {
                await this.client.hSet(key, item, value[item])
            }
        }

        if (!time) return
        await this.client.expire(key, time)
    }


    // 获取string
    getValue (key: string) {
        return this.client.get(key)
    }

    // 获取hash
    getHValue (key: string) {
        return this.client.hGetAll(key)
    }

    // 删除key
    async delKey(key: string) {
        await this.client.del(key)
    }

    // 模糊删除key
    // 定义一个递归函数，用于逐步扫描并删除匹配的键
    scanAndDel(cursor: number, pattern: string) {
        this.client.scan(cursor, { MATCH: pattern, COUNT: 10 }).then(res => {
            const newCursor = res.cursor
            const keys = res.keys
            // 删除匹配的键
            keys.forEach((key: string) => {
                this.client.del(key);
            });

            // 如果游标不为0，继续扫描
            if (newCursor) {
                this.scanAndDel(newCursor, pattern);
            } else {
                console.log('Finished scanning and deleting keys.');
            }
        })

    }
}

export default new Redis()