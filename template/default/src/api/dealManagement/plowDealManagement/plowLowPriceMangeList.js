import api from "@/util/axios";
/**
 * 获取底价列表
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
    url: "/api/PriceChangeLog/lowlist",
    data: fromData
  });
};
/**
 * 获取标的交易方式
 */

export const getTransactionType = () => {
  return api.request({
    method: "get",
    url: "/api/transTarget/getTransactionType"
  });
};
/**
 * 获取标的交易类型
 */

export const getBusinessType = () => {
  return api.request({
    method: "get",
    url: "/api/transTarget/getBusinessType"
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
 * 获取底价审核历史列表
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
    url: "/api/PriceChangeLog/lowerHistoryList",
    data: fromData
  });
};