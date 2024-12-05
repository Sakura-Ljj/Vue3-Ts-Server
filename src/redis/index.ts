/*
 * @Author: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2024-01-15 16:25:54
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-05 10:47:24
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

// 生成redis的client

const client = redis.createClient(options)

// 存储值
export const setValue = (key: string, value: any, time?: number) => {
    if (typeof value === 'string'){
        client.set(key, value)
    }
    if (typeof value === 'object'){
        for (const item in value) {
            client.hSet(key, item, value[item])
        }
    }

    if (!time) return
    client.expire(key, time)
}


// 获取string
export const getValue = (key: string) => {
    return client.get(key)
}

// 获取hash
export const getHValue = (key: string) => {
    return client.hGetAll(key)
}

// 删除key
export const delKey = (key: string) => {
    client.del(key)
}

// 模糊删除key
// 定义一个递归函数，用于逐步扫描并删除匹配的键
export const scanAndDel = (cursor: number, pattern: string) => {
    client.scan(cursor, { MATCH: pattern, COUNT: 10 }).then(res => {
        const newCursor = res.cursor
        const keys = res.keys
        // 删除匹配的键
        keys.forEach((key: string) => {
            client.del(key);
        });

        // 如果游标不为0，继续扫描
        if (newCursor) {
            scanAndDel(newCursor, pattern);
        } else {
            console.log('Finished scanning and deleting keys.');
        }
    })
}