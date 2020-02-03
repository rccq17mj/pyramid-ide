export const USE_LOCAL_MENU = {
  // 使用本地菜单
  USE: 1,
  // 使用远程菜单
  NON_USE: 0,
  // 混合使用
  MUTUAL: 2
};


/**
 * APP配置
 */
export const APP_CONFIG = {
  // 是否接入Congo
  ACCESS_CONGO: false,
  // 是否使用本地菜单
  USE_LOCAL_MENU: USE_LOCAL_MENU.USE,
  // 是否使用多Tab页面
  USE_MULTI_TABS: false,
  // 组件属性通用配置
  COMPONENT: {
    SELECT: {
      WIDTH: 174,
    },
    FORM_ITEM_LAYOUT: {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    },
    BTN_FORM_ITEM_LAYOUT: {
      wrapperCol: {
        xs: { span: 24 },
        sm: { offset: 6, span: 14 },
      },
    },
  }
};
