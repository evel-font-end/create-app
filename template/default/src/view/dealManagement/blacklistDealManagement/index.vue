<template>
  <div class="container">
    <!-- <router-view v-if="routeName == 'taragelistEdit'"></router-view> -->
    <!-- <template> -->
    <header-title
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        :labelWidth="labelWidth"
        @onSearch="onSearch"
        :addBtnVisible="$_hasOperation($options.name, 'add')"
        :delBtnVisible="$_hasOperation($options.name, 'delete')"
        @on-addBtn="toPage('', 'add')"
        @on-delBtn="delData"
      />
    </header-title>

    <page-table
      :data="tableData"
      :cols="tableCols"
      col-align="left"
      selection
      operator
      operator-width="100"
      :page-current="page.current"
      :total="page.total"
      :page-size="page.pageSize"
      @current-change="onCurrentChange"
      @size-change="onPageSizeChange"
      @selection-change="onCurrentSelection"
    >
      <template slot-scope="scope" slot="operator">
        <el-button
          type="text"
          size="small"
          title="编辑"
          icon="iconfont icon-xiugaii"
          @click="toPage(scope.row, 'edit')"
        ></el-button>
      </template>
    </page-table>
    <edit :show="editshow" :data="editdata" @cancel="closeEdit"></edit>
  </div>
</template>

<script>
import PageTable from "@/components/page-table";
import headerTitle from "components/headerTitle/headerTitle";
import searchForm from "components/searchForm/searchForm";
import edit from "./Edit/edit";
import {
  getListInfoList,
  getBusinessType,
  toBlacklistDelete,
  getUserList
} from "@/api/dealManagement/blacklistDealManagement";

export default {
  name: "blacklist_deal_management",
  components: {
    PageTable,
    headerTitle,
    searchForm,
    edit
  },
  data() {
    return {
      tableCols: [
        { label: "竞买人名称", prop: "bidderName", minWidth: 200 },
        {
          label: "竞买人类型",
          prop: "banTypeName",
          minWidth: 200,
          render: (h, scope) => {
            const type = scope.row.banTypeName;
            let typeName = "";
            for (let i = 0; i < type.length; i++) {
              if (type[i] != null) {
                typeName += type[i] + ",";
              }
            }
            typeName = typeName.substring(0, typeName.length - 1);
            return <div>{typeName}</div>;
          }
        },
        { label: "加入时间", prop: "createDate", width: "180px" },
        { label: "处罚截止时间", prop: "limitTime", width: "180px" }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      dialogShow: false,
      searchVal: {
        banType: "",
        bidderName: "",
        createUserId: "",
        id: ""
      },
      labelWidth: "85px",
      searchItems: [
        {
          type: "input",
          label: "竞买人名称：",
          props: {
            width: "140px",
            placeholder: "请输入竞买人名称",
            fieldName: "bidderName"
          }
        },
        {
          type: "select",
          label: "竞买人类型：",
          props: {
            width: "140px",
            fieldName: "banType",
            placeholder: "竞买人类型选择",
            options: []
          }
        }
      ],
      tableDataSelect: [],
      editshow: false,
      editdata: {}
    };
  },
  methods: {
    editSuccess($event) {
      if ($event === "200") {
        this.editshow = !this.editshow;
        this.getList();
      }
    },
    onCurrentSelection(val) {
      this.tableDataSelect = val;
    },
    onCurrentChange(val) {
      this.page.current = val;
      this.getList();
    },
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    toPage(row, type) {
      this.editshow = true;
      this.editdata = type === 'add' ? {data: {}, type : type} : {data: row, type : type};
    },
    delData() {
      if (this.tableDataSelect.length !== 0) {
        const ids = this.tableDataSelect.map(item => item.id);
        this.$alert("确定删除？", "提示", {
          confirmButtonText: "确定"
        })
          .then(() => {
            toBlacklistDelete(ids)
              .then(res => {
                if (res.code === "200") {
                  this.getList();
                }
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$notify.error({
          title: "失败",
          message: "请先选择数据!!!",
          position: "bottom-right"
        });
      }
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
      getListInfoList(param).then(res => {
        const { data, total } = res.data;
        this.page.total = total;
        this.tableData = data;
      });
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
    // 获取所有用户
    _getUserList() {
      this.searchItems[0].props.options = [];
      getUserList().then(res => {
        if (res.code === "200") {
          res.data.map(item => {
            this.searchItems[0].props.options.push({
              name: item.realName,
              id: item.realName
            });
          });
        }
      });
      this.$forceUpdate();
    },
    closeEdit() {
      this.editshow = false;
      this.getList();
    }
  },
  created() {
    this.getList();
    // this._getUserList();
    this._getBusinessType();
  }
};
</script>

<style lang="less" scoped>
// .container {
//   padding: 20px !important;
// }
</style>
