import React, {FunctionComponent, useState, useEffect} from 'react';
import {Card, Checkbox} from "antd";
import block from "@/assets/block.png";
import style from "./FeaturesGrid.less";

const FeaturesGrid = (props) =>{

  const {cards, isManege} = props

  return(
    <div>
      {
        cards.map((card, index) => {
          return (
            <Card className={style.cards} key={index}>
              <img src={block} width={50} height={50}></img>
              <p>{card.menuNameZh}</p>
              <div>{card.menuNameEn}</div>
              <span>{card.filePath}</span>
              { isManege ?  <Checkbox className={style.checkBox} checked={card.checked} onClick={(e)=>{e.stopPropagation()}}></Checkbox> : null}
            </Card>
          )
        })
      }
    </div>
  )
}

export default FeaturesGrid
