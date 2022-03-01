<template>
  <div id="wangeditor">
    <div ref="editorElem" class="editorContainer" style="text-align:left;"></div>
  </div>
</template>

<script>
import E from 'wangeditor';
export default {
  name: 'editor',
  data () {
    return {
      editor: null,
      editorContent: ''
    };
  },
  // catchData是一个类似回调函数，来自父组件，当然也可以自己写一个函数，主要是用来获取富文本编辑器中的html内容用来传递给服务端
  props: ['catchData', 'html', 'disable'], // 接收父组件的方法
  mounted () {
    this.editor = new E(this.$refs.editorElem);
    // 编辑器的事件，每次改变会获取其html内容
    this.editor.config.onchange = html => {
      this.editorContent = html;
      // this.catchData(this.editorContent); // 把这个html通过catchData的方法传入父组件
    };
    this.editor.config.menus = [
      // 菜单配置
      'head',
      'bold',
      'fontSize',
      'fontName',
      'italic',
      'underline',
      'strikeThrough',
      'indent',
      'lineHeight',
      'foreColor',
      'backColor',
      'link',
      'list',
      'todo',
      'justify',
      'quote',
      'emoticon',
      'image',
      'video',
      'table',
      'code',
      'splitLine',//分割线
      'undo',
      'redo',
      // 'head', // 标题
      // 'bold', // 粗体
      // 'fontSize', // 字号
      // 'fontName', // 字体
      // 'italic', // 斜体
      // 'underline', // 下划线
      // 'strikeThrough', // 删除线
      // 'foreColor', // 文字颜色
      // 'backColor', // 背景颜色
      // 'link', // 插入链接
      // 'list', // 列表
      // 'justify', // 对齐方式
      // 'quote', // 引用
      // 'emoticon', // 表情
      // 'image', // 插入图片
      // 'table', // 表格
      // 'code', // 插入代码
      // 'undo', // 撤销
      // 'redo' // 重复
    ];
    this.editor.config.pasteFilterStyle = false
    this.editor.create(); // 创建富文本实例
    this.editor && this.editor.txt.html(this.html);
    this.changeDisable(this.disable);
  },
  watch: {
    html (val) {
      this.editor && this.editor.txt.html(val);
      this.changeDisable(this.disable);
    },
    disable (val) {
      this.changeDisable(val);
    }
  },
  methods: {
    clear () {
      this.editor.txt.clear()
    },
    getHtmlValue () {
      return this.editor.txt.html();
    },
    changeDisable (val) {
      if (val) {
        this.editor.disable()
      } else {
        this.editor.enable();
      }
    }
  }
};
</script>

<style lang="less">
.editorContainer {
  >div{
    &:first-child{
      flex-wrap: wrap;
    }
    &:last-child{
      z-index: 0 !important;
    }
  }
}
</style>
