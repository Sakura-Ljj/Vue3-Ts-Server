/*
 * @Author: TENCENT\v_jnnjieluo v_jnnjieluo@tencent.com
 * @Date: 2024-01-15 16:27:45
 * @LastEditors: V_JNNJIELU-PCGP\v_jnnjieluo v_jnnjieluo@tencent.com
 * @LastEditTime: 2024-12-03 14:29:29
 * @FilePath: \Vue3-ts-server\.eslintrc.js
 * @Description:
 */
module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true
    },
    parser: '@typescript-eslint/parser',
    // 一个配置文件可以被基础配置中的已启用的规则继承
    // extends: 'eslint:recommended', // 继承推荐的规则
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'], // 继承推荐的规则
    // 为特定类型的文件指定处理器
    overrides: [],
    // 指定你想要支持的 语言选项
    parserOptions: {
        ecmaVersion: 'latest' // ecma 最新
    },
    rules: {
    // 0:off 关闭规则,1:warn 开启规则，展示警告,2:error 开启规则 展示错误，触发程序退出
        'no-unused-vars': 0, // 未使用的变量报错，关闭
        'no-debugger': 'off',
        'no-console': 'off',
        'no-trailing-spaces': 'error',
        indent: [2] /* 内部缩进2个空格，属性间隔开1个空格，自动对其属性缩进 */,
        'array-bracket-spacing': [2, 'never'], // 数据中不能存在空格
        'comma-dangle': [2, 'never'], // 禁止末尾逗号
        'key-spacing': 2, // 对象键值对前后的空格
        'block-spacing': 2,
        'keyword-spacing': 2, // 关键字周围的空格
        'no-multi-spaces': 2, // 禁止多余的空格
        'arrow-spacing': 2, // 箭头函数的空格
        'space-infix-ops': 2, // 操作符左右的空格
        'space-unary-ops': [2, { words: true, nonwords: false }], // 一元操作符的空格
        'spaced-comment': [2, 'always'], // 注释语句前的空格
        'template-tag-spacing': [2, 'always'], // 模板标记和它们的字面量之间有空格
        'object-curly-spacing': [2, 'always'], // 强制在花括号中使用一致的空格
        'no-whitespace-before-property': 2, // 禁止属性前有空白
        'comma-spacing': 2,

        // typeScript (https://typescript-eslint.io/rules)
        '@typescript-eslint/no-unused-vars': 'error', // 禁止定义未使用的变量
        '@typescript-eslint/prefer-ts-expect-error': 'error', // 禁止使用 @ts-ignore
        '@typescript-eslint/no-inferrable-types': 'off', // 可以轻松推断的显式类型可能会增加不必要的冗长
        '@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间。
        '@typescript-eslint/no-explicit-any': 'off', // 禁止使用 any 类型
        '@typescript-eslint/ban-types': 'off', // 禁止使用特定类型
        '@typescript-eslint/explicit-function-return-type': 'off', // 不允许对初始化为数字、字符串或布尔值的变量或参数进行显式类型声明
        '@typescript-eslint/no-var-requires': 'off', // 不允许在 import 语句中使用 require 语句
        '@typescript-eslint/no-empty-function': 'off', // 禁止空函数
        '@typescript-eslint/no-use-before-define': 'off', // 禁止在变量定义之前使用它们
        '@typescript-eslint/ban-ts-comment': 'off', // 禁止 @ts-<directive> 使用注释或要求在指令后进行描述
        '@typescript-eslint/no-non-null-assertion': 'off', // 不允许使用后缀运算符的非空断言(!)
        '@typescript-eslint/explicit-module-boundary-types': 'off' // 要求导出函数和类的公共类方法的显式返回和参数类型
    }
}
