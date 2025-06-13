<template>
  <!-- 流程轴组件 -->
  <view class="AtTimeLine">
    <view class="model" v-for="(item, i) in list" :key="i">
      <view class="lineBox">
        <view class="icon"></view>
      </view>
      <view class="lineBoxContent">
        <slot>
          <view class="content rect-time-line">
            <view class="name">
              <view>{{ item.name }}</view>
              <view class="state">{{ item.state }}</view>
            </view>
            <view class="info">{{ item.info }}</view>
            <view class="info">{{ item.createUserName }}</view>
            <view class="info">{{ item.stepDesc }}</view>
            <view class="img-content">
              <img class="img-item" :src="img" v-for="(img, idx) in item.czlctp" :key="idx" />
            </view>
          </view>
        </slot>
      </view>
      <!-- 箭头 -->
      <AtIcon
        prefixClass="icon"
        :value="'cujiantou'"
        :size="16"
        class="iconfont"
        :color="'#C9C9C9'"
      ></AtIcon>
      <AtIcon
        prefixClass="icon"
        :value="'cujiantou'"
        :size="16"
        class="iconfont right"
        :color="'#C9C9C9'"
      ></AtIcon>
    </view>
  </view>
</template>

<script>
import { AtIcon } from 'taro-ui-vue3'

import 'taro-ui-vue3/dist/style/components/icon.scss'
import { ref, watch } from 'vue'

import './index.scss'

export default {
  name: 'toastVue',
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
    watch(
      () => {
        return props.isOpened
      },
      (now) => {
        showValue.value = now
      }
    )

    const showValue = ref(props.isOpened)

    const key = ref(null)

    // 显示
    const show = function () {
      showValue.value = true
      // emit('update:isOpened', true)
      if (key.value) {
        clearTimeout(key.value)
      }
      key.value = setTimeout(() => {
        showValue.value = false
        emit('update:isOpened', false)
      }, props.duration)
    }

    return {
      show,
    }
  },
}
</script>
