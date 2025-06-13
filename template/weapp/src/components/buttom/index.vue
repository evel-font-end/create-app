<template>
  <!-- 注销登录 -->
  <view
    :class="['x-button', `el-button--${type}`, { ['x-button--ghost']: ghost }]"
    class="flex flexAlignCenter btn"
    @click="clickBtn"
    v-bind="{ ...$attrs, ...$props }"
  >
    <text><slot></slot>{{ text }}</text>
  </view>
</template>

<script>
import './index.scss'

export default {
  name: 'ButtomView',
  props: {
    plain: {
      type: Boolean,
      default: false,
    },
    ghost: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: null,
    },
    text: {
      type: String,
    },
  },
  // watch: {
  //   modelValue() {
  //
  //   },
  // },
  setup(props, { emit }) {
    const clickBtn = function () {
      emit('clickBtn')
    }

    return {
      clickBtn,
    }
  },
}
</script>
