import React, { useEffect, useState } from 'react';
import { List, Switch, Icon } from 'antd';
import { PyramidUISendPublicCMD } from "@/core/pyramid-ui/action/pyramid-ui.action";
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
import style from './Welcome.less';
import homeLogo from "../assets/home-logo.png";
import surrounding from "../assets/surrounding.png";
import version from "../assets/version.png";

const Home = () => {
  const [vrsion, setVersion] = useState<any>({
    node: '...',
    npm: '...',
    yarn: '...',
    umi: '...'
  });

  const sendCmd = (cmd, callback) => {
    pyramidUiService.sendMessageFn(new PyramidUISendPublicCMD({ cmd}, (payload) => {
      if (payload.status === "progress") {
        callback(payload.msg);
      }
    }));
  }

  useEffect(() => {
    const v = {
      node: '',
      npm: '',
      yarn: '',
      umi: ''
    };
    sendCmd('node -v', (msg) => {
      v.node = msg;
      sendCmd('npm -v', (msg) => {
        v.npm = msg;
        sendCmd('yarn -v', (msg) => {
          v.yarn = msg;
          sendCmd('umi -v', (msg) => {
            v.umi = msg;
            setVersion(v);
          })
        })
      })
    })
  }, [])

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
                avatar={<img src={surrounding} width={50} height={50} />}
                title='当前环境'
                description={`node ${vrsion.node} | npm ${vrsion.npm} | yarn ${vrsion.yarn} | umi ${vrsion.umi}`}
              />
              <Switch
                checkedChildren={<Icon type="check" style={{ height: '16px' }} />}
                unCheckedChildren={<Icon type="close" style={{ height: '16px' }} />}
                defaultChecked
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                avatar={<img src={version} width={50} height={50} />}
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
        <img src={homeLogo} />
      </div>
    </div>
  )
}

export default Home;

/*export default (): React.ReactNode => (

);*/
