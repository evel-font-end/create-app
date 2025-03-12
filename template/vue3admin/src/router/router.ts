import type { RouteRecordRaw } from "vue-router"
import { createRouter, createWebHashHistory } from 'vue-router'
import AdminView from '@/components/adminView/main.vue';
import Login from '@/components/login/login.vue'

const routes: RouteRecordRaw[] = [
  { path: '/indexPage', redirect: '/home' },
  {
    path: '/',
    component: AdminView,
    redirect: '/home',
    name: 'index',
    meta: {
      hideInMenu: true,
      title: '首页',
      icon: 'iconfont icon-home',
      breadcrumb: true,
      leaf: true,
    },
    children: [{
      path: "home",
      name: "home",
      component: () =>
        import('views/Home.vue'),
      meta: {
        title: "首页",
        icon: "iconfont icon-dot",
        breadcrumb: true
      },
    }]
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      hideInMenu: true,
      hidden: true,
      title: '登录',
      icon: 'iconfont icon-home'
    },
  },
  {
    path: '/baseManage',
    name: 'baseManage',
    component: AdminView,
    meta: {
      hideInMenu: false,
      title: '基础管理',
      icon: 'iconfont icon-jichuguanli',
      breadcrumb: true,
      leaf: true,
    },
    children: [
      {
        path: "baseDataBoard",
        name: "baseDataBoard",
        component: () =>
          import('views/baseManage/baseDataBoard/index.vue'),
        meta: {
          title: "数据看板",
          icon: "iconfont icon-dot",
          breadcrumb: true
        },
      },
      {
        path: "deviceStatus",
        name: "deviceStatus",
        component: () =>
          import('views/baseManage/deviceStatus/index.vue'),
        meta: {
          title: "智能设备状态",
          icon: "iconfont icon-dot",
          breadcrumb: true
        },
      }, {
        path: "wistomPatrol",
        name: "wistomPatrol",
        component: () =>
          import('views/baseManage/wistomPatrol/index.vue'),
        meta: {
          title: "智能巡检",
          icon: "iconfont icon-dot",
          breadcrumb: true
        },
      }, {
        path: "lightSwitch",
        name: "lightSwitch",
        component: () =>
          import('views/baseManage/lightSwitch/index.vue'),
        meta: {
          title: "智能灯光开关",
          icon: "iconfont icon-dot",
          breadcrumb: true
        },
      }, {
        path: "faultHistory",
        name: "faultHistory",
        component: () =>
          import('views/baseManage/faultHistory/index.vue'),
        meta: {
          title: "故障记录",
          icon: "iconfont icon-dot",
          breadcrumb: true
        },
      }]
  }, {
    path: '/systemManage',
    name: 'systemManage',
    component: AdminView,
    meta: {
      hideInMenu: false,
      title: '系统管理',
      icon: 'iconfont icon-xitongguanli',
      breadcrumb: true
    },
    children: [{
      path: "tacticsSet",
      name: "tacticsSet",
      component: () =>
        import('views/systemManage/tacticsSet/index.vue'),
      meta: {
        title: "策略设置",
        icon: "iconfont icon-dot",
        breadcrumb: true
      },
    }, {
      path: "smartPlaces",
      name: "smartPlaces",
      component: () =>
        import('views/systemManage/smartPlaces/index.vue'),
      meta: {
        title: "智能场所设置",
        icon: "iconfont icon-dot",
        breadcrumb: true
      },
    }, {
      path: "userList",
      name: "userList",
      component: () =>
        import('views/systemManage/userList/index.vue'),
      meta: {
        title: "用户管理",
        icon: "iconfont icon-dot",
        breadcrumb: true
      },
    },
    {
      path: "roleManage",
      name: "roleManage",
      component: () =>
        import('views/systemManage/roleManage/index.vue'),
      meta: {
        title: "角色管理",
        icon: "iconfont icon-dot",
        breadcrumb: true
      },
    }
    ]
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  // base: process.env.BASE_URL,
  routes: (routes as unknown) as RouteRecordRaw[]
})

export default routes
