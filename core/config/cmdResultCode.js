"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * cmd code
 */
var ECmdResultCode;
(function (ECmdResultCode) {
    // 执行成功
    ECmdResultCode[ECmdResultCode["SUCCESS"] = 0] = "SUCCESS";
    // 定义失败的 Code，失败全是不等于0的，cli里面会完善 Code
    // 分类 从 1000 开始
    ECmdResultCode[ECmdResultCode["BLOCK_CATEGORY_DELETE_NO_EXIST"] = 1000] = "BLOCK_CATEGORY_DELETE_NO_EXIST";
})(ECmdResultCode = exports.ECmdResultCode || (exports.ECmdResultCode = {}));
// 获取 code 对应的描述
exports.getCmdResultStrByCode = function (code) {
    var resultStr = '';
    switch (code) {
        case ECmdResultCode.SUCCESS:
            resultStr = '成功';
            break;
        case ECmdResultCode.BLOCK_CATEGORY_DELETE_NO_EXIST:
            resultStr = '该分类不存在，无法删除';
            break;
        default:
            break;
    }
    return resultStr;
};
