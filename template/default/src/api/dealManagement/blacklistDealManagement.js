import api from '@/util/axios'
/** 
 * 获取列表
 */
export const getListInfoList = ({ data, pageNo, pageSize, sorting }) => {
  const fromData = {
    data: {...data }, // 查询信息
    pageNo, // 查询的分页页码。默认值为1 ,
    pageSize, // 查询的分页页大小。默认值为10
    sorting // 排序
  }
  return api.request({
    method: 'post',
    url: '/api/deal_management/blacklist_deal_management/getInfo',
    data: fromData
  })
}

/**
 * 获取所有交易类型 
 */
export const getBusinessType = () => {
  return api.request({
      method: 'get',
      url: '/api/common/getBusinessType',
  })
}
/**
 * 新增
 */
export const toBlacklistAdd = (data) => {
  return api.request({
    method: 'post',
    url: '/api/deal_management/blacklist_deal_management/add',
    data:data
  })
}
/**
 * 编辑
 */
export const toBlacklistEdit = (data) => {
  return api.request({
    method: 'post',
    url: '/api/deal_management/blacklist_deal_management/edit',
    data:data
  })
}
/**
 * 删除
 */
export const toBlacklistDelete = (data) => {
  return api.request({
    method: 'post',
    url: '/api/deal_management/blacklist_deal_management/delete',
    data:data
  })
}

/**
 * 获取所有用户信息
 */
export const getUserList = () => {
  return api.request({
    method: 'get',
    url: '/api/adminUser/getUserList',
  })
}
