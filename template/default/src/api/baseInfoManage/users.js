import api from '@/util/axios'

/** 用户列表 */
export const userList = (data) => {
  return api.request({
    method: 'post',
    url: '/api/adminUser/getUserListByCondition',
    data
  })
}
/** 添加用户 */
export const addUser = (data) => {
  return api.request({
    method: 'post',
    url: '/api/adminUser/addUser',
    data
  })
}
/** 根据用户ID查询用户信息 */
export const getUserById = (id) => {
  return api.request({
    method: 'get',
    url: '/api/adminUser/getUserById/' + id
  })
}
/** 更新用户 */
export const updateUser = (data) => {
  return api.request({
    method: 'post',
    url: '/api/adminUser/updateUser',
    data
  })
}
/** 重置密码 */
export const resetPassword = (username) => {
  return api.request({
    method: 'get',
    url: `/api/adminUser/resetPassword?username=${username}`
  })
}
/** 注销用户 */
export const cancelUser = (username) => {
  return api.request({
    method: 'get',
    url: `/api/adminUser/cancelUser?username=${username}`
  })
}
/** 启用用户 */
export const enableUser = (username) => {
  return api.request({
    method: 'get',
    url: `/api/adminUser/enableUser?username=${username}`
  })
}

/**  用户管理 - 根据用户名称查询拥有的角色 */
export const listRolesByUsername = (username) => {
  return api.request({
    method: 'get',
    url: `/api/role/listRolesByUsername/${username}`
  })
}

/**  用户管理 - 配置用户角色 */

export const addUserRoles = ({ rolesList, username }) => {
  const data = {
    rolesList, // 角色编码列表
    username // 用户名称
  }
  return api.request({
    method: 'post',
    url: '/api/role/addUserRoles',
    data
  })
}
