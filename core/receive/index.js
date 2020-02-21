const { ipcMain, dialog, BrowserView } = require('electron');
const path = require('path');
const killPort = require("../service/killPort");
const config = require('../config/window.config');
const { ActionTypes } = require('../config/event.config');
const pyramidControl = require("../pyramidControl");
const _window = require('../service/window');

class receive {
    constructor(window_objs, moduleWindow) {
        this.window_objs = window_objs;
        this.moduleWindow = null;
        this.pyramidControl = new pyramidControl;

        ipcMain.on('site-message', (event, arg) => {
            if (arg.hasOwnProperty('type')) {
                switch (arg.type) {
                    case ActionTypes.SEND_PROJECT_BLOCK_PACKAGE_INFO:
                        this.pyramidControl.getBlockPackageInfo(this.window_objs.runWindow, arg.payload);
                        break;
                    //    私有区块包取消订阅
                    case ActionTypes.SEND_UNSUBSCRIBE_PRIVATE_BLOCK_PACKAGE:
                        this.pyramidControl.deletePrivateBlockPackage(arg.payload.ids, (errMessage) => {
                            let result = true;
                            let resultCode = 0;
                            if (errMessage) {
                                result = false;
                                // 随便指定一个
                                resultCode = -1;
                            }
                            // 反馈
                            this.window_objs.mainWindow.webContents.send('site-message', {
                                type: ActionTypes.RECEIVE_CMD_EXECUTE_RESULT,
                                payload: {
                                    pyramidUIActionType: ActionTypes.SEND_UNSUBSCRIBE_PRIVATE_BLOCK_PACKAGE,
                                    cmdExecuteResult: result,
                                    cmdExecuteResultCode: resultCode,
                                    cmdExecuteMessage: errMessage
                                }
                            });
                        });
                        break;
                    case ActionTypes.SEND_INSERT_PRIVATE_BLOCK_PACKAGE_INFO:
                        this.pyramidControl.insertPrivateBlockPackage(arg.payload, (errMessage) => {
                            let result = true;
                            let resultCode = 0;
                            if (errMessage) {
                                result = false;
                                // 随便指定一个
                                resultCode = -1;
                            }
                            // 反馈
                            this.window_objs.mainWindow.webContents.send('site-message', {
                                type: ActionTypes.RECEIVE_CMD_EXECUTE_RESULT,
                                payload: {
                                    pyramidUIActionType: ActionTypes.SEND_INSERT_PRIVATE_BLOCK_PACKAGE_INFO,
                                    cmdExecuteResult: result,
                                    cmdExecuteResultCode: resultCode,
                                    cmdExecuteMessage: errMessage
                                }
                            });
                        });
                        break;
                        // 查找私有区块包列表
                    case ActionTypes.SEND_GET_PRIVATE_BLOCK_PACKAGE_LIST:
                        this.pyramidControl.findPrivateBlockPackageList((rows) => {
                            this.window_objs.mainWindow.webContents.send('site-message', {
                                type: ActionTypes.RECEIVE_GET_PRIVATE_BLOCK_PACKAGE_LIST,
                                payload: {
                                    packageInfoList: rows
                                }
                            });
                            if (this.moduleWindow) {
                                this.moduleWindow.webContents.send('site-message', {
                                    type: ActionTypes.RECEIVE_GET_PRIVATE_BLOCK_PACKAGE_LIST,
                                    payload: {
                                        packageInfoList: rows
                                    }
                                });
                            }
                        });
                        break;
                    case ActionTypes.SEND_CMD_EXECUTE_RESULT:
                        // TODO 根据 pyramidUIActionType 判断往哪个窗口发
                        const { pyramidUIActionType } = arg.payload;
                        // 主窗口
                        this.window_objs.mainWindow.webContents.send('site-message', {
                            type: ActionTypes.RECEIVE_CMD_EXECUTE_RESULT,
                            payload: arg.payload
                        });
                        // if (pyramidUIActionType === ActionTypes.SEND_PROJECT_CREATE) {
                        //
                        // } else {
                        //
                        // }
                        break;
                    // 打开指定项目操作窗口
                    case ActionTypes.SEND_PROJECT_OPENWINDOW:
                        this.view = new BrowserView({
                            webPreferences: {
                                nodeIntegration: false,
                                preload: path.resolve(__dirname, '../../', 'preload.js')
                            }
                        })

                        this.window_objs.mainWindow.setBrowserView(this.view);
                        this.window_objs.mainWindow.loadURL(config.projectWin.loadUrl);
                        this.view.setBounds({ x: 0, y: 64, width: 1600, height: 1000 })
                        this.view.webContents.loadURL('http://localhost:9100')
                        this.view.webContents.openDevTools({ mode: 'right' });
                        this.resizeWin(this.view);
                        break;
                    // 项目工具栏打开    
                    case ActionTypes.SEND_PROJECT_TOOLBAR:
                        const { type } = arg.payload;
                        switch (type) {
                            case 'back':
                                this.view.destroy();
                                this.window_objs.mainWindow.destroy();
                                this.window_objs.mainWindow = _window(config.mainWin);
                                this.window_objs.mainWindow.show();
                                break;
                            case 'layout':
                            case 'module':
                            case 'block':
                                const moduleWin = JSON.parse(JSON.stringify(config.moduleWin));
                                this.pyramidControl.getNowProjectInfo((projectInfo) => {
                                    moduleWin.loadUrl = moduleWin.loadUrl + type + '?projectInfo=' + JSON.stringify(projectInfo);
                                    if (this.moduleWindow) {
                                        this.moduleWindow.destroy();
                                        this.moduleWindow = null;
                                    }
                                    this.moduleWindow = _window(moduleWin);
                                    this.moduleWindow.show();
                                });
                                break;
                            case 'build':
                                break;
                            default:
                                break;
                        }
                        break;
                    // 显示控制台    
                    case ActionTypes.SEND_PUBLIC_OPEN_CONSOLE:
                        if (!this.showDevTools)
                            this.window_objs.mainWindow.openDevTools();
                        else
                            this.window_objs.mainWindow.closeDevTools();

                        this.showDevTools = !this.showDevTools;
                        break;
                    // 直接执行命令
                    case ActionTypes.SEND_PUBLIC_CMD:
                        const payload = arg.payload;
                        // 用项目信息拼接创建执行命令
                        const cmdArg = {
                            channel: 'cmd-message',
                            flag: 'cmd-public-cmd',
                            cmdStr: payload.cmd,
                            cwd: payload.cwd,
                            callbackId: payload.callbackId
                        }
                        // 将此命令发送给渲染窗口执行
                        this.window_objs.runWindow.webContents.send('cmd-message', cmdArg);
                        break;
                    // 创建项目    
                    case ActionTypes.SEND_PROJECT_CREATE:
                            this.pyramidControl.createProject(arg.payload, this.window_objs.runWindow);
                        break;
                    // 导入项目
                    case ActionTypes.SEND_PROJECT_IMPORT:
                        this.pyramidControl.importProject(arg.payload, this.window_objs.runWindow);
                        break;
                    // 项目删除    
                    case ActionTypes.SEND_PROJECT_REMOVE:
                        const projecNames = arg.payload.projectNames;
                        this.pyramidControl.removeProjects(projecNames, (s) => {
                            this.window_objs.mainWindow.webContents.send('site-message', arg);
                        });
                        break;
                    // 查询项目列表的请求
                    case ActionTypes.SEND_PROJECT_LIST:
                        const option = arg.payload.hasOwnProperty('platform') ? { platform: arg.payload.platform } : {};
                        console.log(option);
                        this.pyramidControl.findProject(option, (res) => {
                            this.window_objs.mainWindow.webContents.send('site-message',
                                {
                                    type: ActionTypes.RECEIVE_PROJECT_LIST,
                                    payload: {
                                        projects: res
                                    }
                                }
                            );
                        });
                        break;
                    // 路径选择
                    case ActionTypes.SEND_PROJECT_CHOOSE_PATH:
                        dialog.showOpenDialog({
                            properties: ['openDirectory', 'createDirectory', 'promptToCreate']
                        }, function (files) {
                            if (files) event.sender.send('site-message', {
                                type: ActionTypes.RECEIVE_PROJECT_CHOOSE_PATH,
                                payload: {
                                    files: files[0]
                                }
                            })
                        })
                        break;
                    case ActionTypes.SEND_PROJECT_BLOCK_SELECT:
                        this.window_objs.mainWindow.focus();
                        const { key, gitUrl } = arg.payload;
                        this.view.webContents.send('site-message', {
                            type: ActionTypes.RECEIVE_PROJECT_BLOCK_SELECT,
                            payload: {
                                key,
                                gitUrl
                            }
                        });
                        break;
                    //    添加区块到项目（请不要随便删除）
                    case ActionTypes.SEND_PROJECT_BLOCK_CLICKSECTION:
                        if (this.moduleWindow) {
                            this.moduleWindow.show();
                        }
                        this.pyramidControl.getNowProjectInfo((projectInfo) => {
                            this.pyramidControl.clickSection(arg.payload, this.window_objs.runWindow, projectInfo);
                        });
                        break;
                    //    添加布局到项目（请不要随便删除）
                    case ActionTypes.SEND_PROJECT_LAYOUT_CLICKSECTION:
                        if (this.moduleWindow) {
                            this.moduleWindow.show();
                        }
                        this.pyramidControl.getNowProjectInfo((projectInfo) => {
                            this.pyramidControl.createLayout(arg.payload, this.window_objs.runWindow, projectInfo);
                        });
                        break;
                    // 路由模块创建
                    case ActionTypes.SEND_PROJECT_MODULE_CREATE:
                        if (this.moduleWindow) {
                            this.moduleWindow.show();
                        }
                        const ModuleInfo = arg.payload;
                        this.pyramidControl.getNowProjectInfo((projectInfo) => {
                            // projectService.passAction( 'cmd-module-create', ModuleInfo,  self.window_objs.runWindow, );
                            this.pyramidControl.createModule(ModuleInfo, this.window_objs.runWindow, projectInfo);
                        });
                        break;
                    // 区块包创建    
                    case ActionTypes.SEND_PROJECT_BLOCK_CREATE:
                        let blockInfo = arg.payload.blockPackageInfo;
                        this.pyramidControl.createBlock(blockInfo, this.window_objs.runWindow);
                        break;
                    // 区块创建     
                    case ActionTypes.SEND_PROJECT_BLOCK_ITEM_CREATE:
                        const blockItemPayload = arg.payload;
                        // this.pyramidControl.findBlock((res) => {
                        //     const fatherBlock = res.filter((val) => {
                        //         return val._id == blockItemInfo.parentId
                        //     })[0]
                        //     let newBlockInfo = { ...blockItemInfo };
                        //     newBlockInfo['filePath'] = fatherBlock['filePath'] + '/' + fatherBlock['menuNameEn']
                        //     this.pyramidControl.createBlockItem(newBlockInfo, this.window_objs.runWindow)
                        // });
                        this.pyramidControl.createBlockItem(blockItemPayload, this.window_objs.runWindow);
                        break;
                    // 区块分类创建
                    case ActionTypes.SEND_PROJECT_BLOCK_TYPES_CREATE:
                        const typePayload = arg.payload;

                        // 直接调用
                        this.pyramidControl.createBlocksType(typePayload, this.window_objs.runWindow);

                        // this.pyramidControl.findBlock((res) => {
                        //     const fatherBlock = res.filter((val) => {
                        //         return val._id === typePayload._id;
                        //     })[0];
                        //     let newBlockTypes = { ...typePayload };
                        //     newBlockTypes['filePath'] = fatherBlock['filePath'] + '/' + fatherBlock['menuNameEn'];
                        //     this.pyramidControl.createBlocksType(newBlockTypes, this.window_objs.runWindow)
                        // });

                        break;

                    // 查询区块包    
                    case ActionTypes.SEND_PROJECT_BLOCK_GET:
                        this.pyramidControl.findBlock((res) => {
                            if (res.length != 0) {
                                let fatherBlock = [...res]
                                if(arg.payload.applyType){
                                    if(arg.payload.applyType != '100'){
                                        let arr = []
                                        fatherBlock.forEach((item)=>{
                                            if(item.applyType == arg.payload.applyType){
                                                arr.push(item)
                                            }
                                        })
                                        fatherBlock = arr
                                    }
                                }
                                if(arg.payload.chineseName){
                                    let arr = []
                                    fatherBlock.forEach((item)=>{
                                        if(item.menuNameZh.indexOf(arg.payload.chineseName) != -1){
                                            arr.push(item)
                                        }
                                    })
                                    fatherBlock = arr
                                }
                                this.window_objs.mainWindow.webContents.send('site-message', {
                                    type: ActionTypes.RECEIVE_PROJECT_BLOCK_LIST,
                                    payload: fatherBlock
                                });
                            }
                        })
                        break;

                    // 区块包删除
                    case ActionTypes.SEND_PROJECT_BLOCK_REMOVE:
                        const blockId = arg.payload;
                        console.log('blockId:', blockId)
                        this.pyramidControl.removeBlock(blockId, (num) => {
                            this.pyramidControl.findBlock((res) => {
                                let newRes = [...res]
                                this.window_objs.mainWindow.webContents.send('site-message', {
                                    type: ActionTypes.RECEIVE_PROJECT_BLOCK_LIST,
                                    payload: newRes
                                });
                            })
                        })
                        event.sender.send('site-message', {
                            type: ActionTypes.RECEIVE_PROJECT_BLOCK_REMOVE,
                            payload: {
                                removed: true
                            }
                        })
                        break;
                    // 发送获取项目路由树消息
                    case ActionTypes.SEND_PROJECT_MODULE_GET_ROUTE_TREE:
                        this.pyramidControl.getNowProjectInfo((projectInfo) => {
                            this.pyramidControl.getProjectRouteTree(this.window_objs.runWindow, projectInfo);
                        })
                        break;
                    // 布局创建
                    case ActionTypes.SEND_PROJECT_LAYOUT_CHOOSE:
                        const { column } = arg.payload;
                        // 关闭该设置窗口
                        // self.moduleWindow.close();
                        this.window_objs.mainWindow.focus();
                        this.view.webContents.send('site-message', {
                            type: ActionTypes.RECEIVE_PROJECT_LAYOUT_SELECTCOLUMN,
                            payload: {
                                column: column
                            }
                        });
                        // const ModuleInfo = arg.payload;
                        // projectService.passAction('cmd-module-create', ModuleInfo, self.window_objs.runWindow);
                        break;
                    // 启动项目    
                    case ActionTypes.SEND_PROJECT_START:
                        new killPort(9100, (s) => {
                            // 将当前需要操作的项目信息保存到库
                            this.pyramidControl.updataProjectInfo(arg.payload.projectInfo);
                            this.pyramidControl.start(arg.payload.projectInfo, this.window_objs.runWindow)
                        });
                        break;
                    default:
                        break;
                }
            }

            // 收到项目列表的请求
            if (arg.hasOwnProperty('projectList')) {
                // 查找数据
                this.pyramidControl.findProject((p) => {
                    // if (p.length != 0) {
                    this.window_objs.mainWindow.webContents.send('site-message', { projectInfo: true, msg: p });
                    // }
                })

            }


            if (arg.hasOwnProperty('build')) {
                // 给渲染进程发送信息
                if (this.window_objs.runWindow != null) {
                    this.window_objs.runWindow.webContents.send('ping', { test: 'whoooooooh!3333' });
                }
            }

            //  传递给内部工程的测试
            if (arg.hasOwnProperty('publish')) {
                this.view.webContents.executeJavaScript(`window.postMessage(
                  JSON.stringify({
                      action:  'umi.ui.enable.GUmiUIFlag',
                  }),
                  '*'
            );`, true);
            }

            if (arg.hasOwnProperty('module')) {
                // 点击了模块按钮
                console.log('这里是路由窗口的打开')
                this.moduleWindow = _window(config.moduleWin);
                // self.moduleWindow.setParentWindow(projectWindow);
                this.moduleWindow.show()
            }

        })
    }

    getModuleWindow() {
        return this.moduleWindow;
    }
    /**
   * 调节项目窗口尺寸时view的变化
   */
    resizeWin(view) {
        const options = { width: true, height: true, horizontal: true, vertical: true }
        view.setAutoResize(options);
    }
}

module.exports = receive