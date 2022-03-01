import api from 'util/axios'

/** 审批记录列表 */
export const getBeenlist = (data) => {
  return api.request({
    method: 'post',
    url: '/api/approveRecord/beenList',
    data
  })
}