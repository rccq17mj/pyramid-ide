// 所有指令集合（注意格式：pyramid.ui + send | receive + 模块 + 功能 + 定义）
export const ActionTypes = {
    /******************** 全局 ********************/
    // 系统初始化完成
    RECEIVE_PUBLIC_INIT: 'pyramid.ui.receive.public.init',
    // 打开devTools
    SEND_PUBLIC_OPEN_CONSOLE: 'pyramid.ui.send.public.console',
    // 接收Cli消息
    RECEIVE_CLI_MESSAGE: 'pyramid.ui.receive.public.console',
    // 直接请求执行某条命令
    SEND_PUBLIC_CMD: 'pyramid.ui.send.public.env.cmd',
    RECEIVE_PUBLIC_CMD:  'pyramid.ui.receive.public.env.cmd',

    // 通知执行结果 统一使用这个
    SEND_CMD_EXECUTE_RESULT: 'pyramid.ui.send.cmd.execute.result',
    RECEIVE_CMD_EXECUTE_RESULT: 'pyramid.ui.receive.cmd.execute.result',
    /******************** 全局 ********************/





    /******************** 项目 ********************/
    SEND_PROJECT_OPENWINDOW: 'pyramid.ui.send.project.openWindow',
    SEND_PROJECT_LIST: 'pyramid.ui.send.project.list',
    RECEIVE_PROJECT_LIST: 'pyramid.ui.receive.project.list',
    SEND_PROJECT_START: 'pyramid.ui.send.project.start',
    SEND_PROJECT_CREATE: 'pyramid.ui.send.project.create',
    SEND_PROJECT_IMPORT: 'pyramid.ui.send.project.import',
    SEND_PROJECT_CHOOSE_PATH: 'pyramid.ui.send.project.choosePath',
    SEND_PROJECT_TOOLBAR: 'pyramid.ui.send.project.SEND_PROJECT_TOOLBAR',
    RECEIVE_PROJECT_CHOOSE_PATH: 'pyramid.ui.receive.project.choosePath',
    SEND_PROJECT_REMOVE: 'pyramid.ui.send.project.remove',
    /******************** 项目 ********************/





    /******************** 布局 ********************/
    SEND_PROJECT_LAYOUT_CHOOSE: 'pyramid.ui.send.project.layout.choose',
    SEND_PROJECT_LAYOUT_CLICKSECTION: 'pyramid.ui.children.send.project.layout.clickSection',
    RECEIVE_PROJECT_LAYOUT_SELECTCOLUMN: 'pyramid.ui.children.receive.project.layout.selectColumn',
    /******************** 布局 ********************/





    /******************** 模块 ********************/
    SEND_PROJECT_MODULE_CREATE: 'pyramid.ui.send.project.module.create',
    SEND_PROJECT_MODULE_GET_ROUTE_TREE: 'pyramid.ui.send.project.module.getRouteTree',
    RECEIVE_PROJECT_MODULE_GET_ROUTE_TREE: 'pyramid.ui.receive.project.module.getRouteTree',
    /******************** 模块 ********************/





    /******************** 区块 ********************/
    SEND_PROJECT_BLOCK_SELECT: 'pyramid.ui.send.project.block.select',
    RECEIVE_PROJECT_BLOCK_SELECT: 'pyramid.ui.children.receive.project.block.select',
    SEND_PROJECT_BLOCK_CREATE: 'pyramid.ui.send.project.block.create',
    SEND_PROJECT_BLOCK_TYPES_CREATE: 'pyramid.ui.send.project.block.types.create',
    SEND_PROJECT_BLOCK_ITEM_CREATE: 'pyramid.ui.send.project.block.item.create',
    SEND_PROJECT_BLOCK_GET: 'pyramid.ui.send.project.block.get',
    RECEIVE_PROJECT_BLOCK_LIST: 'pyramid.ui.receive.project.block.list',
    RECEIVE_PROJECT_BLOCK_ITEM_LIST: 'pyramid.ui.receive.project.block.item.list',
    SEND_PROJECT_BLOCK_REMOVE: 'pyramid.ui.send.project.block.remove',
    RECEIVE_PROJECT_BLOCK_REMOVE:'pyramid.ui.receive.project.block.remove',
    SEND_PROJECT_BLOCK_CLICKSECTION:'pyramid.ui.children.send.project.block.clickSection',
    /******************** 区块 ********************/






    /******************** 区块包 ********************/
    SEND_PROJECT_BLOCK_PACKAGE_INFO:'pyramid.ui.send.project.block.package.info',
    RECEIVE_PROJECT_BLOCK_PACKAGE_INFO:'pyramid.ui.receive.project.block.package.info',
    // 保存私有区块包
    SEND_INSERT_PRIVATE_BLOCK_PACKAGE_INFO: 'pyramid.ui.send.insert.private.block.package.info',
    // 获取私有区块包列表
    SEND_GET_PRIVATE_BLOCK_PACKAGE_LIST: 'pyramid.ui.send.get.private.block.package.list',
    RECEIVE_GET_PRIVATE_BLOCK_PACKAGE_LIST: 'pyramid.ui.receive.get.private.block.package.list',
    // 取消私有区块包订阅
    SEND_UNSUBSCRIBE_PRIVATE_BLOCK_PACKAGE: 'pyramid.ui.send.unsubscribe.private.block.package',
    // 区块包发布
    SEND_BLOCK_PACKAGE_PUBLISH: 'pyramid.ui.send.block.package.publish'
    /******************** 区块包 ********************/
};
