<template>
  <div class="userForm">
    <DialogCont
      @on-cancel="canceledit('close')"
      @on-close="canceledit('close')"
      @on-confirm="confirmedit"
      @on-open="openedit"
      :title="`${title}`"
      width="510px"
      :visible="baseInfo.show"
      ref="dialog"
      customClass="flexColumn userFormDialog"
    >
      <FormItem
        ref="baseFormItem"
        :formItems="baseInfo.formItems"
        :rules="baseInfo.formRules"
        :form="baseInfo.form"
        :midway="baseInfo.midway"
        @change="val => {baseInfo.form = val}"
      ></FormItem>
    </DialogCont>
  </div>
</template>
<script lang="ts">
import { ref, toRefs, reactive, onMounted, getCurrentInstance, watch } from "vue";
import DialogCont from '@/components/dialog/Dialog.vue';
import FormItem from "@/components/adminFormItem";
import { sexOptions } from '@/util/constants';
import {
  addUser,
  updateUser
} from '@/api/systemManage';
export default {
  name: 'userForm',
  components: {
    DialogCont,
    FormItem
  },
  props: {
    title: {
      type: String,
      default: '新增用户'
    },
    show: {
      type: Boolean,
      default: false
    },
    dialogType: {
      type: String,
      default: 'edit'
    },
    siteId: {
      type: String,
      default: ''
    },
    siteName: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['cancel'],
  setup(props: any, context: any) {
    const { show, title, item, dialogType, siteId } = toRefs(props);
    const checkPassword = (rule: any,value: any,callback: any)=>{
      console.log('password', value, baseInfo.form.password)
      if(value === '' || value === undefined){
      callback(new Error('输入确认密码'))
      }else if(value!==baseInfo.form.password){
      callback(new Error('两次输入密码不一致'))
      }else{
      callback( )
      }
    }
    let baseInfo: any = reactive({
      show,
      siteId,
      timeDisabled: false,
      formItems: [
         {
            label: "用户名称",
            labelWidth: '120px',
            prop: "username",
            inputType: "input",
            required: true,
            span: 24,
          },
          {
            label: "真实姓名",
            labelWidth: '120px',
            prop: "realName",
            inputType: "input",
            required: true,
            span: 24,
          },
          {
            label: "性别",
            labelWidth: '120px',
            prop: "sex",
            inputType: "select",
            options: sexOptions,
            required: false,
            span: 24,
          },
          {
            label: "设置密码",
            labelWidth: '120px',
            prop: "password",
            inputType: "inputPassWord",
            required: true,
            tip: '注意：密码长度要求6-12位，至少包含数字、大小写字母、特殊字符中的其中2种。',
            span: 24,
          },
          {
            label: "确认密码",
            labelWidth: '120px',
            prop: "confimPassword",
            inputType: "inputPassWord",
            required: true,
            span: 24,
          },
          {
            label: "邮箱",
            labelWidth: '120px',
            prop: "email",
            inputType: "input",
            required: true,
            span: 24,
          },
          {
            label: "手机号",
            labelWidth: '120px',
            prop: "mobile",
            inputType: "input",
            required: true,
            span: 24,
          },
          {
            label: "区域分配",
            labelWidth: '120px',
            prop: "siteName",
            inputType: "input",
            disabled: true,
            span: 24,
          }
      ],
      formRules: {
        classroomName: [{required: true, trigger: 'change' }],
        confimPassword:[{
          validator: checkPassword,
          required:true,
          message:'请确认密码是否一致',
          trigger:'blur'
        }]
      },
      form: {
        ...props.item
      },
      midway: true,
    })
    const baseFormItem = ref<any>({});
    onMounted(() => {
    })
    watch(() => props.item, (changeVal) => {
      if (changeVal) {
        baseInfo.form = {
          ...changeVal,
          siteName: props.siteName
        }
      }
    })
    const openedit = () => {
      // if (baseInfo.formItems[4].options.length === 0) {
      //   getGatewayType().then((res: any) => {
      //     if (res && res.code === '200') {
      //       baseInfo.formItems[4].options = res.data
      //     }
      //   });
      // }
    }
    const canceledit = (type: string) => {
      baseInfo.form = {};
      baseFormItem.value.resetForm();
      context.emit('cancel', type)
    };
    const confirmedit = async () => {
      const formValues = await baseFormItem.value.getValue()
      let requestApi = addUser;
      const parames: any = {
        ...formValues,
        siteId: baseInfo.siteId
      }
      // console.log('parames', parames);
      delete parames.siteName;
      delete parames.confimPassword;
      // return;
      if (props.item.id) {
        parames.id = props.item.id
        requestApi = updateUser
      }
      requestApi(parames).then((res: any) => {
        if (res && res.code === '200') {
          canceledit('cancel')
        }
      })
    }
    return{
      baseInfo,
      baseFormItem,
      openedit,
      canceledit,
      confirmedit
    }
  }
}
</script>

<style lang="less" scoped>
.userForm{
  padding-bottom: 20px;/*no*/
  .baseInfoInput{
    margin-bottom: 20px;/*no*/
  }
}
</style>
