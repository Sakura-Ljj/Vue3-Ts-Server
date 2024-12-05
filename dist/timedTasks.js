"use strict";
/*
 * @Author: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2024-01-26 17:21:47
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-04 16:47:45
 * @FilePath: \Vue3-ts-server\src\timedTasks.ts
 * @Description: 服务器定时器任务
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// *  *  *  *  *  *
// ┬  ┬  ┬  ┬  ┬  ┬
// │  │  │  │  │  |
// │  │  │  │  │  └ 星期几，取值：0 - 7，其中 0 和 7 都表示是周日
// │  │  │  │  └─── 月份，取值：1 - 12
// │  │  │  └────── 日期，取值：1 - 31
// │  │  └───────── 时，取值：0 - 23
// │  └──────────── 分，取值：0 - 59
// └─────────────── 秒，取值：0 - 59（可选）
const node_schedule_1 = __importDefault(require("node-schedule"));
const commonUtils_1 = require("./utils/commonUtils");
const errorCode_1 = require("./config/errorCode");
// import axios from 'axios';
const crypto_1 = require("./utils/crypto");
const CAN_EXEC_TIMED_TASK_IP = '1.12.232.36';
function startTimedTasks(SERVER_HOSTNAME, SERVER_PORT) {
    const host = `${SERVER_HOSTNAME}:${SERVER_PORT}`;
    console.log(`######## timedTask host ${host}`);
    // // 每天检测库存数是否小于阈值数 提醒老板补充库存
    // schedule.scheduleJob('0 03 11 * * *', () => {
    //     axios.get(`http://${host}/api/storeroom/check`).catch(e => {
    //         console.log(JSON.stringify(e));
    //     })
    // })
    // // 每天检测倒计时即将到期的订单 提醒订单当前对应负责人
    // schedule.scheduleJob('0 03 11 * * *', () => {
    //     axios.get(`http://${host}/api/order/soonExpire`).catch(e => {
    //         console.log(JSON.stringify(e));
    //     })
    // })
    // // 每天检测已经到期的订单, 置为异常中
    // schedule.scheduleJob('0 03 11 * * *', () => {
    //     axios.get(`http://${host}/api/order/expired`).catch(e => {
    //         console.log(JSON.stringify(e));
    //     })
    // })
    // 每月一号更新一次RSA密钥
    node_schedule_1.default.scheduleJob('0 0 0 1 * *', () => {
        (0, crypto_1.generateRSAKey)();
    });
}
function checkIP(SERVER_HOSTNAME) {
    if (!SERVER_HOSTNAME.includes(CAN_EXEC_TIMED_TASK_IP))
        throw (0, commonUtils_1.myError)(errorCode_1.NO_AUTH_ERROR_CODE, '没权限执行');
}
exports.default = {
    start: startTimedTasks,
    checkIP
};
