<template>
  <div class="container">
    <header-title
      
    >
      <search-form
        slot="searchBox"
        :labelWidth="labelWidth"
        :searchItems="searchItems"
        @onSearch="onSearch"
        :addBtnVisible="$_hasOperation($options.name,'add')"
        :delBtnVisible="$_hasOperation($options.name,'delete')"
        @on-addBtn="toPage('','add')"
        @on-delBtn="delData"
      />
    </header-title>
    <page-table
      :data="tableData"
      :cols="tableCols"
      col-align="left"
      selection
      operator
      :operatorWidth="150"
      operator-width="100"
      :page-current="page.current"
      :total="page.total"
      :page-size="page.pageSize"
      @current-change="onCurrentChange"
      @size-change="onPageSizeChange"
      @selection-change="onCurrentSelection"
    >
      <template slot-scope="scope" slot="operator">
        <el-button type="text" size="small" title="详情" icon="iconfont icon-feeds-fill" @click="toPage(scope.row,'info')" v-if="$_hasOperation($options.name,'examine')"></el-button>
        <el-button type="text" size="small" title="编辑" icon="iconfont icon-xiugaii" @click="toPage(scope.row,'edit')" v-if="$_hasOperation($options.name,'edit')"></el-button>
      </template>
    </page-table>
    <edit :show="editshow" :data="editdata" @cancel="closeEdit"></edit>
  </div>
</template>
<script>
import PageTable from "@/components/page-table";
import headerTitle from "@/components/headerTitle/headerTitle";
import searchForm from "components/searchForm/searchForm";
import dialogCont from "@/components/dialog";
import edit from "./Edit/index";
import {
  getTransHelpList,
  getHelpType,
  getDeleteTransHelp
} from '@/api/helpCenter/helpList';
export default {
  name: "help_list",
  components: {
    PageTable,
    headerTitle,
    searchForm,
    dialogCont,
    edit
  },
  data() {
    return {
      searchVal: {
        fileName: "",
        helpType: ""
      },
      labelWidth: "85px",
      searchItems: [
        {
          type: "input",
          label: "资料名称",
          props: {
            width:'140px',
            placeholder: "请输入资料名称",
            fieldName: "fileName"
          }
        },
        {
          type: "select",
          label: "资料类型",
          props: {
            fieldName: "helpType",
            placeholder: "资料类型选择",
            options: []
          }
        }
      ],
      tableCols: [
        { label: "资料名称", prop: "name", minWidth: 180 },
        { label: "资料类型", prop: "helpType",
          render: (h, scope) => {
            const type = scope.row.helpType;
            if(type === 101){
              return <div>资料文档</div>;
            }else{
              return <div>交易流程</div>;

            }
          }
        },
        { label: "备注", prop: "remark", minWidth: 180 },
        { label: "创建人", prop: "createUserRealName" },
        { label: "创建时间", prop: "createDate", width: '180px' }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableDataSelect: [],
      tableData: [],
      editshow: false,
      editdata: {}
    };
  },
  methods: {
    /**
     * 查询
     */
    onSearch(val) {
      this.searchVal = {
        ...val
      };
      this.page.current = 1;
      this.getList();
    },
    /**
     * 查看详情
     */
    toPage (data, type) {
      this.editshow = true;
      this.editdata = type === 'add' ? { type: type } : { type: type, data: data };
    },
    
    delData () {
      if (this.tableDataSelect.length !== 0) {
        const helpId = this.tableDataSelect.map(item => item.id);
        this.$alert('确定删除？', '提示', {
          confirmButtonText: '确定'
        })
          .then(() => {
            getDeleteTransHelp(helpId)
              .then(res => {
                if (res.code === '200') {
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
          title: '失败',
          message: '请先选择数据!!!',
          position: 'bottom-right'
        });
      }
    },
    closeEdit(type) {
      this.editshow = false;
      this.getList();
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
    /**
     * 获取资料类型下拉框数据
     */
    _getHelpType() {
      this.searchItems[1].props.options = [];
      getHelpType().then(res => {
        if (res.code === "200") {
          res.data.map(item => {
            this.searchItems[1].props.options.push({
              name: item.value,
              id: item.key
            });
          });
        }
        this.$forceUpdate();
      });
    },
    getList() {
      const param = {
        data: this.searchVal,
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      getTransHelpList(param).then(res => {
        const { data, total } = res.data;
        this.page.total = total;
        this.tableData = data;
      });
    },
  },
  created() {
    this._getHelpType();
    this.getList();
  }
};
</script>
<style lang="less" scoped>
.el-table .cell span {
  color: #25adf1 !important;
  cursor: default;
}
.el-table .cell span:hover {
  color: #2573f1 !important;
  cursor:pointer;
}
.dialogTxt{
  padding: 0px 0px 20px 20px;
  font-size: 15px;
}
</style>
