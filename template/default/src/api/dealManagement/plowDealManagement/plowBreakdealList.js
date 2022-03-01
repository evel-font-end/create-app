import api from '@/util/axios'
/**
 * 获取标的状态
 */
export const getTargetStatus = () => {
  return api.request({
    method: 'get',
    url: '/api/plowTarget/getTrustStatus'
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
 * 获取耕地终止交易列表
 */
export const getBreakPlowTargetList = ({ data, pageNo, pageSize, sorting }) => {
  const fromData = {
    data: {...data }, // 查询信息
    pageNo, // 查询的分页页码。默认值为1 ,
    pageSize, // 查询的分页页大小。默认值为10
    sorting // 排序
  }
  return api.request({
    method: 'post',
    url: '/api/trade/breakPlowTargetList',
    data: fromData
  })
}

// 查询标的详情
export const getTransTargetInfo = (targetId) => {
  return api.request({
    method: 'get',
    url: '/api/plowTarget/' + targetId
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