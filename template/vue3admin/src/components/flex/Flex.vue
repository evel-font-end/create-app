<template>
  <div
    class="c--flex"
    :style="style"
    :class="className"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { computed } from 'vue';
export default {
  props: {
    justify: {
      type: String,
      default: 'center'
    },
    wrap: {
      type: String,
      default: 'nowrap'
    },
    align: {
      type: String,
      default: 'center'
    },
    paddingY: {
      type: String,
      default: ''
    },
    paddingX: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: 'flex-center'
    },
    pointer: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  },
  setup(props: any, context: any) {
    const style = computed(() => {
      return {
        display: props.inline ? 'inline-flex' : 'flex',
        'justify-content': props.justify,
        'flex-wrap': props.wrap,
        'flex-direction': props.direction,
        'align-items': props.align,
        paddingTop: props.paddingY ? props.paddingY : 0,
        paddingBottom: props.paddingY ? props.paddingY : 0,
        paddingLeft: props.paddingX ? props.paddingX : 0,
        paddingRight: props.paddingX ? props.paddingX : 0
      };
    });
    return {
      ...props,
      style
    }
  }
};
</script>

<style scoped lang="less">
.c--flex {
  width: 100%;
  box-sizing: border-box;
  &.pointer {
    cursor: pointer;
  }
}
</style>
