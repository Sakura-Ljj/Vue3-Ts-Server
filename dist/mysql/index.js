"use strict";
/*
 * @Author: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2023-06-25 14:53:54
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-04 11:11:22
 * @FilePath: \Vue3-ts-server\src\mysql\index.ts
 * @Description: mysql 数据库使用的封装
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise")); // 原来的node-mysql插件跟mysql 8.0版本的连接之间有权限问题, 所以更换成了node-mysql2
const index_1 = require("../redis/index");
const mysqlConfig_1 = __importDefault(require("./mysqlConfig"));
exports.default = async ({ sql, values }) => {
    const querySql = promise_1.default.format(sql, values);
    const cacheKey = `sql:${querySql}`;
    // 获取Redis缓存
    const cacheResult = await (0, index_1.getValue)(cacheKey);
    // Redis有数据则返回Redis的数据, 没有则请求mysql数据库
    if (cacheResult)
        return JSON.parse(cacheResult);
    // 创建数据库连接
    const connection = await promise_1.default.createConnection(mysqlConfig_1.default);
    // 数据库操作
    const [result = []] = await connection.query(querySql);
    if (Array.isArray(result)) {
        // 存入Redis缓存, 缓存时间两分钟
        (0, index_1.setValue)(cacheKey, JSON.stringify(result), 120);
    }
    else {
        // 删除跟这次更新数据有关的表的缓存
        const regex = /(?:FROM|INTO|UPDATE)\s+([^\s]+)/i;
        const match = sql.match(regex);
        if (!match?.[1])
            return;
        (0, index_1.scanAndDel)(0, `*${match[1]}*`);
    }
    // 关闭数据库连接
    await connection.end();
    return result;
};
