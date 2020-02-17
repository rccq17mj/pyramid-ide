const PROCESS = require('child_process');

self.onmessage = function (e) {
    const data       = e.data;

    const cmdStr     = data.cmdStr;
    const cwd        = data.cwd || null;
    const callbackId = data.callbackId || null;

    // 命令行参数设置
    const cmdParam = {
        shell: true
    };

    if (cwd) {
        cmdParam.cwd  = cwd;
    }

    self.postMessage({
        flag: 'cmd_start',
        status: 'start'
    });

    const ls = PROCESS.spawn(cmdStr, cmdParam);

    // 正常输出信息
    ls.stdout.on('data', (data) => {
        let msg = data.toString();
        self.postMessage({
            flag: 'cmd_out',
            status: 'progress',
            callbackId,
            cwd,
            msg,
        });
    });

    // 错误输出信息
    ls.stderr.on('data', (data) => {
        self.postMessage({
            flag: 'cmd_err',
            status: 'progress',
            callbackId,
            cwd,
            data,
        });
    });

    // 结束
    ls.on('close', (code) => {
        self.postMessage({
            flag: 'cmd_close',
            status: 'end',
            callbackId,
            cwd,
            cmdCloseCode: code
        });
    });
};
