
const { app } = require('electron');
const _window = require('./core/service/window');
const config = require('./core/config/window.config');
const { ipcMain } = require('electron');
const messageServer = require("./core/service/message");


var mainWindow = runWindow =null;

// 应用准备完毕，初始化窗口
app.on('ready', () => {
  
  mainWindow = _window(config.mainWin);
  runWindow  = _window(config.runWin);

  // 应用退出
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('activate', function () {
    if (mainWindow === null) _window(config.mainWin)
  })

  // 监听接收与回传 回馈给前端启动信息
  const window_objs = { 'mainWindow': mainWindow, 'runWindow': runWindow };
  new messageServer(window_objs);
})