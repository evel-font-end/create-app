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
      :confirmShow="edit"
      :cancelShow="edit"
      :bottomShow="edit || (curr_transManage === 'transManage' && (curr_btnStatusData.isSuspend || curr_btnStatusData.isStop || curr_btnStatusData.isRestart))"
      appendToBody
    >
      <div id="edits">
        <div class="content-bd">
          <el-form ref="formData" :rules="rules" :model="formData" label-width="160px" status-icon>
            <wrapper title="交易基本情况">
              <el-row :gutter="5">
                <el-col :span="12">
                  <el-form-item label="交易类型：" prop="businessType">
                    <el-select
                      :disabled="edit ? false : true"
                      v-model="formData.businessType"
                      placeholder="请选择交易类型"
                      filterable
                      allow-create
                      default-first-option
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
                      @change="handleChangeTransType"
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
                  <el-form-item label="必须申请人数：" prop="requireBidderNum">
                    <el-input-number
                      controls-position="right"
                      :min="1"
                      :max="999"
                      :disabled="edit ? false : true"
                      v-model="formData.requireBidderNum"
                    ></el-input-number>
                  </el-form-item>
                    <!-- <el-col :span="12">
                      <el-form-item label="必须出价人数：" prop="requirePriceNum">
                        <el-input
                          type="number"
                          :min="1"
                          :max="999"
                          :disabled="edit ? false : true"
                          v-model="formData.requirePriceNum"
                        ></el-input>
                      </el-form-item>
                    </el-col> -->
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
                  <el-form-item label="起始价(万元)：" prop="beginPrice">
                    <el-input-number
                      controls-position="right"
                      type="number"
                      :precision="2"
                      :step="0.1"
                      :disabled="edit ? false : true"
                      v-model="formData.beginPrice"
                      placeholder="0.00"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="加价幅度(万元)：" prop="priceStep">
                    <el-input-number
                      controls-position="right"
                      type="number"
                      :precision="2"
                      :step="0.1"
                      :disabled="edit ? false : true"
                      v-model="formData.priceStep"
                      placeholder="0.00"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <el-form-item label="保证金(万元)：" prop="earnestMoney">
                    <el-input-number
                      controls-position="right"
                      type="number"
                      :precision="2"
                      :step="0.1"
                      :disabled="edit ? false : true"
                      v-model="formData.earnestMoney"
                      placeholder="0.00"
                    ></el-input-number>
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
                <el-col :span="12" v-if="false">
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
                  <el-form-item label="保证金缴纳截止时间：" prop="endEarnestTime">
                    <el-date-picker
                      v-model="formData.endEarnestTime"
                      type="datetime"
                      :disabled="isRestartEdit ? false : true"
                      placeholder="保证金缴纳截止时间"
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
                v-if="false && (formData.transType!='102')&&(formData.transType!='网上交易（拍卖）')"
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
              <el-row
                :gutter="5"
                v-if="(formData.transType!='101')&&(formData.transType!='网上交易（挂牌）')"
              >
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
                      <el-table-column label="宗地编号">
                        <template slot-scope="scope">
                          <div v-if="edit">{{scope.row.no}}</div>
                          <div v-else style="color: #5191FD;cursor:default;" @click="routeTo('detail', {id: scope.row.id})">{{scope.row.no}}</div>
                        </template>
                      </el-table-column>
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
  </div>
</template>
<script>
import moment from 'moment';
import Flex from '@/components/flex';
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import Attach from './Attach';
import dialogContent from '@/components/dialog';
import landSupply from '@/view/landManagement/noticeList/supplyDetail';
import editTrade from '@/view/landManagement/landTrade/LandTradeConfig';
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
  getTargetSuspend,
  getTargetStop,
  getRestartTrade
  // saveTransTarget
} from '@/api/dealManagement/breakdealList';
import { selectListByParentCode, selectListByCodeDetail } from '@/api/common';
import { getTime } from '@/util/tool';
export default {
  components: {
    Wrapper,
    PageTable,
    Flex,
    Attach,
    dialogContent,
    landSupply,
    editTrade
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
          const startDateCurr = Date.parse(this.formData.beginNoticeTime);
          const endDateCurr = Date.parse(value);
          const changeDay = this.dictionaryNoticeCode / (1 * 60 * 60 * 24);
          if(endDateCurr < startDateCurr){
            callback(new Error('公告结束时间必须大于等于公告开始时间'))
          }
          this.isDate.beginNoticeDate = false;
          
          //公告结束
          // const startDate = new Date((value).replace(/-/g,"/"));
          const startDate = getTime(value, 0);
          const endDate = startDate;
          this.formData.endNoticeTime = endDate;
          //竞买申请结束/保证金缴纳结束
          // this.formData.endApplyTime = endDate;
          // this.formData.endEarnestTime = endDate;

          if((this.formData.transType!='102')&&(this.formData.transType!='网上交易（拍卖）')){
            //挂牌开始/自由报价开始
            // const startDate2 = new Date((value).replace(/-/g,"/"));
            // startDate2.setDate(startDate2.getDate()+1);
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
            // const startDate4 = new Date((value).replace(/-/g,"/"));
            // startDate4.setDate(startDate4.getDate()+1);
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
          const startDate = Date.parse(this.formData.beginNoticeTime.split(" ")[0]);
          const endDate = Date.parse(value.split(" ")[0]);
          if(startDate != endDate){
            callback(new Error('竞买申请开始时间 = 公告开始时间'))
          }
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
          const startDate = Date.parse(this.formData.beginNoticeTime.split(" ")[0]);
          const endDate = Date.parse(value.split(" ")[0]);
          if(startDate != endDate){
            callback(new Error('保证金缴纳开始时间 = 公告开始时间'))
          }
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
          const startDate = Date.parse(this.formData.endNoticeTime.split(" ")[0]);
          const endDate = Date.parse(value.split(" ")[0]);
          if(startDate < endDate){
            callback(new Error('竞买申请结束时间 <= 公告结束时间'))
          }
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
          const startDate = Date.parse(this.formData.endNoticeTime.split(" ")[0]);
          const endDate = Date.parse(value.split(" ")[0]);
          if(startDate < endDate){
            callback(new Error('保证金缴纳截至时间 <= 公告结束时间'))
          }
          this.formData.endEarnestTime = value;
          this.isDate.beginNoticeDate = false;
          this.isDate.endNoticeDate = false;
        }
        callback()  
      }
    }
    //挂牌开始
    const validateBeginList = (rule, value, callback) => {
      if((this.formData.transType!='102')&&(this.formData.transType!='网上交易（拍卖）')){
        if(value === ''){
          callback(new Error('请选择挂牌开始时间'))
        } else {
          if(((this.pageType === 'infoTrans' && this.curr_btnStatusData.isRestart === 1) || this.pageType === 'add' || this.pageType === 'edit') && this.isUpdateDate) {
            const startDate = Date.parse(this.formData.endNoticeTime.split(" ")[0]);
            const endDate = Date.parse(value.split(" ")[0]);
            if(endDate < startDate){
              callback(new Error('挂牌开始时间必须大于等于公告结束时间'))
            }
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
      }
    }
    //自由报价开始
    const validateBeginFocus = (rule, value, callback) => {
      if((this.formData.transType!='102')&&(this.formData.transType!='网上交易（拍卖）')){
        if(value === ''){
          callback(new Error('请选择自由报价时间'))
        } else {
          if(((this.pageType === 'infoTrans' && this.curr_btnStatusData.isRestart === 1) || this.pageType === 'add' || this.pageType === 'edit') && this.isUpdateDate) {
            const startDate = Date.parse(this.formData.endNoticeTime.split(" ")[0]);
            const endDate = Date.parse(value.split(" ")[0]);
            if(endDate < startDate){
              callback(new Error('自由报价开始时间必须大于等于公告结束时间'))
            }
            this.formData.beginFocusTime = value;
            this.isDate.beginNoticeDate = false;
            this.isDate.endNoticeDate = false;
          }
          callback()
        }
      }
    }
    //挂牌结束
    const validateEndList = (rule, value, callback) => {
      if((this.formData.transType!='102')&&(this.formData.transType!='网上交易（拍卖）')){
        if(value === ''){
          callback(new Error('请选择挂牌结束时间'))
        } else {
          if(((this.pageType === 'infoTrans' && this.curr_btnStatusData.isRestart === 1) || this.pageType === 'add' || this.pageType === 'edit') && this.isUpdateDate) {
            const startDate = Date.parse(this.formData.beginListTime.split(" ")[0]);
            const endDate = Date.parse(value.split(" ")[0]);
            const changeDay = this.dictionaryListCode / (1 * 60 * 60 * 24);
            if(endDate < startDate){
              callback(new Error('挂牌结束时间必须大于等于挂牌开始时间'))
            }
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
    //自由报价结束
    const validateEndFocus = (rule, value, callback) => {
      if((this.formData.transType!='102')&&(this.formData.transType!='网上交易（拍卖）')){
        if(value === ''){
          callback(new Error('请选择自由报价结束时间'))
        } else {
          if(((this.pageType === 'infoTrans' && this.curr_btnStatusData.isRestart === 1) || this.pageType === 'add' || this.pageType === 'edit') && this.isUpdateDate) {
            const startDate = Date.parse(this.formData.beginListTime.split(" ")[0]);
            const endDate = Date.parse(value.split(" ")[0]);
            const changeDay = this.dictionaryListCode / (1 * 60 * 60 * 24);
            if(endDate < startDate){
              callback(new Error('自由报价结束时间必须大于等于自由报价开始时间'))
            }
            this.formData.endFocusTime = value;
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
            if((this.formData.transType != '102')&&(this.formData.transType != '网上交易（拍卖）')){
              const startDate = Date.parse(this.formData.endNoticeTime.split(" ")[0]);
              const endDate = Date.parse(value.split(" ")[0]);
              if(((endDate - startDate)/(1*24*60*60*1000))<0){
                callback(new Error('限时竞价时间 >= 公告结束时间'))
              }
              this.formData.beginLimitTime = value;
              this.isDate.beginNoticeDate = false;
              this.isDate.endNoticeDate = false;
            }else{
              //为拍卖时,不为挂牌时--1天
              //拿到年月日
              const startDate = Date.parse(this.formData.endApplyTime.split(" ")[0]);
              const endDate = Date.parse(value.split(" ")[0]);
              if(endDate < startDate){
                callback(new Error('竞价开始时间必须大于等于竞买申请结束时间'))
              }
              this.formData.beginLimitTime = value;
              this.isDate.beginNoticeDate = false;
              this.isDate.endNoticeDate = false;
            }
            
          }
          callback()
      }
    }
    return {
      formData: {
        allowUnion: 0, // 是否允许联合竞买 ,
        allowLive: 1, // 是否允许网上直播 ,
        beginApplyTime: '', //  竞买申请开始时间 ,
        endApplyTime: '', //  竞买申请结束时间 ,
        beginEarnestTime: '', //  保证金开始时间 ,
        endEarnestTime: '', //  保证金结束时间 ,
        earnestMoney: undefined, //  保证金金额 ,
        beginFocusTime: '', //  集中报价开始时间 ,
        endFocusTime: '', //  集中报价结束时间 ,
        beginListTime: '', //  挂牌开始时间 ,
        endListTime: '', //  挂牌结束时间 ,
        beginNoticeTime: '', //  公告开始时间 ,
        endNoticeTime: '', // 公告结束时间 ,
        beginPrice: undefined, //  起始价 ,
        goodsIds: [], // 绑定的交易物标识 ,
        id: '', // 主键，该值不为空时进行修改操作 ,
        priceStep: undefined, //  增价幅度 ,
        isAfterCheck: 0, // 交易后审核
        requireBidderNum: '', // 必须参与竞买人数 ,
        // requirePriceNum: '', // 必须参与出价人数 ,
        businessType: '', //  交易类型 ,
        transType: '101', // 交易方式
        beginLimitTime: '', // 竞价开始时间
        operateFlag: '' // 操作类型(edit:编辑,add:添加)
      },
      rules: {
        businessType: [
          { required: true, message: '请选择交易类型', trigger: 'blur' }
        ],
        allowLive: [
          { required: true, message: '请选择是否网上直播', trigger: 'blur' }
        ],
        transType: [
          { required: true, message: '请选择交易方式', trigger: 'blur' }
        ],
        allowUnion: [
          { required: true, message: '请选择竞买方式', trigger: 'blur' }
        ],
        requireBidderNum: [
          { required: true, message: '请填写申请人数', trigger: 'blur' }
        ],
        // requirePriceNum: [
        //   { required: false, message: '请输入出价人数', trigger: 'blur' }
        // ],
        earnestMoney: [
          { required: true, message: '请输入保证金金额', trigger: ['blur', 'change'] }
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
        beginPrice: [
          { required: true, message: '请输入起始价', trigger: ['blur', 'change'] }
        ],
        priceStep: [
          { required: true, message: '请输入加价幅度', trigger: ['blur', 'change'] }
        ],
        beginLimitTime: [
          { required: true, validator: validateBeginLimit, trigger: 'blur' }
        ],
        isAfterCheck: [
          { required: true, message: '请选择资格审核', trigger: 'blur' }
        ],
        beginListTime: [
          { required: true, validator: validateBeginList, trigger: 'blur' }
        ],
        endListTime: [
          { required: true, validator: validateEndList, trigger: 'blur' }
        ],
        beginFocusTime: [
          { required: true, trigger: 'blur' }
        ],
        endFocusTime: [
          { required: true, trigger: 'blur' }
        ],
        goodsIds: [
          { required: true, message: '请选择绑定的交易物信息', trigger: 'blur' }
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
      tradedata:{}
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
        }else if(newval.type === 'info'){
          this.edit = false;
          this.isRestartEdit = false;
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
      if (this.type === 'infoTrans') {
          this.edit = false;
        if(this.curr_btnStatusData.isRestart === 1){
            this.isRestartEdit = true;
        }
      }else if(this.type === 'info'){
        this.edit = false;
        this.isRestartEdit = false;
      }
    },
    Options: {
      handler (newValue, oldValue) {
        if (newValue.tableData.length !== 0) {
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
        allowUnion: 0, // 是否允许联合竞买 ,
        allowLive: 1, // 是否允许网上直播 ,
        beginApplyTime: '', //  竞买申请开始时间 ,
        endApplyTime: '', //  竞买申请结束时间 ,
        beginEarnestTime: '', //  保证金开始时间 ,
        endEarnestTime: '', //  保证金结束时间 ,
        earnestMoney: undefined, //  保证金金额 ,
        beginFocusTime: '', //  集中报价开始时间 ,
        endFocusTime: '', //  集中报价结束时间 ,
        beginListTime: '', //  挂牌开始时间 ,
        endListTime: '', //  挂牌结束时间 ,
        beginNoticeTime: '', //  公告开始时间 ,
        endNoticeTime: '', // 公告结束时间 ,
        beginPrice: undefined, //  起始价 ,
        goodsIds: [], // 绑定的交易物标识 ,
        id: '', // 主键，该值不为空时进行修改操作 ,
        priceStep: undefined, //  增价幅度 ,
        isAfterCheck: 0, // 交易后审核
        requireBidderNum: '', // 必须参与竞买人数 ,
        requirePriceNum: '', // 必须参与出价人数 ,
        businessType: '', //  交易类型 ,
        transType: '101', // 交易方式
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
      this.$_resetForm();
    },
    closeTrade () {
      this.tradedata = {};
      this.tradeshow = false;
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
      this._selectListByCodeNoticeDetail();
      this._selectListByCodeListDetail();
      this._selectListByCodeApplyDetail();
      this._selectListByCodeBondDetail();
      this._selectListByCodeNoticeLimitDetail();
      this._selectListByCodeNoticeListDetail();
      this.pageType === 'add'
        ? this._getInitTargetAttach()
        : this._getTransTargetInfo();

      // if (this.pageType === 'info') {
      //   this.edit = false;
      // } else {
      //   this.edit = true;
      // }
      if (this.pageType === 'infoTrans') {
        this.edit = false;
        if(this.curr_btnStatusData.isRestart === 1){
          this.isRestartEdit = true;
        }
        this.getNoticeDtlByTargetIdFn();
      }else if(this.pageType === 'info'){
        this.edit = false;
        this.isRestartEdit = false;
      }else{
        this.edit = true;
        this.isRestartEdit = true;
      }
    },
    handleChangeTransType () {
      this.formData = {
        ...this.formData,
        beginNoticeTime: '',
        beginApplyTime: '',
        beginEarnestTime: '',
        endNoticeTime: '',
        endListTime: '',
        endApplyTime: '',
        endEarnestTime: '',
        beginListTime: '',
        beginFocusTime: '',
        endFocusTime: '',
        beginLimitTime: ''
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
    submitForm () {
      let vm = this;
      this.isUpdateDate = false;
      this.isDate.beginNoticeDate = false;
      this.isDate.endNoticeDate = false;
      this.$refs.formData.validate(valid => {
        this.isUpdateDate = true;
        this.isDate.beginNoticeDate = true;
        this.isDate.endNoticeDate = true;
        const formData = {
          ...this.formData
        };
        formData.id = this.initId;
        formData.operateFlag = this.pageType;
        if (
          formData.transType === '102' ||
          formData.transType === '网上交易（拍卖）'
        ) {
          delete formData.beginListTime;
          delete formData.endListTime;
          delete formData.beginFocusTime;
          delete formData.endFocusTime;
        }
        if (valid) {
          if (
            (formData.transType !== '102' &&
              formData.transType !== '网上交易（拍卖）' &&
              (!vm.formData.beginListTime ||
                !vm.formData.endListTime ||
                !vm.formData.beginFocusTime ||
                !vm.formData.endFocusTime)) ||
            !vm.formData.goodsIds
          ) {
            vm.$notify.error({
              title: '失败',
              message: '请填写完整必填数据!!!',
              position: 'bottom-right'
            });
            return false;
          }
          saveTransTarget(formData)
            .then(res => {
              if (res.code === '200') {
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  position: 'bottom-right'
                });
                vm.$emit('success', res.code);
              }
            })
            .catch(err => {
              console.log(err);
            });
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
              beginApplyTime: res.data.beginApplyTime,//竞买申请开始
              endApplyTime: res.data.endApplyTime,//竞买申请结束
              beginEarnestTime: res.data.beginEarnestTime,//保证金缴纳开始
              endEarnestTime: res.data.endEarnestTime,//竞买申请结束
              earnestMoney: res.data.earnestMoney,
              // beginFocusTime: res.data.beginFocusTime,//集中报价开始
              beginFocusTime: res.data.beginListTime,//集中报价开始
              // endFocusTime: res.data.endFocusTime,//集中报价结束
              endFocusTime: res.data.endListTime,//集中报价结束
              beginListTime: res.data.beginListTime,//挂牌开始
              endListTime: res.data.endListTime,//挂牌结束
              beginNoticeTime: res.data.beginNoticeTime,//公告开始
              endNoticeTime: res.data.endNoticeTime,//公告结束
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
            this.curr_name = res.data.name;
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
    //暂停交易
    onTargetSuspend() {
      let vm = this;
      let id = this.initId;
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
        getTargetStop({targetIds:[id]}).then(res => {
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
    onRestartTrade() {
      let vm = this;
      this.isUpdateDate = false;
      this.isDate.beginNoticeDate = false;
      this.isDate.endNoticeDate = false;
      this.$refs.formData.validate(valid => {
        this.isUpdateDate = true;
        this.isDate.beginNoticeDate = true;
        this.isDate.endNoticeDate = true;
        if(valid){
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
              // licenseId: '',
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
      console.log(val, type);
      this.formData = {
        ...this.formData,
        [type]: !!val && moment(val).format("yyyy[年]MM[月]DD[日] HH[时]mm[分]ss[秒]")
      };
      setTimeout(() => {
        this.formData[type] = moment(val).format("yyyy[年]MM[月]DD[日] HH[时]mm[分]ss[秒]");
      }, 3000)
  
      console.log(this.formData, this.formData[type], moment(val).format("yyyy[年]MM[月]DD[日] HH[时]mm[分]ss[秒]"))
      this.$forceUpdate();
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
