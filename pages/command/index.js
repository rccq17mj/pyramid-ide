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
    const env = [];

    const testPyramid = () => {
        /** 检测pyramid-cli */
        test.testPyramid().then((msg) => {
            var loding = document.getElementById("loding");
            env.push({
                type: 'pyramid',
                msg: msg
            });
            ipc.send(ipcConfig.ON_DE_SUCCESS, {
                type: 'pyramid',
                msg: env
            });
            loding.remove();
        }).catch(e => {
            ipc.send(ipcConfig.ON_DE_ERROR, e);
            console.log('initError:', e);
        });
    }

    /** 检测node */
    test.testNode().then(msg => {
        env.push({
            type: 'node',
            msg: msg
        });
        /** 检测npm */
        test.testNPM().then(msg => {
            env.push({
                type: 'npm',
                msg: msg
            });
            /** 检测umi */
            test.testUmi().then(msg => {
                env.push({
                    type: 'umi',
                    msg: msg
                });
                /** 检测yarn */
                test.testYarn().then(msg => {
                    env.push({
                        type: 'yarn',
                        msg: msg
                    });
                    testPyramid();
                }).catch(e => {
                    testPyramid();
                    alert('抱歉，建议您安装yarn');
                    ipc.send(ipcConfig.ON_DE_ERROR, e);
                    console.log('initError:', e);
                });
            }).catch(e => {
                alert('抱歉，请安装umi');
                ipc.send(ipcConfig.ON_DE_ERROR, e);
                console.log('initError:', e);
            });
        }).catch(e => {
            alert('抱歉，请安装npm');
            ipc.send(ipcConfig.ON_DE_ERROR, e);
            console.log('initError:', e);
        });
    }).catch(e => {
        alert('抱歉，请安装node.js');
        ipc.send(ipcConfig.ON_DE_ERROR, e);
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
                waitOn(opts).then(function () {
                    msg.cmdStatus = 'end';
                    ipc.send('cmd-message', { ...msg });
                }).catch(function (err) {
                });
            }

            // TODO 这里组成起来了，参数需要好好处理下，不然 msg 和 arg 的字段可能会冲突
            msg = { ...msg, ...arg };

            ipc.send('cmd-message', { ...msg });
        }

        if (msg.cmdFlag === 'cmd_close') {
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
