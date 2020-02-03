/**
 * 区块卡片信息
 */
export interface IBlockCard {
  key: string;
  name: string;
  gitUrl: string;
  previewImg?: string;
  previewUrl?: string;
  description?: string;
  hover: boolean;
}
