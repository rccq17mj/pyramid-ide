/**
 * cmd code
 */
export enum ECmdResultCode {
    // 执行成功
    SUCCESS = 0,

    // 定义失败的 Code，失败全是不等于0的，cli里面会完善 Code
    // 分类 从 1000 开始
    BLOCK_CATEGORY_DELETE_NO_EXIST = 1000,

    READ_FILE_FAIL = 90000,
    MISSING_PARAMS = 91000
}

// 获取 code 对应的描述
export const getCmdResultStrByCode = (code: ECmdResultCode) => {
    let resultStr = '';
    switch (code) {
        case ECmdResultCode.SUCCESS:
            resultStr = '成功';
            break;
        case ECmdResultCode.BLOCK_CATEGORY_DELETE_NO_EXIST:
            resultStr = '该分类不存在，无法删除';
            break;
        case ECmdResultCode.READ_FILE_FAIL:
            resultStr = '文件读取失败';
            break;
        case ECmdResultCode.MISSING_PARAMS:
            resultStr = '缺少参数';
            break;
        default:
            break;
    }
    return resultStr;
};