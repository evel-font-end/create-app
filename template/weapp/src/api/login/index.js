// 登录页面 api
import { request } from "../../utils/service";
const api = {
  // 登录接口
  login: () => "/jeecg-boot/sys/pm/login",
  // 获取用户信息 （暂时没用）
  userinfo: () => "/api/auth/auth/security/login",
  // 微信小程序一键登录（通过 unionId 方式获取绑定的用户信息）
  // 1、小程序调用 wx.login()获取code
  // 2、调用本接口传递 code，获取返回的用户信息（与账号密码登录方式一致）。
  // 前置条件必须要在云平台执行绑定微信公众号的操作。
  wxMiniAppLoginByUnionId: (code) =>
    `/api/iff/security/wxMiniAppLoginByUnionId/${code}`,
};

const userLogin = (params = {}) => request(api.login(), params, "get");
const userinfo = (params = {}) => request(api.userinfo(), params, "post");
const wxMiniAppLoginByUnionId = (params = {}) =>
  request(api.wxMiniAppLoginByUnionId(params.code), {}, "post");

export { userLogin, userinfo, wxMiniAppLoginByUnionId };
