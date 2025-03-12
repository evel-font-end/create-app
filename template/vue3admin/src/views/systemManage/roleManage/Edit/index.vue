<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    :title="`${data.title}`"
    width="510px"
    :visible.sync="data.editshow"
    ref="dialog"
  >
    <div>
      <FormItem
        ref="baseFormItem"
        :formItems="data.formItems"
        :rules="data.formRules"
        :form="data.form"
      />
    </div>
  </dialog-cont>
</template>

<script lang="ts">
import { ref, reactive, watch, onMounted, toRefs } from "vue";
import DialogCont from "@/components/dialog/Dialog.vue";
import FormItem from "@/components/adminFormItem";
import { addRole, updateRole } from "@/api/role";
import { ElNotification } from "element-plus";
export default {
  name: "edit",
  components: {
    DialogCont,
    FormItem,
  },
  props: {
    dataWatch: {},
    show: false,
    siteId: 0,
  },
  setup(props: any, context: any) {
    const data = reactive({
      title: "",
      isAdd: true,
      form: {},
      roleId: "", //角色ID
      editshow: false,
      editData: {},
      formItems: [
        {
          label: "角色名称",
          labelWidth: "120px",
          prop: "roleName",
          inputType: "input",
          required: true,
          span: 24,
        },
        {
          label: "角色描述",
          labelWidth: "120px",
          prop: "roleDescribe",
          inputType: "input",
          required: false,
          span: 24,
        },
      ],
      formRules: {
        roleName: {
          required: true,
          message: "请输入角色名称",
          trigger: "blur",
        },
      },
    });
    const baseFormItem = ref<any>({});
    const methods = {
      closeedit() {
        data.form = {};
        data.editData = {};
        data.editshow = false;
        baseFormItem.value.cancelForm();
      },
      canceledit(type:any) {
        methods.closeedit();
        context.emit("cancel", type);
      },
      // 保存
      async confirmedit() {
        let formValue = await baseFormItem.value.getValue();
        const params = {
          ...formValue,
          siteId: props.siteId,
        };
        if (!data.isAdd) {
          // 编辑时
          params.id = data.roleId;
        }
        const message = data.isAdd ? "新增成功" : "修改成功";
        const apiMethod = data.isAdd ? addRole : updateRole;
        apiMethod(params).then((res:any) => {
          if (res.code == "200") {
            ElNotification({
              title: "成功",
              message,
              type: "success",
              position: "bottom-right",
            });
            context.emit("success");
            methods.closeedit();
          }
        });
      },
      init() {
        data.title = "新增角色";
        data.form = {};
        data.editData = {};
      },
      reqDetail() {
        data.title = "修改角色";
        const { row } = toRefs<any>(data.editData);
        console.log(row.value, 'row')
        data.roleId = row.value.id;
        data.form = {
          ...row.value,
        };
      },
    };
    onMounted(() => {});
    watch(
      () => props.show,
      (newVal, oldVal) => {
        data.editshow = newVal;
      }
    );
    watch(
      () => props.dataWatch,
      (newVal, oldVal) => {
        data.isAdd = newVal.configType === "add";
        if (newVal.configType === "add") {
          methods.init();
        } else if (newVal.configType === "edit") {
          data.editData = newVal;
          methods.reqDetail();
        }
      }
    );
    return {
      data,
      ...methods,
      baseFormItem,
    };
  },
};
</script>

<style lang="less" scoped></style>
