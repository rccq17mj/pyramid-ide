// 解析.env中的配置参数，定义全局常量数据

const jetpack           = require('fs-jetpack')
const path              = require('path')

function Start() {
    const coustem_env       = path.join(__dirname, './.env')
    const content           = jetpack.read(coustem_env)
    const line_arr          = content.split("\n")
    const env_arr           = {}
    line_arr.map((item)=>{
        if(item) {
            const sitem           = item.split(/\s*\=\s*\r*\n*/)
            env_arr[sitem[0]]   = sitem[1]
            sitem[1] = sitem[1].replace("\r","")
            eval(`${sitem[0]} = '${sitem[1]}'`)
        }

    })
}
module.exports = {
    Start
}