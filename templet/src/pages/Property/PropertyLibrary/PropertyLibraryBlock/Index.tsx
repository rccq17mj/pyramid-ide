import React, {FunctionComponent, useState, useEffect} from 'react';
import { Layout, Pagination, Breadcrumb, Form, Button, Input, Select, Card, Icon, Checkbox } from 'antd';
import {FormComponentProps} from "antd/lib/form";
import style from "../../Property.less";
import plus from "@/assets/plus.png";
import block from "@/assets/block.png";

import LibraryModal from '@/pages/Property/PropertyLibrary/PropertyLibraryModal/Index';
import LibraryDetailModal from '@/pages/Property/PropertyLibrary/PropertyLibraryModal/Detail';
import {pyramidUiService} from "@/core/pyramid-ui/service/pyramid-ui.service";
import {blockPackageRequest} from '../../../../requests/block-package.request';

const { Header, Content, Sider } = Layout;
const FormItem = Form.Item;
const { Option } = Select;


interface IProps extends FormComponentProps {
}

const PropertyLibraryBlock: FunctionComponent<IProps> = (props) =>{

  const [extraParams, setExtraParams] = useState<object>({});
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [cards, setCards] = useState<any[]>([]);

  // 管理模式
  const [isManege, setIsManege] = useState<boolean>(false)
  const [selectList, setSelectList] = useState<any[]>([])
  const [selectCard, setSelectCard] = useState<object>({})
  const [pageNum, setPageNum] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(7)
  const [total, setTotal] = useState<number>(0)

  const {form, form: { getFieldDecorator } } = props;

  const extraParamsChange = () => {
    const params = { ...form.getFieldsValue() };
    setExtraParams(params);
  };

  const getBlockList = () =>{
    let params = extraParams;
    params['pageNum'] = pageNum;
    params['pageSize'] = pageSize;
    blockPackageRequest.blockPackageSubscribePage(params).then(res => {
      if(res){
        if(res.list.length > 0){
          setCards(res.list)
          setTotal(res.total)
        }
        console.log('res123',res);
      }
    })
  }

  useEffect(() => {
    let selectList = []
    cards.forEach((item)=>{
      if(item.checked){
        selectList.push(item.id)
      }
    })
    setSelectList(selectList)
  }, [cards]);

  // 请求区块列表
  useEffect(() => {
    getBlockList()
  }, [pageNum, pageSize, extraParams]);


  const startProject = (projectInfo) => {
      console.log('projectInfo', projectInfo)
     // sendMessage({'openProjectWindow': true});
  };


  // 管理模式
  const management = (flag) =>{
    setIsManege(flag)
    let newCards = [...cards];
    newCards.forEach((item)=>{
      item.checked = false
    })
    setCards(newCards)
  }

  // 选中项
  const checkOnChange = (id) =>{
    let newCards = [...cards];
    newCards.forEach((item)=>{
      if(item.id == id){
        item.checked = !item.checked
      }
    })
    setCards(newCards)
  }

  // 全选
  const allCheckOnChange = (e) =>{
    let newCards = [...cards];
    newCards.forEach((item)=>{
      if(e.target.checked){
        item.checked = true
      }else{
        item.checked = false
      }
    })
    setCards(newCards)
  }

  // 取消订阅
  const deleteItem = () => {
    let params = {
      blockId: selectList.toString()
    }
    blockPackageRequest.blockUnsubscribe(params).then(res => {
      if(res){
        getBlockList()
      }
    })
  }

  const pageChange = (page, pageSize) =>{
    setPageNum(page)
  }

  const setCard = (cardData) => {
    setSelectCard(cardData)
  }

  return(
      <Layout style={{ padding: '0 24px 24px' }}>
    {/*    <Breadcrumb style={{color:'#fff'}}>
          <Breadcrumb.Item>区块</Breadcrumb.Item>
          <Breadcrumb.Item>移动端</Breadcrumb.Item>
        </Breadcrumb>*/}
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
              {getFieldDecorator('applyType',{
                initialValue:'0',
              })(
                <Select
                  size={'default'}
                  style={{minWidth:'80px'}}
                >
                  <Option value="0">全部</Option>
                  <Option value="2">移动端</Option>
                  <Option value="1">PC端</Option>
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('chineseName')(<Input placeholder="请输入资产名称" />)}
            </FormItem>
            {isManege ?
              <FormItem>
                <Button disabled={selectList.length <= 0} onClick={()=>{deleteItem()}}>
                  取消订阅
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
            <p>新增订阅</p>
          </Card>
          {
            cards.map((card, index) => {
              return (
                <Card className={style.cards} key={card.id + index} onClick={() => startProject(card)}>
                  <img src={block} width={50} height={50}></img>
                  <p>{card.chineseName}</p>
                  <span>{card.englishName}</span>
                  { isManege ?  <Checkbox className={style.checkBox} checked={card.checked} onClick={(e)=>{e.stopPropagation()}}  onChange={()=>{checkOnChange(card.id)}}></Checkbox> : null}
                </Card>
              )
            })
          }
        </Content>
        <div className={style.pageBox}>
          <Pagination defaultCurrent={pageNum} total={total} pageSize={pageSize} onChange={pageChange}/>
        </div>
      {addModalVisible ? (
        <LibraryModal
          modalVisible={addModalVisible}
          closeModal={() => {
            setAddModalVisible(false)
            getBlockList()
          }}
          openDetailModal = {()=>{setDetailModalVisible(true)}}
          setCard={(cardData) => {setCard(cardData)}}
        />
      ) : null}
        {detailModalVisible ? (
          <LibraryDetailModal
            modalVisible={detailModalVisible}
            closeModal={() => {setDetailModalVisible(false)}}
            cardData={selectCard}
          />
        ) : null}
    </Layout>
  )
}

export default Form.create<IProps>({})(PropertyLibraryBlock)
