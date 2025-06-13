<template>
  <!-- 设备信息 -->
  <view class="meunModelBox">
    <view class="meunModel" v-for="(item, i) in list" :key="i" @click="clickModel(item)">
      <image v-if="item.imgUrl" class="image-icon" :src="item.imgUrl" />
      <view v-else-if="item.icon" class="image-icon">
        <AtIcon prefixClass="icon" :value="item.icon" :size="22" class="iconfont"></AtIcon>
      </view>
      <view class="name">{{ item.name }}</view>
      <view class="tip-box" v-show="item.total > 0">{{ item.total }}</view>
    </view>
  </view>
</template>
<script>
import './index.scss'
import { AtIcon } from 'taro-ui-vue3'
export default {
  name: 'demoView',
  components: {
    AtIcon,
  },
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
