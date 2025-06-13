<template>
  <!-- 人物介绍 -->
  <view class="tabVertical">
    <!-- 左 -->
    <view class="tabVertical-left">
      <view
        class="tab"
        :class="{ active: item.value === activetab }"
        :test="test(item, activetab)"
        @click="tabClick(item)"
        v-for="(item, i) in menuList || []"
        :key="i"
        >{{ item.label }}</view
      >
    </view>
    <!-- 右 -->
    <view class="tabVertical-right">
      <slot :name="activetab"></slot>
    </view>
  </view>
</template>

<script>
import { ref, watch } from 'vue'
import './index.scss'

export default {
  name: 'tabVertical',
  props: {
    menuList: {
      type: Array,
      default: () => {
        return [
          {
            label: '一楼',
            value: '1',
          },
        ]
      },
    },
    // 当前选中得栏目
    active: {
      type: [String, Number],
    },
  },
  methods: {
    // tabClick() {
    //
    // },
    test() {
      //
    },
  },
  setup(props, { emit }) {
    //
    watch(
      () => props.active,
      (val) => {
        activetab.value = val
      }
    )

    const msg = ref('Hello world')

    // 打开开发者控制台弹窗
    const openWindow = function () {}

    // 当前选中的tab
    const activetab = ref(props.active)

    // // 点击tab
    const tabClick = function (item) {
      activetab.value = item.value
      emit('update:active', item.value)
    }

    return {
      msg,
      activetab,
      tabClick,
    }
  },
}
</script>
