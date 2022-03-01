<template>
  <div id="base">
      <FormItem
        ref="supplyFormItem"
        :layout="layout"
        :rules="formRules"
        :disabled="inputDisabled"
        :isEdit="isEdit"
        :form="form"
        @submit="submitForm"
      />
  </div>
</template>

<script>
import Wrapper from '@/components/wrapper';
import Flex from '@/components/flex';
import FormItem from '@/components/formItem';
import { noticeTypeOptions } from '../utils';
import {
  saveTrust,
  getTrustDel
} from '@/api/plowMmanagement/index';

export default {
  name: 'baseInfo',
  components: {
    Wrapper,
    Flex,
    FormItem
  },
  props: {
    initId: {
      type: [Number, String],
      default: ''
    },
    html: String,
    show: Boolean,
    data: {}
  },
  data () {
    const { configType, row } = this.data;
    return {
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {
        no: '',
        name: '',
        contacts: '',
        description: ''
      },
      layout: [
        {
          title: '委托人基本情况',
          formItems: [
            {
              label: '委托编号',
              prop: 'no',
              inputType: 'input',
              span: 12,
              // disabled: true,
              hide: true
            },
            {
              label: '委托日期',
              prop: 'trustDate',
              inputType: 'dataPicker',
              span: 12
            },
            {
              label: '委托人',
              prop: 'name',
              inputType: 'input',
              span: 12
            },
            {
              label: '联系人',
              prop: 'contacts',
              inputType: 'input',
              span: 12
            },
            {
              label: '委托说明',
              prop: 'description',
              inputType: 'textarea',
              span: 24
            }
          ]
        }
      ],
      formRules: {
        no: { required: false, message: '委托编号', trigger: 'blur' },
        name: { required: true, message: '请输入委托人', trigger: 'blur' },
        contacts: { required: true, message: '请输入联系人', trigger: 'blur' },
        description: { required: true, message: '请输入委托说明', trigger: 'blur' }
      }
    };
  },
  mounted () {
    this.$nextTick(() => {
      if (this.isAdd) {
        this.layout[0].formItems[0].hide = true;
      } else {
        this.layout[0].formItems[0].hide = false;
      }
    });
  },
  computed: {
  },
  watch: {
    show (val) {
      const { row, configType } = this.data;
      this.isAdd = ['add'].includes(configType);
      if (val && !this.isAdd) {
        this.reqDetail();
      }
    },
    data (val) {
      this.data = val;
      this.inputDisabled = (val.configType === 'detail');
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
    initId (val) {
      this.initId = val;
    }
  },
  methods: {
    reqDetail () {
      const { row } = this.data;
      if (row && row.id) {
        getTrustDel(row.id).then(res => {
          if (res.code === '200') {
            this.$emit('htmlChange', res.data);
            this.form = {
              ...this.form,
              ...res.data
            }
          }
        });
      }
    },
    submitFormItem () {
      this.$refs.supplyFormItem.submitForm()
    },
    submitForm (val) {
      const { configType, row } = this.data
      const id = configType === 'add' ? '' : row.id;
      const param = {
        ...val,
        id
      };
      const message = configType === 'add' ? '新增成功' : '修改成功'
      saveTrust(param).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            position: 'bottom-right'
          });
          this.$emit('success');
        }
      })
    },
    cancelForm () {
      this.$refs.supplyFormItem.cancelForm();
    }
  },
  created () {
    const { configType } = this.data;
    this.isAdd = ['add'].includes(configType);
    !this.isAdd && this.reqDetail()
  }
};
</script>

<style lang="less" scoped>
#base{
}
</style>
