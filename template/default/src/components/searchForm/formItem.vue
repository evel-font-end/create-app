<template>
  <div id="formItem">
    <!-- 输入框 -->
    <el-input
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
      :placeholder="item.props.placeholder ? item.props.placeholder : `请输入${item.label}`"
      @keyup.enter.native="handleFilter"
      class="filter-item-input"
      v-if="item.type==='input'"
      :style="{maxWidth:item.props.width||'120px'}"
    >
    </el-input>
    <!-- 下拉选择器 -->
    <el-select
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
      :placeholder="item.props.placeholder ? item.props.placeholder : `请输入${item.label}`"
      clearable
      class="filter-item-select"
      :style="{maxWidth:item.props.width||'120px'}"
      :disabled="item.props.disabled"
      v-if="item.type==='select'"
    >
      <el-option
        v-for="optionItem in item.props.options"
        :key="`select${item.props.fieldName}${optionItem.id || optionItem.value || optionItem.code}`"
        :label="optionItem.name || optionItem.text"
        :value="`${optionItem.id}` || `${optionItem.value}` || `${optionItem.code}`"
      />
    </el-select>
    <!-- 单选 -->
    <el-radio-group
      v-if="item.type==='radio'"
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
    >
      <el-radio
        v-for="ch in item.props.options"
        :label="ch.value || ch.id"
        :key="ch.value || ch.id"
      >
        {{ch.text || ch.name}}
      </el-radio>
    </el-radio-group>
    <!-- 单选按钮 -->
    <el-radio-group
      v-if="item.type==='radioButton'"
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
      @change="item.change && item.change(item.props.fieldName)"
    >
      <el-radio-button
        v-for="ch in item.props.options"
        :label="ch.value || ch.id"
        :key="ch.value || ch.id"
      >
        {{ch.name || ch.text}}
      </el-radio-button>
    </el-radio-group>
    <!-- 复选框 -->
    <el-checkbox-group
      v-if="item.type==='checkbox'"
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
    >
      <el-checkbox
        v-for="ch in item.props.options"
        :label="ch.id"
        :key="ch.id"
      >
        {{ch.name || ch.text}}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 日期 -->
    <el-date-picker
      :style="{maxWidth:item.props.width||'100%'}"
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
      :value-format="item.props.format || 'yyyy-MM-dd HH:mm:ss'"
      :type="item.props.type || 'daterange'"
      align="right"
      unlink-panels
      range-separator="至"
      :start-placeholder="item.props.startPlaceholder || '请选择开始日期'"
      :end-placeholder="item.props.endPlaceholder || '请选择结束日期'"
      :placeholder="item.placeholder"
      :picker-options="item.props.pickerOptions"
      v-if="item.type==='dataPicker'"
    ></el-date-picker>
  </div>
</template>
<script>
export default {
  props: {
    value: {},
    // 搜索组件
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      checkBoxGroup: []
    }
  },
  computed: {
    // 双向绑定数据值
    currentVal: {
      get () {
        if (this.item.type === 'checkbox') {
          return this.value ? this.value : [];
        }
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    // 绑定属性
    bindProps () {
      let obj = { ...this.item }
      // 移除冗余属性
      delete obj.label
      delete obj.prop
      delete obj.element
      delete obj.initValue
      delete obj.rules
      delete obj.events
      if (obj.type === 'select' || obj.type === 'checkbox') {
        delete obj.options
      }
      return obj
    },
    // 绑定方法
    bindEvents () {
      return this.item.events || {}
    }
  },
  methods: {
  }
}
</script>
<style lang="less">
  #formItem{
    input{
      height: 30px;
    }
  .filter-item-input{
    max-width: 160px;
  }
  .filter-item-select{
    max-width: 140px;
  }
}
</style>
