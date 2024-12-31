/*
 * @Author: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2024-12-24 15:18:49
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-27 17:13:13
 * @FilePath: \Vue3-ts-server\src\routes\userRoutes.ts
 * @Description:
 */
import { getUserList, addUser, editUser, delUser } from '../contorller/userContorller';

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
    }
]

export default routes