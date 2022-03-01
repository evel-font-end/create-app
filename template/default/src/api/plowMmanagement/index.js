import api from 'util/axios'

/** 委托人列表 */
export const getTrustList = (data) => {
  return api.request({
    method: 'post',
    url: '/api/plowTarget/trustList',
    data
  })
}

/** 修改/保存委托人 */
export const saveTrust = (data) => {
  return api.request({
    method: 'post',
    url: '/api/plowTarget/saveTrust',
    data
  })
}

/** 修改/保存委托人 */
export const getTrustDel = (trustId) => {
  return api.request({
    method: 'get',
    url: `/api/plowTarget/getTrust/${trustId}`
  })
}

/** 批量删除委托人 */
export const deletePlowTargets = (data) => {
  return api.request({
    method: 'post',
    url: `/api/plowTarget/deleteTrustByIds`,
    data
  })
}
