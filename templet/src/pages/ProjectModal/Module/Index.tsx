import React, {FunctionComponent, useEffect, useState} from "react";
import styles from './Index.less';
import {Button, Form, Icon, Input, Menu, Pagination} from "antd";
import AddModal from './Add/Index';
import {IBlockCard} from "@/interfaces/block/block.interface";

const { SubMenu } = Menu;

interface IProps {
  location: {query: {projectName?: string}}
}

const Component: FunctionComponent<IProps> = props => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalParams, setModalParams] = useState<IBlockCard>(null);
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>(50);
  const [cards, setCards] = useState<IBlockCard[]>([
    {
      key: 'ResultSuccess',
      name: '成功页',
      gitUrl: 'https://github.com/guccihuiyuan/pyramid-blocks/tree/master/templates/ResultSuccess',
      previewImg: '',
      previewUrl: '',
      description: '告知用户操作后所产生的成功结果，引导用户接下来的行动。',
      hover: false
    },
    {
      key: 'ResultFail',
      name: '失败页',
      gitUrl: 'https://github.com/guccihuiyuan/pyramid-blocks/tree/master/templates/ResultFail',
      previewImg: '',
      previewUrl: '',
      description: '告知用户操作后所产生的失败结果，引导用户接下来的行动。',
      hover: false
    },
    {
      key: 'ProfileBasic',
      name: '基础详情页',
      gitUrl: 'https://github.com/guccihuiyuan/pyramid-blocks/tree/master/templates/ProfileBasic',
      previewImg: '',
      previewUrl: '',
      description: '详情页可以向用户展示一个对象完整的描述信息,并且可以对一个对象进行编辑操作。',
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
    setModalVisible(true);
    setModalParams(card);
  };

  const paginationChange = (page: number, pageSize?: number) => {
    setCurrent(page);
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
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
                <span>社区</span>
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
                  <div className={styles['item']} key={card.key}>
                    <div className={styles['item-top']} onMouseEnter={e => handleMouse(index, true)} onMouseLeave={e => handleMouse(index, false)}>
                      {
                        card.hover ? (
                          <div className={styles['item-top-mask']}>
                            <Button type={"primary"} style={{marginBottom: 10}} onClick={(e) => add(card)}>添加到项目</Button>
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
          <div className={styles['pagination']} style={{textAlign: 'right', color: 'white', marginTop: 20}}>
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
