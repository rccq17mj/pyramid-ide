import React, { FormEvent, FunctionComponent, useEffect, useState, useRef } from 'react';
import { Avatar, Button, Select, Empty, Form, Input, message, Modal, Progress } from 'antd';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css'
import { FormComponentProps } from 'antd/lib/form';
import styles from './Process.less';



const FormItem = Form.Item;
const { TextArea } = Input;
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
  const { form, form: { getFieldDecorator },
  } = props;

  useEffect(() => {
    handleProcess();
  }, []);



  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    props.closeModal(true);
  };

  const handleProcess = () => {


    // setBacks(['1', '2']);
    // let aa =1;

    // const bkt = [];
    // setInterval(() => {

    getMessage((msg) => {
      if (msg.hasOwnProperty('cmd-create')) {
        // const copyBacks:any[] = JSON.parse(JSON.stringify(backs));
        // console.log(copyBacks);
        // copyBacks.push(msg.msg);
        // setBacks(copyBacks);

        //term.write(msg.msg);
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
          })
          console.log('Terminal!')
          term.open(myRef.current);
        }else{
          if(msg.msg){
            term.write(msg.msg);
            backs.push(msg.msg);
            const percent = ((backs.length / 10).toFixed(1)) * 100;
            setPercent(percent);
          }if(msg.data)
            term.write(msg.data);
          console.log(msg);
        }
        if (msg.end) {
          setPercent(100);
          setShow(true)
        } else {
          setShow(false)
        }
      }
    })
  }

  return (
    <Modal
      destroyOnClose={true}
      title="新建区块包"
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
