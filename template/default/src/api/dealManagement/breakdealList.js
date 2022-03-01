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
 * 获取标的交易类型
 */ 
export const getBusinessType = () => {
  return api.request({
    method: 'get',
    url: '/api/transTarget/getBusinessType'
  })
}
/**
 * 获取标的状态
 */
export const getTargetStatus = () => {
  return api.request({
    method: 'get',
    url: '/api/transTarget/getCandBreakTargetStatus'
  })
}
/**
 * 获取区域
 */
export const getSelectListByParentCode = () => {
  return api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=4635'
  })
}
/** 
 * 获取土地终止交易列表
 */
export const getBreakTargetList = ({ data, pageNo, pageSize, sorting }) => {
  const fromData = {
    data: {...data }, // 查询信息
    pageNo, // 查询的分页页码。默认值为1 ,
    pageSize, // 查询的分页页大小。默认值为10
    sorting // 排序
  }
  return api.request({
    method: 'post',
    url: '/api/trade/breakTargetList',
    data: fromData
  })
}
 
/**
 * 暂停交易 
 */
export const getTargetSuspend = (data) => {
  return api.request({
      method: 'post',
      url: '/api/trade/targetSuspend',
      data
  })
}
/**
 * 终止交易 
 */
export const getTargetStop = (data) => {
  return api.request({
      method: 'post',
      url: '/api/trade/targetStop',
      data
  })
}
/**
 * 重启交易 
 */
export const getRestartTrade = ({ command }) => {
  return api.request({
      method: 'post',
      url: '/api/trade/restartTrade',
      data:command
  })
}