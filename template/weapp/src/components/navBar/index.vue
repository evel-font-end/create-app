<template>
  <View
    :class="`lxy-nav-bar ${state.configStyle.ios ? 'ios' : 'android'} ${extClass} ${
      overlayMode ? 'lxy-nav-bar--overlay' : ''
    }`"
    :style="`height:${
      overlayMode
        ? 0
        : state.configStyle.navBarHeight + state.configStyle.navBarExtendHeight < 60
        ? 68
        : state.configStyle.navBarHeight + state.configStyle.navBarExtendHeight
    }px;`"
  >
    <View
      :class="`lxy-nav-bar__inner ${state.configStyle.ios ? 'ios' : 'android'}`"
      :style="state.configStyle.navigationbarinnerStyle"
    >
      <View className="lxy-nav-bar__left" :style="state.configStyle.navBarLeft">
        <AtIcon
          v-if="navBack && !navHome"
          @click="handleBackClick"
          value="chevron-left"
          size="22"
          color="#fff"
          :class="`lxy-nav-bar__button lxy-nav-bar__btn_goback`"
        ></AtIcon>
        <AtIcon
          v-if="!navBack && navHome"
          @click="handleGoHomeClick"
          value="home"
          size="22"
          color="#fff"
          :class="`lxy-nav-bar__button lxy-nav-bar__btn_gohome`"
        ></AtIcon>
        <View
          :class="`lxy-nav-bar__buttons ${state.configStyle.ios ? 'ios' : 'android'}`"
          v-if="navBack && navHome"
        >
          <AtIcon
            @click="handleBackClick"
            value="chevron-left"
            size="22"
            color="#Fff"
            class="lxy-nav-bar__button lxy-nav-bar__btn_goback"
          ></AtIcon>
          <AtIcon
            @click="handleGoHomeClick"
            value="home"
            size="22"
            color="#Fff"
            class="lxy-nav-bar__button lxy-nav-bar__btn_gohome"
          ></AtIcon>
        </View>
        <slot name="left"></slot>
      </View>
      <View className="lxy-nav-bar__center">
        {{ center }}
      </View>
      <View
        className="lxy-nav-bar__right"
        :style="`margin-right: ${state.configStyle.rightDistance}px`"
      >
        <View></View>
      </View>
    </View>
  </View>
</template>

<script>
import Taro from '@tarojs/taro'
import { reactive, onMounted, watch } from 'vue'
import { isFunction } from '@/utils/common.ts' //判断是否为函数，可以用loadsh的_isFunction,也可以自己封装。
import './index.scss'

import { AtIcon } from 'taro-ui-vue3'
const getSystemInfo = () => {
  const getSystemInfo = Taro.getStorageSync('systemInfo')
  if (getSystemInfo && (!!getSystemInfo.model || !!getSystemInfo.system)) {
    return getSystemInfo
  } else {
    // h5环境下忽略navbar
    // if (!isFunction(Taro.getSystemInfoSync)) {
    //  return null;
    // }
    let systemInfo = Taro.getSystemInfoSync() || {
      model: '',
      system: '',
    }
    let ios = !!(systemInfo.system.toLowerCase().search('ios') + 1)
    let rect
    try {
      rect = Taro.getMenuButtonBoundingClientRect ? Taro.getMenuButtonBoundingClientRect() : null
      if (rect === null) {
        throw 'getMenuButtonBoundingClientRect error'
      }
      //取值为0的情况 有可能width不为0 top为0的情况
      if (!rect.width || !rect.top || !rect.left || !rect.height) {
        throw 'getMenuButtonBoundingClientRect error'
      }
    } catch (error) {
      let gap //胶囊按钮上下间距 使导航内容居中
      let width = 96 //胶囊的宽度
      if (systemInfo.platform === 'android') {
        gap = 8
        width = 96
      } else if (systemInfo.platform === 'devtools') {
        if (ios) {
          gap = 5.5 //开发工具中ios手机
        } else {
          gap = 7.5 //开发工具中android和其他手机
        }
      } else {
        gap = 4
        width = 88
      }
      if (!systemInfo.statusBarHeight) {
        //开启wifi的情况下修复statusBarHeight值获取不到
        systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20
      }
      rect = {
        //获取不到胶囊信息就自定义重置一个
        bottom: systemInfo.statusBarHeight + gap + 32,
        height: 32,
        left: systemInfo.windowWidth - width - 10,
        right: systemInfo.windowWidth - 10,
        top: systemInfo.statusBarHeight + gap,
        width: width,
      }
    }
    // 处理政务微信获取胶囊不准问题
    var gap
    if (systemInfo.platform === 'android') {
      gap = 8
    } else if (systemInfo.platform === 'devtools') {
      if (ios) {
        gap = 5.5 //开发工具中ios手机
      } else {
        gap = 7.5 //开发工具中android和其他手机
      }
    } else {
      gap = 4
    }
    let navBarHeight = ''
    if (!systemInfo.statusBarHeight) {
      //开启wifi和打电话下
      systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20
      navBarHeight = (function () {
        let newGap =
          rect.top > systemInfo.statusBarHeight ? rect.top - systemInfo.statusBarHeight : gap
        return 2 * newGap + rect.height
      })()
      systemInfo.statusBarHeight = 0
      systemInfo.navBarExtendHeight = 0 //下方扩展4像素高度 防止下方边距太小
    } else {
      navBarHeight = (function () {
        let newGap =
          rect.top > systemInfo.statusBarHeight ? rect.top - systemInfo.statusBarHeight : gap
        return systemInfo.statusBarHeight + 2 * newGap + rect.height
      })()
      if (ios) {
        systemInfo.navBarExtendHeight = 4 //下方扩展4像素高度 防止下方边距太小
      } else {
        systemInfo.navBarExtendHeight = 0
      }
    }
    systemInfo.navBarHeight = navBarHeight //导航栏高度不包括statusBarHeight
    systemInfo.capsulePosition = rect //右上角胶囊按钮信息bottom: 58 height: 32 left: 317 right: 404 top: 26 width: 87 目前发现在大多机型都是固定值 为防止不一样所以会使用动态值来计算nav元素大小
    systemInfo.ios = ios //是否ios
    Taro.setStorageSync('systemInfo', systemInfo) //将信息保存到全局变量中,后边再用就不用重新异步获取了
    return systemInfo
  }
}
export default {
  name: 'CNavBar',
  components: {
    AtIcon,
  },
  props: {
    list: {
      type: Array,
    },
    title: {
      type: Array,
    },
    nameWidth: {
      type: String,
    },
    valueNoOverflow: {
      type: Boolean,
    },
    back: {
      type: Boolean,
      default: true,
    },
    onBack: {
      type: Function,
    },
    extClass: {
      type: String,
      default: '',
    },
    overlayMode: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const state = reactive({
      globalSystemInfo: null,
      configStyle: {
        navigationbarinnerStyle: null,
        navBarLeft: null,
        navBarHeight: null,
        capsulePosition: null,
        ios: null,
        rightDistance: null,
      },
    })

    let current = reactive(Taro.getCurrentInstance())

    // 初始化执行
    onMounted(() => {
      state.globalSystemInfo = getSystemInfo()
    })
    watch(
      () => state.globalSystemInfo,
      val => {
        state.configStyle = setStyle(val)
      }
    )
    const handleBackClick = () => {
      if (isFunction(props.onBack)) {
        props.onBack()
      } else {
        const pages = Taro.getCurrentPages()
        if (pages.length >= 2) {
          Taro.navigateBack({
            delta: 1,
          })
        } else {
          Taro.navigateBack({
            delta: 10,
          })
        }
      }
    }
    const handleGoHomeClick = () => {
      if (isFunction(props.onHome)) {
        props.onHome()
      } else {
        const pages = Taro.getCurrentPages()
        if (pages.length >= 2) {
          Taro.navigateBack({
            delta: 11,
          })
        } else {
          Taro.reLaunch({
            url: '/pages/pagesDevice/devicePage/index',
          })
        }
      }
    }
    const setStyle = systemInfo => {
      const {
        statusBarHeight,
        navBarHeight,
        capsulePosition,
        navBarExtendHeight,
        ios,
        windowWidth,
      } = systemInfo
      const { back, home, title, color } = props
      let rightDistance = windowWidth - capsulePosition.right - 20 //胶囊按钮右侧到屏幕右侧的边距
      let leftWidth = windowWidth - capsulePosition.left - 20 //胶囊按钮左侧到屏幕右侧的边距

      let navigationbarinnerStyle = [
        `color:${color}`,
        //`background:${background}`,
        `height:${
          navBarHeight + navBarExtendHeight < 60 ? 68 : navBarHeight + navBarExtendHeight
        }px`,
        `padding-top:${statusBarHeight}px`,
        `padding-right:${leftWidth}px`,
        `padding-left:${leftWidth}px`,
        `padding-bottom:${navBarExtendHeight}px`,
      ].join(';')
      let navBarLeft
      if ((back && !home) || (!back && home)) {
        navBarLeft = [
          `width:${capsulePosition.width}px`,
          `height:${capsulePosition.height}px`,
          `margin-left:0px`,
          `margin-right:${rightDistance}px`,
        ].join(';')
      } else if ((back && home) || title) {
        navBarLeft = [
          `width:${capsulePosition.width}px`,
          `height:${capsulePosition.height}px`,
          `margin-left:0px`,
        ].join(';')
      } else {
        navBarLeft = [`width:auto`, `margin-left:0px`].join(';')
      }
      return {
        navigationbarinnerStyle,
        navBarLeft,
        navBarHeight,
        capsulePosition,
        navBarExtendHeight,
        ios,
        rightDistance,
      }
    }

    return {
      state,
      navBack: props.back,
      navHome: props.home,
      // extClass: props.extClass,
      center: props.title ? props.title : current?.page?.config?.navigationBarTitleText,
      handleBackClick,
      handleGoHomeClick,
    }
  },
}
</script>
