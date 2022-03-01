import api from '@/util/axios';

/** 标的列表 */
export const getMineTransNoticeList = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transMineNotice/list',
    data
  })
}
/** 初始化公告附件信息 */
export const initMineNoticeAttach = () => {
  return api.request({
    method: 'get',
    url: '/api/transMineNotice/initNoticeAttach'
  })
}

/** 获取公告详情 */
export const getMineTransNoticeDtl = (id) => {
  return api.request({
    method: 'get',
    url: '/api/transMineNotice/getTransNoticeDtl?noticeId=' + id
  })
}

/** 查询公告附件目录信息 */
export const getMineNoticeAttach = (id) => {
  return api.request({
    method: 'get',
    url: '/api/transMineNotice/noticeAttach?noticeId=' + id
  })
}

/** 批量删除标的 */
export const deleteMineTransNotices = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transMineNotice/deleteByIds',
    data
  })
}

/** 删除标的 */
export const deleteMineTransNotice = (id) => {
  return api.request({
    method: 'get',
    url: '/api/transMineNotice/deleteTransNotice?noticeId=' + id
  })
}

/** 发布公告 */
export const publishMineTransNotice = (id) => {
  return api.request({
    method: 'post',
    url: '/api/transMineNotice/publishTransNotice?noticeId=' + id
  })
}

/** 提交公告 */
export const submitMineTransNotice = (id) => {
  return api.request({
    method: 'get',
    url: '/api/transMineNotice/submitTransNotice?noticeId=' + id
  })
}

/** 新增/修改公告 */
export const saveMineTransNotice = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transMineNotice/saveTransNotice',
    data
  })
}

/** 查询未绑定标的 */
export const getMineUnBindList = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transMineTarget/unBindList',
    data
  })
}

