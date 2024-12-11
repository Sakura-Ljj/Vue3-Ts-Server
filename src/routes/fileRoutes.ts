/*
 * @Author: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2024-12-02 11:34:44
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-05 10:54:20
 * @FilePath: \Vue3-ts-server\src\routes\fileRoutes.ts
 * @Description:
 */
import { uploadMarkdown, getMarkdown } from '../contorller/fileContorller';
const routes: RouterParams.RouteParams[] = [
    {
        path: '/file/uploadMarkdown',
        method: 'get',
        handler: uploadMarkdown,
        unCheckToken: true
    },
    {
        path: '/file/getMarkdown',
        method: 'get',
        handler: getMarkdown,
        unCheckToken: true
    }
]

export default routes