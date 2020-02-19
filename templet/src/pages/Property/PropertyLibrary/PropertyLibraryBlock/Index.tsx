import React, {FunctionComponent, useState, useEffect} from 'react';
import {Layout, Pagination, Form, Button, Input, Select, Card, Checkbox, Tabs} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import style from "../../Property.less";
import plus from "@/assets/plus.png";
import block from "@/assets/block.png";
import {blockPackageRequest} from "@/requests/block-package.request";
import LibraryModal from '@/pages/Property/PropertyLibrary/PropertyLibraryModal';
import LibraryPrivateModal from '@/pages/Property/PropertyLibrary/PropertyLibraryPrivateModal';
import {
  BlockPackageSourceDict,
  BlockPackageEndType,
  EBlockPackageSource,
  EBlockPackageAssemblyType
} from "@/dicts/block-package.dict";

const { Content } = Layout;
const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

interface IProps extends FormComponentProps {
}

const PropertyLibraryBlock: FunctionComponent<IProps> = (props) => {
  // tab
  const [tabActiveKey, setTabActiveKey] = useState<EBlockPackageSource>(EBlockPackageSource.Community);

  // 模态框
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [addPrivateModalVisible, setAddPrivateModalVisible] = useState<boolean>(false);

  // card 数量
  const [cards, setCards] = useState<any[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  // 管理模式
  const [isManage, setIsManage] = useState<boolean>(false);
  const [selectList, setSelectList] = useState<any[]>([]);

  const {form, form: { getFieldDecorator } } = props;

  const getBlockList = () => {
    if (tabActiveKey === EBlockPackageSource.Community) {
      const params = form.getFieldsValue();
      params['pageNum'] = pageNum;
      params['pageSize'] = 10;
      // TODO 这里还差移动端或者pc端参数
      blockPackageRequest.blockPackageSubscribePage(params).then(res => {
        if(res){
          const list = res ? (res.list || []) : [];
          const total = res ? (res.total || 0) : 0;
          setCards(list);
          setTotal(total);
        }
      });
    } else if (tabActiveKey === EBlockPackageSource.Private) {

    }
  };

  useEffect(() => {
    let selectList = [];
    cards.forEach((item)=>{
      if(item.checked){
        selectList.push(item.id)
      }
    });
    setSelectList(selectList)
  }, [cards]);

  // 请求区块列表
  useEffect(() => {
    getBlockList();
  }, [pageNum]);

  useEffect(() => {
    setCards([]);
    setTotal(0);
    if (pageNum === 1) {
      getBlockList();
    } else {
      setPageNum(1);
    }
  }, [tabActiveKey]);

  // 管理模式
  const management = (flag) =>{
    setIsManage(flag);
    let newCards = [...cards];
    newCards.forEach((item)=>{
      item.checked = false
    });
    setCards(newCards);
  };

  // 选中项
  const checkOnChange = (id) =>{
    let newCards = [...cards];
    newCards.forEach((item)=>{
      if(item.id == id){
        item.checked = !item.checked
      }
    });
    setCards(newCards);
  };

  // 全选
  const allCheckOnChange = (e) =>{
    let newCards = [...cards];
    newCards.forEach((item)=>{
      item.checked = !!e.target.checked;
    });
    setCards(newCards)
  };

  // 取消订阅
  const deleteItem = () => {
    if (tabActiveKey === EBlockPackageSource.Community) {
      let params = {
        blockId: selectList.toString()
      };
      blockPackageRequest.blockUnsubscribe(params).then(res => {
        if (res) {
          getBlockList()
        }
      });
    } else if (tabActiveKey === EBlockPackageSource.Private) {

    }
  };

  const pageChange = (page) =>{
    setPageNum(page);
  };

  return(
    <Layout style={{ padding: '0 24px 24px' }}>
      <Content
        className={style['property-library-content']}
        style={{
          background: '#212121',
          margin: 0,
          minHeight: 280,
        }}
      >
        {/* tab */}
        <Tabs activeKey={tabActiveKey} onChange={activeKey => {
          setTabActiveKey(activeKey as EBlockPackageSource);
        }}>
          {
            BlockPackageSourceDict.map(v => {
              return (
                <TabPane tab={v.label} key={v.value} />
              )
            })
          }
        </Tabs>

        {/* 表单 */}
        <Form
          className={style['form-container']}
          layout="inline"
          onSubmit={e => {
            e.preventDefault();
            getBlockList();
          }}
        >
          <FormItem>
            {getFieldDecorator('applyType',{
              initialValue: '',
            })(
              <Select
                size={'default'}
                style={{minWidth:'80px'}}
              >
                <Option value={''}>全部</Option>
                {
                  BlockPackageEndType.map(v => {
                    return (
                      <Option value={v.value}>{v.label}</Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('chineseName')(<Input placeholder="请输入资产名称" />)}
          </FormItem>

          {
            isManage ? (
              <>
                <FormItem>
                  <Button disabled={selectList.length <= 0} onClick={()=>{deleteItem()}}>
                    取消订阅
                  </Button>
                </FormItem>
                <FormItem>
                  <Button
                    onClick={() => {
                      management(false);
                    }}
                    type="primary"
                  >
                    完成
                  </Button>
                  <Checkbox className={style['all-check-box']} onChange={allCheckOnChange}>全选</Checkbox>
                </FormItem>
              </>
            ) : (
              <>
                <FormItem>
                  <Button type="primary" htmlType="submit">
                    搜索
                  </Button>
                </FormItem>
                <FormItem>
                  <Button
                    onClick={() => {
                      management(true)
                    }}
                  >
                    管理
                  </Button>
                </FormItem>
              </>
            )
          }
        </Form>

        {/* card */}
        <div className={style['card-container']}>
          {/* 新增订阅 */}
          <Card className={style['card-item']} onClick={() => {
            if (tabActiveKey === EBlockPackageSource.Community) {
              setAddModalVisible(true);
            } else if (tabActiveKey === EBlockPackageSource.Private) {
              setAddPrivateModalVisible(true);
            }
          }}>
            <img src={plus} width={50} height={50} alt='' />
            <p>新增订阅</p>
          </Card>

          {/* 已经订阅的 */}
          {
            cards.map((card, index) => {
              return (
                <Card className={style['card-item']} key={card.id + index}>
                  <img src={block} width={50} height={50} alt='' />
                  <p>{card.chineseName}</p>
                  <span>{card.englishName}</span>
                  { isManage ?  <Checkbox className={style['card-item-check-box']} checked={card.checked} onClick={(e)=>{e.stopPropagation()}}  onChange={()=>{checkOnChange(card.id)}} /> : null}
                </Card>
              )
            })
          }
        </div>
      </Content>

      {/* 分页器 */}
      <div className={style.pagination}>
        <Pagination defaultCurrent={pageNum} total={total} onChange={pageChange}/>
      </div>

      {/* 新增订阅 */}
      {addModalVisible ? (
        <LibraryModal
          modalVisible={addModalVisible}
          params={{source: tabActiveKey, assemblyType: EBlockPackageAssemblyType.BLOCK}}
          closeModal={() => {
            setAddModalVisible(false);
            getBlockList()
          }}
        />
      ) : null}

      {
        addPrivateModalVisible? (
          <LibraryPrivateModal
            modalVisible={addPrivateModalVisible}
            closeModal={() => {
              setAddPrivateModalVisible(false);
              getBlockList();
            }}
          />
        ): null
      }
    </Layout>
  )
};

export default Form.create<IProps>({})(PropertyLibraryBlock)
