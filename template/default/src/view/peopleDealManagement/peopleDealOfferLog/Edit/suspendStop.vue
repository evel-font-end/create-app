<template>
  <div class="flexCenter resultTipscontainer">
    <div class="center tip">
      <img :src="image && image.btn" class="centerIcon"/>
      <img :src="image && image.main" class="center"/>
      <div class="flexCloumn info">
        {{image.text}}
      </div>
    </div>
  </div>
</template>

<script>
import Wrapper from '@/components/wrapper';
import dialogCont from '@/components/dialog';
import { toChinese } from '../utils';
import { selectListByParentCode, initSuppleNoticeAttach as initGoodsAttach } from '@/api';
import suspendBtn from '../images/suspend.png';
import stopBtn from '../images/stop.png';
import noDown from '../images/noDown.png';
const tipsBtn = {
  'suspend': {
    btn: suspendBtn,
    main: noDown,
    text: '当前标的已中止'
  },
  'stop': {
    btn: stopBtn,
    main: noDown,
    text: '当前标的已终止'
  }
};
// import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'suspendStop',
  components: {
    Wrapper,
    dialogCont
  },
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      image: tipsBtn['suspend'],
      editData: {},
      isLottery: false,
      isAuction: false
    }
  },
  computed: {
    // ...mapGetters(['common'])
  },
  watch: {
    info (val) {
      this.editData = { ...this.editData, ...val };
      this.changeData(this.editData);
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.editData = { ...this.editData, ...this.info};
      this.changeData(this.editData);
    })
  },
  methods: {
    changeData (val) {
      const status = val.isSuspend === 1 ? 'suspend' : 'stop';
      this.image = tipsBtn[status];
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
        font-size:20px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:600;
        color:rgba(63,63,63,1);
        text-align: center;
        margin: 20px 0 10px;
      }
    }
  }
}
</style>
