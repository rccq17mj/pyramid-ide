const fs = require('fs');
const path = require('path');

const program = require('commander');

module.exports = (options) => {
    const cmdStr = program.args[0];

    if (cmdStr === 'getDirTree') {// 获取目录树
        // 当前目录
        const currentPath = process.cwd();
        const trees = [];

        const recursionFn = (currentPath, trees) => {
            const arr = fs.readdirSync(currentPath);
            arr.forEach(v => {
                const stat = fs.statSync(path.join(currentPath, v));
                if (stat.isDirectory()) {
                    const obj = {
                        name: v,
                        value: path.join(currentPath, v)
                    };

                    const children = [];
                    recursionFn(path.join(currentPath, v), children);

                    if (children.length > 0) {
                        obj.children = children;
                    }

                    trees.push(obj);
                }
            });
        };

        recursionFn(currentPath, trees);

        console.log('dirTree:', JSON.stringify(trees));
        process.exit();
    }
};