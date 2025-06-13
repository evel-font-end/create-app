<template>
  <!-- 人物介绍 -->
  <view class="boxUser">
    <!-- 左边 -->
    <view class="left">
      <image class="userIcon" :src="icon" />
    </view>

    <!-- 右边 -->
    <view class="right">
      <!-- 名称 -->
      <view class="row_name">
        <!-- 名称 -->
        <view class="name"> {{ itemObj.rymc }} </view>
        <!-- 名称 -->
        <view class="type"> {{ itemObj.zgzsdj || '' }}</view>
      </view>

      <!-- 名称 -->
      <view class="row_number">
        <!-- 名称 -->
        <view class="label">手机号：</view>
        <!-- 名称 -->
        <view class="value"> {{ itemObj.lxfs }} </view>
      </view>

      <!-- 名称 -->
      <view class="row_number">
        <!-- 名称 -->
        <view class="label">身份证号：</view>
        <!-- 名称 -->
        <view class="value"> {{ itemObj.sfzjhm }} </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, defineProps } from 'vue'
import './index.scss'

export default {
  name: 'boxUserView',
  props: {
    list: {
      type: Array,
    },
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    icon: {
      type: String,
    },
    itemObj: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    // 打开开发者控制台弹窗
    const openWindow = function () {}

    return {
      openWindow,
    }
  },
}
</script>
