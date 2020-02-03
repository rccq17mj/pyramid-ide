var PROCESS         = require('child_process');
const fs            = require('fs');
const cluster       = require('cluster');
const argv          = process.argv
const pathstr       = argv[2];
const sliceArr      = argv.slice(3).join(' ')
// 越狱electron沙箱环境
function  execute(){


    if (cluster.isMaster) {
        console.log(`主进程 ${process.pid} 正在运行`);
        cluster.fork();
    
        cluster.on('exit', (worker, code, signal) => {
            console.log(`工作进程 ${worker.process.pid} 已退出`);
        });
    } else {
        console.log(`工作进程 ${process.pid} 已启动`);
        const subprocess = PROCESS.spawn(sliceArr, {
            cwd: pathstr,
            shell: true,
            // stdio: ['inherit', 'inherit', 'inherit', 'ipc']
            stdio: 'inherit'
        });
    
    }
    


    fs.writeFileSync('./process_log.txt', `child: ${subprocess.pid} and father: ${process.ppid}` );

    // });
    // const subprocess = PROCESS.exec(sliceArr, {cwd: pathstr}, function(error, stdout, stderr) {
    //     if(error){
    //         console.log(error);
    //         fs.writeFileSync('./process_log_error.txt', error);
    //     }
    //     else{
    //         fs.writeFileSync('./process_log.txt', 'childProcessSay:' + stdout);
    //         jetpack.write('./aaa.txt', 'subprocess.pid:'+subssproce.pid)
    //         // console.log('subprocess.pid:' , subssproce.pid);
    //         // jetpack.write('./process_log.txt','childProcessSay:' + stdout)
    //         // jetpack.append('./process_log.txt', 'subprocess.pid:'+subssproce.pid)
    //     }
    // });


    // console.log('subssproce.pid: ', subssproce.pid)
    
    // PROCESS.fork('./child.js')
    // setTimeout(() => {
    //     subprocess.kill(); // 不会终止 shell 中的 Node.js 进程。
    // }, 30000);

    // subprocess.on('message', (m, server) => {
    //     if (m === 'server') {
    //         subprocess.kill();
    //     }
    // });

}
execute();

