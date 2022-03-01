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
      :confirmShow="confirmCancelEdit"
      :cancelShow="confirmCancelEdit"
      :dialogModel="dialogModel"
      :bottomShow="!!confirmCancelEdit || !!(curr_transManage === 'transManage' && (curr_btnStatusData.isSuspend || curr_btnStatusData.isStop || curr_btnStatusData.isRestart))"
      appendToBody
    >
      <div>
        <base-info ref="baseInfo" :initId="initId" :show="editshow" :data="{...target, ...editData}" @success="success" @notice="canceledit('notice')" @changeFormBusinessType="changeFormBusinessType"/>
        <Attach :initId="initId" :edit="isEdit" />
      </div>
      <div slot="footer" :style="{display: 'flex',justifyContent:'flex-end'}">
        <el-button style="margin-right: 10px;height:40px;" type="primary" v-if="curr_transManage === 'transManage' && curr_btnStatusData.isSuspend === 1" @click="onTargetSuspend">暂停交易</el-button>
        <el-button style="margin-right: 10px;height:40px;" type="primary" v-if="curr_transManage === 'transManage' && curr_btnStatusData.isStop === 1" @click="onTargetStop">终止交易</el-button>
        <el-button class="button" type="primary" v-if="curr_transManage === 'transManage' && curr_btnStatusData.isRestart === 1" @click="onRestartTrade">重启交易</el-button>
      </div>
    </dialog-cont>
    <landSupply :show="landSupplyshow" :data="landSupplydata" @cancel="closeEdit"></landSupply>
  </div>
</template>

<script>
import Wrapper from '@/components/wrapper';
import BaseInfo from './base.vue';
import Attach from './Attach';
import dialogCont from '@/components/dialog';
import landSupply from '@/view/plowMmanagement/lowNoticelist/supplyDetail';
import { initPlowTargetAttach } from '@/api/common';
import { getNoticeDtlByTargetId } from '@/api/landManagement/tarageList';
import {
  detail
} from '@/api/plowMmanagement/tradeList';
export default {
  name: 'lowIndexList_edit',
  components: {
    Wrapper,
    BaseInfo,
    dialogCont,
    Attach,
    landSupply
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
      target: {},
      trust: {}
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
      if(this.isAdd) {
        // this.init({});
      } else if(row) {
        this.initId = row.id
      }
    }
  },
  methods: {
    openedit () {
      const { configType, row } = this.data;
      this.isAdd = configType === 'add';
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
        this.confirmCancelEdit = (this.type === 'edit');
        this.getNoticeDtlByTargetIdFn();
      }else{
        this.confirmCancelEdit = true;
      }
      
    },
    closeedit () {
      this.editshow = false;
      this.editData = {};
      this.target = {};
      this.turst = {};
      this.initId = null;
      this.data.configType = '';
      this.curr_transManage = '';
      this.data.btnStatusData = [];
      this.curr_btnStatusData = [];
      this.$refs.baseInfo.cancelForm();
    },
    canceledit (type) {
      this.closeedit();
      this.$emit('cancel', type);
      if(type === 'notice'){
        this.landSupplydata = { configType:'add', row: this.noticeInfo };
        this.landSupplyshow = true;
      }
    },
    confirmedit () {
      this.$refs.baseInfo.submitFormItem();
    },
    init (data) {
      this.initId = null;
      initPlowTargetAttach(data).then(res => {
        if (res.code === '200') {
          this.initId = res.data;
        }
      })
    },
    changeFormBusinessType (val) {
      this.init({businessType: val, targetId: this.initId});
      this.editData.businessType = val;
    },
    closeEdit (type) {
      this.noticeInfo = {};
      this.landSupplyshow = false;
      this.landSupplydata = {};
      this.canceledit();
    },
    //查询公告详情
    getNoticeDtlByTargetIdFn() {
      const { row } = this.data;
      if (row && row.id) {
        this.initId = null;
        detail(row.id).then(res => {
          if (res.code === '200') {
            this.target = {
              ...res.data.target,
              priceStep: res.data.target.priceStep ? Math.abs(res.data.target.priceStep) : undefined
            };
            this.initId = this.target.id;
            this.trust = res.data.trust;
            this.getNoticeDtlByTargetIdFunction();
          }
        })
        .catch(err => {
        });
      }
    },
    getNoticeDtlByTargetIdFunction() {
      let id = this.initId;
      getNoticeDtlByTargetId(id)
        .then(res => {
          if (res.code === '200') {
            this.noticeInfo = {
              id: res.data.id,
              no: res.data.no,
              name: res.data.name,
              noticeDate: res.data.noticeDate
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
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
    success(val) {
      this.$emit('success', val);
      this.canceledit('cancel');
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
