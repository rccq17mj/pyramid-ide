import React, {FunctionComponent, useEffect, useState} from 'react';
import styles from './PropertyLibraryModal.less';
import {Icon, Modal, Form, Button, Input, Card, Pagination, Layout} from "antd";
import {FormComponentProps} from "antd/lib/form";
import block from "@/assets/block.png";
import {blockPackageRequest} from '../../../../requests/block-package.request';

const FormItem = Form.Item;
const { Content } = Layout;

interface ILeftBtn {
  icon: string;
  name: string;
  value: string;
  open: boolean;
}

interface IProps extends FormComponentProps{
  modalVisible: boolean;
  closeModal: (data?: any) => void;
  openDetailModal: (data?: any) => void;
  setCard: (data?: any) => void;
}
const Component: FunctionComponent<IProps> = props => {
  const [extraParams, setExtraParams] = useState<object>({});
  const [cards, setCards] = useState<any[]>([]);
  const [leftButtons, setLeftButtons] = useState<ILeftBtn[]>([
    {
      icon: 'border',
      name: '社区',
      value: 'community',
      open: true
    },
    {
      icon: 'appstore',
      name: '自建',
      value: 'selfBuilt',
      open: false
    }
  ]);
  const [selectBtn, setSelectBtn] = useState('community')

  const [pageNum, setPageNum] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(8)
  const [total, setTotal] = useState<number>(0)

  const {form, form: { getFieldDecorator }, openDetailModal, setCard } = props;

  const getBlockList = () =>{
    let params = extraParams;
    params['pageNum'] = pageNum;
    params['pageSize'] = pageSize;
    blockPackageRequest.blockPackageListPage(params).then(res => {
      if(res){
        console.log(res);
        setCards(res.list)
        setTotal(res.total)
      }
    })
  }

  const extraParamsChange = () => {
    const params = { ...form.getFieldsValue() };
    setExtraParams(params);
  };

  const pageChange = (page, pageSize) =>{
    setPageNum(page)
  }

  const hoverChange = (card, hover) => {
    let newCards = [...cards]
    newCards.forEach((item)=>{
      if(item.id == card.id){
        item['hover'] = hover
      }
    })
    setCards(newCards)
  }

  // 订阅
  const subscription = (card) =>{
    console.log('card', card)
    let params = {
      blockId:card.id
    }
    blockPackageRequest.blockPackageSubscribe(params).then(res => {
      if(res){
        console.log(res);
      }
    })
  }

  // 请求区块列表
  useEffect(() => {
    getBlockList()
  }, [pageNum, pageSize, extraParams]);


  const renderArea = () => {
    if(selectBtn == 'community'){
      return(
        <Layout className={styles.layout}>
          <Content>
            {/* 表单 */}
            <Form
              layout="inline"
              onSubmit={e => {
                e.preventDefault();
                extraParamsChange();
              }}
            >
              <FormItem>
                {getFieldDecorator('chineseName')(<Input placeholder="请输入资产名称" />)}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
              </FormItem>
            </Form>
              {
                cards.map((card, index) => {
                  return (
                    <Card className={styles.cards} key={card.id + index}
                          onMouseEnter={()=>hoverChange(card, true)}
                          onMouseLeave={()=>hoverChange(card, false)}>
                      {card.hover ?
                        <div className={styles.positionBox}>
                          <div>
                            <Button className={styles.positionBtn} type="primary" onClick={(e)=>{
                              e.stopPropagation()
                              subscription(card)
                            }
                            }> + 订阅</Button>
                          </div>
                          <div>
                            <Button className={styles.positionBtn} onClick={(e)=>{
                              e.stopPropagation();
                              openDetailModal();
                              setCard(card);
                            }}>详情</Button>
                          </div>
                        </div> : null
                      }

                      <img src={block} width={50} height={50}></img>
                      <p>{card.chineseName}</p>
                      <span>{card.englishName}</span>
                      {/*{ isManege ?  <Checkbox className={style.checkBox} checked={card.checked} onClick={(e)=>{e.stopPropagation()}}  onChange={()=>{checkOnChange(card.id)}}></Checkbox> : null}*/}
                    </Card>
                  )
                })
              }
          </Content>
          <div className={styles.pageBox}>
            <Pagination defaultCurrent={pageNum} total={total} pageSize={pageSize} onChange={pageChange}/>
          </div>
        </Layout>
      )
    }else if(selectBtn == 'selfBuilt'){
      return(
        <div>自建</div>
      )
    }else{
      return null
    }
  }

  const clickLeftBtn = (btn: ILeftBtn, index: number) => {
    const copyLeftButtons: ILeftBtn[] = JSON.parse(JSON.stringify(leftButtons));
    copyLeftButtons.forEach(copyLeftButton => {
      copyLeftButton.open = false;
    });

    copyLeftButtons[index].open = true;

    setLeftButtons(copyLeftButtons);
    setSelectBtn(btn.value)
  };

  return (
    <Modal
      destroyOnClose={true}
      width={1200}
      visible={props.modalVisible}
      footer={null}
      className={styles.modalBody}
      onCancel={() => props.closeModal()}>
      <div className={styles.container}>
        <div className={styles.left}>
          {
            leftButtons.map((leftBtn, index) => {
              return (
                <div key={index} className={styles['left-btn'] + ' ' + (leftBtn.open ? styles['left-btn-open'] : '')} onClick={() => clickLeftBtn(leftBtn, index)}>
                  <Icon type={leftBtn.icon} />
                  <span>{leftBtn.name}</span>
                </div>
              )
            })
          }
        </div>
        <div className={styles.right}>
          {renderArea()}
        </div>
      </div>
    </Modal>
  )
};

export default Form.create<IProps>({})(Component)