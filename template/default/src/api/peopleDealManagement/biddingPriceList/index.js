import api from '@/util/axios'
// 查询竞买申请详情
export const getTransLicenseInfo = (licenseId) => {
  return api.request({
    method: 'get',
    url: '/bidder/api/transLicense/' + licenseId
  })
}
// 查询竞买申请状态
export const getLicenseStatus = () => {
  return api.request({
    method: 'get',
    url: '/bidder/api/transLicense/getLicenseStatus'
  })
}
// 获取当前用户申请的竞买申请资格
export const getUserTransLicense = ({ data, pageNo, pageSize, sorting }) => {
  const fromData = {
    data: { ...data }, // 查询角色信息
    pageNo, // 查询的分页页码。默认值为1 ,
    pageSize, // 查询的分页页大小。默认值为10
    sorting // 排序
  }
  return api.request({
    method: 'post',
    url: '/bidder/api/transLicense/getUserTransLicense',
    data: fromData
  })
}

// 删除标的
export const delTransLicense = (id) => {
  return api.request({
    method: 'get',
    url: '/bidder/api/transLicense/del/' + id
  })
}

// 获取标的交易方式
export const getTransactionType = () => {
  return api.request({
    method: 'get',
    url: '/bidder/api/transLicense/getTransactionType'
  })
}

// 获取标的交易类型
export const getBusinessType = () => {
  return api.request({
    method: 'get',
    url: '/bidder/api/transLicense/getBusinessType'
  })
}

// 初始化交易申请附件
export const initTransLicenseAttach = (id) => {
  return api.request({
    method: 'get',
    url: '/bidder/api/transLicense/initTransLicenseAttach?licenseId=' + id
  })
}
