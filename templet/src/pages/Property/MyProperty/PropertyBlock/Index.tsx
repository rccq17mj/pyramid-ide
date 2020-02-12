import React, { FunctionComponent, useState, useEffect } from 'react';
import { Layout, Form, Button, Input, Select, Card, Checkbox } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import plus from '@/assets/plus.png';
import block from '@/assets/block.png';

import Add from '@/pages/Property/Add/Index';
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
import {
  PyramidUISendBlockGetAction,
  PyramidUISendBlockRemoveAction,
} from '@/core/pyramid-ui/action/pyramid-ui-send.action';
import Router from 'umi/router';
import style from '../../Property.less';
import {
  PyramidUIReceiveActionsUnion, PyramidUIReceiveBlockListAction,
  PyramidUIReceiveBlockRemoveAction
} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
import {PyramidUIActionTypes} from "@/core/pyramid-ui/action";

const { Content } = Layout;
const FormItem = Form.Item;
const { Option } = Select;


interface IProps extends FormComponentProps {
}

const ProperytBlock: FunctionComponent<IProps> = props => {
  const [extraParams, setExtraParams] = useState<object>({});
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [cards, setCards] = useState<any[]>([]);

  // 管理模式
  const [isManege, setIsManege] = useState<boolean>(false)
  const [selectList, setSelectList] = useState<any[]>([])

  const { form, form: { getFieldDecorator } } = props;

  const extraParamsChange = () => {
    const params = { ...form.getFieldsValue()};
    setExtraParams(params);
  };


  useEffect(() => {
    const selectList = []
    cards.forEach(item => {
      if (item.checked) {
        selectList.push(item._id)
      }
    })
    setSelectList(selectList)
  }, [cards]);

  useEffect(() => {
    // 统一监听
    const messageKey = pyramidUiService.getMessageFn((pyramidAction: PyramidUIReceiveActionsUnion) => {
      switch (pyramidAction.type) {
        case PyramidUIActionTypes.RECEIVE_PROJECT_BLOCK_LIST:
          const action1: PyramidUIReceiveBlockListAction = pyramidAction as PyramidUIReceiveBlockListAction;
          setCards(action1.payload);
          break;
        case PyramidUIActionTypes.RECEIVE_PROJECT_BLOCK_REMOVE:
          const action2: PyramidUIReceiveBlockRemoveAction = pyramidAction as PyramidUIReceiveBlockRemoveAction;
          console.log(action2);
          break;
      }
    });

    return () => {
      pyramidUiService.clearMessageFn(messageKey);
    }
  }, []);

  useEffect(() => {
    getBlockData()
  }, [extraParams]);

  const startProject = projectInfo => {
      console.log('projectInfo', projectInfo)
    Router.push(`/property-manage?parentId=${projectInfo._id}&package=${projectInfo.package}&applyType=${projectInfo.applyType}`)
  };


  const getBlockData = () => {
    console.log('extraParams', extraParams)
    pyramidUiService.sendMessageFn(new PyramidUISendBlockGetAction(extraParams));
  }

  // 管理模式
  const management = flag => {
    setIsManege(flag)
    const newCards = [...cards];
    newCards.forEach(item => {
      item.checked = false
    })
    setCards(newCards)
  }

  // 选中项
  const checkOnChange = id => {
    const newCards = [...cards];
    newCards.forEach(item => {
      if (item._id == id) {
        item.checked = !item.checked
      }
    })
    setCards(newCards)
  }

  // 全选
  const allCheckOnChange = e => {
    const newCards = [...cards];
    newCards.forEach(item => {
      if (e.target.checked) {
        item.checked = true
      } else {
        item.checked = false
      }
    })
    setCards(newCards)
  }

  // 删除项
  const deleteItem = () => {
    pyramidUiService.sendMessageFn(new PyramidUISendBlockRemoveAction(selectList));
  }

  return (
      <Layout style={{ padding: '0 24px 24px' }}>
{/*        <Breadcrumb style={{color:'#fff'}}>
          <Breadcrumb.Item>区块</Breadcrumb.Item>
          <Breadcrumb.Item>移动端</Breadcrumb.Item>
        </Breadcrumb> */}
        <Content
          style={{
            background: '#212121',
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {/* 表单 */}
          <Form
            layout="inline"
            onSubmit={e => {
              e.preventDefault();
              extraParamsChange();
            }}
          >
            <FormItem>
              {getFieldDecorator('applyType', {
                initialValue: '100',
              })(
                <Select
                  size="default"
                  style={{ minWidth: '80px' }}
                >
                  <Option value="100">全部</Option>
                  <Option value="2">移动端</Option>
                  <Option value="1">PC端</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('chineseName')(<Input placeholder="请输入资产名称" />)}
            </FormItem>
            {isManege ?
              <FormItem>
                <Button disabled={selectList.length <= 0} onClick={e => {
                  e.stopPropagation()
                  deleteItem()
}
                }>
                  删除
                </Button>
                <Button
                  onClick={() => {
                    management(false)
                  }}
                  style={{ marginLeft: 8 }}
                  type="primary"
                >
                  完成
                </Button>
                <Checkbox className={style.allCheck} onChange={allCheckOnChange}>全选</Checkbox>
              </FormItem> :
              <FormItem>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button
                  onClick={() => {
                    management(true)
                  }}
                  style={{ marginLeft: 8 }}
                >
                  管理
                </Button>
              </FormItem>}
          </Form>
          <Card className={style.cards} onClick={() => setAddModalVisible(true)}>
            <img src={plus} width={50} height={50}></img>
            <p>注册区块包</p>
          </Card>
          {
            cards.map((card, index) => (
                <Card className={style.cards} key={index} onClick={() => { startProject(card) }}>
                  <img src={block} width={50} height={50}></img>
                  <p>{card.menuNameZh}</p>
                  <div>{card.menuNameEn}</div>
                  <span>{card.filePath}</span>
                  { isManege ? <Checkbox className={style.checkBox} checked={card.checked} onClick={e => { e.stopPropagation() }} onChange={() => { checkOnChange(card._id) }}></Checkbox> : null}
                </Card>
              ))
          }
        </Content>
      {addModalVisible ? (
        <Add
          modalVisible={addModalVisible}
          closeModal={success => {
            setAddModalVisible(false);
            if (success) {
              // simpleTable.loadData();
            }
          }}
        />
      ) : null}
    </Layout>
  )
}

export default Form.create<IProps>({})(ProperytBlock)
