// 资源管理
import api from 'util/axios'

// 资源管理 - 更新权限状态
export const updatePermissionsStatus = (permissionsStatusCommandList) => {
  const data = {permissionsStatusCommandList} // 需要修改的权限
  return api.request({
    method: 'post',
    url: '/api/role/updatePermissionsStatus',
    data
  })
}


// 资源管理 - 查询所有权限信息
export const listAllPermissions = () => {
  return api.request({
    method: 'get',
    url: '/api/role/listAllPermissions'
  })
}
