'use strict';

// 系统包
const fs = require('fs');
const path = require('path');
const PROCESS = require('child_process');

const readFileSync = fs.readFileSync;
const writeFileSync = fs.writeFileSync;

// 第三方包
const program = require('commander');
const chalk = require('chalk');

const ora = require('ora');
const symbols = require('log-symbols');
const jetpack = require('fs-jetpack');
const handlebars = require('handlebars');
const prettier = require('prettier');
const rimraf = require('rimraf');
const download = require('download-git-repo');

// babel
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

module.exports = (options) => {
    const cmdStr = program.args[0];

    if (cmdStr === 'update') {// 修改区块信息
        // 获取区块名称，根据这个名称修改
        const args1 = program.args[1];
        const blockName = program.args[1][0];
        if (!args1 || !blockName) {
            console.log(chalk.red('缺少区块名称'));
            process.exit();
        }

        // 当前项目路径（必须在项目路径下面）
        const currentPath = process.cwd();

        // 参数验证
        let {updateBlockType, updateBlockNameZh, updateBlockDescription, updateBlockImage, updateBlockGitUrl, updateBlockGitBranch, updateBlockCategories} = options;

        if (!updateBlockType) {
            console.log(chalk.red('缺少类型'));
            process.exit();
        }

        let categories = [];
        if (updateBlockCategories && updateBlockCategories.trim() !== '') {
            categories = updateBlockCategories.trim().split(",");
        }

        let blockTypeCatalog;
        let blockFoldName;
        let pyramidBlockJsonKey;

        switch (updateBlockType) {
            case 'block':
                blockTypeCatalog = 'blocks';
                pyramidBlockJsonKey = 'blocks';
                blockFoldName = camelToHorizontalLine(blockName);
                break;
            case 'template':
                blockTypeCatalog = 'templates';
                pyramidBlockJsonKey = 'templates';
                blockFoldName = firstWordToUpperCase(blockName);
                break;
            default:
                break;
        }

        // 修改项目区块列表描述文件
        const pyramidBlocksJsonContent = fs.readFileSync(path.join(currentPath, 'pyramid-blocks.json')).toString();
        const pyramidBlocksJsonObject = JSON.parse(pyramidBlocksJsonContent);

        let isFind = false;
        pyramidBlocksJsonObject[pyramidBlockJsonKey].forEach(item => {
            if (item.key === blockFoldName) {
                isFind = true;
                if (updateBlockNameZh) {
                    item.name = updateBlockNameZh;
                }
                if (updateBlockDescription) {
                    item.description = updateBlockDescription;
                }
                if (updateBlockGitUrl && updateBlockGitBranch) {
                    item.gitUrl = updateBlockGitUrl + '/tree/' + updateBlockGitBranch + '/' + blockTypeCatalog + '/' + blockFoldName;
                }
                if (updateBlockImage) {
                    item.previewImg = updateBlockImage;
                }
                if (categories.length > 0) {
                    item.tags = categories;
                }
            }
        });

        if (!isFind) {
            console.log(chalk.red('没有找到相应的区块'));
            process.exit();
        }

        const writeJsonContent = JSON.stringify(pyramidBlocksJsonObject);
        const prettierCode = prettier.format(writeJsonContent, {
            tabWidth: 4,
            semi: false,
            singleQuote: true,
            parser: 'json',
        });
        fs.writeFileSync(path.join(currentPath, 'pyramid-blocks.json'), prettierCode);
        process.exit();
    }
    else if (cmdStr === 'create') {// 在区块模板工程下创建区块
        // 获取区块名称
        const args1 = program.args[1];
        const blockName = program.args[1][0];
        if (!args1 || !blockName) {
            console.log(chalk.red('缺少区块名称'));
            process.exit();
        }

        // 当前项目路径（必须在项目路径下面）
        const currentPath = process.cwd();

        // 参数验证
        let {createBlockType, createBlockNameZh, createBlockDescription, createBlockImage, createBlockGitUrl, createBlockGitBranch, createBlockCategories} = options;
        if (!createBlockType) {
            console.log(chalk.red('缺少类型'));
            process.exit();
        }
        if (!createBlockNameZh) {
            console.log(chalk.red('缺少中文名称'));
            process.exit();
        }
        if (!createBlockDescription) {
            console.log(chalk.red('缺少描述'));
            process.exit();
        }
        // if (!createBlockGitUrl) {
        //     console.log(chalk.red('缺少Git地址'));
        //     process.exit();
        // }

        let categories = [];
        if (createBlockCategories && createBlockCategories.trim() !== '') {
            categories = createBlockCategories.trim().split(",");
        }

        let blockTypeCatalog;
        let blockDemoName;
        let blockFoldName;
        let pyramidBlockJsonKey;

        switch (createBlockType) {
            case 'block':
                blockTypeCatalog = 'blocks';
                blockDemoName = 'demo';
                pyramidBlockJsonKey = 'blocks';
                blockFoldName = camelToHorizontalLine(blockName);
                break;
            case 'template':
                blockTypeCatalog = 'templates';
                blockDemoName = 'Demo';
                pyramidBlockJsonKey = 'templates';
                blockFoldName = firstWordToUpperCase(blockName);
                break;
            default:
                break;
        }

        // 区块路径
        const demoPath = path.join(currentPath, blockTypeCatalog, blockDemoName);
        const blockPath = path.join(currentPath, blockTypeCatalog, blockFoldName);

        if (!fs.existsSync(demoPath)) {
            console.log(symbols.error, chalk.red('项目下缺少 ' + blockTypeCatalog + '/' + blockDemoName + ' 目录，不能生成区块文件，请恢复！！！'));
            process.exit();
        }

        // 拷贝项目目录
        if (fs.existsSync(blockPath)) {
            console.log(symbols.error, chalk.red('当前路径下已经存在相同区块名称，请重新输入区块名称!'));
            process.exit();
        }
        jetpack.copy(demoPath, blockPath);

        // 修改 package.json 文件里面的 name、description
        const meta = {
            blockPackageFileName: '@pyramid-blocks/' + camelToHorizontalLine(blockName),
            blockPackageContent: createBlockDescription,
        };
        const blockPackageFileName = `${blockPath}/package.json`;
        const blockPackageContent = fs.readFileSync(blockPackageFileName).toString();
        const result = handlebars.compile(blockPackageContent)(meta);
        fs.writeFileSync(blockPackageFileName, result);

        // 修改项目区块列表描述文件
        const pyramidBlocksJsonContent = fs.readFileSync(path.join(currentPath, 'pyramid-blocks.json')).toString();
        const pyramidBlocksJsonObject = JSON.parse(pyramidBlocksJsonContent);

        pyramidBlocksJsonObject[pyramidBlockJsonKey].push(
          {
              // 文件夹名称
              key: blockFoldName,
              name: createBlockNameZh,
              description: createBlockDescription,
              // gitUrl: createBlockGitUrl + '/tree/' + createBlockGitBranch + '/' + blockTypeCatalog + '/' + blockFoldName,
              gitUrl: '',
              previewImg: createBlockImage,
              previewUrl: '/' + blockTypeCatalog + '/' + blockFoldName,
              tags: categories
          }
        );

        const writeJsonContent = JSON.stringify(pyramidBlocksJsonObject);
        const prettierCode = prettier.format(writeJsonContent, {
            tabWidth: 4,
            semi: false,
            singleQuote: true,
            parser: 'json',
        });
        fs.writeFileSync(path.join(currentPath, 'pyramid-blocks.json'), prettierCode);
        process.exit();
    }
    else if (cmdStr === 'category') {
        // pyramid block category add <name>
        // pyramid block category delete <name> --category-update-name
        // pyramid block category update <name>

        const args1 = program.args[1];
        if (!args1 || args1.length <= 1) {
            console.log(chalk.red('参数不完整'));
            process.exit();
        }
        const action = args1[0];

        // 在当前路径下执行
        const currentPath = process.cwd();
        const categoryName = args1[1];
        const { categoryType, categoryUpdateName } = options;

        if (!categoryType) {
            console.log(chalk.red('缺少 categoryType 参数'));
            process.exit();
        }
        if (categoryType !== 'blocks' && categoryType !== 'templates') {
            console.log(chalk.red('categoryType 只能为 blocks | templates'));
            process.exit();
        }

        // 修改项目区块列表描述文件
        const exists =  fs.existsSync(path.join(currentPath, 'pyramid-blocks.json'));
        if (!exists) {
            console.log(chalk.red('该路径下不存在 pyramid-blocks.json 文件'));
            process.exit();
        }

        const pyramidBlocksJsonContent = fs.readFileSync(path.join(currentPath, 'pyramid-blocks.json')).toString();
        const pyramidBlocksJsonObject = JSON.parse(pyramidBlocksJsonContent);

        // 找到对应类型的分类
        const categories = pyramidBlocksJsonObject['category'][categoryType];
        const blocks = pyramidBlocksJsonObject[categoryType];

        // 判断是否找到添加的名称
        let findIndex = undefined;
        let findUpdateIndex = undefined;
        categories.forEach((category, index) => {
            if (category === categoryName) {
                findIndex = index;
            }
            if (categoryUpdateName && categoryUpdateName === category) {
                findUpdateIndex = index;
            }
        });

        if (action === 'add') {
            if (findIndex !== undefined) {
                console.log(chalk.red('已存在相同的分类名称'));
                process.exit();
            }
            // 分类里面增加
            categories.push(categoryName);
        } else if (action === 'update') {// 更新
            if (!categoryUpdateName) {
                console.log(chalk.red('缺少更新名称参数'));
                process.exit();
            }

            // 原来的没有找到
            if (findIndex === undefined) {
                console.log(chalk.red('原先不存在该分类名称'));
                process.exit();
            }

            // 更新的找到了
            if (findUpdateIndex !== undefined) {
                console.log(chalk.red('已存在相同的分类名称'));
                process.exit();
            }

            // 更新分类
            categories[findIndex] = categoryUpdateName;

            // 遍历删除每个区块下面的tags
            blocks.forEach(blocks => {
                const tags = blocks.tags;

                let findTagIndex = undefined;
                tags.forEach((tag, tagIndex) => {
                    if (tag === categoryName) {
                        findTagIndex = tagIndex;
                    }
                });

                if (findTagIndex !== undefined) {
                    tags[findTagIndex] = categoryUpdateName;
                }
            });

        } else if (action === 'delete') {// 删除
            if (findIndex === undefined) {
                console.log(chalk.red('不存在该分类'));
                process.exit();
            }

            // 分类里面删除
            categories.splice(findIndex, 1);

            // 遍历删除每个区块下面的tags
            blocks.forEach(blocks => {
                const tags = blocks.tags;

                let findTagIndex = undefined;
                tags.forEach((tag, tagIndex) => {
                    if (tag === categoryName) {
                        findTagIndex = tagIndex;
                    }
                });

                if (findTagIndex !== undefined) {
                    tags.splice(findTagIndex, 1);
                }
            });
        } else {
            console.log(chalk.red('参数格式不正确'));
            process.exit();
        }

        // 写入文件
        const writeJsonContent = JSON.stringify(pyramidBlocksJsonObject);
        const prettierCode = prettier.format(writeJsonContent, {
            tabWidth: 4,
            semi: false,
            singleQuote: true,
            parser: 'json',
        });
        fs.writeFileSync(path.join(currentPath, 'pyramid-blocks.json'), prettierCode);
        process.exit();
    }
    else if (cmdStr === 'test') {// 读取测试
    }
    else if (cmdStr === 'list') { // 列表
        const {listBlockType, listProjectPath, listProjectUrl, listProjectBranch} = options;
        if (!listBlockType) {
            console.log(chalk.red('缺少类型'));
            process.exit();
            return;
        }
        if (!listProjectPath && !listProjectUrl) {
            console.log(chalk.red('缺少项目地址或者项目路径'));
            process.exit();
            return;
        }

        const spinner = ora();
        spinner.start('🔥  正在读取文件信息');

        // 读取的JSON文件
        const jsonFileName = 'pyramid-blocks.json';
        // 输出信息列表值
        const outputListKey = 'pyramid-blocks:';
        const outputCategoryKey = 'pyramid-block-category:';


        if (listProjectPath) {// 项目路径
            const jsonFile = fs.readFileSync(path.join(listProjectPath, jsonFileName), 'utf-8');

            // 转换成json对象
            let list = [];
            let categories = [];
            try {
                const jsonObj = JSON.parse(jsonFile);
                list = jsonObj[listBlockType];
                categories = jsonObj['category'][listBlockType];
            }catch (e) {
                list = [];
                categories = [];
            }

            // 输出
            spinner.succeed();
            console.log(outputListKey, JSON.stringify(list));
            console.log(outputCategoryKey, JSON.stringify(categories));
            process.exit();
        } else if (listProjectUrl) {// 项目地址
            const tempPath = path.join(process.cwd(), 'temp');
            const completeUrl = `direct:${listProjectUrl}#${listProjectBranch}`;

            download(completeUrl, tempPath, { clone: true }, (err) => {
                if (err) {
                    spinner.fail();
                    console.log(symbols.error, chalk.red(err));
                    process.exit();
                }

                // 读取json文件
                const jsonFile = fs.readFileSync(path.join(tempPath, jsonFileName), 'utf-8');

                // 删除临时下载路径
                rimraf(tempPath, (err) => {
                    if (err) {
                        spinner.fail();
                        console.log(err);
                        process.exit();
                        return;
                    }

                    spinner.succeed();

                    // 转换成json对象
                    let list = [];
                    let categories = [];
                    try {
                        const jsonObj = JSON.parse(jsonFile);
                        list = jsonObj[listBlockType];
                        categories = jsonObj['category'][listBlockType];
                    }catch (e) {
                        list = [];
                        categories = [];
                    }
                    // 输出
                    console.log(outputListKey, JSON.stringify(list));
                    console.log(outputCategoryKey, JSON.stringify(categories));
                    process.exit();
                });
            });
        } else {
            process.exit();
        }
    }
    else if (cmdStr === 'add') {// 添加
        // 获取区块url地址
        const args1 = program.args[1];
        const blockUrl = program.args[1][0];
        if (!args1 || !blockUrl) {
            console.log(chalk.red('请输入区块地址'));
            process.exit();
        }

        // 命令行
        let cmdStr = 'umi block add ' + blockUrl;

        // 是否有page
        const page = options.page;

        // layout
        const layout = options.layout;

        if (page) {// 页面
            cmdStr += ` --page`;

            // layout
            if (layout) {
                cmdStr += ` --layout=${layout}`;
            }

            // 路由路径
            const routePath = options.routePath;
            if (routePath) {
                cmdStr += ` --route-path=${routePath}`;
            }
        } else {// 区块
            // 添加索引
            const blockIndex = options.index;
            cmdStr += ` --index=${blockIndex}`;
        }

        // 添加路径
        const optionsPath = options.path;
        if (optionsPath) {
            cmdStr += ` --path=${optionsPath}`;
        }

        // 执行命令
        // 页面：umi block add 区块地址 --page
        // 区块：umi block add 区块地址 --path=文件路径
        let ls = PROCESS.spawn(cmdStr, {
            shell: true,
            stdio: 'inherit'
        });

        ls.on('close', () => {
            // 判断是添加页面还是添加区块
            if (page) {
                // TODO layout，暂时留一个坑位 如果是菜单中
                if (layout) {
                }

                // 菜单名称
                const routePath = options.routePath;
                const routeName = options.routeName;
                const configPath = path.join(process.cwd(), '/config/config.ts');
                // 判断路径是否存在
                const configPathExists =  fs.existsSync(configPath);
                if (routePath && routeName && configPathExists) {
                    const ast = parser.parse(readFileSync(configPath, 'utf-8'), {
                        sourceType: 'module',
                        plugins: ['typescript'],
                    });

                    traverse(ast, {
                        ObjectExpression({ node, parent }) {
                            if (t.isArrayExpression(parent)) {
                                return;
                            }

                            const { properties } = node;
                            properties.forEach(p => {
                                const { key, value } = p;
                                if (t.isObjectProperty(p) && t.isIdentifier(key) && key.name === 'routes') {// 找到 routes
                                    // 递归遍历 - 根据地址修改菜单名称
                                    const modifyNameByPathFn = (value) => {
                                        const { elements } = value;
                                        elements.forEach(element => {
                                            const { properties } = element;

                                            let index = null;
                                            let isFind = false;

                                            properties.forEach((p, i) => {
                                                const { key, value } = p;
                                                // 匹配path
                                                if (key.name === 'path') {
                                                    const pathValue = value.value;
                                                    if (routePath === pathValue) {
                                                        isFind = true;
                                                    }
                                                }

                                                // 匹配name
                                                if (key.name === 'name') {
                                                    index=  i;
                                                }

                                                // 匹配routes
                                                if (key.name === 'routes') {
                                                    if (!isFind) {
                                                        modifyNameByPathFn(value);
                                                    }
                                                }
                                            });

                                            if (isFind) {
                                                properties[index].value.value = routeName;
                                            }
                                        });
                                    };

                                    modifyNameByPathFn(value);
                                }
                            });
                        },
                    });

                    // 生成
                    const newCode = generate(ast).code;
                    const prettierCode = prettier.format(newCode, {
                        // format same as ant-design-pro
                        singleQuote: true,
                        trailingComma: 'es5',
                        printWidth: 100,
                        parser: 'typescript',
                    });
                    writeFileSync(configPath, prettierCode, 'utf-8');
                }
            } else {// 当作区块添加到页面中
                // 调用，插入区块
                // appendBlockToContainer({
                //     entryPath: 'C:/Users/ys/Desktop/umi-ui-test/src/pages/EmptyPage/Index.tsx',
                //     blockFolderName: 'FormRegister',
                //     dryRun: false,
                //     index: 'l-0'
                // });
            }
            process.exit();
        });
    } else {
        console.log(symbols.error, chalk.red('该命令不存在!'));
        process.exit();
    }
};

/**
 * 首字母大写
 * @param str
 * @returns {string}
 */
function firstWordToUpperCase(str) {
    if (str == null || "" === str.trim()) {
        return "";
    }
    let newStr = '';
    for (let i = 0;i < str.length;i++) {
        if (i === 0) {
            newStr += str[i].toUpperCase();
        } else {
            newStr += str[i];
        }
    }
    return newStr;
}

/**
 * 驼峰格式字符串转换为横线格式字符串
 * @param str
 * @returns {string}
 */
function camelToHorizontalLine(str) {
    if (str == null || "" === str.trim()) {
        return "";
    }
    let newStr = '';
    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        if (c !== c.toLowerCase()) {
            if (i !== 0) {
                newStr += '-';
            }
            newStr += c.toLowerCase();
        } else {
            newStr += c;
        }
    }
    return newStr;
}
