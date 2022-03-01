import api from 'util/axios'
const qs = require('qs');

/** 初始化采矿附件信息 */
export const initTransMineGoodsAttach = () => {
  return api.request({
    method: 'get',
    url: '/api/transMineGoods/initGoodsAttach'
  })
}

/** 初始化采矿附件信息 */
export const initGoodsAttach = () => {
  return api.request({
    method: 'get',
    url: '/api/transGoods/initGoodsAttach'
  })
}

// 查询交易物附件目录信息
export const transGoodsAttach = (id) => {
  return api.request({
    method: 'get',
    url: '/api/transGoods/transGoodsAttach?goodsId=' + id
  })
}

// 获取附件目录下上传的文件
export const attachList = (id) => {
  return api.request({
    method: 'get',
    url: '/api/attach/attachList?attachId=' + id
  })
}

// 上传
export const upload = (data) => {
  return api.request({
    method: 'post',
    url: '/api/fileupload/upload',
    headers: { 'content-type': 'multipart/form-data' },
    data: data
  })
}

// 新增/修改业务附件
export const saveAttach = (data) => {
  return api.request({
    method: 'post',
    url: '/api/attach/saveAttach',
    data
  })
}

// 删除文件
export const deleteFileByFileCode = (id) => {
  return api.request({
    method: 'get',
    url: '/api/fileupload/deleteFileByFileCode?fileCode=' + id
  })
}

// 下载文件
export const fileDownload = (id) => {
  return api.request({
    method: 'get',
    url: '/api/fileupload/download?fileCode=' + id
  })
}

// 根据字典code获取子级字典
export const selectListByParentCode = (id) => {
  return api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=' + id
  })
}

// 查询补充公告列表
export const getSupplementaryNoticeList = (data) => {
  return api.request({
    method: 'post',
    url: '/api/supplementarNotic/supplementaryNoticeList',
    data
  })
}

// 根据字典code获取字典详情
export const selectListByCodeDetail = (id) => {
  return api.request({
    method: 'get',
    url: '/api/dictionary/' + id
  })
}

// 获取用途
export const getDictionaryListByConditions = (data) => {
  return api.request({
    method: 'post',
    url: '/api/dictionary/dictionaryListByConditions',
    data
  })
}

/**
 * 获取所有交易状态
 */
 export const getDealStatus = () => {
  return api.request({
      method: 'get',
      url: '/api/common/getDealStatus',
  })
}

/**
 * 获取所有交易状态
 */
 export const getRefundStatus = () => {
  return api.request({
      method: 'get',
      url: '/api/common/getRefundStatus',
  })
}
export const revertNotice = (noticeId) => {
  return api.request({
    method: 'get',
    url: `/api/transNotice/revertNotice/${noticeId}`
  })
}

/**
 * 土地
 */

/**
 * 初始化标的附件信息
 */
 export const initTargetAttach = (data) => {
  return api.request({
      method: 'post',
      url: '/api/transTarget/initTargetAttach',
      data
  })
}

/**
 * 查询土地标的附件目录信息
 */
 export const landTargetAttach = (targetId) => {
  return api.request({
      method: 'get',
      url: `/api/transTarget/landTargetAttach?targetId=${targetId}`,
  })
}


/**
 * 矿业
 */

/**
 * 初始化标的附件信息
 */
 export const initMineTargetAttach = (data) => {
  return api.request({
      method: 'post',
      url: '/api/transMineTarget/initTargetAttach',
      data
  })
}

/**
 * 查询标的附件目录信息
 */
 export const mineTargetAttach = (targetId) => {
  return api.request({
      method: 'get',
      url: `/api/transMineTarget/mineTargetAttach?targetId=${targetId}`,
  })
}

/**
 * 耕地
 */

/**
 * 初始化标的附件信息
 */
 export const initPlowTargetAttach = (data) => {
  return api.request({
      method: 'post',
      url: '/api/plowTarget/initTargetAttach',
      data
  })
}

/**
 * 查询土地标的附件目录信息
 */
 export const plowTargetAttach = (targetId) => {
  return api.request({
      method: 'get',
      url: `/api/plowTarget/plowTargetAttach?targetId=${targetId}`,
  })
}

/**
 * 退还保证金审核进度
 */
 export const returnNodeListByRefundId = (id) => {
  return api.request({
      method: 'get',
      url: `/api/approveHistory/nodeListByRefundId/${id}`,
  })
}

export const returnListByRefundId = (data) => {
  return api.request({
      method: 'post',
      url: `/api/approveHistory/listByRefundId`,
      data
  })
}

// 确认盖章接口
export const stampNotice = (noticeId) => {
  return api.request({
    method: 'get',
    url: `/api/transNotice/stampNotice/${noticeId}`
  })
}

// 获取线上委托状态下拉框参数
export const getTargetStatus = () => {
  return api.request({
    method: 'get',
    url: `/api/transTarget/getTargetStatus`
  })
}

// 土地、矿产、耕地的成交确认待办处理条数
export const getDealRecord = () => {
  return api.request({
    method: 'get',
    url: `/api/trade/getUncreatedTarget`
  })
}
