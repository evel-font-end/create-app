import api from '@/util/axios'

/** 交易物列表 */
export const getTradeList = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transMineGoods/list',
    data
  })
}

/** 查询探矿详情 */
export const MineProspecting = (id) => {
  return api.request({
    method: 'get',
    url: '/api/transMineGoods/MineProspecting/' + id
  })
}

/** 查询采矿详情 */
export const getTransMineGoods = (id) => {
  return api.request({
    method: 'get',
    url: '/api/transMineGoods/' + id
  })
}

/** 新增/修改采矿 */
export const saveTransMine = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transMineGoods/saveTransMine',
    data
  })
}

/** 新增/修改探矿 */
export const saveTransMineProspecting = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transMineGoods/saveTransMineProspecting',
    data
  })
}

/** 删除ids */
export const deleteByIds = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transMineGoods/deleteByIds',
    data
  })
}
