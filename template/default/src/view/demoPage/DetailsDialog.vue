<template>
  <div id="detailsDialog">
    <el-button
      type="primary"
      @click="visible = true"
    >
      显示弹窗
    </el-button>
    <CDialog
      :visible.sync="visible"
      :cancelShow="false"
      width="1000px"
      title="绑定地块"
      customClass="dialog"
      footerAlign="right"
    >
      <template>
        <div>
          <search-form
            :searchItems="searchItems"
            @onSearch="onSearch"
          />
          <page-table
            :data="data"
            :cols="tableCols"
            operator
            operator-width="120"
            page-align="right"
            selection
            :total="page.total"
            :page-size="page.pageSize"
            :page-current="page.current"
            @mounted="onMounted"
            @size-change="onSizeChange"
            @current-change="onCurrentChange"
            @selection-change="onSelectionChange"
          >
            <template
              slot="operator"
              slot-scope="scope"
            >
              <el-button
                type="primary"
                size="small"
                @click="onCheck(scope.row)"
              >
                查看
              </el-button>
            </template>
          </page-table>
        </div>
      </template>
    </CDialog>
  </div>
</template>
<script>
import CDialog from '@/components/dialog';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';

export default {
  components: {
    CDialog,
    searchForm,
    PageTable
  },
  data () {
    return {
      visible: false,
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '宗地编号',
        span: 8,
        props: {
          fielsName: 'a'
        }
      }, {
        type: 'input',
        label: '宗地编号',
        span: 8,
        props: {
          fielsName: 'a'
        }
      }],
      data: [
        {
          name: '张三',
          sex: '男'
        },
        {
          name: '李四',
          sex: '女'
        }
      ],
      tableCols: [
        { label: '姓名', prop: 'name' },
        { label: '性别', prop: 'sex' }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableInstance: null
    };
  },
  methods: {
    onSearch (val) {
      this.searchVal = {
        ...val
      }
    },
    onMounted (table) {
      this.tableInstance = table
      // TODO
    },
    onCheck (row) {
      // TODO
      console.log(row)
    },
    onSizeChange (size) {
      this.page.pageSize = size
      // TODO
    },
    onCurrentChange (val) {
      this.page.current = val
      // TODO
    },
    onSelectionChange (args) {
      // TODO
    }
  }
};
</script>
<style lang="less">
#detailsDialog{
  .dialog{
    /deep/.el-dialog__body{
      padding-bottom: 0px;
      .comp-page-table{
        margin-top: 20px;
      }
    }
  }
}
</style>
