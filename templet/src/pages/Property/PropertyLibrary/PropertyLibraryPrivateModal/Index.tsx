import {FormComponentProps} from "antd/lib/form";
import React, {FormEvent, FunctionComponent, useEffect, useState} from "react";
import {Button, Form, Input, message, Modal} from "antd";
import {REGEX_CONFIG} from "@/core/configs/regex.config";
import {pyramidUiService} from "@/core/pyramid-ui/service/pyramid-ui.service";
import {PyramidUISendBlockPackageInfoAction} from "@/core/pyramid-ui/action/pyramid-ui-send.action";
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
        case PyramidUIActionTypes.RECEIVE_PROJECT_BLOCK_PACKAGE_INFO:
          // 这两个要在执行结果里面处理
          const packageInfo = pyramidAction.payload.packageInfo || null;
          console.log(packageInfo);
          // TODO 将信息存到数据库中

          break;
        case PyramidUIActionTypes.RECEIVE_CMD_EXECUTE_RESULT:
          if (pyramidAction.payload.pyramidUIActionType === PyramidUIActionTypes.SEND_PROJECT_BLOCK_PACKAGE_INFO) {
            setLoading(true);
            message.destroy();
            if (!pyramidAction.payload.cmdExecuteResult) {
              message.error('读取git信息失败，请确认该地址是否有效');
            }
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
