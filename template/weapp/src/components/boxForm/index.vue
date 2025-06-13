<template>
  <!-- 设备信息 -->
  <view class="boxForm">
    <AtForm @onSubmit="onSubmit" @onReset="onReset">
      <AtButton formType="submit">提交</AtButton>
      <AtButton formType="reset">重置</AtButton>
    </AtForm>
  </view>
</template>

<style lang="scss" scoped>
// @import "./index.scss";
// @import "~taro-ui-vue3/dist/style/components/form.scss";
</style>

<script>
import { ref, defineProps } from "vue";
import { AtForm, AtButton } from "taro-ui-vue3";
import "./index.scss";
import "~taro-ui-vue3/dist/style/components/form.scss";

export default {
  name: "demoView",
  components: {
    AtForm,
    AtButton,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    // 点击事件
    const clickModel = function (item) {
      emit("clickModel", item);
    };

    // 点击提交
    const onSubmit = function () {};

    // 重置按钮
    const onReset = function () {};

    return {
      clickModel,
      onSubmit,
      onReset,
    };
  },
};
</script>