import api from 'util/axios'
const qs = require('qs');

// 用户登录
export const userLogin = ({ username, password, key, captcha, loginType, certName, SignedDataB64, caLogin }) => {
  const data = qs.stringify({
    username,
    password,
    key,
    captcha,
    loginType,
    certName,
    SignedDataB64,
    caLogin
  })

  return api.request({
    method: 'post',
    url: '/api/login',
    data,
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  })
}

// 用户登出
export const logout = () => {
  return api.request({
    method: 'get',
    url: '/api/logout'
  })
}

// 服务器端验证及请求生成随机数
export const verifyCertAndGenRandom = (data) => {
  return api.request({
    method: 'post',
    url: '/api/verifyCertAndGenRandom',
    headers: { 'content-type': 'multipart/form-data' },
    data
  })
}

// 获取当前用户可访问的权限
export const getuserRoleMeanList = (username) => {
  return api.request({
    method: 'get',
    url: '/api/adminUser/' + username
  })
}


// 修改密码
export const updatePassword = (data) => {
  return api.request({
    method: 'post',
    url: '/api/adminUser/updatePassword',
    data
  })
}

// 绑定CA
export const bindCA = (data) => {
  return api.request({
    method: 'post',
    url: '/api/adminUser/bindCA',
    data
  })
}

// 修改密码
export const unBindCA = (data) => {
  return api.request({
    method: 'post',
    url: '/api/adminUser/unBindCA',
    data
  })
}

// 获取公钥
export const getPublicKey = (data) => {
  return api.request({
    method: 'post',
    url: '/api/adminUser/getPublicKey',
    data
  })
}

// // 修改密码
// export const updatePassword = (data) => {
//   return api.request({
//     method: 'post',
//     url: '/api/adminUser/updatePassword2',
//     data
//   })
// }
