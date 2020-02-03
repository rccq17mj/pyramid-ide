import React from "react";
import {Button, Form, Icon, Input, Modal, Select, Tabs} from "antd";
import {REGEX_CONFIG} from "@/core/configs/regex.config";
import PropTypes from "prop-types";
import style from "../index.less";

/**
 * 手机快速登录
 */
class Phone extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            autTime: 60
        }
    }

    componentWillUnmount(){
        if(this.clear)
            clearInterval(this.clear);
        if(this.autTime)
            clearInterval(this.autTime);
    }

    phoneSubmit = (e) => {
        const _props = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(_props.phoneSubmit)
                    _props.phoneSubmit(values);
            }
        });
    }


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
                e = e? e: '手机号不能为空';
                this.props.form.setFields({
                    phone: {
                        value: phone,
                        errors: [new Error(e)],
                    },
                });
            })
    }

    userPhone = (rule, value, callback) => {
        REGEX_CONFIG.LOGIN.mobile(value,'').then((_value) =>{
            callback();
        }).catch((e) => {
            callback(e);
        })
    }

    checkPriceMobile = (rule, value, callback) => {
        if (value.length > 0) {
            callback();
        }else
            callback('');
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{width: 70}}>
                <Option value="86">+86</Option>
            </Select>,
        );

        return (
            <Form onSubmit={this.phoneSubmit.bind(this)} className="login-form">
                <Form.Item>
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
                <Form.Item>
                    {getFieldDecorator('phoneCode', {
                        initialValue: {number: ''},
                        rules: [{required: true, message: '验证码不能为空'}, {validator: this.checkPriceMobile}],
                    })(
                        <div style={{display: "flex"}}>
                            <div style={{flex: 2, display: "block"}}>
                                <Input autoComplete="off" defaultValue='' maxLength={6} placeholder="请输入短信验证码" id="success"/>
                            </div>

                            <div style={{flex: 1, display: "block"}}>
                                <Button style={this.props.btnStyle} onClick={this.testPhone} style={{marginLeft: '0.5rem'}}>{this.state.autTime === 60 ? '获取短信验证码' : this.state.autTime}</Button>
                            </div>
                        </div>
                    )}
                </Form.Item>
                <Form.Item className={style.dCloud}>
                    <Button style={this.props.btnStyle} type="primary" htmlType="submit">
                        登录
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(Phone)


Phone.propTypes = {
    // 验证成功回调
    phoneSubmit: PropTypes.func,
    // 按钮样式
    btnStyle: PropTypes.object

}
