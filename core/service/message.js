const { ipcMain } = require('electron');
const ipcConfig = require('../config/ipcArg.config');
const eventConfig = require('../config/event.config');
const ENV = require('../config/env.config');
const receive = require('../receive');
const response = require('../response');
class message {

    constructor(window_objs) {
        this.window_objs = window_objs;
        // 接收来自templet工程的请求
        this.receive = new receive(window_objs);
        // 回复templet工程的请求
        this.response = new response(window_objs, this.receive);
        this.moduleWindow = this.receive.getModuleWindow();
        this.showDevTools = false;
        this.detectionTest();
        console.log('eventConfig:', eventConfig.ActionTypes)
    }

    /** 环境检测 */
    detectionTest() {
        this.window_objs.runWindow.once('show', () => {
            /** 检测通过 */
            ipcMain.on(ipcConfig.ON_DE_PYARMID_SUCCESS, (event, arg) => {
                this.window_objs.mainWindow.show();
                switch (process.env.ELE_ENV) {
                    case ENV.ELE_ENV_DEV:
                    case ENV.ELE_ENV_TEST:
                    case ENV.ELE_ENV_PRO:
                        this.window_objs.runWindow.hide();
                        break;
                    default:
                        break;
                }
            });
            /** 检测失败 */
            ipcMain.on(ipcConfig.ON_DETECTION_ERROR, (event, arg) => {
                console.log(arg);
            });
        })
    }
}

module.exports = message
