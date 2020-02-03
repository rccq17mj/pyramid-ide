import { HTTP_CONTENT_TYPE } from '@/core/configs/http.config';
import { HttpRequestType, httpService } from '@react-kit/http';
import { message } from 'antd';
import { AxiosRequestConfig } from "axios";

interface IConfig {
  /**
   * 请求方法
   */
  method?: HttpRequestType;
  /**
   * 其他参数配置
   */
  options?: AxiosRequestConfig;
  /**
   * loading提示信息
   */
  tipStr?: string | null;
  /**
   * 从哪个字段来取数据（注：只有 object、list 方法可用）
   */
  dataField?: string;
}

/**
 * 导出请求基础类
 */
export class BaseRequest {
  /**
   * 获取对象
   * @param url
   * @param params
   * @param config
   */
  object<T>(
    url: string,
    params: any = {},
    config: IConfig = { method: 'GET', options: HTTP_CONTENT_TYPE.FORM, tipStr: null, dataField: 'data'}
  ): Promise<T> {
    if (config) {
      if (!config.method) {
        config.method = 'GET';
      }
      if (!config.options) {
        config.options = HTTP_CONTENT_TYPE.FORM
      }
      if (!config.tipStr) {
        config.tipStr = null
      }
      if (!config.dataField) {
        config.dataField = 'data'
      }
    }

    let hide: any;
    if (config.tipStr) {
      hide = message.loading(config.tipStr + '...', 0);
    }
    return httpService.request(config.method, url, params, config.options).then(res => {
      if (config.tipStr) {
        setTimeout(hide, 0);
      }
      if (res.flag) {
        const result = res.data[config.dataField] ? res.data[config.dataField] : null;
        return Promise.resolve(result);
      }
      return Promise.resolve(null);
    });
  }

  /**
   * 获取列表
   * @param url
   * @param params
   * @param config
   */
  list<T>(
    url: string,
    params: any = {},
    config: IConfig = { method: 'GET', options: HTTP_CONTENT_TYPE.FORM, tipStr: null, dataField: 'data'}
  ): Promise<T> {
    if (config) {
      if (!config.method) {
        config.method = 'GET';
      }
      if (!config.options) {
        config.options = HTTP_CONTENT_TYPE.FORM
      }
      if (!config.tipStr) {
        config.tipStr = null
      }
      if (!config.dataField) {
        config.dataField = 'data'
      }
    }

    let hide: any;
    if (config.tipStr) {
      hide = message.loading(config.tipStr + '...', 0);
    }
    return httpService.request(config.method, url, params, config.options).then(res => {
      if (config.tipStr) {
        setTimeout(hide, 0);
      }
      if (res.flag) {
        const result = res.data[config.dataField] ? res.data[config.dataField] : [];
        return Promise.resolve(result);
      }
      return Promise.resolve([]);
    });
  }

  /**
   * 上传
   * @param url
   * @param params
   * @param config
   */
  upload<T>(
    url: string,
    params: any = {},
    config: IConfig = { method: 'POST', options: HTTP_CONTENT_TYPE.FORM }
  ): Promise<T> {
    if (config) {
      if (!config.method) {
        config.method = 'POST';
      }
      if (!config.options) {
        config.options = HTTP_CONTENT_TYPE.FORM
      }
    }
    const hide = message.loading('正在上传，请稍等...', 0);
    return httpService.request(config.method, url, params, config.options).then(res => {
      setTimeout(hide, 0);
      if (res.flag) {
        message.success(res.data.msg);
        const result = res.data ? res.data : [];
        return Promise.resolve(result);
      }
      return Promise.resolve([]);
    });
  }

  /**
   * 添加
   * @param url
   * @param params
   * @param config
   */
  add(
    url: string,
    params: any = {},
    config: IConfig = { method: 'POST', options: HTTP_CONTENT_TYPE.FORM }
  ): Promise<boolean> {
    if (config) {
      if (!config.method) {
        config.method = 'POST';
      }
      if (!config.options) {
        config.options = HTTP_CONTENT_TYPE.FORM
      }
    }
    return this.handleBooleanRequest(url, params, config);
  }

  /**
   * 更新
   * @param url
   * @param params
   * @param config
   */
  update(
    url: string,
    params: any = {},
    config: IConfig = { method: 'PUT', options: HTTP_CONTENT_TYPE.FORM }
  ): Promise<boolean> {
    if (config) {
      if (!config.method) {
        config.method = 'PUT';
      }
      if (!config.options) {
        config.options = HTTP_CONTENT_TYPE.FORM
      }
    }
    return this.handleBooleanRequest(url, params, config);
  }

  /**
   * 删除
   * @param url
   * @param params
   * @param config
   */
  delete(
    url: string,
    params: any = {},
    config: IConfig = { method: 'DELETE', options: HTTP_CONTENT_TYPE.FORM }
  ): Promise<boolean> {
    if (config) {
      if (!config.method) {
        config.method = 'DELETE';
      }
      if (!config.options) {
        config.options = HTTP_CONTENT_TYPE.FORM
      }
    }
    return this.handleBooleanRequest(url, params, config);
  }

  // 处理返回boolean类型的数据
  private handleBooleanRequest(
    url: string,
    params: any,
    config: IConfig,
  ): Promise<boolean> {
    const hide = message.loading('正在提交，请稍等...', 0);
    return httpService.request(config.method, url, params, config.options).then(res => {
      setTimeout(hide, 0);
      if (res.flag) {
        message.success('操作成功');
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    });
  }
}
