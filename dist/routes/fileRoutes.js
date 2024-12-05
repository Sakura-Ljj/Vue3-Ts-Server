"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2024-12-02 11:34:44
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-05 10:54:20
 * @FilePath: \Vue3-ts-server\src\routes\fileRoutes.ts
 * @Description:
 */
const fileContorller_1 = require("../contorller/fileContorller");
const routes = [
    {
        path: '/file/uploadMarkdown',
        method: 'get',
        handler: fileContorller_1.uploadMarkdown,
        unCheckToken: true
    }
];
exports.default = routes;
