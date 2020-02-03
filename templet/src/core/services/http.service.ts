import { httpInstance } from '@react-kit/http';
import { APP_CONFIG } from '../configs/app.config';
import {
  API_CONFIG,
  API_MAIN_PREFIXS,
} from '../configs/api.config';
import { congoService } from './congo.service';
import { notification } from 'antd';
import { HTTP_STATUS_CODE_MAPPING } from '../configs/http.config';
import { tokenService } from './token.service';
import { AxiosRequestConfig } from 'axios';

// 整理还可以配置请求实例的默认值，如headers等，详情可以使用typescript提示点进去查看
// httpInstance.defaults.headers

/**
 * 添加HTTP请求拦截器
 */
export function addHttpRequestInterceptors() {
  httpInstance.interceptors.request.use((config: AxiosRequestConfig) => {
    // 可以在发送之前为请求做一些处理
    if (belongMainApi(config.url || '')) {
      config.headers.endpointCode = tokenService.get() ? (tokenService.get().code ? tokenService.get().code : '') : '';
      config.headers.tenantId = tokenService.get() ? (tokenService.get().tenantId ? tokenService.get().tenantId : '') : '';
      if (localStorage.getItem('congoToken')) {
        config.headers.Authorization = localStorage.getItem('congoToken');
      }
    }

    return config;
  });
}

/**
 * 添加HTTP响应拦截器
 */
export function addHttpResponseInterceptors() {
  // 响应拦截器
  httpInstance.interceptors.response.use(
    res => {
      // 状态码正常
      const {
        data,
        config,
        status,
        headers,
      } = res;

      const url = config.url || '';

      // congo认证
      //if (APP_CONFIG.ACCESS_CONGO) {
        if (status === 200) {
          if (url.indexOf('/index?qic') !== -1 && data.code && data.code === 201) {
            notification.error({
              message: `业务错误`,
              description: data.msg,
            });
          }
        }
        if (status === 201) {
          // 获取 ticket 成功
          if (url.indexOf(API_CONFIG.CONGO.GET_TICKET) !== -1) {
            congoService.handle201Response(headers);
            window.parent.postMessage(JSON.stringify({
              type: 'APP_EVENT',
              msg: 'authSucceed'
            }),'*');
            return res;
          }
        }
      //}

      // 业务逻辑判断
      if (belongMainApi(url || '')) {
        // 这里的判断条件可根据实际后台判断的 code 进行判断
        if (data.code && data.code !== 200 && data.code !== '200') {
          // 提示报错信息
          if (data.msg) {
            notification.error({
              message: `业务提示`,
              description: data.msg,
            });
          }

          const err = new Error('');
          // @ts-ignore
          err.response = res;
          throw err;
        }
      }

      return res;
    },
    err => {
      // 状态码异常
      const {
        status,
        statusText,
        headers,
        config,
      } = err.response;

      const url = config.url || '';
      let errorMsg = statusText;

      const keys = Object.keys(HTTP_STATUS_CODE_MAPPING);
      if (keys.indexOf(status.toString()) !== -1) {
        errorMsg = HTTP_STATUS_CODE_MAPPING[status];
      }

      let showErrorMsg = true;

      switch (status) {
        case 401:
          if (APP_CONFIG.ACCESS_CONGO) {
            if (url.indexOf(API_CONFIG.CONGO.GET_AUTH) !== -1) {
              showErrorMsg = false;
              congoService.handle401Response(headers);
            }
          } else {
            // authService.loginout();
          }
          break;
        case 402:
          if (APP_CONFIG.ACCESS_CONGO) {
            // token过期
            localStorage.clear();
            tokenService.clear();
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            errorMsg = '由于您长时间未操作，应用登录状态已失效';
          }
          break;
        case 406:
          if (APP_CONFIG.ACCESS_CONGO) {
            showErrorMsg = false;
            notification.error({
              message: 406,
              description: '由于您长时间未操作，请重新登录'
            });
            setTimeout(() => {
              localStorage.clear();
              tokenService.clear();
              window.parent.postMessage(JSON.stringify({
                type: 'APP_EVENT',
                msg: 'overTime'
              }), '*');
            }, 1000);
          }
          break;
        default:
          break;
      }

      // 提示报错信息
      if (showErrorMsg) {
        notification.error({
          message: `请求错误`,
          description: errorMsg,
        });
      }

      return Promise.reject(err);
    }
  );
}

/**
 * 是否属于主业务地址
 */
const belongMainApi = (url: string) => API_MAIN_PREFIXS.some(prefix => url.startsWith(prefix));
