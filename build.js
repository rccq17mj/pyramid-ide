/** 用于打包构建 */
const PROCESS = require('child_process');
const readlineSync = require("readline-sync");
const fs   = require('fs');

const process = (cmd) => {
        // 命令行参数设置
        const cmdParam = {
            shell: true
        };
        const ls = PROCESS.spawn(cmd, cmdParam);
    
        ls.stdout.on('data', (data) => {
            let msg = data.toString();
            console.log(msg);
        });
    
        ls.stderr.on('data', (data) => {
            console.log(data);
        });
    
        ls.on('close', (code) => {
            console.log(code);
        });
}

const getStdInSync = (tips,defaultValue) => {
    return readlineSync.question(tips) || defaultValue
}

let env = "dev", system = "mac", bits = "64";

env = getStdInSync("请输入要构建的环境（ dev/test/pro 默认dev ）", env);

system = getStdInSync("请输入操作系统类型（ mac/win 默认mac ）", system);

bits = getStdInSync("请输入操作系统位数（ 32/64 默认64 ）", bits);

process(`concurrently \"npm run build:${env} --prefix templet\" \"cross-env ELE_ENV=${env} electron-builder --${system} --x${bits}\"`);