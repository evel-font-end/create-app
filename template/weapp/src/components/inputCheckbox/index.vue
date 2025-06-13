<template>
  <view class="inputCheckbox">
    <!-- input组件中得单选组件 -->
    <view
      class="inputRadio"
      v-for="(item, i) in menuList"
      :key="i"
      :class="{ check: modelValue === item.value }"
      @click="clickRadio(item)"
    >
      <view class="icon"></view>
      <view class="name">{{ item.name }}</view>
    </view>
  </view>
</template>

<script>
import { ref, defineProps } from 'vue'
import './index.scss'

export default {
  name: 'demoView',
  props: {
    modelValue: {
      type: Boolean,
    },
    menuList: {
      type: String,
    },
  },
  watch: {
    modelValue() {},
  },
  setup(props, { emit }) {
    const msg = ref('Hello world')

    // 打开开发者控制台弹窗
    const openWindow = function () {}

    const clickRadio = function (item) {
      emit('update:modelValue', item.value)
      emit('change', item.value, item)
    }

    return {
      msg,
      clickRadio,
    }
  },
}
</script>
