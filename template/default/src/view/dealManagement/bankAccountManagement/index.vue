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
    >
    </page-table>
  </div>
</template>

<script>
import PageTable from "@/components/page-table";
import headerTitle from "components/headerTitle/headerTitle";
import searchForm from "components/searchForm/searchForm";
import {
  getTransAccountList
} from "@/api/dealManagement/bankAccountManagement";

export default {
  name: "bank_account_management",
  components: {
    PageTable,
    headerTitle,
    searchForm
  },
  data() {
    return {
      tableCols: [
        { label: "收款单位", prop: "name", minWidth: 250 },
        { label: "收款银行", prop: "bankName", minWidth: 300 },
        { label: "收款账户", prop: "no", minWidth: 220 }
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
          label: "收款银行：",
          props: {
            width: "180px",
            placeholder: "请输入收款银行",
            fieldName: "bankName"
          }
        }
      ]
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
        ...val
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
      getTransAccountList(param).then(res => {
        const { data, total } = res.data;
        this.page.total = total;
        this.tableData = data;
      });
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="less" scoped>
// .container {
//   padding: 20px !important;
// }
</style>
