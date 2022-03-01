<template>
  <div :class="className" id="elDialog">
    <el-dialog
      :close-on-click-modal="closeOnClickModal"
      :append-to-body="appendToBody"
      :visible.sync="dialogVisible"
      :width="width"
      :title="title"
      :center="titleCenter"
      :custom-class="`elDialogCenter ${width === '75%' && 'bigWidth'} ${customClass}`"
      @close="onClose"
      @open="onOpen"
      v-if="dialogModel"
    >
      <slot />
      <div
        slot="footer"
        v-if="bottomShow"
      >
        <slot name="footer" />
        <flex :justify="footerAlignJustify">
          <el-button
            v-if="cancelShow"
            title="关闭"
            class="button closeBtn"
            @click="onCancel"
          >
            {{cancelText}}
          </el-button>
          <el-button
            v-if="confirmShow"
            type="primary"
            title="确定"
            class="button submitBtn"
            @click="onConfirm"
          >
            {{confirmText}}
          </el-button>
        </flex>
      </div>
    </el-dialog>
    <div v-if="!dialogModel">
      <slot />
    </div>
  </div>
</template>

<script>
import Flex from '../flex';

export default {
  components: {
    flex: Flex
  },
  props: {
    /** 弹窗显示 */
    visible: {
      type: Boolean,
      default: false
    },
    /** Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true */
    appendToBody: {
      type: Boolean,
      default: false
    },
    /** 标题是否居中显示 */
    titleCenter: {
      type: Boolean,
      default: true
    },
    /** 弹窗宽度 */
    width: {
      type: String,
      default: '75%'
    },
    title: {
      type: String,
      default: '提示'
    },
    /** 底部整块按钮是否显示 */
    bottomShow: {
      type: Boolean,
      default: true
    },
    /** 确定按钮是否显示 */
    confirmShow: {
      type: Boolean,
      default: true
    },
    /** 取消钮是否显示 */
    cancelShow: {
      type: Boolean,
      default: true
    },
    /** slot footer 对齐方式 */
    footerAlign: {
      type: String,
      default: 'right'
    },
    /** 是否可以通过点击 modal 关闭 Dialog */
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: 'customClass'
    },
    // 弹窗形式
    dialogModel: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: '关闭'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    className: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false
    };
  },
  computed: {
    footerAlignJustify () {
      const { footerAlign } = this;
      if (!footerAlign) return 'center';
      const ALIGN = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end'
      };
      return ALIGN[footerAlign];
    }
  },
  watch: {
    visible (newValue) {
      this.dialogVisible = !!newValue;
    },
    dialogVisible (newValue) {
      this.emitUpdateVisible(newValue);
    }
  },
  methods: {
    /** 点击确定回调函数 */
    onConfirm () {
      this.$emit('on-confirm');
    },
    /** 点击取消回调函数 */
    onCancel () {
      this.dialogVisible = false;
      this.$emit('on-cancel');
    },
    /** 窗口关闭回调函数 */
    onClose () {
      this.$emit('on-close');
    },
    /** 窗口打开回调函数 */
    onOpen () {
      this.$emit('on-open');
    },
    emitUpdateVisible (val) {
      this.$emit('update:visible', val);
    }
  }
};
</script>

<style lang="less">
// #elDialog{
  .elDialogCenter{
    .bigWidth{
      min-width: 1200px;/*no*/
      margin-top: 150px !important; /*no*/
    }
  }
// }
.button{
  width:88px;
  height:40px !important;
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  &.submit{
    background:rgba(37,115,241,1);
  }
}
.closeBtn{
  margin-right: 10px !important;
  color: rgba(37,115,241,1);
}
.button.el-button--default {
  border: 1px solid #409eff !important;
}
</style>
