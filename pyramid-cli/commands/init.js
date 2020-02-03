'use strict';

// 系统包
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

// 第三方包
const program = require('commander');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const download = require('download-git-repo');

// 项目地址
// GITHUB
// const pcProjectGitRepo = 'direct:https://github.com/guccihuiyuan/pyramid-pro#master';
// GITLAB
const pcProjectGitRepo = 'direct:http://10.10.11.151:10080/product/bigdata-cloudplatform/templet/templet#new';
const mobileProjectGitRepo = 'direct:http://10.10.11.151:10080/product/bigdata-cloudplatform/mini-program/gcongo-mobile-ts#master';

module.exports = (options) => {
    // 项目名称
    const projectName = program.args[0];

    // 是否跳过询问
    const skipInquirer = options['skipInquirer'];

    if (skipInquirer) {// 跳过询问，直接通过命令生成
        const answers = {};
        if (options.projectType) {
            answers['projectType'] = options.projectType;
        }
        if (options.projectUrl) {
            answers['projectUrl'] = options.projectUrl;
        }
        if (options.projectVersion) {
            answers['projectVersion'] = options.projectVersion;
        }
        if (options.projectDescription) {
            answers['projectDescription'] = options.projectDescription;
        }
        if (options['projectPackageManager']) {
            answers['projectPackageManager'] = options['projectPackageManager'];
        }
        answers['projectName'] = projectName;
        if (options.projectName) {
            answers['projectName'] = options.projectName;
        }
        initProject(answers['projectName'], answers);
    } else {
        inquirer.prompt([
            {
                name: 'projectType',
                message: '项目类型',
                type: 'list',
                choices: ['Pyramid Pro', 'Pyramid Mobile'],
                default: 'Pyramid Pro'
            },
            {
                name: 'projectName',
                message: '项目名称',
                default: projectName
            },
            {
                name: 'projectVersion',
                message: '项目版本号',
                default: '0.0.1'
            },
            {
                name: 'projectDescription',
                message: '项目描述',
                default: `template project`
            },
            {
                name: 'projectPackageManager',
                message: '安装方式',
                type: 'list',
                choices: ['yarn', 'no'],
                default: 'yarn'
            }
        ]).then(answers => {
            initProject(projectName, answers);
        });
    }
};

const initProject = (projectName, answers) => {
    // 项目路径
    const currentPath = process.cwd();
    const projectPath = path.join(currentPath, projectName);

    // 项目地址
    let projectUrl;
    if (answers.projectUrl) {
        projectUrl = answers.projectUrl;
    } else {
        switch (answers.projectType) {
            case 'Pyramid Pro':
                projectUrl = pcProjectGitRepo;
                break;
            case 'PC':
                projectUrl = pcProjectGitRepo;
                break;
            case 'Pyramid Mobile':
                projectUrl = mobileProjectGitRepo;
                break;
            case 'MOBILE':
                projectUrl = mobileProjectGitRepo;
                break;
            default:
                projectUrl = pcProjectGitRepo;
        }
    }

    // 创建项目目录
    if (fs.existsSync(projectPath)) {
        console.log(symbols.error, chalk['red']('当前路径下已经存在相同项目名称，请重新输入项目名称!'));
        process.exit();
    }
    fs.mkdirSync(projectPath);

    const spinner = ora();
    spinner.start('🔥  正在下载项目模板');

    // 下载
    // download(projectGitRepo, projectPath, null, (err) => {
    download(projectUrl, projectPath, { clone: true }, (err) => {
        if (err) {
            spinner.fail();
            console.log(symbols.error, chalk['red'](err));
            process.exit()
        }

        spinner.succeed();

        // 替换模板文件
        const meta = {
            projectName,
            projectDescription: answers.projectDescription,
            projectVersion: answers.projectVersion
        };
        const fileName = `${projectName}/package.json`;
        const content = fs.readFileSync(fileName).toString();
        const result = handlebars.compile(content)(meta);
        fs.writeFileSync(fileName, result);

        // 安装方式
        const projectPackageManager = answers.projectPackageManager;
        if (projectPackageManager === 'no') {
            console.log(symbols.success, chalk['cyan']('📦  项目创建完成\n'));
            console.log(chalk['cyan']('cd ' + projectPath + '\nyarn\nyarn start'));

            process.exit();
            return;
        }

        console.log(symbols.success, chalk['cyan']('📦  项目创建完成'));

        // 执行安装
        const installCmdStr = 'cd ' + projectPath + ' && ' + 'yarn';

        let ls = child_process.spawn(installCmdStr, {
            shell: true,
            stdio: 'inherit',
        });

        ls.on('close', () => {
            console.log(symbols.success, chalk['cyan']('📦  依赖安装完成\n'));
            console.log(chalk['cyan']('cd ' + projectPath + '\nyarn start'));
            process.exit();
        });
    });
};
