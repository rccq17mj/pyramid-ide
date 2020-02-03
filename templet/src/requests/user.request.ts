import {BaseRequest} from "@/requests/base.request";
import {API_CONFIG} from "@/core/configs/api.config";

class UserRequest extends BaseRequest {
  // 获取当前登陆用户信息
  getCurrentUserInfo(): Promise<any> {
    return this.object(API_CONFIG.MAIN.GET_CURRENT_USER_INFO);
  }

  // 获取当前登陆用户权限
  getCurrentUserACL(): Promise<any> {
    return this.object(API_CONFIG.MAIN.GET_CURRENT_USER_ACL);
  }
}

export const userRequest = new UserRequest();
