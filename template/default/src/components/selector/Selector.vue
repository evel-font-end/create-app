<template>
  <el-select
    ref="select"
    v-model="innerValue"
    :placeholder="placeholder"
    :filterable="filterable"
    :disabled="disabled"
    :popper-class="customClass"
    :multiple="multiple"
    :clearable="clearable"
    :popper-append-to-body="appendToBody"
    :no-data-text="noDataText"
  >
    <el-option
      v-for="(option, index) in options"
      :key="`${uniqId}-${index}-option`"
      :label="option.label"
      :value="option.value"
      :disabled="option.disabled"
    />
    <template slot="empty">
      <slot name="empty" />
    </template>
    <template slot="prefix">
      <slot name="prefix" />
    </template>
  </el-select>
</template>

<script>

/** el-select自带事件 */
const EVENTS = [
  'visible-change',
  'remove-tag',
  'clear',
  'blur',
  'focus'
];
export default {
  name: 'Selector',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    /** 选项 */
    options: {
      type: Array,
      default () {
        return [];
      }
    },
    value: {
      type: [String, Number, Boolean, Array],
      default: ''
    },

    placeholder: {
      type: String,
      default: '请选择'
    },
    // /** 是否可搜索 */
    filterable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    noDataText: {
      type: String,
      default: '无数据'
    },
    /** Selector的自定义类名 */
    customClass: {
      type: String,
      default: ''
    },
    /** 是否多选 */
    multiple: {
      type: Boolean,
      default: false
    },
    /** 是否可以清空选项 */
    clearable: {
      type: Boolean,
      default: false
    },
    /** 是否将弹出框插入至 body 元素。在弹出框的定位出现问题时，可将该属性设置为 false */
    appendToBody: {
      type: Boolean,
      default: true

    }
  },
  data () {
    const uniqId = new Date().getTime();
    return {
      innerValue: '',
      uniqId
    };
  },
  watch: {
    innerValue (val) {
      this.$emit('change', val);
    }
  },
  mounted () {
    // 在组件挂载完成后, 抛出el-select实例
    this.$emit('mounted', this.$refs.select);
    this.emitEvents();
  },
  methods: {
    /** 监听并抛出el-select自带事件 */
    emitEvents () {
      const { select } = this.$refs;
      EVENTS.forEach((event) => {
        select.$on(event, (...args) => {
          this.$emit(event, ...args);
        });
      });
    }
  }
};
</script>
