import React, {FunctionComponent} from 'react';
import { Layout, Form, Button, Input, Select } from 'antd';
import {FormComponentProps} from "antd/lib/form";
const { Content } = Layout;
const FormItem = Form.Item;
const { Option } = Select;

interface IProps extends FormComponentProps {
}

const PropertyModule: FunctionComponent<IProps> = (props) =>{
  const {form, form: { getFieldDecorator } } = props;

  return(
    <Layout>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content
          style={{
            background: '#212121',
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >

          {/* 表单 */}
          <Form
            layout="inline"
            onSubmit={e => {
              e.preventDefault();
            }}
          >
            <FormItem>
              {getFieldDecorator('select',{
                initialValue:'mobile',
              })(
                <Select
                  size={'default'}
                  style={{minWidth:'80px'}}
                >
                  <Option value="mobile">移动端</Option>
                  <Option value="pc">PC端</Option>
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('search')(<Input placeholder="请输入资产名称" />)}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                }}
                style={{ marginLeft: 8 }}
              >
                管理
              </Button>
            </FormItem>
          </Form>
        </Content>
      </Layout>
    </Layout>
  )
};

export default Form.create<IProps>({})(PropertyModule)
