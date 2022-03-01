<template>
  <div class="warnTipContainer" v-if="editShow">
    <div class="flexCenter closeBtn" @click="close">
      <i class="el-icon-close"></i>
    </div>
    编号汕尾测试<span>2019838884[2017]994</span>号的出让标的已经到了挂牌截止最后<span>2分钟</span>了，请冷静思考是否需要竞价。在公平、公正、公开的原则下，任何在竞价截止前5分钟内出价，竞价截止时间将会自动刷新5分钟。同时为了防止网络传输不畅，请不要在最后几秒才出价
  </div>
</template>

<script>
export default {
  name: 'warnTip',
  components: {
  },
  props: {
    data: {},
    show: false
  },
  data () {
    return {
      editShow: true,
      editData: {}
    }
  },
  computed: {
    // ...mapGetters(['common'])
  },
  watch: {
    show (val) {
      this.editShow = val
      this.editData = this.data;
    }
  },
  methods: {
    close () {
      this.editShow = false;
      this.$emit('cancel');
    }
  },
  created () {
  }
}
</script>

<style lang="less" scoped>
.warnTipContainer{
  width: 455px;
  position: fixed;
  bottom: 90px;
  right: 36px;
  font-size: 12px;
  color: #3F3F3F;
  padding: 19px 20px 13px;
  text-align: justify;
  background:rgba(255,255,255,1);
  box-shadow:0px -2px 7px 0px rgba(199,199,199,0.5);
  border:1px solid rgba(147,188,253,1);
  z-index: 3;
  line-height: 21px;
  .closeBtn{
    width: 17px;
    height: 17px;
    background:rgba(37,115,241,1);
    position: absolute;
    top: 0;
    right: 0;
    margin-right: 0;
    i{
      font-size: 8px;
      color: #fff;
    }
  }
  span{
    color: #F46100;
  }
}
</style>
