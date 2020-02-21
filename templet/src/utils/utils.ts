/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = (path: string): boolean => reg.test(path);

const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

// 截取url后面的参数
const urlParames = (theurl = decodeURI(window.location.href)) => {
  let theUrlcode = new Object();
  if (theurl.indexOf("?") != -1) {
    let string = theurl.substr(1);
    let stringx = string.split("?");
    let strings = stringx[1].split("&");
    for(let n = 0; n < strings.length; n ++) {
      theUrlcode[strings[n].split("=")[0]]=unescape(strings[n].split("=")[1]);
      if(strings[n].split("=")[2]=='' || strings[n].split("=")[2]){
        theUrlcode[strings[n].split("=")[0]] = unescape(strings[n].split("=")[1]+'='+strings[n].split("=")[2]);
      }
    }
  }
  return theUrlcode
};

export { isAntDesignProOrDev, isAntDesignPro, isUrl, urlParames};
