/*
 * @Author: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2023-07-19 15:12:25
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-04 14:51:19
 * @FilePath: \Vue3-ts-server\src\utils\commonUtils.ts
 * @Description: 常用公共方法
 */

import axios from 'axios';
import { getTokenInfo } from '../config/jwt';
import requestData from '../mysql';

/**
 * @description: 时间格式化方法
 * @param {*} newDate 传入时间
 * @param {*} format 格式：YYYY-MM-dd hh:mm:ss
 * @return {*}
 */
export const DateFormat = (Date: Date, format: string) => {
    const date: {[key: string]: number} = {
        'M+': Date.getMonth() + 1,
        'd+': Date.getDate(),
        'h+': Date.getHours(),
        'm+': Date.getMinutes(),
        's+': Date.getSeconds(),
        'q+': Math.floor((Date.getMonth() + 3) / 3),
        'S+': Date.getMilliseconds()
    }

    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (`${Date.getFullYear()}`).substr(4 - RegExp.$1.length))
    }
    for (const k in date) {
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(RegExp.$1, `${RegExp.$1.length === 1 ? date[k] : (`00${date[k]}`).substr((`${date[k]}`).length)}`)
        }
    }
    return format
}

/**
 * @description: 报错提示
 * @param {*} errCode 错误码
 * @param {*} errMessage 错误信息
 * @return {*}
 */
export const myError = (errCode: number, errMessage: string) => {
    return { code: errCode, msg: errMessage }
}

/**
 * @description: 机器人推送方法
 * @param {*} content 推送内容
 * @param {*} pushMobileList 推送人电话号码列表
 * @return {*}
 */
export const robotPushMsg = ({ content, pushMobileList }: {content: string, pushMobileList: string[]}) => {
    const options = {
        msgtype: 'text',
        text: {
            content,
            mentioned_list: [],
            mentioned_mobile_list: pushMobileList
        }
    }
    const webhook = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=0ee28cb2-672f-46cb-b126-ecc8d9e3a45b'
    axios.post(webhook, options)
}

/**
 * @description: 生成随机ID方法
 * @return {*}
 */
export const genRandomId = () => {
    const time = new Date().getTime()
    const randomNum = Math.floor(Math.random() * 90) + 10
    return `${time}${randomNum}`
}

/**
 * @description: 添加日志方法
 * @param {*} log 日志内容
 * @param {*} token 传入token
 * @return {*}
 */
export const addLog = (log: string, token: string) => {
    const { userId } = getTokenInfo(token)
    const insertData = {
        id: genRandomId(),
        log,
        creator: userId
    }

    return requestData({
        sql: 'insert into ddpa_log set ?',
        values: [insertData]
    })
}

