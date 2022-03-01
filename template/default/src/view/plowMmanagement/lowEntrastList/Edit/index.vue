<template>
  <div>
    <dialog-cont
      @on-cancel="canceledit('cancel')"
      @on-close="canceledit('close')"
      @on-confirm="confirmedit"
      @on-open="openedit"
      :title="type==='add'?'新增耕地指标':(type==='edit'?'编辑耕地指标':'指标详情')"
      :visible.sync="editshow"
      ref="dialog"
      :confirmShow="confirmCancelEdit || (editData.row && editData.row.canPush === 1) || (editData && editData.canStamp === 1)"
      :cancelShow="confirmCancelEdit"
      :dialogModel="dialogModel"
      :confirmText="(editData.row && editData.row.canPush === 1) ? '受理' : (editData && editData.canStamp === 1 ? '审核通过' : '确定')"
      :bottomShow="!!confirmCancelEdit || !!(curr_transManage === 'transManage' && (curr_btnStatusData.isSuspend || curr_btnStatusData.isStop || curr_btnStatusData.isRestart)) || (editData.row && editData.row.canPush === 1) || (editData && editData.canStamp === 1)"
    >
      <div>
        <Entrust ref="entrust" :initId="initId" :data="{ ...editData, ...trust}"  @success="val => getEntrast(val)" />
        <base-info ref="baseInfo" :initId="initId" :show="editshow" :data="{...target, ...editData}" @notice="canceledit('notice')" @changeBusinessType="changeBusinessType" @success="val => getBaseInfo(val)"/>
        <Attach :initId="initId" :edit="isEdit" />
      </div>
      <div slot="footer" :style="{display: 'flex',justifyContent:'flex-end'}">
        <el-button style="margin-right: 10px;height:40px;" type="primary" v-if="curr_transManage === 'transManage' && curr_btnStatusData.isSuspend === 1" @click="onTargetSuspend">暂停交易</el-button>
        <el-button style="margin-right: 10px;height:40px;" type="primary" v-if="curr_transManage === 'transManage' && curr_btnStatusData.isStop === 1" @click="onTargetStop">终止交易</el-button>
        <el-button class="button" type="primary" v-if="curr_transManage === 'transManage' && curr_btnStatusData.isRestart === 1" @click="onRestartTrade">重启交易</el-button>
      </div>
    </dialog-cont>
    <landSupply :show="landSupplyshow" :data="landSupplydata" @cancel="closeLandEdit"></landSupply>
  </div>
</template>

<script>
import Wrapper from '@/components/wrapper';
import BaseInfo from './base.vue';
import Attach from './Attach';
import Entrust from './entrust';
import dialogCont from '@/components/dialog';
import landSupply from '@/view/plowMmanagement/lowNoticelist/supplyDetail';
import { selectListByParentCode, initSuppleNoticeAttach as initGoodsAttach } from '@/api';
import { initPlowTargetAttach, stampNotice } from '@/api/common';
import { getNoticeDtlByTargetId } from '@/api/landManagement/tarageList';
import {
  applyTrust,
  detail,
  commitTrust
} from '@/api/plowMmanagement/tradeList';
// import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'lowIndexList_edit',
  components: {
    Wrapper,
    BaseInfo,
    dialogCont,
    Attach,
    landSupply,
    Entrust
  },
  props: {
    data: {},
    show: '',
    dialogModel: true
  },
  data () {
    return {
      title: '新增耕地指标',
      isEdit: !!this.data.row,
      isAdd: !this.data.row,
      form: {
      },
      initId: '',
      editshow: false,
      editData: {},
      type:'',
      curr_transManage:'',
      curr_btnStatusData:{},
      confirmCancelEdit: true,
      noticeInfo:{
        id: '',
        no:'',
        name:'',
        noticeDate:''
      },
      landSupplyshow:false,
      landSupplydata:{},
      trust: {},
      target: {}
    }
  },
  computed: {
    // ...mapGetters(['common'])
  },
  watch: {
    show (val) {
      this.editshow = val;
      this.curr_transManage = this.transManage;
      this.curr_btnStatusData = this.btnStatusData;
      this.editData = {
        ...this.data,
        btnStatusData: this.btnStatusData
      }
    },
    data (val) {
      const { configType, row } = val;
      this.isAdd = configType === 'add';
      this.editData = val;
    }
  },
  methods: {
    openedit () {
      const { configType, row } = this.data;
      this.isAdd = configType === 'add';
      this.inputDisabled = configType === 'detail'
      this.type = configType;
      this.curr_transManage = this.transManage || (this.data && this.data.transManage);
      this.curr_btnStatusData = this.btnStatusData || (this.data && this.data.btnStatusData);
      this.isEdit = ['add', 'edit'].includes(configType)
      if(this.isAdd) {
        this.init({});
      } else if(row) {
        this.initId = row.id
      }
      if (this.type === 'detail' || this.type === 'infoTrans' || this.type === 'edit') {
        this.confirmCancelEdit = this.type !== 'detail';
        this.getNoticeDtlByTargetIdFn();
      }else{
        this.confirmCancelEdit = true;
      }
      
    },
    closeedit () {
      this.editshow = false;
      this.editData = {};
      this.target = {};
      this.trust = {};
      this.initId = null;
      this.data.configType = '';
      this.curr_transManage = '';
      this.data.btnStatusData = [];
      this.curr_btnStatusData = [];
      this.$refs.baseInfo.cancelForm();
      this.$refs.entrust.cancelForm();
    },
    canceledit (type) {
      this.closeedit();
      this.$emit('cancel', type);
      if(type === 'notice'){
        this.landSupplydata = { configType:'add', row: this.noticeInfo };
        this.landSupplyshow = true;
      }
    },
    async confirmedit () {
      if (!this.inputDisabled) {
      const entrustStatus = await this.$refs.entrust.submitFormItem();
      const baseStatus = await this.$refs.baseInfo.submitFormItem();
      if (!entrustStatus || !baseStatus) return;
      const parames = {
        trust: this.trust,
        target: {
          ...this.target,
          id: this.isAdd ? this.initId : this.target.id
        },
        byTrust: '1'
      };
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
      } else if (this.data.row.canPush === 1) {
        commitTrust(this.data.row.targetId).then(res => {
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
        stampNotice(this.data.row.targetId).then(res => {
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
    },
    init (data) {
      this.initId = null;
      initPlowTargetAttach(data).then(res => {
        if (res.code === '200') {
          this.initId = res.data
        }
      })
    },
    closeLandEdit (type) {
      this.noticeInfo = {};
      this.landSupplyshow = false;
      this.landSupplydata = {};
      this.canceledit();
    },
    //查询公告详情
    getNoticeDtlByTargetIdFn() {
      const { row } = this.data;
      if (row && row.targetId) {
        detail(row.targetId).then(res => {
          if (res.code === '200') {
            this.trust = res.data.trust;
            this.target = res.data.target;
            this.initId = res.data.target.id;
            this.editData.canStamp = res.data.canStamp;
          }
        })
        .catch(err => {
        });
      }
    },
    //重启交易
    onRestartTrade(){
      this.$refs.baseInfo.onRestartTrade();
    },
    //暂停交易
    onTargetSuspend() {
      this.$refs.baseInfo.onTargetSuspend();
    },
    //终止交易
    onTargetStop() {
      this.$refs.baseInfo.onTargetStop();
    },
    getEntrast (val) {
      this.trust = {
        ...this.trust,
        ...val
      };
    },
    changeBusinessType (businessType) {
      if (businessType !== this.target.businessType) {
        this.init({businessType, targetId: this.initId});
        this.editData.businessType = businessType;
      }
    },
    getBaseInfo (val) {
      this.target = {
        ...this.target,
        ...val
      };
    }
  },
  created () {
    this.editData =  this.data;
    if (this.data && !this.dialogModel) {
      this.openedit()
    }
    // this.isAdd && this.init();
  }
  
}
</script>

<style lang="less" scoped>
.bottom-btn{
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
