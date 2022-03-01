/**
 * 弹窗显示值双向绑定
 * @param {String} valName 变量字面量名称
 */
const dialogReact = (valName) => ({
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible (val) {
      this.dialogShow = val
    },
    [valName] (val) {
      this.$emit('update:visible', val)
    }
  }

})

export default dialogReact
