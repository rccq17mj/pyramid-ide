import React, {FunctionComponent, useEffect, useState} from 'react';
import { Row, Col, Button } from 'antd';
import styles from './PropertyManage.less';
import {Card, Button} from "antd";
import plus from "@/assets/plus.png";
import block from "@/assets/block.png";
import router from "umi/router";
import StatusBar from '@/components/StatusBar'
import {
  PyramidUIActionTypes, PyramidUIReceiveBlockItemListAction,
  PyramidUISendBlockItemGetAction,
  PyramidUISendProjectToolBar
} from "@/core/pyramid-ui/action/pyramid-ui.action";
import {pyramidUiService} from "@/core/pyramid-ui/service/pyramid-ui.service";
import Add from '@/pages/PropertyManage/Add/Index';
import {urlParames} from "@/utils/utils";

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

  const getBlockList = () =>{
    pyramidUiService.sendMessageFn(new PyramidUISendBlockItemGetAction({parentId:urlParames().parentId}));

    pyramidUiService.getMessageFn((action: PyramidUIReceiveBlockItemListAction) => {
      if (action.type === PyramidUIActionTypes.RECEIVE_PROJECT_BLOCK_ITEM_LIST) {
        console.log('blockItemData', action.payload)
        setCards(action.payload)
      }
    });

/*    setCards([
      {
        id:'664902700814700544',
        chineseName: "测试区块",
        englishName: "test block",
      },
      {
        id:'66490270081433700544',
        chineseName: "测试区块333",
        englishName: "test block",
      }
    ])*/
  }

  useEffect(() => {
    getBlockList();
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

  const handleClick = (e: string) => {
    let msg = {};
    msg[e] = true;
    pyramidUiService.sendMessageFn(new PyramidUISendProjectToolBar(msg));
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
                  <Button  onClick={()=>{handleClick('module')}} type="default" icon="build">发布</Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.container}>
        <div className={styles.left}>
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
        <div>
          预览
        </div>
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
      <StatusBar />
    </div>
  )
};

export default PropertyManage;
