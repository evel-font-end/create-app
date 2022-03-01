<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="canceledit('close')"
    @on-open="openedit"
    :title="`${title}`"
    
    :visible.sync="editshow"
    ref="dialog"
  >
    <div>
      <attach :idata="editdata"/>
    </div>
  </dialog-cont>
</template>

<script>
import Wrapper from '@/components/wrapper';
import Attach from './attach.vue';
import dialogCont from '@/components/dialog';
import { initTransLicenseAttach } from '@/api/peopleDealManagement/biddingPriceList';
// import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'detail',
  components: {
    Wrapper,
    Attach,
    dialogCont
  },
  props: {
    idata: {},
    show: false
  },
  data () {
    return {
      title: '新增附件',
      editshow: false,
      editdata: {}
    }
  },
  computed: {
    // ...mapGetters(['common'])
  },
  watch: {
    show (val) {
      this.editdata = val;
      this.editshow = val;
    }
  },
  methods: {
    // ...mapMutations([
    //   'set_common'
    // ]),
    openedit () {
    },
    closeedit () {
      this.editshow = false;
      this.editdata = {};
    },
    canceledit (type) {
      this.closeedit();
      this.$emit('cancel', type);
    }
  },
  created () {
    // this.isAdd && this.init();
  }
}
</script>

<style>

</style>
