<template>
  <div class='comp-wrapper' :class="className">
    <div class="comp-wrapper-header">
      <div class="comp-wrapper-header__left">
        <slot name="header-left">
          <span class="comp-wrapper-header__title">
            {{ title }}
          </span>
        </slot>
      </div>

      <div class="comp-wrapper-header__right">
        <slot name="header-right">
        </slot>
      </div>
    </div>
    <div class="comp-wrapper-content">
      <slot>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Wrapper',
  props: {
    title: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.comp-wrapper {
  background: #fff;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 8px;
    border-bottom: 1px solid #cecece;
    // border-top: 1px solid #E2E2E2;
    &__title {
      // border-left: 4px solid #065BDC;
      padding-left: 12px;
      font-size: 16px;
      font-weight: 600;
      font-family: arial, 'Microsoft YaHei', 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', sans-serif, 'Droid Sans Fallback';
      position: relative;
      &::after{
        content: '';
          width: 4px;
          height: 16px;
          background: #065BDC;
          position: absolute;
          left: 0;
          top: 50%;
          margin-top: -8px;
      }
    }
  }
  &-content {
    padding: 10px 0px 0;
    .htmlContent{
      overflow: auto;
    }
  }
}
</style>
