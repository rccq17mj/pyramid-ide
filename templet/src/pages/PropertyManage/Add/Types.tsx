import React, {FormEvent, FunctionComponent, useEffect} from 'react';
import {Button, Form, Input, message, Modal} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
import {
  PyramidUISendProjectBlockTypesCreateAction
} from "@/core/pyramid-ui/action/pyramid-ui-send.action";
import {EBlockPackageAssemblyType} from "@/dicts/block-package.dict";
import {PyramidUIReceiveActionsUnion} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
import {PyramidUIActionTypes} from "@/core/pyramid-ui/action";
import {ActionTypes} from "../../../../../core/config/event.config";

const FormItem = Form.Item;

interface IProps extends FormComponentProps {
  modalVisible: boolean;
  closeModal: (data?: any) => void;
  params: {
    categoryType: EBlockPackageAssemblyType;
    absolutePath: string;
  }
}

const Component: FunctionComponent<IProps> = props => {
  const {
    form,
    form: { getFieldDecorator },
  } = props;

  useEffect(() => {
    const messageKey = pyramidUiService.getMessageFn((pyramidAction: PyramidUIReceiveActionsUnion) => {
      switch (pyramidAction.type) {
        case PyramidUIActionTypes.RECEIVE_CMD_EXECUTE_RESULT:
          if (pyramidAction.payload.pyramidUIActionType === ActionTypes.SEND_PROJECT_BLOCK_TYPES_CREATE) {
            message.destroy();
            if (!pyramidAction.payload.cmdExecuteResult) {
              message.error('创建分类失败');
              return;
            }
            props.closeModal(true);
          }
          break;
      }
    });

    return () => {
      message.destroy();
      pyramidUiService.clearMessageFn(messageKey);
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const params = {...fieldsValue};
        params['categoryType'] = getCliCategoryType();
        params['projectPath'] = props.params.absolutePath;
        pyramidUiService.sendMessageFn(new PyramidUISendProjectBlockTypesCreateAction(params));
        message.loading('正在创建分类信息，请稍等...', 0);
      }
    });
  };

  const getCliCategoryType = () => {
    let result = 'blocks';
    if (props.params.categoryType) {
      if (props.params.categoryType === EBlockPackageAssemblyType.BLOCK) {
        result = 'blocks';
      } else if (props.params.categoryType === EBlockPackageAssemblyType.MODULE) {
        result = 'modules';
      }
    }
    return result;
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
        <FormItem label='名称'>
          {getFieldDecorator(`name`, {
            rules: [
              { required: true, message: '必填' }
            ],
          })(<Input placeholder="请输入" />)}
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

