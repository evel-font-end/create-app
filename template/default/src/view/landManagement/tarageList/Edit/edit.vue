<template>
  <div>
    <dialog-content
      @on-confirm="confirmedit"
      @on-close="canceledit"
      @on-open="openedit"
      :title="type==='add'?'新增标的':(type==='edit'?'编辑标的':'标的详情')"
      
      :visible.sync="editshow"
      ref="dialog"
      :dialogModel="dialogModel"
      :confirmShow="isEdit && edit"
      :cancelShow="isEdit && edit"
      :bottomShow="!!(isEdit || edit || (curr_transManage === 'transManage' && (curr_btnStatusData.isSuspend || curr_btnStatusData.isStop || curr_btnStatusData.isRestart)))"
      appendToBody
    >
      <div id="edits">
        <div class="content-bd">
          <FormItem
            ref="formData"
            :layout="layout"
            :rules="rules"
            :disabled="inputDisabled"
            :isEdit="edit"
            :inPage="pageType"
            :form="formData"
            labelWidth="160px"
            @submit="submitForm"
            @change="changeForm"
          />
          <Attach :initId="initId" :edit="edit" />
        </div>
        <dialog-content
          @on-cancel="cancelDialog"
          @on-confirm="bindConfirm"
          @on-open="openBind"
          title="待绑定交易物"
          width="900px"
          :visible.sync="dialog.show"
          ref="dialog"
          append-to-body
          customClass="btnInfo"
        >
          <div>
            <el-form label-width="80px" status-icon class="f-l">
              <el-form-item label="宗地编号：" class="inb">
                <el-input v-model="dialog.searchVal.no"></el-input>
              </el-form-item>
              <el-form-item label="区域：" class="inb">
                <el-select v-model="dialog.searchVal.cantonId" placeholder="请选择区域" clearable>
                  <el-option
                    v-for="item in dialog.cantonList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item> 
            </el-form>
            <div class="f-r">
              <el-button size="small" type="primary" class="submitBtn cl f-l" @click="onSearch">查询</el-button>
              <el-button class="default resetBtn cl f-l" size="small" @click="resetSearch">重置</el-button>
            </div>
          </div>
          <page-table
            ref="multipleTable"
            :data="dialog.tableData"
            :cols="dialog.tableCols"
            col-align="left"
            :page-current="dialog.page.current"
            :total="dialog.page.total"
            :page-size="dialog.page.pageSize"
            selection
            @current-change="onCurrentChange"
            @size-change="onPageSizeChange"
            @selection-change="bindSelection"
            reserve-selection
            :row-key="getRowKey"
          ></page-table>
        </dialog-content>
      </div>
      <div slot="footer" :style="{display: 'flex',justifyContent:'flex-end'}">
        <el-button style="margin-right: 10px;height:40px;" type="primary" v-if="curr_transManage === 'transManage' && curr_btnStatusData.isSuspend === 1" @click="onTargetSuspend">暂停交易</el-button>
        <el-button style="margin-right: 10px;height:40px;" type="primary" v-if="curr_transManage === 'transManage' && curr_btnStatusData.isStop === 1" @click="onTargetStop">终止交易</el-button>
        <el-button class="button" type="primary" v-if="curr_transManage === 'transManage' && curr_btnStatusData.isRestart === 1" @click="onRestartTrade">重启交易</el-button>
      </div>
    </dialog-content>
    <landSupply :show="landSupplyshow" :data="landSupplydata" @cancel="closeEdit"></landSupply>
    <edit-trade :show="tradeshow" :data="tradedata" @cancel="closeTrade"></edit-trade>
    <dialog-content
      @on-confirm="mathConfirmedit"
      @on-close="mathCanceledit"
      @on-open="mathOpenedit"
      :title="'规划建筑总面积计算器'"
      width="500px"
      :visible.sync="mathDditshow"
      ref="mathDialog"
      :bottomShow="true"
      appendToBody
    >
      <FormItem
        ref="mathFormData"
        :layout="mathLayout"
        :rules="mathRules"
        :form="mathFormData"
        labelWidth="100px"
        @change="changeMathForm"
      />
    </dialog-content>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import moment from 'moment';
import Flex from '@/components/flex';
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import commonApi from '@/mixins/commonApi';
import Attach from './Attach';
import dialogContent from '@/components/dialog';
import FormItem from '@/components/formItem';
import landSupply from '@/view/landManagement/noticeList/supplyDetail';
import editTrade from '@/view/landManagement/landTrade/LandTradeConfig';
import { getDictionaryListByConditions, initTargetAttach } from '@/api';
import {
  getBusinessType,
  getTransactionType,
  getTargetStatus,
  getInitTargetAttach,
  getTransTargetInfo,
  getunBindList,
  saveTransTarget,
  getNoticeDtlByTargetId
} from '@/api/landManagement/tarageList';
import {
  applyTrust,
  detail,
  commitTrust
} from '@/api/landManagement/tradeList';
import {
  getTargetSuspend,
  getTargetStop,
  getRestartTrade
  // saveTransTarget
} from '@/api/dealManagement/breakdealList';
import { selectListByParentCode, selectListByCodeDetail } from '@/api/common';
import { getTime } from '@/util/tool';

const DEVELOP_LEVELS = [
  { label: '一通一平', value: '一通一平' },
  { label: '两通一平', value: '两通一平' },
  { label: '三通一平', value: '三通一平' }
];

export default {
  components: {
    Wrapper,
    PageTable,
    Flex,
    Attach,
    dialogContent,
    landSupply,
    editTrade,
    FormItem
  },
  props: {
    id: '',
    type: '',
    show: '',
    dialogModel: true,
    data: {},
    btnStatusData:{},
    transManage:''
  },
  mixins: [commonApi()],
  data () {
        //公告开始
    const validateBeginNotice = (rule, value, callback) => {
      if(value === ''){
        callback(new Error('请选择公告开始时间'))
      } else {
        if(((this.pageType === 'infoTrans' && this.curr_btnStatusData.isRestart === 1) || this.pageType === 'add' || this.pageType === 'edit') && this.isUpdateDate) {
          //公告开始/竞买申请/保证金开始
          this.formData.beginNoticeTime = value;
          this.formData.beginApplyTime = value;
          this.formData.beginEarnestTime = value;

          this.formData.endNoticeTime = getTime(value, this.dictionaryNoticeCode);
          this.formData.endListTime = getTime(value, this.dictionaryListCode);
          this.formData.endApplyTime = getTime(this.formData.beginApplyTime, this.dictionaryApplyCode);
          this.formData.endEarnestTime =  getTime(this.formData.beginEarnestTime, this.dictionaryBondCode);
          
          if((this.formData.transType!=='102')&&(this.formData.transType!=='网上交易（拍卖）')){
            this.formData.beginListTime = getTime(this.formData.endNoticeTime, this.dictionaryNoticeListCode);
            this.formData.endListTime = getTime(this.formData.beginListTime, this.dictionaryListCode);
            this.formData.beginFocusTime = getTime(this.formData.endNoticeTime, this.dictionaryNoticeListCode);
            this.formData.endFocusTime = getTime(this.formData.beginListTime, this.dictionaryListCode);
            this.formData.beginLimitTime = this.formData.endFocusTime;
          } else {
            this.formData.beginLimitTime = getTime(this.formData.endNoticeTime, this.dictionaryNoticeLimitCode);
          }
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
          // const startDateCurr = Date.parse(this.formData.beginNoticeTime);
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
          this.formData.endNoticeTime = endDate;
          //竞买申请结束/保证金缴纳结束
          // this.formData.endApplyTime = endDate;
          // this.formData.endEarnestTime = endDate;

          if((this.formData.transType!='102')){
            //挂牌开始/自由报价开始
            const startDate2 = getTime(value, 0);
            const endDate2 = startDate2;
            this.formData.beginListTime = getTime(endDate2, this.dictionaryNoticeListCode);
            this.formData.beginFocusTime = getTime(endDate2, this.dictionaryNoticeListCode);

            //挂牌结束/自由报价结束/限时竞价开始
            const endDate3 = getTime(value, this.dictionaryListCode)
            this.formData.endListTime = endDate3;
            this.formData.endFocusTime = endDate3;
            this.formData.beginLimitTime = endDate3;
          }else{
            //限时竞价开始
            const startDate4 = getTime(value, 0);
            this.formData.beginLimitTime = getTime(startDate4, this.dictionaryNoticeLimitCode);
          }
        }
        callback()
      }
    }
    //竞买申请开始
    const validateBeginApply = (rule, value, callback) => {
      if(value === ''){
        callback(new Error('请选择竞买申请开始时间'))
      } else {
        if(((this.pageType === 'infoTrans' && this.curr_btnStatusData.isRestart === 1) || this.pageType === 'add' || this.pageType === 'edit') && this.isUpdateDate) {
          // const startDate = this.formData.beginNoticeTime && Date.parse(this.formData.beginNoticeTime.split(" ")[0]);
          // const endDate = value && Date.parse(value.split(" ")[0]);
          // if(startDate != endDate){
          //   callback(new Error('竞买申请开始时间 = 公告开始时间'))
          // }
          this.formData.beginApplyTime = value;
          this.formData.endApplyTime = getTime(value, this.dictionaryApplyCode);
          this.isDate.beginNoticeDate = false;
          this.isDate.endNoticeDate = false;
        }
        callback()
      }
    }
    //保证金开始
    const validateBeginEarnest = (rule, value, callback) => {
      if(value === ''){
        callback(new Error('请选择保证金开始时间'))
      } else {
        if(((this.pageType === 'infoTrans' && this.curr_btnStatusData.isRestart === 1) || this.pageType === 'add' || this.pageType === 'edit') && this.isUpdateDate) {
          // const startDate = this.formData.beginNoticeTime && Date.parse(this.formData.beginNoticeTime.split(" ")[0]);
          // const endDate = value && Date.parse(value.split(" ")[0]);
          // if(startDate != endDate){
          //   callback(new Error('保证金缴纳开始时间 = 公告开始时间'))
          // }
          this.formData.beginEarnestTime = value;
          this.formData.endEarnestTime = getTime(value, this.dictionaryBondCode);
          this.isDate.beginNoticeDate = false;
          this.isDate.endNoticeDate = false;
        }
        callback()  
      }
    }
    //竞买申请结束
    const validateEndApply = (rule, value, callback) => {
      if(value === ''){
        callback(new Error('请选择竞买申请结束时间'))
      } else {
        if(((this.pageType === 'infoTrans' && this.curr_btnStatusData.isRestart === 1) || this.pageType === 'add' || this.pageType === 'edit') && this.isUpdateDate) {
          // const startDate = this.formData.endNoticeTime && Date.parse(this.formData.endNoticeTime.split(" ")[0]);
          // const endDate = value && Date.parse(value.split(" ")[0]);
          // if(startDate < endDate){
          //   callback(new Error('竞买申请结束时间 <= 公告结束时间'))
          // }
          this.formData.endApplyTime = value;
          this.isDate.beginNoticeDate = false;
          this.isDate.endNoticeDate = false;
        }
        callback()  
      }
    }
    //保证金结束
    const validateEndEarnest = (rule, value, callback) => {
      if(value === ''){
        callback(new Error('请选择保证金结束时间'))
      } else {
        if(((this.pageType === 'infoTrans' && this.curr_btnStatusData.isRestart === 1) || this.pageType === 'add' || this.pageType === 'edit') && this.isUpdateDate) {
          // const startDate = this.formData.endNoticeTime && Date.parse(this.formData.endNoticeTime.split(" ")[0]);
          // const endDate = value && Date.parse(value.split(" ")[0]);
          // if(startDate < endDate){
          //   callback(new Error('保证金缴纳截至时间 <= 公告结束时间'))
          // }
          this.formData.endEarnestTime = value;
          this.isDate.beginNoticeDate = false;
          this.isDate.endNoticeDate = false;
        }
        callback()  
      }
    }
    //挂牌开始
    const validateBeginList = (rule, value, callback) => {
      if((this.formData.transType!='102')){
        if(value === ''){
          callback(new Error('请选择挂牌开始时间'))
        } else {
          if(((this.pageType === 'infoTrans' && this.curr_btnStatusData.isRestart === 1) || this.pageType === 'add' || this.pageType === 'edit') && this.isUpdateDate) {
            // const startDate = this.formData.endNoticeTime && Date.parse(this.formData.endNoticeTime.split(" ")[0]);
            // const endDate = value && Date.parse(value.split(" ")[0]);
            // if(endDate < startDate){
            //   callback(new Error('挂牌开始时间必须大于等于公告结束时间'))
            // }
            this.formData.beginListTime = value;
            this.formData.beginFocusTime = value;
            this.formData.endListTime = getTime(value, this.dictionaryListCode);
            this.formData.endFocusTime = getTime(value, this.dictionaryListCode);
            this.formData.beginLimitTime = getTime(value, this.dictionaryListCode);
            this.isDate.beginNoticeDate = false;
            this.isDate.endNoticeDate = false;
          }
          callback()
        }
      } else {
        callback()
      }
    }
    //挂牌结束
    const validateEndList = (rule, value, callback) => {
      if((this.formData.transType!='102')){
        if(value === ''){
          callback(new Error('请选择挂牌结束时间'))
        } else {
          if(((this.pageType === 'infoTrans' && this.curr_btnStatusData.isRestart === 1) || this.pageType === 'add' || this.pageType === 'edit') && this.isUpdateDate) {
            // const startDate = this.formData.beginListTime && Date.parse(this.formData.beginListTime.split(" ")[0]);
            // const endDate = value && Date.parse(value.split(" ")[0]);
            // const changeDay = this.dictionaryListCode / (1 * 60 * 60 * 24);
            // if(endDate < startDate){
            //   callback(new Error('挂牌结束时间必须大于等于挂牌开始时间'))
            // }
            this.formData.endListTime = value;
            this.formData.endFocusTime = value;
            this.formData.beginLimitTime = value;
            this.isDate.beginNoticeDate = false;
            this.isDate.endNoticeDate = false;
          }
          callback()
        }
      }else {
        callback()
      }
    }
    //竞价开始
    const validateBeginLimit = (rule, value, callback) => {
        if(value === ''){
          callback(new Error('请选择竞价开始时间'))
        } else {
          if(((this.pageType === 'infoTrans' && this.curr_btnStatusData.isRestart === 1) || this.pageType === 'add' || this.pageType === 'edit') && this.isUpdateDate) {
            // const startDate = Date.parse(this.formData.endNoticeTime.split(" ")[0]);
            // const endDate = Date.parse(value.split(" ")[0]);
            // if(((endDate - startDate)/(1*24*60*60*1000))<0){
            //   callback(new Error('限时竞价时间 大于等于 公告结束时间'))
            // }
            //不为拍卖时,为挂牌时--10天
            if((this.formData.transType != '102')){
              // const startDate = this.formData.endNoticeTime && Date.parse(this.formData.endNoticeTime.split(" ")[0]);
              // const endDate = value && Date.parse(value.split(" ")[0]);
              // if(((endDate - startDate)/(1*24*60*60*1000))<0){
              //   callback(new Error('限时竞价时间 >= 公告结束时间'))
              // }
              this.formData.beginLimitTime = value;
              this.isDate.beginNoticeDate = false;
              this.isDate.endNoticeDate = false;
            }else{
              //为拍卖时,不为挂牌时--1天
              //拿到年月日
              // const startDate = Date.parse(this.formData.endApplyTime.split(" ")[0]);
              // const endDate = Date.parse(value.split(" ")[0]);
              // if(endDate < startDate){
              //   callback(new Error('竞价开始时间必须大于等于竞买申请结束时间'))
              // }
              this.formData.beginLimitTime = value;
              this.isDate.beginNoticeDate = false;
              this.isDate.endNoticeDate = false;
            }
            
          }
          callback()
      }
    }
    const mathResult = (area, plotRatio) => {
      // 规划建筑总面积 =土地使用权面积*容积率
      const areaCount = area * (plotRatio);
      this.mathLayout[0].formItems[2].valueNumber = areaCount;
      this.mathLayout[0].formItems[2].value = `${(parseFloat(areaCount).toString() == "NaN" || parseFloat(areaCount).toString() == "Infinity") ? '0' : parseFloat(areaCount).toFixed(2)} 平方米`;
    }
    const validateMathArea = (rule, value, callback) => {
      if(value === ''){
        callback(new Error('请输入出让面积'))
      } else {
        // this.formData.buildArea = area;
        mathResult(value, this.mathFormData.plotRatio);
        callback();
      }
    }
    const validateMathRatio = (rule, value, callback) => {
        if(value === ''){
          callback(new Error('请输入容积率'))
        } else {
          mathResult(this.mathFormData.area, value);
          callback();
        }
    }
    return {
      inputDisabled: false,
      isEdit: false,
      isAdd: false,
      goods: {},
      target: {},
      trust: {},
      formData: {
        allowUnion: 0, // 是否允许联合竞买 ,
        allowLive: 1, // 是否允许网上直播 ,
        earnestMoney: undefined, //  保证金金额 ,
        beginListTime: '', //  集中报价开始时间 ,
        endListTime: '', //  集中报价结束时间 ,
        beginPrice: undefined, //  起始价 ,
        goodsIds: [], // 绑定的交易物标识 ,
        id: '', // 主键，该值不为空时进行修改操作 ,
        priceStep: undefined, //  增价幅度 ,
        isAfterCheck: 0, // 交易后审核
        requireBidderNum: '', // 必须参与竞买人数 ,
        // requirePriceNum: '', // 必须参与出价人数 ,
        businessType: '', //  交易类型 ,
        transType: undefined, // 交易方式
        operateFlag: '', // 操作类型(edit:编辑,add:添加)
        no: '',
        address: '',
        buildArea: '',
        buildAreaCount: '',
        goodsUse: '',
        useYears: '住宅70年、商业40年',
        plot: '',
        buildDensity: '',
        buildHeight: '',
        greenRatio: '',
        aggregateInvestment: '',
        projectTerm: '',
        property: '',
        owner: '',
        submitTime: '',
        startTime: '',
        endTime: '',
        period: '',
        tdxztj: '',
        remark: '',
        cantonId: '',
        greenHRatio: '',
        beginNoticeTime: '', //  公告开始时间 ,
        endNoticeTime: '', // 公告结束时间 ,
        beginApplyTime: '', //  竞买申请开始时间 ,
        endApplyTime: '', //  竞买申请结束时间 ,
        beginEarnestTime: '', //  保证金开始时间 ,
        endEarnestTime: '', //  保证金结束时间 ,
        beginLimitTime: ''
      },
      ruleChangeTime: ['beginNoticeTime', 'endNoticeTime', 'beginApplyTime', 'endApplyTime', 'beginEarnestTime', 'endEarnestTime', 'beginLimitTime'],
      rules: {
        no: [
          { required: true, message: '请输入宗地编号', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入宗地位置', trigger: 'blur' }
        ],
        buildArea: [
          { required: true, message: '请输入使用权面积(㎡)', trigger: 'change' }
        ],
        buildAreaCount: [
          { required: true, message: '请输入规划建筑总面积(㎡)', trigger: 'change' }
        ],
        plot: [
          { required: true, message: '请输入容积率', trigger: 'change' }
        ],
        goodsUse: [
          { required: true, message: '请选择用途', trigger: 'blur' }
        ],
        businessType: [
          { required: true, message: '请选择交易类型', trigger: ['change', 'blur'] }
        ],
        allowLive: [
          { required: true, message: '请选择是否网上直播', trigger: 'change' }
        ],
        transType: [
          { required: true, message: '请选择交易方式', trigger: ['change', 'blur'] }
        ],
        allowUnion: [
          { required: true, message: '请选择竞买方式', trigger: 'change' }
        ],
        requireBidderNum: [
          { required: true, message: '请输入申请人数', trigger: 'change' }
        ],
        beginListTime: [
          { required: true, validator: validateBeginList, trigger: 'blur' }
        ],
        endListTime: [
          { required: true, validator: validateEndList, trigger: 'blur' }
        ],
        earnestMoney: [
          { required: true, message: '请输入保证金金额', trigger: ['blur', 'change'] }
        ],
        beginPrice: [
          { required: true, message: '请输入起始价', trigger: ['blur', 'change'] }
        ],
        priceStep: [
          { required: true, message: '请输入加价幅度', trigger: ['blur', 'change'] }
        ],
        isAfterCheck: [
          { required: true, message: '请选择资格审核', trigger: 'change' }
        ],
        goodsIds: [
          { required: true, message: '请选择绑定的交易物信息', trigger: 'blur' }
        ],
        beginEarnestTime: [
          { required: true, validator: validateBeginEarnest, trigger: 'blur'}
        ],
        endEarnestTime: [
          { required: true, validator: validateEndEarnest, trigger: 'blur' }
        ],
        beginApplyTime: [
          { required: true, validator: validateBeginApply, trigger: 'blur'}
        ],
        endApplyTime: [
          { required: true, validator: validateEndApply, trigger: 'blur' }
        ],
        beginNoticeTime: [
          { required: true, validator: validateBeginNotice, trigger: 'blur' }
        ],
        endNoticeTime: [
          { required: true, validator: validateEndNotice, trigger: 'blur' }
        ],
        beginLimitTime: [
          { required: true, validator: validateBeginLimit, trigger: 'blur' }
        ],
        // hasReservePrice: [
        //   { required: true, message: '请输入是否设置底价', trigger: ['blur', 'change'] }
        // ],
      },
      layout: [
        {
          title: '基本情况',
          formItems: [
            { label: '宗地编号', prop: 'no', inputType: 'input', span: 12 },
            {
              label: '宗地位置',
              prop: 'address',
              inputType: 'input',
              span: 12
            },
            {
              label: '使用权面积(㎡)',
              prop: 'buildArea',
              inputType: 'input',
              span: 12
            },
            {
              label: '规划建筑总面积(㎡)',
              prop: 'buildAreaCount',
              inputType: 'input',
              error: '用于楼面地价计算，请填写正确。',
              append: '计算',
              appendStyle: {
                color: '#2573f1',
                cursor: 'pointer'
              },
              appendClick: () => {this.mathDditshow = true},
              span: 12
            },
            {
              label: '用途',
              prop: 'goodsUse',
              inputType: 'select',
              allowCreate: true,
              options: [],
              span: 12
            },
            {
              label: '出让年限',
              prop: 'useYears',
              inputType: 'input',
              span: 12
            },
            {
              label: '区域',
              prop: 'cantonId',
              inputType: 'select',
              options: [],
              span: 12
            }
          ]
        },
        {
          title: '规划指标要求',
          formItems: [
            {
              label: '容积率',
              prop: 'plot',
              inputType: 'input',
              span: 6
            },
            {
              label: '建筑密度(%)',
              prop: 'buildDensity',
              inputType: 'input',
              span: 6
            },
            {
              label: '建筑高度',
              prop: 'buildHeight',
              inputType: 'input',
              span: 6
            },
            {
              label: '绿地率',
              prop: 'greenRatio',
              inputType: 'input',
              span: 6
            },
            {
              label: '投资强度',
              prop: 'aggregateInvestment',
              inputType: 'input',
              span: 12
            },
            {
              label: '开发程度',
              prop: 'projectTerm',
              inputType: 'select',
              options: DEVELOP_LEVELS,
              span: 12
            }
          ]
        },
        {
          title: '交易基本情况',
          formItems: [{
              label: '交易类型',
              prop: 'businessType',
              inputType: 'select',
              options: [],
              allowCreate: true,
              span: 12
          }, {
              label: '交易方式',
              prop: 'transType',
              inputType: 'select',
              allowCreate: true,
              options: [],
              span: 12
            }, {
              label: '允许联合竞买',
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
            }, {
              label: '必须申请人数',
              prop: 'requireBidderNum',
              inputType: 'inputNumber',
              span: 12
            }, {
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
            },  {
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
            }]
        },
        {
          title: '价款信息和时间信息',
          formItems: [{
              label: '起始价(万元)',
              prop: 'beginPrice',
              inputType: 'inputNumber',
              precision: 4,
              span: 12
            }, {
              label: '加价幅度(万元)',
              prop: 'priceStep',
              inputType: 'inputNumber',
              precision: 4,
              span: 12
            }, {
              label: '保证金(万元)',
              prop: 'earnestMoney',
              class: 'earnestMoney',
              placeholder: '0.00',
              inputType: 'inputNumber',
              type: 'number',
              width: '100%',
              precision: 4,
              min: 0,
              span: 12
            }, {
              label: '是否设置底价',
              prop: 'hasReservePrice',
              inputProp: 'reservePrice',
              inputType: 'radioGroupInput',
              radioOptions: [{
                label: '有保护价',
                id: 1
              }, {
                label: '无保护价',
                id: 0
              }],
              inputShow: false,
              hide: true,
              span: 12
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
          title: '时间信息',
          formItems: [{
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
              label: '竞买申请开始时间',
              prop: 'beginApplyTime',
              inputType: 'dataPicker',
              disabled: false,
              hide: true,
              span: 12
          }, {
              label: '竞买申请结束时间',
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
              class: 'endEarnestTimeMain',
              inputType: 'dataPicker',
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
            },{
              label: '限时竞价开始时间',
              prop: 'beginLimitTime',
              inputType: 'dataPicker',
              disabled: false,
              hide: true,
              span: 12
          }]
         },
        {
          title: '其他要求',
          formItems: [
            {
              label: '权属性质',
              prop: 'property',
              inputType: 'input',
              span: 12
            },
            {
              label: '权属单位',
              prop: 'owner',
              inputType: 'input',
              span: 12
            },
            {
              label: '交地时间',
              prop: 'submitTime',
              inputType: 'input',
              span: 12
            },
            {
              label: '动工时间',
              prop: 'startTime',
              inputType: 'input',
              span: 12
            },
            {
              label: '竣工时间',
              prop: 'endTime',
              inputType: 'input',
              span: 12
            },
            {
              label: '开发周期',
              prop: 'period',
              inputType: 'input',
              span: 12
            },
            {
              label: '产业类别',
              prop: 'industryType',
              inputType: 'input',
              span: 24
            },
            {
              label: '绿化率',
              prop: 'greenHRatio',
              inputType: 'input',
              span: 12
            },
            {
              label: '限高(米)',
              prop: 'limitUp',
              inputType: 'input',
              span: 12
            },
            {
              label: '限低(米)',
              prop: 'limitDown',
              inputType: 'input',
              span: 12
            },
            {
              label: '建设用地类型',
              prop: 'transLandTypeValue',
              inputType: 'radio',
              options: [{
                label: '地上',
                value: '地上'
              }, {
                label: '地下',
                value: '地下'
              }, {
                label: '地表',
                value: '地表'
              }],
              span: 12
            },
            {
              label: '坐标',
              prop: 'positionXY',
              inputType: 'input',
              span: 24
            },
            {
              label: '土地现有条件',
              prop: 'tdxztj',
              inputType: 'textarea',
              span: 24
            },
            { label: '备注', prop: 'remark', inputType: 'textarea', span: 24, maxlength: 200 }
          ]
        }
      ],
      Options: {
        businessType: [], // 交易类型
        transType: [], // 交易方式
        tableData: []
      },
      dialog: {
        show: false,
        tableData: [],
        tableCols: [
          { label: '宗地编号', prop: 'no' },
          { label: '行政区域', prop: 'cantonName' },
          { label: '交易物类型', prop: 'goodsType' },
          { label: '用途', prop: 'goodsUse' },
          { label: '创建时间', prop: 'createDate', minWidth: '150px' }
        ],
        page: {
          current: 1,
          total: 0,
          pageSize: 10
        },
        searchVal: {
          no: '', // 编号
          cantonId: '', // 区域
          goodsType: 101
        }
      },
      edit: true,
      editshow: false,
      pageType: '',
      initId: '',
      selectBindList: [],
      infoData: {},
      curr_transManage:'',
      curr_btnStatusData:{},
      isRestartEdit: false,
      isUpdateDate: true,
      isDate:{
        beginNoticeDate:true,
        endNoticeDate:true,
      },
      dictionaryNoticeCode:null,
      dictionaryListCode: null,
      dictionaryApplyCode:null,
      dictionaryBondCode:null,
      dictionaryNoticeLimitCode:null,
      dictionaryNoticeListCode:null,
      curr_name:'',
      noticeInfo:{
        id: '',
        no:'',
        name:'',
        noticeDate:''
      },
      landSupplyshow:false,
      landSupplydata:{},
      tradeshow:false,
      tradedata:{},
      mathDditshow: false,
      mathFormData: {
        area: '',
        plotRatio: '',
        result: ''
      },
      mathLayout: [
        {
          title: '计算器',
          formItems: [
            { label: '出让面积', prop: 'area', min: 0, controls: false, append: '平方米', inputType: 'inputNumber', span: 24 },
            { label: '容积率', prop: 'plotRatio', min: 0, controls: false, inputType: 'inputNumber', span: 24 },
            { label: '结果', value: '', span: 24 },
          ]
        }
      ],
      mathRules: {
        area: [
          { required: true, validator: validateMathArea, trigger: ['blur', 'change'] }
        ],
        plotRatio: [
          { required: true, validator: validateMathRatio, trigger: ['blur', 'change'] }
        ]
      }
    };
  },
  watch: {
    data: {
      deep: true,
      handler (newval, oldval) {
        this.initId = newval.id;
        this.pageType = newval.type;
        this.curr_transManage = newval.transManage;
        this.curr_btnStatusData = newval.btnStatusData;
        if (newval.type === 'infoTrans') {
          this.edit = false;
          if(this.curr_btnStatusData.isRestart === 1){
            this.isRestartEdit = true;
          }
        }
        if(newval.type === 'info'){
          this.edit = true;
          this.isRestartEdit = false;
        }
        if (!this.dialogModel) {
          this.openedit()
        }
      }
    },
    show (val) {
      this.editshow = val;
        if (val) {
        this.initId = this.id;
        this.pageType = this.type;
        this.curr_transManage = this.transManage;
        this.curr_btnStatusData = this.btnStatusData;
        if (this.pageType === 'infoTrans') {
          this.edit = false;
          if(this.curr_btnStatusData.isRestart === 1){
            this.isRestartEdit = true;
          }
        }else if(this.pageType === 'info'){
          this.edit = false;
          this.isRestartEdit = false;
        }
      }
    },
    Options: {
      handler (newValue, oldValue) {
        if (newValue.tableData && newValue.tableData.length !== 0) {
          this.formData.goodsIds = newValue.tableData.map(item => item.id);
        } else {
          this.formData.goodsIds = [];
        }
      },
      deep: true
    },
    dialog: {
      handler (newValue, oldValue) {
        if(newValue.show && this.formData.goodsIds.length > 0) {
          const items = this.formData.goodsIds.map(item => {
            return {
              id: item
            };
          });
          this.$refs.multipleTable.onRowChange(items);
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['common']),
  },
  created () {
    if ((this.data && this.data.hasOwnProperty('id')) && !this.dialogModel) {
      this.infoData = this.data
      this.initId = this.data.id;
      this.pageType = this.data.type;
      this.curr_transManage = this.data.transManage;
      this.curr_btnStatusData = this.data.btnStatusData;
      this.edit = false;
      this.openedit()
    } else {
      this.editshow = this.show;
      this.initId = this.id;
      this.curr_transManage = this.transManage;
      this.curr_btnStatusData = this.btnStatusData;
    }
  },
  mounted () {
    this.$nextTick(() => {
    });
  },
  methods: {
    ...mapMutations([
      'set_common'
    ]),
    canceledit () {
      if (this.$refs.multipleTable && this.$refs.multipleTable) {
        this.$refs.multipleTable.getPageTable();
      }
      this.$refs.formData.cancelForm();
      this.editshow = false;
      this.$emit('cancel');
      this.Options = {
        businessType: [], // 交易类型
        transType: [], // 交易方式
        tableData: []
      };
      this.formData = {
        allowUnion: 0, // 是否允许联合竞买 ,
        allowLive: 1, // 是否允许网上直播 ,
        beginEarnestTime: '', //  保证金开始时间 ,
        endEarnestTime: '', //  保证金结束时间 ,
        earnestMoney: undefined, //  保证金金额 ,
        beginListTime: '', //  挂牌开始时间 ,
        endListTime: '', //  挂牌结束时间 ,
        beginPrice: undefined, //  起始价 ,
        goodsIds: [], // 绑定的交易物标识 ,
        id: '', // 主键，该值不为空时进行修改操作 ,
        priceStep: undefined, //  增价幅度 ,
        isAfterCheck: 0, // 交易后审核
        requireBidderNum: '', // 必须参与竞买人数 ,
        requirePriceNum: '', // 必须参与出价人数 ,
        businessType: '', //  交易类型 ,
        transType: '', // 交易方式
        operateFlag: '', // 操作类型(edit:编辑,add:添加)
         no: '',
        address: '',
        buildArea: '',
        buildAreaCount: '',
        goodsUse: '',
        useYears: '住宅70年、商业40年',
        plot: '',
        buildDensity: '',
        buildHeight: '',
        greenRatio: '',
        aggregateInvestment: '',
        projectTerm: '',
        property: '',
        owner: '',
        submitTime: '',
        startTime: '',
        endTime: '',
        period: '',
        tdxztj: '',
        remark: '',
        cantonId: '',
        greenHRatio: '',
        beginNoticeTime: '', //  公告开始时间 ,
        endNoticeTime: '', // 公告结束时间 ,
        beginApplyTime: '', //  竞买申请开始时间 ,
        endApplyTime: '', //  竞买申请结束时间 ,
        beginEarnestTime: '', //  保证金开始时间 ,
        endEarnestTime: '', //  保证金结束时间 ,
        beginLimitTime: '',
        hasReservePrice: 1,
        reservePrice: '',
      };
      this.dialog.show = false;
      this.dialog.tableData = [];
      this.edit = true;
      this.editshow = false;
      this.pageType = '';
      this.initId = '';
      this.curr_transManage = '';
      this.curr_btnStatusData = [];
      this.selectBindList = [];
      this.isUpdateDate = true;
      this.isDate.beginNoticeDate = true;
      this.isDate.endNoticeDate = true;
      this.isRestartEdit = false;
      this.dictionaryNoticeCode = null;
      this.dictionaryListCode = null;
      this.dictionaryApplyCode = null;
      this.dictionaryBondCode = null;
      this.dictionaryNoticeLimitCode = null;
      this.dictionaryNoticeListCode = null;
      this.curr_name = '';
      this.noticeInfo = {};
      this.landSupplyshow = false;
      this.landSupplydata = {};
    },
    closeTrade () {
      this.tradedata = {};
      this.tradeshow = false;
    },
    confirmedit () {
      this.$refs.formData.submitForm();
    },
    openedit () {
      this.editshow = this.show;
      this.initId = this.id || (this.data && this.data.id);
      this.pageType = this.type || (this.data && this.data.type);
      this.curr_transManage = this.transManage || (this.data && this.data.transManage);
      this.curr_btnStatusData = this.btnStatusData || (this.data && this.data.btnStatusData);
      this.inputDisabled = (this.pageType === 'detail' || this.pageType === 'info' || this.pageType === 'infoTrans');
      this.edit = this.isEdit = ['add', 'edit'].includes(this.pageType);
      this.isAdd = ['add'].includes(this.pageType);
      this.layout[3].formItems[3].hide = this.edit;
      this.layout[3].formItems[2].width = this.edit ? 'calc((100% - 160px) / 2)' : '100%';
      this.layout[3].formItems[2].span = this.edit ? 24 : 12;
      this._getBusinessType();
      this._getTransactionType();
      this._selectListByCodeNoticeDetail();
      this._selectListByCodeListDetail();
      this._selectListByCodeApplyDetail();
      this._selectListByCodeBondDetail();
      this._selectListByCodeNoticeLimitDetail();
      this._selectListByCodeNoticeListDetail();
      this._getDictionaryListByConditions();
      selectListByParentCode('4635').then(res => {
          if (res.code === '200') {
            const contentOption = res.data.map(item => {
              return {
                name: item.name,
                id: item.code
              }
            });
            this.layout[0].formItems[6] = {
              ...this.layout[0].formItems[6],
              options: contentOption
            };
            this.formData.cantonId = contentOption[0].id;
          }
        })

      this.pageType === 'add'
        ? this._getInitTargetAttach({})
        : this._getTransTargetInfo();

      // if (this.pageType === 'info') {
      //   this.edit = false;
      // } else {
      //   this.edit = true;
      // }
      if (this.pageType === 'infoTrans') {
        this.edit = this.isEdit = false;
        this.inputDisabled = true;
        this.layout[3].title = '价款信息';
        this.layout[3].formItems[4].hide = this.layout[3].formItems[5].hide = true;
        this.layout[4].hide = false;
        this.ruleChangeTime.map(ruleTime => {
          this.rules[ruleTime][0].required = true;
        });
        if(this.curr_btnStatusData.isRestart === 1){
          this.isRestartEdit = true;
        }
        this.getNoticeDtlByTargetIdFn();
      }else if(this.pageType === 'info'){
        this.edit = false;
        this.isRestartEdit = false;
        this.layout[2].hide = this.layout[3].hide = true;
        console.log(this.layout)
        this.$forceUpdate();
      }else{
        this.edit = true;
        this.isRestartEdit = true;
        this.layout[3].title = '价款信息和时间信息';
        this.layout[3].formItems[4].hide = this.layout[3].formItems[5].hide = false;
        this.layout[4].hide = true;
        this.ruleChangeTime.map(ruleTime => {
          this.rules[ruleTime][0].required = false;
        });
      }
      this.$forceUpdate();
    },
    handleChangeTransType () {
      this.formData = {
        ...this.formData,
        beginListTime: '',
        endListTime: ''
      };
    },
    routeTo (configType, param = {}) {
      this.tradedata = { configType, ...param };
      this.tradeshow = true;
    },
    // 查询未绑定交易物的数据
    onSearch (val) {
      this.selectBindList = [];
      this._getunBindList();
    },
    resetSearch () {
      this.dialog.searchVal.no = '';
      this.dialog.searchVal.cantonId = '';
    },
    // 弹窗打开后获取未绑定交易物的数据
    openBind () {
      // this.selectBindList = [];
      // this.formData.goodsIds = [];
      this._selectListByParentCode();
      this._getunBindList();
    },
    // 弹窗确定
    bindConfirm () {
      this.Options.tableData = this.selectBindList;
      this.cancelDialog();
    },
    cancelDialog () {
      this.dialog.show = false;
      if (this.$refs.multipleTable && this.$refs.multipleTable) {
        this.$refs.multipleTable.getPageTable();
      }
    },
    // 区域列表
    _selectListByParentCode () {
      selectListByParentCode('4635').then(res => {
        if (res.code === '200') {
          this.dialog.cantonList = res.data;
        }
      });
      this.$forceUpdate();
    },
    // 获取未绑定标的交易物
    _getunBindList () {
      const param = {
        data: this.dialog.searchVal,
        pageNo: this.dialog.page.current,
        pageSize: this.dialog.page.pageSize
      };
      getunBindList(param)
        .then(res => {
          const { data, total } = res.data;
          this.dialog.page.total = total;
          this.dialog.tableData = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 未绑定标的交易物数据选择
    bindSelection (val) {
      this.selectBindList = val;
    },
    // 未绑定标的交易物数据选择翻页记忆
    getRowKey (row) {
      return row.id;
    },
    rowdel (index) {
      this.Options.tableData.splice(index, 1);
    },
    // 未绑定标的交易物当前页码
    onCurrentChange (val) {
      this.dialog.page.current = val;
      this._getunBindList();
    },
    onPageSizeChange (val) {
      this.dialog.page.pageSize = val;
      this.onCurrentChange(1);
    },
    // 确定数据
    submitForm (val) {
      let vm = this;
      this.isUpdateDate = false;
      this.isDate.beginNoticeDate = false;
      this.isDate.endNoticeDate = false;
        this.isUpdateDate = true;
        this.isDate.beginNoticeDate = true;
        this.isDate.endNoticeDate = true;
        this.formData = {
          ...this.formData,
          ...val
        };
        const formData = {
          goods: {
            ...this.goods,
            no: this.formData.no,
            address: this.formData.address,
            buildArea: this.formData.buildArea,
            buildAreaCount: this.formData.buildAreaCount,
            goodsUse: this.formData.goodsUse,
            useYears: this.formData.useYears,
            plot: this.formData.plot,
            buildDensity: this.formData.buildDensity,
            buildHeight: this.formData.buildHeight,
            greenRatio: this.formData.greenRatio,
            aggregateInvestment: this.formData.aggregateInvestment,
            projectTerm: this.formData.projectTerm,
            property: this.formData.property,
            owner: this.formData.owner,
            submitTime: this.formData.submitTime,
            startTime: this.formData.startTime,
            endTime: this.formData.endTime,
            period: this.formData.period,
            tdxztj: this.formData.tdxztj,
            remark: this.formData.remark,
            cantonId: this.formData.cantonId,
            greenHRatio: this.formData.greenHRatio,
            operateFlag: this.pageType,
            id: this.pageType === 'edit' ? this.goods.id : null,
          },
          target: {
            ...this.target,
            allowUnion: this.formData.allowUnion,
            allowLive: this.formData.allowLive,
            earnestMoney: this.formData.earnestMoney,  
            beginListTime: this.formData.beginListTime,  
            endListTime: this.formData.endListTime,  
            beginPrice: this.formData.beginPrice,
            hasReservePrice: this.formData.hasReservePrice,
            reservePrice: +this.formData.reservePrice,
            goodsIds: this.formData.goodsIds,  
            priceStep: this.formData.priceStep,  
            isAfterCheck: this.formData.isAfterCheck, 
            requireBidderNum: this.formData.requireBidderNum,  
            businessType: this.formData.businessType,  
            transType: this.formData.transType, 
            id: this.pageType === 'edit' ? this.target.id : this.initId,
            operateFlag: this.pageType
          },
          trust: {},
        };
        applyTrust(formData)
          .then(res => {
            if (res.code === '200') {
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success',
                position: 'bottom-right'
              });
              vm.$emit('success', res);
              this.$refs.formData.cancelForm();
            }
          })
          .catch(err => {
            console.log(err);
          });
    },
    _getDictionaryListByConditions() {
      const paremsData = {
        "data": {
            "code": "LAND_USAGE"
        },
        "pageNo": "1",
        "pageSize": "999"
      };
      if (this.layout[0].formItems[4].options.length !== 0) {
          this.formData.goodsUse = this.formData.goodsUse ? this.formData.goodsUse : this.layout[0].formItems[4].options[0].id;
        return
      };
      getDictionaryListByConditions(paremsData).then(res => {
        if (res.code === '200') {
          const goodsUseOptions = res.data.data.map(data => {
            return {
              id: data.code,
              name: data.name
            }
          });
          this.layout[0].formItems[4].options = goodsUseOptions;
          this.formData.goodsUse = this.formData.goodsUse ? this.formData.goodsUse : goodsUseOptions[0].id;
          this.$forceUpdate();
        }
      })
    },
    // 获取交易类型下拉框数据
    _getBusinessType () {
      getBusinessType().then(res => {
        if (res.code === '200') {
          this.layout[2].formItems[0].options = res.data;
          // this.formData.businessType = res.data[0].id;
          this.$forceUpdate();
        }
      });
      this.$forceUpdate();
    },
    // 获取交易方式下拉框数据
    _getTransactionType () {
      getTransactionType().then(res => {
        if (res.code === '200') {
          this.layout[2].formItems[1].options = res.data.map(data => {
            return {
              name: data.value,
              id: data.key
            }
          });
          this.formData.transType = this.formData.transType ? this.formData.transType : this.layout[2].formItems[1].options[0].id;
          // this.$forceUpdate();
        }
      });
      this.$forceUpdate();
    },
    // 新增时初始化标的附件信息，获取id
    _getInitTargetAttach (data) {
      this.initId = null;
      initTargetAttach(data).then(res => {
          this.initId = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取标的详情
    _getTransTargetInfo () {
      let id = this.initId;
      detail(id)
        .then(res => {
          if (res.code === '200') {
            this.goods = res.data.goods;
            this.target = {
              ...res.data.target,
              hasReservePrice: (res.data.target.hasReservePrice !== undefined && res.data.target.hasReservePrice !== null) ? res.data.target.hasReservePrice : 1,
              allowUnion: res.data.target.allowUnion ? res.data.target.allowUnion : 0,
              allowLive: res.data.target.allowLive ? res.data.target.allowLive : 1,
              requireBidderNum: res.data.target.requireBidderNum ? res.data.target.requireBidderNum : 1
            };
            this.trust = res.data.trust;
            this.formData = {
              ...this.formData,
              ...this.goods,
              ...this.target,
              // ...this.trust
            };
            
            // this.Options.tableData = this.transGoodsDtos;
            this.curr_name = this.target.name;
            // this.handleTransType(this.formData.transType)
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //查询公告详情
    getNoticeDtlByTargetIdFn() {
      let id = this.initId;
      getNoticeDtlByTargetId(id)
        .then(res => {
          if (res.code === '200') {
            this.noticeInfo = {
              id: res.data.id,
              no: res.data.no,
              name: res.data.name,
              noticeDate: res.data.noticeDate
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    closeEdit (type) {
      this.noticeInfo = {};
      this.landSupplyshow = false;
      this.landSupplydata = {};
      this.canceledit();
    },
    changeForm (val) {
      if (val.businessType !== this.formData.businessType) {
        this._getInitTargetAttach({businessType: val.businessType, targetId: this.initId});
        this.formData = {
          ...this.formData,
          ...val
        };
      }
      if (val.transType !== this.formData.transType) {
        this.formData = {
          ...this.formData,
          ...val,
          beginListTime: '',
          endListTime: ''
        };
      }
      this.formData = {
        ...this.formData,
        ...val
      }
      if (this.formData.buildArea !== this.mathFormData.area) {
        this.mathFormData.area = this.formData.buildArea;
      }
    },
    //暂停交易
    onTargetSuspend() {
      let vm = this;
      let id = this.initId;
      this.$confirm("确定暂停交易吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
        }).then(() => {
          getTargetSuspend({targetIds: [id]}).then(res => {
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
                vm.$emit('success','200');
                this.landSupplydata = { configType:'add', row: this.noticeInfo };
                this.landSupplyshow = true;
              }).catch(() => {
                vm.$emit('cancel');
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
      let id = this.initId;
      this.$confirm("确定终止交易吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        getTargetStop({targetIds: [id]}).then(res => {
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
              vm.$emit('success','200');
              this.landSupplydata = { configType:'add', row: this.noticeInfo };
              this.landSupplyshow = true;
            }).catch(() => {
              vm.$emit('cancel');
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
    //重启交易
    onRestartTrade(val) {
      let vm = this;
      this.isUpdateDate = false;
      this.isDate.beginNoticeDate = false;
      this.isDate.endNoticeDate = false;
      this.isUpdateDate = true;
      this.isDate.beginNoticeDate = true;
      this.isDate.endNoticeDate = true;
      const param = {
        command: {
          beginApplyTime: this.formData.beginApplyTime,
          beginEarnestTime: this.formData.beginEarnestTime,
          // beginFocusTime: (!this.formData.beginFocusTime ? '' : this.formData.beginFocusTime),
          beginFocusTime: (!this.formData.beginListTime ? '' : this.formData.beginListTime),
          beginLimitTime: this.formData.beginLimitTime,
          beginListTime: (!this.formData.beginListTime ? '' : this.formData.beginListTime),
          beginNoticeTime: this.formData.beginNoticeTime,
          endApplyTime: this.formData.endApplyTime,
          endEarnestTime: this.formData.endEarnestTime,
          // endFocusTime: (!this.formData.endFocusTime ? '' : this.formData.endFocusTime),
          endFocusTime: (!this.formData.endListTime ? '' : this.formData.endListTime),
          endListTime: (!this.formData.endListTime ? '' : this.formData.endListTime),
          endNoticeTime: this.formData.endNoticeTime,
          // licenseId: this.formData.licenseId,
          targetId: this.initId
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
                vm.$emit('success','200');
                this.landSupplydata = { configType:'add', row: this.noticeInfo };
                this.landSupplyshow = true;
              }).catch(() => {
                vm.$emit('cancel');
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
    handleChangeTime(val, type) {
      this.formData = {
        ...this.formData,
        [type]: !!val && moment(val).format("yyyy[年]MM[月]DD[日] HH[时]mm[分]ss[秒]")
      };
      setTimeout(() => {
        this.formData[type] = moment(val).format("yyyy[年]MM[月]DD[日] HH[时]mm[分]ss[秒]");
      }, 3000)
      this.$forceUpdate();
    },
    submitMathForm () {

    },
    changeMathForm (val) {
      this.mathFormData = {
        ...this.mathFormData,
        ...val
      }
    },
    mathConfirmedit () {
      this.formData.buildAreaCount = this.mathLayout[0].formItems[2].valueNumber;
      this.mathCanceledit();
      this.$forceUpdate();
    },
    mathCanceledit () {
      this.mathDditshow = false;
      this.mathFormData = {
        area: '',
        plotRatio: '',
        result: ''
      };
    },
    mathOpenedit () {

    }
  }
};
</script>

<style lang="less" scoped>
.btnInfo {
  .resetBtn {
    margin-right: 20px;
    &:hover, &:focus, &:active{
      background-color: #fff;
    }
  }
  .submitBtn {
    background: rgba(37, 115, 241, 1);
    margin-right: 10px;
  }
}
#edits {
  // background: #e6e6e6 !important;
  .content-bd {
    // padding-bottom: 130px;
  }
  /deep/.endEarnestTimeMain{
    .el-input{
      width: 42% !important;
    }
  }
  .el-tabs__content {
    padding: 0;
  }
  .box-card {
    background: rgba(255, 255, 255, 1);
    border: none;
    box-shadow: none;
    margin-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
    border-radius: 0;
    &:first-child {
      margin-bottom: 0;
    }
    /deep/.el-form-item {
      margin-bottom: 24px;
    }
    /deep/.el-date-editor.el-input {
      width: 100%;
    }
    /deep/.el-card__header {
      padding: 13px 26px;
      .clearfix {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        > span {
          font-size: 18px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(63, 63, 63, 1);
          line-height: 25px;
          display: flex;
          flex-direction: row;
          align-items: center;
          em {
            width: 4px;
            height: 19px;
            background: rgba(37, 115, 241, 1);
            margin-right: 8px;
          }
        }
      }
    }
    /deep/.el-card__body {
      padding: 26px;
      .help {
        font-size: 20px;
      }
    }
  }
  .el-button--default {
    border: 1px solid #409eff;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
  .comp-wrapper {
    // margin-bottom: 20px;
  }
  /deep/ .el-form-item {
    margin-bottom: 12px;
  }
  /deep/.el-input-number{
    width: 100%;
    display: block;
    line-height: 33px;
    height: 35px;
    >span{
      height: 17.5px;
    }
    .el-input{
      input{
        text-align: left;
      }
    }
  }
  /deep/.earnestMoney{
    .el-input-number{
      // width: 43% !important;
    }
  }
}
.box {
  // padding: 20px !important;
  width: 100%;
  height: 100%;
  // background: #e6e6e6 !important;
  .el-table__fixed-body-wrapper,
  .el-table__fixed-header-wrapper {
    z-index: 0;
  }
}
.upload-button {
  margin: 12px 30px;
  width: 64px;
  height: 28px;
  background: rgba(219, 233, 255, 1);
  color: #065bdc;
  font-size: 14px;
  cursor: pointer;
}
.inb {
  display: inline-block;
  vertical-align: middle;
}
.va-m {
  vertical-align: -webkit-baseline-middle;
}
.bottom-btn{
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

</style>
