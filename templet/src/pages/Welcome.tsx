import React, { useEffect, useState } from 'react';
import { List, Switch, Icon } from 'antd';
import { PyramidUISendPublicCMD } from "@/core/pyramid-ui/action/pyramid-ui-send.action";
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
import style from './Welcome.less';
import homeLogo from "../assets/home-logo.png";
import surrounding from "../assets/surrounding.png";
import versionImg from "../assets/version.png";

const Home = () => {
  const [vNode, setvNode] = useState<any>('...');
  const [vNPM, setvNPM] = useState<any>('...');
  const [vYarn, setvYarn] = useState<any>('...');
  const [vUmi, setvUmi] = useState<any>('...');
  const [vPyramid, setvPyramid] = useState<any>('...');
  const [dependent, seDependent] = useState<any>(false);

  const sendCmd = (cmd, callback) => {
    pyramidUiService.sendMessageFn(new PyramidUISendPublicCMD({cmd}, (action) => {
      if (action.payload.cmdStatus === "progress") {
        callback(action.payload.cmdMessage);
      }
    }));
  };

  useEffect(() => {
    sendCmd('node -v', (msg) => {
      setvNode(msg);
      sendCmd('npm -v', (msg) => {
        setvNPM(msg);
        sendCmd('yarn -v', (msg) => {
          setvYarn(msg);
          sendCmd('umi -v', (msg) => {
            setvUmi(msg);
            sendCmd('pyramid -v', (msg) => {
              setvPyramid(msg);
              seDependent(true);
            })
          })
        })
      })
    })
  }, []);

  return (
    <div className={style.homeBody}>
      <div className={style.homeItem}>
        <div className={style.textItem}>
          <h1>欢迎使用Pyramid Devtools</h1>
          <span className={style.spanText}>超光速构建您的应用</span>
          <List
            split={false}
            className={style.List}
          >
            <List.Item>
              <List.Item.Meta
                avatar={<img src={surrounding} width={50} height={50} alt='' />}
                title='当前环境'
                description={`node ${vNode} | npm ${vNPM} | yarn ${vYarn} | umi ${vUmi} | pyramid ${vPyramid}`}
              />
              <Switch
                checkedChildren={<Icon type="check" style={{ height: '16px' }} />}
                unCheckedChildren={<Icon type="close" style={{ height: '16px' }} />}
                checked={dependent}
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                avatar={<img src={versionImg} width={50} height={50} alt='' />}
                title='版本v1.0.1'
                description="最低可用版本 v1.0.0 | 最新版 v1.0.1"
              />
              <Switch
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="close" />}
                defaultChecked
              />
            </List.Item>
          </List>
        </div>
      </div>
      <div className={style.homeLogo}>
        <img src={homeLogo} alt='' />
      </div>
    </div>
  )
};

export default Home;
