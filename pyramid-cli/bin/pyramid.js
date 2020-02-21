#!/usr/bin/env node

// 使用严格模式
'use strict';

const program = require('commander');
const chalk = require('chalk');

// const fs = require('fs');
// const path = require('path');
// const readFileSync = fs.readFileSync;
// const writeFileSync = fs.writeFileSync;
//
// const parser = require('@babel/parser');
// const traverse = require('@babel/traverse').default;
// const generate = require('@babel/generator').default;
// const t = require('@babel/types');
// const prettier = require('prettier');

//  版本号
program
    .version(require('../package').version, '-v, --version')
    .usage('<command> [options]');

// 创建 pyramid 项目
program
    .command('init <projectName> [options...]')
    .description('init pyramid project')
    // 一、采用询问的方式
    .option('--skip-inquirer', 'init project with skipInquirer')
    // 二、采用传参的方式
    .option('--project-type <projectType>', 'init project with type（PC | MOBILE）', 'PC')
    .option('--project-url <projectUrl>', 'init project with url')
    .option('--project-name <projectName>', 'init project with name')
    .option('--project-version <projectVersion>', 'init project with version', '0.0.1')
    .option('--project-description <projectDescription>', 'init project with description', 'pyramid')
    .option('--project-package-manager <projectPackageManager>', 'init project with projectManager（yarn | no）', 'yarn')
    .alias('i')
    .action((_a, _b, options) => {
        require('../commands/init')(options.opts())
    });

// 区块包 (新增init、修改update、删除delete、获取get) 相关
program
    .command('block-package <cmd> [options...]')
    .description('block-package actions')

    // init -- options
    .option('--init-project-url <initProjectUrl>', 'create block template project with url')
    .option('--init-project-chinese-name <initProjectChineseName>', 'create block template project with chineseName')
    .option('--init-project-type <initProjectType>', 'create block template project with type 1 | 2', '1')
    .option('--init-project-cover <initProjectCover>', 'create block template project with cover')
    .option('--init-project-git-url <initProjectGitUrl>', 'create block template project with git url', '')
    .option('--init-project-remark <initProjectRemark>', 'create block template project with remark', '')

    // get -- options
    .option('--get-project-path <getProjectPath>', 'query block template info with projectPath')
    .option('--get-project-url <getProjectUrl>', 'query block template info with projectUrl')
    .option('--get-project-branch <getProjectBranch>', 'query block template info with projectBranch', 'master')

    // update -- options（只能修改本地的）
    .option('--update-project-path <updateProjectPath>', 'update block template info with projectPath')
    .option('--update-project-git-url <updateProjectGitUrl>', 'update block template info with git url')

    .action((_a, _b, options) => {
        require('../commands/block-package')(options.opts());
    });

// block 相关
program
    .command('block <cmd> [options...]')
    .description('block actions')

    // add -- options
    .option('--page', 'add the block to a independent directory as a page')
    .option('--layout', 'add as a layout block (add route with empty children)')
    .option('--path <pathUrl>', 'the file path, default the name in package.json', '/')
    .option('--route-path <routePath>', 'the route path, default the name in package.json')
    .option('--route-name <routeName>', 'the route name, default the name in package.json')
    .option('--index <index>', 'add the block to editable section at index', 0)

    // create -- options
    .option('--create-block-type <createBlockType>', 'create block with type （block | template）')
    .option('--create-block-name-zh <createBlockNameZh>', 'create block with name zh')
    .option('--create-block-description <createBlockDescription>', 'create block with description')
    .option('--create-block-git-url <createBlockGitUrl>', 'create block with gitUrl')
    .option('--create-block-git-branch <createBlockGitBranch>', 'create block with gitBranch', 'master')
    .option('--create-block-image <createBlockImage>', 'create block with image')
    .option('--create-block-categories <createBlockCategories>', 'create block with categories')

    // update -- options
    .option('--update-block-type <updateBlockType>', 'update block with type （block | template）')
    .option('--update-block-name-zh <updateBlockNameZh>', 'update block with name zh')
    .option('--update-block-description <updateBlockDescription>', 'update block with description')
    .option('--update-block-git-url <updateBlockGitUrl>', 'update block with gitUrl')
    .option('--update-block-git-branch <updateBlockGitBranch>', 'update block with gitBranch', 'master')
    .option('--update-block-image <updateBlockImage>', 'update block with image')
    .option('--update-block-categories <updateBlockCategories>', 'update block with categories')

    // category --options
    .option('--category-type <categoryType>', 'create block category with type (blocks | templates)', 'blocks')
    .option('--category-update-name <categoryUpdateName>', 'create block category with updateName', 'blocks')

    // list -- options
    .option('--list-project-path <listProjectPath>', 'query block template block list with projectPath')
    .option('--list-project-url <listProjectUrl>', 'query block template block list with projectUrl')
    .option('--list-project-branch <listProjectBranch>', 'query block template block list with projectBranch', 'master')
    .option('--list-block-type <listBlockType>', 'query block template block list with type (blocks | templates)')

    .alias('b')
    .action((_a, _b, options) => {
        require('../commands/block')(options.opts());
    });

// 系统配置命令
// 格式示列：pyramid config routes getPathTree
program.command('config <attribute> <action> [options...]')
    .description('config actions')
    .action((_a, _b, _c, options) => {
        require('../commands/config/index')(options.opts());
    });

// 帮助
program
    .command('help <cmd>')
    .description('help command')
    .alias('h')
    .action((command) => {
        require('../commands/help')(command)
    });




// // 处理菜单名称
// program
//     .command('test <cmd>')
//     .action((_a, _b, options) => {
//         const ast = parser.parse(readFileSync('F:\\pyramid-collection\\pyramid-pro\\config\\config.ts', 'utf-8'), {
//             sourceType: 'module',
//             plugins: ['typescript'],
//         });
//         traverse(ast, {
//             ObjectExpression({ node, parent }) {
//                 if (t.isArrayExpression(parent)) {
//                     return;
//                 }
//
//                 const { properties } = node;
//                 properties.forEach(p => {
//                     const { key, value } = p;
//                     if (t.isObjectProperty(p) && t.isIdentifier(key) && key.name === 'routes') {// 找到 routes
//                         // 递归遍历 - 根据地址修改菜单名称
//                         const path = '/admin';
//
//                         const modifyNameByPathFn = (value) => {
//                             const { elements } = value;
//                             elements.forEach(element => {
//                                 const { properties } = element;
//
//                                 let index = null;
//                                 let isFind = false;
//
//                                 properties.forEach((p, i) => {
//                                     const { key, value } = p;
//                                     // 匹配path
//                                     if (key.name === 'path') {
//                                         const pathValue = value.value;
//                                         if (path === pathValue) {
//                                             isFind = true;
//                                         }
//                                     }
//
//                                     // 匹配name
//                                     if (key.name === 'name') {
//                                         index=  i;
//                                     }
//
//                                     // 匹配routes
//                                     if (key.name === 'routes') {
//                                         if (!isFind) {
//                                             modifyNameByPathFn(value);
//                                         }
//                                     }
//                                 });
//
//                                 if (isFind) {
//                                     properties[index].value.value = '/111';
//                                 }
//                             });
//                         };
//
//                         modifyNameByPathFn(value);
//                     }
//                 });
//             },
//         });
//
//         // 生成
//         const newCode = generate(ast).code;
//         const prettierCode = prettier.format(newCode, {
//             // format same as ant-design-pro
//             singleQuote: true,
//             trailingComma: 'es5',
//             printWidth: 100,
//             parser: 'typescript',
//         });
//         writeFileSync('F:\\pyramid-collection\\pyramid-pro\\config\\config.ts', prettierCode, 'utf-8');
//     });

// program
//     .command('test <cmd>')
//     .action((_a, _b, options) => {
//         const ast = parser.parse(readFileSync('F:\\pyramid-collection\\pyramid-pro\\src\\pages\\EmptyPage\\Index.tsx', 'utf-8'), {
//             sourceType: 'module',
//             plugins: ['typescript', 'jsx'],
//         });
//         traverse(ast, {
//             // 添加import
//             // Program({node}) {
//             //     const { body } = node;
//             //
//             //     let lastImportIndex = 0;
//             //     body.forEach((item, index) => {
//             //         if (t.isImportDeclaration(item)) {
//             //             lastImportIndex = index;
//             //         }
//             //     });
//             //
//             //     const insertImport = t.importDeclaration(
//             //         [t.importSpecifier(t.identifier('PageHeaderWrapper'), t.identifier('PageHeaderWrapper'))],
//             //         t.stringLiteral('@ant-design/pro-layout')
//             //     );
//             //
//             //     body.splice(lastImportIndex + 1, 0, insertImport);
//             // },
//
//             // 处理标签
//             ReturnStatement(path) {
//                 // 取第一个元素下面的子元素
//                 const outerWrapNode = path.node.argument.children;
//
//                 // // 删除元素
//                 // outerWrapNode.forEach((child, index) => {
//                 //     if (t.isJSXElement(child)) {
//                 //         outerWrapNode.splice(index, 1);
//                 //     }
//                 // });
//
//                 // // 添加元素
//                 // outerWrapNode.push(
//                 //     t.jsxElement(
//                 //         t.jsxOpeningElement(t.jsxIdentifier('span'), [
//                 //             t.jsxAttribute(t.jsxIdentifier('className'), t.stringLiteral('abc'))
//                 //         ]),
//                 //         t.jsxClosingElement(t.jsxIdentifier('span')),
//                 //         [t.jsxText('333'),],
//                 //         true
//                 //     )
//                 // );
//             },
//         });
//
//         // 生成
//         const newCode = generate(ast).code;
//         const prettierCode = prettier.format(newCode, {
//             // format same as ant-design-pro
//             singleQuote: true,
//             trailingComma: 'es5',
//             printWidth: 100,
//             parser: 'typescript',
//         });
//         writeFileSync('F:\\pyramid-collection\\pyramid-pro\\src\\pages\\EmptyPage\\Index.tsx', prettierCode, 'utf-8');
//     });

// program
//     .command('test <cmd>')
//     .action((_a, _b, options) => {
//         // 解析
//         const ast = parser.parse(readFileSync('C:\\Users\\ys\\Desktop\\umi-ui-test\\src\\configs\\app.config.ts', 'utf-8'), {
//             sourceType: 'module',
//             plugins: ['typescript'],
//         });
//         // 遍历
//         traverse(ast, {
//             ObjectExpression({ node }) {
//                 const { properties } = node;
//                 properties.forEach(p => {
//                     const { key, value } = p;
//                     if (key.name === 'ACCESS_CONGO') {
//                         value.value = false;
//                     }
//                 });
//             }
//         });
//         // 生成
//         const newCode = generate(ast, {}).code;
//         // 写入文件
//         writeFileSync('C:\\Users\\ys\\Desktop\\umi-ui-test\\src\\configs\\app.config.ts', newCode, 'utf-8');
//     });

// 解析
program.parse(process.argv);

// 自定义显示帮助命令
if (!program.args.length){
    const detail = `
  Usage: pyramid <command> [options]
  
  Commands:
    ${chalk['green'](`-v | --version `)}    view pyramid-cli version
    ${chalk['green'](`init `)}              init pyramid project
    ${chalk['green'](`block `)}             block actions
    ${chalk['green'](`config `)}            config actions
    
  run ${chalk['blue'](`pyramid help [command]`)} for usage of a specific command.  
    `;

    console.log(detail);
}
