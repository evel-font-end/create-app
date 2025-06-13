<template>
  <AtToast
    :isOpened="isOpened"
    :text="text"
    :icon="icon"
    :image="image"
    :status="status"
    :duration="duration"
    @close="close"
  >
  </AtToast>
</template>

<script>
import { AtToast } from 'taro-ui-vue3'

import 'taro-ui-vue3/dist/style/components/toast.scss'
import 'taro-ui-vue3/dist/style/components/icon.scss'
import { ref, watch } from 'vue'

export default {
  name: 'toastVue',
  components: {
    AtToast,
  },
  props: {
    text: {
      type: String,
    },
    icon: {
      type: String,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      default: 'loading',
    },
    duration: {
      type: Number,
      default: 3000,
    },
    isOpened: {
      type: Boolean,
      default: false,
    },
    closeAtToast: {
      type: Function,
      required: true,
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
        close()
      }, props.duration)
    }

    const close = function () {
      emit('close')
      if(props.closeAtToast) {
        props.closeAtToast()
      }
    }

    return {
      show,
      close,
    }
  },
}
</script>
