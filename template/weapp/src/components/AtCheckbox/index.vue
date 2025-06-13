<template>
  <AtCheckbox :options="options" :selectedList="check" @change="changeCheckBox" />
</template>

<script>
import { AtCheckbox } from 'taro-ui-vue3'

import 'taro-ui-vue3/dist/style/components/checkbox.scss'
import 'taro-ui-vue3/dist/style/components/icon.scss'
import { ref, watch } from 'vue'

export default {
  name: 'toastVue',
  components: {
    AtCheckbox,
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    watch(
      () => {
        props.value
      },
      () => {
        check.value = [props.value]
      }
    )

    watch(
      () => {
        props.text
      },
      () => {
        options.value = [{ name: props.text, value: props.value }]
      }
    )

    const options = ref([])

    const check = ref([])

    const changeCheckBox = function (e, l) {
      check.value = e
      emit('update:value', e[0])
    }

    return {
      check,
      changeCheckBox,
    }
  },
}
</script>