## 更新日志

#### 2019.11.19 - 添加对本地svg icon的支持:
/config/config.ts 路由配置新增参数：

        routes: [
          {
            ...
            //本地icon 位于 /public/icons/shops.svg
            iconLocal: '/icons/shops.svg',
            ...
          }
        ]
注意：资源文件必须放到 /public 目录下 

配置路径时不需要引用 /public 路径前缀

#### 2019.10.30 - 新增docker方式部署应用:
package.json 文件新增两条命令：
```
1.构建docker镜像
npm run build-docker

2.部署并运行应用
npm run deploy-docker
```


#### 2019.10.30 - 新增本地、远程tabs多页签功能:
具体参考：(/src/core/configs/app.config.ts)
```
{
  ...
  USE_MULTI_TABS: true
  ...
}
```

#### 2019.10.12  - 新增本地、远程菜单混用配置:

新增本地、远程菜单混用配置，具体参考：[src/core/configs/app.config.ts](/src/core/configs/app.config.ts)
    
    {
    ...
    USE_LOCAL_MENU: USE_LOCAL_MENU.MUTUAL,
    ...
    }
    
    
如果使用远程菜单，需要在 [开放服务平台](http://10.10.11.107:22200/#/main) 对应用进行菜单配置，否则请求的远程菜单列表将为空。

 [开放服务平台](http://10.10.11.107:22200/#/main) 开发环境
 
 [开放服务平台](http://10.10.11.107:25062/#/main) 测试环境
 
 [开放服务平台](https://open.gcongo.com/#/main) 生产环境

菜单渲染逻辑请参考：src/layouts/BasicLayout.tsx
    

#### 2019.09.30  - 要使用全屏调试，请替换:

[src/core/services/congo.service.ts](/src/core/services/congo.service.ts) 

[src/core/services/http.service.ts](/src/core/services/http.service.ts) 
