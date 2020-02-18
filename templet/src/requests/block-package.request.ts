import {BaseRequest} from "@/requests/base.request";
import {API_CONFIG} from "@/core/configs/api.config";
import {HTTP_CONTENT_TYPE} from "@/core/configs/http.config";
import {IBlockPackage} from "@/interfaces/block-package/block-package.interface";

class BlockPackageRequest extends BaseRequest {
  blockPackageGet(params: any): Promise<boolean> {
    return this.add(API_CONFIG.MAIN.BLOCK_PACKAGE.GET, params);
  }

  blockPackageAdd(params: any): Promise<boolean> {
    return this.add(API_CONFIG.MAIN.BLOCK_PACKAGE.ADD, params,{ ...{options: HTTP_CONTENT_TYPE.JSON}});
  }

  blockPackageListPage(params: any): Promise<{total: number, list: any[]}> {
/*    return httpService.request('POST', API_CONFIG.MAIN.BLOCK_PACKAGE.LIST_PAGE, params).then(res => {
      return res.flag ? res.data['data'] : null
    });*/
    return this.list(API_CONFIG.MAIN.BLOCK_PACKAGE.LIST_PAGE, params);
  }

  blockPackageSubscribePage(params: any): Promise<{total: number, list: IBlockPackage[]}> {
    // TODO 这里接口有问题，有数据就是 list,没有数据就是rows
    return this.object(API_CONFIG.MAIN.BLOCK_PACKAGE.SUBSCRIBE_PAGE, params);
  }

  blockPackageDetail(blockId: number): Promise<any> {
    return this.object(API_CONFIG.MAIN.BLOCK_PACKAGE.DETAIL, {blockId});
  }

  blockPackageDelete(blockId: number): Promise<boolean> {
    return this.delete(API_CONFIG.MAIN.BLOCK_PACKAGE.DELETE, {blockId});
  }

  blockUnsubscribe(params: object): Promise<boolean> {
    return this.delete(API_CONFIG.MAIN.BLOCK_PACKAGE.UNSUBSCRIBE, params, { ...{options: HTTP_CONTENT_TYPE.JSON}});
  }

  blockPackageSubmitVersion(params: any): Promise<boolean> {
    return this.add(API_CONFIG.MAIN.BLOCK_PACKAGE.SUBMIT_VERSION, params);
  }

  blockPackageUpdateHistoryListPage(params: any): Promise<boolean> {
    return this.add(API_CONFIG.MAIN.BLOCK_PACKAGE.UPDATE_HISTORY_LIST_PAGE, params);
  }
  blockPackageSubscribe(params: any): Promise<boolean> {
/*    const formData = new FormData();
    Object.keys(params).forEach((key) => {
        formData.append(key, params[key]);
    });*/
    return this.add(API_CONFIG.MAIN.BLOCK_PACKAGE.UPDATE_HISTORY_SUBSCRIBE, params,  { ...{options: HTTP_CONTENT_TYPE.JSON}});
  }
}

export const blockPackageRequest = new BlockPackageRequest();
