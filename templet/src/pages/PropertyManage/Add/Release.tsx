import React, {FormEvent, FunctionComponent, useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Icon, Switch} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { urlParames } from '@/utils/utils';

import {blockPackageRequest} from "@/requests/block-package.request";

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
  },[]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (!err) {
        let params = fieldsValue;
        params['applyType'] = urlParames()['applyType'];
        params['packageManager'] = urlParames()['package'];
        params['isPublic'] = '0';
        if(isPublic){
          params['isPublic'] = '1';
        }
        blockPackageRequest.blockPackageAdd(params).then(res => {
          if(res){
            props.closeModal(true)
          }
        })
      }
    });
  };

  /**
   * 正则表达式
   */
  const validateChineseName = (rule, value, callback) => {
    const regex = /^[\u4e00-\u9fa5]+$/;
    if (value && regex.test(value)) {
      callback();
    } else {
      callback(new Error('中文名必须输入汉字'));
    }
  };

  const validateEnglishName = (rule, value, callback) => {
    const regex = /^\w+$/;
    if (value && regex.test(value)) {
      callback();
    } else {
      callback(new Error('英文名必须输入字母或数字'));
    }
  };

  const validateVersion = (rule, value, callback) => {
    const regex = /^([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}$/;
    if (value && regex.test(value)) {
      callback();
    } else {
      callback(new Error('版本号格式必须为1.0.0'));
    }
  };

  const onSwitchChange = (checked) => {
    setIsPublic(checked)
  };

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
            { required: true, message: '必填' },
            {
              validator: validateChineseName,
            },
          ],

        })(<Input placeholder="中文名称" />)}
        </FormItem>
        <FormItem>
          英文名称 {getFieldDecorator(`englishnName`, {
          rules: [
            { required: true, message: '必填' },
            {
              validator: validateEnglishName,
            },
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
            { required: true, message: '必填' },
            {
              validator: validateVersion,
            },
          ],
        })(<Input placeholder="版本号" />)}
        </FormItem>
        <FormItem>
          支撑平台版本{getFieldDecorator(`platformVersion`, {
          rules: [
            { required: true, message: '必填' },
            {
              validator: validateVersion,
            },
          ],
        })(<Input placeholder="支撑平台版本" />)}
        </FormItem>
        <FormItem>
          git地址{getFieldDecorator(`repoAddress`, {
          rules: [
            { required: true, message: '必填' }
          ],
        })(<Input placeholder="git地址" />)}
        </FormItem>
        <FormItem>
          git令牌{getFieldDecorator(`repoToken`, {
          rules: [
            { required: true, message: '必填' }
          ],
        })(<Input placeholder="git令牌" />)}
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

