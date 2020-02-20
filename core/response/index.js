/** templet的响应完成用于回复内工程 */
const { ipcMain } = require('electron');
const { ActionTypes } = require('../config/event.config');
const { ECliMessageType } = require('../config/cliMessageType.config');

class response {
    constructor(window_objs, receive) {
        this.window_objs = window_objs;
        this.receive = receive;

        ipcMain.on('cmd-message', (event, arg) => {
            const cmdStatus = arg.cmdStatus;
            const cmdMessage = arg.cmdMessage || '';
            const cmdFlag = arg.cmdMessage;
            const cmdCloseCode = arg.cmdCloseCode;

            if (arg.flag === 'cmd-public-cmd') {
                if (this.window_objs.mainWindow != null) {
                    this.window_objs.mainWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_PUBLIC_CMD,
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
                        payload: { ...arg, type: ECliMessageType.CHILDREN_PROJECT_CREATE }
                    });
                }
            }

            // 导入项目
            if (arg.flag === 'cmd-children-project-import') {
                if (this.window_objs.mainWindow != null) {
                    // 发送CLI消息回显，带上类型
                    this.window_objs.mainWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: { ...arg, type: ECliMessageType.CHILDREN_PROJECT_CREATE }
                    });
                }
            }

            // 项目启动
            if (arg.flag === 'cmd-children-project-start') {
                if (this.window_objs.mainWindow != null) {
                    this.window_objs.mainWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: { ...arg, type: ECliMessageType.CHILDREN_PROJECT_START }
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
                        payload: { ...arg, type: ECliMessageType.CHILDREN_PROJECT_MODULE_CREATE }
                    });
                }
            }

            // 添加布局到项目
            if (arg.flag === 'cmd-children-project-layout-create') {
                if (this.receive.getModuleWindow() != null) {
                    this.receive.getModuleWindow().webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: { ...arg, type: ECliMessageType.CHILDREN_PROJECT_LAYOUT_CREATE }
                    });
                }
            }

            // 添加区块到项目
            if (arg.flag === 'cmd-children-project-block-create') {
                if (this.receive.getModuleWindow() != null) {
                    this.receive.getModuleWindow().webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: { ...arg, type: ECliMessageType.CHILDREN_PROJECT_BLOCK_CREATE }
                    });
                }
            }

            // 获取子项目路由树
            if (arg.flag === 'cmd-children-project-get-route-tree') {
                const msg = arg.cmdMessage;
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

            // 读取区块包信息
            if (arg.flag === 'cmd-get-block-package-info') {
                if (cmdStatus === 'end') {
                    // 结束反馈执行结果
                    if(arg.projectId) {

                    } else {
                        if (this.window_objs.mainWindow !== null) {
                            this.window_objs.mainWindow.webContents.send('site-message', {
                                type: ActionTypes.RECEIVE_CMD_EXECUTE_RESULT,
                                payload: {
                                    pyramidUIActionType: ActionTypes.SEND_PROJECT_BLOCK_PACKAGE_INFO,
                                    cmdExecuteResult: cmdCloseCode === 0,
                                    cmdExecuteResultCode: cmdCloseCode
                                }
                            });
                        }
                    }
                }

                if (cmdStatus === 'progress') {
                    if (typeof cmdMessage === 'string' && cmdMessage.indexOf('pyramid-blocks-info:') !== -1) {
                        const treeJSON = cmdMessage.split('pyramid-blocks-info:')[1].trim();
                        const packageInfo = JSON.parse(treeJSON);
                        // 发送消息到子工程
                        if(arg.projectId){
                            if (this.receive.getModuleWindow() != null) {
                                this.receive.getModuleWindow().webContents.send('site-message', {
                                    type: ActionTypes.RECEIVE_PROJECT_BLOCK_PACKAGE_INFO,
                                    payload: {
                                        packageInfo,
                                        projectId: arg.projectId || null
                                    }
                                });
                            }
                        }else{
                            this.window_objs.mainWindow.webContents.send('site-message', {
                                type: ActionTypes.RECEIVE_PROJECT_BLOCK_PACKAGE_INFO,
                                payload: {packageInfo}
                            });
                        }
                    }
                }
            }

            // 区块包创建
            if (arg.flag === 'cmd-block-package-create') {
                if (this.window_objs.mainWindow != null) {
                    // 发送CLI消息回显，带上类型
                    this.window_objs.mainWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: { ...arg, type: ECliMessageType.PROJECT_BLOCK_PACKAGE_CREATE }
                    });
                }
            }
            // 区块创建
            if (arg.flag === 'cmd-block-item-create') {
                if (this.window_objs.mainWindow != null) {
                    // 发送CLI消息回显，带上类型
                    this.window_objs.mainWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: { ...arg, type: ECliMessageType.PROJECT_BLOCK_ITEM_CREATE }
                    });
                }
            }
            // 区块包类型创建
            if (arg.flag === 'cmd-blocks-type-create') {
                if (this.window_objs.mainWindow != null) {
                    // 发送CLI消息回显，带上类型
                    this.window_objs.mainWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: { ...arg, type: ECliMessageType.PROJECT_BLOCKS_TYPE_CREATE }
                    });
                }
            }
        })
    }
}

module.exports = response;