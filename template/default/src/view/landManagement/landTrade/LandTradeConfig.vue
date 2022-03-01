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
    :confirmShow="!inputDisabled || (editData.canPush === 1) || (editData.canStamp === 1)"
    :confirmText="editData.canPush === 1 ? '受理' : (editData.canStamp === 1 ? '审核通过' : '确定')"
    :cancelShow="!inputDisabled"
    append-to-body
  >
    <div>
      <Entrust ref="entrust" :initId="initId" :data="{ ...editData, ...trust}" @success="val => getEntrast(val)" />
      <base-info ref="baseInfo" :initId="initId" :data="{ ...editData, ...goods}" :options="CONTNT_OPTIONS" @success="val => getBaseInfo(val)" @changeBusinessType="changeBusinessType"/>
      <attach :initId="initId" :data="editData"/>
    </div>
  </dialog-cont>
</template>

<script>
import Wrapper from '@/components/wrapper';
import dialogCont from '@/components/dialog';
import commonApi from '@/mixins/commonApi';
import Entrust from './entrust';
import BaseInfo from './LandTradeConfigBase.vue'
import Attach from './LandTradeConfigAttach.vue'
import { initTargetAttach } from '@/api';
import {
  applyTrust,
  detail,
  commitTrust
} from '@/api/landManagement/tradeList';
import { selectListByParentCode, stampNotice } from '@/api/common';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'landTradeConfig',
  components: {
    Wrapper,
    BaseInfo,
    Attach,
    dialogCont,
    Entrust
  },
  props: {
    data: {},
    show: '',
    dialogModel: true
  },
  mixins: [commonApi()],
  data () {
    const { configType } = this.data;
    return {
      title: '新增',
      inputDisabled: configType === 'detail',
      editshow: false,
      editData: {},
      isAdd: !this.data.targetId,
      form: {
      },
      initId: '',
      CONTNT_OPTIONS: [],
      goods: {},
      trust: {},
      target: {}
    }
  },
  watch: {
    show (val) {
      this.editshow = val;
      this.editData = this.data;
      this.isAdd = !val.targetId;
    },
    data (val) {
      this.inputDisabled = (val.configType === 'detail');
    }
  },
  computed: {
    ...mapGetters(['common'])
  },
  methods: {
    ...mapMutations([
      'set_common'
    ]),
    init (businessType) {
      let targetId = this.initId;
      this.initId = null;
      initTargetAttach({
        businessType,
        targetId
      }).then(res => {
        if (res.code === '200') {
          this.initId = res.data
        }
      })
    },
    changeBusinessType (businessType) {
      if (businessType !== this.goods.businessType) {
        this.init(businessType);
      }
    },
    getData () {
      detail(this.data.targetId).then(res => {
        if (res.code === '200') {
          this.trust = res.data.trust;
          this.goods = {
            ...res.data.goods,
            businessType: res.data.target.businessType,
            beginPrice: res.data.target.beginPrice,
            priceStep: res.data.target.priceStep,
            earnestMoney: res.data.target.earnestMoney,
            hasReservePrice: res.data.target.hasReservePrice,
            reservePrice: res.data.target.reservePrice
          };
          this.target = res.data.target;
          this.initId = res.data.target.id;
          this.editData.canStamp = res.data.canStamp;
        }
      })
    },
    getContent () {
      this.CONTNT_OPTIONS = this.common ? this.common.contentOption : [];
    },
    getEntrast (val) {
      this.trust = {
        ...this.trust,
        ...val
      };
    },
    getBaseInfo (val) {
      this.goods = {
        ...this.goods,
        ...val
      };
      this.target = {
        ...this.target,
        beginPrice: val.beginPrice,
        priceStep: val.priceStep,
        earnestMoney: val.earnestMoney,
        hasReservePrice: val.hasReservePrice,
        reservePrice: val.reservePrice
      };
      delete this.goods.beginPrice;
      delete this.goods.priceStep;
      delete this.goods.earnestMoney;
      delete this.goods.hasReservePrice;
      delete this.goods.reservePrice;
    },
    openedit () {
      this.getContent();
      console.log('this.data', this.data);
      this.isAdd = !this.data.targetId;
      console.log(this.isAdd)
      this.isAdd && this.init();
      !this.isAdd && this.getData();
      this.title = this.isAdd ? '新增委托' : '委托详情';
      this.editData = this.data;
    },
    closeedit () {
      this.editshow = false;
      this.editData = {};
      this.initId = '';
      this.trust = {};
      this.goods = {};
      this.$refs.entrust.cancelForm();
      this.$refs.baseInfo.cancelForm();
    },
    canceledit (type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    async confirmedit () {
      if (!this.inputDisabled) {
        const entrustStatus = await this.$refs.entrust.submitFormItem();
        const baseStatus = await this.$refs.baseInfo.submitForm();
        if (!entrustStatus || !baseStatus) return;
        const parames = {
          goods: this.goods,
          trust: this.trust,
          target: {
            ...this.target,
            id: this.isAdd ? this.initId : this.target.id,
            businessType: this.goods.businessType
          },
          byTrust: '1'
        };
        delete parames.goods.businessType;
        const message = this.isAdd ? '申请委托成功' : '修改申请委托成功';
        applyTrust(parames).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message,
              type: 'success',
              position: 'bottom-right'
            });
            this.canceledit('cancel');
          }
        });
      } else if (this.editData.canPush === 1){
        commitTrust(this.data.targetId).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '受理成功',
              type: 'success',
              position: 'bottom-right'
            });
            this.canceledit('cancel');
          }
        });
      } else if (this.editData.canStamp === 1) {
        stampNotice(this.editData.targetId).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '审核通过成功',
              type: 'success',
              position: 'bottom-right'
            });
            this.canceledit('cancel');
          }
        });
      }
    }
  },
  created () {
  }
}
</script>

<style>

</style>
