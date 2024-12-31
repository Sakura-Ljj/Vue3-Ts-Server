/*
 * @Author: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2023-07-10 17:17:29
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-25 11:33:19
 * @FilePath: \Vue3-ts-server\src\utils\crypto.ts
 * @Description: 加密解密算法
 */

import crypto from 'crypto';
import redis from '../redis';
import { myError } from '../utils/commonUtils';
import { NO_AUTH_ERROR_CODE } from '../config/errorCode';

const iterations = 4096 // 加密迭代次数
const passwordKeylen = 64 // 生成密码的密钥长度
const RSAKeylen = 2048 // 生成RSA密码的密钥长度
const digest = 'sha256' // 加密哈希函数
const redisPubliceKey = 'publiceKey'
const redisPrivateKey = 'privateKey'

export const pbkdf2Encrypt = (password: string) => {
    const salt = crypto.randomBytes(32).toString('hex') // 生成 32 字节的随机数作为盐值
    const result = crypto.pbkdf2Sync(password, salt, iterations, passwordKeylen, digest)

    return {
        salt,
        result: result.toString('hex')
    }
}

export const pbkdf2Decrypt = (password: string, salt: string) => {
    const result = crypto.pbkdf2Sync(password, salt, iterations, passwordKeylen, digest)
    return result.toString('hex')
}

// 生成一对RSA密钥并保存在redis中, 定时触发这个方法去更新密钥
export const generateRSAKey = () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
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
    redis.setValue(redisPubliceKey, publicKeyStr)
    redis.setValue(redisPrivateKey, privateKeyStr)
}

// 获取公钥
export const getRSAPublicKey = async () => {
    const publiceKey = await redis.getValue(redisPubliceKey)
    if (!publiceKey) throw myError(NO_AUTH_ERROR_CODE, '下发token失败')
    return publiceKey
}

// 获取私钥
export const getRSAPrivateKey = async () => {
    const privateKey = await redis.getValue(redisPrivateKey)
    if (!privateKey) throw myError(NO_AUTH_ERROR_CODE, '下发token失败')
    return privateKey
}
