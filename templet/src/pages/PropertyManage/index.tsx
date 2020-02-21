import React, {FunctionComponent, useEffect, useState} from 'react';
import {Row, Col, Button, Card, Icon} from 'antd';
import styles from './PropertyManage.less';
import plus from "@/assets/plus.png";
import block from "@/assets/block.png";
import router from "umi/router";
import StatusBar from '@/components/StatusBar'
import {pyramidUiService} from "@/core/pyramid-ui/service/pyramid-ui.service";
import Add from '@/pages/PropertyManage/Add/Index';
import Release from '@/pages/PropertyManage/Add/Release';
import Types from '@/pages/PropertyManage/Add/Types';
import {
  PyramidUISendBlockPackageInfoAction,
} from "@/core/pyramid-ui/action/pyramid-ui-send.action";
import {
  PyramidUIReceiveActionsUnion,
} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
import {PyramidUIActionTypes} from "@/core/pyramid-ui/action";
import {EBlockPackageAssemblyType, EBlockPackageEndNumberType} from "@/dicts/block-package.dict";

interface ILeftBtn {
  name: string;
  open: boolean;
}

interface IProps {
  location: {
    query: {
      // 项目信息
      projectInfo: {
        _id: string;
        applyType: EBlockPackageEndNumberType;
        absolutePath: string;
        package: string;
        remarkImg: string;
        filePath: string;
        menuNameEn: string;
        menuNameZh: string;
      },
      blockPackageAssemblyType: EBlockPackageAssemblyType
    }
  }
}

const PropertyManage: FunctionComponent<IProps> = (props) => {
  const [leftButtons, setLeftButtons] = useState<ILeftBtn[]>([]);
  const [selectType, setSelectType] = useState('');
  const [cards, setCards] = useState<any[]>([]);
  const [cardData, setCardData] = useState<any[]>([]);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [releaseModalVisible, setReleaseModalVisible] = useState<boolean>(false);
  const [typesModalVisible, setTypesModalVisible] = useState<boolean>(false);
  const [modalParams, setModalParams] = useState<any>(null);

  const getBlockTypeList = () => {
    const projectPath = props.location.query.projectInfo.absolutePath;
    if (projectPath) {
      pyramidUiService.sendMessageFn(new PyramidUISendBlockPackageInfoAction({
        projectPath: projectPath,
      }));
    } else {
      router.push({pathname: '/property/myProperty'});
    }
  };

  useEffect(() => {
    getBlockTypeList();

    const messageKey = pyramidUiService.getMessageFn((pyramidAction: PyramidUIReceiveActionsUnion) => {
      switch (pyramidAction.type) {
        case PyramidUIActionTypes.RECEIVE_PROJECT_BLOCK_PACKAGE_INFO:
          const blocks = pyramidAction.payload.packageInfo.blocks;
          // 渲染区块
          const fatherBlock = blocks.filter((val) => {
            return val.name != ''
          });
          setCards(fatherBlock);
          setCardData(fatherBlock);

          // 渲染分类
          const category = pyramidAction.payload.packageInfo.category.blocks;
          const categoryList = [];
          category.forEach((item, index)=>{
            let categoryItem;
            if(index == 0){
              categoryItem = {
                name: item,
                open: true,
              };
              setSelectType(item)
            }else{
              categoryItem = {
                name: item,
                open: false,
              }
            }
            categoryList.push(categoryItem)
          });

          setLeftButtons(categoryList);
          break;
      }
    });

    return () => {
      pyramidUiService.clearMessageFn(messageKey);
    }
  },[]);

  useEffect(() => {
    let newCards = [...cardData];
    const Cards = newCards.filter((val) => {
      return val.tags.indexOf(selectType) != -1;
    });
    setCards(Cards);
  },[leftButtons, cardData]);

  const hoverChange = (card, hover) => {
    let newCards = [...cards];
    newCards.forEach((item)=>{
      if(item.key == card.key){
        item['hover'] = hover
      }
    });
    setCards(newCards)
  };

  const clickLeftBtn = (btn: ILeftBtn, index: number) => {
    const copyLeftButtons: ILeftBtn[] = JSON.parse(JSON.stringify(leftButtons));
    copyLeftButtons.forEach(copyLeftButton => {
      copyLeftButton.open = false;
    });
    copyLeftButtons[index].open = true;
    setSelectType(copyLeftButtons[index].name);
    setLeftButtons(copyLeftButtons);
  };

  const renderList = () => {
    return(
      <div className={styles['card-container']}>
        {/* 新建 */}
        <Card className={styles['card-item']} onClick={() => {
          setModalParams({
            categories: leftButtons,
            blockPackageAssemblyType: props.location.query.blockPackageAssemblyType,
            absolutePath: props.location.query.projectInfo.absolutePath
          });
          setAddModalVisible(true);
        }}>
          <img src={plus} width={50} height={50} alt='' />
          <p>新建新区块</p>
        </Card>

        {/* 数据 */}
        {
          cards.map((card, index) => {
            return (
              <Card className={styles['card-item']} key={card.key + index}
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
                <img src={block} width={50} height={50} alt=''/>
                <p>{card.key}</p>
                <span>{card.name}</span>
              </Card>
            )
          })
        }
      </div>
    )
  };

  return (
    <div className={styles.all}>
      {/* 工具栏 */}
      <div style={{backgroundColor: '#30303D', padding: '0.4rem 0.4rem'}}>
        <Row gutter={[8, 8]}>
          <Col span={6}>
            <Button onClick={()=>{router.goBack()}} shape="circle" icon="left" />
          </Col>
          <Col span={18}>
            <div style={{ float: 'right' }}>
              <Row gutter={[6, 18]}>
                <Col span={13}>
                  <Button onClick={()=>{
                    setModalParams({
                      projectInfo: props.location.query.projectInfo
                    });
                    setReleaseModalVisible(true);
                  }} type="default" icon="build">发布</Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>

      {/* 内容 */}
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles['left-btn']} onClick={() => {
            setModalParams({
              categoryType: props.location.query.blockPackageAssemblyType,
              absolutePath: props.location.query.projectInfo.absolutePath
            });
            setTypesModalVisible(true);
          }}>
            <div className={styles['add-btn']}>
              <Icon type="plus" />
              <span>新建分类</span>
            </div>
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
      </div>

      {/*  */}
      {addModalVisible ? (
        <Add
          modalVisible={addModalVisible}
          params={modalParams}
          closeModal={success => {
            setModalParams(null);
            setAddModalVisible(false);
            if (success) {
              getBlockTypeList();
            }
          }}
        />
      ) : null}

      {/* 发布 */}
      {releaseModalVisible ? (
        <Release
          params={modalParams}
          modalVisible={releaseModalVisible}
          closeModal={success => {
            setModalParams(modalParams);
            setReleaseModalVisible(false);
            if (success) {
            }
          }}
        />
      ) : null}

      {/* 分类 */}
      {typesModalVisible ? (
        <Types
          modalVisible={typesModalVisible}
          params={modalParams}
          closeModal={success => {
            setModalParams(null);
            setTypesModalVisible(false);
            if (success) {
              getBlockTypeList();
            }
          }}
        />
      ) : null}

      <StatusBar />
    </div>
  )
};

export default PropertyManage;
