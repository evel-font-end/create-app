<template>
  <div id="base">
    <FormItem
      ref="normalFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form="form"
      @submit="submitForm"
      @change="changeForm"
      labelWidth="160px"
    />
  </div>
</template>

<script>
import moment from 'moment';
import Wrapper from '@/components/wrapper';
import Flex from '@/components/flex';
import FormItem from '@/components/formItem';
import { tradeTypeOptions, noticeTypeOptions } from '../utils';
import { getMineTransNoticeDtl, saveMineTransNotice } from '@/api';
import { selectListByCodeDetail } from '@/api/common';
import {
  getMineBusinessType
} from '@/api/mineManagement/mineTargetList';
import { getTime } from '@/util/tool';
import { mapGetters } from 'vuex';

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
    bidIds: Array,
    bankIds: Array,
    data: {},
    getHtmlValue: Function
  },
  watch: {
    data: {
      handler (val, oldval) {
        this.data = val;
        this.pageType = val.configType;
        this.inputDisabled = (val.configType === 'detail');
        this.isEdit = ['add', 'edit'].includes(val.configType);
        this.isAdd = ['add'].includes(val.configType);
        !this.isAdd && this.reqDetail();
      },
      deep: true,
      immediate: true
    },
    html (val) {
      this.htmlContent = val
    }
  },
  data () {
    const { configType } = this.data;
    const validateBeginNotice = (rule, value, callback) => {
      if(value === ''){
        callback(new Error('请选择公告开始时间'))
      } else {
        console.log(((this.pageType === 'infoTrans' && this.curr_btnStatusData.isRestart === 1) || this.pageType === 'add' || this.pageType === 'edit') && this.isUpdateDate)
        if(((this.pageType === 'infoTrans' && this.curr_btnStatusData.isRestart === 1) || this.pageType === 'add' || this.pageType === 'edit') && this.isUpdateDate) {
          //公告开始/竞买申请/保证金开始
          this.form.beginNoticeTime = value;
          this.form.endNoticeTime = getTime(value, this.dictionaryNoticeCode);
          this.form.endEarnestTime =  getTime(this.form.beginNoticeTime, this.dictionaryBondCode);
          console.log('this.form', this.form);
          this.$forceUpdate();
        }
        callback()
      }
    }
    //公告结束
    const validateEndNotice = (rule, value, callback) => {
      if(value === ''){
        callback(new Error('请选择公告结束时间'))
      } else {
        if(((this.pageType === 'infoTrans' && this.curr_btnStatusData.isRestart === 1) || this.pageType === 'add' || this.pageType === 'edit') && this.isUpdateDate) {
          const startDateCurr = Date.parse(this.form.beginNoticeTime);
          const endDateCurr = Date.parse(value);
          const changeDay = this.dictionaryNoticeCode / (1 * 60 * 60 * 24);
          if(endDateCurr < startDateCurr){
            callback(new Error('公告结束时间必须大于等于公告开始时间'))
          }
          //公告结束
          // const startDate = new Date((value).replace(/-/g,"/"));
          const startDate = getTime(value, 0);
          const endDate = startDate;
          this.form.endNoticeTime = endDate;
        }
        callback()
      }
    }
    return {
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {
        no: `汕公资网挂出让[${moment().format('YYYY')}]xx号`,
        noticeDate: '',
        name: '',
        noticeType: '0',
        businessType: '',
        remark: `温 馨 提 示
        1、凡首次参加网上挂牌活动竟买申请人需提前到代理点办理数字证书。
        2、请有意参加竞买的申请人留足（转帐、汇款）时间将竞买保证金交纳到指定帐户，避免未能及时到达指定帐户而导致申请人未能取得竞买资格，竞买保证金及时到帐网上交易系统将自动确认其竞买资格。
        3、竞买人在网上挂牌交易系统的任何操作过程中尽量不要在最后时刻完成操作，为避免因网络传输不畅造成损失，以防止网上挂牌交易无法及时接收到竞买申请、报价等情况发生，由此产生的风险由竞买人自己承担。请有意参加的竞买人应提前进行网上挂牌交易系统操作。`,
        beginNoticeTime: undefined,
        endNoticeTime: undefined,
        endEarnestTime: undefined
      },
      layout: [
        {
          title: '基本情况',
          formItems: [
            { label: '公告编号', prop: 'no', inputType: 'input', span: 12 },
            // {
            //   label: '公告日期',
            //   prop: 'noticeDate',
            //   inputType: 'dataPicker',
            //   format: 'yyyy-MM-dd HH:mm:ss',
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
                id: '0',
                name: '普通公告'
              }],
              span: 12
            },
            {
              label: '交易类型',
              prop: 'businessType',
              inputType: 'select',
              class: 'businessTypeSelect',
              allowCreate: true,
              options: [],
              hide: true,
              span: 24
            },
            {
              label: '公告开始时间',
              prop: 'beginNoticeTime',
              inputType: 'dataPicker',
              format: 'yyyy-MM-dd HH:mm:ss',
              span: 12
            },
            {
              label: '公告结束时间',
              prop: 'endNoticeTime',
              inputType: 'dataPicker',
              format: 'yyyy-MM-dd HH:mm:ss',
              span: 12
            },
            {
              label: '保证金缴纳截止时间',
              prop: 'endEarnestTime',
              inputType: 'dataPicker',
              format: 'yyyy-MM-dd HH:mm:ss',
              span: 12
            },
            {
              label: '其他需公告的事项',
              prop: 'remark',
              inputType: 'textarea',
              span: 24,
              maxlength: 500
            }
          ]
        }
      ],
      formRules: {
        no: { required: true, message: '请输入公告编号', trigger: 'change' },
        name: { required: true, message: '请输入公告名称', trigger: 'change' },
        // businessType: { required: true, message: '请选择交易类型', trigger: 'change' },
        beginNoticeTime: [{ required: true, validator: validateBeginNotice, message: '请选择公告开始时间', trigger: 'blur' }],
        endNoticeTime: [{ required: true, validator: validateEndNotice, message: '请选择公告结束时间', trigger: 'blur' }],
        endEarnestTime: [{ required: true, message: '请选择保证金缴纳截止时间', trigger: 'blur' }],
        noticeType: {
          required: true,
          message: '请选择公告类型',
          trigger: 'blur'
        }
      },
      isUpdateDate: true,
      dictionaryNoticeCode:null,
      dictionaryBondCode:null,
      pageType: '',
      htmlContent: ''
    };
  },
  mounted () {
    this.$nextTick(() => {
      this._selectListByCodeNoticeDetail();
      this._selectListByCodeBondDetail();
    });
  },
  computed: {
    ...mapGetters(['common']),
    contentPadding () {
      const { configType } = this.data;
      return ['add', 'edit'].includes(configType)
        ? '90px'
        : '0'
    }
  },
  methods: {
    reqDetail () {
      const { row } = this.data;
      if (row && row.id) {
        getMineTransNoticeDtl(row.id).then(res => {
          if (res.code === '200') {
            this.form = {
              ...res.data,
              noticeType: `${res.data.noticeType}`
            };
            this.$emit('htmlChange', res.data);
          }
        });
      }
    },
    submitFormItem () {
      this.$refs.normalFormItem.submitForm()
    },
    async submitForm (val) {
      const { configType, row } = this.data;
      if (this.bankIds.length === 0) {
        this.$notify.error({
          title: '失败',
          message: '请选择银行信息!!!',
          position: 'bottom-right'
        });
        return;
      }
      if (this.bidIds.length === 0) {
        this.$notify.error({
          title: '失败',
          message: '请选择标的!!!',
          position: 'bottom-right'
        });
        return;
      }
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
        ...val,
        noticeType: +val.noticeType,
        businessType: val.businessType,
        name: val.no,
        no: val.no,
        // noticeDate: val.noticeDate,
        remark: val.remark,
        htmlContent: this.htmlContent,
        targetIds: this.bidIds,
        accountIds: this.bankIds,
        operateFlag: configType,
        id: this.isAdd ? this.initId : row.id
      };
      const message = configType === 'add' ? '新增成功' : '修改成功'
      saveMineTransNotice(param).then(res => {
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
    changeForm (val) {
      this.form = {
        ...this.form,
        ...val
      };
    },
    cancelForm () {
      this.$refs.normalFormItem.cancelForm();
    },
    // 获取交易方式下拉框数据
    _getBusinessType () {
      this.layout[0].formItems[2].options = [];
      let options = [];
      getMineBusinessType().then(res => {
        if (res.code === '200') {
          res.data.map(item => {
            item.key;
            options.push({
              name: item.value,
              id: item.key
            });
          });
        }
      });
      this.$set(this.layout[0].formItems[2], 'options', options);
      this.$forceUpdate();
    },
    getBusinessTypeValue () {
      return this.$refs.normalFormItem.getValue('businessType');
    },
        _selectListByCodeNoticeDetail() {
      selectListByCodeDetail('TRADE_NOTICE_INTERVALS').then(res => {
        if (res.code === '200') {
          this.dictionaryNoticeCode = parseInt(res.data.value, 10);
        }
      });
      this.$forceUpdate();
    },
        _selectListByCodeBondDetail() {
      selectListByCodeDetail('BOND').then(res => {
        if (res.code === '200') {
          this.dictionaryBondCode = parseInt(res.data.value, 10);
        }
      });
      this.$forceUpdate();
    }
  },
  created () {
    this._getBusinessType()
    !this.isAdd && this.reqDetail();
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-form-item {
  margin-bottom: 12px;
}
#base{
  /deep/#headerTitle .searchBox{
    padding-top: 10px;
  }
  /deep/.businessTypeSelect{
    .el-select{
      width: 42% !important;
    }
  }
}
.handle-footer {
  height: 70px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background: #fff;
  box-shadow: 0px -3px 4px 0px rgba(222, 222, 222, 0.5);
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
  box-sizing: border-box;
  z-index: 11111;
  button {
    width: 88px;
    height: 40px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
  .reset-btn {
    border: 1px solid rgba(37, 115, 241, 1);
    margin-right: 20px;
  }
  .submit-btn {
    background: rgba(37, 115, 241, 1);
  }
}
</style>
