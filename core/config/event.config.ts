

// 所有指令集合（注意格式：pyramid.ui + send | receive + 模块 + 功能 + 定义）
export const ActionTypes = {
    /******************** 全局 ********************/
    // 打开devTools
    SEND_PUBLIC_OPEN_CONSOLE: 'pyramid.ui.send.public.console',
    // 直接请求执行某条命令
    SEND_PUBLIC_CMD: 'pyramid.ui.send.public.env.cmd',
    RECEIVE_PUBLIC_CMD:  'pyramid.ui.receive.public.env.cmd',
    /******************** 全局 ********************/

    /******************** 项目 ********************/
    SEND_PROJECT_OPENWINDOW: 'pyramid.ui.send.project.openWindow',
    SEND_PROJECT_LIST: 'pyramid.ui.send.project.list',
    RECEIVE_PROJECT_LIST: 'pyramid.ui.receive.project.list',
    SEND_PROJECT_START: 'pyramid.ui.send.project.start',
    RECEIVE_PROJECT_START: 'pyramid.ui.receive.project.start',
    SEND_PROJECT_CREATE: 'pyramid.ui.send.project.create',
    SEND_PROJECT_CHOOSE_PATH: 'pyramid.ui.send.project.choosePath',
    SEND_PROJECT_TOOLBAR: 'pyramid.ui.send.project.SEND_PROJECT_TOOLBAR',
    RECEIVE_PROJECT_REMOVE:'pyramid.ui.receive.project.remove',
    RECEIVE_PROJECT_CHOOSE_PATH: 'pyramid.ui.receive.project.choosePath',
    SEND_PROJECT_REMOVE: 'pyramid.ui.send.project.remove',
    RECEIVE_PROJECT_CREATE: 'pyramid.ui.receive.project.create',
    /******************** 项目 ********************/


    /******************** 布局 ********************/
    SEND_PROJECT_LAYOUT_CHOOSE: 'pyramid.ui.send.project.layout.choose',
    /******************** 布局 ********************/


    /******************** 模块 ********************/
    SEND_PROJECT_MODULE_CREATE: 'pyramid.ui.send.project.module.create',
    RECEIVE_PROJECT_MODULE_CREATE: 'pyramid.ui.receive.project.module.create',
    SEND_PROJECT_MODULE_GET_ROUTE_TREE: 'pyramid.ui.send.project.module.getRouteTree',
    RECEIVE_PROJECT_MODULE_GET_ROUTE_TREE: 'pyramid.ui.receive.project.module.getRouteTree',
    /******************** 模块 ********************/


    /******************** 区块 ********************/
    SEND_PROJECT_BLOCK_SELECT: 'pyramid.ui.send.project.block.select',
    SEND_PROJECT_BLOCK_CREATE: 'pyramid.ui.send.project.block.create',
    SEND_PROJECT_BLOCK_TYPES_CREATE: 'pyramid.ui.send.project.block.types.create',
    SEND_PROJECT_BLOCK_ITEM_CREATE: 'pyramid.ui.send.project.block.item.create',
    SEND_PROJECT_BLOCK_GET: 'pyramid.ui.send.project.block.get',
    SEND_PROJECT_BLOCK_ITEM_GET: 'pyramid.ui.send.project.block.item.get',
    RECEIVE_PROJECT_BLOCK_LIST: 'pyramid.ui.receive.project.block.list',
    RECEIVE_PROJECT_BLOCK_ITEM_LIST: 'pyramid.ui.receive.project.block.item.list',
    SEND_PROJECT_BLOCK_REMOVE: 'pyramid.ui.send.project.block.remove',
    RECEIVE_PROJECT_BLOCK_REMOVE:'pyramid.ui.receive.project.block.remove',
    /******************** 区块 ********************/
};


