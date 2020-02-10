const electron = require('electron')
const ENV = require('./env.config');
const path      = require('path')
// const root = '../../'
module.exports = {
    'mainWin':{
        devToolsShow: false,
        width: 1600,
        height:  1000,
        minWidth: 800,
        minHeight: 600,
        frame: true,
        loadUrl: process.env.ELE_ENV === ENV.ELE_ENV_LOCAL? 
        `http://localhost:8100/` : 
        `file://${__dirname}/../../templet/dist/index.html`,
        show: true,
        webPreferences: {
            devTools: true,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            preload: path.resolve(__dirname, '../../','preload.js')
        }
      },

      'runWin': {
        devToolsShow: true,
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        frame: true,
        loadUrl: `file://${__dirname}/../../pages/command/index.html`,
        parent: null,
        show: true,
        webPreferences: {
          nodeIntegrationInWorker: true,
          devTools: true,
          nodeIntegration: true
        },
        transparent: false
      },

      'projectWin': {
        devToolsShow: false,
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,
        frame: true,
        loadUrl: process.env.ELE_ENV === ENV.ELE_ENV_LOCAL? 
        `http://localhost:8100/#/project-toolbar` : 
        `file://${__dirname}/../../templet/dist/index.html#/project-toolbar`,
        parent: null,
        show: true,
        webPreferences: {
          devTools: true,
          nodeIntegration: true,
          preload: path.resolve(__dirname, '../../','preload.js')
        },
        transparent: false
      },

      'moduleWin': {
        devToolsShow: true,
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,
        frame: true,
        loadUrl: process.env.ELE_ENV === ENV.ELE_ENV_LOCAL? 
        'http://localhost:8100/#/project-modal/' :
        `file://${__dirname}/../../templet/dist/index.html#/project-modal/`,
        parent: null,
        show: true,
        webPreferences: {
          devTools: true,
          preload: path.resolve(__dirname, '../../','preload.js'),
        },
      }

};
