<template>
  <view class="echarts">
    <view class="echartsBox" :class="'echarts-' + domId" ref="echartDom"></view>
  </view>
</template>

<script setup>
import { ref, defineProps, onMounted, shallowRef, nextTick } from 'vue'

import './index.scss'

import * as echarts from './echarts'

const msg = ref('Hello world')

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
  $echarts.value = echarts.init(echartDom.value, null, {
    height: props.height,
    width: echartDom.value.$el.offsetWidth,
  })
}

const initOption = function (option) {
  $echarts.value.setOption(props.option)
}

// 打开开发者控制台弹窗
const openWindow = function () {}

// 初始化操作
onMounted(() => {
  props
  echartDom
  setTimeout(() => {
    //
    initEcharts()

    initOption()
  }, 1000)

  nextTick(() => {
    //
  })
})
</script>
