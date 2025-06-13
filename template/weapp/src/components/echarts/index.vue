<template>
  <view class="echarts">
    <echart ref="echartDom" :canvas-id="'echarts-xid-' + domId" />
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro'

import echart from './echarts.vue'

import { ref, defineProps, onMounted, shallowRef, nextTick, watch } from 'vue'

import './index.scss'

import * as echarts from './echarts'

const echartDom = ref(null)

const props = defineProps({
  option: {
    type: Object,
  },

  width: {
    type: String,
  },

  height: {
    type: String,
  },
})

const getRandomInt = function (n) {
  return Math.floor(Math.random() * n)
}

let domId = ref(getRandomInt(10000))

let $echarts = shallowRef({})

// 初始化echarts组件
const initEcharts = function () {
  // $echarts.value = echarts.init(echartDom.value, null, {
  //   height: props.height,
  //   width: echartDom.value.$el.offsetWidth,
  // });
};

const initOption = function (option) {
  Taro.nextTick(() => {
    echartDom.value.refresh(props.option)
  })
}

// 打开开发者控制台弹窗
const openWindow = function () {}
 watch(
  () => props.option,
  (now, old) => {
   initOption()
  }
)
// 初始化操作
onMounted(() => {
  initEcharts()
  initOption()
})
</script>
