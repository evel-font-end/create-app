import Cookies from 'js-cookie'
// import moment from 'moment';
import router from '@/router';
import Config from '@/config'
import {
  hasOneOf,
  hasChild,
  getLocal
} from './tool'
import store from '@/store'
export const TOKEN_KEY = 'token'
export const homeIcon = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAxZJREFUSEvFlktPE1EUx++5j3ba0lZIlbcCVR5Gxahh40bjgwRlqd/CBSbGLXuCxKVfAZdqYgyJLFwZXfikkIBAQhEwWApDZzpz7zF3SM1YilbU8S7n/uf85sz9n3MPkIAX/A7v6sibmKHCSSfCIqgkB8pcAbJgWfbGszu9ZjWxfgm8MPycR+OHO4DKw4gQ2ysoAJqo2OL25uLc5PBFd0/dz75qcCTTLhnvIgTDng5ROhI2kXEbXOYil5wihgTDOKLiO7HAZoJPP7rV9qlS7IoZ3hgfZ5uLvWcopU36JYmQ33Ij2VwhuQGCYHkgdAjUxnOJGLGaGWBC71OiliMtna8f3gTp1+8CapiZPX2eKKiVQF1bRma/2Imv1ZyP1qTC+dow20ozBI6E5Gpajr7wQ3cBB+7NniNENStFrBUrlXFAWNXCSjqBeaPeMLspJYbO9PHtrpelvR+AgyNv2iWLntKZrZp17/cD80MPxbZO6EwB8N2Toc4574RLAs+NidbL2iBbTmxm3U2sV8pMFYthG0SCEuCKoBtGlqchZVfS6t8bpWaXNtJ2Pj0xOQzud+DA6FQnAd4jUeSXrNTH8gDFbYtLEj1CBdaV7zEC64qThRCoXeXQbHw+ro2kHJl5erd7+jvw+uj0JQW0ZsOJZjbcZM4fVMOIMHqQgLF3fTGLcDVVDj0AuWTCKPQAUPPJUHrCAw4+yEalaV7Rdbaw2fSq3PqFbZqulFmlTLlQs/7numTakitndZ26Mr4D7B+bb2To9Dkuzy07BzM/BEIasl3srdapAuFt+Zk2hVe7OJW1lKhXHvDa2EwHIpy0pVhdKaY8N5WWJTEFirZXC1REzUcErPn1DXytPSTceknggwcsGcZWNLti1y/6xbZDGgmBlmqBKItLhiGyfn0jX28Vwm5WVGb+T4b9Yx8bGYo+h/DcciGAMwzcpfp/B1qHHvD+7DEl1fHAOs3v9NIii8VBOeKPeqnXcYK8LUp1E+h9qKGB3/glaGAzjb8lVTu1cXATBIDtvLuPqc0P3ZlLGzqAsn8/l5Y37L8xeX8DjmlP4JYI9LgAAAAASUVORK5CYII=';
// 设置用户登陆信息保存时间
export const setToken = (username: string | object) => {
  Cookies.set('username', username, { expires: Config.cookieExpires || 1 })
}

// 获取token
export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY);
  const ret = (token ? token : false)
  return ret
}

/**
 * @description 根据路由创建左侧菜单
 */
export const creatMenuByRouters = (routers: any, whiteRouterList: any, operation: any) => {
  if (!operation) return
  let res: any = [],
    parentObj = {}
  routers.forEach((item: any, index: number) => {
    const {
      name,
      meta
    } = item

    // 必须有数据元&&不隐藏的菜单
    if (meta && !meta.hideInMenu) {
      let obj: any = {
        icon: meta.icon || '',
        name: name,
        meta: meta
      }

      // 若当前有子级并且可访问显示则继续添加
      if ((hasChild(item) || meta && (meta.hideChildenAlways)) && hasInList(item.name, whiteRouterList)) {
        obj.children = creatMenuByRouters(item.children, whiteRouterList, operation)
      }
      if (meta && meta.href) obj['href'] = meta.href // 添加第三方连接
      if (hasInList(item.name, whiteRouterList)) {
        if (operation.get(item.name)) obj.meta.operation = operation.get(item.name)
        // 去重
        const ifHas = res.some((r: { name: any; }) => {
          return r.name == obj.name
        })
        if (!ifHas) {
          res.push(obj)
        }
      }
    }
  })
  return res
}




/**
 * @description 判断当前角色权限是否在当前路由中
 */
const hasInList = (name: any, operation: any) => {
  if (operation.some((i: any) => i === name)) return true
  else return false
}


/**
 * @description 根据权限表生成树结构
 */
export const toTree = (data: any) => {
  if (!data) return []
  let map: any = {}
  data.forEach((item: { id: string | number; }) => {
    map[item.id] = item
  })

  let val: any = []
  data.forEach((item: any) => {
    let par = map[item.parentId]
    if (par) {
      (par.children || (par.children = [])).push(item)
      if (!item.checked) {
        par['isCheck'] = false
      } else {
        if (!item.hasOwnProperty('children')) item['isCheck'] = true
      }
      if (par.parentId !== 0 && !par.isCheck && par.hasOwnProperty('isCheck')) {
        map[par.parentId]['isCheck'] = false
      }
    } else {
      if (item.checked) item['isCheck'] = true
      val.push(item)
    }
  })
  return val
}



// 根据权限表构造树结构
export class checkTreeData {
  [x: string]: any;
  constructor({
    permissionCode,
    status,
    frontFlag
  }: any) {
    (this.permissionCode = permissionCode), (this.status = status), (this.frontFlag = frontFlag);
  }
}


// 判断当前页面是否存在缓存
export const hasLocalData = (pageName: any) => {
  const data = getLocal('menuTags')
  if (data) {
    return data.some((item: { name: any; }) => item.name === pageName)
  } else {
    return false
  }
}

export const routePush = ({ title, name, parames, query }: any) => {
  return new Promise<void>((resolve, reject) => {
    store.commit('set_common', {
      [name]: parames
    });
    store.commit('set_openPage', name);
    store.commit('set_menuTags', {
      icon: '',
      title,
      name
    });
    // this.set_menuTags(list);
    router.push({
      name,
      query
    });
    resolve();
  });
};

/**
 * 判断两个时间区间是否重叠
 * @params timeA array[startTimeString,startTimeString]
 * @params timeB array[startTimeString,startTimeString]
 * @return boolean
 * */
export const checkTimeOverlap = (timeA: any, timeB: any) => {
  if (!Array.isArray(timeA) || !Array.isArray(timeB)) return false
  const maxA = new Date(timeA[0]).getTime()
  const maxB = new Date(timeB[0]).getTime()
  const minA = new Date(timeA[1]).getTime()
  const minB = new Date(timeB[1]).getTime()
  const max = [maxA, maxB];
  const min = [minA, minB];
  return (Math.max.apply(null, max) <= Math.min.apply(null, min))
}

/* export const checkTimeBetween = (timeDataA: any, timeDataB: any) => {
  if (!Array.isArray(timeDataA) || !Array.isArray(timeDataB)) return false;
  const timeA = [moment(timeDataA[0], 'hh:mm:ss'), moment(timeDataA[1], 'hh:mm:ss')];
  const timeB = [moment(timeDataB[0], 'hh:mm:ss'), moment(timeDataB[1], 'hh:mm:ss')];
  let result = [
    timeA[0].isBetween(timeB[0], timeB[1]),
    timeA[1].isBetween(timeB[0], timeB[1]),
    timeB[0].isBetween(timeA[0], timeA[1]),
    timeB[1].isBetween(timeA[0], timeA[1]),
    timeA[0].isSame(timeB[0]),
    timeA[1].isSame(timeB[1])
  ];
  console.log(result);
  return result.includes(true);
} */

export const currentDate = () => {
  var now = new Date();
  var year = now.getFullYear(); // 得到年份
  var month = now.getMonth();// 得到月份
  var date = now.getDate();// 得到日期
  var day = now.getDay();// 得到周几
  var hour = now.getHours();// 得到小时
  var minu = now.getMinutes();// 得到分钟
  var sec = now.getSeconds();// 得到秒
  // var MS = now.getMilliseconds();//获取毫秒
  // var week;
  month = month + 1;
  if (month < 10) month = Number('0' + month);
  if (date < 10) date = Number('0' + date);
  if (hour < 10) hour = Number('0' + hour);
  if (minu < 10) minu = Number('0' + minu);
  if (sec < 10) sec = Number('0' + sec);
  // if （MS < 100）MS = "0" + MS;
  var time = '';
  time = year + '-' + month + '-' + date + ' ' + hour + ':' + minu + ':' + sec;
  return time;
}

// 根据权限表构造树结构
export class CheckTreeData {
  [x: string]: any;
  constructor({
    permissionCode,
    status,
    frontFlag
  }: any) {
    (this.permissionCode = permissionCode), (this.status = status), (this.frontFlag = frontFlag);
  }
}

export const loadJS = (url: string, callback: () => void) => {
  var script: any = document.createElement('script'),
    fn = callback || function () { };
  script.type = 'text/javascript';
  // IE
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == 'loaded' || script.readyState == 'complete') {
        script.onreadystatechange = null;
        fn();
      }
    };
  } else {
    // 其他浏览器
    script.onload = function () {
      fn();
    };
  }
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}

// 动态加载css
export const loadStyle = (url: string) => {
  let link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  let head = document.getElementsByTagName('head')[0];
  head.appendChild(link);
};

/**
 * object转化成url拼接样式
 * @param obj 需要转化的参数
 */
export const objToUrl = (obj: any) => {
  let arr = [];
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
    }
  }
  return arr.join('&');
}

export const postData = async (url: string, data: any) => {
  const baseURL = 'https://open.ys7.com/';
  // Default options are marked with *
  const parames = {
    ...data,
    accessToken: store.state.common.accessToken || 'at.94jljbve5b95wx010ut5p497df84xkeh-2rtke1kv5u-03xkzjt-tvwgdqpwk',
    // deviceSerial: 'E63112920',
    channelNo: 1
  };
  const paramesText = await objToUrl(parames);
  return fetch(`${baseURL}${url}?${paramesText}`, {
    body: null, // must match 'Content-Type' header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer' // *client, no-referrer
    // credentials: 'include' // include, same-origin, *omit
  })
    .then(response => response.json()) // parses response to JSON
}

export const download = (url: string, name: string) => {
  // 利用a标签的download属性进行下载
  const link = document.createElement('a');

  // 设置a标签的属性
  link.href = url;
  link.download = name;
  // link.target = '_blank';

  // 加入dom树中，模拟用户点击并下载
  document.body.appendChild(link);
  link.click();

  // 移除该元素，防泄漏
  document.body.removeChild(link);
};

export function randomExtend(minNum: number, maxNum: number) {
  if (arguments.length === 1) {
    return parseInt(String(Math.random() * minNum + 1), 10)
  } else {
    return parseInt(String(Math.random() * (maxNum - minNum + 1) + minNum), 10)
  }
}

/* export function debounce(delay: any, callback: any) {
  let lastTime: number | undefined

  return () => {
    clearTimeout(lastTime)

    const [that, args] = [this, arguments]

    lastTime = setTimeout(() => {
      callback.apply(that, args)
    }, delay)
  }
} */


export function getPointDistance(pointOne: any, pointTwo: any) {
  const minusX = Math.abs(pointOne[0] - pointTwo[0])

  const minusY = Math.abs(pointOne[1] - pointTwo[1])

  return Math.sqrt(minusX * minusX + minusY * minusY)
}

export function uuid(hasHyphen: any) {
  return (hasHyphen ? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' : 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx').replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = (c === 'x') ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * @description 获取数组最大值 value 在数组中的位置
 */
export const getMaxIndex = (sData: any, value: any) => sData.findIndex((item: { [x: string]: number; }) => item[value] === Math.max.apply(Math, sData.map((item: { [x: string]: any; }) => { return item[value] })))
/**
 * 弯曲函数
 * @param {*} a a点的坐标{lng: 10, lat: 10}
 * @param {*} b b点的坐标{lng: 10, lat: 10}
 * @param {*} curv 弯曲程度 取值 -5 到 5 
 * @returns 
 */
export const svgPathCurv = (a: any, b: any, curv: any) => {
  curv = curv ? curv : 0;
  let s, k2, controX, controY, q, l, path = '';
  s = 'M' + a.lng + ',' + a.lat + ' ';

  /*
   * 控制点必须在line的中垂线上
   * **求出k2的中垂线(中垂线公式)**
   */
  let x1 = a.lng, x2 = b.lng, y1 = a.lat, y2 = b.lat;
  k2 = -(x2 - x1) / (y2 - y1);
  /*
   * 弯曲程度是根据中垂线斜率决定固定控制点的X坐标或者Y坐标,通过中垂线公式求出另一个坐标
   * 默认A/B中点的坐标+curv*30,可以通过改基数30改变传入的参数范围
   */
  if (k2 < 2 && k2 > -2) {
    controX = (x2 + x1) / 2 + curv * 30;
    controX = controX < 0 ? -controX : controX;
    controY = k2 * (controX - (x1 + x2) / 2) + (y1 + y2) / 2;
    controY = controY < 0 ? -controY : controY;
  } else {
    controY = (y2 + y1) / 2 + curv * 30;
    controY = controY < 0 ? -controY : controY;
    controX = (controY - (y1 + y2) / 2) / k2 + (x1 + x2) / 2;
    controX = controX < 0 ? -controX : controX;
  }
  //定义控制点的位置
  q = 'Q' + controX + ',' + controY + ' ';
  //l=lineto
  l = x2 + ',' + y2 + ' ';
  //结果例: M10,10Q35,15,10,20 
  path = s + q + l;
  return path;
}

// 时间戳转为正常时间
export const transformTimestamp = (timestamp: any) => {
  let a = new Date(timestamp).getTime();
  const date = new Date(a);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '  ';
  const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  // const s = date.getSeconds(); // 秒
  const dateString = Y + M + D + h + m;
  return dateString;
}
