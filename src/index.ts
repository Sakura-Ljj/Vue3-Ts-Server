/*
 * @Author: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2023-03-14 15:51:53
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-09 17:48:17
 * @FilePath: \Vue3-ts-server\src\index.ts
 * @Description: node 服务配置
 */
import express from 'express'
import bodyParser from 'body-parser'
import https from 'https'
import http from 'http'
import setRoute from './utils/setRoute'
import routes from './routes'
import checkToken from './utils/checkToken'
import { DateFormat } from './utils/commonUtils'
import fs from 'fs'
import timedTasks from './timedTasks';

const contextPath = '/api'
const requestLimit = '10240kb'
const port = process.env.NODE_ENV === 'development' ? 3000 : 12138
const baseURL = process.env.NODE_ENV === 'development' ? 'localhost' : '1.12.232.36'
const host = `${baseURL}:${port + contextPath}`
const dateTime = DateFormat(new Date(), 'YYYY-MM-dd hh:mm:ss')

timedTasks.start(baseURL, port)

const app = express()

// 处理 POST 请求的请求体
app.use(bodyParser.urlencoded({ extended: false, limit: requestLimit }))
app.use(bodyParser.json({ limit: requestLimit }))

app.set('x-powered-by', false)
app.all('*', (req: any, res: any, next: any) => {
    // 开启跨域
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    const origin = req.get('Origin')
    if (origin) res.setHeader('Access-Control-Allow-Origin', origin)

    // 允许跨域请求的方法
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT')

    // 允许跨域请求 header 携带的东西
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since, token')
    next()
})

app.all('/api/*', checkToken)

// 设置路由
routes.forEach(route => {
    app[route.method](contextPath + route.path, setRoute(route.method, route.handler))
})

let service
if (process.env.NODE_ENV === 'development') {
    service = http.createServer(app)
} else {
    // ssl配置
    const options = {
        key: fs.readFileSync('/usr/local/nginx/sora.host_ssl/sora.host.key'),
        cert: fs.readFileSync('/usr/local/nginx/sora.host_ssl/sora.host_bundle.crt')
    }
    service = https.createServer(options, app)
}

service.listen(port, () => {
    console.log(`[${dateTime}] service start at ${host}, env = ${process.env.NODE_ENV}`)
})
