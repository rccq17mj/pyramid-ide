## 欢迎使用 pyramid Pro

Pyramid Pro（基于 Ant Design Pro v4）

![cmd-markdown-logo](/md_assets/logo.png)

## 更新日志

[更新日志](/LOG.md) 

最后更新时间：2019.10.12

## 项目说明

PC 端模板工程，已经与后台对接完成 用户/角色/组织/权限等部分

## 安装

1.由于 Ant Design Pro 里面包含了 chromium，会导致有时要翻墙才能下载，但是这个模块也不是必须的，所以先运行如下命令跳过该模块的安装（注：一个系统只用运行一次即可，下次在安装可以不用在运行）

    > npm run set-puppeteer-source

2.安装依赖

    > yarn install

[yarn 使用说明](https://yarnpkg.com/zh-Hans/)

## 运行

    > yarn start

## 路由配置

编辑 config/config.ts 中 routes 属性即可

## 是否开启本地菜单（默认使用本地菜单）

修改 src/configs/app.config.ts 中的 USE_LOCAL_MENU 字段，如果需要获取远程菜单，必须设置 ACCESS_CONGO 为 true

      export const APP_CONFIG = {
        ...
        USE_LOCAL_MENU: true,
        ...
      };

## 菜单权限与细粒度权限

菜单：如果开启远程菜单并且接入热果，默认在 src/layouts/BasicLayout.tsx 中会获取并设置获取的远程菜单，每个系统对菜单的控制可能不一样，可根据需求做相应的改造

按钮等细粒度：与上面的菜单在相同的文件，需要在下面添加如下代码设置；具体使用请参考 Ant Design Pro 官网权限部分

```
setAuthority(acls);
reloadAuthorized();
```

## 是否接入热果 OS（默认接入热果）

修改 src/configs/app.config.ts 中的 ACCESS_CONGO 字段

      export const APP_CONFIG = {
        ACCESS_CONGO: true,
        ...
      };

## 应用调试

### 方式一：

快速接入方式，可以查看示例，正式开发不使用此方式。

#### 1.访问地址：

http://10.10.11.107:22202/#/login

#### 2.注册并登录您的账号：

账号:{yourUserID} 密码:{yourPassword}

#### 3.打开调试应用

![debug](/md_assets/debug.png)

#### 4.输入 endpointCode/tenantId

endpointCode：end_WJ1844tVnmCa

tenantId：127 // 非强制，或使用任意tenantId

#### 5.输入前端工程 ip、端口访问应用

![debug2](/md_assets/debug2.png)

### 方式二：

![flow](/md_assets/flow.jpg)

[关于：tenantId，请移步 man 端](http://10.10.11.106:9484/#/passport/login)

[关于：endpointCode，请移步开放服务平台](http://10.10.11.107:22200/#/main)

[关于：应用审核，请移步管理平台](http://10.10.11.107:22100/#/passport/login)

1.通过开放服务平台建立一个新的应用，如果是租户应用需要在 man 端建立一个租户管理员。

2.打开调试应用，输入对应的 endpointCode、tenantId；

3.修改 config/config.ts 中的 proxy（反向代理），指向你对应的后端地址；

    ...
    proxy: {
      '/man-api': {
        target: 'http://10.10.11.104:23334',
        local: 'http://10.10.11.28:23333',
        dev: 'http://10.10.11.104:23334',    // npm start 默认使用开发环境启动
        test: 'http://10.10.11.107:23333',
        changeOrigin: true,
        pathRewrite: { '^/man-api': '' },
    },
    ...

4.你可能需要使用对应的后端模版工程：  
http://10.10.11.151:10080/product/bigdata-cloudplatform/osman/parrot-server

## 热果 OS 授权说明

### 1.授权逻辑：

![Auth](/md_assets/Auth.png)

授权逻辑入口文件 src/core/services/congo.service.ts

#### -名词解释-

<table>
        <tr>
            <th>名词</th>
            <th>解释</th>
            <th>来源</th>
        </tr>
        <tr>
            <th>token</th>
            <th>子应用令牌</th>
            <th>通过ticket交换</th>
        </tr>
        <tr>
            <th>ostoken</th>
            <th>热果os端统一令牌</th>
            <th>src/core/services/congo.service.ts 中接收</th>
        </tr>
        <tr>
            <th>CONTEXTPATH</th>
            <th>热用于请求 ticket 的链接</th>
            <th>调用接口返回</th>
        </tr>
        <tr>
            <th>ticket</th>
            <th>用于交换 token 的零时票据</th>
            <th>调用接口返回</th>
        </tr>
        <tr>
            <th>endpoint、endpointCode</th>
            <th>子应用端id</th>
            <th>开放服务平台</th>
        </tr>     
        <tr>
            <th>tenantId</th>
            <th>租户号</th>
            <th>man端</th>
        </tr>  
        <tr>
            <th>qic</th>
            <th>appKey（已经通过 CONTEXTPATH 获取到，无需再填写）</th>
            <th></th>
        </tr>                                   
 </table>

### 2.请求响应：

src/core/services/http.service.ts 中处理

<table>
        <tr>
            <th>code</th>
            <th>说明</th>
        </tr>
        <tr>
            <th>201</th>
            <th>子应用授权成功</th>
        </tr>
        <tr>
            <th>401</th>
            <th>从未经过授权</th>
        </tr>
        <tr>
            <th>402</th>
            <th>token 失效，此时可使用 ostoken 重新获取</th>
        </tr>
        <tr>
            <th>406</th>
            <th>ostoken 失效，通常响应 406 则 401 不会再响应，需要通知热果 os 端重新登录</th>
        </tr>                                
 </table>
 
       // 406 通知热果 os 端重新登录
       window.parent.postMessage(JSON.stringify({
         type: 'APP_EVENT',
         msg: 'overTime'
       }),'*');

### 3.热果 os 事件调用：

      window.parent.postMessage(JSON.stringify({
        options
      }), '*')

#### options

      {
        type: 'APP_EVENT', // 主协议，string 事件调用一般为'APP_EVENT'
        msg: 'overTime'    // 次协议，string 具体事件
      }

#### msg

overTime: 406 超时时，通知 os 端重新登录

windowOpen: 打开一个页面

    window.parent.postMessage(JSON.stringify({
        type: 'APP_EVENT',
        msg: 'windowOpen',
        params: {
            url: 'http://www.baidu.com'
        }
    }),'*');
    
    
#### docker方式部署
优点：以往需要部署应用，jenkins 都需要重新经理构建、打包等比较耗时的操作，利用docker镜像的缓存技术，如果文件没有修改，则会使用上一次构建的镜像层，如果依赖文件没有改变，则不会去下载依赖包；加快部署速度；但同时需要在本地维护一份nginx的配置文件

缺点：需要由前端维护 nginx 配置文件，同时每个环境，配置文件可能不同，这个要加以区分

```
1.构建docker镜像
npm run build-docker
npm run build-docker:dev

2.部署并运行应用
npm run deploy-docker
npm run deploy-docker:dev
```

## pyramid-cli
#### 说明
pyramid-cli 是一套基于ant design pro 开发的脚手架工具，目的是为了尽可能的统一代码风格以及快速开发项目

#### 全局安装
```
npm i pyramid-cli -g
```

#### 查看帮助
```
pyramid -h
```

#### 查看版本
```
pyramid -V
```

#### 初始化项目（自定义创建模板工程，只能拉取拖到github上的测试项目，内网的暂时无法拉取）
```
pyramid init 项目命令
```

#### 获取区块列表（功能同 ant design pro 的区块一样，只是 pyramid-cli 的区块都是用 hooks 编写，以及后续可维护自己开发的区块模板）
```
pyramid block list
```

#### 添加区块（区块地址可由 pyramid block list 选择后获取）
```
pyramid block add 区块地址
```

## 项目开发说明文档

[项目开发说明文档-语雀](https://www.yuque.com/docs/share/e9572c21-151d-42d2-9b87-1342df25140d)

[移动端 pyramid_mobile](http://10.10.11.151:10080/product/bigdata-cloudplatform/mini-program/gcongo-mobile-ts)

[DVA 官方文档](https://dvajs.com/)

[Hooks 文档-新写法，有状态的函数式组件](https://react.docschina.org/docs/hooks-intro.html)

[Anguler版本](http://10.10.11.151:10080/product/bigdata-cloudplatform/templet/front-framework-mans)

[问题反馈](/query.md) 
