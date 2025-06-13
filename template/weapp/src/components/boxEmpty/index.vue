<template>
  <!-- 人物介绍 -->
  <view class="boxEmpty">
    <image class="boxEmpty-images" :src="imagesRequire('/boxEmpty/empty.png')" />
    <view class="boxEmpty-text"> {{ text }} </view>
  </view>
</template>

<!-- <style lang="scss" scoped>
@import "./index.scss";
</style> -->

<script>
import { ref, defineProps } from 'vue'
import './index.scss'
import { imagesRequire } from '@/utils/require'

export default {
  name: 'boxEmpty',
  props: {
    text: {
      type: String,
      default: '暂无数据',
    },
  },
  setup() {
    return {
      imagesRequire,
    }
  },
}
</script>
