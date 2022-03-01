import api from '@/util/axios';

/** 标的列表 */
export const getTransNoticeList = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transNotice/list',
    data
  })
}

/** 初始化公告附件信息 */
export const initNoticeAttach = () => {
  return api.request({
    method: 'get',
    url: '/api/transNotice/initNoticeAttach'
  })
}

/** 获取公告详情 */
export const getTransNoticeDtl = (id) => {
  return api.request({
    method: 'get',
    url: '/api/transNotice/getTransNoticeDtl?noticeId=' + id
  })
}

/** 查询公告附件目录信息 */
export const getLandNoticeAttach = (id) => {
  return api.request({
    method: 'get',
    url: '/api/transNotice/noticeAttach?noticeId=' + id
  })
}

/** 删除标的 */
export const deleteTransNotices = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transNotice/deleteByIds',
    data
  })
}

/** 删除标的 */
export const deleteTransNotice = (id) => {
  return api.request({
    method: 'get',
    url: 'api/transNotice/deleteTransNotice?noticeId=' + id
  })
}

/** 获取公告状态 */
export const getTransNoticeStatus = (id) => {
  return api.request({
    method: 'get',
    url: '/api/transNotice/getTransNoticeStatus'
  })
}

/** 发布公告 */
export const publishTransNotice = (id) => {
  return api.request({
    method: 'post',
    url: '/api/transNotice/publishTransNotice?noticeId=' + id
  })
}

/** 提交公告 */
export const submitTransNotice = (id) => {
  return api.request({
    method: 'get',
    url: '/api/transNotice/submitTransNotice?noticeId=' + id
  })
}

/** 新增/修改公告 */
export const saveTransNotice = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transNotice/saveTransNotice',
    data
  })
}

// 补充公告

/** 保存非普通公告 */
export const saveSupplementarNotic = (data) => {
  return api.request({
    method: 'post',
    url: '/api/supplementarNotic/supplementarNotic',
    data
  })
}

/** 初始化补充公告附件信息 */
export const initSuppleNoticeAttach = () => {
  return api.request({
    method: 'get',
    url: '/api/supplementarNotic/initNoticeAttach'
  })
}

/** 查询补充公告附件目录信息 */
export const getSuppleNoticeAttach = (id) => {
  return api.request({
    method: 'get',
    url: '/api/supplementarNotic/noticeAttach?noticeId=' + id
  })
}

/** 获取公告详情 */
export const getSuppleTransNoticeDtl = (id) => {
  return api.request({
    method: 'get',
    url: '/api/supplementarNotic/getTransNoticeDtl?noticeId=' + id
  })
}

/** 删除非普通公告 */
export const deleteSuppleNotic = (id) => {
  return api.request({
    method: 'get',
    url: '/api/supplementarNotic/del/' + id
  })
}
/** 发布非普通公告 */
export const releaseSuppleNotic = (id) => {
  return api.request({
    method: 'get',
    url: '/api/supplementarNotic/' + id
  })
}

/** 查询未绑定标的 */
export const getUnBindList = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transTarget/unBindlist',
    data
  })
}

/** 银行账号分页信息 */
export const getTransAccountList = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transAccount/list',
    data
  })
}
