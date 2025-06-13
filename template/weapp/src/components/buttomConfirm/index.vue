<template>
  <!-- 注销登录 -->
  <view class="btnModel">
    <view class="btn quxiao" @click="quxiao">{{ backText }}</view>
    <view class="btn queren" @click="queren">{{ text }}</view>
  </view>
</template>

<script>
import { ref, defineProps, watch } from 'vue'
import './index.scss'

export default {
  name: 'BottomView',
  props: {
    text: {
      type: String,
      default: '确认',
    },
    backText: {
      type: String,
      default: '取消',
    },
  },
  setup(props, { emit }) {
    // 确认
    const queren = function () {
      emit('next')
    }

    // 取消
    const quxiao = function () {
      emit('close')
    }

    return {
      quxiao,
      queren,
    }
  },
}
</script>
