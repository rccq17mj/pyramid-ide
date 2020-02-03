import {FormEvent, FunctionComponent, useEffect} from "react";
import {Button, Col, Form, Input, Modal, Row, Select} from "antd";
import React from "react";
import {FormComponentProps} from "antd/lib/form";
import {REGEX_CONFIG} from "@/core/configs/regex.config";
import {pyramidUiService} from "@/core/pyramid-ui/service/pyramid-ui.service";
import {PyramidUISendProjectModuleCreateAction} from "@/core/pyramid-ui/action/pyramid-ui.action";
import {IBlockCard} from "@/interfaces/block/block.interface";

const FormItem = Form.Item;

interface IProps extends FormComponentProps {
  modalVisible: boolean;
  closeModal: (data?: any) => void;
  params?: IBlockCard;
}

const Component: FunctionComponent<IProps> = props => {
  useEffect(() => {
    if (props.params) {
      form.setFieldsValue({
        menuNameZh: props.params.name,
        menuNameEn: props.params.key,
        routePath: '/' + props.params.key,
        filePath: '/' + props.params.key,
        remark: props.params.description
      });
    }
  }, []);

  const packages = [
    {
      name: 'yarn'
    }
  ];

  const {form, form: { getFieldDecorator }} = props;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      pyramidUiService.sendMessageFn(new PyramidUISendProjectModuleCreateAction(fieldsValue));
      props.closeModal(true);
    });
  };

  return (
    <Modal
      destroyOnClose={true}
      title={'新增路由'}
      width={800}
      visible={props.modalVisible}
      footer={null}
      onCancel={() => props.closeModal()}
    >
      <Form layout="vertical" onSubmit={handleSubmit}>
        <FormItem label="菜单名称">
          <Row gutter={16}>
            <Col span={12}>
              {getFieldDecorator(`menuNameZh`, {
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
              })(<Input placeholder="中文名称" />)}
            </Col>
            <Col span={12}>
              {getFieldDecorator(`menuNameEn`, {
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
              })(<Input placeholder="英文名称" />)}
            </Col>
          </Row>
        </FormItem>
        <FormItem label="路由路径">
          <Row gutter={16}>
            <Col span={24}>
              {getFieldDecorator(`routePath`, {
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
            </Col>
          </Row>
        </FormItem>
        <FormItem label="文件路径">
          <Row gutter={16}>
            <Col span={24}>
              {getFieldDecorator(`filePath`, {
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
            </Col>
          </Row>
        </FormItem>
        <FormItem label="包管理器">
          <Row gutter={16}>
            <Col span={24}>
              {getFieldDecorator(`package`, {
                initialValue: packages[0].name,
                rules: [
                  {
                    required: true,
                    message: '必填',
                  }
                ],
              })(
                <Select placeholder="请选择">
                  {packages.map(data => {
                    return (
                      <Select.Option value={data.name} key={data.name}>
                        {data.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Col>
          </Row>
        </FormItem>
        <FormItem label="备注">
          <Row gutter={16}>
            <Col span={24}>
              {getFieldDecorator(`remark`, {
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
              })(
                <Input placeholder="用于页面统计" />
              )}
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <div style={{textAlign: 'center'}}>
            <Button type={"primary"} style={{marginRight: 20}} htmlType="submit">创建</Button>
            <Button onClick={() => props.closeModal()}>取消</Button>
          </div>

        </FormItem>
      </Form>
    </Modal>
  )
};

export default Form.create<IProps>()(Component);
