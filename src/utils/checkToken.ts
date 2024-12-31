/*
 * @Author: DESKTOP-H44236O\Sora 1430008132@qq.com
 * @Date: 2024-01-16 21:35:55
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-04 11:32:42
 * @FilePath: \Vue3-ts-server\src\utils\checkToken.ts
 * @Description: token权限校验
 */

import routes from '../routes'
import { myError, DateFormat } from './commonUtils';
import { NO_AUTH_ERROR_CODE } from '../config/errorCode';
import { verifyToken, encode, getTokenInfo } from '../config/jwt';
import redis from '../redis';

const dateTime = DateFormat(new Date(), 'YYYY-MM-dd hh:mm:ss')

export default async (req: any, res: any, next: any) => {
    // 是否检测Token
    const isCheckToken = routes.some(item => !item.unCheckToken && req.path.includes(item.path))

    if (!isCheckToken) return next()

    const token = req.headers.token
    if (!token) return res.send(myError(NO_AUTH_ERROR_CODE, '缺少Token'))

    const { userId, userAccount } = getTokenInfo(token)
    // 检测这个token是否在黑名单
    const blacklistToken = token.split('.')[2]
    if (blacklistToken) {
        const blackValue = await redis.getValue(blacklistToken)
        if (blackValue === 'blacklist') return res.send(myError(NO_AUTH_ERROR_CODE, 'token已失效'))
    }

    // 验证token有效性
    try {
        await verifyToken(token)
        console.log(`[${dateTime}], req start path = ${req.path}, userId = ${userId}`)
        next()
    } catch (e: any) {
        const value = await redis.getValue(userId)
        if (!value) return res.send(myError(NO_AUTH_ERROR_CODE, e.name))

        if (e.name === 'TokenExpiredError' && value === token){
            // token过期后并且token与redis种存储的一致的时候下发一个全新的token
            const payload = { userId, userAccount }
            req.token = await encode(payload)
            return next()
        }
        res.send(myError(NO_AUTH_ERROR_CODE, e.name))
    }
}