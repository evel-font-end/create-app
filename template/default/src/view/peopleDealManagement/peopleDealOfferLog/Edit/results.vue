<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-open="openedit"
    :visible.sync="editshow"
    ref="dialog"
    append-to-body
    :cancelShow="false"
    :confirmShow="false"
    custom-class="resultDialog"
  >
    <div class="container">
      <i class="el-icon-error" @click="canceledit('cancel')"></i>
      <div class="center success" :class="plowIsHide && 'plowIsHide'" v-if="(editData.dealStatus === 1 || editData.dealStatus === 4) && editData.isDealBidder === 1">
        <img src="../images/successText.png" />
        <el-tooltip  effect="light" :content="`${editData.targetNo} 的${plowIsHide ? '耕地指标' : '宗地'}活动已经结束，此标的以最终`" placement="top-start" class="no">
          <div>
            <span style="color: rgba(155,40,23,1)">{{editData.targetNo}}</span>
            {{`的${plowIsHide ? '耕地指标' : '宗地'}活动已经结束，此标的以最终`}}
          </div>
        </el-tooltip>
        <div class="pice" v-if="!plowIsHide">
          <span class="title">地</span>价：<span style="color: #C93621">{{editData.dealPriceText}}</span>
          <span>万元</span>
        </div>
        <div class="pice" v-if="plowIsHide">
          <span class="title">单</span>价：
          <span style="color: #C93621">{{editData.dealPriceText}}</span>
          <span>万元</span>
        </div>
        <div class="pice" v-if="plowIsHide">
          <span class="title">总</span>价：
          <span style="color: #C93621">{{editData.plowTotalPriceText}}</span>
          <span>万元</span>
        </div>
        <div class="who">竞得人为：<span style="color: #C93621">{{editData.dealBidderText}}</span></div>
        <div class="tx_r tips">非常感谢您的参与和支持</div>
      </div>
      <div class="center error" :class="plowIsHide && 'plowIsHide'" v-if="editData.isDealBidder !== 1">
        <img src="../images/err.png" class="err"/>
        <img src="../images/errbtn.png" class="errbtn"/>
        <div class="flexCloumn info">
          <div class="">
            <span class="no">{{editData.targetNo}}</span>
            竞拍活动已结束，此标的以最终
          </div>
          <div class="flexRow" v-if="!plowIsHide">
              地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价:
              <span class="pice">{{editData.dealPriceText}}</span>万元
          </div>
          <div class="flexRow" v-if="plowIsHide">
              单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价:
              <span class="pice">{{editData.dealPriceText}}</span>万元
          </div>
          <div class="flexRow" v-if="plowIsHide">
              总&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价:
              <span class="pice">{{editData.plowTotalPriceText}}</span>万元
          </div>
          <div class="flexRow">
            竞得人为:
            <div class="who">{{editData.dealBidderText}}</div>
          </div>
        </div>
        <div class="tip">非常感谢您的参与！</div>
      </div>
    </div>
  </dialog-cont>
</template>

<script>
import Wrapper from '@/components/wrapper';
import dialogCont from '@/components/dialog';
import { toChinese, plowBusinessTypeList } from '../utils';
import { selectListByParentCode, initSuppleNoticeAttach as initGoodsAttach } from '@/api';
// import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'results',
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
      plowIsHide: false
    }
  },
  computed: {
    // ...mapGetters(['common'])
  },
  watch: {
    show (val) {
      this.editData = this.data;
      this.editshow = val;
      this.plowIsHide = plowBusinessTypeList.indexOf(this.editData.businessType) > -1;
    }
  },
  methods: {
    openedit () {
      this.init();
    },
    closeedit () {
      this.editshow = false;
      this.editData = {};
    },
    canceledit (type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    confirmedit () {
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
.resultDialog{
  background: transparent !important;
  box-shadow: none;
  .el-dialog__header, .el-dialog__footer{
    display: none !important;
  }
}
</style>
<style lang="less" scoped>
.container{
  position: relative;
  >i{
    font-size: 29px;
    position: absolute;
    color: #efeef1;
    right: -38px;
    top: -28px;
    cursor: pointer;
  }
  .center {
    height: 452px;
    position: relative;
    box-sizing: border-box;
    &.success{
      background: url('../images/success.png') no-repeat center;
      background-size: 100% 100%;
      padding: 150px 116px 100px;
      &.plowIsHide{
        padding: 130px 116px 100px;
      }
      >img{
        width: 120px;
        height: 54px;
        position: absolute;
        top: 100px;
        left: 50%;
        margin-left: -60px;
        margin-top: -27px;
      }
      .no{
        width: 100%;
        font-size:16px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:#494949;
        text-align: left;
        margin-bottom: 14px;
        line-height: 28px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        span{
          margin-right: 5px;
        }
      }
      .pice{
        width: 100%;
        font-size:20px;
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:#494949;
        display: flex;
        align-items: center;
        margin-bottom: 14px;
        .title{
          letter-spacing: 2em;
        }
        >span:last-child{
          color: #5D5D5D;
          margin-left: 10px;
        }
      }
      .who{
        width: 100%;
        font-size:20px;
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:#494949;
        text-align: left;
      }
      .tips{
        margin-top: 25px;
        font-size:14px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(58,58,58,1);
      }
    }
    &.error{
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fff;
      padding: 27px 53px;
      &.plowIsHide{
        // padding: 130px 116px 100px;
      }
      .err{
        width: 214px;
        height: 161px;
      }
      .errbtn{
        width: 132px;
        height: 44px;
        margin: 15px 28px;
      }
      .lotteryInfo{
        min-width: 165px;
        font-size: 14px;
        color: #5D5D5D;
      }
      .info{
        min-width: 165px;
        >div{
          align-items: center;
          margin: 3px 0;
          min-height: 25px;
          height: auto;
          &:first-child{
            font-size: 14px;
            line-height: 26px;
            color: #5D5D5D;
          }
          &:first-child{
            font-size: 14px;
            color: #5D5D5D;
          }
          &:first-child{
            font-size: 14px;
            color: #5D5D5D;
          }
        }
      }
      .tip{
        width: 100%;
        text-align: right;
        margin-top: 23px;
      }
      .no{
        font-size:18px;
        font-weight:600;
        color:#E84221;
         height: 20px;
        line-height: 20px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .pice{
        font-size:18px;
        font-weight:600;
        color:#E84221;
        display: flex;
        align-items: center;
        margin-left: 5px;
        margin-right: 3px;
        height: 20px;
        line-height: 20px;
      }
      .who{
        font-size:18px;
        font-weight:600;
        color:#E84221;
        margin-left: 5px;
        text-align: left;
      }
    }
  }
}
</style>
