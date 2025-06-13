<template>
  <view class="flex flexRow flexAlignCenter selectSheet">
    <view class="flex flexCenter label">
      <image class="img" :src="index1" />
    </view>
    <picker
      mode="selector"
      :range="props.selectList"
      :rangeKey="rangeKey"
      @change="handleChange"
      style="width: 100%"
    >
      <view class="flex selectMain">{{ title }}</view>
    </picker>
    <AtIcon prefixClass="at-icon" value="chevron-down" size="13" color="#fff"></AtIcon>
  </view>
</template>

<script>
import { reactive } from 'vue'

import { AtIcon } from 'taro-ui-vue3'
import { imagesRequire } from '@/utils/require'
import { Picker } from '@tarojs/components'
import './index.scss'
const index1 = imagesRequire('/index/index1.png')

export default {
  name: 'selectSheet',
  components: {
    AtIcon,
    Picker,
  },
  props: {
    selectList: {
      type: Array,
      default: '颐和豪庭院（展厅用）',
    },
    title: {
      type: String,
    },
    rangeKey: {
      type: String,
      default: 'deptName',
    },
  },
  setup(props, { emit }) {
    const state = reactive({})

    // 打开开发者控制台弹窗
    const handleChange = (val) => {
      emit('change', val)
    }

    return {
      props,
      state,
      index1,
      handleChange,
    }
  },
}
</script>
