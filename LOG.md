## 更新日志

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
