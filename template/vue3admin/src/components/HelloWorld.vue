<template>
  <div class="hello">
    <el-button type="primary" @click="handleClick">主要按钮</el-button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Component, Emit } from "vue-property-decorator";

export default {
  setup() {
    const handleClick = () => {
    }
    return {
      handleClick
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
