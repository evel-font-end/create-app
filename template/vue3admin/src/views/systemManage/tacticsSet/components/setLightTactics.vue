<template>
  <div class="setLightTactics">
    <DialogCont
      @on-cancel="canceledit('close')"
      @on-close="canceledit('close')"
      @on-confirm="confirmedit"
      @on-open="openedit"
      :title="`${title}`"
      width="1100px"
      :visible="obj.show"
      ref="dialog"
      customClass="flexColumn setLightTacticsDialog"
      :bottomShow="obj.dialogType !== 'detail'"
    >
      <div class="flexRow classic" v-if="type === 'allSet'">
        <div class="flexCenter icon"><i class="iconfont icon-jiaoshi" /></div>
        <span class="title">{{ obj.item.classroom }}</span>
      </div>
      <div class="baseInfoInput" v-if="type === 'defaultSet'">
        <FormItem
          ref="baseFormItem"
          :formItems="baseInfo.formItems"
          :rules="baseInfo.formRules"
          :form="baseInfo.form"
          :midway="baseInfo.midway"
        ></FormItem>
      </div>
      <div class="flexRow lightMain">
        <LightItems
          ref="lightItems"
          :lightArray="obj.lightArray"
          :type="obj.dialogType"
        />
      </div>
    </DialogCont>
  </div>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, watch } from "vue";
import DialogCont from "@/components/dialog/Dialog.vue";
import FormItem from "@/components/adminFormItem";
import LightItems from "./lightItems.vue";
import { ElMessage } from "element-plus";
import {
  lampControll,
  addLightPolicy,
  updateLightPolicy,
} from "@/api/systemManage";
export default {
  name: "setLightTactics",
  components: {
    DialogCont,
    FormItem,
    LightItems,
  },
  props: {
    title: {
      type: String,
      default: "设置照明策略",
    },
    show: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "allSet",
    },
    dialogType: {
      type: String,
      default: "edit",
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["cancel"],
  setup(props: any, context: any) {
    const { show, title, item, type, dialogType } = toRefs(props);
    let obj = reactive({
      show,
      title,
      item,
      type,
      dialogType,
      lightArray: [],
    });
    let baseInfo: any = reactive({
      timeDisabled: false,
      formItems: [
        {
          label: "通用策略名称",
          labelWidth: props.dialogType === "edit" ? "120px" : "100px",
          prop: props.dialogType === "edit" ? "lightName" : null,
          value: props.dialogType === "edit" ? null : "中亮度照明策略",
          inputType: "input",
          required: true,
          span: 12,
        },
      ],
      formRules: {
        ruleName: [{ required: true, trigger: "change" }],
      },
      form: {
        lightName: undefined,
      },
      midway: true,
    });
    const lightItems = ref<any>({});
    const baseFormItem = ref<any>({});
    onMounted(() => {});
    watch([show, dialogType], ([showVal, dialogTypeVal]) => {
      if (showVal && dialogTypeVal) {
        baseInfo.formItems[0].prop =
          dialogTypeVal === "detail" ? null : "lightName";
        baseInfo.formItems[0].value =
          dialogTypeVal === "detail" ? item.value.lightName : null;
        baseInfo.form = {
          lightName: props.item.lightName,
        };
        obj.lightArray = props.item.lightArray;
      }
    });
    const openedit = () => {};
    const canceledit = (type?: string) => {
      obj.lightArray = [];
      baseInfo.form = {
        lightName: undefined,
      };
      context.emit("cancel", type);
    };
    const confirmedit = async () => {
      const lightItemsValues = await lightItems.value.getValue();
      if (props.type === "allSet") {
        const parames: any = {
          ids: [props.item.id],
          siteId: props.item.siteId,
          light: lightItemsValues.light,
        };
        lampControll(parames).then((res: any) => {
          if (res && res.code === "200") {
            canceledit("allSetCancel");
          }
        });
      } else {
        const formValues = await baseFormItem.value.getValue();
        let requestApi = addLightPolicy;
        const parames: any = {
          lightName: formValues.lightName,
          siteId: item.value.siteId,
          lightArray: lightItemsValues.light,
        };
        if (props.dialogType !== "add") {
          parames.id = props.item.id;
          requestApi = updateLightPolicy;
        }
        requestApi(parames).then((res: any) => {
          if (res && res.code === "200") {
            ElMessage.success({
              message: "操作成功",
              type: "success",
            });
            canceledit("cancel");
          }
        });
      }
    };
    return {
      obj,
      lightItems,
      baseFormItem,
      baseInfo,
      openedit,
      canceledit,
      confirmedit,
    };
  },
};
</script>

<style lang="less" scoped>
.setLightTactics {
  padding-bottom: 20px; /*no*/
  .classic {
    margin-bottom: 20px; /*no*/
    .icon {
      width: 28px; /*no*/
      height: 28px; /*no*/
      opacity: 1;
      background: linear-gradient(135deg, #50a4ef, #5478fa, #3f5cc5);
      border-radius: 3px; /*no*/
      box-shadow: 0px 2px 4px 0px rgba(150, 191, 233, 0.5); /*no*/
      i {
        color: #fff;
        font-size: 20px; /*no*/
      }
    }
    .title {
      font-size: 18px; /*no*/
      font-family: PingFangSC-Semibold;
      text-align: left;
      color: #353535;
      margin-left: 10px; /*no*/
      line-height: 28px; /*no*/
    }
  }
  .baseInfoInput {
    // margin-bottom: 20px;/*no*/
  }
  .lightMain {
  }
}
</style>
