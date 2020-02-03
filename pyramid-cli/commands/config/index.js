const program = require('commander');
const chalk = require('chalk');

module.exports = (options) => {
    if (program.args.length === 0) {
        console.log(chalk.red('缺少 attribute 参数'));
        process.exit();
    }
    if (program.args.length === 1) {
        console.log(chalk.red('缺少 action 参数'));
        process.exit();
    }

    const attribute = program.args[0];

    switch (attribute) {
        case 'routes':
            require('./routes')(options);
            break;
        default:
            break;
    }
};
