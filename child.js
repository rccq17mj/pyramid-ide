var PROCESS   = require('child_process');
// 解析.env中的配置参数，定义全局常量数据
PROCESS.spawn('yarn start', {
    cwd: '/Users/dsy/Desktop/mywork/data/app_data/001/test888',
    shell: true,
    stdio: 'inherit'
});
