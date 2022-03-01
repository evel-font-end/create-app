<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    :title="`${title}`"
    :visible.sync="editshow"
    appendToBody
    ref="dialog"
    :dialogModel="dialogModel"
  >
    <div>
      <base-info ref="baseInfo" :initId="initId" :show="editshow" :data="editData" @success="canceledit('cancel')"/>
    </div>
  </dialog-cont>
</template>

<script>
import Wrapper from '@/components/wrapper';
import BaseInfo from './base.vue';
import dialogCont from '@/components/dialog';
import { selectListByParentCode, initSuppleNoticeAttach as initGoodsAttach } from '@/api';
// import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'supplyDetail',
  components: {
    Wrapper,
    BaseInfo,
    dialogCont
  },
  props: {
    data: {},
    show: '',
    dialogModel: true
  },
  data () {
    return {
      title: '新增委托人',
      isAdd: !this.data.row,
      form: {
      },
      initId: '',
      editshow: false,
      editData: {}
    }
  },
  computed: {
    // ...mapGetters(['common'])
  },
  watch: {
    show (val) {
      this.editshow = val;
    },
    data(val) {
      this.editData = val;
    }
  },
  methods: {
    openedit () {
      const { configType, row } = this.data;
      this.isAdd = configType === 'add';
      this.isAdd ? this.init() : this.initId = row.id;
      this.title = this.isAdd ? '新增委托人' : '修改委托人';
    },
    closeedit () {
      this.editshow = false;
      this.editData = {};
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
    }
  },
  created () {
    this.editData =  this.data;
    if (this.data && this.data.row && !this.dialogModel) {
      this.openedit()
    }
    // this.isAdd && this.init();
  }
}
</script>

<style lang="less" scoped>

</style>
