import { httpService } from '@react-kit/http';
import { API_CONFIG } from '@/core/configs/api.config';
import { HTTP_CONTENT_TYPE } from '@/core/configs/http.config';
import { tokenService } from '@/core/services/token.service';

/**
 * congo认证
 * @param token token
 */
export function authenticationCongo(token: string) {
  httpService.get(API_CONFIG.CONGO.GET_AUTH).then();
}
/**
 * 拿到ticker去认证
 * @param ticket ticket
 */
export function authenticationCongoByTicket(ticket: string): Promise<boolean> {
  return httpService
    .get(API_CONFIG.CONGO.GET_TICKET, { ticket }, HTTP_CONTENT_TYPE.JSON)
    .then(res => res.flag);
}

/**
 * 获取ticket
 */
export function authenticationGetTicket(reURL: string): Promise<any> {
  const token = tokenService.get().osToken;
  const code = tokenService.get().code;
  const tenantId = tokenService.get().tenantId;
  const t = new Date().getTime();

  const reUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
  return httpService
    .get(
      reURL,
      {
        OSAuth: token,
        reUrl,
        endpoint: code,
        tenantId,
        t,
      },
      { withCredentials: false }
    )
    .then(res => {
      return res.flag ? res.data : null;
    });
}
