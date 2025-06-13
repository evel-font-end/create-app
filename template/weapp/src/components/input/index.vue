<template>
  <input
    v-model="inputValue"
    :type="type"
    :disabled="disabled"
    :placeholder="disabled ? '' : placeholder"
    class="at-input"
    @change="inputChange"
  />
</template>

<script>
import { ref, defineProps, watch } from 'vue'
import './index.scss'

export default {
  name: 'inputView',
  props: {
    modelValue: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '请输入',
    },
  },
  // watch: {
  //   modelValue() {
  //
  //   },
  // },
  setup(props, { emit }) {
    watch(
      () => props.modelValue,
      (now, old) => {
        // 这里无法理解当输入框为空的时候 会变成true 这里手动输入
        if (now === true) {
          now = ''
        }
        inputValue.value = now
      }
    )

    const inputValue = ref(props.modelValue)

    const inputChange = function (value) {
      emit('update:modelValue', value.detail.value)
      emit('inputChange', value.detail.value)
    }

    return {
      inputValue,
      inputChange,
    }
  },
}
</script>
