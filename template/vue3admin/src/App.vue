<script lang="ts" setup>
import zhCn from "element-plus/es/locale/lang/zh-cn" // Element Plus 中文包
</script>
<template>
  <el-config-provider :locale="zhCn" id="app">
    <router-view />
  </el-config-provider>
</template>

<style lang="less">
#app {
  height: 100%;
  background: #EEF1F8;
}
</style>
