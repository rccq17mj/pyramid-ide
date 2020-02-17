import React, { useEffect, useState, useRef, FunctionComponent } from 'react';
import { Button, Form, Modal } from 'antd';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css'
import {
  PyramidUISendBlockGetAction,
  PyramidUISendBlockItemGetAction,
  PyramidUISendBlockPackageInfoAction,
  PyramidUISendCMDExecuteResultAction,
  PyramidUISendProjectOpenWindowAction
} from '@/core/pyramid-ui/action/pyramid-ui-send.action';
import {pyramidUiService} from "@/core/pyramid-ui/service/pyramid-ui.service";
import {urlParames} from "@/utils/utils";
import styles from './index.less';
import {
  PyramidUIReceiveCliMessageAction,
} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
import {ECliMessageType} from "../../../../core/config/cliMessageType.config";
import {ECmdResultCode} from "../../../../core/config/cmdResultCode";
import {ActionTypes} from "../../../../core/config/event.config";

const FormItem = Form.Item;

interface IProps {
  // 接收的消息类型
  action: PyramidUIReceiveCliMessageAction;
  // 接收消息的方法
  receiveMsgFn: (fn: any) => void;
  // 模态框关闭的回调
  closeCallBack: () => void;
}

const CliModal: FunctionComponent<IProps> = props => {
  const myRef = useRef();

  let [term, setTerm] = useState(null);
  const [modalShow, setModalShow] = useState<boolean>(true);
  const [messageEnd, setMessageEnd] = useState<boolean>(false);
  // 执行结果
  const [cliExecuteResult, setCliExecuteResult] = useState<ECmdResultCode>(ECmdResultCode.SUCCESS);

  useEffect(() => {
    if (props.receiveMsgFn) {
      props.receiveMsgFn(receiveMsgFn);
    }
  }, []);

  useEffect(() => {
    if (messageEnd) {
      switch (props.action.payload.type) {
        case ECliMessageType.CHILDREN_PROJECT_LAYOUT_CREATE:
          props.closeCallBack();
          setModalShow(false);
          break;
        case ECliMessageType.CHILDREN_PROJECT_BLOCK_CREATE:
          props.closeCallBack();
          setModalShow(false);
          break;
        case ECliMessageType.CHILDREN_PROJECT_MODULE_CREATE:
          props.closeCallBack();
          setModalShow(false);
          break;
        default:
          break;
      }
    }
  }, [messageEnd]);

  /**
   * 渲染Title
   */
  const renderTitle = () => {
    let title = '';
    switch (props.action.payload.type) {
      case ECliMessageType.CHILDREN_PROJECT_CREATE:
        title = '创建应用';
        break;
      case ECliMessageType.CHILDREN_PROJECT_MODULE_CREATE:
        title = '创建应用模块';
        break;
      case ECliMessageType.CHILDREN_PROJECT_LAYOUT_CREATE:
        title = '创建应用布局';
        break;
      case ECliMessageType.CHILDREN_PROJECT_BLOCK_CREATE:
        title = '创建应用区块';
        break;
      case ECliMessageType.CHILDREN_PROJECT_START:
        title = '启动项目';
        break;
      case ECliMessageType.PROJECT_BLOCK_PACKAGE_CREATE:
        title = '创建区块包';
        break;
      case ECliMessageType.PROJECT_BLOCK_ITEM_CREATE:
        title = '创建区块';
        break;
        case ECliMessageType.PROJECT_BLOCKS_TYPE_CREATE:
        title = '创建区块分类';
        break;
      default:
        break;
    }
    return title;
  };

  /**
   * 然后底部按钮
   */
  const renderFooter = () => {
    let view = null;
    switch (props.action.payload.type) {
      case ECliMessageType.CHILDREN_PROJECT_CREATE:
        view = (
          <Button type="primary" disabled={!messageEnd} htmlType="button" onClick={()=>{
            if (props.closeCallBack) {
              props.closeCallBack();
              // 通知刷新
              pyramidUiService.sendMessageFn(
                new PyramidUISendCMDExecuteResultAction({
                  pyramidUIActionType: ActionTypes.SEND_PROJECT_CREATE,
                  cmdExecuteResult: cliExecuteResult === ECmdResultCode.SUCCESS
                })
              );
              setModalShow(false);
            }
          }}>确定</Button>
        );
        break;
      case ECliMessageType.CHILDREN_PROJECT_START:
        view = (
          <Button type="primary" disabled={!messageEnd} htmlType="button" onClick={()=>{
            if (props.closeCallBack) {
              props.closeCallBack();
              // 通知可以打开窗口
              pyramidUiService.sendMessageFn(new PyramidUISendProjectOpenWindowAction());
              setModalShow(false);
            }
          }}>打开项目</Button>
        );
        break;
      case ECliMessageType.PROJECT_BLOCK_PACKAGE_CREATE:
        view = (
          <Button type="primary" disabled={!messageEnd} htmlType="button" onClick={()=>{
            if (props.closeCallBack) {
              props.closeCallBack();
              // 通知刷新区块包
              pyramidUiService.sendMessageFn(new PyramidUISendBlockGetAction(true));
              setModalShow(false);
            }
          }}>确定</Button>
        );
        break;
      case ECliMessageType.PROJECT_BLOCK_ITEM_CREATE:
        view = (
          <Button type="primary" disabled={!messageEnd} htmlType="button" onClick={()=>{
            if (props.closeCallBack) {
              props.closeCallBack();
              // 通知刷新区块
              //pyramidUiService.sendMessageFn(new PyramidUISendBlockItemGetAction({parentId:urlParames()['parentId']}));
              pyramidUiService.sendMessageFn(new PyramidUISendBlockPackageInfoAction({
                // TODO 先写死 发送获取区块信息
                projectPath: urlParames().path,
              }));
              setModalShow(false);
            }
          }}>确定</Button>
        );
        break;
        case ECliMessageType.PROJECT_BLOCKS_TYPE_CREATE:
        view = (
          <Button type="primary" disabled={!messageEnd} htmlType="button" onClick={()=>{
            if (props.closeCallBack) {
              props.closeCallBack();
              // 通知刷新分类
              pyramidUiService.sendMessageFn(new PyramidUISendBlockPackageInfoAction({
                // TODO 先写死 发送获取区块信息
                projectPath: urlParames().path,
              }));
              setModalShow(false);
            }
          }}>确定</Button>
        );
        break;
      default:
        break;
    }

    return view;
  };

  const receiveMsgFn = (action: PyramidUIReceiveCliMessageAction) => {
    const payload = action.payload;

    if (payload.cmdStatus === 'end') {
      setCliExecuteResult(payload.cmdCloseCode);
      setMessageEnd(true);
    }

    if (!term) {
      term = new Terminal({
        rendererType: "canvas", //渲染类型
        fontSize: 13,
        convertEol: true, //启用时，光标将设置为下一行的开头
        disableStdin: false, //是否应禁用输入。
        cursorStyle: 'underline', //光标样式
        cursorBlink: true, //光标闪烁
        theme: {
          foreground: '#333', //字体
          background: '#fff', //背景色
          cursor: 'help',//设置光标
        }
      });
      term.open(myRef.current);
      setTerm(term);
    }

    if (term) {
      if (payload.cmdMessage) {
        term.write(payload.cmdMessage);
      }
    }
  };

  return (
    <Modal
      destroyOnClose
      title={renderTitle()}
      width={800}
      visible={modalShow}
      footer={renderFooter()}
      maskClosable={false}
      closable={false}
    >
      <Form>
        <FormItem className={styles.msgBox}>
          <div style={{ width: '100%' }} ref={myRef} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CliModal;
