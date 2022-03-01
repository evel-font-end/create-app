<template>
  <div>
    <dialog-content
      @on-cancel="canceledit"
      @on-confirm="confirmedit"
      @on-close="canceledit"
      @on-open="openedit"
      :title="type=='add'?'新增标的':(type=='edit'?'编辑标的':'标的详情')"
      
      :visible.sync="editshow"
      ref="dialog"
      :dialogModel="dialogModel"
      :confirmShow="edit"
      :cancelShow="edit"
      :bottomShow="!!(edit || (curr_transManage === 'transManage' && (curr_btnStatusData.isSuspend || curr_btnStatusData.isStop || curr_btnStatusData.isRestart)))"
      appendToBody
    >
      <div id="mineTargetListEdits">
        <div class="content-bd">
          <el-form ref="formData" :rules="rules" :model="formData" label-width="160px" status-icon>
            <wrapper title="基本情况">
                            <el-row :gutter="5">
                <el-col :span="12">
                    <el-form-item label="矿区名称："  prop="no">
                      <el-input :disabled="edit ? false : true" v-model="formData.no" placeholder="请输入矿区名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="有效年限：" prop="useYears">
                    <el-input :disabled="edit ? false : true" v-model="formData.useYears" placeholder="请输入有效年限"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="矿区位置："  prop="address">
                      <el-input :disabled="edit ? false : true" v-model="formData.address" placeholder="请输入矿区位置"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                    <el-form-item label="矿区面积："  prop="mineralArea">
                      <el-input :disabled="edit ? false : true" v-model="formData.mineralArea" placeholder="请输入矿区面积">
                        <!-- <template slot="append">平方公里</template> -->
                      </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="矿种：" prop="goodsUse">
                    <el-input :disabled="edit ? false : true" v-model="formData.goodsUse" placeholder="请输入矿种"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                    <el-form-item label="可采储量："  prop="storage">
                      <el-input :disabled="edit ? false : true" v-model="formData.storage" placeholder="请输入可采储量">
                      </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="区域：" prop="cantonId">
                    <el-select
                      v-model="formData.cantonId"
                      placeholder="请选择区域"
                      clearable
                      :disabled="edit ? false : true"
                    >
                      <el-option
                        v-for="optionItem in common.contentOption"
                        :key="optionItem.id"
                        :label="optionItem.name || optionItem.text"
                        :value="optionItem.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="矿区坐标："  prop="mineralCoordinate">
                      <el-input :disabled="edit ? false : true"
                        v-model="formData.mineralCoordinate"
                        placeholder="请输入矿区坐标"
                      ></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="投资总额："  prop="aggregateInvestment">
                      <el-input :disabled="edit ? false : true" v-model="formData.aggregateInvestment" placeholder="请输入投资总额"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="交付条件："  prop="abandonTerm">
                      <el-input :disabled="edit ? false : true" v-model="formData.abandonTerm" placeholder="请输入交付条件"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="备注："  prop="remark">
                      <el-input :disabled="edit ? false : true" v-model="formData.remark" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                    <el-form-item label="视频地址："  prop="mineralVideo">
                      <el-input :disabled="edit ? false : true" v-model="formData.mineralVideo" placeholder="请输入视频地址"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="地图地址："  prop="mineralMap">
                      <el-input :disabled="edit ? false : true" v-model="formData.mineralMap" placeholder="请输入地图地址"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="以往地质工作："  prop="oldGeologicalWork">
                      <el-input :disabled="edit ? false : true" v-model="formData.oldGeologicalWork" placeholder="请输入以往地质工作"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="地质状况："  prop="mineralSituation">
                      <el-input :disabled="edit ? false : true" v-model="formData.mineralSituation" placeholder="请输入地质状况"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="评估人："  prop="mineralEvaluator">
                      <el-input :disabled="edit ? false : true" v-model="formData.mineralEvaluator" placeholder="请输入评估人"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="其他内容："  prop="mineralOther">
                      <el-input
                        :disabled="edit ? false : true"
                        v-model="formData.mineralOther"
                        placeholder="请输入其他内容"
                        type="textarea"
                        :autosize="{
                          minRows: 3
                        }"
                      ></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
            </wrapper>
            <wrapper title="交易基本情况">
              <el-row :gutter="5">
                <el-col :span="12">
                  <el-form-item label="交易类型：" prop="businessType">
                    <el-select
                      :disabled="edit ? false : true"
                      v-model="formData.businessType"
                      @change="changeBusinessType"
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
            <wrapper title="价款信息和时间信息">
              <el-row :gutter="5">
                <el-col :span="12">
                  <el-form-item label="起始价(万元)：" prop="beginPrice">
                    <el-input-number
                      controls-position="right"
                      type="number"
                      :precision="4"
                      :disabled="edit ? false : true"
                      v-model="formData.beginPrice"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="加价幅度(万元)：" prop="priceStep">
                    <el-input-number
                      controls-position="right"
                      type="number"
                      :precision="4"
                      :disabled="edit ? false : true"
                      v-model="formData.priceStep"
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
                      :precision="4"
                      :disabled="edit ? false : true"
                      v-model="formData.earnestMoney"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="false && !edit">
                  <el-form-item label="是否设置底价：" prop="hasReservePrice">
                    <div class="flexRow radioGroupInput">
                      <el-radio-group v-model="formData.hasReservePrice" :disabled="!edit">
                        <el-radio
                          v-for="(radioOption, rIndex) in reservePriceOptions"
                          :key="`${radioOption.value}-${rIndex}-rop`"
                          :label="radioOption.value || radioOption.id"
                        >
                        {{radioOption.label}}
                        </el-radio>
                      </el-radio-group>
                      <!-- <el-input
                        v-model="formData.reservePrice"
                        v-if="reservePriceShow"
                        :disabled="!edit"
                      /> -->
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row
                :gutter="5"
                v-if="pageType !== 'infoTrans'"
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
            </wrapper>
            <wrapper title="其他要求" v-if="pageType === 'infoTrans'">
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
              <!-- <el-row :gutter="5">
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
              </el-row> -->
              <el-row :gutter="5">
                <!-- <el-col :span="12" v-if="false">
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
                </el-col> -->
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
                v-if="(formData.transType!='102')"
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
              <!-- <el-row
                :gutter="5"
                v-if="false && (formData.transType!='101')&&(formData.transType!='网上交易（挂牌）')"
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
              </el-row> -->
              <!-- <el-row :gutter="5">
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
              </el-row> -->
            </wrapper>
            <attach-modal :initId="initId" :edit="edit" />
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
          :visible.sync="dialog.show"
          ref="dialog"
          append-to-body
          customClass="btnInfo"
        >
          <div>
            <el-form label-width="80px" status-icon class="f-l">
              <el-form-item label="矿区名称：" class="inb">
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
            <!-- <div class="f-r">
              <el-button size="small" type="primary" class="submitBtn" @click="onSearch">查询</el-button>
              <el-button class="resetBtn" size="small" @click="resetSearch">重置</el-button>
            </div> -->
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
import Flex from '@/components/flex';
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import AttachModal from './mineAttach';
import dialogContent from '@/components/dialog';
import landSupply from '@/view/mineManagement/mineNoticeList/supplyDetail';
import editTrade from '@/view/mineManagement/TradeList/Details/index';
import { mapGetters, mapMutations } from 'vuex';
import {
  getMineBusinessType,
  getTransMineTargetInfo,
  getTransactionType,
  initMineGoodsAttach,
  getunBindList,
  saveTransTarget
} from '@/api/mineManagement/mineTargetList';
import {
  getNoticeDtlByTargetId
} from '@/api/landManagement/tarageList';
import {
  getTargetSuspend,
  getTargetStop,
  getRestartTrade
  // saveTransTarget
} from '@/api/dealManagement/breakdealList';
import { selectListByParentCode,selectListByCodeDetail, initMineTargetAttach } from '@/api/common';
import { getTime } from '@/util/tool';
import {
  applyTrust,
  detail,
  commitTrust
} from '@/api/mineManagement/tradeList';
export default {
  components: {
    Wrapper,
    PageTable,
    Flex,
    AttachModal,
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
          
          if((this.formData.transType!=='102')){
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
          // const startDate = Date.parse(this.formData.beginNoticeTime);
          // const endDate = Date.parse(value);
          // if(startDate != endDate){
            // callback(new Error('竞买申请开始时间 = 公告开始时间'))
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
          // const startDate = Date.parse(this.formData.beginNoticeTime);
          // const endDate = Date.parse(value);
          // if(startDate != endDate){
            // callback(new Error('保证金缴纳开始时间 = 公告开始时间'))
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
          // const startDate = Date.parse(this.formData.endNoticeTime);
          // const endDate = Date.parse(value);
          // if(startDate < endDate){
            // callback(new Error('竞买申请结束时间 <= 公告结束时间'))
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
          // const startDate = Date.parse(this.formData.endNoticeTime);
          // const endDate = Date.parse(value);
          // if(startDate < endDate){
            // callback(new Error('保证金缴纳截至时间 <= 公告结束时间'))
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
            // const startDate = Date.parse(this.formData.endNoticeTime);
            // const endDate = Date.parse(value);
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
      }else {
        console.log('this.formData.beginListTime1', this.formData.beginListTime);
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
            // const startDate = Date.parse(this.formData.beginListTime);
            // const endDate = Date.parse(value);
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
        console.log('this.formData.beginListTime2 ', this.formData.beginListTime);
        callback()
      }
    }
    //竞价开始
    const validateBeginLimit = (rule, value, callback) => {
        if(value === ''){
          callback(new Error('请选择竞价开始时间'))
        } else {
          if(((this.pageType === 'infoTrans' && this.curr_btnStatusData.isRestart === 1) || this.pageType === 'add' || this.pageType === 'edit') && this.isUpdateDate) {
            // const startDate = Date.parse(this.formData.endNoticeTime);
            // const endDate = Date.parse(value);
            // if(((endDate - startDate)/(1*24*60*60*1000))<0){
            //   callback(new Error('限时竞价时间 大于等于 公告结束时间'))
            // }
            //不为拍卖时,为挂牌时--10天
            if((this.formData.transType != '102')){
              // const startDate = Date.parse(this.formData.endNoticeTime);
              // const endDate = Date.parse(value);
              // if(((endDate - startDate)/(1*24*60*60*1000))<0){
              //   callback(new Error('限时竞价时间 >= 公告结束时间'))
              // }
              this.formData.beginLimitTime = value;
              this.isDate.beginNoticeDate = false;
              this.isDate.endNoticeDate = false;
            }else{
              //为拍卖时,不为挂牌时--1天
              //拿到年月日
              // const startDate = Date.parse(this.formData.endApplyTime);
              // const endDate = Date.parse(value);
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
    return {
      goods: {},
      target: {},
      trust: {},
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
        requireBidderNum: 1, // 必须参与竞买人数 ,
        // requirePriceNum: '', // 必须参与出价人数 ,
        businessType: '', //  交易类型 ,
        transType: '', // 交易方式
        // beginLimitTime: '', // 竞价开始时间
        operateFlag: '', // 操作类型(edit:编辑,add:添加)
                no: '',
        useYears: '',
        address: '',
        mineralArea: '',
        goodsUse: '',
        mineralLevel1: '',
        mineralStorage: '',
        mineralMethods: '',
        mineralCoordinate: '',
        aggregateInvestment: '',
        abandonTerm: '',
        mineralProductionScale: '',
        oldGeologicalWork: '',
        mineralSituation: '',
        mineralOther: '',
        mineralVideo: '',
        mineralMap: '',
        mineralEvaluator: '',
        storage: '',
        cantonId: '',
        remark: '',
        // hasReservePrice: 1
      },
      ruleChangeTime: ['beginNoticeTime', 'endNoticeTime', 'beginApplyTime', 'endApplyTime', 'beginEarnestTime', 'endEarnestTime', 'beginLimitTime'],
      rules: {
              no: [
          { required: true, message: '请输入矿区名称', trigger: 'change' }
        ],
              mineralArea: [
          { required: true, message: '请输入矿区面积', trigger: 'change' }
        ],
              goodsUse: [
          { required: true, message: '请输入矿种', trigger: 'change' }
        ],
                      mineralSituation: [
          { required: true, message: '请输入地质状况', trigger: 'change' }
        ],
              address: [
          { required: true, message: '请输入矿区位置', trigger: 'change' }
        ],
              useYears: [
          { required: true, message: '请输入年限', trigger: 'change' }
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
          { required: true, message: '请填写申请人数', trigger: 'change' }
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
        beginLimitTime: [
          { required: true, validator: validateBeginLimit, trigger: 'blur' }
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
        isAfterCheck: [
          { required: true, message: '请选择资格审核', trigger: 'change' }
        ],
        // hasReservePrice: [
        //   { required: true, message: '请输入是否设置底价', trigger: ['blur', 'change'] }
        // ]
        // goodsIds: [
        //   { required: true, message: '请选择绑定的交易物信息', trigger: 'change' }
        // ]
      },
      Options: {
        businessType: [], // 交易类型
        transType: [], // 交易方式
        tableData: []
      },
      dialog: {
        show: false,
        tableData: [],
        tableCols: [
          { label: '矿区名称', prop: 'no' },
          { label: '行政区域', prop: 'cantonName' },
          { label: '交易物类型', prop: 'goodsType' },
          // { label: "用途", prop: "goodsUse" },
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
          businessType: ''
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
      edit: true,
      option: '探矿权',
      reservePriceOptions: [{
        label: '有保护价',
        id: 1
      }, {
        label: '无保护价',
        id: 0
      }]
    };
  },
  computed: {
    ...mapGetters(['common'])
  },
  watch: {
    data: {
      deep: true,
      handler (newval, oldval) {
        this.initId = newval.id;
        this.pageType = newval.type;
        this.curr_transManage = newval.transManage;
        this.curr_btnStatusData = newval.btnStatusData;
        // if (newval.type === 'info') {
        //   this.edit = false;
        // }
        // if (!this.dialogModel) {
        //   this.openedit()
        // }
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
      // this.option = option;
      // if (this.type === 'info') {
      //   this.edit = false;
      // }
      if (this.type === 'infoTrans') {
          this.edit = false;
        if(this.curr_btnStatusData.isRestart === 1){
            this.isRestartEdit = true;
        }
      }else if(this.type === 'info'){
        this.edit = false;
        this.isRestartEdit = false;
      }
      if (!val) {
        this.$refs.formData.clearValidate();
        this.$refs.formData.resetFields();
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
    changeBusinessType (val) {
      this._initMineGoodsAttach({businessType: val, targetId: this.initId});
    },
    canceledit () {
      if (this.$refs.multipleTable && this.$refs.multipleTable) {
        this.$refs.multipleTable.getPageTable();
      }
      this.$refs.formData.clearValidate();
      this.$refs.formData.resetFields();
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
        requireBidderNum: 1, // 必须参与竞买人数 ,
        requirePriceNum: '', // 必须参与出价人数 ,
        businessType: '', //  交易类型 ,
        transType: '', // 交易方式
        beginLimitTime: '', // 竞价开始时间
        operateFlag: '', // 操作类型(edit:编辑,add:添加)
        no: '',
        useYears: '',
        address: '',
        mineralArea: '',
        goodsUse: '',
        mineralLevel1: '',
        mineralStorage: '',
        mineralMethods: '',
        mineralCoordinate: '',
        aggregateInvestment: '',
        abandonTerm: '',
        mineralProductionScale: '',
        oldGeologicalWork: '',
        mineralSituation: '',
        mineralOther: '',
        storage: '',
        cantonId: '',
        // hasReservePrice: 1
      };
      this.edit = true;
      this.editshow = false;
      this.pageType = '';
      this.initId = '';
      this.curr_transManage = '';
      this.curr_btnStatusData = '';
      this.selectBindList = [];
      this.isUpdateDate = true;
      this.isDate.beginNoticeDate = true;
      this.isDate.endNoticeDate = true;
      this.isRestartEdit = false;
      this.dictionaryNoticeCode = null;
      this.dictionaryListCode = null;
      this.dictionaryApplyCode = null;
      this.dictionaryBondCode = null;
      this.curr_name = '';
      this.noticeInfo = {};
      this.landSupplyshow = false;
      this.landSupplydata = {};
      this.tradedata = {};
      this.tradeshow = false;
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
      this._getMineBusinessType();
      this._getTransactionType();
      this._selectListByCodeNoticeDetail();
      this._selectListByCodeListDetail();
      this._selectListByCodeApplyDetail();
      this._selectListByCodeBondDetail();
      this._selectListByCodeNoticeLimitDetail();
      this._selectListByCodeNoticeListDetail();
      this.pageType === 'add'
        ? this._initMineGoodsAttach({})
        : this._getTransMineTargetInfo();
      // if (this.pageType === 'info') {
      //   this.edit = false;
      // } else {
      //   this.edit = true;
      // }
      if (this.pageType === 'infoTrans') {
        this.edit = false;
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
        this.getNoticeDtlByTargetIdFn();
      }else{
        this.edit = true;
        this.isRestartEdit = true;
        this.ruleChangeTime.map(ruleTime => {
          this.rules[ruleTime][0].required = false;
        });
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
    closeTrade () {
      this.tradedata = {};
      this.tradeshow = false;
    },
    routeTo (type, parames, option) {
      this.tradedata = { type, ...parames, option };
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
    bindCheck () {
      // if (!this.formData.businessType) {
      //   this.$notify.error({
      //     title: '失败',
      //     message: '请选择交易类型!!!',
      //     position: 'bottom-right'
      //   });
      //   return false;
      // } else {
      //   this.dialog.show = true;
      // }
      this.dialog.show = true;
    },
    // 区域列表
    _selectListByParentCode () {
      selectListByParentCode('4635').then(res => {
        if (res.code === '200') {
          this.dialog.cantonList = res.data;
        }
      });
    },
    // 获取未绑定标的交易物
    _getunBindList () {
      this.dialog.searchVal.businessType = this.formData.businessType;
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
          goods: {
            ...this.goods,
            no: this.formData.no,
            useYears: this.formData.useYears,
            address: this.formData.address,
            mineralArea: this.formData.mineralArea,
            goodsUse: this.formData.goodsUse,
            mineralLevel1: this.formData.mineralLevel1,
            mineralStorage: this.formData.mineralStorage,
            mineralMethods: this.formData.mineralMethods,
            mineralCoordinate: this.formData.mineralCoordinate,
            aggregateInvestment: this.formData.aggregateInvestment,
            abandonTerm: this.formData.abandonTerm,
            mineralProductionScale: this.formData.mineralProductionScale,
            oldGeologicalWork: this.formData.oldGeologicalWork,
            mineralSituation: this.formData.mineralSituation,
            mineralOther: this.formData.mineralOther,
            remark: this.formData.remark,
            mineralVideo: this.formData.mineralVideo,
            mineralMap: this.formData.mineralMap,
            mineralEvaluator: this.formData.mineralEvaluator,
            storage: this.formData.storage,
            cantonId: this.formData.cantonId,
            operateFlag: this.pageType,
            id: this.pageType === 'edit' ? this.goods.id : null,
          },
          target: {
            ...this.target,
            allowUnion: this.formData.allowUnion,
            allowLive: this.formData.allowLive,
            beginListTime: this.formData.beginListTime, //  挂牌开始时间 ,
            endListTime: this.formData.endListTime,
            beginPrice: this.formData.beginPrice,
            earnestMoney: this.formData.earnestMoney,
            goodsIds: this.formData.goodsIds, // 绑定的交易物标识 ,
            id: this.formData.id, // 主键，该值不为空时进行修改操作 ,
            priceStep: this.formData.priceStep, //  增价幅度 ,
            isAfterCheck: this.formData.isAfterCheck, // 交易后审核
            requireBidderNum: this.formData.requireBidderNum,
            businessType: this.formData.businessType, //  交易类型 ,
            transType: this.formData.transType, // 交易方式
            beginLimitTime: this.formData.beginLimitTime, // 竞价开始时间
            operateFlag: this.formData.operateFlag, // 操作类型(edit:编辑,add:添加)
            id: this.pageType === 'edit' ? this.target.id : this.initId,
            operateFlag: this.pageType
          },
          trust: {},
        };
        // formData.id = this.initId;
        // formData.operateFlag = this.pageType;
        if (valid) {
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
                this.$refs.formData.clearValidate();
                this.$refs.formData.resetFields();
              }
            })
            .catch(err => {
              this.$refs.formData.clearValidate();
              this.$refs.formData.resetFields();
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
    _getMineBusinessType () {
      this.Options.businessType = [];
      getMineBusinessType().then(res => {
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
          this.formData.transType = this.formData.transType ? this.formData.transType : res.data[0].key;
        }
      });
      this.$forceUpdate();
    },
    // 新增时初始化标的附件信息，获取id
    _initMineGoodsAttach (data) {
      this.initId = null;
      initMineTargetAttach(data)
        .then(res => {
          this.initId = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取标的详情
    _getTransMineTargetInfo () {
      let id = this.initId;
      detail(id)
        .then(res => {
          if (res.code === '200') {
            // this.formData = res.data;
            this.goods = res.data.goods;
            this.target = {
              ...res.data.target,
              // hasReservePrice: (res.data.target.hasReservePrice !== undefined && res.data.target.hasReservePrice !== null) ? res.data.target.hasReservePrice : 1,
              allowUnion: res.data.target.allowUnion ? res.data.target.allowUnion : 0,
              allowLive: res.data.target.allowLive ? res.data.target.allowLive : 1,
              requireBidderNum: res.data.target.requireBidderNum ? res.data.target.requireBidderNum : 1
            };
            this.trust = res.data.trust;
            this.formData = {
              ...this.formData,
              ...this.goods,
              ...this.target,
              // ...res.data.trust
            };
            this.initId = this.target.id;
            // this.Options.tableData = this.transGoodsDtos;
            // this.selectBindList = this.transGoodsDtos;
            this.curr_name = this.target.name;
            // this.handleTransType(this.formData.transType);
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
    }
  }
};
</script>

<style lang="less">
.btnInfo {
  .resetBtn {
    // margin-right: 20px;
    &:hover, &:focus, &:active{
      background-color: #fff;
    }
  }
  .submitBtn {
    background: rgba(37, 115, 241, 1);
    margin-right: 10px;
  }
}
#mineTargetListEdits {
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
    border-radius: 0;
    &:first-child {
      margin-bottom: 0;
      border: none;
    }
    /deep/.el-form-item {
      margin-bottom: 24px;
    }
    /deep/.el-date-editor.el-input {
      width: 100%;
    }
    /deep/.el-card__header {
      padding: 13px 0px 0;
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
  .el-form-item {
    margin-bottom: 12px;
  }
  .el-input-number{
    width: 100%;
    display: block;
    line-height: 33px;
    height: 35px;
    >span{
      height: 17.5px;
      &.el-input-number__increase{
        top: 1.5px;
      }
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
