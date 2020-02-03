import {IDict} from "@/dicts/index";

// 组织机构类型
export enum EOrgType {
  ORG = '0',
  DEPT = '1'
}
export const OrgTypeDict: IDict[] = [
  {
    value: EOrgType.ORG,
    label: '组织',
  },
  {
    value: EOrgType.DEPT,
    label: '部门',
  }
];
