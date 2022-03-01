import api from 'util/axios'

/** 标的列表 */
export const getPlowNotice = (data) => {
  return api.request({
    method: 'post',
    url: '/api/plowNotice/list',
    data
  })
}

/** 删除标的 */
export const deletePlowNotice = (noticeId) => {
  return api.request({
    method: 'get',
    url: `/api/plowNotice/deletePlowNotice?noticeId=${noticeId}`
  })
}

/** 获取公告详情 */
export const getPlowNoticeDtl = (noticeId) => {
  return api.request({
    method: 'get',
    url: `/api/plowNotice/getTransNoticeDtl?noticeId=${noticeId}`
  })
}

/** 发布公告 */
export const publishPlowNotice = (id) => {
  return api.request({
    method: 'post',
    url: `/api/plowNotice/publishPlowNotice?noticeId=` + id
  })
}

/** 提交公告 */
export const submitTransNotice = (id) => {
  return api.request({
    method: 'get',
    url: `/api/plowNotice/submitTransNotice?noticeId=${id}`
  })
}

/**  新增/修改公告 */
export const savePlowNotice = (data) => {
  return api.request({
    method: 'post',
    url: `/api/plowNotice/savePlowNotice`,
    data
  })
}

/**  初始化公告附件信息 */
export const initNoticeAttach = (data) => {
  return api.request({
    method: 'get',
    url: `/api/plowNotice/initNoticeAttach`
  })
}

/**  查询公告附件目录信息 */
export const getNoticeAttach = (noticeId) => {
  return api.request({
    method: 'get',
    url: `/api/plowNotice/noticeAttach?noticeId=${noticeId}`
  })
}

/**  获取公告状态 */
export const getTransNoticeStatus = (data) => {
  return api.request({
    method: 'get',
    url: `/api/plowNotice/getTransNoticeStatus`
  })
}

/** 查询未绑定标的 */
export const getUnBindList = (data) => {
  return api.request({
    method: 'post',
    url: '/api/plowTarget/unBindlist',
    data
  })
}
