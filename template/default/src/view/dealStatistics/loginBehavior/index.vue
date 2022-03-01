<template>
  <!-- 用户登录行为 -->
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
  </div>
</template>

<script>
import PageTable from "@/components/page-table";
import headerTitle from "components/headerTitle/headerTitle";
import searchForm from "components/searchForm/searchForm";
import { getUsersLoginStatistics } from "@/api/staticAnalysis/index";

export default {
  name: "login_behavior",
  components: {
    PageTable,
    headerTitle,
    searchForm,
  },
  data() {
    return {
      // 用户名、单位名、登录次数、登录成功数和登录失败次数
      tableCols: [
        { label: "登录名", prop: "userName" },
        { label: "单位名", prop: "companyName" },
        { label: "登录次数", prop: "loginCount" },
        { label: "登录成功数", prop: "loginSuccessCount" },
        {
          label: "登录失败次数",
          prop: "loginFailedCount",
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      searchVal: {
        companyName: "",
        loginName: "",
        userName: "",
      },
      searchItems: [
        {
          type: "input",
          label: "登录名",
          props: {
            fieldName: "userName",
          },
        },
        {
          type: "input",
          label: "单位名",
          props: {
            fieldName: "companyName",
          },
        },
      ],
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
      getUsersLoginStatistics(param).then((res) => {
        const { data, total } = res.data;
        this.page.total = total;
        this.tableData = data;
      });
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="less" scoped>
</style>
