# 欢迎使用 平台生产力工具

![cmd-markdown-logo](http://10.10.11.151:10080/product/bigdata-cloudplatform/devtools/gcongo-mobile-dev/blob/dev/favicon.ico)

## 什么是 平台生产力工具

平台生产力工具 是一套基于electron及pyramid Pro，封装用户的项目安装，项目上传下载，路由导航的桌面应用工具。构建好的应用通过上传到管理端，下载到移动应用中进行使用。

## 项目结构：

```
 │
 ├── assets                  // 资源目录    
 ├── public                  // 上传下载zip包临时存放处
 ├─ core                     // 业务核心
 │  ├─ service               // 调用各用api的控制类
 │  ├─ config                // 应用各种配置
 │  ├─ core/receive          // 接收｜用于接收templet的请求
 │  ├─ core/pyramidControl   // 处理｜用于处理templet请求的相关逻辑
 │  ├─ core/response         // 回复｜用于将命令行异步执行结果返回给templet
 ├─ pages                    // 客户端工程用到的其他非UI界面
 │  ├─ command               // 用于命令行交互和客户端初始化相关的处理
 ├── templet                 // 客户端工程的UI界面渲染工程
 ├── .env                    // 请求服务器的相关地址配置常量地址
 ├── .gitignore
 ├── favicon.ico             // 顶部图标
 ├── hosts.icns              // 打包icon
 ├── main.js                 // 主进程文件
 ├── package-lock.json
 ├── package.json
 └── start.js                // 解析配置文件功能函数
```
## 注意：

1. 建议环境:

    node11.10.1 

2. mac安装依赖:

    // 先拷贝文件再运行构建命令，否则electron资源下载会很慢

    sudo mkdir ~/.electron

    sudo cp -r ./mac_64_dep/electron-v6.1.7-darwin-x64.zip ~/.electron

3. 打包构建时

    同样将electron-v6.1.7-darwin-x64.zip 拷贝到：

    Linux: $XDG_CACHE_HOME or ~/.cache/electron/

    MacOS: ~/Library/Caches/electron/

    Windows: $LOCALAPPDATA/electron/Cache or ~/AppData/Local/electron/Cache/

## 命令：

1. 安装yarn
npm install yarn -g
2. 初始化
npm run init
3. 运行
npm start

## 开发环境下开始运行：
默认启动
npm run start

## 子项目工程与外壳系统交互：

1. 子工程声明消息:

        ./templet/src/core/pyramid-ui/action/pyramid-ui.action.ts

2. 子工程发送消息:

        import React,{useEffect} from 'react';
        import styles from './index.less';
        import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
        import { PyramidUISendPublicConsole } from "@/core/pyramid-ui/action/pyramid-ui.action";

        import { Button, Icon } from 'antd';

        const StatusBar: React.FC = props => {
            const handleClick = e => {
            pyramidUiService.sendMessageFn(new PyramidUISendPublicConsole());
        };

        return (
            <div className={styles.statusBar} >
                <Button onClick={handleClick} type="link"><Icon type="code" /></Button>
            </div>
        )
        }

        export default StatusBar;

2. 客户端进行解析和处理:       

        ./core/service/message.js



## 开发工程 ： 
### window| browserView

    主窗口:   初始化, 显示，隐藏, 切换url,（主窗口及主窗口browserView的操作）： 新建项目，删除项目，载入项目nav 打开项目url

        - browser: 初始化，显示，隐藏，载入url

    命令窗口： 初始化, 显示，隐藏

    模态窗口： 初始化, 显示，切换url(参数变更), 销毁

### Message

    消息接收
    消息发送

    接收到外模板指令 ----> 调用cli|壳服务 处理----->  发送给命令窗口？---返回处理结果?
    接收到子工程指令 ----> 调用cli|壳服务 处理----->   发送给命令窗口？---返回处理结果?

    messege('cli', )

### Project
    项目删除
    项目增加
    项目列表--重复新求，更新显示

### 数据存取
    1. 使用统一的方式引入
    `const DataUse = require("./dataUse");`
    2. 使用DataUse方法：传入您的初始数据对象
        `new DataUse(dbname1)).remove({name: item}).then(
            callback(`您的数据`)
        )`
        `new DataUse(dbname2).save(projectInfo).then(msg=>{

        })`
        ...

## 应用业务流程

1. 启动应用
2. 系统环境检测
3. 新建（打开）工程项目
4. 系统设置
5. 项目开发设置

## 相关链接

[electron](https://electronjs.org/docs)
