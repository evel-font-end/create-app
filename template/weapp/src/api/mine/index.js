// 我的 api
import { request } from "../../utils/service";
const api = {
  // 个人信息
  iffLwdw: (userCode) => `/api/iff/lwdw/user/${userCode}`,
  // 注销登录
  logout: () => "/jeecg-boot/sys/pm/logOut",
  // 注销登录
  changepwd: () => "/jeecg-boot/sys/pm/updatePassword",
  // 获取账号信息
  userInfo: (userCode) => `/api/base/user/get/${userCode}`,
};

const iffLwdw = (params = {}) =>
  request(api.iffLwdw(params.userCode), {}, "get");
const securityLogout = (params = {}) => request(api.logout(), params, "get");
const changepwd = (params = {}) => request(api.changepwd(), params, "get");
const getUserInfo = (params = {}) =>
  request(api.userInfo(params.userCode), {}, "get");
export { iffLwdw, securityLogout, changepwd, getUserInfo };
