<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    :title="`${title}`"
    :visible.sync="editshow"
    ref="dialog"
    :dialogModel="dialogModel"
    :confirmShow="!inputDisabled"
    :cancelShow="!inputDisabled"
    append-to-body
  >
    <div>
      <base-info ref="supplyBaseInfo" :initId="initId" :html="htmlContent" :show="editshow" :data="editData" @success="canceledit('cancel')" @htmlChange="htmlChange" :getHtmlValue="getHtmlValue"/>
      <wangeditor ref="editor" @catchData="catchData" :data="editData" :html="htmlContent"/>
      <attach :initId="initId" :data="editData" />
    </div>
  </dialog-cont>
</template>

<script>
import Wrapper from '@/components/wrapper';
import BaseInfo from './base.vue';
import Wangeditor from './editor.vue';
import Attach from './attach.vue';
import dialogCont from '@/components/dialog';
import { selectListByParentCode, initSuppleNoticeAttach as initGoodsAttach } from '@/api';
// import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'supplyDetail',
  components: {
    Wrapper,
    BaseInfo,
    Wangeditor,
    Attach,
    dialogCont
  },
  props: {
    data: {},
    show: '',
    dialogModel: true
  },
  data () {
    const { configType } = this.data;
    return {
      title: '新增补充公告',
      isAdd: !this.data.row,
      inputDisabled: configType === 'detail',
      form: {
      },
      initId: '',
      htmlContent: '',
      editshow: false,
      editData: {}
    }
  },
  computed: {
    // ...mapGetters(['common'])
  },
  watch: {
    show: {
      handler (val, oldval) {
        this.editshow = val;
      },
      deep: true
      // this.editData = this.data;
    },
    data: {
      handler (newval, oldval) {
        this.editData = newval;
        this.inputDisabled = (newval.configType === 'detail');
        if (this.show && this.editData && this.dialogModel !== undefined && !this.dialogModel) {
          this.openedit()
        }
      },
      deep: true
    }
  },
  methods: {
    openedit () {
      this.isAdd = this.data.configType === 'add';
      this.isAdd && this.init();
      this.title = this.isAdd ? '新增补充公告' : '补充公告详情';
    },
    closeedit () {
      this.editshow = false;
      this.editData = {};
      this.htmlContent = '';
      this.$refs.supplyBaseInfo.cancelForm();
    },
    canceledit (type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    confirmedit () {
      this.$refs.supplyBaseInfo.submitFormItem();
    },
    init () {
      initGoodsAttach().then(res => {
        if (res.code === '200') {
          this.initId = res.data
        }
      })
    },
    catchData (val) {
      this.htmlContent = val;
    },
    htmlChange (val) {
      this.htmlContent = val.htmlContent;
    },
    getHtmlValue () {
      return this.$refs.editor.getHtmlValue();
    }
  },
  created () {
    if (this.data && !this.dialogModel) {
      this.editData = this.data
      this.openedit()
    }
  }
}
</script>

<style>

</style>
