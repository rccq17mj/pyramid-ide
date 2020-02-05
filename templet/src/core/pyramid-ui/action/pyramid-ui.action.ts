import { ActionTypes } from '../../../../../core/config/event.config';
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';

export interface PyramidUIAction {
  type: string;
}

// 所有指令集合（注意格式：pyramid.ui + send | receive + 模块 + 功能 + 定义）
export const PyramidUIActionTypes = ActionTypes;

// 所有动作集合（注意格式：PyramidUI + Send | Receive + 模块 + 功能 + 定义 + Action）
/******************** 全局 ********************/
export class PyramidUISendPublicConsole implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PUBLIC_OPEN_CONSOLE;
  constructor(public payload: void) {}
}
// 接收Cli返回消息，统一使用这个Action
export class PyramidUIReceiveCliMessage implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_CLI_MESSAGE;
  constructor(public payload: {
    // 类型，用来判断 CLI 的类型
    type: string;
    // 状态
    status: 'start' | 'error' | 'end' | 'progress';
    // 二进制数据（根据壳工程传回，看可工程是否需要统一）
    data: any;
    // 一般数据（根据壳工程传回，看可工程是否需要统一）
    msg: string;
  }) {}
}
/******************** 全局 ********************/
const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
/**
 * 直接请求执行某个命令
 */
export class PyramidUISendPublicCMD implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PUBLIC_CMD;
  constructor(public payload: {
    cmd: string,
    callbackId?: string,
    callback?: Function,
  }, public callback: Function , public callbackId?: string) {

    this.callbackId = payload.callbackId = guid();

    if (payload.callback) {
      this.callback = payload.callback;
    }

    // 这里其实只要拿次协议的 callbackId 作为返回监听即可，必须要声明一大堆 PyramidUIReceive
    const messageId = pyramidUiService.getMessageFn((action: PyramidUIReceiveProjectPublicCMD) => {
      const payload = action.payload;
      // 这里完全可以通过 callbackId 判断要不要执行回调
      if (payload.callbackId === this.callbackId) {
        if (payload.status === 'end' || payload.status === 'error') {
          pyramidUiService.clearMessageFn(messageId);
        }
        this.callback(payload);
      }
    })
  }
}
export class PyramidUIReceiveProjectPublicCMD implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PUBLIC_CMD;
  constructor(public payload: {
    // 判断比较
    callbackId: string;
    // 状态
    status: 'start' | 'error' | 'end' | 'progress';
    // 二进制数据（根据壳工程传回，看可工程是否需要统一）
    data: any;
    // 一般数据（根据壳工程传回，看可工程是否需要统一）
    msg: string;
  }) { }
}
/******************** 项目 ********************/

/**
 * 打开指定项目操作窗口
 */
export class PyramidUISendProjectOpenWindowAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_OPENWINDOW;
  constructor(public payload: void) {}
}

/**
 * 请求项目列表
 */
export class PyramidUISendProjectListAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_LIST;
  constructor(public payload: any) {}
}
/**
 * 返回项目列表
 */
export class PyramidUIReceiveProjectListAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PROJECT_LIST;
  constructor(public payload: any) {}
}

/**
 * 请求启动项目
 */
export class PyramidUISendProjectStartAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_START;
  constructor(public payload: any) {}
}
/**
 * 返回启动项目信息
 */
export class PyramidUIReceiveProjectStartAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PROJECT_START;
  constructor(public payload: any) {}
}



export class PyramidUISendProjectChoosePathAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_CHOOSE_PATH;
  constructor(public payload: void) {}
}
export class PyramidUISendProjectToolBar implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_TOOLBAR;
  constructor(public payload: {}) {}
}
export class PyramidUIReceiveProjectChoosePathAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PROJECT_CHOOSE_PATH;
  constructor(public payload: {
    files: string;
  }) {}
}
export class PyramidUIReceiveProjectRemoveAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PROJECT_REMOVE;
  constructor(public payload: {
    files: string;
  }) {}
}
export class PyramidUISendProjectCreateAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_CREATE;
  constructor(public payload: any) {}
}
export class PyramidUISendProjectRemoveAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_REMOVE;
  constructor(public payload: any) {}
}

export class PyramidUIReceiveProjectCreatAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PROJECT_CREATE;
  constructor(public payload: any) {}
}


/******************** 项目 ********************/



/******************** 布局 ********************/
export class PyramidUISendProjectLayoutChooseAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_LAYOUT_CHOOSE;
  constructor(public payload: {
    column: number
  }) {}
}
/******************** 布局 ********************/



/******************** 模块 ********************/
export class PyramidUISendProjectModuleCreateAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_MODULE_CREATE;
  constructor(public payload: {
    menuNameZh: string;
    menuNameEn: string;
    routePath: string;
    filePath: string;
    package: string;
    remark: string;
    gitUrl: string;
  }) {}
}
export class PyramidUIReceiveProjectModuleCreateAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PROJECT_MODULE_CREATE;
  constructor(public payload: {msg: string}) {}
}
// 发送获取路由树消息
export class PyramidUISendProjectModuleGetRouteTreeAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_MODULE_GET_ROUTE_TREE;
  constructor(public payload: void) {}
}
// 接收获取路由树消息
export interface IPyramidUiRouterTree {
  path: string;
  children?: IPyramidUiRouterTree[]
}
export class PyramidUIReceiveProjectModuleGetRouteTreeAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PROJECT_MODULE_GET_ROUTE_TREE;
  constructor(public payload: {routerTree: IPyramidUiRouterTree[]}) {}
}
/******************** 模块 ********************/



/******************** 区块 ********************/
export class PyramidUISendProjectBlockSelectAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_SELECT;
  constructor(public payload: {key?: string, gitUrl: string}) {}
}

export class PyramidUISendProjectBlockCreateAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_CREATE;
  constructor(public payload: any) {}
}

export class PyramidUISendProjectBlockTypesCreateAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_TYPES_CREATE;
  constructor(public payload: any) {}
}

export class PyramidUISendProjectBlockItemCreateAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_ITEM_CREATE;
  constructor(public payload: any) {}
}

export class PyramidUISendBlockGetAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_GET;
  constructor(public payload: any) {}
}
export class PyramidUISendBlockItemGetAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_ITEM_GET;
  constructor(public payload: {parentId:string}) {}
}

export class PyramidUIReceiveBlockListAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PROJECT_BLOCK_LIST;
  constructor(public payload: any) {}
}

export class PyramidUIReceiveBlockItemListAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PROJECT_BLOCK_ITEM_LIST;
  constructor(public payload: any) {}
}

export class PyramidUISendBlockRemoveAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_REMOVE;
  constructor(public payload: any) {}
}

export class PyramidUIReceiveBlockRemoveAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PROJECT_BLOCK_REMOVE;
  constructor(public payload: any) {}
}
/******************** 区块 ********************/



export type PyramidUIActionsUnion =
  PyramidUISendPublicCMD |
  PyramidUIReceiveProjectPublicCMD |
  PyramidUISendPublicConsole |
  PyramidUISendProjectBlockSelectAction |
  PyramidUISendProjectModuleCreateAction |
  PyramidUIReceiveProjectModuleCreateAction |
  PyramidUISendProjectCreateAction |
  PyramidUISendProjectChoosePathAction |
  PyramidUIReceiveProjectChoosePathAction |
  PyramidUISendProjectLayoutChooseAction |
  PyramidUISendBlockGetAction |
  PyramidUIReceiveBlockListAction |
  PyramidUISendProjectModuleGetRouteTreeAction |
  PyramidUIReceiveProjectModuleGetRouteTreeAction |
  PyramidUISendBlockRemoveAction |
  PyramidUIReceiveBlockRemoveAction |
  PyramidUIReceiveCliMessage |
  PyramidUIReceiveProjectCreatAction |
  PyramidUIReceiveProjectRemoveAction |
  PyramidUIReceiveProjectListAction |
  PyramidUIReceiveProjectStartAction
  ;
