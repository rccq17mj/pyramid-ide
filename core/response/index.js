/** templet的响应完成用于回复内工程 */
const { ipcMain } = require('electron');
const { ActionTypes } = require('../config/event.config');
const { ECliMessageType } = require('../config/cliMessageType.config');

class response {
    constructor(window_objs, receive) {
        this.window_objs = window_objs;
        this.receive = receive;

        ipcMain.on('project-start', function (event, arg) {
            this.window_objs.mainWindow.webContents.send('site-message', {
                type: ActionTypes.RECEIVE_PROJECT_START,
                payload: arg
            });
        })

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

        // 读取区块包信息
        if (arg.flag === 'cmd-get-block-package-info') {
            const msg = arg.msg;
            if (typeof msg === 'string' && msg.indexOf('pyramid-blocks-info:') !== -1) {
                const treeJSON = msg.split('pyramid-blocks-info:')[1].trim();
                const packageInfo = JSON.parse(treeJSON);
                // 发送消息到子工程
                if (this.receive.getModuleWindow() != null) {
                    this.receive.getModuleWindow().webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_PROJECT_BLOCK_PACKAGE_INFO,
                        payload: {
                            packageInfo,
                            projectId: arg.projectId
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
        })
    }
}

module.exports = response;