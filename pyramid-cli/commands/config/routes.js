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
    }
};
