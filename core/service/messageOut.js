const { ipcMain, dialog, BrowserView } = require('electron');
const path = require('path');
const config = require('../config/window.config');
const ipcConfig = require('../config/ipcArg.config');
const eventConfig = require('../config/event.config');
const ENV = require('../config/env.config');
const _window = require('./window');

class messageOut {

    constructor() {
    }

    /** 输出导向 */
    putContent() {
        
    }


}

module.exports = messageOut
