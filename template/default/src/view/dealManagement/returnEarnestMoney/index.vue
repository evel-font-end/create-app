<template>
  <div class="container">
    <!-- <router-view v-if="routeName == 'taragelistEdit'"></router-view> -->
    <!-- <template> -->
    <header-title>
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        :labelWidth="labelWidth"
        @onSearch="onSearch"
      />
    </header-title>

    <page-table
      :data="tableData"
      :cols="tableCols"
      col-align="left"
      :page-current="page.current"
      :total="page.total"
      :page-size="page.pageSize"
      @current-change="onCurrentChange"
      @size-change="onPageSizeChange"
      operator
      operator-width="100"
    >
      <template slot-scope="scope" slot="operator">
        <el-button
          type="text"
          size="small"
          icon="iconfont icon-feeds-fill"
          title="详情"
          @click="openEdit(scope.row)"
        ></el-button>
        <el-button
          type="text"
          size="small"
          title="申请退还保证金"
          icon="iconfont icon-reset"
          @click="selectReturn(scope.row)"
          v-if="scope.row.isDealBidder === '否'"
        ></el-button>
        <el-button
          type="text"
          size="small"
          title="审核进度"
          icon="iconfont icon-trackProgress"
          v-if="false"
          @click="toPageProgress(scope.row)"
        ></el-button>
      </template>
    </page-table>
     <dialog-cont
        @on-cancel="canceledit('cancel')"
        @on-close="canceledit('close')"
        @on-open="openedit"
        @on-confirm="confirmedit"
        :confirmText="'下载'"
        :title="`退还保证金详情`"
        :visible.sync="editshow"
        ref="dialog"
        className="returnDetail"
      >
      <Wrapper title="交易标的基本情况" className="bidderDetails">
        <FormItemText
          :layout="editFormText"
          labelWidth="100px"
        />
      </Wrapper>
      <Wrapper title="竞买人缴纳保证金信息" className="bidderPlayDetails">
        <page-table
          :data="editTableData"
          :cols="editTableCols"
          col-align="left"
          :showPage="false"
        />
      </Wrapper>
     </dialog-cont>
    <edit-progress 
      :show="progressShow" 
      :data="progressdata" 
      @cancel="closeEdit"
    ></edit-progress>
  </div>
</template>

<script>
import dialogCont from '@/components/dialog';
import PageTable from "@/components/page-table";
import headerTitle from "components/headerTitle/headerTitle";
import searchForm from "components/searchForm/searchForm";
import editProgress from '@/view/dealExamine/auditInformation/Edit/index';
import FormItemText from '@/components/formItemText';
import Wrapper from '@/components/wrapper';
import {
  getListByCondition,
  applyRefund,
  getDetail,
  exportDetail
} from "@/api/dealManagement/returnEarnestMoney";
import {
  getBusinessType
} from "@/api/dealManagement/blacklistDealManagement";
import {
  getDealStatus,
  getRefundStatus
} from '@/api/common';

export default {
  name: "return_earnest_money",
  components: {
    PageTable,
    headerTitle,
    searchForm,
    editProgress,
    dialogCont,
    FormItemText,
    Wrapper
  },
  data() {
    return {
      tableCols: [
        { label: "宗地编号", prop: "no" },
        { label: "交易类型",
          prop: "businessTypeText",
        },
        { label: "竞买人", prop: "bidder" },
        { label: "缴纳人", prop: "payer" },
        { label: "缴纳保证金(万元)", prop: "earnestMoney" },
        { label: "缴纳人的银行账号", prop: "accountId" },
        { label: "缴纳时间", prop: "earnestTime" },
        { label: "收款银行", prop: "bankName" },
        { label: "交易状态",
          prop: "dealStatusText"
        },
        { label: "是否竞得人",
          prop: "isDealBidder"
        },
        { label: "退还状态", prop: "refundStatusText" },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      searchVal: {
        name: "",
        no: "",
        bankName: ""
      },
      labelWidth: "85px",
      searchItems: [
        {
          type: "input",
          label: "宗地编号",
          props: {
            width: "180px",
            fieldName: "no"
          }
        },
        {
          type: "select",
          label: "交易类型",
          props: {
            width: "140px",
            fieldName: "businessType",
            options: []
          }
        },
        {
          type: "select",
          label: "交易状态",
          props: {
            width: "140px",
            fieldName: "dealStatus",
            options: []
          }
        },
        {
          type: "select",
          label: "是否竞得人",
          props: {
            width: "140px",
            fieldName: "isDealBidder",
            options: [{
              id: 1,
              name: '是'
            },{
              id: 0,
              name: '否'
            }]
          }
        },
        {
          type: "select",
          label: "退还状态",
          props: {
            width: "140px",
            fieldName: "refundStatus",
            options: []
          }
        }
      ],
      progressShow: false,
      progressdata: {},
      editshow: false,
      editFormText: [{
        id: 'targetNo',
        label: '宗地编号',
        value: ''
      },{
        id: 'businessType',
        label: '交易类型',
        value: ''
      }, {
        id: 'tradeStatus',
        label: '交易状态',
        value: ''
      }, {
        id: 'tradeTime',
        label: '成交时间',
        value: ''
      }, {
        id: 'tradeUser',
        label: '成交人',
        value: ''
      }, {
        id: 'tradeMoneyText',
        label: '成交金额',
        value: '',
        unit: '万元'
      }],
      editTargetId: null,
      editTableData: [],
      editTableCols: [
        { label: "竞买人", prop: "bidderName" },
        { label: "缴纳人", prop: "bidderAccountName" },
        { label: "缴纳保证金(万元)", prop: "earnestMoney" },
        { label: "缴纳人的银行账号", prop: "bidderAccountNo" },
        { label: "缴纳时间", prop: "earnestTime" },
        { label: "退款银行", prop: "bidderAccountBank" },
      ],
      editPage: {
        current: 1,
        pageSize: 10,
        total: 0
      },
    };
  },
  methods: {
    onCurrentChange(val) {
      this.page.current = val;
      this.getList();
    },
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    // 查询
    onSearch(val) {
      this.searchVal = {
        ...val,
        dealStatus: +val.dealStatus,
        isDealBidder: +val.isDealBidder,
        refundStatus: +val.refundStatus
      };
      this.page.current = 1;
      this.getList();
    },
    // 获取列表
    getList() {
      const param = {
        data: this.searchVal,
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      getListByCondition(param).then(res => {
        const { data, total } = res.data;
        this.page.total = total;
        this.tableData = data;
      });
    },
    selectReturn (row) {
      applyRefund(row.accountBillId).then(res => {
        if (res.code === '200') {
          this.$notify({
            type: "success",
            title: "成功",
            message: "申请成功",
            position: "bottom-right"
          });
          this.getList();
        }
      })
    },
    // 获取交易方式下拉框数据
    _getBusinessType() {
      this.searchItems[1].props.options = [];
      getBusinessType().then(res => {
        if (res.code === "200") {
          res.data.map(item => {
            this.searchItems[1].props.options.push({
              name: item.value,
              id: item.key
            });
          });
        }
      });
      this.$forceUpdate();
    },
    _getDealStatus() {
      this.searchItems[2].props.options = [];
      getDealStatus().then(res => {
        if (res.code === "200") {
          res.data.map(item => {
            this.searchItems[2].props.options.push({
              name: item.value,
              id: item.key
            });
          });
        }
      });
      this.$forceUpdate();
    },
    _getRefundStatus() {
      this.searchItems[4].props.options = [];
      getRefundStatus().then(res => {
        if (res.code === "200") {
          res.data.map(item => {
            this.searchItems[4].props.options.push({
              name: item.value,
              id: item.key
            });
          });
        } 
      });
      this.$forceUpdate();
    },
    toPageProgress (row) {
      this.progressdata = {
        approveId: row.approveId,
        refId: row.refId,
        // approveLinkedId: row.approveLinkedId,
        status: row.status,
        businessType: row.businessType,
        isShowBtn: false,
        title: '退还保证金进度',
        type:'retuenEarnest'
      }
      this.progressShow = true;
    },
    closeEdit () {
      this.progressShow = false;
      this.progressdata = {};
      this.getList();
    },
    openEdit (row) {
      this.editshow = true;
      this.editTargetId = row.targetId;
      getDetail(row.targetId).then(res => {
        if (res.code === '200') {
          this.editTableData = res.data.infos;
          this.editFormText = this.editFormText.map(formText => {
            return {
              ...formText,
              value: res.data[formText.id]
            }
          })
        }
      })
    },
    canceledit () {
      this.editshow = false;
      this.editTargetId = null;
      this.editTableData = [];
    },
    confirmedit () {
      window.location.href = `/api/earnestMoney/exportDetail/${this.editTargetId}`
    },
  },
  created() {
    this.getList();
    this._getBusinessType();
    this._getDealStatus();
    this._getRefundStatus();
  }
};
</script>

<style lang="less" scoped>
// .container {
//   padding: 20px !important;
// }
</style>
