/**
 * HTTP_API前缀
 * 一个IP对应一个分类，前缀名自定，根据自定的前缀名可方便在请求/响应拦截器里做处理
 */
const local = {
  API_MAIN_PREFIX: '/man-api',
  API_SSO: '/sso-api',
  API_UPLOAD: '/upload-api',
  QIC: 'dsy_tANgkaKqbieJ'
};
const dev = {
  API_MAIN_PREFIX: 'http://10.10.11.107:25017',
  API_SSO: 'http://10.10.11.104:28400',
  QIC: 'dsy_tANgkaKqbieJ'
};
const test = {
  API_MAIN_PREFIX: 'http://10.10.11.107:25069',
  API_SSO: 'http://10.10.11.104:28400',
  QIC: 'dsy_tANgkaKqbieJ'
};
const pro = {
  API_MAIN_PREFIX: 'https://open.gcongo.com/openWeb',
  API_SSO: 'https://auth.gcongo.com',
  QIC: 'dsy_tANgkaKqbieJ'
};
// 环境区分
let API_EVN = local;
switch (ENV_TYPE) {
  case 'local':
    API_EVN = local;
    break;
  case 'dev':
    API_EVN = dev;
  case 'test':
    API_EVN = test;
    break;
  case 'pro':
    API_EVN = pro;
    break;
  default:
    break;
}

// 工具（单独调用）
const API_MAIN_PREFIX = API_EVN.API_MAIN_PREFIX;
const API_SSO = API_EVN.API_SSO;
const API_UPLOAD = API_EVN.API_UPLOAD;

// 属于住业务的API前缀
export const API_MAIN_PREFIXS = [
  API_MAIN_PREFIX,
  API_SSO,
  API_UPLOAD,
];

/**
 * HTTP_APIS
 * 与前缀建立相同的分类
 */
export const API_CONFIG = {
  QIC: API_EVN.QIC,
  // 主业务
  MAIN: {
    UPLOAD_IMG: API_UPLOAD + '/fileUpload/fileUpload',
    // 获取当前登陆用户的信息
    GET_CURRENT_USER_INFO: API_MAIN_PREFIX + '/user/profile',
    // 获取当前登陆用户的权限菜单
    GET_CURRENT_USER_ACL: API_MAIN_PREFIX + '/menu/getMenu',
    // 区块包
    BLOCK_PACKAGE: {
      ADD_OR_UPDATE: API_MAIN_PREFIX + '/block/get',
      LIST_PAGE: API_MAIN_PREFIX + '/block/page',
      DELETE: API_MAIN_PREFIX + '/block/delete',
      DETAIL: API_MAIN_PREFIX + '/block/get',
      SUBMIT_VERSION: API_MAIN_PREFIX + '/block/submitNewVersion',
      UPDATE_HISTORY_LIST_PAGE: API_MAIN_PREFIX + '/block/version/page',
      SUBSCRIBE_PAGE: API_MAIN_PREFIX + '/block/subscribe/page',
      UPDATE_HISTORY_SUBSCRIBE: API_MAIN_PREFIX + '/block/subscribe',
      UNSUBSCRIBE: API_MAIN_PREFIX + '/block/unsubscribe',
    }
  },
  // CONGO模块
  CONGO: {
    // 先随便调用某个接口，触发401
    GET_AUTH: API_MAIN_PREFIX + '/org/list',
    // 获取 Ticket
    GET_TICKET: API_MAIN_PREFIX + '/ticket',
  },
  SSO: {
    // 初始化登录
    INDEX: API_SSO + '/index',
    GET_CODED: API_SSO + '/getCode',
    // 获取短信
    GET_VCODE: API_SSO + '/mobile/rcode',
    // 登录
    LOGIN: API_SSO + '/login',
    M_LOGIN: API_SSO + '/m/login',
  },
  // 第三方
  ALI_PAY: {

  },
};
