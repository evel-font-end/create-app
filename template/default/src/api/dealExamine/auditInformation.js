import api from 'util/axios'

/** 得到当前用户的审批单据列表 */
export const getApproveRecordList = (data) => {
  return api.request({
    method: 'post',
    url: '/api/approveRecord/list',
    data
  })
}
/** 获取审批业务类型数据 */
export const getApproveLinkedBusinessType = () => {
  return api.request({
    method: 'get',
    url: '/api/approveLinkedConfig/getApproveLinkedBusinessType'
  })
}
/** 获取审批状态 */
export const getApproveStatus = () => {
  return api.request({
    method: 'get',
    url: '/api/approveRecord/getApproveStatus'
  })
}
/** 获取审批配置详情 */
export const getApproveInfo = (Id) => {
  return api.request({
    method: 'get',
    url: `/api/approveLinkedConfig/${Id}`
  })
}

/** 单据审批打回 */
export const dealApproveBack = (data) => {
  return api.request({
    method: 'post',
    url: '/api/approveRecord/approveBack',
    data
  })
}

/** 单据审批通过 */
export const dealApprovePass = (data) => {
  return api.request({
    method: 'post',
    url: '/api/approveRecord/approvePass',
    data
  })
}

/** 审批记录列表 */
export const getApproveHistory = (data) => {
  return api.request({
    method: 'post',
    url: '/api/approveHistory/list',
    data
  })
}
/** 标的审批记录列表 */
export const getListByTargetId = (data) => {
  return api.request({
    method: 'post',
    url: '/api/approveHistory/listByTargetId',
    data
  })
}
/** 公告审批记录列表 */
export const getListByNoticeId = (data) => {
  return api.request({
    method: 'post',
    url: '/api/approveHistory/listByNoticeId',
    data
  })
}
/** 节点状态 */
export const getNodeList = (id) => {
  return api.request({
    method: 'get',
    url: '/api/approveHistory/nodeList/' + id
  })
}
/** 标的节点状态 */
export const getNodeListBytargetId = (id) => {
  return api.request({
    method: 'get',
    url: '/api/approveHistory/nodeListBytargetId/' + id
  })
}
/** 公告节点状态 */
export const getNodeListByNoticeId = (id) => {
  return api.request({
    method: 'get',
    url: '/api/approveHistory/nodeListByNoticeId/' + id
  })
}
/** 查询标的价格限定详情 */
export const getTransTargetPriceDtl = (id) => {
  return api.request({
    method: 'get',
    url: '/api/transTarget/getTransTargetPriceDtl/' + id
  })
}
/** 当前用户的审批单据详情 */
export const approveRecord = (data) => {
  return api.request({
    method: 'post',
    url: '/api/approveRecord/detail',
    data
  })
}

/** 用licenceId获取审批记录列表 */
export const listApproveByLicenceId = (data) => {
  return api.request({
    method: 'post',
    url: '/api/approveHistory/listApproveByLicenceId',
    data
  })
}


/** 用licenceId获取节点状态 */
export const nodeListByLicenceId = (id) => {
  return api.request({
    method: 'get',
    url: '/api/approveHistory/nodeListByLicenceId/' + id
  })
}
