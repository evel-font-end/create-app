<template>
  <dialog-cont
    @on-close="canceledit('close')"
    @on-cancel="confirmedit(0)"
    @on-confirm="confirmedit(1)"
    @on-open="openedit"
    :visible.sync="editshow"
    ref="dialog"
    width="700px"
    append-to-body
    custom-class="lotteryDialog"
    cancelText="放弃"
    confirmText="同意"
    :confirmShow="showbtn"
    :cancelShow="showbtn"
  >
    <div class="container">
      <div>当前已经达到{{editData.isFinalPrice === 1 ? '封顶价' : '底价'}}</div>
      <div>
        <span>{{editData.isFinalPrice === 1 ? editData.finalPriceText : editData.reservePriceText}}</span>{{symbol}}
      </div>
      <div class="flexColumn">
        请确认是否参与摇号，<span>3分钟</span>内未确定将视为自动放弃。
        <div style="margin-top: 5px">{{lotteryTip}}</div>
      </div>
      <div>距离结束时间</div>
      <div class="flexRow flexCenter">
        <span class="flexCenter">{{suptime(editData.dateDownAry && editData.dateDownAry[2])}}</span>分
        <span class="flexCenter">{{suptime(editData.dateDownAry && editData.dateDownAry[3])}}</span>秒
      </div>
      <div class="flexCenter" v-if="showbtn">需要参与摇号确认最终竞得人，您是否同意进行摇号？</div>
    </div>
  </dialog-cont>
</template>

<script>
import Wrapper from '@/components/wrapper';
import dialogCont from '@/components/dialog';
import { toChinese, lotteryTip, plowBusinessTypeList } from '../utils';
import {
  agreeLottery
} from '@/api/peopleDealManagement/peopleDealOfferLog';
// import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'resultTips',
  components: {
    Wrapper,
    dialogCont
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    show: false
  },
  data () {
    return {
      title: '确定出价',
      editshow: false,
      editData: {},
      lotteryTip: '',
      showbtn: true,
      symbol: '万元',
    }
  },
  computed: {
    // ...mapGetters(['common'])
  },
  watch: {
    show (val) {
      this.editshow = val;
    },
    data (val) {
      this.editData = val;
      this.showbtn = val.canDoLottery === 1,
      this.lotteryTip = lotteryTip(val.isFinalPrice === 1 ? '封顶价' : '底价');
      this.symbol =  plowBusinessTypeList.indexOf(val.businessType) > -1 ? '万元' : '万元';
    }
  },
  methods: {
    suptime (time) {
      return +time < 10 ? `0${time}` : time;
    },
    openedit () {
      this.init();
    },
    closeedit () {
      this.editshow = false;
      this.editData = {};
    },
    canceledit (type, status) {
      this.closeedit();
      const cancel = {
        type,
        status
      }
      this.$emit('cancel', cancel);
    },
    confirmedit (status) {
      const parames = {
        status,
        targetId: this.editData.targetId
      };
      agreeLottery(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '确认成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.editshow = false;
          this.editData = {};
          this.canceledit('cancel', status)
        }
      })
    },
    init () {
    }
  },
  created () {
    // this.isAdd && this.init();
  }
}
</script>
<style lang="less">
.lotteryDialog{
  width: 449px;
  .el-dialog__footer{
    border-top: none;
  }
  .el-dialog__header{
    display: none;
  }
}
</style>
<style lang="less" scoped>
.container{
  padding: 16px 20px 0;
  position: relative;
  >div{
          font-size:16px;
      font-weight:400;
      color:rgba(71,71,71,1);
    &:first-child{
    }
    &:nth-child(2) {
      margin: 5px 0px;
      span{
        font-size:30px;
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:rgba(255,121,1,1);
        margin-right: 8px;
      }
    }
    &:nth-child(3) {
      span{
        color: #FF7901;
      }
    }
    &:nth-child(4) {
      width: 135px;
      text-align: center;
      background: #fff;
      position: absolute;
      top: 171px;
      right: 50%;
      margin-right: -67.5px;
    }
    &:nth-child(5) {
      margin-top:23px;
      padding: 30px 0 16px;
      font-size:18px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(71,71,71,1);
      border-top: 1px dotted #979797;
      span{
        margin:0 10px;
        width:76px;
        height:67px;
        background:linear-gradient(140deg,rgba(215,231,255,1) 0%,rgba(247,251,255,1) 100%);
        filter: progid:DXImageTransform.Microsoft.gradient(GradientType=1, startColorstr=rgba(215,231,255,1), endColorstr=rgba(247,251,255,1));
        border-radius:8px;
        border:1px solid rgba(215,223,255,1);
          font-size:46px;
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:rgba(255,121,1,1);
        line-height:65px;
        text-shadow:0px 2px 3px rgba(200,221,251,1);
      }
    }
    &:last-child{
      font-size:16px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(71,71,71,1);
    }
  }
}
</style>
