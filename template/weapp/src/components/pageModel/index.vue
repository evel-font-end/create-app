<template>
  <!-- 注销登录 -->
  <view class="pageModel" @click="clickBtn">
    <navBar :onBack="onBack" />
    <view class="content">
      <slot></slot>
    </view>
    <tabBar v-if="ButtomBtn && ButtomBtn.length > 0" :current="1" />
  </view>
</template>

<script>
import './index.scss'
import navBar from '@/components/navBar/index.vue'
import tabBar from '@/components/tabBar/index.vue'
import Taro from '@tarojs/taro'

export default {
  name: 'pageModelView',
  components: {
    navBar,
    tabBar,
  },
  props: {
    ButtomBtn: {
      type: Array,
    },
    isOnLoad: {
      type: Boolean,
      default: true,
    },
    isGoTOHome: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const onBack = () => {
      if (props.isGoTOHome) {
        Taro.redirectTo({
          url: '/pages/pagesDevice/devicePage/index',
        })
        return
      }

      const pages = Taro.getCurrentPages()
      if (pages.length >= 2) {
        if (props.isOnLoad) {
          Taro.navigateBack({
            delta: 1, // 默认值是1，表示返回的页面层数
            success: () => {
              const page = Taro.getCurrentPages().pop()
              if (!page) return
              page.onLoad()
            },
          })
        } else {
          Taro.navigateBack({
            delta: 1, // 默认值是1，表示返回的页面层数
          })
        }
      } else {
        Taro.navigateBack({
          delta: 10,
          success: () => {
            const page = Taro.getCurrentPages().pop()
            if (!page) return
            page.onLoad()
          },
        })
      }
    }
    return {
      onBack,
    }
  },
}
</script>
