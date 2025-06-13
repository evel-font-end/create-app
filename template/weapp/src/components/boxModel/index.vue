<template>
  <!-- 设备信息 -->
  <view class="boxModelBox">
    <view class="boxModel" v-for="(item, i) in list" :key="i" @click="clickModel(item)">
      <image class="boxModel_bg" :src="item.bg" />
      <view class="name">{{ item.name }}</view>
      <image class="icon" :src="item.icon" />
    </view>
  </view>
</template>

<script>
import { ref, defineProps } from 'vue'
import './index.scss'

export default {
  name: 'demoView',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    // 点击事件
    const clickModel = function (item) {
      emit('clickModel', item)
    }

    return {
      clickModel,
    }
  },
}
</script>
