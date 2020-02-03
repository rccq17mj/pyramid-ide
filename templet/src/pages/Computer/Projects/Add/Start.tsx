import React, { FormEvent, FunctionComponent, useEffect, useState } from 'react';
import { Avatar, Button, Select, Empty, Form, Input, Progress, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { PyramidUIActionTypes, PyramidUIActionsUnion, PyramidUISendProjectOpenWindowAction } from "@/core/pyramid-ui/action/pyramid-ui.action";
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';


const FormItem = Form.Item;
const { TextArea } = Input;
interface IProps extends FormComponentProps {
  modalVisible: boolean;
  closeModal: (data?: any) => void;
}

const Component: FunctionComponent<IProps> = props => {
  const [backs, setBacks] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const { form, form: { getFieldDecorator }, } = props;

  useEffect(() => {
    // handleProcess();

    // 统一监控 - 取得信息的处理
    pyramidUiService.getMessageFn((action: PyramidUIActionsUnion) => {
      // 返回项目列表
      if (action.type === PyramidUIActionTypes.RECEIVE_PROJECT_START) {
        receive_project_start(action.payload);
      }
    });


  }, []);

  const openProjectWindow = (projectInfo) => {
    // sendMessage({ 'openProjectWindow': true });
    pyramidUiService.sendMessageFn(new PyramidUISendProjectOpenWindowAction());
    //sendMessage({project: true, msg: 'startProject', projectInfo});
    props.closeModal();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    props.closeModal(true);
  };
  const receive_project_start = (payload) => {

      backs.push(payload.msg);
      if (payload.end) {
        setShow(true)
      } else {
        setShow(false)
      }
      let newAsd = [];
      for (let i = 0; i < backs.length; i++) {
        if (backs[i]) {
          newAsd.push(backs[i])
        }
      }
      setBacks(newAsd);
    
  }
  // const handleProcess = () => {
  //   pyramidUiService.getMessageFn((msg: PyramidUIReceiveProjectCreatAction) => {
      
  //   })
  // }


  return (
    <Modal
      destroyOnClose={true}
      title="启动应用"
      width={800}
      visible={props.modalVisible}
      footer={null}
      onCancel={() => props.closeModal()}>

      <Form onSubmit={handleSubmit}>

        <FormItem>

          <TextArea rows={20} value={backs} />

        </FormItem>

        <FormItem >
          <Progress percent={((backs.length / 14).toFixed(1)) * 100}></Progress>
          {
            show ? <Button type="primary" htmlType="button" onClick={() => openProjectWindow()}>
              启动
          </Button> : null
          }
        </FormItem>

      </Form>

    </Modal>
  );
};

export default Form.create<IProps>()(Component);
