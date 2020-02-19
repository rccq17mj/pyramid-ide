import {IDict} from "@/dicts/index";

/**
 * 区块包来源
 */
export enum EBlockPackageSource {
  Community = '1',
  Private = '2'
}
export const BlockPackageSourceDict: IDict[] = [
  {
    value: EBlockPackageSource.Community,
    label: '社区',
  },
  {
    value: EBlockPackageSource.Private,
    label: '私有',
  },
];

/**
 * 区块包端类型
 */
export enum EBlockPackageEndType {
  PC = 'pc',
  MOBILE = 'mobile'
}
export const BlockPackageEndType: IDict[] = [
  {
    value: EBlockPackageEndType.PC,
    label: 'PC端',
  },
  {
    value: EBlockPackageEndType.MOBILE,
    label: '移动端',
  },
];

/**
 * 区块包组件类型
 */
export enum EBlockPackageAssemblyType {
  MODULE = '1',
  BLOCK = '2'
}
export const BlockPackageAssemblyType: IDict[] = [
  {
    value: EBlockPackageAssemblyType.MODULE,
    label: '模块',
  },
  {
    value: EBlockPackageAssemblyType.BLOCK,
    label: '区块',
  },
];
