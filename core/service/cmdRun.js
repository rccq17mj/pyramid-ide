const PROCESS = require('child_process');
const fs   = require('fs');



self.onmessage = function (e) {
    let data        = e.data;
    const cmdstr    = data.cmdStr;
    const cwd       = data.cwd;
    const callbackId= data.callbackId || null;
   
    // 命令行参数设置
    const cmdParam = {};
    cmdParam.shell  = true;

    if(cwd) {
        cmdParam.cwd  = cwd;
    }

    self.postMessage({ flag: 'start_code', status: 'start' });

    // 执行
    const ls = PROCESS.spawn(cmdstr, cmdParam);

    ls.stdout.on('data', (data) => {
        let msg = data.toString();
        self.postMessage({ flag: 'stdout', msg, status: 'progress', callbackId });
    });

    ls.stderr.on('data', (data) => {
        self.postMessage({ flag: 'stderr', data, status: 'progress', callbackId });
    });

    ls.on('close', (code) => {
        self.postMessage({ flag: 'close_code', code, status: 'end', callbackId });
    });
};
