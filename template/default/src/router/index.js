import Vue from 'vue'
import VueRouter from 'vue-router';
import Config from '@/config'
import routes from './routers.js'
import { getLocal, delLocal, saveLocal, hasOneOf } from 'util/tool'
import { creatMenuByRouters } from 'util/util'
import store from '@/store'
// 重写路由的push方法
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return routerPush.call(this, location, onResolve, onReject);
  return routerPush.call(this, location);
};

Vue.use(VueRouter)

const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  // base: Config.baseURL,
  routes: routes
})

const router = createRouter()

let meanOperation, whritRouterList; // 用户权限 && 白名单
router.beforeEach(async (to, from, next) => {
  // alert(to.name + ' ' + to.path)
  const userInfo = store.state.user.username;
  store.commit('set_loadingCont', true);
  if (!userInfo) {
    delLocal('menuTags') // page
    delLocal('whritRouterList') // 可访问页面白名单
    delLocal('meanOperation') // 当前页面权限
  } else {
    meanOperation = getLocal('meanOperation') // 用户权限
    whritRouterList = getLocal('whritRouterList') // 白名单
  }

  if (userInfo && store.state.meanOperation.size === 0) {
    if (meanOperation && meanOperation.length > 0) {
      meanOperation.forEach(item => {
        store.commit('set_meanOperation', { key: item[0], value: item[1] })
      })
    }
  }
  if ((!userInfo && to.name !== 'login')) {
    // 未登录且要跳转的页面不是登录页
    saveLocal('pushName', to.name);
    if (to.name == 'newToiltDetail' || to.name == 'newToiltMap' || to.name == 'toiltMap' || to.name == 'toiltDetail') {
      // 未登录时也可以进入公厕对应的两个页面
      next()
    } else {
      next({
        name: 'login' // 跳转到登录页
      })
    }
  } else if ((!userInfo && to.name === 'login')) {
    // 未登陆且要跳 转的页面是登录页
    next() // 跳转
  } else if (userInfo && to.path == '/') {
    // 重定向首页
    next({
      name: Config.homeName
    })
  } else if (userInfo && to.name === 'login') {
    // 已登录且要跳转的页面是登录页
    if (meanOperation && whritRouterList) {
      // 已有权限表跟可访问的白名单
      next()
    } else {
      store.dispatch('getUserRoleRouter', userInfo).then(res => {
        next({
          name: Config.homeName // 跳转到homeName页
        })
      })
    }

    store.commit('set_openPage', Config.homeName)
  } else {
    if (meanOperation && whritRouterList) {
      const toName = to.name;
      if (whritRouterList.some(name => name === toName)) {
        // const openPage = getLocal('openPage');
        next()
        store.commit('set_openPage', toName)
      } else {
        next({ name: Config.homeName })
      }
    } else {
      store.dispatch('getUserRoleRouter', userInfo).then(res => {
        next({ path: to.path })
      })
    }
  }
})

router.afterEach((to, from) => {
  store.commit('set_loadingCont', false)
})


export default router
