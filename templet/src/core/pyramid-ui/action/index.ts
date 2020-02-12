import {PyramidUISendActionsUnion} from "@/core/pyramid-ui/action/pyramid-ui-send.action";
import {PyramidUIReceiveActionsUnion} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
import {ActionTypes} from "../../../../../core/config/event.config";

export const PyramidUIActionTypes = ActionTypes;

export interface PyramidUIAction {
  type: string;
}

// 联合
export type PyramidUIActionsUnion =
  PyramidUISendActionsUnion |
  PyramidUIReceiveActionsUnion;
