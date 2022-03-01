import api from '@/util/axios'
/**
 * 获取标的状态
 */
export const getTargetStatus = () => {
  return api.request({
    method: 'get',
    url: '/api/transTarget/getTargetStatus'
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
 * 获取矿产终止交易列表
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
    url: '/api/trade/breakMineTargetList',
    data: fromData
  })
}
