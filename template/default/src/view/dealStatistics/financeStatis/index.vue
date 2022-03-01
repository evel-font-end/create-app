<template>
  <div class="container">
    <!-- 财务统计 -->
    <header-title>
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
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
    >
    </page-table>
    <!-- 标的详情 -->
    <!-- 矿业 -->
    <MineDetail
      :show="dialog.mine.editshow"
      :type="dialog.mine.editdata.type"
      :id="dialog.mine.editdata.id"
      @cancel="cancel"
    />
    <!-- 土地 -->
    <LandDetail
      :show="dialog.land.editshow"
      :type="dialog.land.editdata.type"
      :id="dialog.land.editdata.id"
      @cancel="cancel"
    />
    <!-- 耕地 -->
    <PlowDetail
      :show="dialog.plow.editshow"
      :data="dialog.plow.editdata"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import PageTable from "@/components/page-table";
import headerTitle from "components/headerTitle/headerTitle";
import searchForm from "components/searchForm/searchForm";
import { getFinanceStatistics } from "@/api/staticAnalysis/index";
import { BUSINESS_TYPE } from "../utils";

export default {
  name: "fina",
  components: {
    PageTable,
    headerTitle,
    searchForm,
    LandDetail: () => import("@/view/landManagement/tarageList/Edit/edit"), // 土地
    MineDetail: () => import("@/view/mineManagement/mineTargetList/Edit/edit"), // 业矿
    PlowDetail: () => import("@/view/plowMmanagement/lowIndexList/Edit/index"), // 耕地
  },
  data() {
    return {
      // 资源编号的申请人数、缴纳保证人数、累计保证金（万元）、累计报价（笔）、成交价（万元）和溢出低价（万元）
      tableCols: [
        {
          label: "资源编号",
          prop: "resourceName",
          minWidth: "100px",
          render: (h, scope) => {
            return (
              <div>
                {
                  <div>
                    <el-button
                      size="mini"
                      type="text"
                      onClick={() => {
                        this.toDetail(scope.row, "info");
                      }}
                    >
                      {scope.row.resourceName}
                    </el-button>
                  </div>
                }
              </div>
            );
          },
        },
        { label: "申请数量", prop: "approveCount" },
        { label: "资格颁发数", prop: "seniorityCount" },
        {
          label: "累计保证金（万元）",
          prop: "earnestMoney",
          render: (h, scope) => {
            return <div>{this.formatMoney(scope.row.earnestMoney)}</div>;
          },
        },
        { label: "累计报价（笔）", prop: "offerCount" },
        {
          label: "成交价（万元）",
          prop: "finalPrice",
          // render: (h, scope) => {
          //   return <div>{this.formatMoney(scope.row.finalPrice)}</div>;
          // },
        },
        {
          label: "溢出低价（万元）",
          prop: "overflowPrice",
          // render: (h, scope) => {
          //   return <div>{this.formatMoney(scope.row.overflowPrice)}</div>;
          // },
        },
        {
          label: "状态",
          prop: "statusText"
        },
        {
          label: "交易类型",
          prop: "transType",
          render: (h, scope) => {
            const { types } = this.$_useTypes(BUSINESS_TYPE);
            return (
              <div>{types[scope.row.transType] || scope.row.transType}</div>
            );
          },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      searchVal: {},
      searchItems: [
        {
          type: "input",
          label: "资源编号",
          props: {
            // placeholder: "请输入编号",
            fieldName: "resourceName",
          },
        },
      ],
      busi_type: null,
      dialog: {
        land: {
          editshow: false,
          editdata: {},
        },
        mine: {
          editshow: false,
          editdata: {},
        },
        plow: {
          editshow: false,
          editdata: {},
        },
      },
    };
  },
  methods: {
    // 元转为万元
    formatMoney(value) {
      // value = this.splitMoney(Math.round((value / 10000) * 100) / 100);
      value = this.splitMoney(value / 10000);
      return value;
    },
    // 加上分割符
    splitMoney(str) {
      var reg = /(\d)(?=(?:\d{3})+\b)/g;
      return str.toString().replace(reg, "$1,");
    },
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
      };
      this.page.current = 1;
      this.getList();
    },
    // 获取列表
    getList() {
      const param = {
        data: this.searchVal,
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
      };
      getFinanceStatistics(param).then((res) => {
        const { data, total } = res.data;
        this.page.total = total;
        this.tableData = data;
      });
    },
    // 打开标的详情
    toDetail(row) {
      // type == info
      // let id = row.targetId;
      let type = row.transType;
      this.loadCompomentByType(row, type);
    },
    // 根据type打开不同的弹窗
    loadCompomentByType(row, type) {
      let parames = "";
      if (type == "MINE_BUSINESS_TYPE") {
        // 矿业
        this.busi_type = "mine";
        parames = {
          type: "info",
          id: row.targetId,
        };
      } else if (type == "PLOW_BUSINESS_TYPE") {
        // 耕地
        this.busi_type = "plow";
        parames = {
          configType: "detail",
          ...{
            row: {
              id: row.targetId,
            },
          },
          btnStatusData: { isRestart: null },
        };
      } else if (type == "LAND_BUSINESS_TYPE") {
        // 土地
        this.busi_type = "land";
        parames = {
          type: "detail",
          id: row.targetId,
        };
      } else {
        // this.type = "land";
        return;
      }
      this.dialog[this.busi_type].editdata = parames;
      this.dialog[this.busi_type].editshow = true;
    },
    cancel() {
      let type = this.busi_type;
      this.dialog[type].editshow = false;
      this.dialog[type].editdata = {};
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="less" scoped>
// .container {
//   padding: 20px !important;
// }
</style>
