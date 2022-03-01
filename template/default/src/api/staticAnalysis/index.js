import api from 'util/axios'
// 统计分析

/** 用户统计 */
export const getUsersStatistics = (data) => {
  return api.request({
    method: 'post',
    url: '/api/statisticalAnalysis/getUsersStatistics',
    data
  })
}

/** 用户登录行为 */
export const getUsersLoginStatistics = (data) => {
  return api.request({
    method: 'post',
    url: '/api/statisticalAnalysis/getUsersLoginStatistics',
    data
  })
}

/** 资源统计 */
export const getResourceStatistics = (data) => {
  return api.request({
    method: 'post',
    url: '/api/statisticalAnalysis/getResourceStatistics',
    data
  })
}

/** 财务统计 */
export const getFinanceStatistics = (data) => {
  return api.request({
    method: 'post',
    url: '/api/statisticalAnalysis/getFinanceStatistics',
    data
  })
}


/** 竞买信息 */
export const getBuyStatistics = (data) => {
  return api.request({
    method: 'post',
    url: '/api/statisticalAnalysis/getBuyStatistics',
    data
  })
}

/** 文档管理 */
export const getFileManageStatistics = (data) => {
  return api.request({
    method: 'post',
    url: '/api/statisticalAnalysis/getFileManageStatistics',
    data
  })
}
