
import api from '@/util/axios'
/**
 * 获取标的交易方式
 */ 
export const getTransactionType = () => {
  return api.request({
    method: 'get',
    url: '/api/transTarget/getTransactionType'
  })
}
/**
 * 获取所有矿业交易类型
 */
export const getMineBusinessType = () => {
  return api.request({
      method: 'get',
      url: '/api/transMineTarget/getMineBusinessType',
  })
}