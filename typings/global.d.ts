/*
 * @Author: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2024-12-03 11:45:31
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-04 16:24:44
 * @FilePath: \Vue3-ts-server\typings\global.d.ts
 * @Description:
 */
declare namespace RouterParams {
  type ControllerHandler = (event: any, req: any, res: any) => Promise<any>

  interface RouteParams {
    path: string,
    method: 'get' | 'post',
    unCheckToken: boolean,
    handler: ControllerHandler
  }
}