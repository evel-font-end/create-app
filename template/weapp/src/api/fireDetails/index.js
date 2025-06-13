// 火灾详情 api
import { request } from "../../utils/service";
const api = {
  // 用户处置的图片上传 要先调用一下初始化接口
  fileInitupload: () => "/api/V1/file/initupload",
};
const fileInitupload = (params = {}) =>
  request(api.fileInitupload(), params, "post");
export { fileInitupload };
