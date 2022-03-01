import api from '@/util/axios'

// 查询委托列表
export const getList = (data) => {
  return api.request({
    method: 'post',
    url: '/api/mineDeleg/list',
    data: data
  })
}


// 申请委托
export const applyTrust = (data) => {
  return api.request({
    method: 'post',
    url: '/api/mineDeleg/applyTrust',
    data: data
  })
}


// 受理预受理信息
export const commitTrust = (targetId) => {
  return api.request({
    method: 'get',
    url: `/api/mineDeleg/commitTrust/${targetId}`,
  })
}

// 查看委托详情
export const detail = (targetId) => {
  return api.request({
    method: 'get',
    url: `/api/mineDeleg/detail/${targetId}`
  })
}

// 提交预受理信息
export const pushTrust = (data) => {
  return api.request({
    method: 'post',
    url: `/api/mineDeleg/pushTrust`,
    data
  })
}
