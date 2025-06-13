export default defineAppConfig({
  pages: [
    // 项目首页地址
    // 'pages/index/index',
    // 登录
    'pages/login/index',
    // 我的
    'pages/mine/index',
    // 项目列表
    'pages/programList/index',
    'pages/programList/programAdd/index',
    // 项目详情
    'pages/programDetail/index',
    'pages/programDetail/dailyMattersAdd/index',
    // 修改密码
    'pages/updatePassword/index',
  ],
  permission: {
    'scope.userLocation': {
      desc: '您的位置信息将用于提供定位服务', // 高速公路行驶持续后台定位
    },
  },
  subpackages: [
    // {
    //   root: 'pages/programDetail/',
    //   pages: [
    //     // 新增事项
    //     'index',
    //     'dailyMattersAdd/index',
    //   ],
    // },
  ],
  // requiredPrivateInfos: ['onLocationChange', 'startLocationUpdateBackground'],
  requiredBackgroundModes: ['location'],
  window: {
    navigationBarTextStyle: 'white',
    navigationBarTitleText: '实施进度管理',
    navigationBarBackgroundColor: '#263892',
    backgroundColor: '#263892',
    enablePullDownRefresh: false,
    navigationStyle: 'custom',
  },
  lazyCodeLoading: 'requiredComponents',
})
