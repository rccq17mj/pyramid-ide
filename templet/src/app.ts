import {APP_CONFIG} from "@/core/configs/app.config";
import {congoService} from "@/core/services/congo.service";
import {addHttpRequestInterceptors, addHttpResponseInterceptors} from "@/core/services/http.service";
import {pyramidUiService} from "@/core/pyramid-ui/service/pyramid-ui.service";

// 一、自定义HTTP拦截器，可以定义多个（注意：后面定义的先执行，前面定义的后执行）
addHttpRequestInterceptors();
addHttpResponseInterceptors();

export function render(oldRender: any) {
  pyramidUiService.start();

  if (APP_CONFIG.ACCESS_CONGO) {
    congoService.startup(oldRender);
    return;
  }
  oldRender();
}
