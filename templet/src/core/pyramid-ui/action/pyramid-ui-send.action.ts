import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
import {PyramidUIReceiveActionsUnion} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
import {PyramidUIAction, PyramidUIActionTypes} from "@/core/pyramid-ui/action/index";


// 所有动作集合（注意格式：PyramidUISend + 模块 + 功能 + 定义 + Action）

/******************** 全局 ********************/
export class PyramidUISendPublicConsole implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PUBLIC_OPEN_CONSOLE;
  constructor(public payload: void) { }
}
// 直接请求执行某个命令
export class PyramidUISendPublicCMD implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PUBLIC_CMD;

  /**
   * @param payload {
   *    @param cmd     执行命令
   *    @param cwd     执行路径（特别要注意windows、Mac的路径差异）
   *    @param cli     如果为true则显示cli命令拦截弹窗
   *    @param cliType cli为true 时生效 components/PyramidUICliMessage 中底部的按钮类型
   * }
   * @param callback   回调方法
   */
  constructor(public payload: {
    cmd: string,
    cwd?: string,
    cli?: boolean,
    cliType?: string,
    callback?: Function,
  }, public callback: Function, public callbackId?: string, public cli?: boolean) {

    this.callbackId = payload.callbackId = guid();
    if (payload.callback) {
      this.callback = payload.callback;
    }

    // 这里其实只要拿次协议的 callbackId 作为返回监听即可，必须要声明一大堆 PyramidUIReceive
    const messageId = pyramidUiService.getMessageFn((action: PyramidUIReceiveActionsUnion) => {
      const payload = action.payload;
      if (
        action.type === PyramidUIActionTypes.RECEIVE_PUBLIC_CMD
      ) {
        // 这里完全可以通过 callbackId 判断要不要执行回调
        if (payload.callbackId === this.callbackId) {
          if (payload.status === 'end' || payload.status === 'error') {
            pyramidUiService.clearMessageFn(messageId);
          }
          this.callback(payload);
        }
      }
    })
  }
}
/******************** 全局 ********************/





/******************** 项目 ********************/
export class PyramidUISendProjectCreateAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_CREATE;
  constructor(public payload: any) {}
}
// 打开指定项目操作窗口
export class PyramidUISendProjectOpenWindowAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_OPENWINDOW;
  constructor(public payload: void) { }
}
// 请求项目列表
export class PyramidUISendProjectListAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_LIST;
  constructor(public payload: {
    platform: 'pc' | 'mobile'
  }) {}
}
// 请求启动项目
export class PyramidUISendProjectStartAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_START;
  constructor(public payload: {
    project: boolean;
    msg: string;
    projectInfo: any;
  }) {}
}
export class PyramidUISendProjectChoosePathAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_CHOOSE_PATH;
  constructor(public payload: void) { }
}
export class PyramidUISendProjectToolBar implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_TOOLBAR;
  constructor(public payload: {
    type: 'back' | 'build' | 'layout' | 'module' | 'block'
  }) { }
}
export class PyramidUISendProjectRemoveAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_REMOVE;
  constructor(public payload: any) { }
}
/******************** 项目 ********************/





/******************** 布局 ********************/
export class PyramidUISendProjectLayoutChooseAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_LAYOUT_CHOOSE;
  constructor(public payload: {
    column: number
  }) { }
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
  }) { }
}
// 发送获取路由树消息
export class PyramidUISendProjectModuleGetRouteTreeAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_MODULE_GET_ROUTE_TREE;
  constructor(public payload: void) { }
}
// 接收获取路由树消息
export interface IPyramidUiRouterTree {
  path: string;
  children?: IPyramidUiRouterTree[]
}
/******************** 模块 ********************/





/******************** 区块 ********************/
export class PyramidUISendProjectBlockSelectAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_SELECT;
  constructor(public payload: { key?: string, gitUrl: string }) { }
}
export class PyramidUISendProjectBlockCreateAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_CREATE;
  constructor(public payload: any) { }
}
export class PyramidUISendProjectBlockTypesCreateAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_TYPES_CREATE;
  constructor(public payload: any) { }
}
export class PyramidUISendProjectBlockItemCreateAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_ITEM_CREATE;
  constructor(public payload: any) { }
}
export class PyramidUISendBlockGetAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_GET;
  constructor(public payload: any) { }
}
export class PyramidUISendBlockItemGetAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_ITEM_GET;
  constructor(public payload: { parentId: string }) { }
}
export class PyramidUISendBlockRemoveAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_REMOVE;
  constructor(public payload: any) { }
}
/******************** 区块 ********************/





/******************** 区块包 ********************/
// 发送获取区块信息
export class PyramidUISendBlockPackageInfoAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_PACKAGE_INFO;
  constructor(public payload: {
    // 通用的
    projectId?: string;

    // 上面是本地的
    projectPath?: string;

    // 下面两个参数是远程的
    projectGitUrl?: string;
    projectGitBranch?: string;
  }) { }
}
/******************** 区块包 ********************/




export type PyramidUISendActionsUnion =
  PyramidUISendProjectRemoveAction |
  PyramidUISendBlockItemGetAction |
  PyramidUISendProjectBlockTypesCreateAction |
  PyramidUISendProjectBlockCreateAction |
  PyramidUISendProjectCreateAction |
  PyramidUISendProjectToolBar |
  PyramidUISendProjectListAction |
  PyramidUISendProjectStartAction |
  PyramidUISendProjectOpenWindowAction |
  PyramidUISendBlockPackageInfoAction |
  PyramidUISendPublicCMD |
  PyramidUISendProjectBlockItemCreateAction |
  PyramidUISendPublicConsole |
  PyramidUISendProjectBlockSelectAction |
  PyramidUISendProjectModuleCreateAction |
  PyramidUISendProjectChoosePathAction |
  PyramidUISendProjectLayoutChooseAction |
  PyramidUISendBlockGetAction |
  PyramidUISendProjectModuleGetRouteTreeAction |
  PyramidUISendBlockRemoveAction
  ;


const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
