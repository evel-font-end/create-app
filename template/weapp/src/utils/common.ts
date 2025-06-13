import Taro from '@tarojs/taro'
import dayjs from 'dayjs'

// 验证字段是否为null
export const verifyValidator = (validator) => {
  return validator !== undefined && validator !== null
}

// 数组根据id赋值
export const setArrayValue = (data, items) => {
  return items.map((item) => {
    return {
      ...item,
      value: data[item.id] || item.value,
    }
  })
}

// 米转换成距离
export const transfDistance = (distance) => {
  let resultdistance = ''
  if (distance < 1000) {
    resultdistance = `${distance}米`
  } else if (distance > 1000) {
    resultdistance = `${(Math.round(distance / 100) / 10).toFixed(1)}公里`
  }
  return resultdistance
}

export const useTypes = (values) => {
  const labels = {}
  const types = {}
  const options =
    values &&
    Object.keys(values).map((key) => {
      types[values[key]] = key
      return {
        name: key,
        id: values[key],
        label: labels[key],
      }
    })
  return {
    values,
    labels: labels,
    types,
    options,
  }
}

// 手动拼接FormData字符串
// 函数边界处理没怎么做，各位可自行补充
// 数组和obj的情况没有处理，可以用postman发个请求看看格式，很简单的
export const createFormData = (params = {}, boundary = '') => {
  let result = ''
  for (const i in params) {
    result += `\r\n--${boundary}`
    result += `\r\nContent-Disposition: form-data; name="${i}"`
    result += '\r\n'
    result += `\r\n${params[i]}`
  }
  // 如果obj不为空，则最后一行加上boundary
  if (result) {
    result += `\r\n--${boundary}`
  }
  return result
}

// 获取当前路由？后的参数
export const routerData = () => {
  const pages = Taro.getCurrentPages()
  const curr = pages[pages.length - 1]
  return curr && curr.options
}

/**
 * 格式化数字 小于10在前面补零
 * @param param
 */
export function withData(param) {
  return param < 10 ? '0' + param : '' + param
}

/**
 * 数组中有某值就删除没有就加入
 * @param param
 */
export const arrayRecombination = async (array, value) => {
  const arr = [...array]
  const size = arr.length
  const a = await arr.forEach((item, index) => {
    if (item === value) {
      arr.splice(index, 1)
    }
  })
  if (size === arr.length) {
    arr.push(value)
  }
  return arr
}

/**
 * 当前时间或者自定义时间的处理
 * @param h 时
 * @param m 分
 * @param s 秒
 */
export const getNewDateArry = (h?, m?, s?) => {
  const newDate = new Date()
  const year = withData(newDate.getFullYear()),
    mont = withData(newDate.getMonth() + 1),
    date = withData(newDate.getDate()),
    hour = withData(newDate.getHours()),
    minu = withData(newDate.getMinutes()),
    seco = withData(newDate.getSeconds())
  if (typeof h === 'number' && typeof s === 'number' && typeof s === 'number') {
    return `${year}-${mont}-${date} ${withData(h)}:${withData(m)}:${withData(s)}`
  } else {
    return `${year}-${mont}-${date} ${hour}:${minu}:${seco}`
  }
}
/**
 * 考试倒计时
 * @param seconds 考试时长(min)
 */
export const countDown = (seconds: number | string) => {
  let hh: number | string = parseInt(`${Number(seconds) / (60 * 60)}`)
  let mm: number | string = parseInt(`${Number(seconds) / 60 - hh * 60}`)
  let ss: number | string = Number(seconds) - (hh * 60 * 60 + mm * 60)
  hh = withData(hh)
  mm = withData(mm)
  ss = withData(ss)
  return `${hh}:${mm}:${ss}`
}

/**
 * 格式化时间
 * @param dateTime 时间
 */
export const dateTimeFormat = (dateTime, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!dateTime) return ''
  return dayjs(dateTime).format(format)
}
/**
 *
 * @param url 需要截取的url
 * @param name 想要解析的参数名
 */
export const getQueryString = function (url, name) {
  const reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
  const r = url.substr(1).match(reg)
  if (r !== null) {
    return r[2]
  }
  return null
}

/**
 * 将对象拼接为 xxx=xxx&xx=xx 形式
 * @param params 参数对象
 */
export const qsData = (params) => {
  let exportUrl = ''
  Object.keys(params).map((key) => {
    if (typeof params[key] === 'object') {
      exportUrl += qsData(params[key])
    } else {
      exportUrl += key + '=' + params[key] + '&'
    }
  })
  // exportUrl = exportUrl.substring(exportUrl.length-1,1)
  return exportUrl
}

export const onShareMessage = (res, router) => {
  // const params = qsData(router.params)
  const shareObj = {
    title: '来看看我的战绩吧~',
    path: `pages/pagesDevice/devicePage/index`,
  }
  if (res.from === 'button') {
    // 来自页面内转发按钮
    // var eData = res.target.dataset;   // shareBtn
    // 此处可以修改 shareObj 中的内容
    // shareObj.path = `${router.path}?${params}`;
  }
  return shareObj
}

const shareImage = 'http://157.148.123.51:8006/upload/dist/fireAssets/images/common/shareImage.png'
export const handleShareTimeline = (params) => {
  const queryParams = qsData(params)
  return {
    title: '快来和我对战吧~',
    imageUrl: shareImage,
    query: queryParams,
  }
}
/**
 * 是否是本人(1-自己，2-对方)
 */
// private Number isMySelf;

/**
 * 是否是本团队成员(1-本团队，2-对方团队)
 */
// private Number isMyTeam;

export const selectUserInfo = async (userInfoDtos, isTeam = false) => {
  let myUserInfoDto: any = isTeam ? [] : {}
  let otherUserInfoDto: any = isTeam ? [] : {}
  const allUserInfoDto: any = []
  const id = isTeam ? 'isMyTeam' : 'isMySelf'
  if (userInfoDtos) {
    const a = await userInfoDtos.map((userInfoDto) => {
      if (userInfoDto[id] === 1) {
        if (isTeam) {
          myUserInfoDto.push(userInfoDto)
        } else {
          myUserInfoDto = userInfoDto
        }
      } else {
        if (isTeam) {
          otherUserInfoDto.push(userInfoDto)
        } else {
          otherUserInfoDto = userInfoDto
        }
      }
      allUserInfoDto.push({
        authToken: userInfoDto.authToken,
        teamNo: userInfoDto.teamNo,
      })
    })
  }
  return {
    myUserInfoDto,
    otherUserInfoDto,
    allUserInfoDto,
  }
}

//排序函数
export const getSortFun = (attr, rev: boolean | number = false) => {
  if (rev === undefined) {
    rev = 1
  } else {
    rev = rev ? 1 : -1
  }

  return function (a, b) {
    a = a[attr]
    b = b[attr]
    if (a < b) {
      return rev * -1
    }
    if (a > b) {
      return rev * 1
    }
    return 0
  }
}

export const isFunction = (obj) => {
  return typeof obj === 'function' && typeof obj.nodeType !== 'number'
}

// 判断是否是数字
export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

/**
 *判断一个数有几位小数
 *@param {number} number
 */
export function getDecimalPoint(number) {
  if (!isNumeric(number)) {
    return
  }
  const num = parseFloat(number)
  const str = num.toString()
  const x = str.indexOf('.')
  if (x > -1) {
    return str.length - x - 1
  } else {
    return 0
  }
}

/**
 *
 * @param arr 源数组
 * @param n 移动距离，负数表示左移动，正数表示右移动，0表示不移动
 * @returns
 */
export function moveElement(arr, n) {
  if (Math.abs(n) > arr.length) n = n % arr.length
  return arr.slice(-n).concat(arr.slice(0, -n))
}

/**
 *
 * @param arr 差集
 * @param a,b
 * @returns
 */
export const authTokenIsDifferent = (a, b) =>
  [...b].filter((x) => [...a].every((y) => y.id !== x.id))

/*
 ** randomWord 产生任意长度随机字母数字组合
 ** randomFlag 是否任意长度 min 任意长度最小位[固定位数] max 任意长度最大位
 **
 */
export const getRange = (min, max) => Math.round(Math.random() * (max - min)) + min
export const getMathRound = (length) => Math.round(Math.random() * (length - 1))
export const randomWord = (min = 6, max = 12) => {
  let str = '',
    range = min
  const arr = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '-',
    '.',
    '~',
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '_',
    ':',
    '<',
    '>',
    '?',
  ]
  range = getRange(min, max) // 任意长度
  for (let i = 0; i < range; i++) {
    const pos = getMathRound(arr.length)
    str += arr[pos]
  }
  return str
}

const innerAudioContext = Taro.createInnerAudioContext()
export const playBackMusic = () => {
  stopBackMusic()
  innerAudioContext.autoplay = true
  innerAudioContext.src = 'http://157.148.123.51:8006/upload/dist/fireAssets/images/wav/success.wav'
  innerAudioContext.play()
  innerAudioContext.onEnded(() => {
    playBackMusic()
  })
}
export const stopBackMusic = () => {
  innerAudioContext.stop()
  innerAudioContext.destroy()
}

const innerResultSuccessAudioContext = Taro.createInnerAudioContext()
const innerResultFailAudioContext = Taro.createInnerAudioContext()
export const playBackSuccessMusic = () => {
  stopSuccessBackMusic()
  innerResultSuccessAudioContext.autoplay = true
  innerResultSuccessAudioContext.src =
    'http://157.148.123.51:8006/upload/dist/fireAssets/images/wav/success.wav'
  innerResultSuccessAudioContext.play()
  innerResultSuccessAudioContext.onEnded(() => {
    playBackSuccessMusic()
  })
}
export const stopSuccessBackMusic = () => {
  innerResultSuccessAudioContext.destroy()
}
export const playBackFailMusic = () => {
  stopFailBackMusic()
  innerResultFailAudioContext.autoplay = true
  innerResultFailAudioContext.src =
    'http://157.148.123.51:8006/upload/dist/fireAssets/images/wav/fail.wav'
  innerResultFailAudioContext.play()
  innerResultFailAudioContext.onEnded(() => {
    playBackFailMusic()
  })
}
export const stopFailBackMusic = () => {
  innerResultFailAudioContext.stop()
  innerResultFailAudioContext.destroy()
}
