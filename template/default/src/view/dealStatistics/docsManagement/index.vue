<template>
  <div class="container">
    <!-- 文档管理 -->
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
    <bidding-info :show="bInfoShow" :data="bInfoData" @cancel="dialogCancel" />
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
import { Base64 } from "js-base64";
import PageTable from "@/components/page-table";
import headerTitle from "components/headerTitle/headerTitle";
import searchForm from "components/searchForm/searchForm";
import biddingInfo from "./biddingInfo";
import { getFileManageStatistics } from "@/api/staticAnalysis/index";
import { getTransBook } from "@/api/dealManagement/updatedealList";
import { BUSINESS_TYPE } from "../utils";
export default {
  name: "bidding_appliation",
  components: {
    PageTable,
    headerTitle,
    searchForm,
    biddingInfo,
    LandDetail: () => import("@/view/landManagement/tarageList/Edit/edit"), // 土地
    MineDetail: () => import("@/view/mineManagement/mineTargetList/Edit/edit"), // 业矿
    PlowDetail: () => import("@/view/plowMmanagement/lowIndexList/Edit/index"), // 耕地
  },
  data() {
    return {
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
        { label: "申请人", prop: "applyUser" },
        {
          label: "竞买申请书",
          prop: "applyBook",
          render: (h, scope) => {
            return (
              <div>
                {
                  <div>
                    {
                      <el-button
                        size="mini"
                        type="text"
                        onClick={() => {
                          this.toTransBooks(scope.row.applyBook);
                        }}
                      >
                        {scope.row.applyBook && scope.row.applyBook.bookName}
                      </el-button>
                    }
                  </div>
                }
              </div>
            );
          },
        },
        {
          label: "资格确认书",
          prop: "confirmBook",
          render: (h, scope) => {
            return (
              <div>
                {
                  <div>
                    <el-button
                      size="mini"
                      type="text"
                      onClick={() => {
                        this.toTransBooks(scope.row.confirmBook);
                      }}
                    >
                      {scope.row.confirmBook && scope.row.confirmBook.bookName}
                    </el-button>
                  </div>
                }
              </div>
            );
          },
        },
        {
          label: "报价单",
          prop: "offerDto",
          render: (h, scope) => {
            return (
              <div>
                {
                  <div>
                    <el-button
                      size="mini"
                      type="text"
                      onClick={() => {
                        this.showView(scope.row.offerDto);
                      }}
                    >
                      竞价记录
                    </el-button>
                  </div>
                }
              </div>
            );
          },
        },
        {
          label: "成交通知书",
          prop: "dealBook",
          render: (h, scope) => {
            //  icon="iconfont icon-chengjiaotongzhishu"
            return (
              <div>
                {
                  <div>
                    <el-button
                      size="mini"
                      type="text"
                      onClick={() => {
                        this.toTransBooks(scope.row.dealBook);
                      }}
                    >
                      {scope.row.dealBook && scope.row.dealBook.bookName}
                    </el-button>
                  </div>
                }
              </div>
            );
          },
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
      searchVal: {
        resourceName: "",
        applyUser: "",
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
          type: "input",
          label: "申请人",
          props: {
            fieldName: "applyUser",
          },
        },
      ],
      bInfoShow: false,
      bInfoData: {},
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
      getFileManageStatistics(param).then((res) => {
        const { data, total } = res.data;
        this.page.total = total;
        this.tableData = data;
      });
    },
    // 打开文件内容
    toTransBooks(row) {
      //打开一个不被拦截的新窗口
      getTransBook(row.licenseId, row.bookNo).then((res) => {
        if (res.code === "200") {
          const visitFilePath = res.data.visitFilePath.split(':');
          const { href } = this.$router.resolve({
            name: "pdf",
            query: {
              path: Base64.encode(visitFilePath[1] || res.data.visitFilePath),
              fileCode: Base64.encode(res.data.fileCode),
            },
          });
          window.open(href, "_blank");
        }
      });
    },
    // 查看竞价记录
    showView(data) {
      this.bInfoData = {
        data: [...data],
      };
      this.bInfoShow = true;
    },
    dialogCancel(type) {
      this.bInfoData = {};
      this.bInfoShow = false;
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
        // this.busi_type = "land";
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
