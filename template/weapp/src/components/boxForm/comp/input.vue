<template>
  <!-- 设备信息 -->
  <view class="form_input">
    <AtInput
      :name="config.name"
      :title="config.title"
      :type="config.type"
      :placeholder="config.placeholder"
      :value="value"
      :required="config.required"
    />
  </view>
</template>

<style lang="scss" scoped>
// @import "./index.scss";
</style>

<script>
import { ref, defineProps } from "vue";
import "./index.scss";

export default {
  name: "demoView",
  props: {
    // 基本配置
    config: {
      type: Object,
      default: () => {
        return {
          name: "",
          title: "",
          type: "text",
          placeholder: "请输入",
          required: false,
        };
      },
    },
    // 数据
    value: {
      type: String,
    },
  },
  data() {
    return {};
  },
  setup(props, { emit }) {
    return {
      clickModel,
    };
  },
};
</script>