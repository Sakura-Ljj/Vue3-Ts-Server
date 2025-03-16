import { getAuthMenuList, loginServer, registerServer, logoutServer } from '../contorller/authContorller';

const authRoutes: RouterParams.RouteParams[] = [
    {
        path: '/auth/getMenuList',
        method: 'get',
        handler: getAuthMenuList
    },
    {
        path: '/auth/login',
        method: 'get',
        handler: loginServer,
        unCheckToken: true
    },
    {
        path: '/auth/register',
        method: 'get',
        handler: registerServer,
        unCheckToken: true
    },
    {
        path: '/auth/logout',
        method: 'get',
        handler: logoutServer,
        unCheckToken: true
    }
]

export default authRoutes