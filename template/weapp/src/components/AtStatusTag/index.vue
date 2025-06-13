<template>
  <view :class="['x-status-tag', `x-status-tag--${type || statusType}`]">
    <slot>
      {{ statusLabel }}
    </slot>
  </view>
</template>

<script>
import './index.scss'
import { EStatusTagType, EStatusLabel } from '@/constants/device.js'
import { computed } from 'vue'
export default {
  name: 'AtStatusTag',
  props: {
    type: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const statusType = computed(() => {
      return EStatusTagType[props.status]
    })
    const statusLabel = computed(() => {
      return EStatusLabel[props.status]
    })
    return {
      statusType,
      statusLabel,
    }
  },
}
</script>
