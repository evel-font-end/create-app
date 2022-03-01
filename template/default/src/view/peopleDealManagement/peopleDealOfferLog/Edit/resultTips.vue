<template>
  <div class="flexCenter resultTipscontainer">
    <div class="center tip">
      <img :src="image && image.btn" class="centerIcon"/>
      <img :src="image && image.main" class="center"/>
      <div class="f-20 info finalPrice" v-if="isLottery">
          当前已达到封顶价<span style="color: #FF7901">{{info.finalPriceText}}</span>元，此轮交易结束后将进行参与摇号确认
      </div>
      <div class="flexCloumn info" v-if="!isLottery">
        <div class="flexRow">
          <span>竞得人</span>
          <div class="no">{{editData.dealBidderText ? editData.dealBidderText : '无'}}</div>
        </div>
        <div class="flexRow plice" v-if="!plowIsHide">
            <span>成交价</span>
            <div class="flexCloumn pice">
              <span class="money">{{editData.dealPriceText ? editData.dealPriceText : '无'}}<span>{{!isAuction ? '万元' : ''}}</span></span>
              <span class="moneytext" v-if="editData.dealPrice">{{toChinese(editData.dealPrice)}}</span>
            </div>
        </div>
        <div class="flexRow plice" v-if="plowIsHide">
            <span>成交单价</span>
            <div class="flexCloumn pice">
              <span class="money">{{editData.dealPriceText || '无'}}<span>{{!isAuction ? '万元' : ''}}</span></span>
              <span class="moneytext" v-if="editData.dealPrice">{{toChinese(editData.dealPrice)}}</span>
            </div>
        </div>
        <div class="flexRow plice" v-if="plowIsHide">
            <span>成交总价</span>
            <div class="flexCloumn pice">
              <span class="money">{{editData.plowTotalPriceText || '无'}}<span>{{!isAuction ? '万元' : ''}}</span></span>
              <span class="moneytext" v-if="editData.plowTotalPrice">{{toChinese(editData.plowTotalPrice)}}</span>
            </div>
        </div>
        <div class="flexRow" v-if="isAuction">
          <span>流拍原因</span>
          <div class="time">{{editData.dealResultMsg}}</div>
        </div>
        <div class="flexRow" v-if="!isAuction">
          <span>成交时间</span>
          <div class="time">{{editData.endTransTime || '无'}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Wrapper from '@/components/wrapper';
import dialogCont from '@/components/dialog';
import { toChinese, plowBusinessTypeList } from '../utils';
import { selectListByParentCode, initSuppleNoticeAttach as initGoodsAttach } from '@/api';
import downBtn from '../images/downBtn.png';
import auctionBtn from '../images/auction.png';
import lotteryBtn from '../images/lottery.png';
import down from '../images/down.png';
import noDown from '../images/noDown.png';
const tipsBtn = {
  5: {
    btn: downBtn,
    main: down
  },
  6: {
    btn: auctionBtn,
    main: noDown
  },
  3: {
    btn: lotteryBtn,
    main: noDown
  }
};
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
    info: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      title: '确定出价',
      image: tipsBtn[5],
      editData: {},
      isLottery: false,
      isAuction: false,
      plowIsHide: false
    }
  },
  computed: {
    // ...mapGetters(['common'])
  },
  watch: {
    data (val) {
      this.editData = { ...this.editData, ...val };
      console.log('this.editData', this.editData);
      this.changeData(this.editData);
    },
    info (val) {
      this.editData = { ...this.editData, ...val };
      this.changeData(this.editData);
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.editData = { ...this.editData, ...this.data, ...this.info};
      this.changeData(this.editData);
    })
  },
  methods: {
    changeData (val) {
      this.isLottery = val.dealStatus === 3;
      this.isAuction = this.data.targetStatus === 6 || val.targetStatus === 6;
      this.image = this.isLottery ? tipsBtn[val.dealStatus] : tipsBtn[val.targetStatus];
      this.plowIsHide = plowBusinessTypeList.indexOf(val.businessType) > -1;
    },
    toChinese (number) {
      return toChinese(number)
    },
    closeedit () {
      this.editshow = false;
      this.editData = {};
    },
    canceledit (type) {
      this.closeedit();
      this.$emit('cancel', type);
    }
  },
  created () {
    // this.isAdd && this.init();
  }
}
</script>
<style lang="less" scoped>
.resultTipscontainer{
  // width: 449px;
  position: relative;
  margin: 30px 0 20px;
  .center {
    width: auto;
    height: 376px;
    position: relative;
    &.tip{
      min-width: 437px;
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background:rgba(255,255,255,1);
      box-shadow:0px 1px 7px 0px rgba(191,191,191,0.5);
      border-radius:8px;
      border:1px solid rgba(246,246,246,1);
      padding: 168px 30px 50px;
      box-sizing: border-box;
      .centerIcon{
        position: absolute;
        top: 0;
        right: 0;
        width: 95px;
        height: 85px;
      }
      .center{
        position: absolute;
        top: 24px;
        right: 50%;
        margin-right: -79px;
        width: 158px;
        height: 161px;
      }
      .info{
        width: 100%;
        &.finalPrice{
          width: 380px;
          padding-top: 10px;
        }
        >div{
          align-items: center;
          margin: 3px 0 20px;
          >span{
              width: 97px;
              font-size:20px;
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(63,63,63,1);
              text-align: left;
            }
          &:first-child{
            div{
              flex: 1;
              font-size:20px;
              font-family:PingFangSC-Semibold,PingFang SC;
              font-weight:600;
              color:rgba(63,63,63,1);
            }
          }
          &.plice{
            align-items: flex-start;
            >div{
              flex: 1;
              >span{
                display: flex;
                &.money{
                    font-size:30px;
                    font-family:Impact;
                    color:rgba(255,121,1,1);
                    line-height:36px;
                    letter-spacing:2px;
                    margin-right: 10px;
                    span{
                      font-size:14px;
                      font-family:PingFangSC-Medium,PingFang SC;
                      font-weight:500;
                      color:rgba(93,93,93,1);
                      line-height: 21px;
                      height: 22px;
                      align-self: flex-end;
                      margin-left: 3px;
                    }
                }
                &.moneytext{
                  font-size:18px;
                  font-family:PingFangSC-Medium,PingFang SC;
                  font-weight:500;
                  color:rgba(63,63,63,1);
                  margin-top: 5px;
                }
              }
            }
          }
          &:last-child{
            margin-bottom: 0;
            div{
              flex: 1;
              font-size:20px;
              font-family:PingFangSC-Semibold,PingFang SC;
              font-weight:600;
              color:rgba(63,63,63,1);
            }
          }
        }
      }
    }
  }
}
</style>
