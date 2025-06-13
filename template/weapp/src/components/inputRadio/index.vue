<template>
  <view class="menuList">
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
import './index.scss'

export default {
  name: 'inputRadioView',
  props: {
    modelValue: {
      type: [Boolean, String, Number],
    },
    menuList: {
      type: [String, Array],
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    modelValue() {},
  },
  setup(props, { emit }) {
    const clickRadio = function (item) {
      if (props.isDisabled) {
        return
      }
      emit('update:modelValue', item.value)
      emit('change', item.value, item)
    }

    return {
      clickRadio,
    }
  },
}
</script>
