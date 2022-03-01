import api from '@/util/axios'

/** 获取审批业务类型信息 */
export const getApproveLinkedBusinessType = () => {
  return api.request({
    method: 'get',
    url: '/api/approveLinkedConfig/getApproveLinkedBusinessType'
  })
}

/** 审批链配置列表 */
export const getApproveList = (data) => {
  return api.request({
    method: 'post',
    url: '/api/approveLinkedConfig/list',
    data
  })
}

/**  保存/修改审批链配置 */
export const saveApproveLinkedConfig = (data) => {
  return api.request({
    method: 'post',
    url: '/api/approveLinkedConfig/saveApproveLinkedConfig',
    data
  })
}

/**  获取审批配置详情 */
export const getApproveLinkedConfig = (id) => {
  return api.request({
    method: 'get',
    url: '/api/approveLinkedConfig/' + id
  })
}

/**  获取审批流程对应的审批节点列表 */
export const getApproveNode = (data) => {
  return api.request({
    method: 'post',
    url: '/api/approveNode/list',
    data
  })
}

/**  删除节点 */
export const delApproveNode = (data) => {
  return api.request({
    method: 'get',
    url: `/api/approveNode/${data.configId}/${data.nodeId}`
  })
}

/**  获取所有用户信息 */
export const getUserList = (data) => {
  return api.request({
    method: 'post',
    url: '/api/adminUser/getUserListByCondition',
    data
  })
}

/**  保存/修改审批链配置 */
export const saveApproveNode = (data) => {
  return api.request({
    method: 'post',
    url: '/api/approveNode/saveApproveNode',
    data
  })
}

/**  启用/禁用 */
export const modifyApproveLinkedConfig = (data) => {
  return api.request({
    method: 'post',
    url: '/api/approveLinkedConfig/modifyApproveLinkedConfig',
    data
  })
}

/** 获取审批节点详情 */
export const getApproveNodeDetail = (id) => {
  return api.request({
    method: 'get',
    url: '/api/approveNode/' + id
  })
}

