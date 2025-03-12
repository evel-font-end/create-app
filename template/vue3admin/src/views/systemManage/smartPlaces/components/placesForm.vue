<template>
  <div class="placesForm">
    <DialogCont
      @on-cancel="canceledit('close')"
      @on-close="canceledit('close')"
      @on-confirm="confirmedit"
      @on-open="openedit"
      :title="`${title}`"
      width="510px"
      :visible="show"
      ref="dialog"
      customClass="flexColumn placesFormDialog"
    >
    <FormItem
      ref="baseFormItem"
      :formItems="baseInfo.formItems"
      :rules="baseInfo.formRules"
      :form="baseInfo.form"
      :midway="baseInfo.midway"
    ></FormItem>
    </DialogCont>
  </div>
</template>
<script lang="ts">
import { ref, toRefs, reactive, onMounted, getCurrentInstance, watch } from "vue";
import DialogCont from '@/components/dialog/Dialog.vue';
import FormItem from "@/components/adminFormItem";
import { gradeOptions } from '@/util/constants';
import {
  selectListByParentCode
} from '@/api/index';
import {
  addIntelligentPlace,
  updateIntelligentPlace,
  getGatewayType
} from '@/api/systemManage';
export default {
  name: 'placesForm',
  components: {
    DialogCont,
    FormItem
  },
  props: {
    title: {
      type: String,
      default: '设置照明策略'
    },
    show: {
      type: Boolean,
      default: false
    },
    dialogType: {
      type: String,
      default: 'edit'
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['cancel'],
  setup(props: any, context: any) {
    const { show, title, item, dialogType } = toRefs(props)
    let baseInfo: any = reactive({
      timeDisabled: false,
      formItems: [
        {
          label: "所在省市区",
          labelWidth: '120px',
          prop: "region",
          inputType: "cascader",
          required: true,
          span: 24,
        },
        {
          label: "学校名称",
          labelWidth: '120px',
          prop: "schoolName",
          inputType: "input",
          required: true,
          span: 24,
        },
        {
          label: "年级名称",
          labelWidth: '120px',
          prop: "grade",
          inputType: "select",
          options: [],
          required: true,
          span: 24,
        },
        {
          label: "班级名称",
          labelWidth: '120px',
          prop: "classroomName",
          inputType: "input",
          required: true,
          span: 24,
        },
        {
          label: "楼层号",
          labelWidth: '120px',
          prop: "floor",
          inputType: "input",
          required: false,
          span: 24,
        },
        {
          label: "网关ID号",
          labelWidth: '120px',
          prop: "gatewayId",
          inputType: "input",
          required: true,
          span: 24,
        },
        {
          label: "网关类型",
          labelWidth: '120px',
          prop: "gatewayType",
          inputType: "select",
          options: [],
          required: false,
          span: 24,
        },
        {
          label: "黑板灯数量",
          labelWidth: '120px',
          prop: "boardLight",
          inputType: "inputNumber",
          min:0,
          max:3,
          required: true,
          span: 24,
        },
        {
          label: "教室灯数量",
          labelWidth: '120px',
          prop: "classroomLight",
          inputType: "inputNumber",
          required: true,
          min:0,
          max:9,
          span: 24,
        }
      ],
      formRules: {
        classroomName: [{required: true, trigger: 'change' }]
      },
      form: {
        ...props.item,
        region: [{regionName: '', regionCode: props.item.provCode}, {regionName: '', regionCode: props.item.cityCode}, {regionName: '', regionCode:props.item.countyCode}]
      },
      midway: true,
    })
    const baseFormItem = ref<any>({});
    onMounted(() => {
      if (baseInfo.formItems[2].options.length === 0) {
        selectListByParentCode('GRADE').then((res: any) => {
          if (res && res.code === '200') {
            baseInfo.formItems[2].options = res.data.map((dataItem: any) => {
              return {
                ...dataItem,
                id: dataItem.code
              }
            });
          }
        })
      }
    })
    watch(() => props.item, (changeVal) => {
      if (changeVal) {
        baseInfo.form = {
          ...changeVal,
          region: [{regionName: '', regionCode: changeVal.provCode}, {regionName: '', regionCode: changeVal.cityCode}, {regionName: '', regionCode:changeVal.countyCode}]
        }
      }
    })
    const openedit = () => {
      if (baseInfo.formItems[6].options.length === 0) {
        getGatewayType().then((res: any) => {
          if (res && res.code === '200') {
            baseInfo.formItems[6].options = res.data
          }
        });
      }
    }
    const canceledit = (type: string) => {
      baseInfo.form = {};
      baseFormItem.value.resetForm();
      context.emit('cancel', type)
    };
    const confirmedit = async () => {
      const formValues = await baseFormItem.value.getValue()
      let requestApi = addIntelligentPlace;
      const gradeItem = baseInfo.formItems[2].options.filter((option: any) => option.id === formValues.grade)
      const parames: any = {
        ...formValues,
        provRegion: formValues.region[0],
        cityRegion: formValues.region[1],
        countyRegion: formValues.region[2],
        boardLight: +formValues.boardLight,
        classroomLight: +formValues.classroomLight,
        gradeName: gradeItem[0].name
      }
      delete parames.region;
      if (props.item.id) {
        parames.id = props.item.id
        requestApi = updateIntelligentPlace
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
.placesForm{
  padding-bottom: 20px;/*no*/
  .baseInfoInput{
    margin-bottom: 20px;/*no*/
  }
}
</style>
