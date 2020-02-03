import { TokenService } from '@react-kit/auth';
import { APP_CONFIG } from '../configs/app.config';

// 初始化服务
export const tokenService = new TokenService({
  token_send_key_header: 'Authorization',
  token_send_template_header: APP_CONFIG.ACCESS_CONGO ? '${token}' : 'Bearer ${token}',
});
