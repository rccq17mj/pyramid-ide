import React from "react";
import router from 'umi/router';
import {Input, Button, Form, Icon, Modal, Tabs, Select} from 'antd';
import {REGEX_CONFIG} from "@/core/configs/regex.config";
import InputCode2D from "./code2d";
import style from './index.less';
import code from './2dcode.png'
import Phone from './phone/index'
import TabBarExample from "../TabBarExample/TabBarExample";

const Code2D = React.forwardRef(InputCode2D);
const TabPane = Tabs.TabPane;
class Login extends React.Component {

    verification = null;
    constructor(props) {
        super(props);
        this.state = {
            autTime: 60,
            codeVisible: false
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(this.props.submit)
                    this.props.submit(values);
            }
        });
    }

    phoneSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(this.props.submit)
                    this.props.phoneSubmit(values);
            }
        });
    }

    /**
     * 验证码提示
     * @param rule
     * @param value
     * @param callback
     */
    checkPrice = (rule, value, callback) => {
        if (value.number.length > 0) {
            callback();
            return;
        }
        callback('验证码不能为空！');
    };

    userPhone = (rule, value, callback) => {
        REGEX_CONFIG.LOGIN.mobile(value,'').then((_value) =>{
            callback();
        }).catch((e) => {
            callback(e);
        })
    }

    /**
     * 用户名密码登录（表单）
     */
    getPassportForm = () => {
        const { getFieldDecorator } = this.props.form;
        const { verification } = this.props;
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                <Form.Item>
                    {getFieldDecorator('userName', {
                        rules: [{
                            required: true, message: '用户名不能为空',
                        }, {
                            // validator: this.password,
                        }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="请输入用户名/手机号"
                            maxLength={14}
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: '密码不能为空',
                        }, {
                            // validator: this.password,
                        }],
                    })(
                        <Input.Password
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="请输入密码"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('code', {
                        initialValue: { number: '' },
                        rules: [{ validator: this.checkPrice }],
                    })(<Code2D src={verification? verification : ''} />)}
                </Form.Item>
                <Form.Item className={style.dCloud}>
                    <Button style={this.props.btnStyle} type="primary" htmlType="submit">
                        登录
                    </Button>
                    {/* <p>没有账号？</p><a onClick={() => { router.push( this.props.register + '?login=' + this.props.login); }}>立即注册</a>
                    <a onClick={() => { router.push(this.props.forgetPassword + '?login=' + this.props.login)}} className={style.forgot} >
                        忘记密码？
                    </a> */}
                </Form.Item>
            </Form>
        )
    }



    render() {
        return (
            <div className={`${style.login_module} ${this.props.style}`}>
                <div className="code-login" onClick={() => {this.setState({codeVisible: true})}}>
                    <p><Icon type="scan" />扫码登录</p><div className="dui-tips"></div>
                    <img src={code} />
                </div>
                <div className={style.from}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="密码登录" key="1">
                            {this.getPassportForm()}
                        </TabPane>
                        <TabPane  tab={<span><Icon type="mobile" />短信登录</span>} key="2">
                          <Phone
                              btnStyle={this.props.btnStyle}
                              authentication={this.props.authentication}
                              phoneSubmit={this.props.phoneSubmit}>
                          </Phone>
                        </TabPane>
                    </Tabs>
                    {/*<div className={style.title}>密码登录</div>*/}
                    {/*{this.getPassportForm()}*/}
                </div>
                <Modal
                    title="扫码登录"
                    footer={null}
                    visible={this.state.codeVisible}
                    keyboard={false}
                    // maskClosable={false}
                    onCancel={() => {this.setState({codeVisible: false})}}>
                    {this.props.QrCode || <p style={{textAlign : 'center'}}>敬请期待</p>}
                </Modal>
            </div>
        );
    }
}

export default Form.create()(Login)
