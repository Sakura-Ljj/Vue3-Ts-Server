"use strict";
/*
 * @Author: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2023-06-05 19:27:58
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-04 15:01:28
 * @FilePath: \Vue3-ts-server\src\utils\setRoute.ts
 * @Description: 全局路由配置
 */
Object.defineProperty(exports, "__esModule", { value: true });
const errorCode_1 = require("../config/errorCode");
const commonUtils_1 = require("../utils/commonUtils");
const jwt_1 = require("../config/jwt");
exports.default = (method, handlerFunc) => {
    const handle = async (req, res) => {
        const dateTime = (0, commonUtils_1.DateFormat)(new Date(), 'YYYY-MM-dd hh:mm:ss');
        // 过滤 IP
        const requestClientIp = getClientIp(req);
        if (!requestClientIp)
            throw (0, commonUtils_1.myError)(errorCode_1.NO_AUTH_ERROR_CODE, '无权限访问');
        // 暂时只有 GET 和 POST 请求先这样处理着
        let event;
        if (method === 'get') {
            event = req.query;
        }
        else {
            event = req.body;
        }
        let result;
        try {
            const startTime = new Date().getTime();
            let params;
            if (event.file) {
                const eventCopy = { ...event };
                eventCopy.file = undefined;
                params = JSON.stringify(eventCopy);
            }
            else {
                params = JSON.stringify(event);
            }
            console.log(`[${dateTime}], req start path = ${req.path}, clientIp = ${requestClientIp}, params = ${params}`);
            result = await handlerFunc(event, req, res);
            // 不需要封装相应结果的接口
            const filterPath = [];
            if (!filterPath.includes(req.path)) {
                // 封装相应结果
                result = {
                    code: 200,
                    msg: 'success',
                    data: result
                };
            }
            console.log(`[${dateTime}], req end path = ${req.path}, clientIp = ${requestClientIp}, params = ${params}, costTime = ${new Date().getTime() - startTime}`);
        }
        catch (e) {
            if (e.code) {
                result = {
                    code: e.code,
                    msg: e.msg,
                    data: null
                };
            }
            else {
                result = {
                    code: 500,
                    msg: 'service error',
                    data: null
                };
            }
            console.error(`[${dateTime}], req error path = ${req.path}, clientIp = ${requestClientIp}, params = ${JSON.stringify(event)}, errJSON = ${JSON.stringify(e)}, err = ${e}`);
        }
        if (req.token) {
            res.cookie('new_token', req.token, {
                httpOnly: true,
                maxAge: jwt_1.jwtExpireTime * 1000 // 一小时后过期
            });
        }
        res.send(result);
    };
    return handle;
};
function getClientIp(req) {
    if (!req)
        return '';
    return (req.headers['x-forwarded-for'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.connection?.socket?.remoteAddress ||
        req.id);
}
