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
                        this.resizeWin(this.view)
                        break;
                    // 项目工具栏打开    
                    case ActionTypes.SEND_PROJECT_TOOLBAR:
                        const msg = arg.payload;
                        // console.log('msg--', msg)
                        if (msg.hasOwnProperty('back')) {
                            // 初始化主窗口
                            //self.window_objs.mainWindow.loadURL(config.mainWin.loadUrl);
                            this.view.destroy();
                            this.window_objs.mainWindow.destroy()
                            this.window_objs.mainWindow = _window(config.mainWin);

                        } else {
                            this.moduleWindow = _window(config.moduleWin);
                            this.moduleWindow.show()
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
                            cli: payload.cli,
                            cliType: payload.cliType,
                            callbackId: payload.callbackId
                        }
                        // 将此命令发送给渲染窗口执行
                        this.window_objs.runWindow.webContents.send('cmd-message', cmdArg);
                        break;
                    case ActionTypes.SEND_PROJECT_CREATE:
                            const projectInfo = arg.payload;
                            // projectService.passAction('cmd-project-create', projectInfo, self.window_objs.runWindow)
                            this.pyramidControl.createProject(projectInfo, this.window_objs.runWindow)
                        break;
                    // 项目删除    
                    case ActionTypes.SEND_PROJECT_REMOVE:
                        const projecNames = arg.payload;
                        console.log('projecNames:', projecNames)
                        this.pyramidControl.removeProjects(projecNames, (s) => {
                            this.window_objs.mainWindow.webContents.send('site-message', arg);
                        })

                        event.sender.send('site-message', {
                            type: ActionTypes.RECEIVE_PROJECT_REMOVE,
                            payload: {
                                removed: true
                            }
                        })
                        break;
                    // 查询项目列表的请求
                    case ActionTypes.SEND_PROJECT_LIST:
                        const option = arg.payload.hasOwnProperty('platform') ? { platform: arg.payload.platform } : {};
                        this.pyramidControl.findProject(option, (res) => {
                            this.window_objs.mainWindow.webContents.send('site-message',
                                {
                                    type: ActionTypes.RECEIVE_PROJECT_LIST,
                                    payload: {
                                        data: res
                                    }
                                }
                            );
                        })
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
                            type: 'pyramid.ui.children.receive.project.block.select',
                            payload: {
                                key,
                                gitUrl
                            }
                        });
                        break;
                    // 区块包创建    
                    case ActionTypes.SEND_PROJECT_BLOCK_CREATE:
                        let blockInfo = arg.payload;
                        this.pyramidControl.createBlock(blockInfo, this.window_objs.runWindow)
                        break;
                    // 区块创建     
                    case ActionTypes.SEND_PROJECT_BLOCK_ITEM_CREATE:
                        blockInfo = arg.payload;
                        this.pyramidControl.findBlock((res) => {
                            console.log('查找区块包', res)
                            const fatherBlock = res.filter((val) => {
                                return val._id == blockInfo.parentId
                            })[0]
                            console.log('fatherBlock', fatherBlock)
                            let newBlockInfo = { ...blockInfo }
                            newBlockInfo['filePath'] = fatherBlock['filePath'] + '/' + fatherBlock['menuNameEn']
                            this.pyramidControl.createBlockItem(newBlockInfo, this.window_objs.runWindow)
                        })
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
                    // 查询区块    
                    case ActionTypes.SEND_PROJECT_BLOCK_ITEM_GET:
                        // 查找数据
                        this.pyramidControl.findBlockItem((res) => {
                            console.log('找到的区块', res)
                            console.log('传进的id', arg.payload)
                            const fatherBlock = [...res].filter((val) => {
                                return val.parentId == arg.payload.parentId
                            })
                            this.window_objs.mainWindow.webContents.send('site-message', {
                                type: ActionTypes.RECEIVE_PROJECT_BLOCK_ITEM_LIST,
                                payload: fatherBlock
                            });

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
                    // 路由模块创建
                    case ActionTypes.SEND_PROJECT_MODULE_CREATE:
                        const ModuleInfo = arg.payload;
                        this.pyramidControl.getNowProjectInfo((projectInfo) => {
                            // projectService.passAction( 'cmd-module-create', ModuleInfo,  self.window_objs.runWindow, );
                            this.pyramidControl.createModule(ModuleInfo, this.window_objs.runWindow, projectInfo);
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
                            type: 'pyramid.ui.children.receive.project.layout.selectColumn',
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