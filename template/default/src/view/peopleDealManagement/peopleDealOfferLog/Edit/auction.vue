<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-open="openedit"
    :title="title"
    width="680px"
    :visible.sync="editshow"
    ref="dialog"
    append-to-body
    :confirmShow="false"
    :cancelShow="false"
  >
    <div class="flexCloumn flexCenter container">
      <img src="../images/reject.png" />
     <span class="flexRow flexCenter">{{editData.dealResultMsg}}，<span>已流拍！</span></span>
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
  name: 'auction',
  components: {
    Wrapper,
    dialogCont
  },
  props: {
    show: '',
    data: {}
  },
  data () {
    return {
      title: '交易流拍',
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
    }
  },
  methods: {
    openedit () {
      // this.init();
    },
    closeedit () {
      this.editshow = false;
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
.container{
  padding-bottom: 30px;
  position: relative;
  img {
    width: 250px;
    height: auto;
  }
  >span{
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    font-size:21px;
    font-family:PingFangSC-Semibold,PingFang SC;
    font-weight:600;
    color:rgba(73,73,73,1);
    span{
      color: #FF7901;
    }
  }
}
</style>
