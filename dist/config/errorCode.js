"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYSTEM_ERROR_CODE = exports.FORBIDDEN_ERROR_CODE = exports.NO_AUTH_ERROR_CODE = exports.REQUEST_PARAMS_ERROR_CODE = void 0;
/*
 * @Author: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2023-06-09 16:58:03
 * @LastEditors: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2023-06-09 17:06:42
 * @FilePath: \vue3project\server\config\errorCode.js
 * @Description: 错误状态处理
 */
// 请求参数错误
exports.REQUEST_PARAMS_ERROR_CODE = 400;
// 无权限访问
exports.NO_AUTH_ERROR_CODE = 401;
// 访问被禁止
exports.FORBIDDEN_ERROR_CODE = 403;
// 服务器错误
exports.SYSTEM_ERROR_CODE = 500;
