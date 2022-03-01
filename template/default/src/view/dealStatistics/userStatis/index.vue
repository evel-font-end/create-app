/* eslint-disable camelcase */
<template>
  <div id="user_statistics">
    <!-- 用户统计 -->
    <header-title>
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
      />
    </header-title>

    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="left"
          operator-width="110"
          :operator="false"
          :data="tableData"
          :cols="tableCols"
          :selection="false"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
        </page-table>
      </div>
    </div>
  </div>
</template>

<script>
import headerTitle from "components/headerTitle/headerTitle";
import searchForm from "components/searchForm/searchForm";
import PageTable from "@/components/page-table";
import { getUsersStatistics } from "@/api/staticAnalysis/index";
export default {
  name: "user_statistics",
  data() {
    return {
      searchVal: {
        userName: "",
        loginName: "",
      },
      searchItems: [
        {
          type: "input",
          label: "用户名",
          props: {
            fieldName: "userName"
          },
        },
        {
          type: "input",
          label: "登录名",
          props: {
            fieldName: "loginName",
          },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      // <!-- 用户名、登录名、登录次数、资源申请数、获得资格数、报价数和竞得数 -->
      tableCols: [
        { label: "登录名", prop: "loginName" },
        { label: "用户名", prop: "userName" },
        { label: "登录次数", prop: "loginCount" },
        { label: "资源申请数", prop: "approveCount" },
        { label: "获得资格数", prop: "seniorityCount" },
        { label: "报价数", prop: "offerCount" },
        { label: "竞得数", prop: "dealCount" },
      ],
    };
  },
  created() {
    this.getDataAllList();
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
  },
  methods: {
    onSearch(val) {
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList() {
      let data = {
        data: this.searchVal,
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
      };
      getUsersStatistics(data).then((res) => {
        if (res.code === "200") {
          const { data, total } = res.data;
          this.tableData = data;
          this.page.total = total;
        }
      });
    },
    onCurrentChange(val) {
      this.page.current = val;
      this.getDataAllList();
    },
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
  },
};
</script>

<style lang="less">
#user_statistics {
}
</style>
