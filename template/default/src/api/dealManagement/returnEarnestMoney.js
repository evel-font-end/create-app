import api from '@/util/axios'
/**
 * 根据查询条件获取保证金退还列表
 */ 
export const getListByCondition = (data) => {
  return api.request({
    method: 'post',
    url: '/api/earnestMoney/getRefundListByCondition',
    data
  })
}
/**
 * 获取保证金信息
 */ 
 export const getEarnestMoneyList = (data) => {
  return api.request({
    method: 'post',
    url: '/api/earnestMoney/getEarnestMoneyList',
    data
  })
}

/**
 * 获取保证金信息
 */ 
 export const applyRefund = (accountBillId) => {
  return api.request({
    method: 'post',
    url: `/api/earnestMoney/applyRefund?accountBillId=${accountBillId}`
  })
}

/**
 * 获取缴纳详情
 */ 
 export const getDetail = (targetId) => {
  return api.request({
    method: 'get',
    url: `/api/earnestMoney/getDetail/${targetId}`
  })
}

/**
 * 下载
 */ 
 export const exportDetail = (targetId) => {
  return api.request({
    method: 'get',
    url: `/api/earnestMoney/exportDetail/${targetId}`
  })
}