import api from '@/util/axios'
import qs from 'querystring'


const formDataHeader = { 'content-type': 'application/x-www-form-urlencoded' }

export const landTradeList = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transGoods/list',
    data
  })
}


export const landTradeConfig = (id) => {
  return api.request({
    method: 'get',
    url: '/api/transGoods/' + id
  })
}

/** 附件列表 */
export const landTradeAttachList = (params) => {
  return api.request({
    method: 'get',
    url: '/api/transGoods/transGoodsAttach',
    params
  })
}

/** 保存土地交易物 */
export const saveLandTrade = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transGoods/saveTransGoods',
    data
  })
}

/** 批量删除土地交易物 */
export const deleteGoods = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transGoods/deleteByIds',
    data
  })
}
