import React, {FunctionComponent, useEffect, useState} from 'react';
import {Icon, Modal, Form, Button, Input, Card, Pagination, Layout} from "antd";
import {FormComponentProps} from "antd/lib/form";
import block from "@/assets/block.png";
import {blockPackageRequest} from "@/requests/block-package.request";
import {
  BlockPackageSourceDict,
  EBlockPackageAssemblyType,
  EBlockPackageEndType,
  EBlockPackageSource
} from "@/dicts/block-package.dict";
import LibraryDetailModal from './Detail';
import styles from './Index.less';

const FormItem = Form.Item;
const { Content } = Layout;

interface ILeftBtn {
  icon: string;
  name: string;
  value: string;
  open: boolean;
}

interface IProps extends FormComponentProps {
  modalVisible: boolean;
  closeModal: (data?: any) => void;
  params: {
    // 组件类型
    assemblyType: EBlockPackageAssemblyType
    // 来源
    source: EBlockPackageSource
    // TODO 端类型
    endType?: EBlockPackageEndType
  }
}
const Component: FunctionComponent<IProps> = props => {
  // 详情模态框数据
  const [selectCard, setSelectCard] = useState<any>(null);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);

  // card
  const [cards, setCards] = useState<any[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [leftButtons, setLeftButtons] = useState<ILeftBtn[]>([
    {
      icon: 'border',
      name: BlockPackageSourceDict[0].label,
      value: BlockPackageSourceDict[0].value,
      open: false
    },
    {
      icon: 'appstore',
      name: BlockPackageSourceDict[1].label,
      value: BlockPackageSourceDict[1].value,
      open: false
    }
  ]);
  const [selectBtn, setSelectBtn] = useState<EBlockPackageSource>(props.params.source);

  useEffect(() => {
    if (props.params.source === EBlockPackageSource.Community) {
      clickLeftBtn(leftButtons[0], 0);
    } else if (props.params.source === EBlockPackageSource.Private) {
      clickLeftBtn(leftButtons[0], 1);
    }
  }, []);

  // 请求区块列表
  useEffect(() => {
    getBlockList();
  }, [pageNum]);

  // 请求区块列表
  useEffect(() => {
    setCards([]);
    setTotal(0);
    if (pageNum === 1) {
      getBlockList();
    } else {
      setPageNum(1);
    }
  }, [selectBtn]);

  const {form, form: { getFieldDecorator } } = props;

  const getBlockList = () => {
    if (selectBtn === EBlockPackageSource.Community) {
      const params = form.getFieldsValue();
      params['pageNum'] = pageNum;
      params['pageSize'] = 10;
      blockPackageRequest.blockPackageListPage(params).then(res => {
        if(res){
          setCards(res.list);
          setTotal(res.total);
        }
      });
    } else if (selectBtn === EBlockPackageSource.Private) {

    }
  };

  const pageChange = (page) =>{
    setPageNum(page)
  };

  const hoverChange = (card, hover) => {
    let newCards = [...cards];
    newCards.forEach((item)=>{
      if(item.id == card.id){
        item['hover'] = hover
      }
    });
    setCards(newCards);
  };

  // 订阅
  const subscription = (card) =>{
    if (selectBtn === EBlockPackageSource.Community) {
      const params = {
        blockId:card.id
      };
      blockPackageRequest.blockPackageSubscribe(params).then(res => {
        if(res){
        }
      });
    } else if (selectBtn === EBlockPackageSource.Private) {

    }
  };

  const clickLeftBtn = (btn: ILeftBtn, index: number) => {
    const copyLeftButtons: ILeftBtn[] = JSON.parse(JSON.stringify(leftButtons));
    copyLeftButtons.forEach(copyLeftButton => {
      copyLeftButton.open = false;
    });

    copyLeftButtons[index].open = true;

    setLeftButtons(copyLeftButtons);
    setSelectBtn(btn.value as EBlockPackageSource);
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

        {/* 左边 */}
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

        {/* 右边 */}
        <div className={styles.right}>
          <Layout>
            <Content>
              {/* 表单 */}
              <Form
                layout="inline"
                onSubmit={e => {
                  e.preventDefault();
                  getBlockList();
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

              {/* cards */}
              <div className={styles['card-container']}>
                {
                  cards.map((card, index) => {
                    return (
                      <Card className={styles['card-item']} key={card.id + index}
                            onMouseEnter={()=>hoverChange(card, true)}
                            onMouseLeave={()=>hoverChange(card, false)}>
                        {card.hover ?
                          <div className={styles.positionBox}>
                            <div>
                              <Button className={styles.positionBtn} type="primary" onClick={(e)=>{
                                e.stopPropagation();
                                subscription(card)
                              }
                              }> + 订阅</Button>
                            </div>
                            <div>
                              <Button className={styles.positionBtn} onClick={(e)=>{
                                e.stopPropagation();
                                // 打开详情页面
                                setDetailModalVisible(true);
                                setSelectCard(card);
                              }}>详情</Button>
                            </div>
                          </div> : null
                        }

                        <img src={block} width={50} height={50} alt='' />
                        <p>{card.chineseName}</p>
                        <span>{card.englishName}</span>
                      </Card>
                    )
                  })
                }
              </div>
            </Content>

            {/* Pagination */}
            <div className={styles.pagination}>
              <Pagination defaultCurrent={pageNum} total={total} onChange={pageChange}/>
            </div>
          </Layout>
        </div>
      </div>

      {/* 详情 */}
      {detailModalVisible ? (
        <LibraryDetailModal
          modalVisible={detailModalVisible}
          closeModal={() => {setDetailModalVisible(false)}}
          cardData={selectCard}
        />
      ) : null}

    </Modal>
  )
};

export default Form.create<IProps>({})(Component)
