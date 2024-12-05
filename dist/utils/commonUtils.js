"use strict";
/*
 * @Author: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2023-07-19 15:12:25
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-04 14:51:19
 * @FilePath: \Vue3-ts-server\src\utils\commonUtils.ts
 * @Description: 常用公共方法
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLog = exports.genRandomId = exports.robotPushMsg = exports.myError = exports.DateFormat = void 0;
const axios_1 = __importDefault(require("axios"));
const jwt_1 = require("../config/jwt");
const mysql_1 = __importDefault(require("../mysql"));
/**
 * @description: 时间格式化方法
 * @param {*} newDate 传入时间
 * @param {*} format 格式：YYYY-MM-dd hh:mm:ss
 * @return {*}
 */
const DateFormat = (Date, format) => {
    const date = {
        'M+': Date.getMonth() + 1,
        'd+': Date.getDate(),
        'h+': Date.getHours(),
        'm+': Date.getMinutes(),
        's+': Date.getSeconds(),
        'q+': Math.floor((Date.getMonth() + 3) / 3),
        'S+': Date.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (`${Date.getFullYear()}`).substr(4 - RegExp.$1.length));
    }
    for (const k in date) {
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(RegExp.$1, `${RegExp.$1.length === 1 ? date[k] : (`00${date[k]}`).substr((`${date[k]}`).length)}`);
        }
    }
    return format;
};
exports.DateFormat = DateFormat;
/**
 * @description: 报错提示
 * @param {*} errCode 错误码
 * @param {*} errMessage 错误信息
 * @return {*}
 */
const myError = (errCode, errMessage) => {
    return { code: errCode, msg: errMessage };
};
exports.myError = myError;
/**
 * @description: 机器人推送方法
 * @param {*} content 推送内容
 * @param {*} pushMobileList 推送人电话号码列表
 * @return {*}
 */
const robotPushMsg = ({ content, pushMobileList }) => {
    const options = {
        msgtype: 'text',
        text: {
            content,
            mentioned_list: [],
            mentioned_mobile_list: pushMobileList
        }
    };
    const webhook = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=0ee28cb2-672f-46cb-b126-ecc8d9e3a45b';
    axios_1.default.post(webhook, options);
};
exports.robotPushMsg = robotPushMsg;
/**
 * @description: 生成随机ID方法
 * @return {*}
 */
const genRandomId = () => {
    const time = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 90) + 10;
    return `${time}${randomNum}`;
};
exports.genRandomId = genRandomId;
/**
 * @description: 添加日志方法
 * @param {*} log 日志内容
 * @param {*} token 传入token
 * @return {*}
 */
const addLog = (log, token) => {
    const { userId } = (0, jwt_1.getTokenInfo)(token);
    const insertData = {
        id: (0, exports.genRandomId)(),
        log,
        creator: userId
    };
    return (0, mysql_1.default)({
        sql: 'insert into ddpa_log set ?',
        values: [insertData]
    });
};
exports.addLog = addLog;
