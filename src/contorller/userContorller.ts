import requestData from '../mysql';
import {
    GetUserListFunc,
    AddUserFunc,
    UserInfoItem,
    EditUserFunc,
    DelUserFunc
} from './interface/UserInterface';
import { genRandomId, DateFormat } from '../utils/commonUtils';

export const getUserList: GetUserListFunc = async ({ offset = 0, limit = 20, createTime, role, status, username }) => {
    let conditionsStr = ''
    let conditionsValues: any[] = []
    if (role) {
        conditionsStr += ' and role = ?'
        conditionsValues = [...conditionsValues, role]
    }

    if (status) {
        conditionsStr += ' and status = ?'
        conditionsValues = [...conditionsValues, status]
    }

    if (username) {
        conditionsStr += ' and username like ?'
        conditionsValues = [...conditionsValues, `%${username}%`]
    }

    if (createTime) {
        conditionsStr += ' and createTime < ?'
        conditionsValues = [...conditionsValues, new Date(createTime)]
    }

    const [list, total] = await Promise.all([
        requestData({
            sql: `select * from user where isDelete = 0 ${conditionsStr} limit ?, ?`,
            values: [...conditionsValues, +offset, +limit]
        }),
        requestData({
            sql: `select count(id) from user where isDelete = 0 ${conditionsStr}`,
            values: conditionsValues
        })
    ])
    list.forEach((item: UserInfoItem) => {
        item.changeTime = DateFormat(new Date(item.changeTime), 'YYYY-MM-dd')
        item.createTime = DateFormat(new Date(item.createTime), 'YYYY-MM-dd')
    })
    return { list, total }
}

export const addUser: AddUserFunc = async (userInfo) => {
    userInfo.id = genRandomId()
    userInfo.status = +!!userInfo.status
    await requestData({
        sql: `insert into user set ?`,
        values: [userInfo]
    })
    return
}

export const editUser: EditUserFunc = async (updateInfo) => {
    const updateData = {
        username: updateInfo.username,
        role: updateInfo.role,
        sex: updateInfo.sex,
        idNumber: updateInfo.idNumber,
        email: updateInfo.email,
        status: updateInfo.status,
        age: updateInfo.age
    }
    await requestData({
        sql: 'update user set ? where id = ? and isDelete = 0',
        values: [updateData, updateInfo.id]
    })
    return
}

export const delUser: DelUserFunc = async (ids) => {
    await requestData({
        sql: 'update user set isDelete = 1 where id in (?)',
        values: [ids]
    })
    return
}