import { getAuthMenuList } from '../contorller/authContorller';

const authRoutes: RouterParams.RouteParams[] = [
    {
        path: '/auth/getMenuList',
        method: 'get',
        handler: getAuthMenuList,
        unCheckToken: true
    }
]

export default authRoutes