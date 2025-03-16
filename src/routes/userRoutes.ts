/*
 * @Author: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2024-12-24 15:18:49
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2025-03-06 18:11:36
 * @FilePath: \Vue3-Ts-Server\src\routes\userRoutes.ts
 * @Description:
 */
import { getUserList, addUser, editUser, delUser, getUserInfoByToken } from '../contorller/userContorller';

const routes: RouterParams.RouteParams[] = [
    {
        path: '/user/list',
        method: 'get',
        handler: getUserList,
        unCheckToken: true
    },
    {
        path: '/user/add',
        method: 'post',
        handler: addUser,
        unCheckToken: true
    },
    {
        path: '/user/edit',
        method: 'post',
        handler: editUser,
        unCheckToken: true
    },
    {
        path: '/user/del',
        method: 'post',
        handler: delUser,
        unCheckToken: true
    },
    {
        path: '/user/infoByToken',
        method: 'get',
        handler: getUserInfoByToken,
        unCheckToken: true
    }
]

export default routes