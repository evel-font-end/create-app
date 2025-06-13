<template>
  <view class="boxSearch">
    <!-- 设备信息 -->
    <view class="boxQuan" v-if="inputSearchShow">
      <!-- 图标 -->
      <view class="img">
        <slot name="img">
          <AtIcon
            prefixClass="icon"
            :value="iconSrt"
            :size="16"
            class="iconfont"
            :color="'#004EAD'"
            v-if="iconSrt"
          ></AtIcon>
          <image v-else-if="iconImgSrcStr" :src="imagesRequire(iconImgSrcStr)" />
          <image v-else :src="imagesRequire('/boxSearch/search.png')" />
        </slot>
      </view>

      <inputVue
        class="at-input"
        :type="type"
        v-model="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @inputChange="handleChange"
      />
    </view>

    <!-- 新增 -->
    <slot name="add">
      <view class="flex flexAlignCenter flexJustifyCenter add" v-if="isAdd" @click="addClick">
        <AtIcon
          prefixClass="icon"
          :value="'jiahao'"
          :size="16"
          class="iconfont"
          :color="'#fff'"
        ></AtIcon>
      </view>
    </slot>
  </view>
</template>

<style lang="scss" scoped>
// @import "./index.scss";
</style>

<script>
import { ref, watch } from 'vue'
import { AtIcon } from 'taro-ui-vue3'
import './index.scss'
import inputVue from 'comp/input/index.vue'
import { imagesRequire } from '@/utils/require'

export default {
  name: 'demoView',
  components: {
    AtIcon,
    inputVue,
  },
  props: {
    modelValue: {
      type: String || Number,
      default: '',
    },
    placeholder: {
      type: String,
      default: '请输入搜索内容',
    },
    // 输入类型 如果是密码就是password
    type: {
      type: String,
      default: 'text',
    },
    // 是否显示输入框
    inputSearchShow: {
      type: Boolean,
      default: true,
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
    icon: {
      type: String,
      default: '',
    },
    iconImgSrc: {
      type: String,
      default: '',
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

    watch(
      () => props.iconImgSrc,
      (now, old) => {
        iconImgSrcStr.value = now
      }
    )

    // 当前input的值
    const inputValue = ref(props.modelValue)

    const iconSrt = ref(props.icon)
    const iconImgSrcStr = ref(props.iconImgSrc)

    const key = ref(null)

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
      this.setState({
        dateSel: e.detail.value,
      })
    }

    return {
      inputValue,
      handleChange,
      addClick,
      imagesRequire,
      onDateChange,
      iconSrt,
      iconImgSrcStr,
    }
  },
}
</script>
