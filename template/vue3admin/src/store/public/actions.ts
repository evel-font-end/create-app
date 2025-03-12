// import router from '../../router'
import { saveLocal, hasChild } from '../../util/tool'
import { toTree } from '../../util/util'
import { getuserRoleMeanList } from '../../api/user'
// import { Notification } from 'element-plus';
// import { setTimeout } from 'timers';
// import { routesMap } from 'router/components';
// 登录成功获取当前用户可访问的路由信息,添加路由表信息
let whiteList = ['index', 'test', 'about', 'login', 'indexPage', 'baseManage', 'baseDataBoard', 'lightSwitch', 'faultHistory', 'systemManage', 
'tacticsSet', 'smartPlaces', 'wistomPatrol', 'deviceStatus', 'userList', 'roleManage']// 默认白名单


export const getWhiteList = () => {
  return whiteList
}

export const getUserRoleRouter = ({ commit, state, getters }: any, username: any) => {
  return new Promise<void>((resolve, reject) => {
    try {
      // 此处后续添加获取当前登录用户所拥有的访问页面权限
      getuserRoleMeanList(username).then((res:any) => {
        if (res.code === '200') {
          // 添加路由前需要重构结构
          let list = creatMenuByRouters(meanMap(res.data.mergedPermissions));
          function creatMenuByRouters(list: any[]) {
            list.forEach((item: { permissionCode: any; operation: any; children: any; }, index: any) => {
              if (!hasChild(item)) {
                commit('set_meanOperation', { key: item.permissionCode, value: item.operation })
              } else {
                creatMenuByRouters(item.children)
              }
            })
          }

          let whiteRouterList = Array.from(new Set(whiteList.concat(whiteList))) // whritRouterList去重
          // console.log('whiteList', whiteList);
          // let whiteRouterList = whiteList
          commit('set_whritRouterList', whiteRouterList)
          saveLocal('whiteRouterList', whiteRouterList)
          saveLocal('meanOperation', state.meanOperation)

          resolve()
        } else {
          /* Notification.error({
            title: '失败',
            message: '网络故障登录失败,请重新登录',
            position: 'bottom-right'
          }); */
          setTimeout(() => {
            commit('user/outUserLogin')
          }, 2000)
          reject(res.message)
        }
      }).catch(err => {
        /* Notification.error({
          title: '失败',
          message: '网络故障登录失败,请重新登录',
          position: 'bottom-right'
        }); */
        setTimeout(() => {
          commit('user/outUserLogin')
        }, 2000)

        reject(err)
      })
    } catch (err) {
      /* Notification.error({
        title: '失败',
        message: '网络故障登录失败,请重新登录',
        position: 'bottom-right'
      }); */
      setTimeout(() => {
        commit('user/outUserLogin')
      }, 2000)
      reject(err)
    }
  })
}

function toLine(name: string) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase();
}

const btnPermissionTypes = ['Search', 'Add', 'Edit', 'Detail', 'Deletel', 'Register', 'Export', 'Control', 'Set', 'Approval', 'Import', 'Auth', 'Remind', 'Update', 'Play', 'DisEnable', 'Enable'];
function meanMap(list: any[]) {
  if (!list) return []
  let map: any = {}
  list.forEach((item: { id: string | number; }) => {
    map[item.id] = item
  });

  let val: any[] = [];
  list.forEach((item: { parentId: string | number; permissionLevel: number; permissionCode: any; }) => {
    let par = map[item.parentId];
    if (par) {
      if (item.permissionLevel === 2) {
        // 根据permissionCode分割，取第二个字符
        let itemPermissionCode = toLine(item.permissionCode);
        if (itemPermissionCode.indexOf('_') > -1) {
          itemPermissionCode = itemPermissionCode.split('_')[1];
          const str = (itemPermissionCode.substring(0, 1).toUpperCase() + itemPermissionCode.substring(1));
          if (btnPermissionTypes.indexOf(str) > -1) {
            itemPermissionCode = str
          } else {
            itemPermissionCode = item.permissionCode
          }
        }
        (par.operation || (par.operation = [])).push(itemPermissionCode)
      } else {
        (par.children || (par.children = [])).push(item)
      }
    } else {
      val.push(item)
    }
    if (item.permissionLevel) {
      const permissionCode = item.permissionCode;
      whiteList.push(permissionCode)
    }
  })
  return val
}

export default getUserRoleRouter
