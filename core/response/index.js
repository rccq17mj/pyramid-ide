/** templet的响应完成用于回复内工程 */
const { ipcMain } = require('electron');
const { ActionTypes } = require('../config/event.config');
const { CliMessageTypes } = require('../config/cliMessageType.config');

class response {
    constructor(window_objs, receive) {
        this.window_objs = window_objs;
        this.receive = receive;

        ipcMain.on('project-start', function (event, arg) {
            this.window_objs.mainWindow.webContents.send('site-message', {
                type: 'pyramid.ui.receive.project.start',
                payload: arg
            });
        })

        ipcMain.on('cmd-message', (event, arg) => {
            let reData = {
                type: ActionTypes.RECEIVE_CLI_MESSAGE,
                payload: {...arg, cliType: null}
            }
            if (this.window_objs.mainWindow != null || this.window_objs.runWindow != null) {
                switch (arg.flag) {
                    // 获取区块包信息
                    case 'cmd-get-block-package-info':
                        if (typeof arg.msg === 'string' && arg.msg.indexOf('pyramid-blocks-info:') !== -1) {
                            const treeJSON = arg.msg.split('pyramid-blocks-info:')[1].trim();
                            const tree = JSON.parse(treeJSON);
                            // 发送消息到子工程
                            if (this.receive.getModuleWindow() != null) {
                                reData.type = ActionTypes.RECEIVE_PROJECT_BLOCK_PACKAGE_INFO;
                                reData.payload.blockInfo = tree;
                            }else
                                reData = null;
                        }
                        break;
                    // 直接调用命令行    
                    case 'cmd-public-cmd':
                        reData.type = arg.cli ? ActionTypes.RECEIVE_CLI_MESSAGE : ActionTypes.RECEIVE_PUBLIC_CMD
                        break;
                    // 项目创建    
                    case 'cmd-children-project-create':
                        reData.payload.cliType = CliMessageTypes.CHILDREN_PROJECT_CREATE
                        break;
                    // 启动项目        
                    case 'cmd-children-project-start':
                        reData.payload.cliType = CliMessageTypes.CHILDREN_PROJECT_START
                        break;
                    // 添加模块到项目    
                    case 'cmd-children-project-start':
                        reData.payload.cliType = CliMessageTypes.CHILDREN_PROJECT_MODULE_CREATE
                        break;
                     // 添加布局到项目    
                    case 'cmd-children-project-start':
                        reData.payload.cliType = CliMessageTypes.CHILDREN_PROJECT_LAYOUT_CREATE
                        break;
                    // 添加模版到项目
                    case 'cmd-children-project-module-create':
                        reData.payload.cliType = CliMessageTypes.CHILDREN_PROJECT_MODULE_CREATE;
                        break; 
                    // 添加区块到项目    
                    case 'cmd-children-project-block-create':
                        reData.payload.cliType = CliMessageTypes.CHILDREN_PROJECT_BLOCK_CREATE
                        break;
                    // 区块包创建    
                    case 'cmd-block-package-create':
                        reData.payload.cliType = CliMessageTypes.PROJECT_BLOCK_PACKAGE_CREATE
                        break;    
                    // 区块创建    
                    case 'cmd-block-item-create':
                        reData.payload.cliType = CliMessageTypes.PROJECT_BLOCK_ITEM_CREATE
                        break; 
                    // 获取子项目路由树    
                    case 'cmd-children-project-get-route-tree':
                        const msg = arg.msg;
                        if (typeof msg === 'string' && msg.indexOf('routes:') !== -1) {
                            const treeJSON = msg.split('routes:')[1].trim();
                            const tree = JSON.parse(treeJSON);
                            // 发送消息到子工程
                            if (this.receive.getModuleWindow() != null) {
                                reData.type = ActionTypes.RECEIVE_PROJECT_MODULE_GET_ROUTE_TREE
                                reData.payload.routerTree = tree;
                            }else
                            reData = null;
                        }
                    break;    
                }
            }
            if(reData){
                console.log('回复templet工程消息:', reData);
                this.window_objs.mainWindow.webContents.send('site-message', reData);
            }
        })
    }
}

module.exports = response