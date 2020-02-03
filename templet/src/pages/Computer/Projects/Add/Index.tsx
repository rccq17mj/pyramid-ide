import React, {FormEvent, FunctionComponent, useEffect, useState} from 'react';
import { Tabs, Button, Select, Form, Input, Modal, Switch, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
import { PyramidUISendProjectCreateAction, PyramidUISendProjectChoosePathAction, PyramidUIReceiveProjectChoosePathAction, PyramidUIActionTypes } from "@/core/pyramid-ui/action/pyramid-ui.action";
import styles from './Index.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;

interface IProps extends FormComponentProps {
  modalVisible: boolean;
  closeModal: (data?: any) => void;
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

  // const templetOptions = [{
  //   label: 'ssh://git@10.10.11.151:10022/product/bigdata-cloudplatform/templet/templet.git',
  //   value: 'ssh://git@10.10.11.151:10022/product/bigdata-cloudplatform/templet/templet.git'
  // }];

  const pkgmtOptions = [
    { label: 'yarn', value: 'yarn' },
    { label: 'npm', value: 'npm' }
  ];
  const [congoOpen, setCongoOpen] = useState(false);

  useEffect(() => {
    const messageKey = pyramidUiService.getMessageFn((action: PyramidUIReceiveProjectChoosePathAction) => {
      if (action.type === PyramidUIActionTypes.RECEIVE_PROJECT_CHOOSE_PATH) {
        form.setFieldsValue({
          path: action.payload.files
        })
      }
    });

    return () => {
      pyramidUiService.clearMessageFn(messageKey);
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      // sendMessage({'project': true, msg: 'create', 'projectInfo': fieldsValue});
      let urlName = window.location.pathname;
      if(urlName==='/pc'){
        pyramidUiService.sendMessageFn(new PyramidUISendProjectCreateAction({...fieldsValue,platform:'pc'}));
      }else{
        pyramidUiService.sendMessageFn(new PyramidUISendProjectCreateAction({...fieldsValue,platform:'mobile'}));
      }

      // getMessage((msg)=>{
      //   if(msg.hasOwnProperty('cmd-create')) {
      //     console.log('msg:', msg);
      //     // form.setFieldsValue({
      //     //   path: msg.files[0]
      //     // })
      //   }
      // })

      props.closeModal(true)

    });
  };

  const handleSelectPath = () => {
    // sendMessage({'open-file-dialog': true});
    pyramidUiService.sendMessageFn(new PyramidUISendProjectChoosePathAction());
  };

  const callback = (key) => {
    console.log(key);
  }
  const onChange = (checked) => {
    setCongoOpen(checked);
  }
  return (
    <Modal
      destroyOnClose={true}
      title=""
      width={800}
      visible={props.modalVisible}
      footer={null}
      onCancel={() => props.closeModal()}>

      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="新建应用" key="1">
          <Form onSubmit={handleSubmit} className={styles.formBox}>
            <FormItem>
              中文名称{getFieldDecorator(`name_cn`, {
                rules: [
                  { required: true, message: '必填' }
                ],
              })(<Input placeholder="中文名称" />)}
            </FormItem>
            <FormItem>
              英文名称 {getFieldDecorator(`name`, {
                rules: [
                  { required: true, message: '必填' },
                ],
              })(<Input placeholder="英文名称" />)}
            </FormItem>
            <FormItem>
              目录{getFieldDecorator(`path`, {
                rules: [
                  { required: true, message: '必填' }
                ],
              })(<Input placeholder="目录" onClick={() => handleSelectPath()} />)}
            </FormItem>

            <FormItem>
              包管理器
          {getFieldDecorator('pkgmt', { initialValue: pkgmtOptions[0].value })(
                <Select
                  placeholder="包管理器"
                  allowClear={true}
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

            <FormItem>
              模板工程
          {getFieldDecorator('template', { initialValue: templetOptions[0].value })(
                <Select
                  placeholder="模板工程"
                  allowClear={true}
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

            <FormItem>
              备注 {getFieldDecorator(`remark`, {
                rules: [
                  { required: true, message: '必填' },
                  {
                  },
                ],
              })(<Input placeholder="备注" />)}
            </FormItem>
            <p style={{ marginTop: '10px' }}>是否接入热果？</p>

            <Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              onChange={onChange}
            />
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
