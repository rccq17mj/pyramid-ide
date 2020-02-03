import React, { useEffect, useState, useRef, FunctionComponent } from 'react';
import { Button, Form, Modal } from 'antd';
import styles from './index.less';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css'
import {
  PyramidUIReceiveCliMessage, PyramidUISendBlockGetAction, PyramidUISendBlockItemGetAction,
  PyramidUISendProjectOpenWindowAction
} from '@/core/pyramid-ui/action/pyramid-ui.action';
import {CliMessageTypes} from "../../../../core/config/cliMessageType.config";
import {pyramidUiService} from "@/core/pyramid-ui/service/pyramid-ui.service";
import {urlParames} from "@/utils/utils";

const FormItem = Form.Item;

interface IProps {
  // 接收的消息类型
  action: PyramidUIReceiveCliMessage;
  // 接收消息的方法
  receiveMsgFn: (fn: any) => void;
  // 模态框关闭的回调
  closeCallBack: () => void;
}

const CliModal: FunctionComponent<IProps> = props => {
  let myRef = useRef();

  let [term, setTerm] = useState(null);
  const [modalShow, setModalShow] = useState<boolean>(true);
  const [messageEnd, setMessageEnd] = useState<boolean>(false);

  useEffect(() => {
    if (props.receiveMsgFn) {
      props.receiveMsgFn(receiveMsgFn);
    }
  }, []);

  useEffect(() => {
    if (messageEnd) {
      if (props.action.payload.type === CliMessageTypes.CHILDREN_PROJECT_LAYOUT_CREATE) {
        props.closeCallBack();
        setModalShow(false);
      } else if (props.action.payload.type === CliMessageTypes.CHILDREN_PROJECT_BLOCK_CREATE) {
        props.closeCallBack();
        setModalShow(false);
      } else if (props.action.payload.type === CliMessageTypes.CHILDREN_PROJECT_MODULE_CREATE) {
        props.closeCallBack();
        setModalShow(false);
      }
    }
  }, [messageEnd]);

  /**
   * 渲染Title
   */
  const renderTitle = () => {
    let title = '';
    switch (props.action.payload.type) {
      case CliMessageTypes.CHILDREN_PROJECT_CREATE:
        title = '创建应用';
        break;
      case CliMessageTypes.CHILDREN_PROJECT_MODULE_CREATE:
        title = '创建应用模块';
        break;
      case CliMessageTypes.CHILDREN_PROJECT_LAYOUT_CREATE:
        title = '创建应用布局';
        break;
      case CliMessageTypes.CHILDREN_PROJECT_BLOCK_CREATE:
        title = '创建应用区块';
        break;
      case CliMessageTypes.CHILDREN_PROJECT_START:
        title = '启动项目';
        break;
      case CliMessageTypes.PROJECT_BLOCK_PACKAGE_CREATE:
        title = '创建区块包';
        break;
      case CliMessageTypes.PROJECT_BLOCK_ITEM_CREATE:
        title = '创建区块';
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
    if (props.action.payload.type === CliMessageTypes.CHILDREN_PROJECT_CREATE) {
      return (
        <Button type="primary" disabled={!messageEnd} htmlType="button" onClick={()=>{
          if (props.closeCallBack) {
            props.closeCallBack();
            // TODO 如果要通知事件，可以在这里进行处理，（SendMessage、或者dva）
            setModalShow(false);
          }
        }}>确定</Button>
      );
    }
    else if (props.action.payload.type === CliMessageTypes.CHILDREN_PROJECT_START) {
      return (
        <Button type="primary" disabled={!messageEnd} htmlType="button" onClick={()=>{
          if (props.closeCallBack) {
            props.closeCallBack();
            // 通知可以打开窗口
            pyramidUiService.sendMessageFn(new PyramidUISendProjectOpenWindowAction());
            setModalShow(false);
          }
        }}>打开项目</Button>
      );
    } else if (props.action.payload.type === CliMessageTypes.PROJECT_BLOCK_PACKAGE_CREATE) {
      return (
        <Button type="primary" disabled={!messageEnd} htmlType="button" onClick={()=>{
          if (props.closeCallBack) {
            props.closeCallBack();
            // 通知刷新区块包
            pyramidUiService.sendMessageFn(new PyramidUISendBlockGetAction(true));
            // TODO 如果要通知事件，可以在这里进行处理，（SendMessage、或者dva）
            setModalShow(false);
          }
        }}>确定</Button>
      );
    } else if (props.action.payload.type === CliMessageTypes.PROJECT_BLOCK_ITEM_CREATE) {
      return (
        <Button type="primary" disabled={!messageEnd} htmlType="button" onClick={()=>{
          if (props.closeCallBack) {
            props.closeCallBack();
            // TODO 如果要通知事件，可以在这里进行处理，（SendMessage、或者dva）
            // 通知刷新区块
            pyramidUiService.sendMessageFn(new PyramidUISendBlockItemGetAction({parentId:urlParames().parentId}));
            setModalShow(false);
          }
        }}>确定</Button>
      );
    }
    return null;
  };

  const receiveMsgFn = (action: PyramidUIReceiveCliMessage) => {
    const payload = action.payload;

    if (payload.status === 'end') {
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
      if (payload.msg) {
        term.write(payload.msg);
      }
      if (payload.data) {
        term.write(payload.data);
      }
    }
  };

  return (
    <Modal
      destroyOnClose={true}
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
