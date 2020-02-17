import {IBlockPackageInfo} from "@/interfaces/block-package/block-package.interface";
import {IPyramidUiRouterTree} from "@/core/pyramid-ui/action/pyramid-ui-send.action";
import {PyramidUIAction, PyramidUIActionTypes} from "@/core/pyramid-ui/action/index";
import {ECliMessageType} from "../../../../../core/config/cliMessageType.config";

// 所有动作集合（注意格式：PyramidUIReceive + 模块 + 功能 + 定义 + Action）

/******************** 全局 ********************/
// 接收Cli返回消息，统一使用这个Action（请勿动）
export class PyramidUIReceiveCliMessageAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_CLI_MESSAGE;
  constructor(public payload: {
    // 类型
    type: ECliMessageType;
    // 对应壳工程的 flag
    cmdFlag: 'cmd_start' | 'cmd_out' | 'cmd_err' | 'cmd_close',
    // 状态（cmdFlag为 cmd_out 和 cmd_err 都在 progress 状态）
    cmdStatus: 'start' | 'end' | 'progress';
    // 消息
    cmdMessage: string;
    // 执行结束才会有，执行成功为 0，非0为执行失败
    cmdCloseCode?: number;
  }) { }
}
// 直接请求执行某个命令（还不成熟，其他业务暂时不要用这个，如果有回其他参数，壳工程还是需要根据一个标识，进行相应处理）
export class PyramidUIReceivePublicCMD implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PUBLIC_CMD;
  constructor(public payload: {
    callbackId: string;// 回调ID
    // 对应壳工程的flag
    cmdFlag: 'cmd_start' | 'cmd_out' | 'cmd_err' | 'cmd_close',
    // 状态（cmdFlag为 cmd_out 和 cmd_err 都在 progress 状态）
    cmdStatus: 'start' | 'end' | 'progress';
    // 消息
    cmdMessage: string;
    // 执行结束才会有，执行成功为 0，非0为执行失败
    cmdCloseCode?: number;
  }) { }
}

// 接收 CMD 执行结果
export class PyramidUIReceiveCMDExecuteResultAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_CMD_EXECUTE_RESULT;
  constructor(public payload: {
    cmdExecuteResult: boolean;
    // 成功的时候一般不返回
    cmdExecuteMessage?: string;
  }) { }
}
/******************** 全局 ********************/





/******************** 项目 ********************/
// 接收项目列表
export class PyramidUIReceiveProjectListAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PROJECT_LIST;
  constructor(public payload: {projects: any[]}) { }
}
// 接收选择路径
export class PyramidUIReceiveProjectChoosePathAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PROJECT_CHOOSE_PATH;
  constructor(public payload: {
    files: string;
  }) { }
}
/******************** 项目 ********************/





/******************** 模块 ********************/
export class PyramidUIReceiveProjectModuleGetRouteTreeAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PROJECT_MODULE_GET_ROUTE_TREE;
  constructor(public payload: { routerTree: IPyramidUiRouterTree[] }) { }
}
/******************** 模块 ********************/





/******************** 区块 ********************/
export class PyramidUIReceiveBlockListAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PROJECT_BLOCK_LIST;
  constructor(public payload: any) { }
}
export class PyramidUIReceiveBlockRemoveAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PROJECT_BLOCK_REMOVE;
  constructor(public payload: any) { }
}

/******************** 区块 ********************/





/******************** 区块包 ********************/
// 接收获取区块包信息
export class PyramidUIReceiveBlockPackageInfoAction implements PyramidUIAction {
  readonly type = PyramidUIActionTypes.RECEIVE_PROJECT_BLOCK_PACKAGE_INFO;
  constructor(public payload: {
    /**
     * 区块包信息，壳工程统一返回这个，并且做异常处理
     */
    packageInfo: IBlockPackageInfo,
    /**
     * 哪个项目ID，通过它前端可以找到并设置
     */
    projectId?: string;
  }) { }
}
/******************** 区块包 ********************/





export type PyramidUIReceiveActionsUnion =
  PyramidUIReceiveCMDExecuteResultAction|
  PyramidUIReceivePublicCMD |
  PyramidUIReceiveCliMessageAction |
  PyramidUIReceiveBlockPackageInfoAction |
  PyramidUIReceiveBlockListAction |
  PyramidUIReceiveBlockRemoveAction |
  PyramidUIReceiveProjectModuleGetRouteTreeAction |
  PyramidUIReceiveProjectListAction |
  PyramidUIReceiveProjectChoosePathAction |
  PyramidUIReceiveBlockItemListAction
  ;
