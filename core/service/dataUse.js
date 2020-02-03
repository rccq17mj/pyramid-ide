/**
 * 对数据文件的操作全部统一在这里
 */
class dataUse {
    constructor(db) {
        this.db = db;
    }
    /**
     * 保存文件信息
     * @param {*} row 
     */
    save(row) {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                self.db.insert(row, (err, ret) => {
                    if (err) {
                        reject(err);
                    } 
                    if (ret) {
                      console.log('ret:', ret);
                      resolve(ret);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 移除文件信息
     * @param {*} option 传递删除的查询条件
     */
    remove(option) {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                self.db.remove(option, (err, numRemoved) => {
                    if (err) {
                        reject(err);
                    } 
                    if (numRemoved) {
                      console.log('numRemoved:', numRemoved);
                      resolve(numRemoved);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 取得要查找的数据
     * @param {*} option 
     */
    getRows(option={}) {
        // {key:'name', value:[]}option 格式{ name: { $in: ['tom', 'jerry'] } }
        const self = this;
        const options = {obj:{}};
        // 如果有传递条件进来
        // if(option.hasOwnProperty('key') && option.hasOwnProperty('value')){
        //     options.obj = this.setOption(option);
        // }
        // const options = this.setoPtion(option)
        return new Promise((resolve, reject) => {
            try {
                self.db.find(option).sort({ _id: -1 })
                    .exec((err, ret) => {
                    if(err){
                        reject(err);
                    }
                    if(ret) {
                        resolve(ret);
                    }
                  }); 
            } catch (e) {
                reject(e);
            }
        });
    }

    setOption(option){
        return JSON.parse(`{${option.key}: {$in: ${option.value}}}`);
    }

    

}

module.exports = dataUse