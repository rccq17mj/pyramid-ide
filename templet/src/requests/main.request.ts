import {BaseRequest} from "@/requests/base.request";
import {API_CONFIG} from "@/core/configs/api.config";
import {HTTP_CONTENT_TYPE} from "@/core/configs/http.config";

class MainRequest extends BaseRequest {
  uploadImg(params: any): Promise<boolean> {
    /*    const formData = new FormData();
        Object.keys(params).forEach((key) => {
            formData.append(key, params[key]);
        });*/
    return this.upload(API_CONFIG.MAIN.UPLOAD_IMG, params,  { ...{options: HTTP_CONTENT_TYPE.JSON}});
  }
}

export const mainRequest = new MainRequest();
