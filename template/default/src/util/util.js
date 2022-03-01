import Cookies from 'js-cookie'
import Config from '@/config'
import {
  hasOneOf,
  hasChild,
  getLocal
} from './tool'
import store from '@/store'
export const TOKEN_KEY = 'token'

// 设置用户登录信息保存时间
// export const setToken = username => {
//     Cookies.set('username', username, { expires: Config.cookieExpires || 1 })
// }

// // 获取token
// export const getToken = () => {
//     const token = Cookies.get(TOKEN_KEY);
//     const ret = (token ? token : false)
//     return ret
// }



/**
 * @description 根据路由创建左侧菜单
 */
export const creatMenuByRouters = (routers, whritRouterList, operation) => {

  if (!operation) return
  let res = [],
    parentObj = {}
    routers.forEach((item, index) => {
    const {
      name,
      meta,
      link
    } = item

    // 必须有数据元&&不隐藏的菜单
    if (meta && !meta.hideInMenu) {
      let obj = {
        icon: meta.icon || '',
        name: name,
        meta: meta,
        link: link
      }

      // 若当前有子级并且可访问显示则继续添加
      if ((hasChild(item) || meta && (meta.hideChildenAlways)) && hasInList(item.name, whritRouterList)) {
        obj.children = creatMenuByRouters(item.children, whritRouterList, operation)
      }
      if (meta && meta.href) obj['href'] = meta.href // 添加第三方连接

      if (hasInList(item.name, whritRouterList)) {
        if (operation.get(item.name)) obj.meta.operation = operation.get(item.name)
        res.push(obj)
      }
    }
  })
  return res
}




/**
 * @description 判断当前角色权限是否在当前路由中
 */
const hasInList = (name, operation) => {
  if (operation.some(i => i === name)) return true
  else return false
}


/**
 * @description 根据权限表生成树结构
 */
export const toTree = (data) => {
  if (!data) return []
  let map = {}
  data.forEach(item => {
    map[item.id] = item
  })

  let val = []
  data.forEach(item => {
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
export class CheckTreeData {
  constructor ({
    permissionCode,
    status,
    frontFlag
  }) {
    (this.permissionCode = permissionCode), (this.status = status), (this.frontFlag = frontFlag);
  }
}


// 判断当前页面是否存在缓存
export const hasLocalData = (pageName) => {
  const data = getLocal('menuTags')
  if (data) {
    return data.some(item => item.name === pageName)
  } else {
    return false
  }
}

export const loadJS = (url, callback) => {
  var script = document.createElement('script'),
    fn = callback || function () {};
  script.type = 'text/javascript';
  //IE
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == 'loaded' || script.readyState == 'complete') {
        script.onreadystatechange = null;
        fn();
      }
    };
  } else {
    //其他浏览器
    script.onload = function () {
      fn();
    };
  }
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}
import { downloadFileCode } from '@/api/dealManagement/updatedealList';
export const handleDownloadCJTemplate = () => {
  downloadFileCode().then(res => {
    if (res.code === '200') {
      const fileCode = res.data.data[0].fileCode
      window.location.href = `/api/fileupload/download?fileCode=${fileCode}`;
    }
  })
}
