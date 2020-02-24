const fs = require('fs');
const path = require('path');

module.exports = (options) => {
    const cmdStr = program.args[0];
    if (cmdStr === 'getDirTree') {// 获取目录树
        // 当前目录
        const currentPath = process.cwd();
        const trees = [];

        const recursionFn = (path, trees) => {

        };

        recursionFn(currentPath, trees);
    }
};