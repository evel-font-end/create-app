<template>
  <div class="box">
    <wrapper title="公告内容">
      <editor
        ref="editor"
        :catchData="handleData"
        :html="htmlContent"
        :disable="isDetail"
      />
      <!-- <div v-else style="padding: 10px">
        <p v-html='htmlContent' class="htmlContent"></p>
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
      this.isDetail = ['detail'].includes(val.configType);
    },
    html (val) {
      this.htmlContent = val;
    }
  },
  data () {
    return {
      htmlContent: '',
      isDetail: ['detail'].includes(this.data.configType)
    }
  },
  computed: {
  },
  methods: {
    init () {
    },
    handleData (val) {
      this.$emit('catchData', val);
    },
    getHtmlValue () {
      return this.$refs.editor.getHtmlValue();
    },
  },
  created () {
  }
}
</script>

<style>
</style>
