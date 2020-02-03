import React from "react";
import {Input, Button, Form, Select, Steps, Divider ,Row, Col, Icon, Radio} from 'antd';
import PropTypes from "prop-types";
import style from "../index.less";
import InputCode2D from "../code2d";
import router from "umi/router";
import {REGEX_CONFIG} from "@/core/configs/regex.config";
const Step = Steps.Step;

const Code2D = React.forwardRef(InputCode2D);

const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
const phoneError = '请输入11位有效的手机号';
class ForgotPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            autTime: 60,
            reTime: 5,
            type: 'userName',
            mobile: ''
        }
    }

    componentWillUnmount(){
        if(this.clear)
            clearInterval(this.clear);
        if(this.autTime)
            clearInterval(this.autTime);
    }

    /**
     * 1.验证用户名
     * @param e
     */
    cnameSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.cnameSubmit(values);
            }
        });
    }

    userName = (rule, value, callback) => {
        REGEX_CONFIG.LOGIN.userName(value,'').then((_value) => {
            const type = _value[1];
            if(type === 'mobile'){
                this.setState({
                    mobile: _value[0],
                    type
                })
                callback();
            }else
                callback();
        }).catch((e) => {
            callback(e);
        });
    }

    checkPrice = (rule, value, callback) => {
        if (value.number.length > 0) {
            callback();
        }else
            callback('验证码不能为空');
    };

    checkPriceMobile = (rule, value, callback) => {
        if (value.length > 0) {
            callback();
        }else
            callback('验证码不能为空');
    };

    /**
     * 2.获取验证码时验证
     */
    testPhone = () => {
        const {phone} = this.props.form.getFieldsValue();
        if (this.state.autTime === 60)
        REGEX_CONFIG.LOGIN.mobile(phone, '').then((values) => {
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
                        value: values,
                        errors: null,
                    },
                });
                this.props.authentication(values);
            }).catch((e) => {
                this.props.form.setFields({
                    phone: {
                        value: phone,
                        errors: [new Error(e)],
                    },
                });
            })
    }

    /**
     * 3.重制密码
     */
    resetpwdSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.resetpwdSubmit(values);
            }
        });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('密码与确认密码不一致！');
        } else {
            callback();
        }
    }

    userPassword  = (rule, value, callback) => {
        REGEX_CONFIG.LOGIN.password(value,'',this.props.userInfo.name).then((_value) => {
            callback();
        }).catch((e) => {
            callback(e);
        });
    }

    getUserInfo = () => {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form {...formItemLayout} onSubmit={this.cnameSubmit.bind(this)} >
                <Form.Item
                    label="登录名">
                    {getFieldDecorator('userName', {
                        initialValue: '',
                        rules: [{
                            required: true, message: '用户名不能为空',
                        }, {
                            validator: this.userName,
                        }],
                        validateTrigger: 'onBlur'
                    })(
                        <Input autoComplete="off" initialValue='' maxLength={14} placeholder="请输入用户名/手机号"/>,
                    )}
                </Form.Item>
                {this.state.type === 'mobile'? <Form.Item label=" " colon={false}>
                    {getFieldDecorator('userNameType',{
                        initialValue: this.state.type,
                    })(
                        <Radio.Group onChange={this.onChangeType} initialValue={this.state.type}>
                            <Radio checked={true} value="mobile">我输入的是手机号</Radio>
                            <Radio value="userName">我输入的是用户名</Radio>
                        </Radio.Group>,
                    )}
                </Form.Item> : null}
                <Form.Item
                    label="验证码">
                    {getFieldDecorator('code', {
                        initialValue: {number: ''},
                        rules: [{
                            required: true, message: '验证码不能为空',
                        }, {
                            validator: this.checkPrice
                        }],
                        validateTrigger: 'onSubmit'
                    })(<Code2D src={this.props.verification ? this.props.verification : ''}/>)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout} className={style.dCloud}>
                    <Button type="primary" htmlType="submit">
                        下一步
                    </Button>
                </Form.Item>
            </Form>
        )
    }

    getResetpwd = () => {
        const {getFieldDecorator} = this.props.form;
        const {mobile, remainder} = this.props.mobile;
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{width: 70}}>
                <Option value="86">+86</Option>
            </Select>,
        );

        return (
            <div>
                <div className="msg">
                    <h2 style={{fontSize: '14px'}}>密保手机</h2>
                    <h2 style={{color: '#fdb514'}}>&nbsp;{mobile}&nbsp;</h2>
                    <h2 style={{fontSize: '14px'}}>今天还有</h2>
                    <h2 style={{color: '#fdb514'}}>&nbsp;{remainder}&nbsp;</h2>
                    <h2 style={{fontSize: '14px'}}>次免费获取机会</h2>
                </div>
                <p></p>
                <Form {...formItemLayout} onSubmit={this.resetpwdSubmit.bind(this)} >
                    <Form.Item
                        label="手机号">
                        {getFieldDecorator('phone', {
                            initialValue: this.props.type === 'mobile'? this.state.mobile : '',
                            rules: [{
                                required: true, message: '手机号不能为空'
                            }, {
                                validator: this.userPhone
                            }],
                            validateTrigger: 'onSubmit'
                        })(<Input disabled={this.props.type === 'mobile'? true : false}
                                  autoComplete="off"
                                  initialValue=''
                                  maxLength={11}
                                  addonBefore={prefixSelector}
                                  style={{width: '100%'}}
                                  placeholder="请输入手机号"/>)}
                    </Form.Item>
                    <Form.Item
                        label="验证码">
                        {getFieldDecorator('code', {
                            initialValue: {number: ''},
                            rules: [{required: true, message: '验证码不能为空'}, {validator: this.checkPriceMobile}],
                        })(
                            <div style={{display: "flex"}}>
                                <div style={{flex: 2, display: "block"}}>
                                    <Input autoComplete="off" initialValue='' maxLength={6} placeholder="请输入短信验证码" id="success"/>
                                </div>

                                <div style={{flex: 1, display: "block"}}>
                                    <Button onClick={this.testPhone} style={{marginLeft: '0.5rem'}}>{this.state.autTime === 60 ? '获取短信验证码' : this.state.autTime}</Button>
                                </div>
                            </div>
                        )}
                    </Form.Item>
                    <Form.Item
                        label="新密码">
                        {getFieldDecorator('password', {
                            initialValue: '',
                            rules: [{
                                required: true, message: '新密码不能为空',
                            }, {
                                validator: this.userPassword
                            }],
                            validateTrigger: 'onChange'
                        })(
                            <Input.Password  autoComplete="new-password" initialValue='' placeholder='请输入新密码'/>
                        )}
                    </Form.Item>
                    <Form.Item
                        label="确认新密码">
                        {getFieldDecorator('confirmPassword', {
                            initialValue: '',
                            rules: [{
                                required: true, message: '确认密码不能为空',
                            }, {
                                validator: this.compareToFirstPassword
                            }],
                            validateTrigger: 'onChange'
                        })(
                            <Input.Password autoComplete="off" initialValue='' placeholder='请再次确认新密码' />
                        )}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout} className={style.dCloud}>
                        <Button type="primary" htmlType="submit">
                            确 认
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
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
     * 成功
     * @returns {*}
     */
    success = () => {
        if (!this.clear)
            this.clear = setInterval(() => {
                console.log(this.state.reTime)
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
                        <p>重置密码成功！&nbsp;{this.state.reTime}&nbsp;秒后自动返回</p>
                    </Col>
                    <Col span={24}>
                        <Button onClick={this.replace.bind(this)} style={{width:'80%', left: '10%'}} type="primary" htmlType="submit">
                            返 回
                        </Button>
                    </Col>
                </Row>
            </div>
        )
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className='login-form'>
                <Steps style={{marginBottom: '1.5rem'}} current={this.props.current}>
                    <Step key='1' title='验证用户名'></Step>
                    <Step key='2' title='重置密码'></Step>
                    <Step key='3' title='完成'></Step>
                </Steps>
                {this.props.current === 0 ? this.getUserInfo() : null}
                {this.props.current === 1 ? this.getResetpwd() : null}
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

ForgotPassword.propTypes = {
    // 1.验证用户名
    cnameSubmit:  PropTypes.func.isRequired,
    // 2.获取手机验证码回调
    authentication:  PropTypes.func.isRequired,
    // 3.重置密码
    resetpwdSubmit: PropTypes.func.isRequired
}

export default Form.create()(ForgotPassword)
