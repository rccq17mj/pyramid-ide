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

// 区块模板工程下载
// GITHUB下载路径
// const projectGitRepo = 'guccihuiyuan/pyramid-blocks';
// // GITLAB下载路径
// const projectGitRepo = 'direct:http://10.10.11.151:10080/product/bigdata-cloudplatform/templet/pyramid-blocks#master';
const blockProjectGitRepo = 'guccihuiyuan/pyramid-blocks-template';

module.exports = (options) => {
    const cmdStr = program.args[0];

    if (cmdStr === 'get') {
        const {getProjectPath, getProjectUrl, getProjectBranch} = options;

        if (!getProjectPath && !getProjectUrl) {
            console.log(chalk.red('缺少项目路径或地址'));
            process.exit();
        }

        const spinner = ora();
        spinner.start('🔥  正在读取文件信息');

        // 读取的JSON文件
        const jsonFileName = 'pyramid-blocks.json';
        // 输出信息列表值
        const outputKey = 'pyramid-blocks-info:';

        if (getProjectPath) {
            const jsonFile = fs.readFileSync(path.join(getProjectPath, jsonFileName), 'utf-8');

            // 转换成json对象
            let jsonObj = {};
            try {
                jsonObj = JSON.parse(jsonFile);
            }catch (e) {
                jsonObj = {};
            }

            // 输出
            spinner.succeed();
            console.log(outputKey, JSON.stringify(jsonObj));
            process.exit();
        } else if (getProjectUrl) {
            const tempPath = path.join(process.cwd(), 'temp');
            const completeUrl = `direct:${getProjectUrl}#${getProjectBranch}`;

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
                    let jsonObj = {};
                    try {
                        jsonObj = JSON.parse(jsonFile);
                    }catch (e) {
                        jsonObj = {};
                    }
                    // 输出
                    console.log(outputKey, JSON.stringify(jsonObj));
                    process.exit();
                });
            });
        }
    }
    else if (cmdStr === 'init') {// 下载区块模板工程
        // pyramid block init a

        // 获取项目名称
        const args1 = program.args[1];
        const projectName = program.args[1][0];

        let {initProjectUrl, initProjectType, initProjectGitUrl} = options;

        // 默认初始化地址
        if (!initProjectUrl) {
            initProjectUrl = blockProjectGitRepo;
        }

        if (initProjectType !== '1' && initProjectType !== '2') {
            console.log(chalk.red('参数类型错误'));
            process.exit();
        }
        if (initProjectType === '1') {
            initProjectType = 'pc'
        } else if (initProjectType === '2') {
            initProjectType = 'mobile';
        }

        if (!args1 || !projectName) {
            console.log(chalk.red('请输入区块项目名称'));
            process.exit();
        }

        // 项目路径
        const currentPath = process.cwd();
        const projectPath = path.join(currentPath, projectName);

        // 创建项目目录
        if (fs.existsSync(projectPath)) {
            console.log(symbols.error, chalk.red('当前路径下已经存在相同项目名称，请重新输入项目名称!'));
            process.exit();
        }
        fs.mkdirSync(projectPath);

        const spinner = ora();
        spinner.start('🔥  正在下载区块项目模板');

        download(initProjectUrl, projectPath, null, (err) => {
            if (err) {
                spinner.fail();
                console.log(symbols.error, chalk.red(err));
                process.exit()
            }

            // TODO 替换 json 文件模板
            const meta = {
                blockPackageName: projectName,
                blockPackageType: initProjectType,
                blockPackageGitUrl: initProjectGitUrl
            };
            const pyramidBlockJsonFile = `${projectPath}/pyramid-blocks.json`;
            const pyramidBlockJsonContent = fs.readFileSync(pyramidBlockJsonFile).toString();
            const result = handlebars.compile(pyramidBlockJsonContent)(meta);
            fs.writeFileSync(pyramidBlockJsonFile, result);

            spinner.succeed();

            // 执行安装
            const installCmdStr = 'cd ' + projectPath + ' && ' + 'yarn';

            let ls = PROCESS.spawn(installCmdStr, {
                shell: true,
                stdio: 'inherit',
            });

            ls.on('close', () => {
                console.log(symbols.success, chalk.cyan('📦 依赖安装完成\n'));
                console.log(chalk.cyan('cd ' + projectPath + '\nyarn start'));
                process.exit();
            });

            // console.log(symbols.success, chalk.cyan('📦 项目创建完成\n'));
            // console.log(chalk.cyan('cd ' + projectPath + '\nyarn\nyarn start'));
            //
            // process.exit();
        });
    }
};