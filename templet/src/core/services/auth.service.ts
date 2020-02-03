import router from 'umi/router';
import { tokenService } from './token.service';

class AuthService {
  /**
   * 登出
   */
  loginout() {
    localStorage.clear();
    tokenService.clear();
    router.push('/user/login');
  }
}

export const authService = new AuthService();
