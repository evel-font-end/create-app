<template>
  <div class="wrapper">
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

<script>
import PageTable from '@/components/new-table';

export default {
  name: 'Test',
  components: {
    PageTable
  },
  data () {
    return {
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

<style scoped>
.wrapper {
  padding: 20px;
}
</style>
