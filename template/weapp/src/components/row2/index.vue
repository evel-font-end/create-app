<template>
  <view class="row2">
    <view class="row" v-for="(item, i) in list" :key="i">
      <!-- 上 -->
      <view class="top">
        <text class="name">{{ item.name }}</text>

        <text class="number">{{ item.cs || 0 }}</text>
      </view>
      <!-- 下 -->
      <view class="bottom">
        <view class="bottomRow">
          <view class="name">部件类型：</view>
          <view class="value"> {{ item.bjlx }}</view>
        </view>
        <view class="bottomRow">
          <view class="name">安装位置：</view>
          <view class="value"> {{ item.azwz }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import './index.scss'

export default {
  name: 'row2View',
  props: {
    list: {
      type: Array,
    },
    nameWidth: {
      type: String,
    },
    valueNoOverflow: {
      type: Boolean,
    },
  },
  setup() {
    // 打开开发者控制台弹窗
    const openWindow = function () {}

    return {}
  },
};
</script>
