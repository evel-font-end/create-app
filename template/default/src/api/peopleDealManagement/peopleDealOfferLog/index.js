import api from '@/util/axios'

// 查询竞价记录
export const getBidderTradeTarget = (data) => {
  return api.request({
    method: 'post',
    url: '/api/trade/getTradeTarget',
    data
  })
}

// 获取竞买人允许进行出价的标的详情
export const getBidderTradeTargetDtl = (id) => {
  return api.request({
    method: 'get',
    url: '/api/trade/getTradeTargetDtl?targetId=' + id
  })
}

// 主页获取申请标的交易记录详情
export const getIndexBidderTradeTargetDtl = (id) => {
  return api.request({
    method: 'get',
    url: '/index/api/common/getBidderTradeTargetDtl?targetId=' + id
  })
}

// 获取竞价信息
export const getTradeInfo = (targetId) => {
  return api.request({
    method: 'get',
    url: '/api/trade/tradeInfo/' + targetId
  })
}

// 出价
export const savePrice = (data) => {
  return api.request({
    method: 'post',
    url: '/api/trade/savePrice',
    data
  })
}

// 同意摇号
export const agreeLottery = (data) => {
  return api.request({
    method: 'post',
    url: '/bidder/api/transLicense/agreeLottery',
    data
  })
}
