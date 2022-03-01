<template>
  <div class="comp-collapse-item" >
    <div class="comp-collapse-item__header" @click="handleItemClick">

      <div class="header-left">
        <slot name="title">
          <img class="logo" src="../../common/images/logo_folder.png" />
          <span class="title">
            {{ title }}
          </span>
        </slot>
      </div>

      <div class="header-right">
        <i :class="arrowClass"></i>
      </div>
    </div>
    <el-collapse-transition>
      <div class="comp-collapse-item__content" v-show="isActive">
        <slot></slot>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import Emitter from '@/util/emitter'
export default {
  name: 'CollapseItem',
  mixins: [Emitter],
  props: {
    title: {
      type: String,
      default: ''
    },
    name: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      expand: false
    }
  },
  computed: {
    isActive () {
      return this.collapse.activeNames.indexOf(this.name) > -1;
    },
    arrowClass () {
      return this.isActive
        ? 'el-icon-arrow-down is-active'
        : 'el-icon-arrow-down'
    }
  },
  inject: ['collapse'],
  methods: {
    handleItemClick () {
      this.dispatch('Collapse', 'item-click', this)
    }
  }

};
</script>

<style lang="less" scoped>
.comp-collapse-item {
  margin-bottom: 12px;
  border: 1px solid #e7e9ef;
  background: #e7e9ef;
  &:last-child {
    margin-bottom: 0;
  }
  &__header {
    cursor: pointer;
    display: flex;
    padding: 9px 20px;
    justify-content: space-between;
    .header-left {
      display: flex;
      align-items: center;
      .logo {
        margin-right: 8px;
      }
      .title {
        font-size: 14px;
        font-weight: 400;
      }
    }
    /deep/ .el-icon-arrow-down {
      transition: transform .3s;
      &.is-active {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
