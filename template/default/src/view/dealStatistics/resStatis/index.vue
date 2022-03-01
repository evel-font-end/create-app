<template>
  <!-- 资源统计 -->
  <div class="container">
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
import { getResourceStatistics } from "@/api/staticAnalysis/index";
import { statusOptions } from "./utils";
import { BUSINESS_TYPE } from "../utils";

export default {
  name: "res_statistics",
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
      // 资源编号、申请数量，资格颁发数、报价数和是否成交
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
        { label: "报价数", prop: "offerCount" },
        {
          label: "状态",
          prop: "statusDesc",
          minWidth: 100,
        },
        {
          label: "交易类型",
          prop: "businessType",
          // render: (h, scope) => {
          //   const { types } = this.$_useTypes(BUSINESS_TYPE);
          //   return (
          //     <div>{types[scope.row.transType] || scope.row.transType}</div>
          //   );
          // },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      searchVal: {
        resourceName: "",
        status: "",
      },
      searchItems: [
        {
          type: "input",
          label: "资源编号",
          props: {
            // placeholder: "请输入编号",
            fieldName: "resourceName",
          },
        },
        {
          type: "select",
          label: "状态",
          props: {
            // placeholder: "请选择状态",
            fieldName: "status",
            options: [],
          },
        },
      ],
      busi_type: null, // 交易类型大类
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
  watch: {},
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
      getResourceStatistics(param).then((res) => {
        const { data, total } = res.data;
        this.page.total = total;
        this.tableData = data;
      });
    },
    getStatus() {
      const option = statusOptions;
      this.$set(this.searchItems[1].props, "options", option);
      this.$forceUpdate();
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
        // 默认打开土地标的详情
        this.busi_type = "land";
        parames = {
          type: "detail",
          id: row.targetId,
        };
        // return;
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
    this.getStatus();
    this.getList();
  },
};
</script>

<style lang="less" scoped>
</style>
