const { ipcMain } = require('electron');
const ipcConfig = require('../config/ipcArg.config');
const {ActionTypes} = require('../config/event.config');
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
    }

    /** 环境检测 */
    detectionTest() {
        this.window_objs.runWindow.once('show', () => {
            /** 检测通过 */
            // 这里我需要发消息给内部窗口 直接告诉其版本号，就不用在里面再查询了
            ipcMain.on(ipcConfig.ON_DE_SUCCESS, (event, arg) => {
                // 全部检测通过
                if(arg.type === 'pyramid'){
                    this.window_objs.mainWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_PUBLIC_INIT,
                        payload: arg.msg
                    });
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
                }
            });
            /** 检测失败 */
            ipcMain.on(ipcConfig.ON_DETECTION_ERROR, (event, arg) => {
                console.log(arg);
            });
        });
        // 先监听，后执行显示
        this.window_objs.runWindow.show();
    }
}

module.exports = message
