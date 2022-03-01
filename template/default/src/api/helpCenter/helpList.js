import api from '@/util/axios'
/** 
 * 获取帮助中心列表
 */
export const getTransHelpList = ({ data, pageNo, pageSize, sorting }) => {
  const fromData = {
    data: {...data }, // 查询信息
    pageNo, // 查询的分页页码。默认值为1 ,
    pageSize, // 查询的分页页大小。默认值为10
    sorting // 排序
  }
  return api.request({
    method: 'post',
    url: '/api/transHelp/list',
    data: fromData
  })
}
/**
 * 获取资料类型
 */ 
export const getHelpType = () => {
  return api.request({
    method: 'post',
    url: '/api/transHelp/getHelpType'
  })
}
/**
 * 新增 
 */
export const getAddTransHelp = (data) => {
  return api.request({
      method: 'post',
      url: '/api/transHelp/addTransHelp',
      data: data
  })
}
/**
 * 修改 
 */
export const getUpdateTransHelp = (data) => {
  return api.request({
      method: 'post',
      url: '/api/transHelp/updateTransHelp',
      data: data
  })
}

/**
 * 删除 
 */
export const getDeleteTransHelp = (data) => {
  return api.request({
      method: 'post',
      url: '/api/transHelp/deleteTransHelp',
      data: data
  })
}
/** 初始化帮助附件信息 */
export const initHelpAttach = () => {
  return api.request({
    method: 'get',
    url: '/api/transHelp/initHelpAttach'
  })
}

// 查询附件目录信息
export const transHelpAttach = (id) => {
  return api.request({
    method: 'get',
    url: '/api/transHelp/transHelpAttach?helpId=' + id
  })
}