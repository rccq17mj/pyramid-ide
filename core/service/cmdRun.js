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

    // 参数 cmdFlag、cmdCloseCode、cmdStatus、cmdMessage
    self.postMessage({
        cmdFlag: 'cmd_start',
        cmdStatus: 'start'
    });

    const ls = PROCESS.spawn(cmdStr, cmdParam);

    // 正常输出信息
    ls.stdout.on('data', (data) => {
        let msg = data.toString();
        self.postMessage({
            cmdFlag: 'cmd_out',
            cmdStatus: 'progress',
            cmdMessage: msg,
            callbackId,
            cwd,
        });
    });

    // 错误输出信息
    ls.stderr.on('data', (data) => {
        let msg = data.toString();
        self.postMessage({
            cmdFlag: 'cmd_err',
            cmdStatus: 'progress',
            cmdMessage: msg,
            callbackId,
            cwd,
        });
    });

    // 结束
    ls.on('close', (code) => {
        self.postMessage({
            cmdFlag: 'cmd_close',
            cmdStatus: 'end',
            cmdCloseCode: code,
            callbackId,
            cwd,
        });
    });
};
