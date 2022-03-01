<template>
  <div id="base">


    <div class="content-view">

    </div>
  </div>
</template>

<script>

export default {
  name: 'baseInfo',
  components: {

  },
  props: {
    data: {}
  },
  data () {
    return {
      /** 输入禁用 */

    };
  },
  mounted () {
    this.$nextTick(() => {});
  },
  computed: {},
  watch: {

  },
  methods: {

  },
  created () {

  }
};
</script>

<style lang="less" scoped>
#base {
}
</style>
