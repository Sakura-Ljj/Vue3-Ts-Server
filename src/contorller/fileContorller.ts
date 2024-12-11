/*
 * @Author: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2024-12-02 11:20:30
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-10 15:12:00
 * @FilePath: \Vue3-ts-server\src\contorller\fileContorller.ts
 * @Description:
 */
import fs from 'fs';
export const uploadMarkdown = async (event: any): Promise<any> => {
    console.log(event, '--------');
}

export const getMarkdown = async (): Promise<string> => {
    const res = fs.readFileSync('E:/workspace/Vue3-ts-server/README.md', 'utf-8')
    return res
}