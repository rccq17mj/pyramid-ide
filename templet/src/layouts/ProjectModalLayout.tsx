import React, {FunctionComponent, useEffect, useState} from 'react';
import styles from './ProjectModalLayout.less';
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
    {
      icon: 'setting',
      name: '配置',
      url: '/project-modal/config',
      open: false
    },
    {
      icon: 'setting',
      name: '布局',
      url: '/project-modal/layout',
      open: false
    },
    {
      icon: 'setting',
      name: '模块',
      url: '/project-modal/module',
      open: false
    },
    {
      icon: 'setting',
      name: '区块',
      url: '/project-modal/block',
      open: false
    }
  ]);

  useEffect(() => {
    const pathname = window.location.pathname;
    leftButtons.forEach((leftButton, index) => {
      if (leftButton.url === pathname) {
        clickLeftBtn(leftButton, index);
      }
    });
  }, []);

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
