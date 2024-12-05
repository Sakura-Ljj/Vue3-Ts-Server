"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenInfo = exports.getTokenExpireTime = exports.verifyToken = exports.encode = exports.jwtExpireTime = void 0;
/*
 * @Author: DESKTOP-H44236O\Sora 1430008132@qq.com
 * @Date: 2024-01-15 23:49:24
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-03 14:38:42
 * @FilePath: \Vue3-ts-server\src\config\jwt.ts
 * @Description: jwt公用方法
 */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../redis");
const crypto_1 = require("../utils/crypto");
exports.jwtExpireTime = 3600; // jwt过期时间 单位为秒
/**
 * @description: 下发token
 * @param {*} payload 载体
 * @return {*}
 */
const encode = async (payload) => {
    const privateKey = await (0, crypto_1.getRSAPrivateKey)();
    const token = jsonwebtoken_1.default.sign(payload, privateKey, {
        expiresIn: exports.jwtExpireTime,
        algorithm: 'RS256'
    });
    // 存一份过期时间是token过期时间双倍的redis数据
    (0, redis_1.setValue)(payload.userId, token, (exports.jwtExpireTime * 2));
    return token;
};
exports.encode = encode;
/**
 * @description: 验证token
 * @param {*} token
 * @return {*}
 */
const verifyToken = async (token) => {
    const publicKey = await (0, crypto_1.getRSAPublicKey)();
    const res = jsonwebtoken_1.default.verify(token, publicKey);
    return res;
};
exports.verifyToken = verifyToken;
/**
 * @description: 获取token剩余时间
 * @param {*} token
 * @return {*}
 */
const getTokenExpireTime = (token) => {
    const { exp } = (0, exports.getTokenInfo)(token);
    const now = Math.ceil(new Date().getTime() / 1000);
    const time = exp - now;
    return time > 0 ? time : 0;
};
exports.getTokenExpireTime = getTokenExpireTime;
/**
 * @description: 获取token中存储的信息
 * @param {*} token
 * @return {*}
 */
const getTokenInfo = (token) => {
    try {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf-8'));
    }
    catch (err) {
        return err;
    }
};
exports.getTokenInfo = getTokenInfo;
