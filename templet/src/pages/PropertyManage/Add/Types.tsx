import React, {FormEvent, FunctionComponent, useEffect, useState} from 'react';
import {Avatar, Button, Select, Empty, Form, Input, message, Modal, Upload, Icon, Switch} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
import {
  PyramidUISendProjectBlockTypesCreateAction
} from "@/core/pyramid-ui/action/pyramid-ui.action";
import {API_CONFIG} from "@/core/configs/api.config";
import { urlParames } from '@/utils/utils';
import {mainRequest} from '../../../requests/main.request';
import styles from './Index.less';

const FormItem = Form.Item;

interface IProps extends FormComponentProps {
  modalVisible: boolean;
  closeModal: (data?: any) => void;
}

const Component: FunctionComponent<IProps> = props => {

  const [isPublic, setIsPublic] = useState(false);
  const {
    form,
    form: { getFieldDecorator },
  } = props;


  useEffect(()=>{
    console.log('url参数',urlParames())
  },[])


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (!err) {
        // sendMessage({'project': true, msg: 'create', 'projectInfo': fieldsValue});
        console.log('fieldsValue', fieldsValue)
        let params = fieldsValue;
        params['categoryType'] = "block";
        console.log('最终params数据', params)
        // 还没写完，消息没接收
        pyramidUiService.sendMessageFn(new PyramidUISendProjectBlockTypesCreateAction(params));

        //  props.closeModal(true)
      }
    });
  };

  return (
    <Modal
      destroyOnClose={true}
      title="新建分类"
      width={800}
      visible={props.modalVisible}
      footer={null}
      onCancel={() => props.closeModal()}>

      <Form onSubmit={handleSubmit}>
        <FormItem>
          名称{getFieldDecorator(`name`, {
          rules: [
            { required: true, message: '必填' }
          ],
        })(<Input placeholder="名称" />)}
        </FormItem>
        <FormItem >
          <Button type="primary" htmlType="submit">
            确定
          </Button>
          <Button htmlType="reset" onClick={() => props.closeModal()}>
            取消
          </Button>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default Form.create<IProps>()(Component);

