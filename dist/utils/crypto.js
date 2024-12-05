"use strict";
/*
 * @Author: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2023-07-10 17:17:29
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-02 17:39:17
 * @FilePath: \Vue3-ts-server\src\utils\crypto.ts
 * @Description: 加密解密算法
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRSAPrivateKey = exports.getRSAPublicKey = exports.generateRSAKey = exports.pbkdf2Decrypt = exports.pbkdf2Encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const redis_1 = require("../redis");
const commonUtils_1 = require("../utils/commonUtils");
const errorCode_1 = require("../config/errorCode");
const iterations = 4096; // 加密迭代次数
const passwordKeylen = 64; // 生成密码的密钥长度
const RSAKeylen = 2048; // 生成RSA密码的密钥长度
const digest = 'sha256'; // 加密哈希函数
const redisPubliceKey = 'publiceKey';
const redisPrivateKey = 'privateKey';
const pbkdf2Encrypt = (password) => {
    const salt = crypto_1.default.randomBytes(32).toString('hex'); // 生成 32 字节的随机数作为盐值
    const result = crypto_1.default.pbkdf2Sync(password, salt, iterations, passwordKeylen, digest);
    return {
        salt,
        result: result.toString('hex')
    };
};
exports.pbkdf2Encrypt = pbkdf2Encrypt;
const pbkdf2Decrypt = (password, salt) => {
    const result = crypto_1.default.pbkdf2Sync(password, salt, iterations, passwordKeylen, digest);
    return result.toString('hex');
};
exports.pbkdf2Decrypt = pbkdf2Decrypt;
// 生成一对RSA密钥并保存在redis中, 定时触发这个方法去更新密钥
const generateRSAKey = () => {
    const { privateKey, publicKey } = crypto_1.default.generateKeyPairSync('rsa', {
        modulusLength: RSAKeylen // 密钥长度
    });
    // // 将密钥导出为字符串
    const privateKeyStr = privateKey.export({
        type: 'pkcs1',
        format: 'pem'
    });
    const publicKeyStr = publicKey.export({
        type: 'spki',
        format: 'pem'
    });
    // 将密钥保存到redis
    (0, redis_1.setValue)(redisPubliceKey, publicKeyStr);
    (0, redis_1.setValue)(redisPrivateKey, privateKeyStr);
};
exports.generateRSAKey = generateRSAKey;
// 获取公钥
const getRSAPublicKey = async () => {
    const publiceKey = await (0, redis_1.getValue)(redisPubliceKey);
    if (!publiceKey)
        throw (0, commonUtils_1.myError)(errorCode_1.NO_AUTH_ERROR_CODE, '下发token失败');
    return publiceKey;
};
exports.getRSAPublicKey = getRSAPublicKey;
// 获取私钥
const getRSAPrivateKey = async () => {
    const privateKey = await (0, redis_1.getValue)(redisPrivateKey);
    if (!privateKey)
        throw (0, commonUtils_1.myError)(errorCode_1.NO_AUTH_ERROR_CODE, '下发token失败');
    return privateKey;
};
exports.getRSAPrivateKey = getRSAPrivateKey;
