## 更新日志

#### 2020.02.05 - 及大的简化了命令行交互:

详见 templet/src/pages/Welcome.tsx 中调用方式

#### 2020.01.07 - 新增一个渲染窗口来执行系统命令的调用:
main.js 下添加代码
`function createCmdWin () {
  cmdWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      // javascript: true
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // and load the index.html of the app.
  
  cmdWindow.loadFile('index.html')
  // cmdWindow.hide() 使用此项来进行窗口隐藏

  // Open the DevTools.
  cmdWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  cmdWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    cmdWindow = null
  })
}`

#### 2020.02.20 - 修改应用项目PC/mobild列表切换不正确的问题:
原因: 原来的url中己经不能正常取到pc锚点标识，所以异常

#### 2020.02.20 - 修改调整了package.json中的windows下打包配置:
1. 部分目录需要改为"./directory/*/**",来包含打包文件引用,不能简单使用"./directory/*"的形式
2. windows下打包时要求使用icon配置为256*256
注意：windows下打包时需关闭防火墙,360会屏蔽下载致使出错，打包前最好要配置的几个常量
  set ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/
  set SELENIUM_CDNURL=http://npm.taobao.org/mirrorss/selenium
  set CHROMEDRIVER_CDNURL=https://npm.taobao.org/mirrors/chromedriver
  set SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/

3. 打包完成后，需把templet下的dist进行布署, 服务需提供到localhost:8100
4. 现启动打包好的外壳工程，首页下的部分文字还有部分乱码
5. 还需要公司内部环境下测试