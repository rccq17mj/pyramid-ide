/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import { Tabs } from 'antd';
import { Route } from 'react-router-dom';
import router from 'umi/router';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import StatusBar from '@/components/StatusBar'
import { ConnectState, Dispatch } from '@/models/connect';
// import { isAntDesignPro } from '@/utils/utils';
import logo from '../assets/logo.svg';
import { APP_CONFIG, USE_LOCAL_MENU } from '@/core/configs/app.config';
import style from './BasicLayout.less';

const { TabPane } = Tabs;

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: Settings;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

const footerRender: BasicLayoutProps['footerRender'] = (_, defaultDom) =>
    (null)
  // if (!isAntDesignPro()) {
  //   return defaultDom;
  // }
  // return (
  //   <>
  //     {defaultDom}
  //     <div
  //       style={{
  //         padding: '0px 24px 24px',
  //         textAlign: 'center',
  //       }}
  //     >
  //       <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
  //         <img
  //           src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
  //           width="82px"
  //           alt="netlify logo"
  //         />
  //       </a>
  //     </div>
  //   </>
  // );
;

// tabs的属性
interface ITabs {
  /**
   * 名称
   */
  tab: string;
  /**
   * 路径
   */
  key: string;
  /**
   * 是否可关闭
   */
  closable: boolean;
  /**
   * 组件
   */
  component: any;
  /**
   * 子组件
   */
  children: ITabs[];
}

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  // 菜单相关
  const [menuData, setMenuData] = useState<any[]>([]);
  // tabs相关
  const [tabList, setTabList] = useState<ITabs[]>([]);
  const [tabListKey, setTabListKey] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState<string>('');

  // 存储本地从路由转菜单的信息
  const [routerDataList, setRouterDataList] = useState<any[]>([]);

  const { dispatch, children, settings, location } = props;

  /**
   * constructor
   */
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'settings/getSetting',
      });
    }
  }, []);

  useEffect(() => {
    if (!routerDataList || routerDataList.length === 0) {
      return;
    }

    // 处理多TAB
    if (APP_CONFIG.USE_MULTI_TABS) {
      const { pathname } = location;

      const routeKey = pathname;
      const tabLists = convertMenuDataToTabList(routerDataList);

      const tabList = [];
      const routeKeys = [];

      // TODO 首页，必须存在，并且不能被删除
      const noCloseRoutePath = '/';
      if (routeKey === '/') {
        router.push(noCloseRoutePath);
      }

      tabLists.forEach(tab => {
        if (tab.key === noCloseRoutePath) {
          tab.closable = false;
          tabList.push(tab);
          routeKeys.push(noCloseRoutePath);
        }
      });

      // 其他页面
      if (routeKey !== noCloseRoutePath) {
        tabLists.forEach(v => {
          if (v.key === routeKey) {
            tabList.push(v);
            routeKeys.push(v.key);
          }
        });
      }

      setTabList(tabList);// 存储打开的多标签
      setTabListKey(routeKeys);// 判断 tabList 是否重复保持 tabList 标签唯一性
      setActiveKey(routeKeys[routeKeys.length - 1]);// 当前激活 tab 面板的 key
    }
  }, [routerDataList]);

  const onHandlePage = (key: string) => {
    if (!APP_CONFIG.USE_MULTI_TABS) {
      return;
    }
    const tabLists = convertMenuDataToTabList(menuData);
    router.push(key);

    setActiveKey(key);

    tabLists.forEach(v => {
      if (v.key === key) {
        if (tabList.length === 0) {
          v.closable = false;
          setTabList([...tabList, v]);
        } else if (!tabListKey.includes(v.key)) {
          setTabList([...tabList, v]);
          setTabListKey([...tabListKey, v.key]);
        }
      }
    });
  };

  // tab改变
  const onTabChange = key => {
    setActiveKey(key);
    router.push(key);
  };

  // tab编辑事件
  const onTabEdit = (targetKey: string | React.MouseEvent<HTMLElement>, action: 'add' | 'remove') => {
    if (action === 'remove') {
      let activeKeyBak = activeKey;

      let lastIndex = 0;
      tabList.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });

      const tabListBak: any[] = [];
      const tabListKeyBak: string[] = [];

      tabList.forEach(pane => {
        if (pane.key !== targetKey) {
          tabListBak.push(pane);
          tabListKeyBak.push(pane.key);
        }
      });
      if (lastIndex >= 0 && activeKeyBak === targetKey) {
        activeKeyBak = tabListBak[lastIndex].key;
      }

      router.push(activeKeyBak);

      setTabList(tabListBak);
      setActiveKey(activeKeyBak);
      setTabListKey(tabListKeyBak);
    }
  };

  const convertMenuDataToTabList = menus => {
    const treeData = menus;
    const treeList: ITabs[] = [];

    // 递归获取树列表
    const getTreeList = (tree: any[], children: any[] = null) => {
      tree.forEach(node => {
        if (node) {

          const treeNode = {
            tab: node.locale ? formatMessage({id: node.locale}) : node.name,
            key: node.path,
            closable: true,
            component: node.component,
            children: node.children ? [] : null
          };

          if (children) {
            children.push(treeNode)
          }

          treeList.push(treeNode);

          if (node.children && node.children.length > 0) {
            getTreeList(node.children, treeNode.children);
          }
        }
      });
    };
    getTreeList(treeData);
    return treeList;
  };

  /**
   * use Authorized check all menu item
   */
  const menuDataRender = (menuList: MenuDataItem[], completeRoute = false): MenuDataItem[] => {
    // 将本地路由信息保存下来
    if (completeRoute && (!routerDataList || routerDataList.length === 0)) {
      setRouterDataList(menuList);
    }

    if (APP_CONFIG.USE_LOCAL_MENU === USE_LOCAL_MENU.NON_USE) {
      return menuData;
    }

    // 本地或者混合菜单
    const menus = menuList.map(item => {
      if (item.iconLocal) {
        item.icon = window.location.origin + item.iconLocal;
      }
      const localItem = {
        ...item,
        children: item.children ? menuDataRender(item.children) : [],
      };
      return Authorized.check(item.authority, localItem, null) as MenuDataItem;
    });

    if (!menuData || menuData.length === 0) {
      setMenuData(menus);
    }

    return menus;
  };

  /**
   * init variables
   */
  const handleMenuCollapse = (payload: boolean): void =>
    dispatch &&
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });

  return (
    <ProLayout
      logo={logo}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
          return defaultDom;
        }
        return !APP_CONFIG.USE_MULTI_TABS ?
          (<Link to={menuItemProps.path}>{defaultDom}</Link>) :
          (<a onClick={() => onHandlePage(menuItemProps.path)}>{defaultDom}</a>);
      }}
      breadcrumbRender={(routers = []) => {
        // 重新设置名称
        if (APP_CONFIG.USE_MULTI_TABS) {
          return [];
          // tabList.forEach(tab => {
          //   routers.forEach(router => {
          //     if (tab.key === router.path) {
          //       tab.tab = router.breadcrumbName;
          //     }
          //   });
          // });
        }

        return [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
              defaultMessage: 'Home',
            }),
          },
          ...routers,
        ]
      }}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={footerRender}
      menuDataRender={menuData => menuDataRender(menuData, true)}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      {/* 使用Tabs */}
      {APP_CONFIG.USE_MULTI_TABS ? (
        <div style={{ height: 52, margin: '-24px -24px 24px' }}>
          <Tabs
            activeKey={activeKey}
            onChange={onTabChange}
            tabBarStyle={{ background: '#001529' }}
            tabBarGutter={0}
            hideAdd
            type="editable-card"
            onEdit={onTabEdit}
            className={style.menuTabs}
          >
            {tabList.map(item => (
              <TabPane tab={item.tab} key={item.key} closable={item.closable}>
                <div style={{ paddingRight: 24, paddingLeft: 24 }}>
                  <Route
                    key={item.key}
                    component={item.component}
                    exact
                  />
                  {/*{*/}
                    {/*item.children ? (*/}
                      {/*<Route*/}
                        {/*key={item.key}*/}
                        {/*render={() =>*/}
                          {/*<item.component>*/}
                            {/*{*/}
                              {/*item.children.map(children => {*/}
                                {/*return (*/}
                                  {/*children.key === activeKey ? (*/}
                                    {/*<Route*/}
                                      {/*key={children.key}*/}
                                      {/*component={children.component}*/}
                                    {/*/>*/}
                                  {/*) : null*/}
                                {/*)*/}
                              {/*})*/}
                            {/*}*/}
                          {/*</item.component>*/}
                        {/*}*/}
                        {/*exact*/}
                      {/*>*/}
                      {/*</Route>*/}
                    {/*) : (*/}
                      {/*<Route*/}
                        {/*key={item.key}*/}
                        {/*component={item.component}*/}
                        {/*exact*/}
                      {/*/>*/}
                    {/*)*/}
                  {/*}*/}
                </div>
              </TabPane>
            ))}
          </Tabs>
        </div>
      ) : null}

      {/* 不使用Tabs */}
      {!APP_CONFIG.USE_MULTI_TABS ? children : null}
      <StatusBar />
    </ProLayout>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
