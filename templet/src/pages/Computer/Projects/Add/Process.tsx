import React, { FormEvent, FunctionComponent, useEffect, useState, useRef } from 'react';
import { Button, Form, Modal, Progress } from 'antd';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css'
import { FormComponentProps } from 'antd/lib/form';
import styles from './Process.less';
import {
  PyramidUIActionTypes,
  PyramidUIReceiveCliMessage,
} from "@/core/pyramid-ui/action/pyramid-ui.action";
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';


const FormItem = Form.Item;
interface IProps extends FormComponentProps {
  modalVisible: boolean;
  closeModal: (data?: any) => void;
}

const Component: FunctionComponent<IProps> = props => {
  let myRef = useRef();
  const [backs, setBacks] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [percent, setPercent] = useState(0);
  let [term, setTerm] = useState(null);

  useEffect(() => {
    handleProcess();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    props.closeModal(true);
  };

  const handleProcess = () => {
    pyramidUiService.getMessageFn((action: PyramidUIReceiveCliMessage) => {
      if (action.type === PyramidUIActionTypes.RECEIVE_CLI_MESSAGE) {
        const payload = action.payload;

        if (payload.status === 'start') {
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
        } else {
          console.log(payload);
          console.log(term);
          if (term) {
            if(payload.msg){
              term.write(payload.msg);
              backs.push(payload.msg);
              const percent = Number(((backs.length / 17).toFixed(1))) * 100;
              setPercent(percent);
            }if(payload.data)
              term.write(payload.data);
          }
        }
        if (payload.status === 'end') {
          setPercent(100);
          setShow(true)
        } else {
          setShow(false)
        }
      }
    })
  };

  return (
    <Modal
      destroyOnClose={true}
      title="新建应用"
      width={800}
      visible={props.modalVisible}
      footer={null}
      maskClosable={false}
      closable={false}
      onCancel={() => props.closeModal()}>

      <Form onSubmit={handleSubmit}>

        <FormItem className={styles.msgBox}>
          <div style={{ width: '100%'}} ref={myRef}></div>
        </FormItem>

        <FormItem >
          <Progress percent={percent}></Progress>
          {
            show ? <Button type="primary" htmlType="button" onClick={() => props.closeModal()}>
              确定
          </Button> : null
          }
        </FormItem>

      </Form>

    </Modal>
  );
};

export default Form.create<IProps>()(Component);
