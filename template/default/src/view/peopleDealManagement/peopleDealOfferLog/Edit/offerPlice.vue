<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    :title="title"
    :visible.sync="editshow"
    ref="dialog"
    append-to-body
  >
    <div class="container">
      <div class="fs14 tx_c fw400">您此次的报价金额为</div>
      <div class="plice">
          <div class="fs42"><span class="fs28">¥</span>{{editData.pliceText}}</div>
          <div class="fs12 fw600">{{pliceChinese}}</div>
      </div>
      <div class="fs14 tx_c fw400">点击<span style="color: #2573F1">“确认”</span>按钮发生报价</div>
    </div>
  </dialog-cont>
</template>

<script>
import Wrapper from '@/components/wrapper';
import dialogCont from '@/components/dialog';
import { toChinese } from '../utils';
import { selectListByParentCode, initSuppleNoticeAttach as initGoodsAttach } from '@/api';
// import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'offerPlice',
  components: {
    Wrapper,
    dialogCont
  },
  props: {
    data: {},
    show: ''
  },
  data () {
    return {
      title: '确定出价',
      pliceChinese: toChinese(1000),
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
    data (val) {
      this.editData = val;
      this.pliceChinese = toChinese(val.plice)
    }
  },
  methods: {
    openedit () {
      // this.init();
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
      this.$emit('success', this.editData);
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
    // this.isAdd && this.init();
  }
}
</script>

<style lang="less" scoped>
.container{
  display: block;
  text-align: center;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  margin: 0 auto;
  // span{
  //   display: block;
  //   text-align: center;
  //   align-items: center;
  //   justify-content: center;
  // }
  .plice {
    display: inline-block;
    padding: 15px 20px;
    width:auto;
    height:auto;
    background:linear-gradient(131deg,rgba(255,244,233,1) 0%,rgba(255,238,226,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(GradientType=1, startColorstr=rgba(255,244,233,1), endColorstr=rgba(255,238,226,1));
    border-radius:11px;
    font-size:24px;
    font-family:PingFangSC-Semibold,PingFang SC;
    font-weight:600;
    color:rgba(249,137,67,1);
    margin: 20px 0px;
    text-align: center;
    >div{
      &:first-child{
        line-height: 37px;
        margin-bottom: 15px;
        span{
          margin-right: 5px;
          line-height: 36px;
          height: 100%;
          display: inline-block;
          vertical-align: top;
        }
      }
    }
  }
}
</style>
