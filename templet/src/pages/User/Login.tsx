import React, { useEffect, useState, FunctionComponent } from "react";
import { HTTP_CONTENT_TYPE } from '@/core/configs/http.config';
import { message, Form, Icon, Input } from "antd";
import styles from './Login.less';
import { httpService } from '@react-kit/http';
import { API_CONFIG } from '@/core/configs/api.config';
import { connect } from "dva";
import router from "umi/router";
import Login from "@/components/Login"


const Component: FunctionComponent = props => {
  const [auth, setAuth] = useState(null);
  const [verification, setVerification] = useState(null);

  useEffect(() => {
    httpService
      .post(
        API_CONFIG.SSO.INDEX,
        {
          qic: API_CONFIG.QIC,
          endpoint: 'congoOs',
          server: '',
          t: new Date().getTime()
        },
        HTTP_CONTENT_TYPE.FORM
      ).then(res => {
        setAuth(res.data.data);
      });
  }, [])

  useEffect(() => {
    if (auth) {
      get2dCode();
    }
  }, [auth]);

  const get2dCode = (t = null) => {
    t = t ? '&refresh=' + t : '&refresh=';
    setVerification(API_CONFIG.SSO.GET_CODED + '?rst=' + auth.rst + t);
  }
  /**
  * 1.获取短信验证码
  * @param phone
  */
  const authentication = (mobile) => {
      httpService.get(API_CONFIG.SSO.GET_VCODE, {
        mobile,
        t: new Date().getTime()
      }).then(res => {
        if(res.data.code === 200){
          message.success(res.data.msg);
        } else
          message.error(res.data.msg);
      })
  }

  /**
   * 提交
   * @param values 
   */
  const submit = (values) => {
    const { appKey , rst}  = auth;
    httpService
      .post(
        API_CONFIG.SSO.LOGIN,
        {
          appKey,
          rst,
          captcha: values.code.number,
          password: btoa(values.password),
          username: values.userName,
          t: new Date().getTime()
        },
        HTTP_CONTENT_TYPE.FORM
      ).then(res => {
        success(res)
      });
  }

  /**
   * 手机号快速登录
   */
  const phoneSubmit = (values) => {
    const {rst}  = auth;
    httpService
    .post(
      API_CONFIG.SSO.M_LOGIN,
      {
        rst,
        mobile: values.phone,
        validCode: values.phoneCode,
        t: new Date().getTime()
      },
      HTTP_CONTENT_TYPE.FORM
    ).then(res => {
      success(res)
    });
  }

  const success = (res) => {
    const {ticket} = res.data.data;
    if(res.data.code === 200){
      // 直接消费ticket
      httpService.get(
        API_CONFIG.CONGO.GET_TICKET,
        {
          ticket
        }
      ).then(res => {
        if(res.data.code === 200){
          message.success(res.data.msg);
        }else
          message.error(res.data.msg);
      });
    }else{
      message.error(res.data.msg);
      get2dCode(new Date().getTime());
    }
  }

  return (
    <div className={styles.main}>
      <Login verification={verification}
        authentication={authentication}
        submit={submit}
        phoneSubmit={phoneSubmit}
        login='./user/login'
        register=''
        forgetPassword=''>
      </Login>
    </div>
  )
};

export default Form.create({})(Component);
