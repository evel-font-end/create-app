<template>
  <div id="entrance">
    <div class="in_b box" 
      v-for="(item, index) in items"
      :key="`item${index}`"
      :style="item.style"
      @click="goDetail(item)"
    >
      <img :src="item.img1" class="in_b img1"/>
      <div class="in_b info">
        <h4 class="fs22 c_f">{{item.title}}</h4>
        <span class="fs14 c_f" :style="{background: item.textBgColor}">查看详情</span>
      </div>
      <img :src="item.img2" class="in_b img2"/>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },
  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    },
  },
  mounted () {
    this.$nextTick(() => {
      // this.init();
    });
  },
  methods: {
    goDetail (item) {
      this.$emit('onChange', item);
    },
  },
  watch: {
  }
};
</script>

<style lang="less" scoped>
#entrance{
  .box{
    position: relative;
    width:384px;
    height:130px;
    border-radius:4px;
    margin-right: 17px;
    padding: 15px;
    cursor: pointer;
    &:nth-child(3n) {
      margin-right: 0;
    }
    .img1{
      width: 91px;
      height: 91px;
      margin-right: 28px;
      position: absolute;
      left: 33px;
      bottom: 15px;
    }
    .img2{
      width: 56px;
      height: 45px;
      position: absolute;
      right: 15px;
      bottom: 15px;
    }
    .info {
      line-height: 30px;
      padding-top: 10px;
      padding-left: 119px;
      h4{
        margin-top: 7px;
        margin-bottom: 10px;
      }
      span{
        padding: 3px 10px;
        background:rgba(48,107,255,1);
        border-radius:50px;
      }
    }
  }
}
</style>
