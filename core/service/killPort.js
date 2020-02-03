const pidFromPort = require('pid-from-port');
const os = require('os');
const PROCESS = require('child_process');
const argv    = process.argv;
const _port = argv[2];

class killPort {
    constructor(port, callback) {
        killPid(port, callback);
    }
}
module.exports = killPort

const killPid = (port, callback) => {
    (async () => {
        try {
            const pid = await pidFromPort(port);
            var cmd = 'kill -9 ' + pid;
            console.log(cmd);
            if(os.platform() === 'win32'){
                cmd = 'taskkill /pid ' + pid +' -t -f'
            }
            PROCESS.exec(cmd, {}, function(error, stdout, stderr) {
                if(error){
                    console.log(error);
                    if(callback)callback(1)
                }
                else{
                    if(callback)callback(1)
                }
            });
        } catch (err) {
            if(callback)callback(1)
            console.log(port + '端口可以使用！\n');
            //console.log(err);
        }
    })();
}

// 先杀死必要端口
killPid(+_port);