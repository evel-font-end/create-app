<template>
  <view class="index">
    <!-- 卡片内容 -->
    <view class="CardBox" :class="{ noBackground: isNoBackground }">
      <!-- 头部 -->
      <view
        class="CardTitle"
        v-if="title"
        :class="{ bottomLine: !isNoBottomLine }"
        @click="clickRightIcon"
      >
        <!-- 标题栏 -->
        <view class="titleText">
          <text class="titleText1" :class="{ line: isLeftLine }">{{ title || '标题' }}</text>

          <slot name="titleRight">
            <text class="rightBtn" v-if="rightName || isRightFn">
              <text
                class="rightB"
                :style="{
                  color: rightNameStyle.color,
                  background: rightNameStyle.background,
                }"
                v-if="rightName"
                >{{ rightName }}</text
              >
              <AtIcon
                prefixClass="icon"
                :value="'youbianjiantou'"
                :size="16"
                class="iconfont"
                :color="'#6C6C6C'"
                v-if="isRightFn"
              ></AtIcon>
            </text>
          </slot>
        </view>

        <!-- 标题下面的副标题 -->
        <view class="titleFu" v-if="user || time">
          <!-- 用户 -->
          <view class="user" v-if="user"
            ><image class="img" :src="imagesRequire('/card/user.png')" />{{ user }}</view
          >
          <!-- 时间 -->
          <view class="time" v-if="time"
            ><image class="img" :src="imagesRequire('/card/time.png')" />{{ time }}</view
          >
        </view>
      </view>
      <!-- 下面的内容 -->
      <view class="CardSlot" :class="{ noPadding: isNoPadding }">
        <!-- 内容 -->
        <slot>
          <!-- 空组件 -->
          <boxEmpty></boxEmpty>
        </slot>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, defineProps } from 'vue'
import boxEmpty from 'comp/boxEmpty/index.vue'
import './index.scss'
import { imagesRequire } from '@/utils/require'
import { AtToast, AtIcon } from 'taro-ui-vue3'

export default {
  name: 'cardView',
  components: {
    boxEmpty,
    AtIcon,
  },
  props: {
    title: {
      type: String,
    },
    user: {
      type: String,
    },
    time: {
      type: String,
    },
    isRightFn: {
      type: Boolean,
    },
    isLeftLine: {
      type: Boolean,
    },
    isNoBottomLine: {
      type: Boolean,
    },
    isNoBackground: {
      type: Boolean,
    },
    isNoPadding: {
      type: Boolean,
    },
    rightName: {
      type: String,
    },
    rightNameStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    // 右侧有箭头显示可点击后 点击标题跳转
    const clickRightIcon = function () {
      if (props.isRightFn === true) {
        emit('clickRight')
      }
    }

    return {
      clickRightIcon,
      imagesRequire,
    }
  },
}
</script>
