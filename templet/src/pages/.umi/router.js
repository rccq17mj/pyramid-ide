import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from '/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/pages/.umi/LocaleWrapper.jsx';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/user',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__UserLayout" */ '../../layouts/UserLayout'),
          LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/UserLayout').default,
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
        exact: true,
      },
      {
        path: '/user/login',
        name: 'login',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__User__Login" */ '../User/Login'),
              LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
                .default,
            })
          : require('../User/Login').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/project-toolbar',
    name: 'projectToolbar',
    hideInMenu: true,
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__projectToolbar" */ '../projectToolbar'),
          LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
            .default,
        })
      : require('../projectToolbar').default,
    exact: true,
  },
  {
    path: '/project-modal',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__ProjectModalLayout" */ '../../layouts/ProjectModalLayout'),
          LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/ProjectModalLayout').default,
    routes: [
      {
        path: '/project-modal',
        redirect: '/project-modal/layout',
        exact: true,
      },
      {
        path: '/project-modal/config',
        name: 'project-modal-config',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__ProjectModal__Config" */ '../ProjectModal/Config'),
              LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
                .default,
            })
          : require('../ProjectModal/Config').default,
        exact: true,
      },
      {
        path: '/project-modal/layout',
        name: 'project-modal-layout',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__ProjectModal__Layout" */ '../ProjectModal/Layout'),
              LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
                .default,
            })
          : require('../ProjectModal/Layout').default,
        exact: true,
      },
      {
        path: '/project-modal/module',
        name: 'project-modal-module',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__ProjectModal__Module" */ '../ProjectModal/Module'),
              LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
                .default,
            })
          : require('../ProjectModal/Module').default,
        exact: true,
      },
      {
        path: '/project-modal/block',
        name: 'project-modal-block',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__ProjectModal__Block" */ '../ProjectModal/Block'),
              LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
                .default,
            })
          : require('../ProjectModal/Block').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/property-manage',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__PropertyManage__Index" */ '../PropertyManage/Index'),
          LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
            .default,
        })
      : require('../PropertyManage/Index').default,
    exact: true,
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__BasicLayout" */ '../../layouts/BasicLayout'),
          LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/BasicLayout').default,
    Routes: [require('../Authorized').default],
    authority: ['admin', 'user'],
    routes: [
      {
        path: '/',
        name: 'home',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__Welcome" */ '../Welcome'),
              LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
                .default,
            })
          : require('../Welcome').default,
        hideInMenu: true,
        exact: true,
      },
      {
        path: '/pc',
        name: 'pc',
        iconLocal: '/icons/shops.svg',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__Computer__Projects__Index" */ '../Computer/Projects/Index'),
              LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
                .default,
            })
          : require('../Computer/Projects/Index').default,
        exact: true,
      },
      {
        path: '/mobile',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__Computer__Projects__Index" */ '../Computer/Projects/Index'),
              LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
                .default,
            })
          : require('../Computer/Projects/Index').default,
        name: 'mobile',
        icon: 'mobile',
        routes: [
          {
            component: () =>
              React.createElement(
                require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
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
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "layouts__PropertyLibraryLayout" */ '../../layouts/PropertyLibraryLayout'),
                  LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
                    .default,
                })
              : require('../../layouts/PropertyLibraryLayout').default,
            routes: [
              {
                path: '/property/PropertyLibrary',
                redirect: '/property/PropertyLibrary/PropertyLibraryModule',
                exact: true,
              },
              {
                path: '/property/propertyLibrary/propertyLibraryModule',
                name: 'module',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__PropertyLibraryLayout" */ '../Property/PropertyLibrary/PropertyLibraryModule/Index'),
                      LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Property/PropertyLibrary/PropertyLibraryModule/Index')
                      .default,
                exact: true,
              },
              {
                path: '/property/propertyLibrary/PropertyLibraryBlock',
                name: 'block',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__PropertyLibraryLayout" */ '../Property/PropertyLibrary/PropertyLibraryBlock/Index'),
                      LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Property/PropertyLibrary/PropertyLibraryBlock/Index')
                      .default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/property/myProperty',
            name: 'myProperty',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "layouts__PropertyLayout" */ '../../layouts/PropertyLayout'),
                  LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
                    .default,
                })
              : require('../../layouts/PropertyLayout').default,
            routes: [
              {
                path: '/property/myProperty',
                redirect: '/property/myProperty/propertyModule',
                exact: true,
              },
              {
                path: '/property/myProperty/propertyModule',
                name: 'module',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__PropertyLayout" */ '../Property/MyProperty/PropertyModule/Index'),
                      LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Property/MyProperty/PropertyModule/Index')
                      .default,
                exact: true,
              },
              {
                path: '/property/myProperty/PropertyBlock',
                name: 'block',
                hideInMenu: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__PropertyLayout" */ '../Property/MyProperty/PropertyBlock/Index'),
                      LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Property/MyProperty/PropertyBlock/Index')
                      .default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            component: () =>
              React.createElement(
                require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__404" */ '../404'),
              LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
                .default,
            })
          : require('../404').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import(/* webpackChunkName: "p__404" */ '../404'),
          LoadingComponent: require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/src/components/PageLoading/index')
            .default,
        })
      : require('../404').default,
    exact: true,
  },
  {
    component: () =>
      React.createElement(
        require('/Users/landsnow/CloudStation/project/gcongo/electron/gcongo-mobile-dev/templet/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
