import { ElMessage } from 'element-plus';
/**
 * @description 时间格式化
 */
 export function formatDate (date: any, fmt: any) { // yyyy-MM-dd hh:mm:ss
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o: any = {
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

  function padLeftZero (str: any) {
    return ('00' + str).substr(str.length);
  };
  return fmt;
}

/**
 * @param {String} str 需要判断的字符串
 * @description 判断是否JSON格式
 */
export function isJSON (str: any) {
  if (typeof str === 'string') {
    try {
      let obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
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
export function currency (value: any, currency: any, decimals: any) {
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  currency = currency != null ? currency : '$'
  decimals = decimals != null ? decimals : 2
  let stringified = Math.abs(value).toFixed(decimals)
  let _int = decimals
    ? stringified.slice(0, -1 - decimals)
    : stringified
  let i = _int.length % 3
  let head = i > 0
    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
    : ''
  let _float = decimals
    ? stringified.slice(-1 - decimals)
    : ''
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
  const isExplorer = (exp: any) => {
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
export const hasOneOf = (targetarr: any, arr: any) => {
  return targetarr.some((_: any) => arr.indexOf(_) > -1)
}



/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组相同部分
 */
export const getIntersection = (arr1: any, arr2: any) => {
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
export const objEqual = (obj1: any, obj2: any) => {
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
export const hasKey = (obj: any, key: any) => {
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
export const hasValue = (key: any, value: any, list: any) => {
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
export function oneOf (value: any, validList: any) {
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
export const hasChild = (item: any) => {
  return item.children && item.children.length !== 0
}


/**
 * @description 保存localStorage
 */
export const saveLocal = (key: any, value: any) => {
  // window.localStorage.setItem(JSON.stringify(key), JSON.stringify(value))
  window.localStorage[key] = JSON.stringify(value)
}

/**
 * @description 获取localStorage
 */
export const getLocal = (key: any) => {
  let getValue = window.localStorage.getItem(key || '[]');
  if (typeof getValue !== 'string') {
    getValue = JSON.stringify(getValue);
  }
  return getValue !== 'undefined' && getValue !== 'null' ? JSON.parse(getValue) : ''
}


/**
 * @description 删除localStorage
 */
export const delLocal = (key: any) => {
  localStorage.removeItem(key)
}

/**
 * @description 解析url
 */
export const getUrlParams = (url: any) => {
  if (!url) return '';
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj: any = {}
  keyValueArr.forEach((item: any) => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

// 判断是否为空
export const isNull = (arg1: any) => {
  return !!(!arg1 && arg1 !== 0 && typeof arg1 !== 'boolean');
}


// 拷贝内容
export const copyHtml = (copyDiv: any) => {
  let div = document.getElementById(copyDiv);
  let body: any = document.body;
  if (body.createTextRange) {
    let range = body.createTextRange();
    range.moveToElementText(div);
    range.select();
  } else if (window.getSelection) {
    let selection: any = window.getSelection();
    let range: any = document.createRange();
    range.selectNodeContents(div);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    console.warn('none');
  }
  document.execCommand('Copy');
  console.log(div)
  ElMessage('拷贝成功');
}

export const cubicInOut = (k: any) => {
  return k;
  // if ((k *= 2) < 1) { return 0.5 * k * k; }
  // return -0.5 * (--k * (k - 2) - 1);
}

export const convertData = (geoCoordMap: any, data: any[], type: string = 'none') => {
  let res = [];
  for (let i = 0; i < data.length; i++) {
      let geoCoord = geoCoordMap[data[i].name];
      if (geoCoord) {
          res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value),
              itemStyle: {
                borderColor: type === 'block' ? 'rgba(88,152,246,1)' : 'transparent',
                borderWidth: 1
              }
          });
      }
  }
  return res;
};
// 判断区间
export const testSection = (arr: any[], num: number) => { for(var i=0;i<arr.length;i++){ if(arr[i]>num){ return i-1; } }}