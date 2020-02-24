// 系统包
const fs = require('fs');
const path = require('path');

const program = require('commander');
const chalk = require('chalk');
const symbols = require('log-symbols');

const readFileSync = fs.readFileSync;
const writeFileSync = fs.writeFileSync;

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const prettier = require('prettier');

const resultCode = require('../../config/result-code');

module.exports = (options) => {
    const action = program.args[1];

    const currentPath = process.cwd();
    const configPath = path.join(currentPath, 'config', 'config.ts');

    const pathExists = fs.existsSync(configPath);
    if (!pathExists) {
        console.log(symbols.error, chalk.red('路径不存在'));
        process.exit();
    }

    // F:\pyramid-collection\pyramid-pro\config\config.ts
    // G:\gcongo-mobile-dev\templet\config\config.ts
    const ast = parser.parse(readFileSync(configPath, 'utf-8'), {
        sourceType: 'module',
        plugins: ['typescript'],
    });

    if (action === 'getPathTree') {// 获取 path 树
        // 还原真实的对象
        const pathTree = [];
        let level = 1;

        traverse(ast, {
            ObjectExpression({ node, parent }) {
                if (t.isArrayExpression(parent)) {
                    return;
                }

                const { properties } = node;

                properties.forEach(p => {
                    const { key, value } = p;

                    if (t.isObjectProperty(p) && t.isIdentifier(key) && key.name === 'routes') {
                        // 递归遍历
                        const recursionFn = (routes, pathTree, level) => {
                            const { elements } = routes;

                            // 遍历属性
                            elements.forEach(element => {
                                const routeProperties = element.properties;

                                let canAdd = true;
                                const routeObj = {};

                                routeProperties.forEach((rp) => {
                                    const rkey = rp.key;
                                    const rvalue = rp.value;

                                    if (rkey.name === 'path') {// TODO 保证 path 在 routes 上面
                                        routeObj.path = rvalue.value;
                                        routeObj.level = level;
                                    }

                                    if (rkey.name === 'redirect') {
                                        canAdd = false;
                                    }
                                    if (rkey.name === 'hideInMenu') {
                                        canAdd = false;
                                    }

                                    if (rkey.name === 'routes') {// 子节点
                                        routeObj.children = [];
                                        // 保存原始的元素
                                        routeObj.original = rvalue;
                                    }
                                });

                                // 属性遍历完了，在遍历
                                if (routeObj.children) {
                                    recursionFn(routeObj.original, routeObj.children, level + 1);
                                }

                                delete routeObj.original;
                                if (canAdd && routeObj.path) {
                                    pathTree.push(routeObj);
                                }
                            });
                        };

                        recursionFn(value, pathTree, level);
                    }
                });
            }
        });

        console.log('routes:', JSON.stringify(pathTree));
        process.exit();
    } else if (action === 'addRouteLayout') {// 增加路由布局结构


        const {addRouteLayoutLevel, addRouteLayoutPath, addRouteLayoutName, addRouteLayoutIcon, addRouteLayoutComponent, addRouteLayoutParentPath, addRouteLayoutFilePath } = options;

        // 创建目录
        // if (!addRouteLayoutFilePath) {
        //     process.exit(resultCode.MISSING_PARAMS.code);
        // }
        //
        // const trueFilePath = path.join(currentPath, 'src/pages/' + addRouteLayoutFilePath);
        // console.log(trueFilePath);
        // // 判断是否存在该路径
        // if (fs.existsSync(trueFilePath)) {
        //     process.exit(resultCode.EXISTS_SAME_DIR.code);
        // }
        // fs.mkdirSync(trueFilePath);

        // 新增路由
        // if (!addRouteLayoutPath) {
        //     process.exit(resultCode.MISSING_PARAMS.code);
        // }
        //
        // if (addRouteLayoutLevel > 1 && !addRouteLayoutParentPath) {
        //     process.exit(resultCode.MISSING_PARAMS.code);
        // }
        //
        // let level = 1;
        //
        // traverse(ast, {
        //     ObjectExpression({node, parent}) {
        //         if (t.isArrayExpression(parent)) {
        //             return;
        //         }
        //
        //         const { properties } = node;
        //
        //         properties.forEach(p => {
        //             const {key, value} = p;
        //
        //             if (t.isObjectProperty(p) && t.isIdentifier(key) && key.name === 'routes') {
        //                 // 递归遍历 findPath-当level不等于1的时候生效
        //                 const recursionFn = (routes, level, findPath) => {
        //                     const { elements } = routes;
        //
        //                     // 遍历属性
        //                     elements.forEach(element => {
        //                         const routeProperties = element.properties;
        //                         let findPath = false;
        //                         let routes = null;
        //
        //                         routeProperties.forEach((rp) => {
        //                             const rkey = rp.key;
        //                             const rvalue = rp.value;
        //
        //                             if (rkey.name === 'path') {// TODO 保证 path 在 routes 上面
        //                                 if (rvalue.value === addRouteLayoutParentPath) {
        //                                     findPath = true;
        //                                 }
        //                             }
        //
        //                             if (rkey.name === 'routes') {// 子节点
        //                                 routes = rvalue;
        //                             }
        //                         });
        //
        //                         // 属性遍历完了，在遍历
        //                         if (routes) {
        //                             recursionFn(routes, level + 1, findPath);
        //                         }
        //                     });
        //
        //                     if ((level === 1 && Number(addRouteLayoutLevel) === 1) || (Number(addRouteLayoutLevel) > 1 && findPath)) {
        //                         const properties = [];
        //                         properties.push(t.objectProperty(t.stringLiteral('path'), t.stringLiteral(addRouteLayoutPath)));
        //                         properties.push(t.objectProperty(t.stringLiteral('routes'), t.arrayExpression([])));
        //                         if (addRouteLayoutName) {
        //                             properties.push(t.objectProperty(t.stringLiteral('name'), t.stringLiteral(addRouteLayoutName)));
        //                         }
        //                         if (addRouteLayoutIcon) {
        //                             properties.push(t.objectProperty(t.stringLiteral('icon'), t.stringLiteral(addRouteLayoutIcon)));
        //                         }
        //                         if (addRouteLayoutComponent) {
        //                             properties.push(t.objectProperty(t.stringLiteral('component'), t.stringLiteral('../layouts/' + addRouteLayoutComponent)));
        //                         }
        //                         const element = t.objectExpression(properties);
        //
        //                         elements.push(element);
        //                     }
        //                 };
        //
        //                 recursionFn(value, level);
        //             }
        //         });
        //     }
        // });
        //
        //
        // // 生成
        // const newCode = generate(ast).code;
        // const prettierCode = prettier.format(newCode, {
        //     // format same as ant-design-pro
        //     singleQuote: true,
        //     trailingComma: 'es5',
        //     printWidth: 100,
        //     parser: 'typescript',
        // });
        // writeFileSync(configPath, prettierCode, 'utf-8');
        //
        // // 创建文件夹
        //
        // process.exit();
    }
};
