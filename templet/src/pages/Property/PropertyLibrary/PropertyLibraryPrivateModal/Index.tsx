import {FormComponentProps} from "antd/lib/form";
import React, {FormEvent, FunctionComponent, useEffect, useState} from "react";
import {Button, Form, Input, message, Modal} from "antd";
import {REGEX_CONFIG} from "@/core/configs/regex.config";
import {pyramidUiService} from "@/core/pyramid-ui/service/pyramid-ui.service";
import {
  PyramidUISendBlockPackageInfoAction,
  PyramidUISendInsertPrivateBlockPackageInfoAction
} from "@/core/pyramid-ui/action/pyramid-ui-send.action";
import {PyramidUIReceiveActionsUnion} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
import {PyramidUIActionTypes} from "@/core/pyramid-ui/action";

const FormItem = Form.Item;

interface IProps extends FormComponentProps {
  modalVisible: boolean;
  closeModal: (data?: any) => void;
}

const Component: FunctionComponent<IProps> = props => {
  const [loading, setLoading] = useState<boolean>(false);

  const {form, form: { getFieldDecorator }} = props;

  useEffect(() => {
    const messageKey = pyramidUiService.getMessageFn((pyramidAction: PyramidUIReceiveActionsUnion) => {
      switch (pyramidAction.type) {
        // 读取线上区块包信息
        case PyramidUIActionTypes.RECEIVE_PROJECT_BLOCK_PACKAGE_INFO:
          // 这两个要在执行结果里面处理
          const packageInfo = pyramidAction.payload.packageInfo || null;
          // 将信息存到数据库中
          if (packageInfo) {
            message.loading('正在保存信息，请稍等...', 0);
            pyramidUiService.sendMessageFn(new PyramidUISendInsertPrivateBlockPackageInfoAction(packageInfo));
          }

          break;
        // 执行反馈
        case PyramidUIActionTypes.RECEIVE_CMD_EXECUTE_RESULT:
          // 获取线上区块包信息
          if (pyramidAction.payload.pyramidUIActionType === PyramidUIActionTypes.SEND_PROJECT_BLOCK_PACKAGE_INFO) {
            if (!pyramidAction.payload.cmdExecuteResult) {
              setLoading(false);
              message.error('读取git信息失败，请确认该地址是否有效');
            }
          }
          // 保存私有区块包
          else if (pyramidAction.payload.pyramidUIActionType === PyramidUIActionTypes.SEND_INSERT_PRIVATE_BLOCK_PACKAGE_INFO) {
            setLoading(false);
            message.destroy();
            if (!pyramidAction.payload.cmdExecuteResult) {
              message.error('保存区块信息失败，请重新尝试');
              return;
            }
            message.success('信息保存成功');
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
      if (err) {
        return;
      }

      setLoading(true);
      message.loading('正在查询区块，请稍等...', 0);

      // 发送获取区块信息
      pyramidUiService.sendMessageFn(new PyramidUISendBlockPackageInfoAction({
        projectGitUrl: fieldsValue.gitUrl,
        projectGitBranch: 'master',
      }));
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
            initialValue: 'https://github.com/guccihuiyuan/pyramid-blocks',
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
          <Button
            disabled={loading}
            type={"danger"}
            onClick={() => {
            props.closeModal();
          }}>关闭</Button>
        </FormItem>
      </Form>
    </Modal>
  )
};

export default Form.create<IProps>({})(Component)
