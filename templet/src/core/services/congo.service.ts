import { tokenService } from './token.service';
import router from 'umi/router';
import {
  authenticationCongo,
  authenticationCongoByTicket,
  authenticationGetTicket,
} from '@/requests/auth.request';

class CongoService {
  /**
   * 处理201响应-正确进入主页
   */
  handle201Response(headers: any) {
    const token = headers.authorization;
    localStorage.setItem('congoToken', token);
    tokenService.set({ ...tokenService.get(), token });
    router.push('/');
  }

  /**
   * 处理401响应
   */
  handle401Response(headers: any) {
    const contextpath = headers.contextpath;
    authenticationGetTicket(contextpath).then(res => {
      if (res && res.data && res.data.ticket) {
        authenticationCongoByTicket(res.data.ticket).then(success => {
          if (success) {
            window.location.reload();
            return;
          }
          // 清除
          localStorage.clear();
          tokenService.clear();
        });
        return;
      }
      // 清除
      localStorage.clear();
      tokenService.clear();
    });
  }

  /**
   * 启动函数
   */
  startup(oldRender: any) {
    const authWay = (messageEvent) => {
      // 通过 postMessage 换取 token
      const osToken = messageEvent.data ? messageEvent.data.token || null : null;
      const code = messageEvent.data ? messageEvent.data.code || null : null;
      const tenantId = messageEvent.data ? messageEvent.data.tenantId || null : null;

      if (osToken) {
        const token = tokenService.get().token;
        const storageTenantId = tokenService.get().tenantId;
        if (token && tokenService.get().osToken === osToken && tenantId === storageTenantId) {
          window.parent.postMessage(JSON.stringify({
            type: 'APP_EVENT',
            msg: 'authSucceed'
          }),'*');
          oldRender();
          return;
        }

        localStorage.clear();
        tokenService.set({
          // 先不要设置，不然跨域请求不到
          token: '',
          code,
          tenantId,
          osToken,
        });
        // 去认证
        authenticationCongo(osToken);
      }
    }

    /**
     * 用于全屏调试时
     */
    if(window.location.search.indexOf('gcongoType') != -1) {
      authWay(this.getCacheParameters())
    }

    /**
     * 从OS端拿授权,通过postMessage拿到token
     */
    window.addEventListener('message', messageEvent => {
      authWay(messageEvent);
    });
  }

  getCacheParameters() {
    return {
      data : {
        token: tokenService.get().osToken,
        code:  tokenService.get().code,
        tenantId: tokenService.get().tenantId
      }
    }
  }
}

export const congoService = new CongoService();
