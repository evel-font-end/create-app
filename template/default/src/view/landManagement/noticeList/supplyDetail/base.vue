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
import { getSuppleTransNoticeDtl, saveSupplementarNotic } from '@/api';

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
    data: {},
    getHtmlValue: Function
  },
  data () {
    const { configType, row } = this.data;
    return {
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {
        mainNo: row && row.no,
        mainName: row && row.name,
        mainNoticeDate: row && row.noticeDate,
        no: '',
        noticeDate: '',
        name: '',
        noticeType: '1',
        remark: ''
      },
      layout: [
        {
          title: '基本情况',
          formItems: [
            { label: '主公告编号', prop: 'mainNo', inputType: 'input', span: 12, disabled: true },
            // { label: '主公告名称', prop: 'mainName', inputType: 'input', span: 12, disabled: true },
            // { label: '主公告日期', prop: 'mainNoticeDate', inputType: 'dataPicker', span: 12, disabled: true },
            {
              label: '补充标题',
              prop: 'no',
              inputType: 'input',
              span: 12
            },
            // {
            //   label: '补充公告日期',
            //   prop: 'noticeDate',
            //   inputType: 'dataPicker',
            //   span: 12
            // },
            // {
            //   label: '公告名称',
            //   prop: 'name',
            //   inputType: 'input',
            //   span: 12
            // },
            {
              label: '公告类型',
              prop: 'noticeType',
              inputType: 'select',
              options: [{
                id: '1',
                name: '补充公告'
              }],
              span: 12
            },
            {
              label: '备注',
              prop: 'remark',
              inputType: 'textarea',
              span: 24,
              maxlength: 200
            }
          ]
        }
      ],
      formRules: {
        no: { required: true, message: '请输入补充标题', trigger: 'blur' },
        buildArea: {
          required: true,
          message: '请选择公告类型',
          trigger: 'blur'
        }
      },
      htmlContent: ''
    };
  },
  mounted () {
    this.$nextTick(() => {
    });
  },
  computed: {
    contentPadding () {
      const { configType } = this.data;
      return ['add', 'edit'].includes(configType)
        ? '90px'
        : '0'
    }
  },
  watch: {
    show (val) {
      const { row, configType } = this.data;
      this.form = {
        ...this.form,
        mainNo: row && row.no,
        mainName: row && row.name,
        mainNoticeDate: row && row.noticeDate
      }
      this.isAdd = ['add'].includes(configType);
      if (val && !this.isAdd) {
        this.reqDetail();
      }
    },
    data: {
      handler (val, oldval) {
        this.data = val;
        this.inputDisabled = (val.configType === 'detail');
        this.isEdit = ['add', 'edit'].includes(val.configType);
        this.isAdd = ['add'].includes(val.configType);
        if (this.show && !this.isAdd) {
          this.reqDetail();
        }
      },
      deep: true,
      immediate: true
    },
    initId (val) {
      this.initId = val;
    },
    html (val) {
      this.htmlContent = val
    }
  },
  methods: {
    reqDetail () {
      const { row } = this.data;
      if (row && row.id) {
        getSuppleTransNoticeDtl(row.id).then(res => {
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
    async submitForm (val) {
      const { configType, row } = this.data
      const id = configType === 'add' ? this.initId : this.form.id;
      const parentId = configType === 'add' ? row.id : this.form.parentId;
      this.htmlContent = await this.getHtmlValue();
      if(!this.htmlContent) {
        this.$notify.error({
          title: '失败',
          message: '请填写公告内容!!!',
          position: 'bottom-right'
        });
        return;
      }
      const param = {
        no: val.no,
        noticeDate: val.noticeDate,
        remark: val.remark,
        name: val.name,
        htmlContent: this.htmlContent,
        operateFlag: configType,
        id,
        parentId,
        noticeType: 1
      };
      const message = configType === 'add' ? '新增成功' : '修改成功'
      saveSupplementarNotic(param).then(res => {
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
    !this.isAdd && this.reqDetail()
  }
};
</script>

<style lang="less" scoped>
#base{
}
</style>
