import React, {FunctionComponent, useEffect, useState} from "react";
import {Button, Form, Icon, Input, Menu, Pagination, Spin, Tabs} from "antd";
import {IBlockItem} from "@/interfaces/block/block.interface";
import {pyramidUiService} from "@/core/pyramid-ui/service/pyramid-ui.service";
import {
  PyramidUISendBlockPackageInfoAction,
  PyramidUISendProjectBlockSelectAction
} from "@/core/pyramid-ui/action/pyramid-ui-send.action";
import {PyramidUIActionTypes} from "@/core/pyramid-ui/action";
import {blockPackageRequest} from "@/requests/block-package.request";
import {EBlockPackageFetchStatus} from "@/enums/block-package.enum";
import * as _ from 'lodash';
import styles from './Index.less';
import {IBlockPackage, IBlockPackageInfo} from "@/interfaces/block-package/block-package.interface";
import {
  PyramidUIReceiveActionsUnion,
} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
import LibraryModal from "@/pages/Property/PropertyLibrary/PropertyLibraryModal";
import {EBlockPackageAssemblyType, EBlockPackageSource} from "@/dicts/block-package.dict";

const { SubMenu } = Menu;
const { TabPane } = Tabs;

interface IProps {}

const Component: FunctionComponent<IProps> = () => {
  const localStorageModuleMenusKey = 'module-menus-key';

  const [tabActiveKey, setTabActiveKey] = useState<EBlockPackageSource>(EBlockPackageSource.Community);

  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [cards, setCards] = useState<IBlockItem[]>([]);

  // 菜单选项
  const [menus, setMenus] = useState<IBlockPackage[]>([]);
  const [menuOpenKeys, setMenuOpenKeys] = useState<string[]>([]);

  // 订阅
  const [subscribeModalVisible, setSubscribeModalVisible] = useState<boolean>(false);

  useEffect(() => {
    queryPackages();

    const messageKey = pyramidUiService.getMessageFn((pyramidAction: PyramidUIReceiveActionsUnion) => {
      switch (pyramidAction.type) {
        case PyramidUIActionTypes.RECEIVE_PROJECT_BLOCK_PACKAGE_INFO:
          const packageInfo = pyramidAction.payload.packageInfo || null;
          const projectId = pyramidAction.payload.projectId;
          if (projectId) {
            // 注意这里，监听的时候因为拿不到外部的 menus 对象，所以只能用 localStorage 保存起来并读取
            const storageMenus: IBlockPackage[] = JSON.parse(localStorage.getItem(localStorageModuleMenusKey));
            localStorage.setItem(localStorageModuleMenusKey, null);

            const findMenu = findMenuByKey(storageMenus, projectId);
            if (findMenu) {
              findMenu.packageInfoFetchStatus = EBlockPackageFetchStatus.fetchEnd;
              findMenu.packageInfo = packageInfo;
              setMenus(storageMenus);
            }
          }
          break;
        default:
          break;
      }
    });

    return () => {
      pyramidUiService.clearMessageFn(messageKey);
    }
  }, []);

  /**
   * 获取区块包列表
   */
  const queryPackages = () => {
    if (tabActiveKey === EBlockPackageSource.Community) {// 社区
      // TODO 需要增加参数
      const params = {};
      params['pageNum'] = current;
      params['pageSize'] = 100000;
      blockPackageRequest.blockPackageSubscribePage(params).then(res => {
        if (res) {
          const list = res ? (res.list || []) : [];
          list.forEach(item => {
            item.packageInfoFetchStatus = EBlockPackageFetchStatus.noFetch;
          });
          setMenus(list);
        }
      });
    } else if (tabActiveKey === EBlockPackageSource.Private) {// 私有

    }
  };

  /**
   * 搜索区块item提交
   */
  const handleSearchSubmit = () => {

  };

  /**
   * 鼠标移入移出事件
   */
  const handleMouse = (i: number, value: boolean) => {
    const copyCards: IBlockItem[] = JSON.parse(JSON.stringify(cards));
    copyCards[i].hover = value;
    setCards(copyCards);
  };

  /**
   * 添加到页面
   */
  const addToPage = (card: IBlockItem) => {
    pyramidUiService.sendMessageFn(new PyramidUISendProjectBlockSelectAction({
      key: card.key,
      gitUrl: card.gitUrl
    }));
  };

  /**
   * 分页器改变事件
   */
  const paginationChange = (page: number) => {
    setCurrent(page);
  };

  /**
   * 根据key找到对应 menu
   */
  const findMenuByKey = (menus: IBlockPackage[], key: string) => {
    let findMenu: IBlockPackage = null;
    menus.forEach(menu => {
      if (menu.id.toString() === key.toString()) {
        findMenu = menu;
      }
    });
    return findMenu;
  };

  /**
   * 根据类别找到相应的区块列表
   */
  const setCardsByCategory = (packageInfo: IBlockPackageInfo, category: string) => {
    const blocks = packageInfo.blocks;

    const findBlocks = [];
    blocks.forEach(block => {
      block.hover = false;
      const tags = block.tags;
      const ret = tags.find(v => {
        return v === category;
      });
      if (ret) {
        findBlocks.push(block);
      }
    });

    setCards(findBlocks);
    setTotal(findBlocks.length);
  };

  return (
    <div className={styles.container}>

      {/* 左边 */}
      <div className={styles.left}>
        <div className={styles['left-container']}>
          {/* TAB */}
          <Tabs className={styles.tabs} activeKey={tabActiveKey} onChange={key => {
            setTabActiveKey(key as EBlockPackageSource)
          }}>
            <TabPane tab="社区" key="1">
            </TabPane>
            <TabPane tab="私有" key="2">
            </TabPane>
          </Tabs>

          {/* 菜单 */}
          <div className={styles.menu}>
            <Menu
              mode="inline"
              theme="dark"
              openKeys={menuOpenKeys}
              onOpenChange={param => {
                const diffArr = _.difference(param, menuOpenKeys);
                if (diffArr.length > 0) {
                  const key = diffArr[0];
                  const findMenu = findMenuByKey(menus, key);
                  if (findMenu && findMenu.packageInfoFetchStatus === 'noFetch') {
                    findMenu.packageInfoFetchStatus = EBlockPackageFetchStatus.fetching;

                    // 临时保存
                    localStorage.setItem(localStorageModuleMenusKey, JSON.stringify(menus));

                    pyramidUiService.sendMessageFn(new PyramidUISendBlockPackageInfoAction({
                      // TODO 因为还没有同步到测试仓库里去，所以这里先写死 发送获取区块信息 storeAddress，差一个端口 10080
                      projectGitUrl: 'https://github.com/guccihuiyuan/pyramid-blocks',
                      projectGitBranch: 'master',
                      projectId: findMenu.id
                    }));
                  }
                }

                setMenuOpenKeys(param);
              }}
            >
              {
                menus.map((menu, menuIndex) => {
                  return (
                    <SubMenu
                      key={menu.id}
                      title={
                        <span>
                          <Icon type="mail" />
                          <span>{menu.chineseName}</span>
                        </span>
                      }
                    >
                      {
                        menu.packageInfo &&
                        menu.packageInfo.category &&
                        menu.packageInfo.category.blocks &&
                        menu.packageInfo.category.blocks.map((category, categoryIndex) => {
                          return (
                            <Menu.Item
                              key={`sub-${menuIndex}-${categoryIndex}`}
                              onClick={() => {
                                setCardsByCategory(menu.packageInfo, category);
                              }}
                            >{category}</Menu.Item>
                          )
                        })
                      }
                      {/* 正在加载中 */}
                      {
                        menu.packageInfoFetchStatus === EBlockPackageFetchStatus.fetching ? (
                          <Menu.Item
                            key={`sub-${menuIndex}-fetching`}
                          >
                            <Spin />
                          </Menu.Item>
                        ): null
                      }
                    </SubMenu>
                  )
                })
              }
            </Menu>
          </div>

          {/* 底部订阅标题 */}
          <div className={styles['bottom-toolbar']} onClick={() => {
            setSubscribeModalVisible(true);
          }}>
            <Icon type="plus-circle" style={{ marginRight: 10 }} />
            <span>订阅</span>
          </div>

        </div>
      </div>

      {/* 右边 */}
      <div className={styles.right}>
        <div>
          <Form layout="inline" onSubmit={handleSearchSubmit}>
            <Form.Item>
              <Input placeholder="搜索组件" style={{background: '#313131'}} />
            </Form.Item>
            <Form.Item>
              <Button type={"primary"}>搜索</Button>
            </Form.Item>
          </Form>

          {/* block item */}
          <div className={styles['item-list']}>
            {
              cards.map((card, index) => {
                return (
                  <div className={styles.item} key={card.key}>
                    <div className={styles['item-top']} onMouseEnter={() => handleMouse(index, true)} onMouseLeave={() => handleMouse(index, false)}>
                      {
                        card.hover ? (
                          <div className={styles['item-top-mask']}>
                            <Button type={"primary"} style={{marginBottom: 10}} onClick={() => addToPage(card)}>添加到页面</Button>
                            <Button>预览</Button>
                          </div>
                        ): null
                      }
                      <img src={card.previewImg} alt=''/>
                    </div>
                    <div className={styles['item-bottom']}>
                      {card.name}
                    </div>
                  </div>
                )
              })
            }
          </div>

          {/* 分页 */}
          <div className={styles.pagination} style={{textAlign: 'right', color: 'white', marginTop: 20}}>
            <Pagination showTotal={total => `共 ${total} 条`} size="small" current={current} total={total} onChange={paginationChange} />
          </div>
        </div>
      </div>

      {/* 新增订阅 */}
      {subscribeModalVisible ? (
        <LibraryModal
          modalVisible={subscribeModalVisible}
          params={{source: tabActiveKey, assemblyType: EBlockPackageAssemblyType.BLOCK}}
          closeModal={() => {
            setSubscribeModalVisible(false);
            // 重新获取数据
            queryPackages();
          }}
        />
      ) : null}

    </div>
  )
};

export default Component;

