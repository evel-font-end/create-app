import api from "@/util/axios";
/**
 * 获取成交审核列表
 */
export const getCheckLandTargetList = ({ data, pageNo, pageSize, sorting }) => {
  const fromData = {
    data: { ...data }, // 查询信息
    pageNo, // 查询的分页页码。默认值为1 ,
    pageSize, // 查询的分页页大小。默认值为10
    sorting // 排序
  };
  return api.request({
    method: "post",
    url: "/api/trade/checkLandTargetList",
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
 * 确认成交
 */
export const getSubmitTrade = (params) => {
  return api.request({
    method: "post",
    url: "/api/trade/submitTrade",
    data: params
  });
};
/**
 * 取消成交
 */
export const getCancelTrade = (params) => {
  return api.request({
    method: "post",
    url: "/api/trade/cancelTrade",
    data: params
  });
};

/**
 * 查询标的详情
 *  */ 
export const getTransTargetInfo = (id) => {
  return api.request({
    method: 'get',
    url: '/api/transTarget/' + id
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
 * 查询竞买成交确认书申请相关的附件
 *  */ 
export const getDealConfirmBookAttach = (licenseId) => {
  return api.request({
    method: 'get',  
    url: `/api/transLicense/getDealConfirmBookAttach/${licenseId} `
  })
}

/**
 * 查询竞买成交通知书书申请相关的附件
 *  */ 
 export const getDealNoticeBookAttach = (licenseId) => {
  return api.request({
    method: 'get',  
    url: `/api/transLicense/getDealNoticeBookAttach/${licenseId} `
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

// 获取竞买用户的书
export const getTransBook = (id,bookNo) => {
  return api.request({
    method: 'get',
    url: '/api/transLicense/getTransBook?licenseId=' + id + '&bookNo=' + bookNo
  })
}
// 获取下载文件码
export const downloadFileCode = (id,bookNo) => {
  return api.request({
    method: 'get',
    url: '/api/approveRecord/downloadFileCode'
  })
}

/**
 * 已办数据列表
 */
 export const uploadDoc = (data, targetId, licenceId) => {
  return api.request({
    method: "post",
    url: `/api/approveRecord/uploadDoc?targetId=${targetId}&licenceId=${licenceId}`,
    headers: { 'content-type': 'multipart/form-data' },
    data: data
  });
};

