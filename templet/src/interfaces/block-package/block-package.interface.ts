import {EBlockPackageFetchStatus} from "@/enums/block-package.enum";
import {IBlockItem} from "@/interfaces/block/block.interface";
import {EPlatform} from "@/enums/platform.enum";

/**
 * 区块包接口数据
 */
export interface IBlockPackage {
  // 接口信息
  id: string;
  applyType: string;
  chineseName: string;
  englishName: string;
  storeAddress: string;
  currentVersion?: string;
  isRegisted?: number;
  packageManager?: string;
  platformVersion?: string;

  // 自定义信息
  // 区块包信息
  packageInfo: IBlockPackageInfo;
  // 抓取数据状态
  packageInfoFetchStatus: EBlockPackageFetchStatus;
}

/**
 * 区块包信息
 */
export interface IBlockPackageInfo {
  // 保存在数据库中的信息
  _id?: string;
  // 英文名称
  blockPackageName: string,
  // 中文名称
  blockPackageChineseName: string;
  // 类型
  blockPackageType: EPlatform,
  // git地址
  blockPackageGitUrl: string,
  // 封面
  blockPackageCover: string;
  // 备注
  blockPackageRemark: string;
  category: {
    blocks: string[],
    templates: string[]
  }
  blocks: IBlockItem[],
  templates: IBlockItem[]
}
