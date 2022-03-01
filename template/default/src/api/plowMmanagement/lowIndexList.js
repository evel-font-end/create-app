import api from 'util/axios'

/** 标的列表 */
export const getPlowTarget = (data) => {
  return api.request({
    method: 'post',
    url: '/api/plowTarget/list',
    data
  })
}
/** 删除标的 */
export const deletePlowTarget = (targetId) => {
  return api.request({
    method: 'get',
    url: `/api/plowTarget/del/${targetId}`
  })
}

/** 获取耕指交易方式 */
export const getPlowBusinessType = () => {
  return api.request({
    method: 'get',
    url: '/api/plowTarget/getBusinessType'
  })
}

/** 获取交易类型 */
export const getPlowTransactionType = () => {
  return api.request({
    method: 'get',
    url: '/api/plowTarget/getTransactionType'
  })
}

/** 获取状态 */
export const getPlowTrustStatus = () => {
  return api.request({
    method: 'get',
    url: '/api/plowTarget/getTrustStatus'
  })
}

/** 查询标的详情 */
export const getPlowTargetDel = (targetId) => {
  return api.request({
    method: 'get',
    url: `/api/plowTarget/${targetId}`
  })
}

/** 修改/保存标的 */
export const savePlowTarget = (data) => {
  return api.request({
    method: 'post',
    url: `/api/plowTarget/savePlowTarget`,
    data
  })
}
