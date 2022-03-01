<template>
  <div class="info">
    <normal-notice :data="info" />
  </div>
</template>

<script>
import NormalNotice from '@/view/peopleDealManagement/peopleDealOfferLog/index';
export default {
  name: 'afterdealList',
  components: {
    NormalNotice
  },
  data () {
    return {
      info: {},
      show: false
    };
  },
  methods: {
    init () {
      this.info = {
        type: 'land'
      };
    }
  },
  created () {
    this.init();
  }
};
</script>

<style>
.info {
  padding: 0 10px;
}
</style>
