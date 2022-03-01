import api from '@/util/axios'
/** 标的列表 */
export const getTransTargetList = ({ data, pageNo, pageSize, sorting }) => {
  const fromData = {
    data: {...data }, // 查询角色信息
    pageNo, // 查询的分页页码。默认值为1 ,
    pageSize, // 查询的分页页大小。默认值为10
    sorting // 排序
  }
  return api.request({
    method: 'post',
    url: '/api/transTarget/list',
    data: fromData
  })
}
// 批量删除标的
export const delTransByIds = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transTarget/deleteByIds',
    data: data
  })
}
// 查询标的详情
export const getTransTargetInfo = (targetId) => {
  return api.request({
    method: 'get',
    url: '/api/transTarget/' + targetId
  })
}
// 查询公告详情
export const getNoticeDtlByTargetId = (targetId) => {
  return api.request({
    method: 'get',
    url: '/api/transNotice/getNoticeDtlByTargetId?targetId=' + targetId
  })
}
// 获取土地业务类型
export const getBusinessType = () => {
  return api.request({
    method: 'get',
    url: '/api/transTarget/getBusinessType'
  })
}

// 获取交易类型
export const getTransactionType = () => {
  return api.request({
    method: 'get',
    url: '/api/transTarget/getTransactionType'
  })
}

// 获取标的状态
export const getTargetStatus = () => {
  return api.request({
    method: 'get',
    url: '/api/transTarget/getTargetStatus'
  })
}
// 初始化标的附件信息
export const getInitTargetAttach = () => {
  return api.request({
    method: 'get',
    url: '/api/transTarget/initTargetAttach'
  })
}
// 查询土地标的附件目录信息
export const getLandTargetAttach = (id) => {
  return api.request({
    method: 'get',
    url: '/api/transTarget/landTargetAttach?targetId=' + id
  })
}

// 查询未绑定标的的土地交易物
export const getunBindList = ({ data, pageNo, pageSize, sorting }) => {
  const fromData = {
    data: {...data }, // 查询角色信息
    pageNo, // 查询的分页页码。默认值为1 ,
    pageSize, // 查询的分页页大小。默认值为10
    sorting // 排序
  }
  return api.request({
    method: 'post',
    url: '/api/transGoods/unBindList',
    data: fromData
  })
}

// 修改/保存标的
export const saveTransTarget = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transTarget/saveTransTarget',
    data: data
  })
}
