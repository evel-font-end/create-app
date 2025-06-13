<template>
  <!-- 通告栏组件 -->
  <AtNoticebar class="notice-bar-box" icon="volume-plus" marquee :speed="30">
    <view class="notice-cont-box">
      <view
        class="notice-detail"
        @click="gotoDetail(item)"
        v-for="(item, index) in list"
        :key="index"
      >
        {{ item.value }}
      </view>
    </view>
  </AtNoticebar>
</template>

<script>
import { AtNoticebar } from 'taro-ui-vue3'
import 'taro-ui-vue3/dist/style/components/noticebar.scss'
import Taro from '@tarojs/taro'
import './index.scss'

export default {
  name: 'toastVue',
  components: {
    AtNoticebar,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const gotoDetail = (item) => {
      let goUrl =
        item.type === 'yj'
          ? '/pages/pagesFireList/hzList/index'
          : item.type === 'gz'
          ? '/pages/pagesFaultManage/manage/index'
          : item.type === 'gd'
          ? '/pages/pagesOrderList/orderList/index'
          : ''
      Taro.navigateTo({
        url: goUrl,
      })
    }
    return {
      gotoDetail,
    }
  },
}
</script>
