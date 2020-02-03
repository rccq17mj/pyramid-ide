// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector)
//     if (element) element.innerText = text
//   } 
  
//   for (const type of ['chrome', 'node', 'electron']) {
//     replaceText(`${type}-version`, process.versions[type])
//   }
// })

const { ipcRenderer } = require('electron')

function sendMessage(data){
  ipcRenderer.send('site-message', data);
}

function getMessage (fun) {
  ipcRenderer.on('site-message', (event, arg)=> {
    fun(arg);
  })
}

window.sendMessage = sendMessage;
window.getMessage  = getMessage;