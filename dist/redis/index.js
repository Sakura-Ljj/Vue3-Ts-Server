"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanAndDel = exports.delKey = exports.getHValue = exports.getValue = exports.setValue = void 0;
/*
 * @Author: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2024-01-15 16:25:54
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-05 10:47:24
 * @FilePath: \Vue3-ts-server\src\redis\index.ts
 * @Description:
 */
const redis = __importStar(require("redis"));
const redisConfig_1 = __importDefault(require("./redisConfig"));
const options = {
    host: redisConfig_1.default.host,
    port: redisConfig_1.default.port,
    password: redisConfig_1.default.password,
    detect_buffers: redisConfig_1.default.detect_buffers, // 传入buffer 返回也是buffer 否则会转换成String
    retry_strategy: (options) => {
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
};
// 生成redis的client
const client = redis.createClient(options);
// 存储值
const setValue = (key, value, time) => {
    if (typeof value === 'string') {
        client.set(key, value);
    }
    if (typeof value === 'object') {
        for (const item in value) {
            client.hSet(key, item, value[item]);
        }
    }
    if (!time)
        return;
    client.expire(key, time);
};
exports.setValue = setValue;
// 获取string
const getValue = (key) => {
    return client.get(key);
};
exports.getValue = getValue;
// 获取hash
const getHValue = (key) => {
    return client.hGetAll(key);
};
exports.getHValue = getHValue;
// 删除key
const delKey = (key) => {
    client.del(key);
};
exports.delKey = delKey;
// 模糊删除key
// 定义一个递归函数，用于逐步扫描并删除匹配的键
const scanAndDel = (cursor, pattern) => {
    client.scan(cursor, { MATCH: pattern, COUNT: 10 }).then(res => {
        const newCursor = res.cursor;
        const keys = res.keys;
        // 删除匹配的键
        keys.forEach((key) => {
            client.del(key);
        });
        // 如果游标不为0，继续扫描
        if (newCursor) {
            (0, exports.scanAndDel)(newCursor, pattern);
        }
        else {
            console.log('Finished scanning and deleting keys.');
        }
    });
};
exports.scanAndDel = scanAndDel;
