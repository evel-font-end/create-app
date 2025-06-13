<template>
  <view class="row1">
    <view class="row" v-for="(item, i) in list" :key="i">
      <!-- 上 -->
      <view class="top">
        <text class="name">{{ item.name }}</text>

        <text
          class="state"
          :style="{
            color: item.stateColor,
            background: item.stateColor + '14',
          }"
        >
          {{ item.state }}
        </text>
      </view>
      <!-- 下 -->
      <view class="bottom" :class="{ valueNoOverflow: !valueNoOverflow }">
        <text class="value">{{ item.value }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, defineProps } from "vue";
import "./index.scss";

export default {
  name: "demoView",
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
    const msg = ref("Hello world");

    // 打开开发者控制台弹窗
    const openWindow = function () {};

    return {
      msg,
    };
  },
};
</script>
