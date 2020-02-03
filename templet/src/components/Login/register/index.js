import React from 'react';
import {Input, Button, Form, Select, Steps, Divider ,Row, Col, Icon} from 'antd';
import style from '../index.less';
import code from "assets/images/code.png";
import logo from "./gogbuylogo.png";
import router from "umi/router";
import PropTypes from "prop-types";
import {REGEX_CONFIG} from "@/core/configs/regex.config";

const { Option } = Select;
const Step = Steps.Step;

class Register extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            autTime: 60,
            reTime: 5
        }
    }


    componentWillUnmount(){
        if(this.clear)
            clearInterval(this.clear);
        if(this.autTime)
            clearInterval(this.autTime);
    }


    /**
     * 验证手机提交
     * @param e
     */
    cellphoneSubmit = (e) => {
        const _then = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.cellphoneSubmit(values);
                this.props.userInfo.phone = values.phone;
            }
        });
    }

    /**
     * 新建用户名验证
     * @param e
     */
    createAccountsSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.accountsSubmit(values);
            }
        });
    }

    checkPrice = (rule, value, callback) => {
        if (value.length > 0) {
            callback();
        }else
            callback('短信验证码不能为空');
    };

    userName = (rule, value, callback) => {
        REGEX_CONFIG.LOGIN.userName(value,'').then((_value, type) =>{
            if(type === 'mobile'){
                debugger
            }else
                this.props.userInfo.name = _value;
            callback();
        }).catch((e) => {
            callback(e);
        })
    }

    userPhone = (rule, value, callback) => {
        REGEX_CONFIG.LOGIN.mobile(value,'').then((_value) =>{
            callback();
        }).catch((e) => {
            callback(e);
        })
    }

    /**
     * 获取验证码时验证
     */
    testPhone = () => {
        const {phone} = this.props.form.getFieldsValue();
        if (this.state.autTime === 60)
        REGEX_CONFIG.LOGIN.mobile(phone,'').then((_value) =>{
                this.autTime = setInterval(() => {
                    if (this.state.autTime !== 0)
                        this.setState({
                            autTime: this.state.autTime - 1
                        })
                    else {
                        clearInterval(this.autTime);
                        this.setState({
                            autTime: 60
                        })
                    }
                }, 1000);
                this.props.form.setFields({
                    phone: {
                        value: _value,
                        errors: null,
                    },
                });
                this.props.authentication(_value);
            }).catch((e) => {
                e = e? e: '手机号不能为空';
                this.props.form.setFields({
                    phone: {
                        value: phone,
                        errors: [new Error(e)]
                    }
                });
            })
    }

    userPassword  = (rule, value, callback) => {
        REGEX_CONFIG.LOGIN.password(value,'',this.props.userInfo.name).then((_value) => {
            callback();
        }).catch((e) => {
            callback(e);
        });
    }

    /**
     * 验证密码是否一致
     * @param rule
     * @param value
     * @param callback
     */
    newPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('密码与确认密码不一致！');
        } else {
            callback();
        }
    }

    /**
     * 第一步，验证手机
     * @returns {*}
     */
    getCellphone = () => {
        const {getFieldDecorator} = this.props.form;
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{width: 70}}>
                <Option value="86">+86</Option>
            </Select>,
        );

            return (
                <Form {...formItemLayout} onSubmit={this.cellphoneSubmit.bind(this)} className="login-form">
                    <Form.Item
                        label="手机号">
                        {getFieldDecorator('phone', {
                            initialValue: '',
                            rules: [{
                                required: true, message: '手机号不能为空'
                            }, {
                                validator: this.userPhone
                            }],
                            validateTrigger: 'onSubmit'
                        })(<Input autoComplete="off" initialValue='' maxLength={11} addonBefore={prefixSelector} style={{width: '100%'}}
                                  placeholder="请输入手机号"/>)}
                    </Form.Item>
                    <Form.Item
                        label="验证码">
                        {getFieldDecorator('code', {
                            initialValue: {number: 0},
                            rules: [{required: true, message: '验证码不能为空'}, {validator: this.checkPrice}],
                        })(
                            <div style={{display: "flex"}}>
                                <div style={{flex: 2, display: "block"}}>
                                    <Input autoComplete="off" defaultValue='' maxLength={6} placeholder="请输入短信验证码" id="success"/>
                                </div>

                                <div style={{flex: 1, display: "block"}}>
                                    <Button onClick={this.testPhone} style={{marginLeft: '0.5rem'}}>{this.state.autTime === 60 ? '获取短信验证码' : this.state.autTime}</Button>
                                </div>
                            </div>
                        )}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout} className={style.dCloud}>
                        <Button type="primary" htmlType="submit">
                            下一步
                        </Button>
                    </Form.Item>
                </Form>
            )
    }

    /**
     * 第二部，创建账户
     * @returns {*}
     */
    getCreateAccounts = () => {
        const {getFieldDecorator} = this.props.form;
        if (!this.props.duplication)
            return (
                <Form {...formItemLayout} onSubmit={this.createAccountsSubmit.bind(this)} >
                    <Form.Item
                        label="用户名">
                        {getFieldDecorator('userName', {
                            initialValue: '',
                            rules: [{
                                required: true, message: '用户名不能为空',
                            }, {
                                validator: this.userName,
                            }],
                        })(
                            <Input autoComplete="off" initialValue='' maxLength={14} placeholder="请输入用户名，可以使用中、英文名"/>,
                        )}
                    </Form.Item>
                    <Form.Item
                        label="密码">
                        {getFieldDecorator('password', {
                            initialValue: '',
                            rules: [{
                                required: true, message: '密码不能为空',
                            }, {
                                validator: this.userPassword
                            }],
                            validateTrigger: 'onChange'
                        })(
                            <Input.Password autoComplete="new-password" initialValue='' placeholder='请输入密码'/>
                        )}
                    </Form.Item>
                    <Form.Item
                        label="确认新密码">
                        {getFieldDecorator('newPassword', {
                            initialValue: '',
                            rules: [{
                                required: true, message: '确认密码不能为空',
                            }, {
                                validator: this.newPassword
                            }],
                            validateTrigger: 'onChange'
                        })(
                            <Input.Password autoComplete="new-password" initialValue='' placeholder='请再次确认新密码'/>
                        )}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout} className={style.dCloud}>
                        <Button type="primary" htmlType="submit">
                            注 册
                        </Button>
                    </Form.Item>
                </Form>
            )
        else
            return this.getGogbuyUser();
    }

    /**
     * 如果是链接就返回链接，如果是路由就返回路由
     */
    replace() {
        REGEX_CONFIG.LOGIN.url(this.props.login).then((v) => {
            window.location.href = v;
        }).catch(() => {
            router.replace(this.props.login);
        })
    }

    /**
     * 监测到那家网有注册过
     */
    getGogbuyUser = () => {
        return (
            <div className="msg">
                <h2 style={{color: '#fdb514'}}>{this.props.userInfo.phone}&nbsp;</h2>
                <h2 style={{fontSize: '14px'}}>已被注册，并绑定了以下电商云账户，请确认是否归你所有。</h2>
                    <Row>
                        <Col span={24}>
                            <Divider/>
                            <img src={this.props.avatar? this.props.avatar : logo} onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = logo}}/>
                            <p>{this.props.userInfo.platform} <br></br> 用户名：{this.props.userInfo.name}</p>
                            <Divider/>
                        </Col>
                        <Col span={24}>
                            <Button onClick={this.replace.bind(this)} style={{width:'80%', left: '10%'}} type="primary" htmlType="submit">
                                是我的，立即登录
                            </Button>
                        </Col>
                        <Col span={24}>
                            <div style={{float: 'right'}}>
                                <p>不是我的，</p><a onClick={() => {this.props.newUser()}}>注册新用户</a>
                            </div>
                        </Col>
                    </Row>
            </div>
        )
    }

    success = () => {
        if (!this.clear)
            this.clear = setInterval(() => {
                if (this.state.reTime !== 0)
                    this.setState({
                        reTime: this.state.reTime - 1
                    })
                else {
                    this.replace();
                }
            }, 1000);
        return (
            <div className="success">
                <Row>
                    <Col span={24}>
                        <Icon type="check-circle" theme="filled" />
                        <p></p>
                    </Col>
                    <Col span={24}>
                        <p>注册成功！&nbsp;{this.state.reTime}&nbsp;秒后自动返回</p>
                    </Col>
                    <Col span={24}>
                        <Button onClick={this.replace.bind(this)} style={{width:'80%', left: '10%'}} type="primary" htmlType="submit">
                            立即登录
                        </Button>
                    </Col>
                </Row>
            </div>
        )
    }

    render() {
        return (
            <div className='login-form'>
                <Steps style={{marginBottom: '1.5rem'}} current={this.props.current}>
                    <Step key='1' title='验证手机'></Step>
                    <Step key='2' title='创建账户'></Step>
                    <Step key='3' title='注册成功'></Step>
                </Steps>
                {this.props.current === 0 ? this.getCellphone() : null}
                {this.props.current === 1 ? this.getCreateAccounts() : null}
                {this.props.current === 2 ? this.success() : null}
            </div>
        )
    }
}

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 18,
            offset: 3,
        },
    },
};

const MaxFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 22,
            offset: 1,
        },
    },
};

Register.propTypes = {
    // 1.获取手机验证码回调
    authentication:  PropTypes.func.isRequired,
    // 2.验证手机是否重复，是否在那家网注册回调
    cellphoneSubmit:  PropTypes.func.isRequired,
    // 3.输入用户名密码回调
    accountsSubmit: PropTypes.func.isRequired,
    // 跳过，直接创建新用户
    newUser:  PropTypes.func.isRequired
}

export default Form.create()(Register)
