<template>
  <AtTabs class="my-at-tabs" :current="currentValue" :tabList="tabList" @click="handleClick">
    <AtTabsPane v-for="(item, i) in tabList" :key="i" :current="currentValue" :index="i">
      <slot :name="item.id"></slot>
    </AtTabsPane>
  </AtTabs>
</template>

<script>
import { AtTabs, AtTabsPane } from 'taro-ui-vue3'

import 'taro-ui-vue3/dist/style/components/tabs.scss'

import { ref, watch } from 'vue'

import './index.scss'

export default {
  name: 'tabsVue',
  components: {
    AtTabs,
    AtTabsPane,
  },
  props: {
    tabList: {
      type: Array,
      default: () => [],
    },

    current: {
      type: Number,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    watch(
      () => {
        return props.current
      },
      () => {
        currentValue.value = props.current
      }
    )

    // 当前选择的
    const currentValue = ref(props.current)

    // tab点击事件
    const handleClick = function (tabs) {
      currentValue.value = tabs
      emit('tabClick', tabs)
      emit('update:current', tabs)
    }

    return {
      handleClick,
      currentValue,
    }
  },
}
</script>