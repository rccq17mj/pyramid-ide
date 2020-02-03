// 文字颜色
const chalk = require('chalk');

module.exports = (command) => {
    let detail;
    switch (command) {
        case 'block':
            detail = `
  Usage: pyramid block <cmd> [options]
  
  Commands: 
    ${chalk['cyan']('add')}      add a block to your project
    ${chalk['cyan']('init')}     init a block template project  
    
  Options for the ${chalk['cyan']('add')} command:
    ${chalk['green']('--page')}          add the block to editable section at index
    ${chalk['green']('--layout')}        add as a layout block (add route with empty children)
    ${chalk['green']('--path')}          the file path, default the name in package.json
    ${chalk['green']('--route-path')}    the route path, default the name in package.json
    ${chalk['green']('--route-name')}    the route name, default the name in package.json
    ${chalk['green']('--index')}         add the block to a independent directory as a page    
                `;
            break;
        case 'init':
            break;
        default:
    }
    console.log(detail);
};


