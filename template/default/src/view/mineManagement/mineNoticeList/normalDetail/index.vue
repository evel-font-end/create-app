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
  >
    <div>
      <base-info ref="baseInfo" :initId="initId" :html="htmlContent" :data="editData" :bidIds="bidIds" :bankIds="bankIds" @success="canceledit('cancel')" @htmlChange="htmlChange" :getHtmlValue="getHtmlValue"/>
      <bid ref="bid" :type="businessType" @change="bidChange" :data="editData" :transTargetDtos="transTargetDtos"  @getValue="getBusinessTypeValue"/>
      <bank ref="bank" @change="bankChange" :data="editData"  :dto="accountDtos" :show="editshow"/>
      <wangeditor ref="editor" @catchData="catchData" :data="editData" :html="htmlContent" :dialogModel="dialogModel"/>
      <attach :initId="initId" :data="editData" />
    </div>
  </dialog-cont>
</template>

<script>
import Wrapper from '@/components/wrapper'
import BaseInfo from './base.vue'
import Bid from './bid.vue'
import Bank from './bank.vue'
import Attach from './attach.vue';
import Wangeditor from './editor.vue';
import dialogCont from '@/components/dialog';
import { initMineNoticeAttach as initGoodsAttach } from '@/api';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'normalDetail',
  components: {
    Wrapper,
    BaseInfo,
    Attach,
    Bid,
    Bank,
    Wangeditor,
    dialogCont
  },
  props: {
    data: {},
    show: '',
    dialogModel: {
      type: Boolean,
      default: true
    }
  },
  data () {
    const { configType } = this.data;
    return {
      title: '新增公告',
      isAdd: !this.data.row,
      inputDisabled: configType === 'detail',
      form: {
      },
      initId: '',
      htmlContent: '',
      bidIds: [],
      bankIds: [],
      editshow: false,
      editData: {},
      transTargetDtos: [],
      accountDtos: [],
      businessType: ''
    }
  },
  computed: {
    ...mapGetters(['common'])
  },
  watch: {
    show: {
      handler (val, oldval) {
        this.editshow = val;
        // this.editData = this.data;
        if (this.$refs.bid || this.$refs.bank) {
          this.$refs.bid.resetForm();
          this.$refs.bank.resetForm();
        }
      },
      deep: true
    },
    data: {
      handler (newval, oldval) {
        this.editData = newval;
        this.inputDisabled = (newval.configType === 'detail');
        if (this.$refs.bid || this.$refs.bank) {
          this.$refs.bid.resetForm();
          this.$refs.bank.resetForm();
        }
        if (this.show && this.editData && this.dialogModel !== undefined && !this.dialogModel) {
          this.openedit()
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations([
      'set_common'
    ]),
    openedit () {
      this.isAdd = !this.data.row;
      this.isAdd && this.init();
      this.title = this.isAdd ? '新增公告' : '公告详情';
    },
    closeedit () {
      this.editshow = false;
      this.editData = {};
      this.htmlContent = '';
      this.initId = '';
      this.$refs.editor.clear();
      this.$refs.baseInfo.cancelForm();
    },
    canceledit (type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    confirmedit () {
      this.$refs.baseInfo.submitFormItem();
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
    bidChange (ids) {
      this.bidIds = ids;
    },
    bankChange (ids) {
      this.bankIds = ids;
    },
    htmlChange (val) {
      this.initId = val.id;
      this.htmlContent = val.htmlContent;
      this.transTargetDtos = val.transTargetDtos;
      this.accountDtos = val.accountDtos;
    },
    getBusinessTypeValue() {
      this.businessType = this.$refs.baseInfo.getBusinessTypeValue()
    },
    getHtmlValue () {
      return this.$refs.editor.getHtmlValue();
    }
  },
  created () {
    if (this.data && !this.dialogModel) {
      this.editData = this.data
      if (this.$refs.bid || this.$refs.bank) {
        this.$refs.bid.resetForm();
        this.$refs.bank.resetForm();
      }
      this.openedit()
    }
  }
}
</script>

<style>

</style>
