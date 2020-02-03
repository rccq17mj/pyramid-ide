/**
 * 正则表达式配置
 */
export const REGEX_CONFIG = {
  EMPTY_CHAR: {
    DESC: '不能全是空字符',
    EXPR: '',
    FUNC: (rule: any, value: any, callback: any, source?: any, options?: any) => {
      if (value && value.trim().length === 0) {
        callback('empty');
      }
      callback();
    }
  },
  LOGIN: {
 /**
     * 验证用户名
     * @param value
     * @param isNull 为空的提示
     */
    userName: (value, isNull) => {
      return new Promise((resolve, reject) => {
          const myReg = /[^\u4E00-\u9FA5\w]/;
          const numReg = /^[0-9]*$/;
          if(!value && value === ''){
              reject(isNull);
          }else if(value.length < 2) {
              reject('用户名长度至少2位');
          }else if(strlen(value) > 14) {
              reject('用户名不能超过7个中文或14个字符');
          }else if(myReg.test(value)){
              reject('用户名必须是数字、中英文字符、下划线等组成，不能包含特殊字符');
          }else if (numReg.test(value)){
              // 先验证是否是手机号
              mobile(value, isNull).then((v) => {
                  resolve([value, 'mobile']);
              }).catch((e) => {
                  reject('用户名不能是纯数字');
              })
          }else{
              resolve([value, 'userName']);
          }
      })
  },
  /**
   * 验证图形验证码
   * @param value
   * @param isNull 为空的提示
   */
  imagCode: (value, isNull) => {
      return new Promise((resolve, reject) => {
          const numReg = /^[0-9]*$/;
          if(!value && value === ''){
              reject(isNull);
          }else if(value.length !=4) {
              reject('验证码长度为4位');
          }else{
              resolve(value);
          }
      })
  },
  /**
   * 短信验证码
   * @param value
   * @param isNull 为空的提示
   */
  smsCode: (value, isNull) => {
      return new Promise((resolve, reject) => {
          const numReg = /^[0-9]*$/;
          if(!value && value === ''){
              reject(isNull);
          }else if(value.length !=6) {
              reject('验证码长度为6位');
          }else{
              resolve(value);
          }
      })
  },
  /**
   * 验证手机号
   * @param value
   * @param areaCode 地区码，默认 +86
   * @param isNull 为空的提示
   */
  mobile: (value, isNull, areaCode) => {
      return new Promise((resolve, reject) => {
          mobile(value, isNull, areaCode).then((v) => {
              resolve(v);
          }).catch((e) => {
              reject(e);
          })
      })
  },
  /**
   * 密码验证
   * @param value
   * @param isNull
   */
  password: (value, isNull, userName) => {
      const myReg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-z]|[A-Z]|[0-9]){6,32}$/;
      return new Promise((resolve, reject) => {
          if(!value && value === ''){
              reject(isNull);
          } else if(!myReg.test(value)){
              reject('密码长度为6-32位，大小写字母、数字及特殊字符至少包含2种');
          }else if(value === userName || value.split("").reverse().join("") === userName){
              reject('密码不能与用户名或倒序的用户名相同');
          }else if(!(value.indexOf(" ") == -1)){
              reject('密码不能有空格，请检查后重新输入');
          }else{
              resolve(value);
          }
      })
  },
  /**
   * 兼容老系统的用户密码登录（原系统用户密码可能不包含字母组合）
   * 一般用于登录验证（新用户注册不推荐用此验证）
   */
  passwordOld: (value, isNull, userName) => {
      return new Promise((resolve, reject) => {
          if(!value && value === ''){
              reject(isNull);
          } else if(value.length < 6 && value.length > 32){
              reject('密码长度为6-32位');
          }else if(!(value.indexOf(" ") == -1)){
              reject('密码不能有空格，请检查后重新输入');
          }else{
              resolve(value);
          }
      })
  },
  /**
   * 密码验证(不包含用户名的)
   * @param value
   * @param isNull
   */
  passwordNoName: (value, isNull) => {
      const myReg = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{6,32}$/;
      return new Promise((resolve, reject) => {
          if(!value && value === ''){
              reject(isNull);
          } else if(!myReg.test(value)){
              reject('密码长度为6-32位，大小写字母、数字及特殊字符至少包含2种');
          }else if(!(value.indexOf(" ") == -1)){
              reject('密码不能有空格，请检查后重新输入');
          }else{
              resolve(value);
          }
      })
  },
  /**
   * 验证邮箱
   * @param value
   * @param isNull
   */
  email: (value, isNull) => {
      let reg = new RegExp("^([a-z0-9A-Z]+[-|\\.|\\_]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$");
      return new Promise((resolve, reject) => {
          if (!value && value === '') { //输入不能为空
              reject(isNull);
          } else if (!reg.test(value)) { //正则验证不通过，格式不对
              reject("邮箱格式不正确，请重新输入");
          } else {
              resolve(value)
          }
      })
  },
  /**
   * 是否是有效url （http(s)://)
   * @param value
   * @param isNull
   */
  url: (value, isNull) => {
      let reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
      return new Promise((resolve, reject) => {
          if (!value && value === '') { //输入不能为空
              reject(isNull);
          } else if (!reg.test(value)) { //正则验证不通过，格式不对
              reject("无效的url链接");
          } else {
              resolve(value)
          }
      })
  }
  },
  EMAIL: {
    DESC: '邮箱格式不正确',
    EXPR: '^([a-z0-9A-Z]+[-|\\.|\\_]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$'
  },
  PHONE: {
    DESC: '手机号码格式不正确',
    EXPR: '^1[0-9]{10}$',
  },
  PASSWORD: {
    DESC: '包含大小写字母、数字、特殊字符至少2种，且为6-32位',
    EXPR:
      '(?!^(\\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\\w~!@#$%^&*?]{6,32}$',
  },
  TELEPHONE: {
    DESC: '电话格式不正确',
    EXPR: '(^(\\d{3,4}-)?\\d{7,8})$|(^1[0-9]{10}$)',
  },
  NO_NEGATIVE_INTEGER: {
    DESC: '非负整数',
    EXPR: '^\\d+$',
  },
  NO_SPACES: {
    DESC: '不能有空格',
    EXPR: '^\\S*$',
  },
};


const mobile = (value, isNull, areaCode = '+86') => {
  const phoneReg = areaCode === '+86'? /^[1][3,4,5,6,7,8,9][0-9]{9}$/ : null;
  const phoneError = '请输入11位有效的手机号';
  return new Promise((resolve, reject) => {
      if(!value  && value === '') {
          reject(isNull);
      }else if (!phoneReg.test(value)) {
          reject(phoneError);
      }else
          resolve(value);
  })
}

/**
* 验证中文+英文的总长度，一个中文2占2个字符
* @param str
* @returns {number}
*/
const strlen = (str) => {
  let len = 0;
  for (let i=0; i<str.length; i++) {
      let c = str.charCodeAt(i);
      //单字节加1
      if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f))    {
          len++;
      }
      else {
          len+=2;
      }
  }
  return len;
}
