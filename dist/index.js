"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2023-03-14 15:51:53
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-04 17:39:01
 * @FilePath: \Vue3-ts-server\src\index.ts
 * @Description: node 服务配置
 */
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const setRoute_1 = __importDefault(require("./utils/setRoute"));
const routes_1 = __importDefault(require("./routes"));
const checkToken_1 = __importDefault(require("./utils/checkToken"));
const commonUtils_1 = require("./utils/commonUtils");
const fs_1 = __importDefault(require("fs"));
const timedTasks_1 = __importDefault(require("./timedTasks"));
const contextPath = '/api';
const requestLimit = '10240kb';
const port = process.env.NODE_ENV === 'development' ? 3000 : 12138;
const baseURL = process.env.NODE_ENV === 'development' ? 'localhost' : '1.12.232.36';
const host = `${baseURL}:${port + contextPath}`;
const dateTime = (0, commonUtils_1.DateFormat)(new Date(), 'YYYY-MM-dd hh:mm:ss');
timedTasks_1.default.start(baseURL, port);
const app = (0, express_1.default)();
// 处理 POST 请求的请求体
app.use(body_parser_1.default.urlencoded({ extended: false, limit: requestLimit }));
app.use(body_parser_1.default.json({ limit: requestLimit }));
app.set('x-powered-by', false);
app.all('*', (req, res, next) => {
    // 开启跨域
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    const origin = req.get('Origin');
    if (origin)
        res.setHeader('Access-Control-Allow-Origin', origin);
    // 允许跨域请求的方法
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
    // 允许跨域请求 header 携带的东西
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since, token');
    next();
});
app.all('/api/*', checkToken_1.default);
// 设置路由
routes_1.default.forEach(route => {
    app[route.method](contextPath + route.path, (0, setRoute_1.default)(route.method, route.handler));
});
let service;
if (process.env.NODE_ENV === 'development') {
    service = http_1.default.createServer(app);
}
else {
    // ssl配置
    const options = {
        key: fs_1.default.readFileSync('/usr/local/nginx/sora.host_ssl/sora.host.key'),
        cert: fs_1.default.readFileSync('/usr/local/nginx/sora.host_ssl/sora.host_bundle.crt')
    };
    service = https_1.default.createServer(options, app);
}
service.listen(port, () => {
    console.log(`[${dateTime}] service start at ${host}, env = ${process.env.NODE_ENV}`);
});
