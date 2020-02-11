/**
 * 区块卡片信息
 */
export interface IBlockItem {
  // 接口返回
  key: string;
  name: string;
  gitUrl: string;
  previewImg?: string;
  previewUrl?: string;
  description?: string;
  tags?: string[]

  // 自定义状态
  hover: boolean;
}
