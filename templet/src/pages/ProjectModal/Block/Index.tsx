import React, {FunctionComponent, useEffect, useState} from "react";
import styles from './Index.less';
import {Button, Form, Icon, Input, Menu, Pagination, Tabs} from "antd";
import AddModal from './Add/Index';
import {IBlockCard} from "@/interfaces/block/block.interface";
import {pyramidUiService} from "@/core/pyramid-ui/service/pyramid-ui.service";
import {
  PyramidUIActionsUnion, PyramidUIActionTypes, PyramidUIReceiveBlockPackageInfoAction,
  PyramidUISendBlockPackageInfoAction,
  PyramidUISendProjectBlockSelectAction
} from "@/core/pyramid-ui/action/pyramid-ui.action";
import {blockPackageRequest} from "@/requests/block-package.request";
import * as _ from 'lodash';

enum EFetchStatus {
  noFetch = 'noFetch',
  fetching = 'fetching',
  fetchEnd = 'fetchEnd'
}

interface IMenu {
  // 接口信息
  applyType: string;
  chineseName: string;
  currentVersion: string;
  englishName: string;
  id: string;
  isRegisted: number;
  packageManager: string;
  platformVersion: string;
  storeAddress: string;

  // 包信息
  packageInfo: {
    category: {
      blocks: string[],
      templates: string[]
    }
    blocks: [{
      tags: string[]
    }],
    templates: [
      {
        tags: string[]
      }
    ]
  };

  // 拉取状态
  fetchStatus: EFetchStatus;
}

const { SubMenu } = Menu;
const { TabPane } = Tabs;

interface IProps {
  location: {query:
      {
      }
  }
}

const Component: FunctionComponent<IProps> = () => {
  const localStorageModuleMenusKey = 'module-menus-key';

  const [tabActiveKey, setTabActiveKey] = useState<string>('1');

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalParams, setModalParams] = useState<IBlockCard>(null);

  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [cards, setCards] = useState<IBlockCard[]>([
    // {
    //   key: 'button-basic',
    //   name: '基础按钮',
    //   gitUrl: 'https://github.com/guccihuiyuan/pyramid-blocks/tree/master/blocks/button-basic',
    //   previewImg: '',
    //   previewUrl: '',
    //   description: '按钮有五种类型：主按钮、次按钮、虚线按钮、危险按钮和链接按钮。主按钮在同一个操作区域最多出现一次。',
    //   hover: false
    // },
    // {
    //   key: 'carousel-basic',
    //   name: '基础走马灯',
    //   gitUrl: 'https://github.com/guccihuiyuan/pyramid-blocks/tree/master/blocks/carousel-basic',
    //   previewImg: '',
    //   previewUrl: '',
    //   description: '最简单的用法。',
    //   hover: false
    // }
  ]);

  // 菜单选项
  const [menus, setMenus] = useState<IMenu[]>([]);
  const [menuOpenKeys, setMenuOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    // 获取区块包列表
    queryPackages();

    // 获取区块信息
    const messageKey = pyramidUiService.getMessageFn((pyramidAction: PyramidUIActionsUnion) => {
      if (pyramidAction.type === PyramidUIActionTypes.RECEIVE_PROJECT_BLOCK_PACKAGE_INFO) {
        const action: PyramidUIReceiveBlockPackageInfoAction = pyramidAction as PyramidUIReceiveBlockPackageInfoAction;
        const packageInfo = action.payload.packageInfo || null;
        const projectId = action.payload.projectId;
        if (projectId) {
          // 因为这里拿不到外部的hooks变量，所以只能先存起来
          let findMenu: IMenu = null;
          const storageMenus = JSON.parse(localStorage.getItem(localStorageModuleMenusKey));
          localStorage.setItem(localStorageModuleMenusKey, null);
          storageMenus.forEach(menu => {
            if (menu.id.toString() === projectId.toString()) {
              findMenu = menu;
            }
          });
          if (findMenu) {
            // 重新设置
            findMenu.fetchStatus = EFetchStatus.fetchEnd;
            findMenu.packageInfo = packageInfo;
            setMenus(storageMenus);
          }
        }
      }
    });

    return () => {
      pyramidUiService.clearMessageFn(messageKey);
    }
  }, []);

  // 获取区块包列表
  const queryPackages = () => {
    const params = {};
    params['pageNum'] = current;
    params['pageSize'] = 100000;
    blockPackageRequest.blockPackageSubscribePage(params).then(res => {
      if (res) {
        if (res.list.length > 0) {
          res.list.forEach(item => {
            item.fetchStatus = EFetchStatus.noFetch;
          });
          setMenus(res.list);
        }
      }
    })
  };

  const handleSubmit = () => {

  };

  const handleMouse = (i, value) => {
    const copyCards: IBlockCard[] = JSON.parse(JSON.stringify(cards));
    copyCards[i].hover = value;
    setCards(copyCards);
  };

  const add = (card: IBlockCard) => {
    pyramidUiService.sendMessageFn(new PyramidUISendProjectBlockSelectAction({
      key: card.key,
      gitUrl: card.gitUrl
    }));
  };

  const paginationChange = (page: number) => {
    setCurrent(page);
  };

  const findMenuByKey = (key: string) => {
    let findMenu: IMenu = null;
    menus.forEach(menu => {
      if (menu.id.toString() === key.toString()) {
        findMenu = menu;
      }
    });
    return findMenu;
  };

  // 根据类别找到相应的区块
  const setCardsByCategory = (blocks: any[], category: string) => {
    const findBlocks = [];
    blocks.forEach(block => {
      block.hover = false;
      const tags: string[] = block.tags;
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
          <Tabs className={styles.tabs} activeKey={tabActiveKey} onChange={key => setTabActiveKey(key)}>
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
                  const findMenu = findMenuByKey(key);
                  if (findMenu && findMenu.fetchStatus === 'noFetch') {
                    findMenu.fetchStatus = EFetchStatus.fetching;

                    // 临时保存
                    localStorage.setItem(localStorageModuleMenusKey, JSON.stringify(menus));

                    pyramidUiService.sendMessageFn(new PyramidUISendBlockPackageInfoAction({
                      // TODO 先写死 发送获取区块信息
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
                        menu.packageInfo && menu.packageInfo.category && menu.packageInfo.category.blocks && menu.packageInfo.category.blocks.map((category, categoryIndex) => {
                          return (
                            <Menu.Item
                              key={`sub-${menuIndex}-${categoryIndex}`}
                              onClick={() => {
                                setCardsByCategory(menu.packageInfo.blocks, category);
                              }}
                            >{category}</Menu.Item>
                          )
                        })
                      }
                    </SubMenu>
                  )
                })
              }
            </Menu>
          </div>

          {/* 底部订阅标题 */}
          <div className={styles['bottom-toolbar']} onClick={() => {}}>
            <Icon type="plus-circle" style={{ marginRight: 10 }} />
            <span>订阅</span>
          </div>

        </div>
      </div>

      {/* 右边 */}
      <div className={styles.right}>
        <div>
          <Form layout="inline" onSubmit={handleSubmit}>
            <Form.Item>
              <Input placeholder="搜索组件" style={{background: '#313131'}} />
            </Form.Item>
            <Form.Item>
              <Button type={"primary"}>搜索</Button>
            </Form.Item>
          </Form>

          <div className={styles['item-list']}>
            {
              cards.map((card, index) => {
                return (
                  <div className={styles.item} key={card.key}>
                    <div className={styles['item-top']} onMouseEnter={() => handleMouse(index, true)} onMouseLeave={() => handleMouse(index, false)}>
                      {
                        card.hover ? (
                          <div className={styles['item-top-mask']}>
                            <Button type={"primary"} style={{marginBottom: 10}} onClick={() => add(card)}>添加到页面</Button>
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

      {/* 弹出框 */}
      {
        modalVisible ? (
          <AddModal
            modalVisible={modalVisible}
            params={modalParams}
            closeModal={() => {
              setModalVisible(false);
              setModalParams(null);
            }}
          />
        ) : null
      }

    </div>
  )
};

export default Component;

