const { ipcMain } = require('electron');
const ipcConfig = require('../config/ipcArg.config');
const eventConfig = require('../config/event.config');
const ENV = require('../config/env.config');
const { ActionTypes } = require('../config/event.config');
const { CliMessageTypes } = require('../config/cliMessageType.config');
const receive = require('../receive');

class message {

    constructor(window_objs) {
        this.window_objs = window_objs;
        this.receive = new receive(window_objs);
        this.moduleWindow = this.receive.getModuleWindow();
        this.showDevTools = false;
        this.listenCmdCreate();
        this.listenProjectStart();
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

    /**
     * 收到命令处理后的信息，回传给前端模板工程
     */
    listenCmdCreate() {
        ipcMain.on('cmd-message', (event, arg) => {

            // 直接执行某条命令(这里增加了callbackId)
            if (arg.flag === 'cmd-public-cmd') {
                if (this.window_objs.mainWindow != null) {
                    this.window_objs.mainWindow.webContents.send('site-message', {
                        type: arg.cli? ActionTypes.RECEIVE_CLI_MESSAGE : ActionTypes.RECEIVE_PUBLIC_CMD,
                        payload: arg
                    });
                }
            }

            // 项目创建
            if (arg.flag === 'cmd-children-project-create') {
                if (this.window_objs.mainWindow != null) {
                    // 发送CLI消息回显，带上类型
                    this.window_objs.mainWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: { ...arg, cliType: CliMessageTypes.CHILDREN_PROJECT_CREATE }
                    });
                }
            }

            // 项目启动
            if (arg.flag === 'cmd-children-project-start') {
                if (this.window_objs.mainWindow != null) {
                    this.window_objs.mainWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: { ...arg, cliType: CliMessageTypes.CHILDREN_PROJECT_START }
                    });
                }
            }

            // 添加模块到项目
            if (arg.flag === 'cmd-children-project-module-create') {
                if (this.receive.getModuleWindow() != null) {
                    // self.moduleWindow.webContents.send('site-message', {
                    //     type: 'pyramid.ui.receive.project.module.create',
                    //     payload: arg
                    // });
                    this.receive.getModuleWindow().webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: { ...arg, cliType: CliMessageTypes.CHILDREN_PROJECT_MODULE_CREATE }
                    });
                }
            }

            // 添加布局到项目
            if (arg.flag === 'cmd-children-project-layout-create') {
                if (this.receive.getModuleWindow() != null) {
                    this.receive.getModuleWindow().webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: { ...arg, cliType: CliMessageTypes.CHILDREN_PROJECT_LAYOUT_CREATE }
                    });
                }
            }

            // 添加区块到项目
            if (arg.flag === 'cmd-children-project-block-create') {
                if (this.receive.getModuleWindow() != null) {
                    this.receive.getModuleWindow().webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: { ...arg, cliType: CliMessageTypes.CHILDREN_PROJECT_BLOCK_CREATE }
                    });
                }
            }

            // 获取子项目路由树
            if (arg.flag === 'cmd-children-project-get-route-tree') {
                const msg = arg.msg;
                if (typeof msg === 'string' && msg.indexOf('routes:') !== -1) {
                    const treeJSON = msg.split('routes:')[1].trim();
                    const tree = JSON.parse(treeJSON);
                    // 发送消息到子工程
                    if (this.receive.getModuleWindow() != null) {
                        this.receive.getModuleWindow().webContents.send('site-message', {
                            type: ActionTypes.RECEIVE_PROJECT_MODULE_GET_ROUTE_TREE,
                            payload: {
                                routerTree: tree
                            }
                        });
                    }
                }
            }

            // 区块包创建
            if (arg.flag === 'cmd-block-package-create') {
                if (this.window_objs.mainWindow != null) {
                    // 发送CLI消息回显，带上类型
                    this.window_objs.mainWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: { ...arg, cliType: CliMessageTypes.PROJECT_BLOCK_PACKAGE_CREATE }
                    });
                }
            }
            // 区块创建
            if (arg.flag === 'cmd-block-item-create') {
                if (this.window_objs.mainWindow != null) {
                    // 发送CLI消息回显，带上类型
                    this.window_objs.mainWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: { ...arg, cliType: CliMessageTypes.PROJECT_BLOCK_ITEM_CREATE }
                    });
                }
            }
        })
    }

    listenProjectStart() {
        var self = this;
        ipcMain.on('project-start', function (event, arg) {
            self.window_objs.mainWindow.webContents.send('site-message', {
                type: 'pyramid.ui.receive.project.start',
                payload: arg
            });
        })
    }
    //{ 'cmd-starting': true, ...arg }
}

module.exports = message
