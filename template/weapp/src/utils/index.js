import Taro from '@tarojs/taro'
import { getByCapacityCode } from '../api/index/index.js'

/**
 * 判断是否是机构
 */
export const isSsdw = () => {
  const currentUser = Taro.getStorageSync('userInfo')
  const { capacity } = currentUser
  // 当用户类型为0或空 组织机构时， 认为用户为组织机构用户，判断是否有下级单位，
  if (!capacity.capacityType || Number(capacity.capacityType) === 0) {
    return true
  } else if (Number(capacity.capacityType) === 1) {
    return false
  }
}

/**
 * 判断是否是虚拟单位
 */
export const isVirtualUnit = function (userData) {
  return userData.virtualUnit === 'Y'
}

// 将树结构转换成一维数组
export const flattenTree = (tree, result = []) => {
  tree.forEach((node) => {
    // 将当前节点的值添加到结果数组中
    result.push({
      virtualUnit: node.virtualUnit,
      deptName: node.deptName,
      deptCode: node.deptCode,
      unitType: node.unitType,
    })

    // 如果当前节点有子节点，则递归调用flattenTree函数
    if (node.subRootList && node.subRootList.length > 0) {
      flattenTree(node.subRootList, result)
    }
  })

  return result
}
// 获取单位下拉列表
// isCurrent --- 保持取最新账号
export const getDwList = (isCurrent = true) => {
  return new Promise((resolve, reject) => {
    const currentUser = Taro.getStorageSync('userInfo')
    const dept = currentUser.dept
    const lwdw = Taro.getStorageSync('lwdw')
    if (isSsdw()) {
      // 默认账号的单位编码
      let ssdw = dept.deptCode
      // 选择了其他单位
      if (isCurrent && lwdw) {
        ssdw = lwdw
      }
      getByCapacityCode({ deptCode: ssdw }).then(async (data) => {
        const robotList = await flattenTree([data])
        resolve(robotList)
        // 初始化勾选赋闲
      })
    }
  })
}

// 获取系统单位参数
export const getParamsBySelect = () => {
  const currentUser = Taro.getStorageSync('userInfo')
  const dept = currentUser?.dept
  if (Taro.getStorageSync('lwdw')) {
    return {
      ssdw: Taro.getStorageSync('lwdw'),
      name: Taro.getStorageSync('lwdwName'),
      virtualUnit: Taro.getStorageSync('lwdwVirtualUnit'),
    }
  }
  return {
    ssdw: dept?.deptCode,
    name: dept?.deptName,
    virtualUnit: dept?.virtualUnit,
  }
}
