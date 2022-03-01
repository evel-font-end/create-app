import { Message } from 'element-ui';
import moment from 'moment';

/**
 * @description 时间格式化
 */
export function formatDate(date, fmt) { // yyyy-MM-dd hh:mm:ss
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }

  function padLeftZero(str) {
    return ('00' + str).substr(str.length);
  };
  return fmt;
}

/**
 * @param {String} str 需要判断的字符串
 * @description 判断是否JSON格式
 */
export function isJSON(str) {
  if (typeof str == 'string') {
    try {
      let obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }

    } catch (e) {
      return false;
    }
  }
}


/**
 * @param {Number} value 传进去值
 * @param {String} currency 货币符号
 * * @param {Number} decimals 保留小数位
 * @description 金钱格式化
 */
const digitsRE = /(\d{3})(?=\d)/g
export function currency(value, currency, decimals) {
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  currency = currency != null ? currency : '$'
  decimals = decimals != null ? decimals : 2
  let stringified = Math.abs(value).toFixed(decimals)
  let _int = decimals ?
    stringified.slice(0, -1 - decimals) :
    stringified
  let i = _int.length % 3
  let head = i > 0 ?
    (_int.slice(0, i) + (_int.length > 3 ? ',' : '')) :
    ''
  let _float = decimals ?
    stringified.slice(-1 - decimals) :
    ''
  let sign = value < 0 ? '-' : ''
  return sign + currency + head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float
}



/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent
  const isExplorer = (exp) => {
    return ua.indexOf(exp) > -1
  }
  if (isExplorer('MSIE')) return 'IE'
  else if (isExplorer('Firefox')) return 'Firefox'
  else if (isExplorer('Chrome')) return 'Chrome'
  else if (isExplorer('Opera')) return 'Opera'
  else if (isExplorer('Safari')) return 'Safari'
}

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some(_ => arr.indexOf(_) > -1)
}



/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组相同部分
 */
export const getIntersection = (arr1, arr2) => {
  let len = Math.min(arr1.length, arr2.length)
  let i = -1
  let res = []
  while (++i < len) {
    const item = arr2[i]
    if (arr1.indexOf(item) > -1) res.push(item)
  }
  return res
}

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1)
  const keysArr2 = Object.keys(obj2)
  if (keysArr1.length !== keysArr2.length) return false
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true
  else return !keysArr1.some(key => obj1[key] != obj2[key])
}

/**
 * @param {*} obj 对象
 * @param {*} key 
 * @description 判断当前对象是否存在某key值 (没有key则判断当前对象是否存在key)
 */
export const hasKey = (obj, key) => {
  if (key) return key in obj
  else {
    let keysArr = Object.keys(obj) // 对象key提取转换成数组
    return keysArr.length
  }
}

/**
 * @param {String} key 要验证的key值
 * @param {String|Number} value 要验证的值
 * @param {Array} list 用来验证的列表
 * @description 验证value是否存在在当前数组对象列表中
 */
export const hasValue = (key, value, list) => {
  if (list.length <= 0) return false
  for (let i in list) {
    if (list[i][key] === value) return true
  }

  return false
}

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 * @description 验证当前value是否存在目标对象value中
 */
export function oneOf(value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}


/**
 * @description 是否有子级childen
 */
export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}


/**
 * @description 保存localStorage
 */
export const saveLocal = (key, value) => {
  // window.localStorage.setItem(JSON.stringify(key), JSON.stringify(value))
  window.localStorage[key] = JSON.stringify(value)
}

/**
 * @description 获取localStorage
 */
export const getLocal = (key) => {
  return JSON.parse(window.localStorage.getItem(key || '[]'))
}


/**
 * @description 删除localStorage
 */
export const delLocal = (key) => {
  localStorage.removeItem(key)
}

/**
 * @description 解析url
 */
export const getUrlParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

// 判断是否为空
export const isNull = (arg1) => {
  return !arg1 && arg1 !== 0 && typeof arg1 !== "boolean" ? true : false;
}


// 拷贝内容
export const copyHtml = (copyDiv) => {
  let div = document.getElementById(copyDiv);
  if (document.body.createTextRange) {
    let range = document.body.createTextRange();
    range.moveToElementText(div);
    range.select();
  } else if (window.getSelection) {
    let selection = window.getSelection();
    let range = document.createRange();
    range.selectNodeContents(div);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    console.warn("none");
  }
  document.execCommand("Copy");
  Message("拷贝成功");
}

export const getTime = (time, changeTime) => {
  const nowTime = moment(time, "YYYY-MM-DD HH:mm:ss").valueOf();
  const newTime = moment(nowTime + (changeTime * 1000));
  return moment(newTime).format('YYYY-MM-DD HH:mm:ss');
}

export const getYear = (year = 10) => {
  const years= moment(new Date()).format("YYYY");
  let list = [];
  for(var i=0;i<=year;i++){
    list.push(`${years - i}`);
  }
  return list;
};

export const transformMoney = (value, unit) => {
    const k = unit || 100000000;
    const i = 1;
    return Math.floor((value / Math.pow(k, i)) * 100) / 100;
};

// 联系电话校验
export const phoneTest = (value) => {
  const mobile = /^1(3|4|5|6|7|8|9)\d{9}$/; //最新16手机正则
  const tel = /^(0[0-9]{2,3}\-)([2-9][0-9]{4,7})+(\-[0-9]{1,4})?$/; //座机
  let regPone = null;
  if (value && value.charAt(0) == 0) {    // charAt查找第一个字符方法，用来判断输入的是座机还是手机号
    regPone = tel;         
  } else {          
    regPone = mobile;
  }
  return !regPone.test(value)
}