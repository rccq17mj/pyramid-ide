import React, {FunctionComponent, useEffect, useState} from 'react';
import { Row, Col, Button, Card } from 'antd';
import styles from './PropertyManage.less';
import plus from "@/assets/plus.png";
import block from "@/assets/block.png";
import router from "umi/router";
import StatusBar from '@/components/StatusBar'
import {
  PyramidUISendBlockItemGetAction,
} from "@/core/pyramid-ui/action/pyramid-ui-send.action";
import {pyramidUiService} from "@/core/pyramid-ui/service/pyramid-ui.service";
import Add from '@/pages/PropertyManage/Add/Index';
import Release from '@/pages/PropertyManage/Add/Release';
import Types from '@/pages/PropertyManage/Add/Types';
import {urlParames} from "@/utils/utils";
import {PyramidUIReceiveBlockItemListAction} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
import {PyramidUIActionTypes} from "@/core/pyramid-ui/action";

interface ILeftBtn {
  name: string;
  type: string;
  open: boolean;
}

interface IProps {
}

const PropertyManage: FunctionComponent<IProps> = props => {

  const [leftButtons, setLeftButtons] = useState<ILeftBtn[]>([
    {
      name: '表单',
      type: 'form',
      open: true
    },
    {
      name: '表格',
      type: 'table',
      open: false
    }
  ]);
  const [cards, setCards] = useState<any[]>([]);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [releaseModalVisible, setReleaseModalVisible] = useState<boolean>(false);
  const [typesModalVisible, setTypesModalVisible] = useState<boolean>(false);

  const getBlockList = () =>{
    pyramidUiService.sendMessageFn(new PyramidUISendBlockItemGetAction({parentId:urlParames().parentId}));
  }

  useEffect(() => {
    getBlockList();

    const messageKey = pyramidUiService.getMessageFn((action: PyramidUIReceiveBlockItemListAction) => {
      switch (action.type) {
        case PyramidUIActionTypes.RECEIVE_PROJECT_BLOCK_ITEM_LIST:
          setCards(action.payload);
          break;
        default:
          break;
      }
    });

    return () => {
      pyramidUiService.clearMessageFn(messageKey);
    }
  },[]);

/*  useEffect(() => {
    // clickLeftBtn(leftButtons[2], 2);
    // console.log('pathname', window.location.pathname)
    leftButtons.forEach((item)=>{
      if(item.url == window.location.pathname){
        item.open = true
      }else{
        item.open = false
      }
    })
    setLeftButtons(leftButtons)
  });*/
  const hoverChange = (card, hover) => {
    let newCards = [...cards]
    newCards.forEach((item)=>{
      if(item._id == card._id){
        item['hover'] = hover
      }
    })
    setCards(newCards)
  }

  const clickLeftBtn = (btn: ILeftBtn, index: number) => {
    const copyLeftButtons: ILeftBtn[] = JSON.parse(JSON.stringify(leftButtons));
    copyLeftButtons.forEach(copyLeftButton => {
      copyLeftButton.open = false;
    });

    copyLeftButtons[index].open = true;

    setLeftButtons(copyLeftButtons);
  };


  const renderList = () => {
    return(
      <div>
        <Card className={styles.cards} onClick={() => setAddModalVisible(true)}>
          <img src={plus} width={50} height={50}></img>
          <p>新建新区块 </p>
        </Card>
        {
          cards.map((card, index) => {
            return (
              <Card className={styles.cards} key={card._id + index}
                    onMouseEnter={()=>hoverChange(card, true)}
                    onMouseLeave={()=>hoverChange(card, false)}>
                {card.hover ?
                  <div className={styles.positionBox}>
                    <div>
                      <Button className={styles.positionBtn} type="primary" onClick={(e)=>{
                        e.stopPropagation()
                      }
                      }>打开</Button>
                    </div>
                    <div>
                      <Button className={styles.positionBtn} onClick={(e)=>{
                        e.stopPropagation();
                      }}>预览</Button>
                    </div>
                  </div> : null
                }
                <img src={block} width={50} height={50}></img>
                <p>{card.menuNameZh}</p>
                <span>{card.menuNameEn}</span>
              </Card>
            )
          })
        }
      </div>
    )
  }

  return (
    <div className={styles.all}>
      <div style={{backgroundColor: '#30303D', padding: '0.4rem 0.4rem'}}>
        <Row gutter={[8, 8]}>
          <Col span={6}>
            <Button onClick={()=>{router.goBack()}} shape="circle" icon="left" />
          </Col>
          <Col span={18}>
            <div style={{ float: 'right' }}>
              <Row gutter={[6, 18]}>
                <Col span={13}>
                  <Button onClick={()=>{setReleaseModalVisible(true)}} type="default" icon="build">发布</Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles['left-btn']} onClick={() => {setTypesModalVisible(true)}}>
            <span>新建分类</span>
          </div>
          {
            leftButtons.map((leftBtn, index) => {
              return (
                <div key={index} className={styles['left-btn'] + ' ' + (leftBtn.open ? styles['left-btn-open'] : '')} onClick={() => clickLeftBtn(leftBtn, index)}>
                  <span>{leftBtn.name}</span>
                </div>
              )
            })
          }
        </div>
        <div className={styles.right}>
          {renderList()}
        </div>
{/*        <div>
          预览
        </div>*/}
      </div>
      {addModalVisible ? (
        <Add
          modalVisible={addModalVisible}
          closeModal={success => {
            setAddModalVisible(false);
            if (success) {
              //simpleTable.loadData();
            }
          }}
        />
      ) : null}
      {releaseModalVisible ? (
        <Release
          modalVisible={releaseModalVisible}
          closeModal={success => {
            setReleaseModalVisible(false);
            if (success) {
              //simpleTable.loadData();
            }
          }}
        />
      ) : null}
      {typesModalVisible ? (
        <Types
          modalVisible={typesModalVisible}
          closeModal={success => {
            setTypesModalVisible(false);
            if (success) {
              //simpleTable.loadData();
            }
          }}
        />
      ) : null}
      <StatusBar />
    </div>
  )
};

export default PropertyManage;
