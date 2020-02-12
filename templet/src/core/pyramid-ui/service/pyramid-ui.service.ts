/**
 * Pyramid UI 服务
 */
import {
  PyramidUISendActionsUnion,
} from "@/core/pyramid-ui/action/pyramid-ui-send.action";
import React from 'react';
import ReactDOM from 'react-dom';
import PyramidUICliMessage from '@/components/PyramidUICliMessage/index';
import {
  PyramidUIReceiveActionsUnion,
  PyramidUIReceiveCliMessageAction
} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
import {PyramidUIActionTypes} from "@/core/pyramid-ui/action";

class PyramidUiService {
  // 引用回掉函数 索引+1
  private messageCallbackMaxKey = 0;
  private messageCallbackMap = new Map();

  // 保存消息框接收消息的方法
  private pyramidUICliReceiveMessageFn: (action: PyramidUIReceiveCliMessageAction) => void = undefined;

  /**
   * 监听消息
   */
  public start = () => {
    this.listenMessage();
  };

  /**
   * 监听一次消息
   */
  private listenMessage = () => {
    let getMessage;
    try {
      // @ts-ignore
      getMessage = window.getMessage;
    } catch (e) {
    }
    if (!getMessage) {
      return;
    }

    // 接收消息
    getMessage((pyramidAction: PyramidUIReceiveActionsUnion) => {
      // 这里可以处理全局消息
      switch (pyramidAction.type) {
        // 接收CLI弹窗消息
        case PyramidUIActionTypes.RECEIVE_CLI_MESSAGE:
          const action: PyramidUIReceiveCliMessageAction = pyramidAction as PyramidUIReceiveCliMessageAction;

          if (action.payload.status === 'start') {// 开始
            this.showCliMessageModal(action);
          } else if (action.payload.status === 'progress') {// 正在进行
            if (this.pyramidUICliReceiveMessageFn) {
              this.pyramidUICliReceiveMessageFn(action);
            }
          } else if (action.payload.status === 'end') {// 结束
            if (this.pyramidUICliReceiveMessageFn) {
              this.pyramidUICliReceiveMessageFn(action);
            }
          }
          break;
        default:
          break;
      }

      this.messageCallbackMap.forEach((callback) => {
        callback(pyramidAction);
      });
    });
  };

  /**
   * 发送 pyramid ui 消息
   * @param pyramidAction
   */
  public sendMessageFn = (pyramidAction: PyramidUISendActionsUnion) => {
    let sendMessage;
    try {
      // @ts-ignore
      sendMessage = window.sendMessage;
    } catch (e) {
    }
    if (sendMessage) {
      sendMessage({ type: pyramidAction.type, payload: pyramidAction.payload });
    }
  };

  /**
   * 监听 pyramid ui 消息，会返回该消息引用的Key，需要在页面销毁的时候清除
   * @param callback 消息回调
   */
  public getMessageFn = (callback: (action: PyramidUIReceiveActionsUnion) => void): string => {
    this.messageCallbackMaxKey += 1;
    this.messageCallbackMap.set(this.messageCallbackMaxKey.toString(), callback);
    return this.messageCallbackMaxKey.toString();
  };

  /**
   * 清除 pyramid ui 消息
   * @param key 监听返回的消息Key
   */
  public clearMessageFn = (key: string) => {
    this.messageCallbackMap.delete(key);
  };

  /**
   * 显示 Cli 消息模态框
   * @param action
   */
  private showCliMessageModal = (action: PyramidUIReceiveCliMessageAction) => {
    const elementId = 'pyramidUICliMessageModal';

    const creatReact = React.createElement(PyramidUICliMessage,
      {
        action,
        receiveMsgFn: (fn) => {
          this.pyramidUICliReceiveMessageFn = fn;
        },
        closeCallBack: () => {
          const pyramidUICliMessageModal = document.getElementById(elementId);
          if (pyramidUICliMessageModal) {
            document.body.removeChild(pyramidUICliMessageModal);
          }
          if (this.pyramidUICliReceiveMessageFn) {
            this.pyramidUICliReceiveMessageFn = undefined;
          }
        }
      }
    );

    const div = document.createElement('div');
    div.id = elementId;
    document.body.appendChild(div);
    ReactDOM.render(creatReact, div);
  }
}

export const pyramidUiService = new PyramidUiService();
