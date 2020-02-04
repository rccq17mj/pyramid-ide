import React, {FormEvent, FunctionComponent, useEffect, useState} from 'react';
import {Avatar, Button, Select, Empty, Form, Input, message, Modal, Upload, Icon, Switch} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
import {
 PyramidUISendProjectBlockItemCreateAction
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
        params['applyType'] = urlParames().applyType;
        params['packageManager'] = urlParames().package;
        console.log('最终params数据', params)
       // pyramidUiService.sendMessageFn(new PyramidUISendProjectBlockItemCreateAction(params));

      //  props.closeModal(true)
      }
    });
  };


  const onSwitchChange = (checked) => {
    setIsPublic(checked)
  }

  return (
    <Modal
      destroyOnClose={true}
      title="发布"
      width={800}
      visible={props.modalVisible}
      footer={null}
      onCancel={() => props.closeModal()}>

      <Form onSubmit={handleSubmit}>
        <FormItem>
          中文名称{getFieldDecorator(`chineseName`, {
          rules: [
            { required: true, message: '必填' }
          ],
        })(<Input placeholder="中文名称" />)}
        </FormItem>
        <FormItem>
          英文名称 {getFieldDecorator(`englishnName`, {
          rules: [
            { required: true, message: '必填' },
          ],
        })(<Input placeholder="英文名称" />)}
        </FormItem>
        <FormItem>
          备注{getFieldDecorator(`remarks`, {
          rules: [
            { required: true, message: '必填' }
          ],
        })(<Input placeholder="备注" />)}
        </FormItem>
        <FormItem>
          版本号{getFieldDecorator(`currentVersion`, {
          rules: [
            { required: true, message: '必填' }
          ],
        })(<Input placeholder="版本号" />)}
        </FormItem>
        <FormItem>
          支撑平台版本{getFieldDecorator(`platformVersion`, {
          rules: [
            { required: true, message: '必填' }
          ],
        })(<Input placeholder="支撑平台版本" />)}
        </FormItem>
        <FormItem>
          git地址{getFieldDecorator(`repoAddress`, {
          rules: [
            { required: true, message: '必填' }
          ],
        })(<Input placeholder="备注" />)}
        </FormItem>
        <FormItem >
          <p style={{ margin: '0' }}>是否公开？</p>
          <Switch
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
            onChange={onSwitchChange}
          />
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

