"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authContorller_1 = require("../contorller/authContorller");
const authRoutes = [
    {
        path: 'auth/getMenuList',
        method: 'get',
        handler: authContorller_1.getAuthMenuList,
        unCheckToken: true
    }
];
exports.default = authRoutes;
