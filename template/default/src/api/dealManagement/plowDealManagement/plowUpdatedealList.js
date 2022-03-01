import api from "@/util/axios";
/**
 * 获取成交审核列表
 */
export const getCheckPlowTargetList = ({ data, pageNo, pageSize, sorting }) => {
  const fromData = {
    data: { ...data }, // 查询信息
    pageNo, // 查询的分页页码。默认值为1 ,
    pageSize, // 查询的分页页大小。默认值为10
    sorting // 排序
  };
  return api.request({
    method: "post",
    url: "/api/trade/checkPlowTargetList",
    data: fromData
  });
};
/**
 * 查询土地标的附件目录信息
 */
export const getLandTargetAttach = id => {
  return api.request({
    method: "get",
    url: "/api/transTarget/landTargetAttach?targetId=" + id
  });
};
/**
 * 摇号竞得
 */
export const getSubmitDetermine = (params) => {
  return api.request({
    method: "post",
    url: "/api/trade/submitDetermine",
    data: params
  });
};

/**
 * 查询标的详情
 *  */ 
export const getTransTargetInfo = (id) => {
  return api.request({
    method: 'get',
    url: '/api/plowTarget/' + id
  })
}
/**
 * 获取申请标的交易记录详情
 *  */ 
export const getBidderTradeTargetDtl = (licenseId) => {
  return api.request({
    method: 'get',
    url: '/api/trade/getTradeTargetDtl?licenseId=' + licenseId
  })
}

/**
 * 查询竞买申请相关的附件
 *  */ 
export const getLicenseAttach = (licenseId) => {
  return api.request({
    method: 'get',
    url: '/api/transLicense/licenseAttach?licenseId=' + licenseId
  })
}
