<template>
  <div>
    <el-button
      type="primary"
      @click="visible = true"
    >
      显示弹窗
    </el-button>

    <CDialog
      :visible.sync="visible"
    />
  </div>
</template>

<script>
import CDialog from '@/components/dialog';

export default {
  name: 'DialogDemo',
  components: {
    CDialog
  },
  data () {
    return {
      visible: false
    };
  }
};
</script>

<style>

</style>
