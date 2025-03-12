import '@/common/js/lib-flexible/flexible'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import mixin from '@/util/mixin';
import installElementPlus from './plugins/element'
import 'element-plus/dist/index.css'
import '@/common/css/reset.scss';
import '@/common/css/resetElementUi.scss';
import '@/common/css/animated.scss';

// 创建应用实例
const app = createApp(App);

// 安装插件（全局组件、自定义指令等）
installElementPlus(app)

// 安装 store 和 router
app.use(store)
app.use(router)
app.mixin(mixin)

// router 准备就绪后挂载应用
router.isReady().then(() => {
    console.log('isReady')
    app.mount("#app")
})
