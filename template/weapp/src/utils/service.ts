import Taro from '@tarojs/taro'
import { userinfo } from '../api/login/index'
import { logError } from './error'
import { HTTP_STATUS } from '../constants/status'

const BASE_URL = process.env.TARO_APP_PATH

/**
 * @param {Object} props
 * @description 针对搜索值做统一处理
 */
const convertParams = (props) => {
  const newParams = {}
  for (const index in props) {
    const item = props[index]
    const type = typeof item
    if (item || item === false || item === 0) {
      if (item && type === 'string') {
        newParams[index] = item.replace(/\s/g, '')
      }
      if (Object.prototype.toString.call(item) === '[object Object]') {
        newParams[index] = convertParams(item)
      } else {
        newParams[index] = item
      }
    }
  }
  return newParams
}

interface configData {
  contentType?: string
}

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '请求资源不存在。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
  4010: '用户名或者密码错误！',
}

const getToken = () => {
  let token = null
  const userInfo = Taro.getStorageSync('userInfo')
  if (userInfo) {
    token = userInfo.token
  }
  return token
}

const baseOptions = (
  url: string,
  params: object = {},
  method = 'get',
  config: configData = {},
  showLoading: Boolean = true
) => {
  const { contentType } = config
  const startTime: any = new Date()
  if (showLoading) {
    Taro.showLoading({ title: '', mask: false })
  }
  const token = getToken();
  let header: Record<string, string> = {
    'content-type': contentType || 'application/json;charset=UTF-8',
  }
  if(url.indexOf('login') < 0) {
    header = {
      ...header,
      'token': token || '',
    }
  }
  const option: any = {
    url: BASE_URL + url,
    data: params,
    method: method,
    timeout: 30000,
    header: header,
    success(response) {
      if (response.header['token']) {
        Taro.setStorageSync('token', response.header['token'])
      }
    },
    error(err) {
      console.log('err', err)
      Taro.showToast({
        icon: 'none',
        duration: 3000,
        title: codeMessage[err.errorCode] || '',
      })
    },
    complete(res) {
      if (showLoading) {
        Taro.hideLoading()
      }
      const endTime: any = new Date()
      // console.log(method, 'api:', BASE_URL + url)
      // console.log('请求参数：', params)
      // console.log('statusCode:', res.statusCode)
      // console.log('time:', endTime - startTime)
      // console.log('data:', res.data)
      const code = res.data && res.data.code ? parseInt(res.data.code) : '200'
      // console.log('res', res)
      if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
        return logError('api', '请求资源不存在')
      } else if (
        res.statusCode === HTTP_STATUS.BAD_GATEWAY ||
        res.statusCode === HTTP_STATUS.SERVER_ERROR ||
        code === HTTP_STATUS.SERVER_ERROR
      ) {
        return logError('api', `提示：${res.data.message}`)
      } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
        return logError('api', '没有权限访问')
      } else if (code === HTTP_STATUS.SERVICE_UNAVAILABLE) {
        return logError('api', '请求错误')
      } else if (
        res.statusCode === HTTP_STATUS.SESSIONTIMEOU ||
        code === HTTP_STATUS.UNKONOWNERROR
      ) {
        const token = Taro.getStorageSync('token')
        if (token) {
          Taro.removeStorageSync('token')
        }
        Taro.setStorageSync('userInfo', null)
        const pages: any = Taro.getCurrentPages()
        if (pages[pages.length - 1].route !== 'pages/login/index') {
          Taro.reLaunch({
            url: '/pages/login/index',
          })
        }
        return logError('api', '请先登录')
      } else if (code === HTTP_STATUS.SUCCESS) {
        return res.data
      }
      return logError('api', res.data?.errorMsg || '请求接口错误', res)
    },
  }
  return Taro.request(option)
}

const request = async (url: string, params: object = {}, method = 'get', config?, showLoading?) => {
  params = config?.paramsNoChange ? params : convertParams(params)
  // params = convertParams(params)
  try {
    const res = await baseOptions(url, params, method, config, showLoading)
    if (res.data.code === HTTP_STATUS.SUCCESS) {
      return res.data
    }
  } catch (err) {
    logError('api', err.data?.message || '请求接口错误', err)
    throw new Error(err)
  }
}

// 获取当前用户个人信息
const getUserInfo = async () => {
  const res = await userinfo()
  if (res.code !== 200) return false
  const data = res.data
  Taro.setStorageSync('userInfo', data)
  return true
}

const removeSorage = () => {
  Taro.removeStorage({ key: 'userInfo' })
  Taro.removeStorage({ key: 'token' })
  Taro.removeStorage({ key: 'usernamePassword' })
  location.reload()

  Taro.reLaunch({
    url: '/pages/login/index',
  })
}

export { request, getUserInfo, removeSorage }
