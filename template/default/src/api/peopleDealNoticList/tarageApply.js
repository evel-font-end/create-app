import api from 'util/axios'

// /** 获取可以竞买申请的标的 */
// export const getAllowApplyTarget = (data) => {
//   return api.request({
//     method: 'post',
//     url: '/bidder/api/transLicense/getAllowApplyTarget',
//     data
//   })
// }
/** 交易中标的 */
export const getRuningTarget = (data) => {
  return api.request({
    method: 'post',
    url: '/api/trade/runingTarget',
    data
  })
}

/** 标的竞拍申请 */
export const applyTarget = (data) => {
  return api.request({
    method: 'post',
    url: '/bidder/api/transLicense/applyTarget',
    data
  })
}

/** 获取银行信息 */
export const accountBynoticeid = (id) => {
  return api.request({
    method: 'get',
    url: '/api/transAccount/accountBynoticeid/' + id
  })
}

/** 获取联合竞买人信息 */
export const getUnionBidderList = (id) => {
  return api.request({
    method: 'post',
    url: '/bidder/api/bidder/getUnionBidderList' + id
  })
}
