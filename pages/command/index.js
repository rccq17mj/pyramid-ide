const electron = require('electron');
const ipc = electron.ipcRenderer;
const ipcConfig = require('../../core/config/ipcArg.config');
const jetpack = require('fs-jetpack');
const init = require("./init");
const cmdRun = "../../core/service/cmdRun.js";
var waitOn = require('wait-on');
var opts = {
  resources: ['http://localhost:9100']
}
onload = function () {
    /** 初始化检测 */
    const test = new init(cmdRun);
    /** 检测node */
    test.testNode().then(msg => {
        ipc.send(ipcConfig.ON_DE_NODE_SUCCESS, msg);
    }).catch(e => {
        ipc.send(ipcConfig.ON_DE_NODE_ERROR, e);
        console.log('initError:', e);
    });
    /** 检测npm */
    test.testNPM().then(msg => {
        ipc.send(ipcConfig.ON_DE_NPM_SUCCESS, msg);
    }).catch(e => {
        ipc.send(ipcConfig.ON_DE_NPM_ERROR, e);
        console.log('initError:', e);
    });
    /** 检测yarn */
    test.testYarn().then(msg => {
        ipc.send(ipcConfig.ON_DE_YARN_SUCCESS, msg);
    }).catch(e => {
        ipc.send(ipcConfig.ON_DE_YARN_SUCCESS, e);
        console.log('initError:', e);
    });
    /** 检测pyramid-cli */
    test.testPyramid().then(msg => {
        var loding = document.getElementById("loding");
        ipc.send(ipcConfig.ON_DE_PYARMID_SUCCESS, null);
        loding.remove();
    }).catch(e => {
        ipc.send(ipcConfig.ON_DE_PYARMID_ERROR, e);
        console.log('initError:', e);
    });
}

/*   越狱electron的沙箱环境，使得node与系统打通 */
function runCmd(arg) {
    let worker = new Worker(cmdRun);
    // // 添加启动成功结束符
    // if (arg.channel === 'project-start') {
    //     waitOn(opts).then(function() {
    //         ipc.send('project-start', {end:true});
    //     }).catch(function(err) {
    //         console.log(err);
    //     });
    // }

    worker.postMessage(arg);
    worker.onmessage = (ev) => {
        let msg = ev.data;
        // if (arg.channel === 'project-start') {
        //     ipc.send('project-start', msg);
        // }

        if (arg.channel === 'cmd-message') {
            if (arg.flag) 
                msg.flag = arg.flag;
            
            if (arg.callbackId) 
                msg.callbackId = arg.callbackId;

            if (arg.cwd) 
                msg.cwd = arg.cwd;

            if (arg.cli) 
                msg.cli = arg.cli;

            if (arg.cliType) 
                msg.cliType = arg.cliType;
            
            // 这里需要单独处理
            if (arg.flag === 'cmd-children-project-start') {
                waitOn(opts).then(function() {
                    msg.end = true;
                    msg.status = 'end';
                    ipc.send('cmd-message', { 'cmd-create': true, ...msg });
                }).catch(function(err) {
                    console.log(err);
                });
            }

            if (msg.flag === 'close_code') {
                msg.end = true;
                msg.status = 'end';
            }
            if (msg.status === 'start') {
                msg.status = 'start';
            }
            if (msg.status === 'progress') {
                msg.status = 'progress';
            }
            if (msg.status === 'end') {
                msg.status = 'end';
            }

            ipc.send('cmd-message', { 'cmd-create': true, ...msg });
        }

        if (msg.flag === 'close_code') {
            worker.terminate();
        }

    };
}

ipc.on('cmd-message', function (event, arg) {
    console.log('收到控制台请求:', arg)
    runCmd(arg)
})

ipc.on('ping', function (event, arg) {
    console.log('arg:', arg)
})
