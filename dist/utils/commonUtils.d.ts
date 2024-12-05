/**
 * @description: 时间格式化方法
 * @param {*} newDate 传入时间
 * @param {*} format 格式：YYYY-MM-dd hh:mm:ss
 * @return {*}
 */
export declare const DateFormat: (Date: Date, format: string) => string;
/**
 * @description: 报错提示
 * @param {*} errCode 错误码
 * @param {*} errMessage 错误信息
 * @return {*}
 */
export declare const myError: (errCode: number, errMessage: string) => {
    code: number;
    msg: string;
};
/**
 * @description: 机器人推送方法
 * @param {*} content 推送内容
 * @param {*} pushMobileList 推送人电话号码列表
 * @return {*}
 */
export declare const robotPushMsg: ({ content, pushMobileList }: {
    content: string;
    pushMobileList: string[];
}) => void;
/**
 * @description: 生成随机ID方法
 * @return {*}
 */
export declare const genRandomId: () => string;
/**
 * @description: 添加日志方法
 * @param {*} log 日志内容
 * @param {*} token 传入token
 * @return {*}
 */
export declare const addLog: (log: string, token: string) => Promise<any>;
