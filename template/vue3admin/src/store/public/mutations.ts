import { hasValue, saveLocal, getLocal, delLocal } from '../../util/tool'
import Config from '@/config';
const mustions: any = {
  set_addRoutes(state: { addRoutes: any[]; }, routes: any) {
    state.addRoutes = [...routes]
  },
  // 当前是否已经挂在了路由列表
  set_hasRouterlist (state: { hasRouterlist: any; }, flag: any) {
    state.hasRouterlist = flag
  },
  // 当前已打开的路由便签
  set_menuTags (state: { keepAliveRouter: string | any[]; menuTags: any[]; }, list: { name: any; }) {
    const delKeepAliveName = state.keepAliveRouter.indexOf(list.name)

    if (!hasValue('name', list.name, state.menuTags)) {
      state.menuTags.push(list);
      saveLocal('menuTags', state.menuTags)
      if (delKeepAliveName === -1) {
        // state.keepAliveRouter.push(list.name)
        // saveLocal('keepAliveRouter', state.keepAliveRouter)
      }
    }
  },
  //
  set_hasOpenIndex (state: { hasOpenIndex: any; }, status: any) {
    state.hasOpenIndex = status
  },
  // 重置当前已打开的路由便签 (关闭全部 / 关闭其他)
  set_menuTagsList (state: { closeAllTab: boolean; openPage: any; menuTags: any; keepAliveRouter: any[]; }, list: string | any[]) {
    let keepName: any[] = [], tabs: string | any[] = [];
    state.closeAllTab = true
    if (list.length) {
      keepName = [state.openPage]
      tabs = list
    }

    state.menuTags = tabs
    state.keepAliveRouter = keepName
    saveLocal('keepAliveRouter', keepName) // 缓存当前keep-live路由名单
    saveLocal('menuTags', tabs) // 当前打开的tabs菜单
  },
  // 当前是否点击了关闭全部tab
  set_closeAllTab (state: { closeAllTab: any; }, status: any) {
    state.closeAllTab = status
  },
  // 删除当前储存vuex路由标签
  set_delMenuTage (state: { menuTags: any[]; keepAliveRouter: any[]; openPage: any; }, name: any) {
    let list = []
    list = [...state.menuTags]

    // 删除缓存
    const delKeepAliveName = state.keepAliveRouter.indexOf(name)
    if (delKeepAliveName > -1) {
      state.keepAliveRouter.splice(delKeepAliveName, 1);
      saveLocal('keepAliveRouter', state.keepAliveRouter)
    }


    for (let i in list) {
      if (list[i].name === name) {
        let j = parseInt(i)
        let goNextTage = list[j + 1] ? list[j + 1].name : (list[j - 1] ? list[j - 1].name : Config.homeName)
        if (state.openPage === name) state.openPage = goNextTage
        list.splice(Number(i), 1)
        state.menuTags = list
        saveLocal('menuTags', list)
        return
      }
    }
  },
  set_openPage (state: { openPage: any; }, name: any) {
    state.openPage = name
    saveLocal('openPage', name)
  },
  set_loadingCont (state: { loadingCont: any; }, flag: any) {
    if (flag !== state.loadingCont) {
      state.loadingCont = flag
    }
  },
  set_meanOperation (state: { meanOperation: { set: (arg0: any, arg1: any) => void; }; }, { key, value }: any) {
    state.meanOperation.set(key, value)
  },
  set_whritRouterList (state: { whiteRouterList: any; }, list: any) {
    state.whiteRouterList = list
  },
  // 设置全局参数
  set_common (state: { common: any; }, option: any) {
    const data = getLocal('common');
    state.common = {
      ...data,
      ...option
    };
    saveLocal('common', state.common)
  },
  // 设置全局参数
  set_appCodes (state: { appCodes: any; }, option: any) {
    const data = getLocal('appCodes');
    state.appCodes = {
      ...data,
      ...option
    };
    saveLocal('appCodes', state.appCodes)
  },
  set_checkNode (state: { checkNode: any; }, option: { checkNode: any; }) {
    state.checkNode = option.checkNode;
  },
  // 设置新大屏全局参数
  set_bigScreenNew (state: { bigScreenNew: any; }, option: any) {
    const data = getLocal('bigScreenNew');
    state.bigScreenNew = {
      ...data,
      ...option
    };
    saveLocal('bigScreenNew', state.bigScreenNew)
  },
  del_bigScreenNew (state: { bigScreenNew: {}; }, option: any) {
    state.bigScreenNew = {}
    delLocal('bigScreenNew')
  },
  // 设置动态路由参数
  set_dynamicMenuList (state: { dynamicMenuList: any; }, option: any) {
    state.dynamicMenuList = {
      // ...status,
      ...state,
      ...option
    }
  },
  // 设置全局参数
  set_updateTime (state: { updateTime: any; }, option: any) {
    const data = getLocal('updateTime');
    state.updateTime = {
      ...data,
      ...option
    };
    saveLocal('updateTime', state.updateTime)
  },
  set_toiltReginID (state: { toiltReginID: any; }, id: any) {
    state.toiltReginID = id
  }
}

export default mustions
