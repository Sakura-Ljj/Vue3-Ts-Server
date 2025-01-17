export interface LoginParams {
    account: string
    password: string
}

export type LoginFunc = (params: LoginParams) => Promise<string>

export type RegisterFunc = (params: LoginParams) => Promise<void>