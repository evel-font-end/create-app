import state from "./state.js";
import routes from '../../router/router'
// import routers from '../../router/index'
import { creatMenuByRouters } from '../../util/util'

export const addRoutes = (state: { addRoutes: any; }, getters: any, rootState: any) => state.addRoutes

export const menuList = (state: { addRoutes: any; whiteRouterList: any; meanOperation: any; }, getters: any, rootState: any) => creatMenuByRouters(routes, state.whiteRouterList, state.meanOperation)  // 创建左侧菜单

export const menuTags = (state: { menuTags: any; }, getters: any, rootState: any) => state.menuTags    // 根据当前左侧菜单选中的值创建tags数组

export const openPage = (state: { openPage: any; }, getters: any, rootState: any) => state.openPage   // 当前打开的页面

export const loadingCont = (state: { loadingCont: any; }, getters: any, rootState: any) => state.loadingCont    // 窗体内部加载

export const keepAliveName = (state: { keepAliveRouter: any; }, getters: any, rootState: any) => state.keepAliveRouter    // 窗体内部加载

export const closeAllTab = (state: { closeAllTab: any; }, getters: any, rootState: any) => state.closeAllTab    // 当前是否点击了关闭全部tab (记录清空操作放在首页进行,没有缓存下首页打开有需要时间,会有卡顿情况)
export const hasOpenIndex = (state: { hasOpenIndex: any; }, getters: any, rootState: any) => state.hasOpenIndex    // 当前是否已经打开过首页存在缓存
export const common = (state: { common: any; }, getters: any, rootState: any) => state.common
export const appCodes = (state: { appCodes: any; }, getters: any, rootState: any) => state.appCodes
export const checkNode = (state: { checkNode: any; }, getters: any, rootState: any) => state.checkNode
export const bigScreenNew = (state: { bigScreenNew: any; }, getters: any, rootState: any) => state.bigScreenNew
export const updateTime = (state: { updateTime: any; }, getters: any, rootState: any) => state.updateTime
export const toiltReginID = (state: { toiltReginID: any; }, getters: any, rootState: any) => state.toiltReginID // 厕所当前经纬度


