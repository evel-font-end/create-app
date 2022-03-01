<template>
  <div class="box">
    <wrapper title="公告内容">
      <el-form ref="form" label-width="100px" v-if="dialogModel">
        <el-form-item label="公告内容：" required>
          <editor
            ref="editor"
            :catchData="handleData"
            :html="htmlContent"
            :disable="isDetail"
          />
        </el-form-item>
      </el-form>
      <div v-else style="padding: 10px; max-height: 350px; overflow-y: auto;">
        <p v-html='htmlContent' class="htmlContent"></p>
      </div>
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
    html: '',
    dialogModel: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    data (val) {
      this.isDetail = ['detail'].includes(val.configType);
    },
    html (val) {
      // this.htmlContent = val;
      let subStr=new RegExp('border="0" cellspacing="0" cellpadding="0"');//创建正则表达式对象
      let result=val ? val.replace(subStr,'border="1" cellspacing="5" cellpadding="10"') : '';//把border="0"...替换为border="1"...
      this.htmlContent = result;
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
    clear () {
      !this.isDetail && this.$refs.editor.clear();
    },
    getHtmlValue () {
      return this.$refs.editor.getHtmlValue();
    }
  },
  created () {
  }
}
</script>

<style>

</style>
