// 系统包
const fs = require('fs');
const path = require('path');
const readFileSync = fs.readFileSync;
const writeFileSync = fs.writeFileSync;

// 第三方包
const program = require('commander');

// babel
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

module.exports = (options) => {
    // // 项目名称
    // const action = program.args[0];
    //
    // // 配置文件地址
    // const appConfigPath = path.join(process.cwd(), '/src/core/configs/app.config.ts');
    //
    // // 是否打开 pyramid ui
    // const openPyramidUi = options.openPyramidUi;
    //
    // if (action === 'set') {
    //     // 解析
    //     const ast = parser.parse(readFileSync(appConfigPath, 'utf-8'), {
    //         sourceType: 'module',
    //         plugins: ['typescript'],
    //     });
    //
    //     // 遍历
    //     traverse(ast, {
    //         ObjectExpression({ node }) {
    //             const { properties } = node;
    //             properties.forEach(p => {
    //                 const { key, value } = p;
    //                 if (key.name === 'OPEN_PYRAMID_UI') {
    //                     if (openPyramidUi !== undefined) {
    //                         value.value = openPyramidUi === 'true';
    //                     }
    //                 }
    //             });
    //         }
    //     });
    //
    //     // 生成
    //     const newCode = generate(ast, {}).code;
    //     // 写入文件
    //     writeFileSync(appConfigPath, newCode, 'utf-8');
    // }
};
