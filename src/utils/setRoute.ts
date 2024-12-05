/*
 * @Author: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2023-06-05 19:27:58
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-04 15:01:28
 * @FilePath: \Vue3-ts-server\src\utils\setRoute.ts
 * @Description: 全局路由配置
 */

import { NO_AUTH_ERROR_CODE } from '../config/errorCode'
import { myError, DateFormat } from '../utils/commonUtils';
import { jwtExpireTime } from '../config/jwt';

export default (method: string, handlerFunc: RouterParams.ControllerHandler) => {
    const handle = async (req: any, res: any) => {
        const dateTime = DateFormat(new Date(), 'YYYY-MM-dd hh:mm:ss')

        // 过滤 IP
        const requestClientIp = getClientIp(req)
        if (!requestClientIp) throw myError(NO_AUTH_ERROR_CODE, '无权限访问')

        // 暂时只有 GET 和 POST 请求先这样处理着
        let event
        if (method === 'get') {
            event = req.query
        } else {
            event = req.body
        }

        let result
        try {
            const startTime = new Date().getTime()
            let params
            if (event.file) {
                const eventCopy = { ...event }
                eventCopy.file = undefined
                params = JSON.stringify(eventCopy)
            } else {
                params = JSON.stringify(event)
            }
            console.log(`[${dateTime}], req start path = ${req.path}, clientIp = ${requestClientIp}, params = ${params}`)

            result = await handlerFunc(event, req, res)

            // 不需要封装相应结果的接口
            const filterPath: string[] = []

            if (!filterPath.includes(req.path)) {
                // 封装相应结果
                result = {
                    code: 200,
                    msg: 'success',
                    data: result
                }
            }
            console.log(`[${dateTime}], req end path = ${req.path}, clientIp = ${requestClientIp}, params = ${params}, costTime = ${new Date().getTime() - startTime}`)
        } catch (e: any) {
            if (e.code) {
                result = {
                    code: e.code,
                    msg: e.msg,
                    data: null
                }
            } else {
                result = {
                    code: 500,
                    msg: 'service error',
                    data: null
                }
            }
            console.error(`[${dateTime}], req error path = ${req.path}, clientIp = ${requestClientIp}, params = ${JSON.stringify(event)}, errJSON = ${JSON.stringify(e)}, err = ${e}`)
        }

        if (req.token) {
            res.cookie('new_token', req.token, {
                httpOnly: true,
                maxAge: jwtExpireTime * 1000 // 一小时后过期
            })
        }

        res.send(result)
    }
    return handle
}

function getClientIp(req: any) {
    if (!req) return ''

    return (
        req.headers['x-forwarded-for'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress ||
    req.id
    )
}