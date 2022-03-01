import api from '@/util/axios'

/**
 * 获取标的交易方式
 */ 
export const getTransactionType = () => {
  return api.request({
    method: 'get',
    url: '/api/plowTarget/getTransactionType'
  })
}
/**
 * 获取标的交易类型
 */ 
export const getBusinessType = () => {
  return api.request({
    method: 'get',
    url: '/api/plowTarget/getBusinessType'
  })
}
