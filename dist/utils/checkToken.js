"use strict";
/*
 * @Author: DESKTOP-H44236O\Sora 1430008132@qq.com
 * @Date: 2024-01-16 21:35:55
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-04 11:32:42
 * @FilePath: \Vue3-ts-server\src\utils\checkToken.ts
 * @Description: token权限校验
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("../routes"));
const commonUtils_1 = require("./commonUtils");
const errorCode_1 = require("../config/errorCode");
const jwt_1 = require("../config/jwt");
const redis_1 = require("../redis");
const dateTime = (0, commonUtils_1.DateFormat)(new Date(), 'YYYY-MM-dd hh:mm:ss');
exports.default = async (req, res, next) => {
    // 是否检测Token
    const isCheckToken = routes_1.default.some(item => !item.unCheckToken && req.path.includes(item.path));
    if (!isCheckToken)
        return next();
    const token = req.headers.token;
    if (!token)
        return res.send((0, commonUtils_1.myError)(errorCode_1.NO_AUTH_ERROR_CODE, '缺少Token'));
    const { userId, userAccount } = (0, jwt_1.getTokenInfo)(token);
    // 检测这个token是否在黑名单
    const blacklistToken = token.split('.')[2];
    if (blacklistToken) {
        const blackValue = await (0, redis_1.getValue)(blacklistToken);
        if (blackValue === 'blacklist')
            return res.send((0, commonUtils_1.myError)(errorCode_1.NO_AUTH_ERROR_CODE, 'token已失效'));
    }
    // 验证token有效性
    try {
        await (0, jwt_1.verifyToken)(token);
        console.log(`[${dateTime}], req start path = ${req.path}, userId = ${userId}`);
        next();
    }
    catch (e) {
        const value = await (0, redis_1.getValue)(userId);
        if (!value)
            return res.send((0, commonUtils_1.myError)(errorCode_1.NO_AUTH_ERROR_CODE, e.name));
        if (e.name === 'TokenExpiredError' && value === token) {
            // token过期后并且token与redis种存储的一致的时候下发一个全新的token
            const payload = { userId, userAccount };
            req.token = await (0, jwt_1.encode)(payload);
            return next();
        }
        res.send((0, commonUtils_1.myError)(errorCode_1.NO_AUTH_ERROR_CODE, e.name));
    }
};
