import React, {FunctionComponent, useState} from 'react';
import styles from './PropertyLayout.less';
import {Icon} from "antd";
import router from "umi/router";

interface ILeftBtn {
  icon: string;
  name: string;
  url: string;
  open: boolean;
}

interface IProps {
}

const Component: FunctionComponent<IProps> = props => {

  const [leftButtons, setLeftButtons] = useState<ILeftBtn[]>([
    /*    {
          icon: 'border',
          name: '模块',
          url: '/property/PropertyLibrary/PropertyLibraryModule',
          open: true
        },*/
    {
      icon: 'appstore',
      name: '区块',
      url: '/property/PropertyLibrary/PropertyLibraryBlock',
      open: true
    }
  ]);

  /*  useEffect(() => {
      // clickLeftBtn(leftButtons[2], 2);
      leftButtons.forEach((item)=>{
        if(item.url == window.location.pathname){
          item.open = true
        }else{
          item.open = false
        }
      })
      setLeftButtons(leftButtons)
    });*/

  const clickLeftBtn = (btn: ILeftBtn, index: number) => {
    router.push(btn.url);

    const copyLeftButtons: ILeftBtn[] = JSON.parse(JSON.stringify(leftButtons));
    copyLeftButtons.forEach(copyLeftButton => {
      copyLeftButton.open = false;
    });

    copyLeftButtons[index].open = true;

    setLeftButtons(copyLeftButtons);
  };

  return (
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
        {props.children}
      </div>
    </div>
  )
};

export default Component;
