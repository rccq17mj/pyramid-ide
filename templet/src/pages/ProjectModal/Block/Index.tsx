import React, {FunctionComponent, useEffect, useState} from "react";
import styles from './Index.less';
import {Button, Form, Icon, Input, Menu, Pagination, Tabs} from "antd";
import AddModal from './Add/Index';
import {IBlockCard} from "@/interfaces/block/block.interface";
import {pyramidUiService} from "@/core/pyramid-ui/service/pyramid-ui.service";
import {PyramidUISendProjectBlockSelectAction} from "@/core/pyramid-ui/action/pyramid-ui.action";
import {blockPackageRequest} from "@/requests/block-package.request";
import * as _ from 'lodash';

enum EFetchStatus {
  noFetch = 'noFetch',
  fetching = 'fetching',
  fetchEnd = 'fetchEnd'
}

interface IMenu {
  applyType: string;
  chineseName: string;
  currentVersion: string;
  englishName: string;
  id: string;
  isRegisted: number;
  packageManager: string;
  platformVersion: string;
  storeAddress: string;
  categories: string[];

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
  const [tabActiveKey, setTabActiveKey] = useState<string>('1');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalParams, setModalParams] = useState<IBlockCard>(null);
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>(50);
  const [cards, setCards] = useState<IBlockCard[]>([
    {
      key: 'button-basic',
      name: '基础按钮',
      gitUrl: 'https://github.com/guccihuiyuan/pyramid-blocks/tree/master/blocks/button-basic',
      previewImg: '',
      previewUrl: '',
      description: '按钮有五种类型：主按钮、次按钮、虚线按钮、危险按钮和链接按钮。主按钮在同一个操作区域最多出现一次。',
      hover: false
    },
    {
      key: 'carousel-basic',
      name: '基础走马灯',
      gitUrl: 'https://github.com/guccihuiyuan/pyramid-blocks/tree/master/blocks/carousel-basic',
      previewImg: '',
      previewUrl: '',
      description: '最简单的用法。',
      hover: false
    }
  ]);
  const [menus, setMenus] = useState<IMenu[]>([]);
  const [menuOpenKeys, setMenuOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    setTotal(50);
  }, []);

  useEffect(() => {
    queryPackages();
  }, [current]);

  const queryPackages = () => {
    const params = {};
    params['pageNum'] = current;
    params['pageSize'] = 10;
    blockPackageRequest.blockPackageSubscribePage(params).then(res => {
      if (res) {
        if (res.list.length > 0) {
          res.list.forEach(item => {
            item.fetchStatus = EFetchStatus.noFetch;
          });
          setMenus(res.list);
          setTotal(res.total);
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
      if (menu.id === key) {
        findMenu = menu;
      }
    });
    return findMenu;
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles['left-container']}>
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
                  }
                }
                setMenuOpenKeys(param);
              }}
            >
              {
                menus.map((menu) => {
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
                      <Menu.Item key="sub-0-0">空白页</Menu.Item>
                      <Menu.Item key="sub-0-1">个人中心</Menu.Item>
                      <Menu.Item key="sub-0-2">个人设置</Menu.Item>
                      <Menu.Item key="sub-0-3">异常</Menu.Item>
                    </SubMenu>
                  )
                })
              }

              {/*<SubMenu*/}
              {/*  key="sub-1"*/}
              {/*  title={*/}
              {/*    <span>*/}
              {/*  <Icon type="mail" />*/}
              {/*  <span>pyramid-ui-1</span>*/}
              {/*</span>*/}
              {/*  }*/}
              {/*>*/}
              {/*  <Menu.Item key="sub-1-0">空白页</Menu.Item>*/}
              {/*  <Menu.Item key="sub-1-1">个人中心</Menu.Item>*/}
              {/*  <Menu.Item key="sub-1-2">个人设置</Menu.Item>*/}
              {/*  <Menu.Item key="sub-1-3">异常</Menu.Item>*/}
              {/*</SubMenu>*/}
              {/*<SubMenu*/}
              {/*  key="sub-2"*/}
              {/*  title={*/}
              {/*    <span>*/}
              {/*  <Icon type="mail" />*/}
              {/*  <span>pyramid-ui-1</span>*/}
              {/*</span>*/}
              {/*  }*/}
              {/*>*/}
              {/*  <Menu.Item key="sub-1-0">空白页</Menu.Item>*/}
              {/*  <Menu.Item key="sub-1-1">个人中心</Menu.Item>*/}
              {/*  <Menu.Item key="sub-1-2">个人设置</Menu.Item>*/}
              {/*  <Menu.Item key="sub-1-3">异常</Menu.Item>*/}
              {/*</SubMenu>*/}
            </Menu>
          </div>
          {/* 底部订阅标题 */}
          <div className={styles['bottom-toolbar']} onClick={() => {
          }}>
            <Icon type="plus-circle" style={{ marginRight: 10 }} />
            <span>订阅</span>
          </div>
        </div>
      </div>
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
            <Pagination size="small" current={current} total={total} onChange={paginationChange} />
          </div>
        </div>
      </div>

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

