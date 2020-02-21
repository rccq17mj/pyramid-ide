import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
import {
  PyramidUIReceivePublicCMD,
} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
import {PyramidUIAction, PyramidUIActionTypes} from "@/core/pyramid-ui/action/index";
import {ECmdResultCode, getCmdResultStrByCode} from "../../../../../core/config/cmdResultCode";
import {EPlatform} from "@/enums/platform.enum";
import {IBlockPackageInfo} from "@/interfaces/block-package/block-package.interface";


// 所有动作集合（注意格式：PyramidUISend + 模块 + 功能 + 定义 + Action）

/******************** 全局 ********************/
export class PyramidUISendPublicConsole implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PUBLIC_OPEN_CONSOLE;
  constructor(public payload: void) { }
}
// 直接请求执行某个命令（还不成熟，其他业务暂时不要用这个，如果有回其他参数，壳工程还是需要根据一个标识，进行相应处理）
export class PyramidUISendPublicCMD implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PUBLIC_CMD;

  constructor(public payload: {
    cmd: string,  // 执行命令
    cwd?: string, // 执行路径（特别要注意windows、Mac的路径差异）
    callbackId?: string;// 回调ID，外部调用不需要传，但需要传递给壳工程
  }, public callback?: (action: PyramidUIReceivePublicCMD) => void) {
    // 先赋值 callbackId
    payload.callbackId = guid();

    // 监听消息
    const messageId = pyramidUiService.getMessageFn((action: PyramidUIReceivePublicCMD) => {
      switch (action.type) {
        case PyramidUIActionTypes.RECEIVE_PUBLIC_CMD:
          // 获取返回参数
          const receivePayload = action.payload;

          if (receivePayload.callbackId === payload.callbackId) {
            // 销毁监听的消息
            if (receivePayload.cmdStatus === 'end') {
              pyramidUiService.clearMessageFn(messageId);
            }

            if (this.callback) {
              this.callback(action);
            }
          }
          break;
      }
    })
  }
}
// 发送 CMD 执行结果
export class PyramidUISendCMDExecuteResultAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_CMD_EXECUTE_RESULT;
  constructor(public payload: {
    // 用于区分是哪个动作的执行结果
    pyramidUIActionType: string;
    // 执行结果
    cmdExecuteResult: boolean;
    // 执行结果
    cmdExecuteResultCode: ECmdResultCode;
    // 成功的时候一般不返回
    cmdExecuteMessage?: string;
  }) {
    if (payload.cmdExecuteResultCode && !payload.cmdExecuteMessage) {
      // 自动转义
      payload.cmdExecuteMessage = getCmdResultStrByCode(payload.cmdExecuteResultCode);
    }
  }
}
/******************** 全局 ********************/





/******************** 项目 ********************/
export class PyramidUISendProjectCreateAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_CREATE;
  constructor(public payload: {
    platform: EPlatform,
    // 其他项目信息
    [key: string]: any;
  }) {}
}
// 导入项目
export class PyramidUISendProjectImportAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_IMPORT;
  constructor(public payload: {
    platform: EPlatform,
    // 其他项目信息
    [key: string]: any;
  }) {}
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
    platform: EPlatform
  }) {}
}
// 请求启动项目
export class PyramidUISendProjectStartAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_START;
  constructor(public payload: {
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
  constructor(public payload: {
    projectNames: string[]
  }) { }
}
// 刷新路由url
export class PyramidUISendProjectRouteAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_ROUTE_ROUTE;
  constructor(public payload: string) { }
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
  constructor(public payload: {
    blockPackageInfo: any
  }) { }
}
export class PyramidUISendProjectBlockTypesCreateAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_TYPES_CREATE;
  constructor(public payload: {
    categoryType: 'blocks' | 'modules';
    name: string;
    // 项目路径
    projectPath: string;
  }) { }
}
export class PyramidUISendProjectBlockItemCreateAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_ITEM_CREATE;
  constructor(public payload: {
    blockName: string;
    blockNameZn: string;
    blockType: 'block' | 'template';
    blockDescription: string;
    blockImage: string;
    blockCategories: string[];
    projectPath: string;
  }) { }
}
export class PyramidUISendBlockGetAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_PROJECT_BLOCK_GET;
  constructor(public payload: any) { }
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
// 保存私有区块包
export class PyramidUISendInsertPrivateBlockPackageInfoAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_INSERT_PRIVATE_BLOCK_PACKAGE_INFO;
  constructor(public payload: {
    // 区块包信息
    packageInfo: IBlockPackageInfo,
  }) { }
}
// 获取私有区块包信息
export class PyramidUISendGetPrivateBlockPackageListAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_GET_PRIVATE_BLOCK_PACKAGE_LIST;
  constructor(public payload: void) { }
}
// 取消私有区块包订阅
export class PyramidUISendUnsubscribePrivateBlockPackageAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.SEND_UNSUBSCRIBE_PRIVATE_BLOCK_PACKAGE;
  constructor(public payload: {
    ids: string[]
  }) { }
}
/******************** 区块包 ********************/




export type PyramidUISendActionsUnion =
  PyramidUISendInsertPrivateBlockPackageInfoAction |
  PyramidUISendCMDExecuteResultAction |
  PyramidUISendProjectRemoveAction |
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
  PyramidUISendProjectRouteAction |
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
