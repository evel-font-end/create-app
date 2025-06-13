<template>
  <view class="boxSearch">
    <!-- 设备信息 -->
    <view class="boxQuan">
      <!-- 图标 -->
      <view class="img">
        <slot name="img">
          <image :src="imagesRequire('/boxSearch/search.png')" />
        </slot>
      </view>

      <view class="picker-date">
        <Picker mode="date" @change="onDateChange">
          <view class="picker"> {{ modelValue }} </view>
        </Picker>
      </view>
    </view>

    <!-- 新增 -->
    <slot name="add">
      <view class="add" v-if="isAdd" @click="addClick">+</view>
    </slot>
  </view>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>

<script>
import { ref, defineProps, watch } from 'vue'
import './index.scss'
import { imagesRequire } from '@/utils/require'
import { Picker } from '@tarojs/components'

export default {
  name: 'boxSearchPickerView',
  components: {
    Picker
  },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '请输入',
    },
    // 输入类型 如果是密码就是password
    type: {
      type: String,
      default: 'text',
    },
    // 是否现实加号
    isAdd: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    watch(
      () => props.modelValue,
      (now, old) => {
        if (now === true) {
          now = ''
        }

        inputValue.value = now
      }
    )

    // watch(
    //   () => inputValue.value,
    //   (now, old) => {
    //
    //     // inputValue.value = old;
    //   }
    // );

    // 当前input的值
    const inputValue = ref(props.modelValue)

    // 变化后事件
    const handleChange = function (num) {
      emit('update:modelValue', num)
      emit('change', num)
    }

    // 点击新增按钮
    const addClick = function () {
      emit('addClick', inputValue.value)
    }

    const onDateChange = (e) => {
      emit('update:modelValue', e.detail.value)
      emit('change', e.detail.value)
    }

    return {
      inputValue,
      handleChange,
      addClick,
      imagesRequire,
      onDateChange,
    }
  },
}
</script>
