import React, {FormEvent, FunctionComponent, useEffect} from 'react';
import {Button, Form, Input, Modal, Icon, Switch} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import {blockPackageRequest} from "@/requests/block-package.request";
import {EBlockPackageEndNumberType} from "@/dicts/block-package.dict";

const FormItem = Form.Item;

interface IProps extends FormComponentProps {
  modalVisible: boolean;
  closeModal: (data?: any) => void;
  params: {
    projectInfo: {
      _id: string;
      applyType: EBlockPackageEndNumberType;
      absolutePath: string;
      package: string;
      remarkImg: string;
      filePath: string;
      menuNameEn: string;
      menuNameZh: string;
    }
  }
}

const Component: FunctionComponent<IProps> = props => {
  const {
    form,
    form: { getFieldDecorator },
  } = props;

  useEffect(() => {
    console.log(props.params.projectInfo);
    debugger;
    if (props.params.projectInfo) {
      form.setFieldsValue({
        englishnName: props.params.projectInfo.menuNameEn,
        chineseName: props.params.projectInfo.menuNameZh
      });
    }
  },[]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const params = fieldsValue;
        params['applyType'] = props.params.projectInfo.applyType;
        params['packageManager'] = props.params.projectInfo.package;
        params['isPublic'] = params['isPublic'] ? '1' : '0';

        // TODO 这里需要先调用 cli 修改信息，成功后在调用接口发布


        // blockPackageRequest.blockPackageAdd(params).then(res => {
        //   if (res) {
        //     props.closeModal(true)
        //   }
        // });
      }
    });
  };

  // /**
  //  * 正则表达式
  //  */
  // const validateChineseName = (rule, value, callback) => {
  //   const regex = /^[\u4e00-\u9fa5]+$/;
  //   if (value && regex.test(value)) {
  //     callback();
  //   } else {
  //     callback(new Error('中文名必须输入汉字'));
  //   }
  // };
  //
  // const validateEnglishName = (rule, value, callback) => {
  //   const regex = /^\w+$/;
  //   if (value && regex.test(value)) {
  //     callback();
  //   } else {
  //     callback(new Error('英文名必须输入字母或数字'));
  //   }
  // };

  const validateVersion = (rule, value, callback) => {
    const regex = /^([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}$/;
    if (value && regex.test(value)) {
      callback();
    } else {
      callback(new Error('版本号格式必须为1.0.0'));
    }
  };

  // const onSwitchChange = (checked) => {
  //   setIsPublic(checked)
  // };

  return (
    <Modal
      destroyOnClose={true}
      title="区块包发布"
      width={800}
      visible={props.modalVisible}
      footer={null}
      onCancel={() => props.closeModal()}>

      <Form onSubmit={handleSubmit}>
        <FormItem label='英文名称'>
          {getFieldDecorator(`englishnName`, {
            rules: [
              { required: true, message: '必填' },
              // {
              //   validator: validateEnglishName,
              // },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem label='中文名称'>
          {getFieldDecorator(`chineseName`, {
            rules: [
              { required: true, message: '必填' },
              // {
              //   validator: validateChineseName,
              // },
            ]
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem label='备注'>
          {getFieldDecorator(`remarks`, {
            rules: [
              { required: true, message: '必填' }
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem label='版本号'>
          {getFieldDecorator(`currentVersion`, {
            rules: [
              { required: true, message: '必填' },
              {
                validator: validateVersion,
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem label='支撑平台版本'>
          {getFieldDecorator(`platformVersion`, {
            rules: [
              { required: true, message: '必填' },
              {
                validator: validateVersion,
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem label='git地址'>
          {getFieldDecorator(`repoAddress`, {
            rules: [
              { required: true, message: '必填' }
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem label='git令牌'>
          {getFieldDecorator(`repoToken`, {
            rules: [
              { required: true, message: '必填' }
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem>
          {getFieldDecorator(`isPublic`, {
            initialValue: true,
            valuePropName: 'checked',
            rules: [
              { required: true, message: '必选' }
            ],
          })(
            <Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
            />
          )}
        </FormItem>

        <FormItem >
          <Button type="primary" htmlType="submit" style={{marginRight: 10}}>
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

