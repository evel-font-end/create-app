import api from "@/util/axios";
/**
 * 获取限价列表
 */
export const getPriceChangeLogList = ({ data, pageNo, pageSize, sorting }) => {
  const fromData = {
    data: { ...data }, // 查询信息
    pageNo, // 查询的分页页码。默认值为1 ,
    pageSize, // 查询的分页页大小。默认值为10
    sorting // 排序
  };
  return api.request({
    method: "post",
    url: "/api/PriceChangeLog/list",
    data: fromData
  });
};
/**
 * 编辑
 */
export const savePriceChangeLog = fromData => {
  return api.request({
    method: "post",
    url: "/api/PriceChangeLog/savePriceChangeLog",
    data: fromData
  });
};

/**
 * 获取限价审核历史列表
 */
export const getHistoryList = ({ data, pageNo, pageSize, sorting }) => {
  const fromData = {
    data: { ...data }, // 查询信息
    pageNo, // 查询的分页页码。默认值为1 ,
    pageSize, // 查询的分页页大小。默认值为10
    sorting // 排序
  };
  return api.request({
    method: "post",
    url: "/api/PriceChangeLog/historyList",
    data: fromData
  });
};