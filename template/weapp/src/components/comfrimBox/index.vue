<template>
  <view class="alert-box">
    <view class="alert-bg" @click="closeModel"></view>
    <view  class="alert-cont">
      <view class="alert-title"><text>!</text>{{ defaultObject.title }}</view>
      <view class="alert-bottom">
        <view class="btn process-btn" @click="closeModel">{{ defaultObject.closeName }}</view>
        <view class="btn submit-btn"  @click="submitFun">{{ defaultObject.submitName }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { AtActionSheet } from 'taro-ui-vue3'
import 'taro-ui-vue3/dist/style/components/noticebar.scss'
import Taro from '@tarojs/taro'
import './index.scss'

export default {
  name: 'toastVue',
  components: {
    AtActionSheet,
  },
  props: {
    defaultObject: {
      type: Object,
      default: {
        title:'是否确认提交此条任务？',
        closeName:'取 消',
        submitName:'确 认'
      },
    },
  },
  setup(props, { emit }) {
     // 点击事件
    const closeModel = function () {
      emit('closeModel')
    }
      // 点击事件
    const submitFun = function () {
      emit('submitFun')
    }
   return {
     closeModel,
     submitFun
   }
  }
}
</script>
