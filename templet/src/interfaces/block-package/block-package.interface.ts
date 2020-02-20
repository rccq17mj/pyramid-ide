import {EBlockPackageFetchStatus} from "@/enums/block-package.enum";
import {IBlockItem} from "@/interfaces/block/block.interface";
import {EPlatform} from "@/enums/platform.enum";

/**
 * 区块包接口数据
 */
export interface IBlockPackage {
  // 接口信息
  applyType: string;
  chineseName: string;
  currentVersion: string;
  englishName: string;
  id: string;
  isRegisted: number;
  packageManager: string;
  platformVersion: string;
  storeAddress: string;

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
  blockPackageName: string,
  blockPackageType: EPlatform,
  blockPackageGitUrl: string,
  category: {
    blocks: string[],
    templates: string[]
  }
  blocks: IBlockItem[],
  templates: IBlockItem[]
}
