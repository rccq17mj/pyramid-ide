const electron = require('electron')
const { BrowserWindow} = electron
const path = require('path')


module.exports = function(parameter){
  // Create the browser window.
  let theWindow         = {};
  const base_parameter  = {};
  const other_parameter = {}

  // 直接用来初始化的参数
  const base_name = {
    width: 0,
    height: 0,
    minWidth: 0,
    minHeight: 0,
    frame: 0,
    icon: 0,
    fullscreen: 0,
    show: false,
    parent: null,
    transparent: false,
    resizable: true,
    webPreferences: {}
  }

  for(let key in parameter) {
    if(base_name.hasOwnProperty(key)) {
      base_parameter[key]   = parameter[key];
      other_parameter[key]  = parameter[key];
    } else {
      if (key == 'loadUrl'){
        other_parameter.loadUrl = parameter[key]
      }
    }
   }

   theWindow  = new BrowserWindow(base_parameter)

   if(parameter.devToolsShow) {
       theWindow.webContents.openDevTools()
   }

   if(other_parameter.loadUrl) {
       theWindow.loadURL(other_parameter.loadUrl);
   }



   theWindow.on('closed', ()=> {
       theWindow = null
   })


   return theWindow;
}


