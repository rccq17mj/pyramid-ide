const ENV = require('../../core/config/env.config');

class init {
    constructor(cmdRun) {
        this.cmdRun = cmdRun;
    }

    /** 检测node服务 */
    testNode() {
        return this.cmdPromise('node -v');
    }

    /** npm检测 */
    testNPM() {
        return this.cmdPromise('npm -v');
    }

    /** npm检测 */
    testYarn() {
        return this.cmdPromise('yarn -v');
    }

    /** umi */
    testUmi() {
        return this.cmdPromise('umi -v', (resolve, reject, e) => {
            this.cmd('npm install umi@2.13.3 -g').then(msg => {
                resolve(msg);
            }).catch(e => {
                reject(e);
            })
        })
    }

    /** pyramid检测 */
    testPyramid() {
        return this.cmdPromise('pyramid -v', (resolve, reject, e) => {
            switch (process.env.ELE_ENV) {
                case ENV.ELE_ENV_LOCAL:
                    console.log('cd pyramid-cli && yarn install && npm link');
                    this.cmd('cd pyramid-cli && yarn install && npm link').then(msg => {
                        resolve(msg);
                    }).catch(e => {
                        reject(e);
                    })
                    break;
                case ENV.ELE_ENV_PRO:
                    this.cmd('npm install pyramid-cli -g').then(msg => {
                        resolve(msg);
                    }).catch(e => {
                        reject(e);
                    })
                    break;
                default:
                    reject('环境变量 ELE_ENV 未指定！');
                    break;
            }
        })
    }

    cmdPromise(cmd, callback) {
        return new Promise((resolve, reject) => {
            /** 检测Pyramid-cli */
            this.cmd(cmd).then(flag => {
                // 检测通过，不做操作
                resolve(flag);
            }).catch(e => { 
                if(callback)
                    callback(resolve, reject, e);
                else    
                    reject(e);
            })
        })
    }

    cmd = (cmdStr) => {
                return new Promise((resolve, reject) => {
                    try {
                        let worker = new Worker(this.cmdRun);
                        worker.postMessage({ cmdStr });
                        worker.onmessage = (ev) => {
                            let msg = ev.data;
                            if(msg.cmdStatus === 'progress') {
                                if( msg.cmdFlag === 'cmd_err')
                                    this.error = msg.cmdMessage;
                                else if( msg.cmdFlag ==='cmd_out') {
                                    this.error = null;
                                    this.msg = msg.cmdMessage;
                                }
                            }
                            if(msg.cmdStatus === 'end'){
                                if(!this.error)
                                    resolve(this.msg);
                                else
                                    reject(this.error);
                            }
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            }
}

module.exports = init;