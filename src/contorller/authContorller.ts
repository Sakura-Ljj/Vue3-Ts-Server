import { LoginFunc, RegisterFunc } from './interface/AuthInterface';
import { encode } from '../config/jwt';
import { pbkdf2Encrypt, pbkdf2Decrypt } from '../utils/crypto';
import requestData from '../mysql';
import { genRandomId, myError } from '../utils/commonUtils';
import { REQUEST_PARAMS_ERROR_CODE } from '../config/errorCode';

export const getAuthMenuList = async () => {
    return [
        {
            path: '/home/index',
            name: 'home',
            component: '/home/index',
            meta: {
                isKeepAlive: false,
                isHide: false,
                title: '主页',
                icon: 'HomeFilled'
            }
        },
        {
            path: '/role',
            name: 'role',
            redirect: '/role/userRole',
            meta: {
                isKeepAlive: false,
                isHide: false,
                title: '权限管理',
                icon: 'Lock'
            },
            children: [
                {
                    path: '/role/userRole',
                    name: 'userRole',
                    component: '/role/userRole/index',
                    meta: {
                        isKeepAlive: false,
                        isHide: false,
                        title: '表格组件演示',
                        icon: 'User'
                    }
                },
                {
                    path: '/role/btnRole',
                    name: 'btnRole',
                    component: '/role/btnRole/index',
                    meta: {
                        isKeepAlive: false,
                        isHide: false,
                        title: '按钮权限',
                        icon: 'Open'
                    }
                }
            ]
        },
        {
            path: '/dataAnalysis/index',
            name: 'dataAnalysis',
            component: '/dataAnalysis/index',
            meta: {
                isKeepAlive: false,
                isHide: false,
                title: 'Echart图标演示',
                icon: 'Histogram'
            }
        },
        {
            path: '/approval',
            name: 'approval',
            component: '/approval/index',
            redirect: '/approval/order',
            meta: {
                isKeepAlive: false,
                isHide: false,
                title: '审批列表',
                icon: 'List'
            },
            children: [
                {
                    path: '/approval/order',
                    name: 'orderList',
                    component: '/approval/order/index',
                    meta: {
                        isKeepAlive: false,
                        isHide: false,
                        title: '订单审批',
                        icon: 'Checked'
                    },
                    children: [
                        {
                            path: '/approval/order/detail:id',
                            name: 'orderDetail',
                            component: '/approval/order/detail',
                            meta: {
                                isKeepAlive: false,
                                isHide: true,
                                title: '订单详情'
                            }
                        }
                    ]
                },
                {
                    path: '/approval/account/list',
                    name: 'accountList',
                    component: '/approval/account/accountList/index',
                    meta: {
                        isKeepAlive: false,
                        isHide: false,
                        title: '账号创建申请列表',
                        icon: 'Avatar'
                    },
                    children: [
                        {
                            path: '/approval/account/add',
                            name: 'accountAdd',
                            component: '/approval/account/accountAdd/index',
                            meta: {
                                isKeepAlive: false,
                                isHide: true,
                                title: '分步任务表单演示',
                                icon: 'Avatar'
                            }
                        }
                    ]
                }
            ]
        },
        {
            path: '/message/index',
            name: 'message',
            component: '/message/index',
            meta: {
                isKeepAlive: false,
                isHide: false,
                title: '消息',
                icon: 'Message'
            }
        },
        {
            path: '/about/index',
            name: 'about',
            component: '/about/index',
            meta: {
                isKeepAlive: false,
                isHide: false,
                title: '关于项目',
                icon: 'Reading'
            }
        }
    ]
}

export const registerServer: RegisterFunc = async ({ password, account }) => {
    if (!password || !account) throw myError(REQUEST_PARAMS_ERROR_CODE, '参数有误')
    const [accountInfo] = await requestData({
        sql: 'select userid from account where account = ?',
        values: [account]
    })
    if (accountInfo) throw myError(REQUEST_PARAMS_ERROR_CODE, '账号已存在')
    const { result, salt } = pbkdf2Encrypt(password)
    const userid = genRandomId()
    const insertData = {
        userid,
        account,
        password: result,
        salt
    }
    await requestData({
        sql: 'insert into account set ?',
        values: [insertData]
    })
    return
}

export const loginServer: LoginFunc = async ({ password, account }) => {
    if (!password || !account) throw myError(REQUEST_PARAMS_ERROR_CODE, '参数有误')
    const [accountInfo] = await requestData({
        sql: 'select password, salt, userid from account where account = ?',
        values: [account]
    })
    if (!accountInfo) throw myError(REQUEST_PARAMS_ERROR_CODE, '账号不存在')
    const verifyPassword = pbkdf2Decrypt(password, accountInfo.salt)
    if (accountInfo.password !== verifyPassword) throw myError(REQUEST_PARAMS_ERROR_CODE, '密码错误')

    // 下发token
    const playload = {
        userid: accountInfo.userid,
        account: accountInfo.account
    }
    return encode(playload)
}