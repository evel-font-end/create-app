<template>
  <div id="lowIndexList_baseInfo">
      <FormItem
        ref="supplyFormItem"
        :layout="layout"
        :disabled="inputDisabled"
        :inPage="inPage"
        :isEdit="isEdit"
        :form="form"
        :rules="formRules"
        labelWidth="160px"
        @submit="submitForm"
        @change="changeForm"
      >
        <template v-slot:transTrustDto>
          <el-table :data="Options.tableData" stripe style="width: 100%" size="mini">
            <el-table-column prop="no" label="委托编号"></el-table-column>
            <el-table-column prop="name" label="委托人"></el-table-column>
            <el-table-column prop="contacts" label="联系人"></el-table-column>
            <el-table-column prop="description" label="委托说明"></el-table-column>
            <el-table-column prop="trustDate" label="委托日期"></el-table-column>
            <el-table-column label="操作" v-if="isEdit">
              <template slot-scope="scope">
                <el-button
                  @click="rowdel(scope.$index)"
                  type="text"
                  size="mini"
                  :disabled="isEdit ? false : true"
                  v-if="isEdit"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top:10px">
            <el-button
              size="mini"
              type="primary"
              :disabled="isEdit ? false : true"
              v-if="isEdit"
              @click="selectTransTrust"
            >选择委托人</el-button>
          </div>
          <dialog-cont
            @on-cancel="cancelDialog"
            @on-confirm="bindConfirm"
            @on-open="openBind"
            title="选择委托人"
            width="900px"
            :visible.sync="dialog.show"
            ref="dialog"
            customClass="lowIndexList_baseInfo_dialog"
            append-to-body
          >
            <div>
              <search-form
                :searchItems="dialog.searchItems"
                @onSearch="onSearch"
              />
            </div>
            <page-table
              ref="dialogTable"
              :data="dialog.tableData"
              :cols="dialog.tableCols"
              col-align="left"
              :page-current="dialog.page.current"
              :total="dialog.page.total"
              :page-size="dialog.page.pageSize"
              highlight-current-row
              @current-change="onCurrentChange"
              @size-change="onPageSizeChange"
              @row-current-change="bindSelection"
              :row-key="getRowKey"
            ></page-table>
          </dialog-cont>
        </template>
      </FormItem>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Wrapper from '@/components/wrapper';
import Flex from '@/components/flex';
import searchForm from '@/components/searchForm/searchForm';
import FormItem from '@/components/formItem';
import dialogCont from '@/components/dialog';
import PageTable from '@/components/page-table';
import commonApi from '@/mixins/commonApi';
import { noticeTypeOptions } from '../utils';
import {
  getPlowTargetDel,
  savePlowTarget
} from '@/api/plowMmanagement/lowIndexList';
import {
  getTrustList
} from '@/api/plowMmanagement/index';
import {
  getTargetSuspend,
  getTargetStop,
  getRestartTrade
} from '@/api/dealManagement/breakdealList';
import { selectListByCodeDetail } from '@/api/common';
import {
  detail,
  applyTrust
} from '@/api/plowMmanagement/tradeList';
import { getTime } from '@/util/tool';
import { Option } from 'element-ui';
const changeList = ['beginApplyTime', 'endApplyTime']
export default {
  name: 'lowIndexList_baseInfo',
  mixins: [commonApi()],
  components: {
    Wrapper,
    Flex,
    FormItem,
    dialogCont,
    PageTable,
    searchForm
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
    let curr_btnStatusData = this.data.btnStatusData;
    //公告开始
    const validateBeginNotice = (rule, value, callback) => {
      let curr_btnStatusData = this.data.btnStatusData;
      let curr_formData = [];
      if(this.data.configType === 'add'){
        curr_formData = this.$refs.supplyFormItem.$refs.formData.model;
      }else{
        curr_formData = this.form;
      }
      if(value === ''){
        callback(new Error('请选择公告开始时间'))
      } else {
        if(((this.data.configType === 'infoTrans' && curr_btnStatusData.isRestart === 1) || this.data.configType === 'add' || this.data.configType === 'edit') && this.isUpdateDate) {
          //公告开始/竞买申请/保证金开始

          curr_formData.beginNoticeTime = value;
          curr_formData.beginApplyTime = value;
          curr_formData.beginEarnestTime = value;

          curr_formData.endNoticeTime = getTime(value, this.dictionaryNoticeCode);
          curr_formData.beginListTime = curr_formData.beginFocusTime = getTime( curr_formData.endNoticeTime, this.dictionaryNoticeListCode);
          curr_formData.beginLimitTime = curr_formData.endListTime = curr_formData.endFocusTime = getTime( curr_formData.beginListTime, this.dictionaryListCode);
          // curr_formData.endListTime = getTime(value, this.dictionaryListCode);
          curr_formData.endApplyTime = getTime(curr_formData.beginApplyTime, this.dictionaryApplyCode);
          curr_formData.endEarnestTime =  getTime(curr_formData.beginEarnestTime, this.dictionaryBondCode);
          // curr_formData.beginLimitTime = getTime(curr_formData.endNoticeTime, this.dictionaryNoticeLimitCode);
          
        }
        callback()
      }
    }
    //公告结束
    const validateEndNotice = (rule, value, callback) => {
      let curr_btnStatusData = this.data.btnStatusData;
      let curr_formData = [];
      if(this.data.configType === 'add'){
        curr_formData = this.$refs.supplyFormItem.$refs.formData.model;
      }else{
        curr_formData = this.form;
      }
      if(value === ''){
        callback(new Error('请选择公告结束时间'))
      } else {
        if(((this.data.configType === 'infoTrans' && curr_btnStatusData.isRestart === 1) || this.data.configType === 'add' || this.data.configType === 'edit') && this.isUpdateDate) {
          // const startDateCurr = Date.parse(curr_formData.beginNoticeTime);
          // const endDateCurr = Date.parse(value);
          // const changeDay = this.dictionaryNoticeCode / (1 * 60 * 60 * 24);
          // if(endDateCurr < startDateCurr){
          //   callback(new Error('公告结束时间必须大于等于公告开始时间'))
          // }
          this.isDate.beginNoticeDate = false;
          
          //公告结束
          // const startDate = new Date((value).replace(/-/g,"/"));
          const startDate = getTime(value, 0);
          const endDate = startDate;
          curr_formData.endNoticeTime = endDate;
          //竞买申请结束/保证金缴纳结束
          // curr_formData.endApplyTime = endDate;
          // curr_formData.endEarnestTime = endDate;
          //限时竞价开始
          // const startDate4 = new Date((value).replace(/-/g,"/"));
          // startDate4.setDate(startDate4.getDate()+1);
          // const startDate4 = getTime(value, 0);
          curr_formData.beginListTime = curr_formData.beginFocusTime = getTime(endDate, this.dictionaryNoticeListCode);
          curr_formData.beginLimitTime = curr_formData.endListTime = curr_formData.endFocusTime = getTime(curr_formData.beginListTime, this.dictionaryListCode);
          // curr_formData.beginLimitTime = getTime(endDate, this.dictionaryNoticeLimitCode);
        }
        callback()
      }
    }
    //竞买申请开始
    const validateBeginApply = (rule, value, callback) => {
      let curr_btnStatusData = this.data.btnStatusData;
      let curr_formData = [];
      if(this.data.configType === 'add'){
        curr_formData = this.$refs.supplyFormItem.$refs.formData.model;
      }else{
        curr_formData = this.form;
      }
      if(value === ''){
        callback(new Error('请选择竞买申请开始时间'))
      } else {
        if(((this.data.configType === 'infoTrans' && curr_btnStatusData.isRestart === 1) || this.data.configType === 'add' || this.data.configType === 'edit') && this.isUpdateDate) {
          // const startDate = Date.parse(curr_formData.beginNoticeTime);
          // const endDate = Date.parse(value);
          // if(startDate != endDate){
          //   callback(new Error('竞买申请开始时间 = 公告开始时间'))
          // }
          curr_formData.beginApplyTime = value;
          curr_formData.endApplyTime = getTime(value, this.dictionaryApplyCode);
          this.isDate.beginNoticeDate = false;
          this.isDate.endNoticeDate = false;
        }
        callback()
      }
    }
    //保证金开始
    const validateBeginEarnest = (rule, value, callback) => {
      let curr_btnStatusData = this.data.btnStatusData;
      let curr_formData = [];
      if(this.data.configType === 'add'){
        curr_formData = this.$refs.supplyFormItem.$refs.formData.model;
      }else{
        curr_formData = this.form;
      }
      if(value === ''){
        callback(new Error('请选择保证金开始时间'))
      } else {
        if(((this.data.configType === 'infoTrans' && curr_btnStatusData.isRestart === 1) || this.data.configType === 'add' || this.data.configType === 'edit') && this.isUpdateDate) {
          // const startDate = Date.parse(curr_formData.beginNoticeTime);
          // const endDate = Date.parse(value);
          // if(startDate != endDate){
          //   callback(new Error('保证金缴纳开始时间 = 公告开始时间'))
          // }
          curr_formData.beginEarnestTime = value;
          curr_formData.endEarnestTime = getTime(value, this.dictionaryBondCode);
          this.isDate.beginNoticeDate = false;
          this.isDate.endNoticeDate = false;
        }
        callback()  
      }
    }
    //竞买申请结束
    const validateEndApply = (rule, value, callback) => {
      let curr_btnStatusData = this.data.btnStatusData;
      let curr_formData = [];
      if(this.data.configType === 'add'){
        curr_formData = this.$refs.supplyFormItem.$refs.formData.model;
      }else{
        curr_formData = this.form;
      }
      if(value === ''){
        callback(new Error('请选择竞买申请结束时间'))
      } else {
        if(((this.data.configType === 'infoTrans' && curr_btnStatusData.isRestart === 1) || this.data.configType === 'add' || this.data.configType === 'edit') && this.isUpdateDate) {
          // const startDate = Date.parse(curr_formData.endNoticeTime);
          // const endDate = Date.parse(value);
          // if(startDate < endDate){
          //   callback(new Error('竞买申请结束时间 <= 公告结束时间'))
          // }
          curr_formData.endApplyTime = value;
          this.isDate.beginNoticeDate = false;
          this.isDate.endNoticeDate = false;
        }
        callback()  
      }
    }
    //保证金结束
    const validateEndEarnest = (rule, value, callback) => {
      let curr_btnStatusData = this.data.btnStatusData;
      let curr_formData = [];
      if(this.data.configType === 'add'){
        curr_formData = this.$refs.supplyFormItem.$refs.formData.model;
      }else{
        curr_formData = this.form;
      }
      if(value === ''){
        callback(new Error('请选择保证金结束时间'))
      } else {
        if(((this.data.configType === 'infoTrans' && curr_btnStatusData.isRestart === 1) || this.data.configType === 'add' || this.data.configType === 'edit') && this.isUpdateDate) {
          // const startDate = Date.parse(curr_formData.endNoticeTime);
          // const endDate = Date.parse(value);
          // if(startDate < endDate){
          //   callback(new Error('保证金缴纳截至时间 <= 公告结束时间'))
          // }
          curr_formData.endEarnestTime = value;
          this.isDate.beginNoticeDate = false;
          this.isDate.endNoticeDate = false;
        }
        callback()  
      }
    }
    //挂牌开始
    const validateBeginList = (rule, value, callback) => {
      let curr_btnStatusData = this.data.btnStatusData;
      let curr_formData = [];
      if(this.data.configType === 'add'){
        curr_formData = this.$refs.supplyFormItem.$refs.formData.model;
      }else{
        curr_formData = this.form;
      }
      if(value === ''){
        callback(new Error('请选择挂牌开始时间'))
      } else {
        if(((this.data.configType === 'infoTrans' && curr_btnStatusData.isRestart === 1) || this.data.configType === 'add' || this.data.configType === 'edit') && this.isUpdateDate) {
          // const startDate = Date.parse(curr_formData.endNoticeTime);
          // const endDate = Date.parse(value);
          // if(endDate < startDate){
          //   callback(new Error('挂牌开始时间必须大于等于公告结束时间'))
          // }
          curr_formData.beginListTime = curr_formData.beginFocusTime = value;
          curr_formData.endListTime = curr_formData.endFocusTime = curr_formData.beginLimitTime = getTime(value, this.dictionaryListCode);
        }
        callback()
      }
    }
    //挂牌结束
    const validateEndList = (rule, value, callback) => {
      let curr_btnStatusData = this.data.btnStatusData;
      let curr_formData = [];
      if(this.data.configType === 'add'){
        curr_formData = this.$refs.supplyFormItem.$refs.formData.model;
      }else{
        curr_formData = this.form;
      }
      if(value === ''){
        callback(new Error('请选择挂牌结束时间'));
      } else {
        if(((this.data.configType === 'infoTrans' && curr_btnStatusData.isRestart === 1) || this.data.configType === 'add' || this.data.configType === 'edit') && this.isUpdateDate) {
          // const startDate = Date.parse(curr_formData.beginListTime);
          // const endDate = Date.parse(value);
          // const changeDay = this.dictionaryListCode / (1 * 60 * 60 * 24);
          // if(endDate < startDate){
          //   callback(new Error('挂牌结束时间必须大于等于挂牌开始时间'))
          // }
          curr_formData.endListTime = curr_formData.endFocusTime = curr_formData.beginLimitTime = value;
        }
        callback()
      }
    }
    //竞价开始
    const validateBeginLimit = (rule, value, callback) => {
      let curr_btnStatusData = this.data.btnStatusData;
      let curr_formData = [];
      if(this.data.configType === 'add'){
        curr_formData = this.$refs.supplyFormItem.$refs.formData.model;
      }else{
        curr_formData = this.form;
      }
        if(value === ''){
          callback(new Error('请选择竞价开始时间'))
        } else {
          if(((this.data.configType === 'infoTrans' && curr_btnStatusData.isRestart === 1) || this.data.configType === 'add' || this.data.configType === 'edit') && this.isUpdateDate) {
            //为拍卖时,不为挂牌时--1天
            //拿到年月日
            // const startDate = Date.parse(curr_formData.endApplyTime);
            // const endDate = Date.parse(value);
            // if(endDate < startDate){
            //   callback(new Error('竞价开始时间必须大于等于竞买申请结束时间'))
            // }
            curr_formData.beginLimitTime = value;
            this.isDate.beginNoticeDate = false;
            this.isDate.endNoticeDate = false;
          }
          callback()
      }
    }
    return {
      /** 输入禁用 */
      inputDisabled: configType === 'detail' || configType === 'infoTrans',
      inPage: configType,
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      // edit: true,
      form: {
        no: undefined,
        area: undefined,
        transType: this.common && this.common.plowTransactionOptions && this.common.plowTransactionOptions[0].id,
        businessType: '',
        allowUnion: 0,
        isAfterCheck:0,
        allowLive: 1,
        requireBidderNum: 1,
        beginPrice: undefined,
        priceStep: undefined,
        earnestMoney: undefined,
        reservePrice: undefined,
        finalPrice: undefined,
        beginApplyTime: '',
        endApplyTime: '',
        beginEarnestTime: '',
        beginLimitTime: '',
        beginListTime: '',
        endListTime: '',
        beginFocusTime: '',
        endFocusTime: '',
        beginNoticeTime: '', //  公告开始时间 ,
        endNoticeTime: '', // 公告结束时间 ,
        beginApplyTime: '', //  竞买申请开始时间 ,
        endApplyTime: '', //  竞买申请结束时间 ,
        beginEarnestTime: '', //  保证金开始时间 ,
        endEarnestTime: '', //  保证金结束时间 ,
        beginLimitTime: '',
        hasReservePrice: 1
      },
      ruleChangeTime: ['beginNoticeTime', 'endNoticeTime', 'beginApplyTime', 'endApplyTime', 'beginEarnestTime', 'endEarnestTime', 'beginLimitTime'],
      layout: [
        {
          title: '交易标的基本情况',
          formItems: [
            {
              label: '编号',
              prop: 'no',
              inputType: 'input',
              span: 12
            },
            {
              label: '交易面积(亩)',
              prop: 'area',
              inputType: 'inputNumber',
              span: 12
            },
            {
              label: '交易方式',
              prop: 'transType',
              inputType: 'select',
              options: this.common && this.common.plowTransactionOptions,
              span: 12
            },
            {
              label: '交易类型',
              prop: 'businessType',
              inputType: 'select',
              options: this.common && this.common.plowBusinessOptions,
              allowCreate: true,
              span: 12
            },
            {
              label: '允许联合竞卖',
              prop: 'allowUnion',
              inputType: 'radio',
              options: [{
                id: 1,
                name: '是'
              }, {
                id: 0,
                name: '否'
              }],
              span: 12
            },
            {
              label: '资格审核',
              prop: 'isAfterCheck',
              inputType: 'radio',
              options: [{
                id: 1,
                name: '交易前审核'
              }, {
                id: 0,
                name: '交易后审核'
              }],
              span: 12
            },
            {
              label: '网上直播交易',
              prop: 'allowLive',
              inputType: 'radio',
              options: [{
                id: 1,
                name: '允许'
              }, {
                id: 0,
                name: '禁止'
              }],
              span: 12
            },
            {
              label: '必须申请人数',
              prop: 'requireBidderNum',
              inputType: 'inputNumber',
              span: 12
            }
            // {
            //   label: '委托人信息',
            //   prop: 'transTrustDto',
            //   inputType: 'custom',
            //   span: 24,
            //   required: true
            // }
          ]
        },
        {
          title: '价款信息和时间信息',
          formItems: [
            {
              label: '起始价(万元)',
              prop: 'beginPrice',
              inputType: 'inputNumber',
              min: 0,
              precision: 4,
              span: 12
            }, {
              label: '递减幅度(万元)',
              prop: 'priceStep',
              min: 0,
              inputType: 'inputNumber',
              precision: 4,
              prepend: '-',
              span: 12
            }, {
              label: '保证金(万元)',
              prop: 'earnestMoney',
              inputType: 'inputNumber',
              type: 'number',
              precision: 4,
              min: 0,
              span: 12
            }, {
              label: '最低限价(万元)',
              prop: 'reservePrice',
              inputType: 'inputNumber',
              precision: 4,
              min: 0,
              span: 12
            }, {
              label: '最高限价(万元)',
              prop: 'finalPrice',
              inputType: 'inputNumber',
              precision: 4,
              min: 0,
              span: 12,
              hide: true
            }, {
              label: '挂牌开始时间',
              prop: 'beginListTime',
              inputType: 'dataPicker',
              span: 12
            }, {
              label: '挂牌结束时间',
              prop: 'endListTime',
              inputType: 'dataPicker',
              span: 12
            }]
        },
        {
          title: '其他信息',
          hide: true,
          formItems: [
            {
              label: '公告开始时间',
              prop: 'beginNoticeTime',
              inputType: 'dataPicker',
              disabled: false,
              span: 12
            }, {
              label: '公告结束时间',
              prop: 'endNoticeTime',
              inputType: 'dataPicker',
              disabled: false,
              span: 12
            }, {
              label: '竞卖申请开始时间',
              prop: 'beginApplyTime',
              inputType: 'dataPicker',
              disabled: false,
              hide: true,
              span: 12
            }, {
              label: '竞卖申请结束时间',
              prop: 'endApplyTime',
              inputType: 'dataPicker',
              disabled: false,
              hide: true,
              span: 12
            }, {
              label: '保证金缴纳开始时间',
              prop: 'beginEarnestTime',
              inputType: 'dataPicker',
              disabled: false,
              hide: true,
              span: 12
            }, {
              label: '保证金缴纳截止时间',
              prop: 'endEarnestTime',
              inputType: 'dataPicker',
              class: '',
              disabled: false,
              span: 24
            }, {
              label: '挂牌开始时间',
              prop: 'beginListTime',
              inputType: 'dataPicker',
              disabled: false,
              span: 12
            }, {
              label: '挂牌结束时间',
              prop: 'endListTime',
              inputType: 'dataPicker',
              disabled: false,
              span: 12
            }, {
              label: '限时竞价开始时间',
              prop: 'beginLimitTime',
              inputType: 'dataPicker',
              disabled: false,
              hide: true,
              span: 12
            }]
        }
      ],
      formRules: {
        no: [{ required: true, message: '请输入编号', trigger: 'change' }],
        area: [{ required: true, message: '请输入交易面积(亩)', trigger: 'change' }],
        transType: [{ required: true, message: '请选择交易方式', trigger: 'change' }],
        businessType: [{ required: true, message: '请选择交易类型', trigger: 'change' }],
        allowUnion: [{ required: true, message: '请选择允许联合竞卖', trigger: 'change' }],
        allowLive: [{ required: true, message: '请选择网上直播交易', trigger: 'change' }],
         requireBidderNum: [
          { required: true, message: '请输入申请人数', trigger: 'change' }
        ],
        beginPrice: [{ required: true, message: '请输入起始价(万元)', trigger: ['blur', 'change'] }],
        earnestMoney: [{ required: true, message: '请输入保证金(万元)', trigger: ['blur', 'change'] }],
        beginNoticeTime: [{ required: true, validator: validateBeginNotice, trigger: 'blur' }],
        endNoticeTime: [{ required: true, validator: validateEndNotice, trigger: 'blur' }],
        beginApplyTime: [{ required: true, validator: validateBeginApply, trigger: 'blur' }],
        endApplyTime: [{ required: true, validator: validateEndApply, trigger: 'blur' }],
        beginEarnestTime: [{ required: true, validator: validateBeginEarnest, trigger: 'blur' }],
        endEarnestTime: [{ required: true, validator: validateEndEarnest, trigger: 'blur' }],
        beginFocusTime: { required: true, validator: validateBeginList, trigger: 'blur' },
        endFocusTime: [{ required: true, validator: validateEndList, trigger: 'blur' }],
        beginLimitTime: [{ required: true, validator: validateBeginLimit, trigger: 'blur' }],
        beginListTime: [
          { required: true, validator: validateBeginList, trigger: 'blur' }
        ],
        endListTime: [
          { required: true, validator: validateEndList, trigger: 'blur' }
        ],
        // transTrustDto: { required: false, message: '请选择委托人', trigger: 'change' },
        priceStep: [{ required: true, message: '请输入递减幅度(万元)', trigger: ['blur', 'change'] }],
        reservePrice: [{ required: true, message: '请输入最低限价(万元)', trigger: ['blur', 'change'] }],
        isAfterCheck: [{ required: true, message: '请选择资格审核', trigger: 'change' }],
        finalPrice: [{ required: false, message: '请输入最高限价(万元)', trigger: ['blur', 'change'] }]
      },
      Options: {
        tableData: []
      },
      dialog: {
        show: false,
        searchVal: {},
        searchItems: [{
          type: 'input',
          label: '委托人编号',
          labelWidth: '100px',
          props: {
            fieldName: 'no'
          }
        }, {
          type: 'input',
          label: '委托人',
          props: {
            fieldName: 'bidderName'
          }
        }
        // {
        //   type: 'input',
        //   label: '委托日期',
        //   props: {
        //     fieldName: 'no',
        //     type: 'daterange'
        //   }
        // }
        ],
        tableData: [],
        tableCols: [
          { label: '委托人编号', prop: 'no' },
          { label: '委托人', prop: 'name' },
          { label: '联系人', prop: 'contacts' },
          { label: '委托说明', prop: 'description' },
          { label: '标的数', prop: 'targets' },
          { label: '委托日期', prop: 'trustDate' }
        ],
        page: {
          current: 1,
          total: 0,
          pageSize: 10
        }
      },
      isUpdateDate: true,
      isDate:{
        beginNoticeDate:true,
        endNoticeDate:true,
      },
      editData: {},
      dictionaryNoticeCode:null,
      dictionaryListCode: null,
      dictionaryApplyCode:null,
      dictionaryBondCode:null,
      dictionaryNoticeLimitCode:null,
      dictionaryNoticeListCode:null,
      curr_name:'',
      canLoad: true
    };
  },
  mounted () {
    this.$nextTick(async () => {
      // this.isDisabled();
      this.layout[0].formItems[3].options = await this._getPlowBusinessType();
      this.layout[0].formItems[2].options = await this._getPlowTransactionType();
      this.form['transType'] = this.common && this.common.plowTransactionOptions[0].id;
    });
  },
  computed: {
    ...mapGetters(['common'])
  },
  watch: {
    show (val) {
      if (!val) {
        this.Options.tableData = [];
      }
      setTimeout(() => {
         val && this.dictionaryNoticeCode === null && this.isDisabled();
      }, 10);
    },
    data: {
      deep: true,
      immediate: true,
      handler (val, oldValue) {
        const { configType } = val;
        this.form = {
          ...this.form,
          ...val
        };
        this.inputDisabled = (configType === 'detail') || (configType === 'infoTrans');
        this.inPage = configType;
        this.isEdit = ['add', 'edit'].includes(configType);
        this.isAdd = ['add'].includes(configType);
        if(configType === 'infoTrans') {
          this.layout[1].title = '价款信息';
          this.layout[1].formItems[5].hide = this.layout[1].formItems[6].hide = true;
          this.layout[2].hide = false;
          this.ruleChangeTime.map(ruleTime => {
            this.formRules[ruleTime][0].required = true;
          });
        } else {
          this.layout[1].title = '价款信息和时间信息';
          this.layout[1].formItems[5].hide = this.layout[1].formItems[6].hide = false;
          this.layout[2].hide = true;
          this.ruleChangeTime.map(ruleTime => {
            this.formRules[ruleTime][0].required = false;
          });
        }
        // console.log(val && !this.isAdd)
        if (val && !this.isAdd) {
          // this.reqDetail();
        }
      }
    },
    Options: {
      handler (newValue, oldValue) {
        if (newValue.tableData.length !== 0) {
        }
      },
      deep: true
    },
    dialog: {
      handler (newValue, oldValue) {
        if(newValue.show && this.Options.tableData.length > 0) {
          this.onSetCurrentRow(this.Options.tableData[0].id);
        }
      },
      deep: true
    }
  },
  methods: {
    changeForm (val) {
      if (val.businessType === '出售指标') {
        // this.changeFormVal('卖', '买');
        this.changeStepVal('减', '增', '+');
        // this.layout[1].formItems[4].hide = false;
        // this.formRules['finalPrice'].required = true;
        this.layout[0].formItems[4].label = '允许联合竞买';
      } else {
        // this.changeFormVal('买', '卖');
        this.changeStepVal('增', '减', '-');
        // this.layout[1].formItems[4].hide = true;
        // this.formRules['finalPrice'].required = false;
        this.layout[0].formItems[4].label = '允许联合竞卖';
        this.form.allowUnion = 1;
      }
      if (val.businessType !== this.form.businessType) {
      this.$emit('changeFormBusinessType', val.businessType);
      }
      this.form = {
        ...this.form,
        ...val
      };
      // this.layout[2].formItems[8].hide = !(val.transType != '201');
      this.$forceUpdate();
    },
    changeFormVal (old, now) {
      this.layout[2].formItems[2].label = this.layout[2].formItems[2].label.replace(old, now);
      this.layout[2].formItems[3].label = this.layout[2].formItems[3].label.replace(old, now);
      
      // changeList.map(changeIndex => {
      //   this.formRules[changeIndex].message = this.formRules[changeIndex].message.replace(old, now);
      // });
      
    },
    changeStepVal (old, now, symbol) {
      this.layout[1].formItems[1].label = this.layout[1].formItems[1].label.replace(old, now);
      this.layout[1].formItems[1].prepend = symbol;
      this.formRules['priceStep'][0].message = this.formRules['priceStep'][0].message.replace(old, now);
    },
    isDisabled () {
      if(this.data.configType === 'infoTrans' || this.data.configType === 'edit'){
        const items = this.layout.map(item => {
          const formItems = item.formItems.map(fItem => {
            if(fItem.options){
              return {
                ...fItem,
                label: fItem.label,
                prop: fItem.prop,
                inputType: fItem.inputType,
                span: fItem.span,
                disabled: true,
                options:fItem.options
              }
            }else{
              return {
                ...fItem,
                label: fItem.label,
                prop: fItem.prop,
                inputType: fItem.inputType,
                span: fItem.span,
                disabled: true
              }
            }
          })
          return {
            title: item.title,
            hide: item.hide,
            formItems
          }
        });
        this.layout = items;
      }
      if((this.data.configType === 'infoTrans' || this.data.configType === 'add' || this.data.configType === 'edit') && this.data.btnStatusData.isRestart ===1){
        this.layout[2].formItems[0].disabled = false;
        this.layout[2].formItems[1].disabled = false;
        this.layout[2].formItems[2].disabled = false;
        this.layout[2].formItems[3].disabled = false;
        this.layout[2].formItems[4].disabled = false;
        this.layout[2].formItems[5].disabled = false;
        this.layout[2].formItems[6].disabled = false;
        this.layout[2].formItems[7].disabled = false;
        this.layout[2].formItems[8].disabled = false;
      }
      if (this.dictionaryNoticeCode && !this.canLoad) return;
      this.canLoad = false;
      this._selectListByCodeNoticeDetail();
      this._selectListByCodeListDetail();
      this._selectListByCodeApplyDetail();
      this._selectListByCodeBondDetail();
      this._selectListByCodeNoticeLimitDetail();
      this._selectListByCodeNoticeListDetail();
    },
    reqDetail () {
      const { id } = this.data;
      if (id) {
        detail(id).then(res => {
          if (res.code === '200') {
            this.target = {
              ...res.data.target,
              priceStep: res.data.target.priceStep ? Math.abs(res.data.target.priceStep) : 0,
              allowUnion: res.data.target.allowUnion ? res.data.target.allowUnion : 0,
              allowLive: res.data.target.allowLive ? res.data.target.allowLive : 1,
              requireBidderNum: res.data.target.requireBidderNum ? res.data.target.requireBidderNum : 1
            };
            this.trust = res.data.trust;
            this.form = {
              ...res.data.target,
              // ...res.data.trust
            };
            this.changeForm(this.form);
            // this.Options.tableData = [res.data.transTrustDto];
            this.curr_name = res.data.name;
            this.$forceUpdate();
          }
        });
      }
    },
    // submitFormItem () {
    //   this.$refs.supplyFormItem.submitForm()
    // },
    // submitForm (val) {
    //   const { configType, row } = this.data
    //   const id = configType === 'add' ? this.initId : this.form.id;
    //   if (this.Options.tableData.length === 0) {
    //     this.$notify.error({
    //       title: '失败',
    //       message: '请选择委托人信息!!!',
    //       position: 'bottom-right'
    //     });
    //     return;
    //   }
    //   const param = {
    //     ...val,
    //     id,
    //     priceStep: val.businessType === '出售指标' ? +val.priceStep : -val.priceStep,
    //     isAfterCheck: +val.isAfterCheck,
    //     trustUserId: this.Options.tableData[0].id,
    //     operateFlag: configType
    //   };
    //   delete param.transTrustDto;
    //   const message = configType === 'add' ? '新增成功' : '修改成功'
    //   savePlowTarget(param).then(res => {
    //     if (res.code === '200') {
    //       this.$notify({
    //         title: '成功',
    //         message,
    //         type: 'success',
    //         position: 'bottom-right'
    //       });
    //       this.$emit('success');
    //     }
    //   })
    // },
    submitFormItem (){
      this.submitForm();
    },
    // 确定数据
    submitForm () {
      let vm = this;
      this.isUpdateDate = false;
      this.isDate.beginNoticeDate = false;
      this.$refs.supplyFormItem.$refs.formData.validate(valid => {
        this.isUpdateDate = true;
        this.isDate.beginNoticeDate = true;
        this.isDate.endNoticeDate = true;
        const param = {
          target: {
            ...this.form,
            priceStep: this.form.businessType === '出售指标' ? +this.form.priceStep : -this.form.priceStep,
            isAfterCheck: +this.form.isAfterCheck,
            id: this.data.configType === 'add' ? this.initId : this.form.id,
            operateFlag: this.data.configType
          },
          trust: {}
        };
        if (valid) {
          applyTrust(param).then(res => {
            if (res.code === '200') {
              this.$notify({
                title: '成功',
                message: res.message,
                type: 'success',
                position: 'bottom-right'
              });
              this.$emit('success', res);
              this.$refs.supplyFormItem.cancelForm();
            }
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: '请填写完整必填数据!!!',
            position: 'bottom-right'
          });
          return false;
        }
      });
    },
    //重启交易
    onRestartTrade() {
      let vm = this;
      this.isUpdateDate = false;
      this.isDate.beginNoticeDate = false;
      this.isDate.endNoticeDate = false;
      this.$refs.supplyFormItem.$refs.formData.validate(valid => {
        this.isUpdateDate = true;
        this.isDate.beginNoticeDate = true;
        this.isDate.endNoticeDate = true;
        if(valid){
          const param = {
            command: {
              beginApplyTime: this.form.beginApplyTime,
              beginEarnestTime: this.form.beginEarnestTime,
              // beginFocusTime: (!this.form.beginFocusTime ? '' : this.form.beginFocusTime),
              beginFocusTime: (!this.form.beginListTime ? '' : this.form.beginListTime),
              beginLimitTime: this.form.beginLimitTime,
              beginListTime: (!this.form.beginListTime ? '' : this.form.beginListTime),
              beginNoticeTime: this.form.beginNoticeTime,
              endApplyTime: this.form.endApplyTime,
              endEarnestTime: this.form.endEarnestTime,
              // endFocusTime: (!this.form.endFocusTime ? '' : this.form.endFocusTime),
              endFocusTime: (!this.form.endListTime ? '' : this.form.endListTime),
              endListTime: (!this.form.endListTime ? '' : this.form.endListTime),
              endNoticeTime: this.form.endNoticeTime,
              // licenseId: '',
              targetId: this.form.id
            }
          }
          this.$confirm("确定重启交易吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            getRestartTrade(param).then(res => {
              if (res.code === '200') {
                  this.$notify({
                    title: '成功',
                    message: res.message,
                    type: 'success',
                    position: 'bottom-right'
                  });
                  this.$confirm(this.curr_name+"标的重启交易成功，请确定是否新增补充公告？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                  }).then(() => {
                    vm.$emit('notice','notice');
                  }).catch(() => {
                    vm.$emit('success');
                  });
                } else {
                  // this.$notify.error({
                  //   title: '失败',
                  //   message: res.message,
                  //   position: 'bottom-right'
                  // });
                }
            });
            this.$forceUpdate();
          }).catch(() => {

          });
        } else {
          this.$notify.error({
            title: '失败',
            message: '请填写完整必填数据!!!',
            position: 'bottom-right'
          });
          return false;
        }
      })
    },
    //暂停交易
    onTargetSuspend() {
      let vm = this;
      let id = this.form.id;
      this.$confirm("确定暂停交易吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
        }).then(() => {
        getTargetSuspend({targetIds:[id]}).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              position: 'bottom-right'
            });
            this.$confirm(this.curr_name+"标的暂停交易成功，请确定是否新增补充公告？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }).then(() => {
                vm.$emit('notice','notice');
              }).catch(() => {
                vm.$emit('success');
              });
          } else {
            // this.$notify.error({
            //   title: '失败',
            //   message: res.message,
            //   position: 'bottom-right'
            // });
          }
        });
        this.$forceUpdate();
        }).catch(() => {
          //点取消的提示
      });
    },
    //终止交易
    onTargetStop() {
      let vm = this;
      let id = this.form.id;
      this.$confirm("确定终止交易吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        getTargetStop(id).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              position: 'bottom-right'
            });
            this.$confirm(this.curr_name+"标的终止交易成功，请确定是否新增补充公告？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              vm.$emit('notice','notice');
            }).catch(() => {
              vm.$emit('success');
            });
          } else {
            // this.$notify.error({
            //   title: '失败',
            //   message: res.message,
            //   position: 'bottom-right'
            // });
          }
        });
        this.$forceUpdate();
      }).catch(() => {
        //点取消的提示
      });
    },
    _selectListByCodeNoticeDetail() {
      selectListByCodeDetail('TRADE_NOTICE_INTERVALS').then(res => {
        if (res.code === '200') {
          this.dictionaryNoticeCode = parseInt(res.data.value, 10);
        }
      });
      this.$forceUpdate();
    },
    _selectListByCodeListDetail() {
      selectListByCodeDetail('TRADE_INTERVALS_LISTED').then(res => {
        if (res.code === '200') {
          this.dictionaryListCode = parseInt(res.data.value, 10);
        }
      });
      this.$forceUpdate();
    },
    _selectListByCodeApplyDetail() {
      selectListByCodeDetail('APPLY_TIME').then(res => {
        if (res.code === '200') {
          this.dictionaryApplyCode = parseInt(res.data.value, 10);
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
    },
    _selectListByCodeNoticeLimitDetail() {
      selectListByCodeDetail('TRADE_NOTICEEND_LIMIT').then(res => {
        if (res.code === '200') {
          this.dictionaryNoticeLimitCode = parseInt(res.data.value, 10);
        }
      });
      this.$forceUpdate();
    },
    _selectListByCodeNoticeListDetail() {
      selectListByCodeDetail('TRADE_NOTICEEND_LISTED').then(res => {
        if (res.code === '200') {
          this.dictionaryNoticeListCode = parseInt(res.data.value, 10);
        }
      });
      this.$forceUpdate();
    },
    cancelForm () {
      // this.data.btnStatusData.isRestart = null;
      // this.data.btnStatusData = [];
      this.data.configType = '';
      this.isUpdateDate = true;
      this.isDate.beginNoticeDate = true;
      this.isDate.endNoticeDate = true;
      this.dictionaryNoticeCode = null;
      this.dictionaryListCode = null;
      this.dictionaryApplyCode = null;
      this.dictionaryBondCode = null;
      this.dictionaryNoticeLimitCode = null;
      this.dictionaryNoticeListCode = null;
      this.curr_name = '';
      this.form = {
        no: undefined,
        area: undefined,
        transType: this.common && this.common.plowTransactionOptions && this.common.plowTransactionOptions[0].id,
        businessType: '',
        allowUnion: 0,
        isAfterCheck:0,
        allowLive: 1,
        requireBidderNum: '1',
        beginPrice: undefined,
        priceStep: undefined,
        earnestMoney: undefined,
        reservePrice: undefined,
        finalPrice: undefined,
        beginApplyTime: '',
        endApplyTime: '',
        beginEarnestTime: '',
        beginLimitTime: '',
        beginListTime: '',
        endListTime: '',
        beginFocusTime: '',
        endFocusTime: '',
        beginNoticeTime: '', //  公告开始时间 ,
        endNoticeTime: '', // 公告结束时间 ,
        beginApplyTime: '', //  竞买申请开始时间 ,
        endApplyTime: '', //  竞买申请结束时间 ,
        beginEarnestTime: '', //  保证金开始时间 ,
        endEarnestTime: '', //  保证金结束时间 ,
        beginLimitTime: ''
      }
      this.$refs.supplyFormItem.cancelForm();
    },
    // 查询未绑定交易物的数据
    onSearch (val) {
      this.selectBindList = [];
      this.dialog.searchVal = val;
      this._getTrustList();
    },
    resetSearch () {
      this.dialog.searchVal.no = '';
      this.dialog.searchVal.cantonId = '';
    },
    // 弹窗确定
    bindConfirm () {
      this.Options.tableData = this.selectBindList;
      this.cancelDialog();
    },
    cancelDialog () {
      this.dialog.show = false;
      if (this.$refs.dialogTable && this.$refs.dialogTable) {
        this.$refs.dialogTable.onSetCurrentRow();
      }
    },
    // 弹窗打开后获取未绑定委托人的数据
    openBind () {
      this._getTrustList();
    },
    // 未绑定标的交易物当前页码
    onCurrentChange (val) {
      this.dialog.page.current = val;
      this._getTrustList();
    },
    onPageSizeChange (val) {
      this.dialog.page.pageSize = val;
      this.onCurrentChange(1);
    },
    // 获取未绑定标的交易物
    _getTrustList () {
      const param = {
        data: this.dialog.searchVal,
        pageNo: this.dialog.page.current,
        pageSize: this.dialog.page.pageSize
      };
      getTrustList(param)
        .then(res => {
          const { data, total } = res.data;
          this.dialog.page.total = total;
          this.dialog.tableData = data;
          !this.isAdd && this.onSetCurrentRow(this.form.transTrustDto.id)
        })
        .catch(err => {
        });
    },
    // 未绑定标的交易物数据选择
    bindSelection (val) {
      this.selectBindList = [val];
    },
    selectTransTrust () {
      this.dialog.show = true;
      !this.isAdd && this.onSetCurrentRow(this.form.transTrustDto.id)
    },
    onSetCurrentRow (id) {
      !!id && this.$refs.dialogTable.onSetCurrentRow(id);
    },
    // 未绑定标的交易物数据选择翻页记忆
    getRowKey (row) {
      return row.id;
    },
    rowdel (index) {
      this.Options.tableData.splice(index, 1);
    }
  },
  created () {
    const { configType } = this.data;
    this.isAdd = ['add'].includes(configType);
    !this.isAdd && this.reqDetail()
    setTimeout(() => {
      this.isDisabled();
    }, 10);
  }
};
</script>

<style lang="less">
.lowIndexList_baseInfo_dialog{
  .searchItem{
    margin-left: 0px;
  }
}
.endEarnestTimeClass{
  input{
    width: 42%;
  }
}
</style>
