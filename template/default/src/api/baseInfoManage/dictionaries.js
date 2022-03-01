// 字典管理
import api from 'util/axios'

// 字典管理 - 获取字典列表
export const getDictionariesList = ({ data, pageNo, pageSize, sorting }) => {
  const fromData = {
    data: { ...data }, // 查询角色信息  {enabled true是 false否,""查询全部; name字典名称/值; type 字典类型}
    pageNo, // 查询的分页页码。默认值为1 ,
    pageSize, // 查询的分页页大小。默认值为10
    sorting // 排序
  }

  return api.request({
    method: 'post',
    url: '/api/dictionary/list',
    data: fromData
  })
}

// 字典管理 - 添加字典
export const addDictionary = ({ description, name, parentCode, sortKey, type, code, value }) => {
  const data = {
    description, // 字典描述
    name, // 字典名称
    parentCode, // 父级字典编码
    sortKey, // 字典排序
    type, //  字典类型
    value, // 字典值
    code
  }

  return api.request({
    method: 'post',
    url: '/api/dictionary/add',
    data
  })
}

// 字典管理 - 修改字典
export const dictionaryUpdate = ({ code, description, name, sortKey, type, id, value }) => {
  const data = {
    code, //  (string) 字典编码
    description, // (string) 字典描述
    name, // (string) 字典名称
    sortKey, // (integer) 字典排序
    type, // (integer) 字典类型
    value, // 字典值
    id
  }

  return api.request({
    method: 'post',
    url: '/api/dictionary/update',
    data
  })
}


// 字典管理 - 设置可用
export const setEnable = (code) => {
  return api.request({
    method: 'post',
    url: `/api/dictionary/enable/${code}`
  })
}

// 字典管理 - 设置不可用
export const setDisEnable = (code) => {
  return api.request({
    method: 'post',
    url: `/api/dictionary/disEnable/${code}`
  })
}


// 字典管理搜索框 - 查看所有字典类型
export const getDictionaryTypes = () => {
  return api.request({
    method: 'get',
    url: '/api/dictionary/getDictionaryTypes'
  })
}

// 字典管理弹窗 - 查看所有字典管理类别
export const getDictionaryManagerTypes = () => {
  return api.request({
    method: 'get',
    url: '/api/dictionary/getDictionaryManagerTypes'
  })
}


// 查询字典下的所有字典/字典项
export const getDictionaryListByCode = (code) => {
  return api.request({
    method: 'get',
    url: `/api/dictionary/getDictionaryListByCode?code=${code}`
  })
}



// 查询排序值是否重复
export const findSortKeyIsRepeated = (parentCode, sortKey) => {
  return api.request({
    method: 'put',
    url: `/api/dictionary/findSortKeyIsRepeated?parentCode=${parentCode}&sortKey=${sortKey}`
  })
}


// 查询字典树
export const dictionaryList = () => {
  return api.request({
    method: 'post',
    url: '/api/dictionary/dictionaryList'
  })
}


// 根据父级code查询字典
export const getDictionaryListCode = ({ data, pageNo, pageSize, sorting }) => {
  const fromData = {
    data: { ...data }, // 查询角色信息  {enabled true是 false否,""查询全部; name字典名称/值; type 字典类型}
    pageNo, // 查询的分页页码。默认值为1 ,
    pageSize, // 查询的分页页大小。默认值为10
    sorting // 排序
  }

  return api.request({
    method: 'post',
    url: '/api/dictionary/dictionaryListByConditions',
    data: fromData
  })
}


// 删除字典
export const deleteDictionary = (code) => {
  return api.request({
    method: 'get',
    url: `/api/dictionary/del/${code}`
  })
}
