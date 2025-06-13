<template>
  <view class="flex tabBar">
    <view class="flex flexRow flexJustifyCenter at-tab-bar at-tab-bar--fixed">
      <view
        class="flex flexColumn flexItem at-tab-bar__item"
        v-for="(item, index) in state.menuList"
        :key="item.title"
        :class="current === index ? 'active' : ''"
        @click="() => switchTab(index)"
      >
        <view class="flex flexCenter at-tab-bar__icon">
          <AtIcon prefixClass="icon" :value="item.icon" color="#BDC8D8" class="iconfont"></AtIcon>
        </view>
        <view class="flex flexCenter at-tab-bar__title">{{ item.title }} </view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { ref, reactive } from 'vue'
import { AtIcon } from 'taro-ui-vue3'
import './index.scss'

export default {
  name: 'tabBar',
  components: {
    AtIcon,
  },
  props: {
    current: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const state = reactive({
      menuList: [
        { title: '项目', icon: 'baogaoliebiao' },
        { title: '我的', icon: 'wode' },
        // { title: '工作台', icon: 'gongzuotai06' },
        // { title: '首页', icon: 'zhuye' },
      ],
    })

    // 打开开发者控制台弹窗
    const switchTab = value => {
      if (value === state.current) return
      state.current = value
      if (value === 0) {
        Taro.reLaunch({
          url: '/pages/programList/index',
        })
      } else if (value === 1) {
        Taro.reLaunch({
          url: '/pages/mine/index',
        })
      // } else if (value === 2) {
      //   Taro.reLaunch({
      //     url: '/pages/pagesWorkbenches/workHome/index',
      //   })
      // } else if (value === 3) {
      //   Taro.reLaunch({
      //     url: '/pages/index/index',
      //   })
      }
    }
    return {
      state,
      switchTab,
    }
  },
}
</script>
