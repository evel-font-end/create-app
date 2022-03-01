<template>
  <div class="box">
    <wrapper title="附件内容">
      <editor
        ref="editor"
        :catchData="handleData"
        :html="htmlContent"
        :disable="isDetail"
      />
      <!-- <div v-else style="padding: 10px">
        <p v-html='htmlContent'></p>
      </div> -->
    </wrapper>
  </div>
</template>

<script>
import Editor from '@/components/wangeditor';
import Wrapper from '@/components/wrapper';
export default {
  name: 'wangeditor',
  components: {
    Editor,
    Wrapper
  },
  props: {
    data: {},
    html: ''
  },
  watch: {
    data (val) {
      this.isDetail = ['info'].includes(val.type);
    },
    html: {
      immediate:true,
      handler:function(val){
        this.htmlContent = val;
      }
    }
    // html (val) {
    //   console.log('=====3')
    //   this.htmlContent = val;
    // }
  },
  data () {
    return {
      htmlContent: '',
      isDetail: ['info'].includes(this.data.type)
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   console.log('完毕')
    //   this.isDetail = ['info'].includes(this.data.type);
    //   this.htmlContent = this.data.data.htmlContent;
    //   console.log(this.htmlContent)
    // });
  },
  computed: {
  },
  methods: {
    init () {
    },
    handleData (val) {
      this.$emit('catchData', val);
    },
    clear () {
      !this.isDetail && this.$refs.editor.clear()
    },
    getHtmlValue () {
      return this.$refs.editor.getHtmlValue();
    }
  },
  created () {
    this.isDetail = ['info'].includes(this.data.type);
    this.htmlContent = this.data.type === 'add' ? '' : this.data.data.htmlContent;
  }
}
</script>

<style>

</style>
