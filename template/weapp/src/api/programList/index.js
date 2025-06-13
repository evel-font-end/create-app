// 登录页面 api
import { request } from "../../utils/service";
const api = {
  // 2、查询项目列表
  queryProjectList: () => "/jeecg-boot/sys/pm/queryProjectList",
  queryItems: () => "/jeecg-boot/sys/pm/queryItems",
  addItem: () => "/jeecg-boot/sys/pm/addItem",
  addProgram: () => "/jeecg-boot/sys/pm/addProject",
  addItemSpecific: () => "/jeecg-boot/sys/pm/addItemSpecific",
};

const queryProjectList = (params = {}) =>
  request(api.queryProjectList(), params, "post");

const queryItems = (params = {}) => request(api.queryItems(), params, "get");
const addItem = (params = {}) =>
  request(api.addItem(), params, "post", {
    paramsNoChange: true,
  });

const addProgram = (params = {}) => request(api.addProgram(), params, "post");
const addItemSpecific = (params = {}) =>
  request(api.addItemSpecific(), params, "post");

export { queryProjectList, queryItems, addItem, addProgram, addItemSpecific };
