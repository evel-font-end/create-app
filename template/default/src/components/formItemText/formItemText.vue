<template>
  <div id="formItemText">
    <el-form
      ref="formData"
      :label-width="labelWidth"
    >
        <el-row>
          <el-col
            v-for="(item, index) in layout"
            :key="`item${index}`"
            :span="(item && item.span) || 12"
          >
            <el-form-item :label="`${item && item.label}：`" :prop="item && item.prop">
                <div v-if="item.value" class="valueItem">
                  <div :class="item.important && 'important'">{{item.value}}{{item.unit}}</div>
                </div>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>
    <!-- <div class="handle-footer" v-if="isEdit">
      <el-button class="reset-btn" @click="$_resetForm">
        取消
      </el-button>
      <el-button
        class="submit-btn"
        type="primary"
        :disabled="$_loading"
        @click="submitForm"
      >
        确定
      </el-button>
    </div> -->
  </div>
</template>

<script>
import Wrapper from '@/components/wrapper';
export default {
  name: 'formItemText',
  data () {
    return {
      //
    };
  },
  components: {
    Wrapper
  },
  props: {
    layout: {
      type: Array,
      default () {
        return null
      }
    },
    isEdit: {
      type: Boolean,
      default () {
        return false
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '120px'
    }
  },
  watch: {
    'form': {
      deep: true,
      handler: function (nowVal, oldVal) {
      }
    },
    layout (val) {
      this.$set(this.layout, val);
    }
  },
  computed: {
  },
  methods: {
  },
  mounted () {
    var $this = this;
  }
};
</script>

<style lang="less">

#formItemText{
  .valueItem{
    line-height: 35px;
  }
  .important{
    display: inline-block;
    line-height: 26px;
    padding: 0px 8px;
   background:linear-gradient(90deg,rgba(74,141,249,1) 0%,rgba(39,116,241,1) 100%);
    box-shadow:0px 2px 4px 0px rgba(216,211,211,0.5);
    border-radius:50px;
    color: #fff;
  }
  /deep/.comp-wrapper-header{
    padding: 0;
  }
  /deep/.el-form-item {
  margin-bottom: 20px;
}
}

</style>
