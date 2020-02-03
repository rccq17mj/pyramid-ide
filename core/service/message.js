const { ipcMain, dialog, BrowserView, ipcRenderer } = require('electron');
const path = require('path');
const electron  = require('electron');
const config = require('../config/window.config');
const ipcConfig = require('../config/ipcArg.config');
const eventConfig = require('../config/event.config');
const ENV = require('../config/env.config');
const _window = require('./window');
const ProjectServer = require("./project");
const {ActionTypes} = require('../config/event.config');
const {CliMessageTypes} = require('../config/cliMessageType.config');
const killPort = require("./killPort");
const projectService = new ProjectServer;
const MessageOut = require("./messageOut");
const messageOut = new MessageOut;

class message {

    constructor(window_objs) {
        this.window_objs = window_objs;
        this.moduleWindow = null;
        this.showDevTools = false;
        this.listenCmdCreate();
        this.listenProjectStart();
        this.listenSiteNotice();
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

        var self = this;
        ipcMain.on('cmd-message', function (event, arg) {

            // 项目创建
            if (arg.flag === 'cmd-children-project-create') {
                if (self.window_objs.mainWindow != null) {
                    // 发送CLI消息回显，带上类型
                    self.window_objs.mainWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: {...arg, type: CliMessageTypes.CHILDREN_PROJECT_CREATE}
                    });
                }
            }

            // 项目启动
            if (arg.flag === 'cmd-children-project-start') {
                if (self.window_objs.mainWindow != null) {
                    self.window_objs.mainWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: {...arg, type: CliMessageTypes.CHILDREN_PROJECT_START}
                    });
                }
            }

            // 添加模块到项目
            if (arg.flag === 'cmd-children-project-module-create') {
                if (self.moduleWindow != null) {
                    // self.moduleWindow.webContents.send('site-message', {
                    //     type: 'pyramid.ui.receive.project.module.create',
                    //     payload: arg
                    // });
                    self.moduleWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: {...arg, type: CliMessageTypes.CHILDREN_PROJECT_MODULE_CREATE}
                    });
                }
            }

            // 添加布局到项目
            if (arg.flag === 'cmd-children-project-layout-create') {
                if (self.moduleWindow != null) {
                    self.moduleWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: {...arg, type: CliMessageTypes.CHILDREN_PROJECT_LAYOUT_CREATE}
                    });
                }
            }

            // 添加区块到项目
            if (arg.flag === 'cmd-children-project-block-create') {
                if (self.moduleWindow != null) {
                    self.moduleWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: {...arg, type: CliMessageTypes.CHILDREN_PROJECT_BLOCK_CREATE}
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
                    if (self.moduleWindow != null) {
                        self.moduleWindow.webContents.send('site-message', {
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
                if (self.window_objs.mainWindow != null) {
                    // 发送CLI消息回显，带上类型
                    self.window_objs.mainWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: {...arg, type: CliMessageTypes.PROJECT_BLOCK_PACKAGE_CREATE}
                    });
                }
            }
            // 区块创建
            if (arg.flag === 'cmd-block-item-create') {
                if (self.window_objs.mainWindow != null) {
                    // 发送CLI消息回显，带上类型
                    self.window_objs.mainWindow.webContents.send('site-message', {
                        type: ActionTypes.RECEIVE_CLI_MESSAGE,
                        payload: {...arg, type: CliMessageTypes.PROJECT_BLOCK_ITEM_CREATE}
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
                payload: arg } );
        })
    }
    //{ 'cmd-starting': true, ...arg }

    /**
     * 来自外部站点的请求
     */
    listenSiteNotice() {

        var self = this;
        var view = null;
        ipcMain.on('site-message', function (event, arg) {

            if (arg.hasOwnProperty('type')) {
                // 打开指定项目操作窗口
                if (arg.type == 'pyramid.ui.send.project.openWindow') {
                    view = new BrowserView({
                        webPreferences: {
                            nodeIntegration: false,
                            preload: path.resolve(__dirname, '../../', 'preload.js')
                        }
                    })

                    self.window_objs.mainWindow.setBrowserView(view);
                    self.window_objs.mainWindow.loadURL(config.projectWin.loadUrl);
                    view.setBounds({ x: 0, y: 64, width: 1600, height: 1000 })
                    view.webContents.loadURL('http://localhost:9100')
                    view.webContents.openDevTools({ mode: 'right' });
                    self.resizeWin(view)
                }



                // 获取当前环境版本
                if (arg.type == 'pyramid.ui.send.public.version') {
                }

                // 项目工具栏打开
                if (arg.type == ActionTypes.SEND_PROJECT_TOOLBAR) {
                    const msg = arg.payload;
                    // console.log('msg--', msg)
                    if(msg.hasOwnProperty('back')) {
                        // 初始化主窗口
                        //self.window_objs.mainWindow.loadURL(config.mainWin.loadUrl);
                        view.destroy();
                        self.window_objs.mainWindow.destroy()
                        self.window_objs.mainWindow = _window(config.mainWin);

                    } else {
                        self.moduleWindow = _window(config.moduleWin);
                        self.moduleWindow.show()
                    }

                }

                // 显示控制台
                if (arg.type == 'pyramid.ui.send.public.console') {
                    if (!self.showDevTools)
                        self.window_objs.mainWindow.openDevTools();
                    else
                        self.window_objs.mainWindow.closeDevTools();

                    self.showDevTools = !self.showDevTools;
                }

                // 项目删除
                if (arg.type == 'pyramid.ui.send.project.remove') {
                    const projecNames = arg.payload;
                    console.log('projecNames:', projecNames)
                    projectService.removeProjects(projecNames, (s) => {
                        self.window_objs.mainWindow.webContents.send('site-message', arg);
                    })

                    event.sender.send('site-message', {
                        type: 'pyramid.ui.receive.project.remove',
                        payload: {
                            removed: true
                        }
                    })
                }


                // 查询项目列表的请求
                if (arg.type == 'pyramid.ui.send.project.list') {
                    // 查找数据
                    // console.log(arg.payload)

                    const option = arg.payload.hasOwnProperty('platform')? {platform: arg.payload.platform}: {};
                    projectService.findProject(option, (res) => {
                        // if (res.length != 0) {
                        self.window_objs.mainWindow.webContents.send('site-message',
                        {
                            type: 'pyramid.ui.receive.project.list',
                            payload: {
                                data: res
                            }
                        }
                    );
                        // }
                    })
                }
                // 项目创建
                if (arg.type == 'pyramid.ui.send.project.create') {
                    const projectInfo = arg.payload;
                    // projectService.passAction('cmd-project-create', projectInfo, self.window_objs.runWindow)
                    projectService.createProject(projectInfo, self.window_objs.runWindow)
                }

                // 路径选择
                if (arg.type == 'pyramid.ui.send.project.choosePath') {
                    dialog.showOpenDialog({
                        properties: ['openDirectory', 'createDirectory', 'promptToCreate']
                    }, function (files) {
                        if (files) event.sender.send('site-message', {
                            type: 'pyramid.ui.receive.project.choosePath',
                            payload: {
                                files: files[0]
                            }
                        })
                    })
                }

                if (arg.type == 'pyramid.ui.send.project.block.select') {
                    // self.moduleWindow.close();
                    self.window_objs.mainWindow.focus();
                    const { key, gitUrl } = arg.payload;
                    view.webContents.send('site-message', {
                        type: 'pyramid.ui.children.receive.project.block.select',
                        payload: {
                            key,
                            gitUrl
                        }
                    });
                }

                // 区块选中
                if (arg.type == 'pyramid.ui.children.send.project.block.clickSection') {
                    const { filename, index, data } = arg.payload;
                    // console.log(arg.payload);
                    projectService.getNowProjectInfo((projectInfo) => {
                        console.log('arg.payload:', arg.payload)
                        projectService.clickSection(arg.payload, self.window_objs.runWindow, projectInfo);
                    })
                }

                // 区块包创建
                if (arg.type == ActionTypes.SEND_PROJECT_BLOCK_CREATE) {
                    const blockInfo = arg.payload;
                    projectService.createBlock(blockInfo, self.window_objs.runWindow)

                }

                // 区块创建
                if (arg.type == ActionTypes.SEND_PROJECT_BLOCK_ITEM_CREATE) {
                    const blockInfo = arg.payload;
                    projectService.findBlock((res) => {
                        console.log('查找区块包', res)
                        const fatherBlock = res.filter((val)=>{
                            return val._id == blockInfo.parentId
                        })[0]
                        console.log('fatherBlock', fatherBlock)
                        let newBlockInfo = {...blockInfo}
                        newBlockInfo['filePath'] = fatherBlock['filePath']+'/'+fatherBlock['menuNameEn']
                        projectService.createBlockItem(newBlockInfo, self.window_objs.runWindow)
                    })
                }

                // 查询区块包
                if (arg.type == ActionTypes.SEND_PROJECT_BLOCK_GET) {
                    // 查找数据
                    projectService.findBlock((res) => {
                        if (res.length != 0) {
                            self.window_objs.mainWindow.webContents.send('site-message', {
                                type: ActionTypes.RECEIVE_PROJECT_BLOCK_LIST,
                                payload: res });
                        }
                    })
                }

                // 查询区块
                if (arg.type == ActionTypes.SEND_PROJECT_BLOCK_ITEM_GET) {
                    // 查找数据
                    projectService.findBlockItem((res) => {
                        console.log('找到的区块', res)
                        console.log('传进的id', arg.payload)
                        const fatherBlock = [...res].filter((val)=>{
                            return val.parentId == arg.payload.parentId
                        })
                        self.window_objs.mainWindow.webContents.send('site-message', {
                            type: ActionTypes.RECEIVE_PROJECT_BLOCK_ITEM_LIST,
                            payload: fatherBlock });

                    })
                }

                // 区块包删除
                if (arg.type == ActionTypes.SEND_PROJECT_BLOCK_REMOVE) {
                    const blockId = arg.payload;
                    console.log('blockId:', blockId)
                    projectService.removeBlock(blockId, (num) => {
                        projectService.findBlock((res) => {
                            let newRes = [...res]
                            self.window_objs.mainWindow.webContents.send('site-message', {
                                type: ActionTypes.RECEIVE_PROJECT_BLOCK_LIST,
                                payload: newRes });
                        })
                    })
                    event.sender.send('site-message', {
                        type: ActionTypes.RECEIVE_PROJECT_BLOCK_REMOVE,
                        payload: {
                            removed: true
                        }
                    })
                }

                // 路由模块创建
                if (arg.type === ActionTypes.SEND_PROJECT_MODULE_CREATE) {
                    const ModuleInfo = arg.payload;
                    projectService.getNowProjectInfo((projectInfo) => {
                        // projectService.passAction( 'cmd-module-create', ModuleInfo,  self.window_objs.runWindow, );
                        projectService.createModule(ModuleInfo, self.window_objs.runWindow, projectInfo);
                    })

                }

                // 发送获取项目路由树消息
                if (arg.type === ActionTypes.SEND_PROJECT_MODULE_GET_ROUTE_TREE) {
                    projectService.getNowProjectInfo((projectInfo) => {
                        projectService.getProjectRouteTree(self.window_objs.runWindow, projectInfo);
                    })
                }

                // 布局创建
                if (arg.type == 'pyramid.ui.send.project.layout.choose') {
                    const { column } = arg.payload;

                    // 关闭该设置窗口
                    // self.moduleWindow.close();
                    self.window_objs.mainWindow.focus();
                    view.webContents.send('site-message', {
                        type: 'pyramid.ui.children.receive.project.layout.selectColumn',
                        payload: {
                            column: column
                        }
                    });

                    // const ModuleInfo = arg.payload;
                    // projectService.passAction('cmd-module-create', ModuleInfo, self.window_objs.runWindow);
                }

                // 布局选中
                if (arg.type == 'pyramid.ui.children.send.project.layout.clickSection') {
                    projectService.getNowProjectInfo((projectInfo) => {
                        // projectService.passAction('cmd-layout-chooseLayout', arg.payload, self.window_objs.runWindow, projectInfo);
                        projectService.createLayout(arg.payload, self.window_objs.runWindow, projectInfo);
                    })
                }

                // 启动项目
                if (arg.type === ActionTypes.SEND_PROJECT_START) {
                    new killPort(9100, (s) => {
                        // 将当前需要操作的项目信息保存到库
                        projectService.updataProjectInfo(arg.payload.projectInfo);
                        projectService.start(arg.payload.projectInfo, self.window_objs.runWindow)
                    });
                }

            }


            // if (arg.hasOwnProperty('project')) {
            //     const Msg = arg.msg;
            //     // nav栏请求打开窗口

            //     if (Msg == 'startProject') {
            //         // 启动该项目
            //         new killPort(9100, (s) => {
            //             //将当前需要操作的项目信息保存到库
            //             projectService.updataProjectInfo(arg.projectInfo);
            //             projectService.start(arg.projectInfo, self.window_objs.runWindow)
            //         });
            //     }
            // }

            // 关闭项目窗口
            // if (arg.hasOwnProperty('back')) {
            //     projectWindow.close();
            //     projectWindow = null;
            // }

            // 收到项目列表的请求
            if (arg.hasOwnProperty('projectList')) {
                // 查找数据
                projectService.findProject((p) => {
                    // if (p.length != 0) {
                        self.window_objs.mainWindow.webContents.send('site-message', { projectInfo: true, msg: p });
                    // }
                })

            }


            if (arg.hasOwnProperty('build')) {
                // 给渲染进程发送信息
                if (self.window_objs.runWindow != null) {
                    self.window_objs.runWindow.webContents.send('ping', { test: 'whoooooooh!3333' });
                }
            }

            //  传递给内部工程的测试
            if (arg.hasOwnProperty('publish')) {
                view.webContents.executeJavaScript(`window.postMessage(
                  JSON.stringify({
                      action:  'umi.ui.enable.GUmiUIFlag',
                  }),
                  '*'
            );`, true);
            }

            if (arg.hasOwnProperty('module')) {
                // 点击了模块按钮
                console.log('这里是路由窗口的打开')
                self.moduleWindow = _window(config.moduleWin);
                // self.moduleWindow.setParentWindow(projectWindow);
                self.moduleWindow.show()
            }

        })
    }

    /**
     * 调节项目窗口尺寸时view的变化
     */
    resizeWin(view) {
        const options = { width: true, height: true, horizontal: true, vertical: true }
        view.setAutoResize(options);
    }


}

module.exports = message
