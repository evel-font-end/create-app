<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Config from '@/config'
export default {
  name: 'App'
}
</script>




<style lang="less" scoped>
#app{min-height: 100%}
</style>
<style lang="less">
.comp-page-table{  //table的class
    /deep/.el-table__fixed, /deep/.el-table__fixed-right{
       height: 100% !important; //设置高优先，以覆盖内联样式
     }
}
</style>
