/**
 * cmd code
 */
export enum ECmdResultCode {
    // 执行成功
    SUCCESS = 0,
    // 定义失败的 Code，cli里面会完善 Code
}

// 获取 code 对应的描述
export const getCmdResultStrByCode = (code: ECmdResultCode) => {
    let resultStr = '';
    switch (code) {
        case ECmdResultCode.SUCCESS:
            resultStr = '成功';
            break;
        default:
            break;
    }
    return resultStr;
};