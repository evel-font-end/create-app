<template>
  <div id="tittle">
      <div class="home_module_2 w">
      <div class="tab_content">
          <div class="module_title c_17 fs26 b in_b va_m">{{title}}</div>
      </div>
      <slot></slot>
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
    title: '',
  },
  mounted () {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init () {
    },
  },
  watch: {
  }
};
</script>

<style lang="less" scoped>
#tittle{
      .home_module_2 {
      .tab_content {
        width: 100%;
        border-bottom: 2px solid #115EDB;
        margin-bottom: 20px;
        .module_title {
          padding-bottom: 11px;
          border-bottom: 6px solid #115EDB;
        }
      }
    }
}
</style>
