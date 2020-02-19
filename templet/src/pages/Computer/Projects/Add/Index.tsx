import React, {FormEvent, FunctionComponent, useEffect, useState} from 'react';
import { Tabs, Button, Select, Form, Input, Modal, Switch, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
import { PyramidUISendProjectCreateAction, PyramidUISendProjectChoosePathAction } from "@/core/pyramid-ui/action/pyramid-ui-send.action";
import {PyramidUIActionTypes} from "@/core/pyramid-ui/action";
import {PyramidUIReceiveProjectChoosePathAction} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
import {EPlatform} from "@/enums/platform.enum";

const FormItem = Form.Item;
const { TabPane } = Tabs;

interface IProps extends FormComponentProps {
  modalVisible: boolean;
  closeModal: (data?: any) => void;
  params: {platform: EPlatform}
}

const Component: FunctionComponent<IProps> = props => {
  const [activeKey, setActiveKey] = useState<string>('1');

  const {
    form,
    form: { getFieldDecorator },
  } = props;

  const templetOptions = [{
    label: 'https://github.com/guccihuiyuan/pyramid-pro#master',
    value: 'https://github.com/guccihuiyuan/pyramid-pro#master'
  }];

  const pkgmtOptions = [
    { label: 'yarn', value: 'yarn' },
  ];

  const handleSelectPath = () => {
    pyramidUiService.sendMessageFn(new PyramidUISendProjectChoosePathAction());
  };

  useEffect(() => {
    const messageKey = pyramidUiService.getMessageFn((action: PyramidUIReceiveProjectChoosePathAction) => {
      switch (action.type) {
        case PyramidUIActionTypes.RECEIVE_PROJECT_CHOOSE_PATH:
          form.setFieldsValue({
            path: action.payload.files
          });
          break;
        default:
          break;
      }
    });

    return () => {
      pyramidUiService.clearMessageFn(messageKey);
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }

      switch (props.params.platform) {
        case EPlatform.PC:
          pyramidUiService.sendMessageFn(new PyramidUISendProjectCreateAction({...fieldsValue,platform: EPlatform.PC}));
          break;
        case EPlatform.MOBILE:
          pyramidUiService.sendMessageFn(new PyramidUISendProjectCreateAction({...fieldsValue,platform: EPlatform.MOBILE}));
          break;
      }
      props.closeModal(true);
    });
  };

  return (
    <Modal
      destroyOnClose={true}
      title=""
      width={800}
      visible={props.modalVisible}
      footer={null}
      onCancel={() => props.closeModal()}>

      <Tabs activeKey={activeKey} onChange={activeKey => {
        setActiveKey(activeKey);
      }}>
        {/* 新建 */}
        <TabPane tab="新建应用" key="1">
          {
            activeKey === '1' ? (
              <Form onSubmit={handleSubmit}>
                <FormItem label={'中文名称'}>
                  {getFieldDecorator(`name_cn`, {
                    rules: [
                      { required: true, message: '必填' }
                    ],
                  })(<Input placeholder="请输入" />)}
                </FormItem>

                <FormItem label='英文名称'>
                  {getFieldDecorator(`name`, {
                    rules: [
                      { required: true, message: '必填' },
                    ],
                  })(<Input placeholder="请输入" />)}
                </FormItem>

                <FormItem label='目录'>
                  {getFieldDecorator(`path`, {
                    rules: [
                      { required: true, message: '必填' }
                    ],
                  })(<Input placeholder="请选择" onClick={() => {
                    handleSelectPath();
                  }} />)}
                </FormItem>

                <FormItem label={'包管理器'}>
                  {getFieldDecorator('pkgmt', {
                    initialValue: pkgmtOptions[0].value,
                    rules: [
                      { required: true, message: '必选' }
                    ],
                  })(
                    <Select
                      placeholder="包管理器"
                      allowClear={false}
                    >
                      {pkgmtOptions.map(data => {
                        return (
                          <Select.Option value={data.value} key={data.value}>
                            {data.label}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>

                <FormItem label='模板工程地址'>
                  {getFieldDecorator('template', {
                    initialValue: templetOptions[0].value,
                    rules: [
                      { required: true, message: '必选' }
                    ]
                  })(
                    <Select
                      placeholder="模板工程地址"
                      allowClear={false}
                    >
                      {templetOptions.map(data => {
                        return (
                          <Select.Option value={data.value} key={data.value}>
                            {data.label}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>

                <FormItem label='备注'>
                  {getFieldDecorator(`remark`, {
                    rules: [
                    ],
                  })(<Input placeholder="请输入" />)}
                </FormItem>

                <FormItem label='是否接入热果'>
                  {getFieldDecorator(`accessCongo`, {
                    initialValue: false,
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

                {
                  form.getFieldValue('accessCongo') ? (
                    <>
                      <FormItem label='appKey'>
                        {getFieldDecorator(`appKey`, {
                          rules: [
                            { required: true, message: '必填' },
                            {
                            },
                          ],
                        })(<Input placeholder="请输入" />)}
                      </FormItem>
                    </>
                  ) : null
                }

                <FormItem >
                  <Button type="primary" htmlType="submit">
                    创建
                  </Button>
                </FormItem>
              </Form>
            ) : null
          }
        </TabPane>

        {/* 导入应用 */}
        <TabPane tab="导入应用" key="2">
          {
            activeKey === '2' ? (
              <Form>
                <FormItem label='请选择目录'>
                  {getFieldDecorator(`importPath`, {
                    rules: [
                      { required: true, message: '必填' }
                    ],
                  })(<Input placeholder="请选择" onClick={() => handleSelectPath()} />)}
                </FormItem>
                <FormItem >
                  <Button type="primary" htmlType="submit">
                    确定
                  </Button>
                </FormItem>
              </Form>
            ) : null
          }
        </TabPane>

      </Tabs>

    </Modal>
  );
};

export default Form.create<IProps>()(Component);
