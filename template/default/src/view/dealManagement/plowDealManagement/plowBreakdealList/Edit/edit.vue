<template>
  <dialog-content
    @on-confirm="confirmedit"
    @on-close="canceledit"
    @on-open="openedit"
    :title="type==='add'?'新增标的':(type==='edit'?'编辑标的':'标的详情')"
    
    :visible.sync="editshow"
    ref="dialog"
    :dialogModel="dialogModel"
    :confirmShow="edit"
    :cancelShow="edit"
  >
    <div id="edits">
      <div class="content-bd">
        <el-form ref="formData" :rules="rules" :model="formData" label-width="151px" status-icon>
          <wrapper title="交易基本情况">
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="交易类型：" prop="businessType">
                  <el-select
                    :disabled="edit ? false : true"
                    v-model="formData.businessType"
                    placeholder="请选择交易类型"
                  >
                    <el-option
                      v-for="item in Options.businessType"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="交易方式：" prop="transType">
                  <el-select
                    :disabled="edit ? false : true"
                    v-model="formData.transType"
                    placeholder="请选择交易方式"
                  >
                    <el-option
                      v-for="item in Options.transType"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="允许联合竞买：" prop="allowUnion">
                  <el-radio-group
                    class="va-m"
                    v-model="formData.allowUnion"
                    :disabled="edit ? false : true"
                  >
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-row :gutter="5">
                  <el-col :span="12">
                    <el-form-item label="必须申请人数：" prop="requireBidderNum">
                      <el-input
                        type="number"
                        :min="1"
                        :max="999"
                        :disabled="edit ? false : true"
                        v-model="formData.requireBidderNum"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="必须出价人数：" prop="requirePriceNum">
                      <el-input
                        type="number"
                        :min="1"
                        :max="999"
                        :disabled="edit ? false : true"
                        v-model="formData.requirePriceNum"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="资格审核：" prop="isAfterCheck">
                  <el-radio-group
                    class="va-m"
                    v-model="formData.isAfterCheck"
                    :disabled="edit ? false : true"
                  >
                    <el-radio :label="1">交易前审核</el-radio>
                    <el-radio :label="0">交易后审核</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="网上交易直播：" prop="allowLive">
                  <el-radio-group
                    class="va-m"
                    v-model="formData.allowLive"
                    :disabled="edit ? false : true"
                  >
                    <el-radio :label="1">允许</el-radio>
                    <el-radio :label="0">禁止</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </wrapper>
          <wrapper title="价款信息">
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="起始价：" prop="beginPrice">
                  <el-input
                    type="number"
                    :min="1"
                    :disabled="edit ? false : true"
                    v-model="formData.beginPrice"
                    placeholder="请输入起始价"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="加价幅度：" prop="priceStep">
                  <el-input
                    type="number"
                    :min="1"
                    :disabled="edit ? false : true"
                    v-model="formData.priceStep"
                    placeholder="请输入加价幅度"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="保证金：" prop="earnestMoney">
                  <el-input
                    type="number"
                    :min="1"
                    :disabled="edit ? false : true"
                    v-model="formData.earnestMoney"
                    placeholder="请输入保证金"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </wrapper>
          <wrapper title="其他要求">
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="公告开始时间：" prop="beginNoticeTime">
                  <el-date-picker
                    v-model="formData.beginNoticeTime"
                    type="datetime"
                    :disabled="isRestartEdit ? false : true"
                    placeholder="公告开始时间"
                    format="yyyy年MM月dd日 HH时mm分ss秒"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公告结束时间：" prop="endNoticeTime">
                  <el-date-picker
                    v-model="formData.endNoticeTime"
                    type="datetime"
                    :disabled="isRestartEdit ? false : true"
                    placeholder="公告结束时间"
                    format="yyyy年MM月dd日 HH时mm分ss秒"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="竞买申请开始时间：" prop="beginApplyTime">
                  <el-date-picker
                    v-model="formData.beginApplyTime"
                    type="datetime"
                    :disabled="isRestartEdit ? false : true"
                    placeholder="竞买申请开始时间"
                    format="yyyy年MM月dd日 HH时mm分ss秒"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="竞买申请结束时间：" prop="endApplyTime">
                  <el-date-picker
                    v-model="formData.endApplyTime"
                    type="datetime"
                    :disabled="isRestartEdit ? false : true"
                    placeholder="竞买申请结束时间"
                    format="yyyy年MM月dd日 HH时mm分ss秒"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="保证金缴纳开始时间：" prop="beginEarnestTime">
                  <el-date-picker
                    v-model="formData.beginEarnestTime"
                    type="datetime"
                    :disabled="isRestartEdit ? false : true"
                    placeholder="保证金缴纳开始时间"
                    format="yyyy年MM月dd日 HH时mm分ss秒"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保证金缴纳截至时间：" prop="endEarnestTime">
                  <el-date-picker
                    v-model="formData.endEarnestTime"
                    type="datetime"
                    :disabled="isRestartEdit ? false : true"
                    placeholder="保证金缴纳截至时间"
                    format="yyyy年MM月dd日 HH时mm分ss秒"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row> 
            <el-row
              :gutter="5"
              v-if="(formData.transType!='102')&&(formData.transType!='网上交易（拍卖）')"
            >
              <el-col :span="12">
                <el-form-item label="挂牌开始时间：" prop="beginListTime">
                  <el-date-picker
                    v-model="formData.beginListTime"
                    type="datetime"
                    :disabled="isRestartEdit ? false : true"
                    placeholder="挂牌开始时间"
                    format="yyyy年MM月dd日 HH时mm分ss秒"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="挂牌结束时间：" prop="endListTime">
                  <el-date-picker
                    v-model="formData.endListTime"
                    type="datetime"
                    :disabled="isRestartEdit ? false : true"
                    placeholder="挂牌结束时间"
                    format="yyyy年MM月dd日 HH时mm分ss秒"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              :gutter="5"
              v-if="(formData.transType!='102')&&(formData.transType!='网上交易（拍卖）')"
            >
              <el-col :span="12">
                <el-form-item label="自由报价开始时间：" prop="beginFocusTime">
                  <el-date-picker
                    v-model="formData.beginFocusTime"
                    type="datetime"
                    :disabled="isRestartEdit ? false : true"
                    placeholder="自由报价开始时间"
                    format="yyyy年MM月dd日 HH时mm分ss秒"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="自由报价结束时间：" prop="endFocusTime">
                  <el-date-picker
                    v-model="formData.endFocusTime"
                    type="datetime"
                    :disabled="isRestartEdit ? false : true"
                    placeholder="自由报价结束时间"
                    format="yyyy年MM月dd日 HH时mm分ss秒"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="限时竞价开始时间：" prop="beginLimitTime">
                  <el-date-picker
                    v-model="formData.beginLimitTime"
                    type="datetime"
                    :disabled="isRestartEdit ? false : true"
                    placeholder="限时竞价开始时间"
                    format="yyyy年MM月dd日 HH时mm分ss秒"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="24">
                <el-form-item label="绑定的交易物信息：" prop="goodsIds">
                  <el-table :data="Options.tableData" stripe style="width: 100%" size="mini">
                    <el-table-column prop="no" label="宗地编号"></el-table-column>
                    <el-table-column prop="cantonName" label="行政区域"></el-table-column>
                    <el-table-column prop="goodsType" label="交易物类型"></el-table-column>
                    <el-table-column prop="goodsUse" label="用途"></el-table-column>
                    <el-table-column label="操作" v-if="edit">
                      <template slot-scope="scope">
                        <el-button
                          @click="rowdel(scope.$index)"
                          type="text"
                          size="mini"
                          :disabled="edit ? false : true"
                          v-if="edit"
                        >删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="margin-top:10px">
                    <el-button
                      size="mini"
                      type="primary"
                      :disabled="edit ? false : true"
                      v-if="edit"
                      @click="dialog.show=true"
                    >绑定地块</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </wrapper>
          <Attach :initId="initId" :edit="edit" />
          <!-- <div class="btnInfo text-center mt-10" :style="{display: edit ? 'flex' : 'none',zIndex:99}">
          <el-button class="resetBtn" size="small" @click="$_resetForm">取消</el-button>
          <el-button
            size="small"
            type="primary"
            class="submitBtn"
            @click="submitForm(1)"
            :disabled="$_loading"
          >确定</el-button>
          </div>-->
        </el-form>
      </div>

      <dialog-content
        @on-cancel="dialog.show=false"
        @on-confirm="bindConfirm"
        @on-open="openBind"
        title="待绑定交易物"
        width="900px"
        :visible.sync="dialog.show"
        ref="dialog"
        append-to-body
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
            <el-button size="small" type="primary" class="submitBtn" @click="onSearch">查询</el-button>
            <el-button class="resetBtn" size="small" @click="resetSearch">重置</el-button>
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
    <div class="bottom-btn">
      <el-button class="submitBtn" type="primary" v-if="curr_transManage === 'transManage' && curr_btnStatusData.canSuspend === 1" size="small" @click="onTargetSuspend">暂停交易</el-button>
      <el-button class="submitBtn" type="primary" v-if="curr_transManage === 'transManage' && curr_btnStatusData.canStop === 1" size="small" @click="onTargetStop">终止交易</el-button>
      <el-button class="submitBtn" type="primary" v-if="curr_transManage === 'transManage' && curr_btnStatusData.canRestart === 1" size="small" @click="onRestartTrade">重启交易</el-button>
    </div>
  </dialog-content>
</template>
<script>
import Flex from '@/components/flex';
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import Attach from './Attach';
import dialogContent from '@/components/dialog';
import {
  getTargetStatus,
  getInitTargetAttach,//查看不需要
  getTransTargetInfo,
  getunBindList,
  // saveTransTarget
} from '@/api/dealManagement/plowDealManagement/plowBreakdealList';
import {
  getTransactionType,
  getBusinessType
} from '@/api/dealManagement/plowDealManagement/common';

import {
  getTargetSuspend,
  getTargetStop,
  getRestartTrade
  // saveTransTarget
} from '@/api/dealManagement/breakdealList';
import { selectListByParentCode } from '@/api/common';
export default {
  components: {
    Wrapper,
    PageTable,
    Flex,
    Attach,
    dialogContent
  },
  props: {
    id: '',
    type: '',
    show: '',
    dialogModel: true,
    data: '',
    btnStatusData:{},
    transManage:''
  },
  data () {
    return {
      formData: {
        allowUnion: '', // 是否允许联合竞买 ,
        allowLive: '', // 是否允许网上直播 ,
        beginApplyTime: '', //  竞买申请开始时间 ,
        endApplyTime: '', //  竞买申请结束时间 ,
        beginEarnestTime: '', //  保证金开始时间 ,
        endEarnestTime: '', //  保证金结束时间 ,
        earnestMoney: '', //  保证金金额 ,
        beginFocusTime: '', //  集中报价开始时间 ,
        endFocusTime: '', //  集中报价结束时间 ,
        beginListTime: '', //  挂牌开始时间 ,
        endListTime: '', //  挂牌结束时间 ,
        beginNoticeTime: '', //  公告开始时间 ,
        endNoticeTime: '', // 公告结束时间 ,
        beginPrice: '', //  起始价 ,
        goodsIds: [], // 绑定的交易物标识 ,
        id: '', // 主键，该值不为空时进行修改操作 ,
        priceStep: '', //  增价幅度 ,
        isAfterCheck: '', // 交易后审核
        requireBidderNum: '', // 必须参与竞买人数 ,
        requirePriceNum: '', // 必须参与出价人数 ,
        businessType: '', //  交易类型 ,
        transType: '', // 交易方式
        beginLimitTime: '', // 竞价开始时间
        operateFlag: '' // 操作类型(edit:编辑,add:添加)
      },
      rules: {
        businessType: [
          { required: true, message: '请选择交易类型', trigger: 'change' }
        ],
        allowLive: [
          { required: true, message: '请选择是否网上直播', trigger: 'change' }
        ],
        transType: [
          { required: true, message: '请选择交易方式', trigger: 'change' }
        ],
        allowUnion: [
          { required: true, message: '请选择竞买方式', trigger: 'change' }
        ],
        requireBidderNum: [
          { required: true, message: '请填写申请人数', trigger: 'change' }
        ],
        requirePriceNum: [
          { required: true, message: '请输入出价人数', trigger: 'change' }
        ],
        earnestMoney: [
          { required: true, message: '请输入保证金金额', trigger: ['blur', 'change'] }
        ],
        beginEarnestTime: [
          { required: true, message: '请选择保证金开始时间', trigger: 'blur' }
        ],
        endEarnestTime: [
          { required: true, message: '请选择保证金结束时间', trigger: 'blur' }
        ],
        beginApplyTime: [
          { required: true, message: '请选择竞买申请开始时间', trigger: 'blur' }
        ],
        endApplyTime: [
          { required: true, message: '请选择竞买申请结束时间', trigger: 'blur' }
        ],
        beginNoticeTime: [
          { required: true, message: '请选择公告开始时间', trigger: 'blur' }
        ],
        endNoticeTime: [
          { required: true, message: '请选择公告结束时间', trigger: 'blur' }
        ],
        beginPrice: [
          { required: true, message: '请输入起始价', trigger: ['blur', 'change'] }
        ],
        priceStep: [
          { required: true, message: '请输入加价幅度', trigger: ['blur', 'change'] }
        ],
        beginLimitTime: [
          { required: true, message: '请选择竞价开始时间', trigger: 'blur' }
        ],
        isAfterCheck: [
          { required: true, message: '请选择资格审核', trigger: 'change' }
        ],
        beginListTime: [
          { required: true, message: '请选择挂牌开始时间', trigger: 'blur' }
        ],
        endListTime: [
          { required: true, message: '请选择挂牌结束时间', trigger: 'blur' }
        ],
        beginFocusTime: [
          { required: true, message: '请选择自由报价开始时间', trigger: 'blur' }
        ],
        endFocusTime: [
          { required: true, message: '请选择自由报价结束时间', trigger: 'blur' }
        ],
        goodsIds: [
          { required: true, message: '请选择绑定的交易物信息', trigger: 'change' }
        ]
      },
      // formData.transType !== "102" &&
      // formData.transType !== "网上交易（拍卖）"
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
      isRestartEdit: false,
      pageType: '',
      initId: '',
      selectBindList: [],
      infoData: {},
      curr_transManage:'',
      curr_btnStatusData:{}
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
        if (newval.type === 'info') {
          this.edit = false;
        }
        if (newval.type === 'infoTrans') {
          this.edit = false;
          if(this.curr_btnStatusData.isRestart === 1){
            this.isRestartEdit = true;
          }
        }
        if (!this.dialogModel) {
          this.openedit()
        }
      }
    },
    show (val) {
      this.editshow = val;
      this.initId = this.id;
      this.pageType = this.type;
      this.curr_transManage = this.transManage;
      this.curr_btnStatusData = this.btnStatusData;
      if (this.type === 'info') {
        this.edit = false;
      }
    },
    Options: {
      handler (newValue, oldValue) {
        if (newValue.tableData.length !== 0) {
          this.formData.goodsIds = newValue.tableData.map(item => item.id);
        }
      },
      deep: true
    }
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
  methods: {
    canceledit () {
      if (this.$refs.multipleTable && this.$refs.multipleTable) {
        this.$refs.multipleTable.getPageTable();
      }
      this.editshow = false;
      this.$emit('cancel');
      this.Options = {
        businessType: [], // 交易类型
        transType: [], // 交易方式
        tableData: []
      };
      this.formData = {
        allowUnion: '', // 是否允许联合竞买 ,
        allowLive: '', // 是否允许网上直播 ,
        beginApplyTime: '', //  竞买申请开始时间 ,
        endApplyTime: '', //  竞买申请结束时间 ,
        beginEarnestTime: '', //  保证金开始时间 ,
        endEarnestTime: '', //  保证金结束时间 ,
        earnestMoney: '', //  保证金金额 ,
        beginFocusTime: '', //  集中报价开始时间 ,
        endFocusTime: '', //  集中报价结束时间 ,
        beginListTime: '', //  挂牌开始时间 ,
        endListTime: '', //  挂牌结束时间 ,
        beginNoticeTime: '', //  公告开始时间 ,
        endNoticeTime: '', // 公告结束时间 ,
        beginPrice: '', //  起始价 ,
        goodsIds: [], // 绑定的交易物标识 ,
        id: '', // 主键，该值不为空时进行修改操作 ,
        priceStep: '', //  增价幅度 ,
        isAfterCheck: '', // 交易后审核
        requireBidderNum: '', // 必须参与竞买人数 ,
        requirePriceNum: '', // 必须参与出价人数 ,
        businessType: '', //  交易类型 ,
        transType: '', // 交易方式
        beginLimitTime: '', // 竞价开始时间
        operateFlag: '' // 操作类型(edit:编辑,add:添加)
      };
      this.dialog.show = false;
      this.dialog.tableData = [];
      this.edit = true;
      this.editshow = false;
      this.pageType = '';
      this.initId = '';
      this.curr_transManage = '';
      this.curr_btnStatusData = '';
      this.selectBindList = [];
      this.$_resetForm();
    },
    confirmedit () {
      this.submitForm();
    },
    openedit () {
      this.editshow = this.show;
      this.initId = this.id || (this.data && this.data.id);
      this.pageType = this.type || (this.data && this.data.type);
      this.curr_transManage = this.transManage || (this.data && this.data.transManage);
      this.curr_btnStatusData = this.btnStatusData || (this.data && this.data.btnStatusData);
      this._getBusinessType();
      this._getTransactionType();
      this.pageType === 'add'
        ? this._getInitTargetAttach()
        : this._getTransTargetInfo();

      if (this.pageType === 'info') {
        this.edit = false;
      } else {
        this.edit = true;
      }
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
      this.dialog.show = false;
      this.Options.tableData = this.selectBindList;
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
    
    // 获取交易类型下拉框数据
    _getBusinessType () {
      this.Options.businessType = [];
      getBusinessType().then(res => {
        if (res.code === '200') {
          this.Options.businessType = res.data;
        }
      });
      this.$forceUpdate();
    },
    // 获取交易方式下拉框数据
    _getTransactionType () {
      this.Options.transType = [];
      getTransactionType().then(res => {
        if (res.code === '200') {
          this.Options.transType = res.data;
        }
      });
      this.$forceUpdate();
    },
    // 新增时初始化标的附件信息，获取id
    _getInitTargetAttach () {
      getInitTargetAttach()
        .then(res => {
          this.initId = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取标的详情
    _getTransTargetInfo () {
      let id = this.initId;
      getTransTargetInfo(id)
        .then(res => {
          if (res.code === '200') {
            this.formData = res.data;
            this.formData = {
              allowLive: res.data.allowLive,
              allowUnion: res.data.allowUnion,
              beginApplyTime: res.data.beginApplyTime,
              endApplyTime: res.data.endApplyTime,
              beginEarnestTime: res.data.beginEarnestTime,
              endEarnestTime: res.data.endEarnestTime,
              earnestMoney: res.data.earnestMoney,
              // beginFocusTime: res.data.beginFocusTime,
              beginFocusTime: res.data.beginListTime,
              // endFocusTime: res.data.endFocusTime,
              endFocusTime: res.data.endListTime,
              beginListTime: res.data.beginListTime,
              endListTime: res.data.endListTime,
              beginNoticeTime: res.data.beginNoticeTime,
              endNoticeTime: res.data.endNoticeTime,
              beginPrice: res.data.beginPrice,
              goodsIds: res.data.goodsIds,
              id: res.data.id,
              priceStep: res.data.priceStep,
              isAfterCheck: res.data.isAfterCheck,
              requireBidderNum: res.data.requireBidderNum,
              requirePriceNum: res.data.requirePriceNum,
              businessType: res.data.businessType,
              transType: res.data.transType,
              beginLimitTime: res.data.beginLimitTime,
              operateFlag: res.data.operateFlag
            };
            this.Options.tableData = res.data.transGoodsDtos;
            // this.handleTransType(this.formData.transType)
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //暂停交易
    onTargetSuspend() {
      let id = this.initId;
      getTargetSuspend({targetIds: [id]}).then(res => {
        if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              position: 'bottom-right'
            });
          } else {
            this.$notify.error({
              title: '失败',
              message: res.message,
              position: 'bottom-right'
            });
          }
      });
      this.$forceUpdate();
    },
    //终止交易
    onTargetStop() {
      let id = this.initId;
      getTargetStop({targetIds:[id]}).then(res => {
        if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              position: 'bottom-right'
            });
          } else {
            this.$notify.error({
              title: '失败',
              message: res.message,
              position: 'bottom-right'
            });
          }
      });
      this.$forceUpdate();
    },
    //重启交易
    onRestartTrade() {
      const param = {
        command: {
          beginApplyTime: this.formData.beginApplyTime,
          beginEarnestTime: this.formData.beginEarnestTime,
          // beginFocusTime: this.formData.beginFocusTime,
          beginFocusTime: this.formData.beginListTime,
          beginLimitTime: this.formData.beginLimitTime,
          beginListTime: this.formData.beginListTime,
          beginNoticeTime: this.formData.beginNoticeTime,
          endApplyTime: this.formData.endApplyTime,
          endEarnestTime: this.formData.endEarnestTime,
          // endFocusTime: this.formData.endFocusTime,
          endFocusTime: this.formData.endListTime,
          endListTime: this.formData.endListTime,
          endNoticeTime: this.formData.endNoticeTime,
          // licenseId: '',
          targetId: this.initId
      }
      getRestartTrade(param).then(res => {
        if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              position: 'bottom-right'
            });
          } else {
            this.$notify.error({
              title: '失败',
              message: res.message,
              position: 'bottom-right'
            });
          }
      });
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="less" scoped>
#edits {
  // background: #e6e6e6 !important;
  .content-bd {
    // padding-bottom: 130px;
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
  .btnInfo {
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
    button {
      width: 88px;
      height: 40px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
    .resetBtn {
      border: 1px solid rgba(37, 115, 241, 1);
      margin-right: 10px;
    }
    .submitBtn {
      background: rgba(37, 115, 241, 1);
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
    margin-bottom: 20px;
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
