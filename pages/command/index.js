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

    worker.postMessage(arg);
    worker.onmessage = (ev) => {
        let msg = ev.data;

        if (arg.channel === 'cmd-message') {
            // 这里需要单独处理，因为启动项目后，就会一直挂起，没有结束事件
            if (arg.flag === 'cmd-children-project-start') {
                waitOn(opts).then(function() {
                    msg.status = 'end';
                    ipc.send('cmd-message', { ...msg });
                }).catch(function(err) {
                });
            }

            // TODO 这里组成起来了，参数需要好好处理下，不然 msg 和 arg 的字段可能会冲突
            msg = {...msg, ...arg};

            ipc.send('cmd-message', { ...msg });
        }

        if (msg.flag === 'cmd_close') {
            worker.terminate();
        }

    };
}

ipc.on('cmd-message', function (event, arg) {
    console.log('收到控制台请求:', arg);
    runCmd(arg)
});

ipc.on('ping', function (event, arg) {
    console.log('arg:', arg)
});
