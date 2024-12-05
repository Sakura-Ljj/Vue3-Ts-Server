import jwt from 'jsonwebtoken';
export declare const jwtExpireTime = 3600;
/**
 * @description: 下发token
 * @param {*} payload 载体
 * @return {*}
 */
export declare const encode: (payload: {
    [key: string]: any;
}) => Promise<string>;
/**
 * @description: 验证token
 * @param {*} token
 * @return {*}
 */
export declare const verifyToken: (token: string) => Promise<string | jwt.JwtPayload>;
/**
 * @description: 获取token剩余时间
 * @param {*} token
 * @return {*}
 */
export declare const getTokenExpireTime: (token: string) => number;
/**
 * @description: 获取token中存储的信息
 * @param {*} token
 * @return {*}
 */
export declare const getTokenInfo: (token: string) => any;
