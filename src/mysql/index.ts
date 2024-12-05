/*
 * @Author: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2023-06-25 14:53:54
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-04 11:11:22
 * @FilePath: \Vue3-ts-server\src\mysql\index.ts
 * @Description: mysql 数据库使用的封装
 */

import mysql from 'mysql2/promise' // 原来的node-mysql插件跟mysql 8.0版本的连接之间有权限问题, 所以更换成了node-mysql2
import { getValue, setValue, scanAndDel } from '../redis/index'
import databaseConfig from './mysqlConfig'

export default async ({ sql, values }: {sql: string, values: any[]}) => {
    const querySql = mysql.format(sql, values)
    const cacheKey = `sql:${querySql}`

    // 获取Redis缓存
    const cacheResult = await getValue(cacheKey)
    // Redis有数据则返回Redis的数据, 没有则请求mysql数据库
    if (cacheResult) return JSON.parse(cacheResult)

    // 创建数据库连接
    const connection = await mysql.createConnection(databaseConfig)

    // 数据库操作
    const [result = []] = await connection.query(querySql)

    if (Array.isArray(result)) {
        // 存入Redis缓存, 缓存时间两分钟
        setValue(cacheKey, JSON.stringify(result), 120)
    } else {
        // 删除跟这次更新数据有关的表的缓存
        const regex = /(?:FROM|INTO|UPDATE)\s+([^\s]+)/i;
        const match = sql.match(regex);
        if (!match?.[1]) return
        scanAndDel(0, `*${match[1]}*`)
    }

    // 关闭数据库连接
    await connection.end()

    return result
}
