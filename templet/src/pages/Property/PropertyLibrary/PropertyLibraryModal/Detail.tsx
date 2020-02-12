import React, { FormEvent, FunctionComponent, useState } from 'react';
import { Avatar, Button, Select, Empty, Form, Input, message, Modal, Upload, Icon  } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

const FormItem = Form.Item;

interface IProps extends FormComponentProps {
  modalVisible: boolean;
  closeModal: (data?: any) => void;
  cardData: object
}

const Detail: FunctionComponent<IProps> = props => {

  const [imageUrl, setImageUrl] = useState('')
  const [imgLoading, setImgLoading] = useState(false)

  const {
    form,
    form: { getFieldDecorator },
    cardData
  } = props;


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        props.closeModal(true)
      }
    });
  };


  return (
    <Modal
      destroyOnClose={true}
      title="详情 "
      width={800}
      visible={props.modalVisible}
      footer={null}
      onCancel={() => props.closeModal()}>

      <Form onSubmit={handleSubmit}>
        <FormItem>
          中文名称{getFieldDecorator(`name_cn`, {
          initialValue:cardData.chineseName,
          rules: [
            { required: true, message: '必填' }
          ],
        })(<Input placeholder="中文名称" readOnly/>)}
        </FormItem>
        <FormItem>
          英文名称 {getFieldDecorator(`name`, {
          initialValue:cardData.englishName,
          rules: [
            { required: true, message: '必填' },
          ],
        })(<Input placeholder="英文名称" readOnly/>)}
        </FormItem>
        <FormItem>
          git{getFieldDecorator(`git`, {
          initialValue:cardData.storeAddress ? cardData.storeAddress : '',
          rules: [
            { required: true, message: '必填' }
          ],
        })(<Input placeholder="git" readOnly />)}
        </FormItem>
        <FormItem>
          版本号{getFieldDecorator(`version`, {
          initialValue:cardData.currentVersion,
          rules: [
            { required: true, message: '必填' }
          ],
        })(<Input placeholder="版本号" readOnly />)}
        </FormItem>
        <FormItem >
          <Button type="primary" htmlType="submit">
            创建新资产
          </Button>
        </FormItem>

      </Form>

    </Modal>
  );
};

export default Form.create<IProps>()(Detail);

