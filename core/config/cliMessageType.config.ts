/**
 * Cli消息类型（注意格式：pyramid.ui.cli.message + 定义）
 */
export const CliMessageTypes = {
    // 创建子项目
    CHILDREN_PROJECT_CREATE: 'pyramid.ui.cli.message.children.project.create',
    // 子项目启动
    CHILDREN_PROJECT_START: 'pyramid.ui.cli.message.children.project.start',
    // 创建子项目模块
    CHILDREN_PROJECT_MODULE_CREATE: 'pyramid.ui.cli.message.children.project.module.create',
    // 创建子项目布局
    CHILDREN_PROJECT_LAYOUT_CREATE: 'pyramid.ui.cli.message.children.project.layout.create',
    // 创建子项目区块
    CHILDREN_PROJECT_BLOCK_CREATE: 'pyramid.ui.cli.message.children.project.block.create',
    // 创建区块包
    PROJECT_BLOCK_PACKAGE_CREATE: 'pyramid.ui.cli.message.block.package.create',
    // 创建区块
    PROJECT_BLOCK_ITEM_CREATE: 'pyramid.ui.cli.message.block.item.create',
};