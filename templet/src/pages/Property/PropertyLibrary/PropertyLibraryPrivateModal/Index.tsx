import {FormComponentProps} from "antd/lib/form";
import React, {FormEvent, FunctionComponent} from "react";
import {Button, Form, Input, message, Modal} from "antd";
import {REGEX_CONFIG} from "@/core/configs/regex.config";

const FormItem = Form.Item;

interface IProps extends FormComponentProps {
  modalVisible: boolean;
  closeModal: (data?: any) => void;
}

const Component: FunctionComponent<IProps> = props => {
  const {form, form: { getFieldDecorator }} = props;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const hide = message.loading('正在查询区块，请稍等...', 0);
      // 发送消息查询区块包信息

      setTimeout(hide, 0);
    });
  };

  return (
    <Modal
      maskClosable={false}
      closable={false}
      destroyOnClose={true}
      title=""
      width={800}
      visible={props.modalVisible}
      footer={null}
      onCancel={() => props.closeModal()}>
      <Form layout="vertical" onSubmit={handleSubmit}>
        <FormItem label="git地址">
          {getFieldDecorator(`gitUrl`, {
            initialValue: '',
            rules: [
              {
                required: true,
                message: '必填',
              },
              {
                validator: REGEX_CONFIG.EMPTY_CHAR.FUNC,
                message: REGEX_CONFIG.EMPTY_CHAR.DESC,
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem>
          <Button type={"primary"} htmlType="submit" style={{marginRight: 10}}>新增</Button>
          <Button type={"danger"} onClick={() => {
            props.closeModal();
          }}>关闭</Button>
        </FormItem>
      </Form>
    </Modal>
  )
};

export default Form.create<IProps>({})(Component)
