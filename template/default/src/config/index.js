export default {
  cookieExpires: 1, // token在Cookie中存储的天数，默认1天,
  homeName: 'indexPage', // 默认打开的首页的路由name值，默认为index
  bidderHomeName: 'indexPage', // 默认打开的首页的路由name值，默认为index
  // api请求默认前缀
  baseURL: {
    dev: '',
    pro: 'http://134.175.65.137:8011' // 线上测试服
    // pro: 'http://134.175.65.137:8011' // 线上测试服
  }
}
