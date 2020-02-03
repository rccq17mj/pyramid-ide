import { IConfig, IPlugin } from 'umi-types';

import defaultSettings from './defaultSettings';
// https://umijs.org/config/
import slash from 'slash2';
import webpackPlugin from './plugin.config';

const { pwa, primaryColor } = defaultSettings;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, ENV_TYPE } = process.env;

const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';

const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
      // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

// 针对 preview.pro.ant.design 的 GA 统计代码
if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  plugins,
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 9,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        { path: '/user', redirect: '/user/login' },
        { path: '/user/login', name: 'login', component: './User/Login' },
      ]
    },
    {
      path: '/project-toolbar',
      name: 'projectToolbar',
      hideInMenu: true,
      component: './projectToolbar'
    },
    // 子项目弹窗布局
    {
      path: '/project-modal',
      component: '../layouts/ProjectModalLayout',
      routes: [
        { path: '/project-modal', redirect: '/project-modal/layout' },
        // 配置
        { path: '/project-modal/config', name: 'project-modal-config', component: './ProjectModal/Config' },
        // 布局
        { path: '/project-modal/layout', name: 'project-modal-layout', component: './ProjectModal/Layout' },
        // 模块
        { path: '/project-modal/module', name: 'project-modal-module', component: './ProjectModal/Module' },
        // 区块
        { path: '/project-modal/block', name: 'project-modal-block', component: './ProjectModal/Block' },
      ]
    },
    // 子项目弹窗布局
    {
      path: '/property-manage',
      component: './PropertyManage/Index',
    },
    {
      path: '/',
      component: '../layouts/BasicLayout',
      Routes: ['src/pages/Authorized'],
      authority: ['admin', 'user'],
      routes: [
        {
          path: '/',
          name: 'home',
          component: './Welcome',
          hideInMenu: true
        },
        {
          path: '/pc',
          name: 'pc',
          //andtIcon
          //icon: 'smile',
          //本地icon 位于 /public/icons/shops.svg
          iconLocal: '/icons/shops.svg',
          component: './Computer/Projects/Index',
        },
        // 使用说明
        {
          path: '/mobile',
          component: './Computer/Projects/Index',
          name: 'mobile',
          icon: 'mobile',
          routes: [
          ],
        },
        {
          path: '/property',
          name: 'assets',
          icon: 'safety',
          routes: [
            {
              path: '/property/propertyLibrary',
              name: 'propertyLibrary',
              component: '../layouts/PropertyLibraryLayout',
              routes: [
                { path: '/property/PropertyLibrary', redirect: '/property/PropertyLibrary/PropertyLibraryModule' },
                {
                  path: '/property/propertyLibrary/propertyLibraryModule',
                  name: 'module',
                  hideInMenu: true,
                  component: './Property/PropertyLibrary/PropertyLibraryModule/Index',
                },
                {
                  path: '/property/propertyLibrary/PropertyLibraryBlock',
                  name: 'block',
                  hideInMenu: true,
                  component: './Property/PropertyLibrary/PropertyLibraryBlock/Index',
                },
              ],
            },
            {
              path: '/property/myProperty',
              name: 'myProperty',
              component: '../layouts/PropertyLayout',
              routes: [
                 { path: '/property/myProperty', redirect: '/property/myProperty/propertyModule' },
                 {
                  path: '/property/myProperty/propertyModule',
                  name: 'module',
                  hideInMenu: true,
                  component: './Property/MyProperty/PropertyModule/Index',
                 },
                {
                  path: '/property/myProperty/PropertyBlock',
                  name: 'block',
                  hideInMenu: true,
                  component: './Property/MyProperty/PropertyBlock/Index',
                },
              ],
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  proxy: {
    '/sso-api': {
      target: 'http://10.10.11.104:28400',
      changeOrigin: true,
      pathRewrite: { '^/sso-api': '' },
    },
    '/man-api': {
      target: 'http://10.10.11.107:25017',
      changeOrigin: true,
      pathRewrite: { '^/man-api': '' },
    },
    '/upload-api': {
      target: 'http://10.10.11.107:25018',
      changeOrigin: true,
      pathRewrite: { '^/upload-api': '' },
    }
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
    ENV_TYPE: ENV_TYPE || 'dev',
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
} as IConfig;
