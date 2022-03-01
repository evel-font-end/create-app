<template>
  <div>
    <search-form
      ref="searchForm"
      :searchItems="searchItems"
      @onSearch="onSearch"
    />
    <page-table
      ref="table"
      col-align="left"
      :data="tableData"
      :cols="tableCols"
      :selection="true"
      :page-current="page.current"
      :total="page.total"
      :page-size="page.pageSize"
      @current-change="onCurrentChange"
      @size-change="onPageSizeChange"
      @selection-change="onSelectChange"
    >
    </page-table>
    </div>
</template>

<script>
import PageTable from '@/components/page-table'
import searchForm from 'components/searchForm/searchForm';
export default {
  name: 'dialogAdditem',
  components: {
    PageTable,
    searchForm
  },
  props: {
    apiPath: {
      type: Function
    },
    tableCols: {
      type: Array,
      default () {
        return []
      }
    },
    businessOptions: {
      type: Array,
      default () {
        return []
      }
    },
    transactionOptions: {
      type: Array,
      default () {
        return []
      }
    },
    businessType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '编号',
        props: {
          fieldName: 'no'
        },
        span: 5
      }, {
        type: 'select',
        label: '交易类型',
        props: {
          fieldName: 'businessType',
          options: this.businessOptions
        },
        span: 5
      }, {
        type: 'select',
        label: '交易方式',
        props: {
          fieldName: 'transType',
          options: this.transactionOptions
        },
        span: 5
      }],
      tableData: [],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  watch: {
    businessType(val) {
      this.businessType = val;
      this.searchItems[1].initValue = val;
    }
  },
  methods: {
    onSearchItem (val, items) {
      this.$refs.searchForm.forceUpdate();
      this.searchVal = {
        ...val
      };
      this.page.current = 1;
      this.getDataAllList();
      setTimeout(() => {
        if (items && this.$refs.table) {
          this.tableItemData = items;
          this.$refs.table.onRowChange(items)
        }
      }, 500);
    },
    onSearch (val) {
      this.searchVal = {
        ...val
      }
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList () {
      let data = {
        data: {
          ...this.searchVal
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      this.apiPath(data).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data
          this.tableData = data;
          this.page.total = total;
        }
      })
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList()
      setTimeout(() => {
        if (this.tableItemData && this.$refs.table) {
          this.$refs.table.onRowChange(this.tableItemData)
        }
      }, 1000);
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    },
    onSelectChange (val) {
      this.$emit('selection-change', val);
    },
    clear () {
      this.$refs.table.getPageTable();
    },
    rowChange (items){
      this.tableItemData = items;
      this.$refs.table.onRowChange(items)
    }
  },
  created () {
    // this.getDataAllList()
  }
}
</script>

<style>

</style>
