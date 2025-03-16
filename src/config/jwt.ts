/*
 * @Author: DESKTOP-H44236O\Sora 1430008132@qq.com
 * @Date: 2024-01-15 23:49:24
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2025-02-26 15:55:09
 * @FilePath: \Vue3-Ts-Server\src\config\jwt.ts
 * @Description: jwt公用方法
 */
import jwt from 'jsonwebtoken';
import redis from '../redis';
import { getRSAPrivateKey, getRSAPublicKey } from '../utils/crypto';

export const jwtExpireTime = 3600 // jwt过期时间 单位为秒

/**
 * @description: 下发token
 * @param {*} payload 载体
 * @return {*}
 */
export const encode = async (payload: {[key: string]: any}) => {
    const privateKey = await getRSAPrivateKey()
    const token = jwt.sign(payload, privateKey, {
        expiresIn: jwtExpireTime,
        algorithm: 'RS256'
    })

    // 存一份过期时间是token过期时间双倍的redis数据
    redis.setValue(payload.userid, token, (jwtExpireTime * 2))
    return token
}

/**
 * @description: 验证token
 * @param {*} token
 * @return {*}
 */
export const verifyToken = async (token: string) => {
    const publicKey = await getRSAPublicKey()
    const res = jwt.verify(token, publicKey)
    return res
}

/**
 * @description: 获取token剩余时间
 * @param {*} token
 * @return {*}
 */
export const getTokenExpireTime = (token: string) => {
    const { exp } = getTokenInfo(token)
    const now = Math.ceil(new Date().getTime() / 1000)
    const time = exp - now
    return time > 0 ? time : 0
}

/**
 * @description: 获取token中存储的信息
 * @param {*} token
 * @return {*}
 */
export const getTokenInfo = (token: string) => {
    try {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf-8'))
    } catch (err) {
        return err
    }
}