/*
 * @Author: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2024-12-25 15:15:45
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-31 10:21:17
 * @FilePath: \Vue3-ts-server\src\contorller\interface\UserInterface.ts
 * @Description:
 */

interface AddUserParams {
  id?: string
  username: string
  role: string
  sex: number
  idNumber?: string
  email?: string
  status?: number | boolean
  age?: number
}

interface EditUserParams {
  id: string
  username?: string
  role?: string
  sex?: number
  idNumber?: string
  email?: string
  status?: boolean
  age?: number
}

export interface UserInfoItem {
  id: string
  username: string
  role: string
  sex: number
  idNumber: string
  email: string
  status: number
  age: number
  changeTime: string
  createTime: string
}

interface SearchUserListParams {
    offset?: number
    limit?: number
    username?: string
    role?: string
    status?: number
    createTime?: string
}

export type GetUserListFunc = (searchParams: SearchUserListParams) => Promise<{list: UserInfoItem[], total: number}>

export type AddUserFunc = (userInfo: AddUserParams) => Promise<void>

export type EditUserFunc = (updateInfo: EditUserParams) => Promise<void>

export type DelUserFunc = (ids: string[]) => Promise<void>