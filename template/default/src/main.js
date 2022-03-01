// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
// import Vue from 'vue'
// import axios from 'axios';
import App from './App'
import router from './router'
import store from '@/store'
import ElementUI from 'element-ui'
import mixin from "util/mixin"
import echarts from 'echarts'

require('!style-loader!css-loader!less-loader!common/css/reset.less') // 重置全局默认样式
require('!style-loader!css-loader!less-loader!common/css/resetElementUi.less') // 重置饿了么某部分样式


require('util/prototype')

// axios.defaults.headers.common['Cookie'] = 'ssss';

Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.mixin(mixin)
/* eslint-disable no-new */

// Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

// new Vue({
//   el: '#app',
//   router,
//   store,
//   components: {
//     App
//   },
//   template: '<App/>'
// })
let vueInstance = new Vue({
  router,
  store,
  components: {
    App
  },
  render: h => h(App)
}).$mount('#app')
window.onbeforeunload = function () {
  vueInstance.$destroy();
}
