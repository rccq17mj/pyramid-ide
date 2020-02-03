## pyramid-cli
### 一、说明
pyramid-cli 是一套基于 ant design pro 开发的脚手架工具，目的是为了尽可能的统一代码风格以及拉取编写好的模板页面快速开发项目

### 二、本地开发调试
```
添加本地链接，使CLI命令指向该工程目录
npm link
```

### 三、全局安装
```
发布以后，可以使用全局安装CLI
npm i pyramid-cli -g
```

### 四、命令
```
1.查看帮助
pyramid

2.查看版本
pyramid -v

3.初始化项目（拉取模板工程项目，并且根据命令提示修改部分参数）
pyramid init 项目名称
示列1：
pyramid init demo --skip-inquirer --project-type=PC | MOBILE --project-package-manager=no
示列2：
pyramid init demo --skip-inquirer --project-url=direct:http://10.10.11.151:10080/product/bigdata-cloudplatform/templet/templet#new --project-package-manager=no

4.获取可用的区块列表（暂时不要）
pyramid block list

5.添加区块
1).模块
pyramid block add 模块地址  --page --path=/需要命名的模块名（必传） --route-path=/路由路径（可选） --route-name=/菜单名称（可选，前提必须传route-path 参数） --layout（可选，目前只是增加一个 routes 属性）
示列1：
pyramid block add https://github.com/guccihuiyuan/pyramid-blocks/tree/master/templates/EmptyPage --page --path=/empty
示列2：
pyramid block add https://github.com/guccihuiyuan/pyramid-blocks/tree/master/templates/EmptyPage --page --path=/empty1 --route-path=/empty2
示列3：
pyramid block add https://github.com/guccihuiyuan/pyramid-blocks/tree/master/templates/EmptyPage --page --path=/empty1 --route-path=/empty2 --route-name=empty3
示列4：（TODO 暂时留起）
pyramid block add https://github.com/guccihuiyuan/pyramid-blocks/tree/master/templates/EmptyPage --page --path=/empty1 --route-path=/empty2 --route-name=empty3 --layout

2).区块
pyramid block add 区块地址 --path（必传）=已经存在的路径 --index=插入索引（可选，不传默认为0）
示列：
pyramid block add https://github.com/guccihuiyuan/pyramid-blocks/tree/master/blocks/demo --path=/empty --index=0

3).布局（和区块共用一个命令）
pyramid block add 布局地址 --path（必传）=已经存在的路径 --index=插入索引（可选，不传默认为0）
示列：
pyramid block add https://github.com/guccihuiyuan/pyramid-blocks/tree/master/layouts/grid-basic-2 --path=/empty --index=0

6.修改项目配置
pyramid config set --open-pyramid-ui=false

区块包相关
1.下载区块模板工程
pyramid block init 项目名称 --init-block-package-url=区块工程地址（可不传，从默认地址拉） --init-block-package-type=区块包类型（可不传，pc | mobile 默认pc） --init-block-package-git-url=区块包git地址（暂时不传，预留）

例如：
pyramid block init test

2.创建区块和模块
pyramid block create 区块名称（英文名称，作为目录名称，内部会按照名称在处理一遍目录规则） 
  --create-block-type=类型（必传 block | template）
  --create-block-name-zh=中文名称（必传）
  --create-block-description=描述（必传）
  --create-block-git-url=git地址（必传，只需要传GIT项目的地址即可，可从区块包中读取）
  --create-block-git-branch=分支（可选，不传默认master）
  --create-block-image=预览图片（可选）
  --create-block-categories=分类（可选，多个分类以 , 分隔）
  
例如：
pyramid block create demo1 --create-block-type=block --create-block-name-zh=测试 --create-block-description=测试 --create-block-git-url=http://www.baidu.com --create-block-categories=按钮,开关
  
3.区块列表
pyramid block list 
  --list-block-type=类型（必选 blocks | templates）
  --list-project-url=地址（可选，例如：https://github.com/guccihuiyuan/pyramid-blocks）
  --list-project-branch=分支（可选，不传默认master）
  --list-project-path=路径（可选 --list-project-url 二选一，例如： F:\pyramid-blocks）
  
例如：
pyramid block list --list-block-type=blocks --list-project-path=F:\pyramid-blocks

4.区块分类-增删改
pyramid block category add <name> --category-type=类型（必传 blocks | templates）
pyramid block category delete <name> --category-type=类型（必传 blocks | templates） 
pyramid block category update <name> --category-type=类型（必传 blocks | templates）--category-update-name=新名称（必传）

例如：
新增：
pyramid block category add 开关 --category-type=blocks
更新：
pyramid block category update 开关 --category-update-name=新开关 --category-type=blocks
删除：
pyramid block category delete 开关 --category-type=blocks


配置相关
一、路由
1.获取路由树
pyramid config routes getPathTree
```

### 五、发布相关
```
1.发布
npm publish -access public

2.取消发布
npm unpublish pyramid@版本号
```
