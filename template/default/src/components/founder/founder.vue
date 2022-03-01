<template>
    <div id="founder" class="">
        <span class="f-l"><i class="iconfont icon-account"></i>{{nameTitle}}：{{name}}</span>
        <span class="f-r-c" v-if="dateVisible"><i class="iconfont icon-shijian"></i>{{dateTitle}}：{{date}}</span>
    </div>
</template>

<script>
export default {
  props: {
    nameTitle: {
      type: String,
      default: "创建人"
    },
    dateTitle: {
      type: String,
      default: "创建时间"
    },
    name: {
      type: String,
      default: ""
    },
    date: {
      type: String,
      default: ""
    },
    dateVisible: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="less" scoped>
#founder {
  color: #b9b9b9;
  font-size: 12px;
  i {
    font-size: 13px;
    margin-right: 2px;
  }
  .f-r-c{
    margin-left: 20px;
    display: inline-block;
  }
}
</style>

