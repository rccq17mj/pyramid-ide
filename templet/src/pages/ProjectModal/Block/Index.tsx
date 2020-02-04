import React, {FunctionComponent, useEffect, useState} from "react";
import styles from './Index.less';
import {Button, Form, Icon, Input, Menu, Pagination, Tabs} from "antd";
import AddModal from './Add/Index';
import {IBlockCard} from "@/interfaces/block/block.interface";
import {pyramidUiService} from "@/core/pyramid-ui/service/pyramid-ui.service";
import {PyramidUISendProjectBlockSelectAction} from "@/core/pyramid-ui/action/pyramid-ui.action";

const { SubMenu } = Menu;
const { TabPane } = Tabs;

interface IProps {
  location: {query: {projectName?: string}}
}

const Component: FunctionComponent<IProps> = props => {
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

  useEffect(() => {
    setTotal(50);
  }, []);

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

  const paginationChange = (page: number, pageSize?: number) => {
    setCurrent(page);
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
              defaultSelectedKeys={['1']}
              mode="inline"
              theme="dark"
            >
              <SubMenu
                key="sub-0"
                title={
                  <span>
                <Icon type="mail" />
                <span>pyramid-ui</span>
              </span>
                }
              >
                <Menu.Item key="sub-0-0">空白页</Menu.Item>
                <Menu.Item key="sub-0-1">个人中心</Menu.Item>
                <Menu.Item key="sub-0-2">个人设置</Menu.Item>
                <Menu.Item key="sub-0-3">异常</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub-1"
                title={
                  <span>
                <Icon type="mail" />
                <span>pyramid-ui-1</span>
              </span>
                }
              >
                <Menu.Item key="sub-1-0">空白页</Menu.Item>
                <Menu.Item key="sub-1-1">个人中心</Menu.Item>
                <Menu.Item key="sub-1-2">个人设置</Menu.Item>
                <Menu.Item key="sub-1-3">异常</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub-2"
                title={
                  <span>
                <Icon type="mail" />
                <span>pyramid-ui-1</span>
              </span>
                }
              >
                <Menu.Item key="sub-1-0">空白页</Menu.Item>
                <Menu.Item key="sub-1-1">个人中心</Menu.Item>
                <Menu.Item key="sub-1-2">个人设置</Menu.Item>
                <Menu.Item key="sub-1-3">异常</Menu.Item>
              </SubMenu>
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
                    <div className={styles['item-top']} onMouseEnter={e => handleMouse(index, true)} onMouseLeave={e => handleMouse(index, false)}>
                      {
                        card.hover ? (
                          <div className={styles['item-top-mask']}>
                            <Button type={"primary"} style={{marginBottom: 10}} onClick={(e) => add(card)}>添加到页面</Button>
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
            closeModal={success => {
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

