"use strict";
/*
 * @Author: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2023-06-09 17:16:07
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-02 11:43:17
 * @FilePath: \Vue3-ts-server\routes\index.js
 * @Description: 所有路由配置集合
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileRoutes_1 = __importDefault(require("./fileRoutes"));
exports.default = [...fileRoutes_1.default];
