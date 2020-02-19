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
import {
  PyramidUIReceiveActionsUnion, PyramidUIReceiveBlockListAction,
  PyramidUIReceiveBlockRemoveAction
} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
import {PyramidUIActionTypes} from "@/core/pyramid-ui/action";
import style from '../../Property.less';
import {BlockPackageEndType} from "@/dicts/block-package.dict";

const { Content } = Layout;
const FormItem = Form.Item;
const { Option } = Select;

interface IProps extends FormComponentProps {
}

const PropertyBlock: FunctionComponent<IProps> = props => {
  // 模态框
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);

  // cards
  const [cards, setCards] = useState<any[]>([]);

  // 管理模式
  const [isManege, setIsManege] = useState<boolean>(false);
  const [selectList, setSelectList] = useState<any[]>([]);

  const { form, form: { getFieldDecorator } } = props;

  useEffect(() => {
    const selectList = [];
    cards.forEach(item => {
      if (item.checked) {
        selectList.push(item._id)
      }
    });
    setSelectList(selectList);
  }, [cards]);

  useEffect(() => {
    getBlockData();

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

  const startProject = projectInfo => {
    Router.push(`/property-manage?parentId=${projectInfo._id}&package=${projectInfo.package}&applyType=${projectInfo.applyType}&path=${projectInfo.filePath}/${projectInfo.menuNameEn}`)
  };

  const getBlockData = () => {
    pyramidUiService.sendMessageFn(new PyramidUISendBlockGetAction(form.getFieldsValue()));
  };

  // 管理模式
  const management = flag => {
    setIsManege(flag);
    const newCards = [...cards];
    newCards.forEach(item => {
      item.checked = false
    });
    setCards(newCards)
  };

  // 选中项
  const checkOnChange = id => {
    const newCards = [...cards];
    newCards.forEach(item => {
      if (item._id == id) {
        item.checked = !item.checked
      }
    });
    setCards(newCards)
  };

  // 全选
  const allCheckOnChange = e => {
    const newCards = [...cards];
    newCards.forEach(item => {
      item.checked = !!e.target.checked;
    });
    setCards(newCards)
  };

  // 删除项
  const deleteItem = () => {
    pyramidUiService.sendMessageFn(new PyramidUISendBlockRemoveAction(selectList));
  };

  return (
    <Layout style={{ padding: '0 24px 24px' }}>
      <Content
        className={style['property-library-content']}
        style={{
          background: '#212121',
          margin: 0,
          minHeight: 280,
        }}
      >
        {/* 表单 */}
        <Form
          className={style['form-container']}
          layout="inline"
          onSubmit={e => {
            e.preventDefault();
            getBlockData();
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
                {
                  BlockPackageEndType.map(v => {
                    return (
                      <Option key={v.value} value={v.value}>{v.label}</Option>
                    )
                  })
                }
              </Select>,
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('chineseName')(<Input placeholder="请输入资产名称" />)}
          </FormItem>

          {isManege ? (
            <>
              <FormItem>
                <Button disabled={selectList.length <= 0} onClick={e => {
                  e.stopPropagation();
                  deleteItem()
                }
                }>
                  删除
                </Button>
              </FormItem>
              <FormItem>
                <Button
                  onClick={() => {
                    management(false)
                  }}
                  type="primary"
                >
                  完成
                </Button>
                <Checkbox className={style['all-check-box']} onChange={allCheckOnChange}>全选</Checkbox>
              </FormItem>
            </>
          ) : (
            <FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
              </FormItem>
              <FormItem>
                <Button
                  onClick={() => {
                    management(true);
                  }}
                >
                  管理
                </Button>
              </FormItem>
            </FormItem>
          )
          }
        </Form>

        <div className={style['card-container']}>
          <Card className={style['card-item']} onClick={() => setAddModalVisible(true)}>
            <img src={plus} width={50} height={50} alt='' />
            <p>注册区块包</p>
          </Card>

          {
            cards.map((card, index) => (
              <Card className={style.cards} key={index} onClick={() => { startProject(card) }}>
                <img src={block} width={50} height={50} alt='' />
                <p>{card.menuNameZh}</p>
                <div>{card.menuNameEn}</div>
                <span>{card.filePath}</span>
                { isManege ? <Checkbox className={style.checkBox} checked={card.checked} onClick={e => { e.stopPropagation() }} onChange={() => { checkOnChange(card._id) }} /> : null}
              </Card>
            ))
          }
        </div>
      </Content>

      {addModalVisible ? (
        <Add
          modalVisible={addModalVisible}
          closeModal={success => {
            setAddModalVisible(false);
            if (success) {
            }
          }}
        />
      ) : null}

    </Layout>
  )
};

export default Form.create<IProps>({})(PropertyBlock);
