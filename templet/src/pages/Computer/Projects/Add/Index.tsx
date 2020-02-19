import React, {FormEvent, FunctionComponent, useEffect, useState} from 'react';
import { Tabs, Button, Select, Form, Input, Modal, Switch, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
import { PyramidUISendProjectCreateAction, PyramidUISendProjectChoosePathAction } from "@/core/pyramid-ui/action/pyramid-ui-send.action";
import {PyramidUIActionTypes} from "@/core/pyramid-ui/action";
import {PyramidUIReceiveProjectChoosePathAction} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
import {EPlatform} from "@/enums/platform.enum";
import styles from './Index.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;

interface IProps extends FormComponentProps {
  modalVisible: boolean;
  closeModal: (data?: any) => void;
  params: {platform: EPlatform}
}

const Component: FunctionComponent<IProps> = props => {
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

  const [congoOpen, setCongoOpen] = useState(false);

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

    form.validateFields((err, fieldsValue) => {
      switch (props.params.platform) {
        case EPlatform.PC:
          pyramidUiService.sendMessageFn(new PyramidUISendProjectCreateAction({...fieldsValue,platform: EPlatform.PC}));
          break;
        case EPlatform.MOBILE:
          pyramidUiService.sendMessageFn(new PyramidUISendProjectCreateAction({...fieldsValue,platform: EPlatform.MOBILE}));
          break;
      }
      props.closeModal(true)
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

      <Tabs defaultActiveKey="1">
        {/* 新建 */}
        <TabPane tab="新建应用" key="1">
          <Form onSubmit={handleSubmit} className={styles.formBox}>
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
                pyramidUiService.sendMessageFn(new PyramidUISendProjectChoosePathAction());
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

            {/*<p style={{ marginTop: '10px' }}>是否接入热果？</p>*/}



            <div>
              {congoOpen ?
                <div className={styles.congoBox}>
                  <FormItem>
                    请选择项目 {getFieldDecorator(`remark`, {
                    rules: [
                      { required: true, message: '必填' },
                      {
                      },
                    ],
                  })(<Input placeholder="请选择项目" />)}
                  </FormItem>
                  <FormItem>
                    appKey {getFieldDecorator(`remark`, {
                    rules: [
                      { required: true, message: '必填' },
                      {
                      },
                    ],
                  })(<Input placeholder="appKey" />)}
                  </FormItem>
                  <FormItem>
                    应用编码 {getFieldDecorator(`remark`, {
                    rules: [
                      { required: true, message: '必填' },
                      {
                      },
                    ],
                  })(<Input placeholder="应用编码" />)}
                  </FormItem>
                </div> : null}
            </div>

            <FormItem >
              <Button type="primary" htmlType="submit" style={{ marginRight: '2rem', marginTop: '1rem' }}>
                创建
              </Button>
            </FormItem>
          </Form>

        </TabPane>

        {/* 导入应用 */}
        <TabPane tab="导入应用" key="2">
          <div className={styles.mainBox}>
            <Form>
              <FormItem>
                请选择目录{getFieldDecorator(`path`, {
                rules: [
                  { required: true, message: '必填' }
                ],
              })(<Input placeholder="请选择目录" onClick={() => handleSelectPath()} />)}
              </FormItem>
              <FormItem >
                <Button type="primary" htmlType="submit" style={{ marginTop: '1rem' }}>
                  确定
                </Button>
              </FormItem>
            </Form>
          </div>
        </TabPane>

      </Tabs>

    </Modal>
  );
};

export default Form.create<IProps>()(Component);
