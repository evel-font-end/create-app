<template>
  <div id="pdf">
    <iframe :src="src" frameborder="0" scrolling="no" style="background-color:transparent; position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;"></iframe>
    {{$route.params.path}}
  </div>
</template>

<script>
import Config from '@/config'
import { Base64 } from 'js-base64';
import { baseURL } from '@/util/axios';
export default {
  name: 'pdf',
  components: {
  },
  data () {
    return {
      path: '',
      fileCode: '',
      src: ''
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.path=Base64.decode(this.$route.query.path);
      this.fileCode=Base64.decode(this.$route.query.fileCode);
      const origin = process.env.NODE_ENV === 'production' ? window.location.origin : 'http://134.175.65.137:8011';
      this.src=`static/TrustStampWeb/web/stamper.html?file=${origin}${this.path}&uploadFileName=${this.fileCode}&uploadUrl=${baseURL}/api/fileupload/signatureUpload`;
      // this.init();
    });
  },
  methods: {
    init () {
    }
  }
};
</script>

<style lang="less" scoped>
#pdf{
  iframe{
    width: 100%;
  }
}
</style>