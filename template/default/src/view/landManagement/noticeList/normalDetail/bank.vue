<template>
  <div class="box">
    <wrapper title="银行信息">
      <header-title
      icon="iconfont icon-shouye"
      title="银行信息"
    >
    </header-title>

    <div class="content-view">
      <div class="table">
        <page-table
          ref="pageTable"
          col-align="left"
          operator-width="110"
          :data="tableData"
          :cols="tableCols"
          :selection="true"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          @selection-change="handleSelectChange"
          :showPage="false"
        >
        </page-table>
      </div>
    </div>
    </wrapper>
    <dialog-cont
      @on-cancel="handleDialogCancel"
      @on-confirm="handleDialogConfirm"
      :visible.sync="dialog.addItem"
      :customClass="'dialogCustomClass'"
      title="选择银行"
      width="80%"
      append-to-body
    >
      <dialog-add-item
        :tableCols="[{
          label: '收款单位',
          prop: 'name'
        }, {
          label: '收款银行',
          prop: 'bankName'
        }, {
          label: '收款账户',
          prop: 'no'
        }]"
        :apiPath="dialog.apiPath"
        @selection-change="handleDialogSelectChange"
      />
    </dialog-cont>
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle'
import Flex from '@/components/flex'
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table'
import dialogCont from '@/components/dialog';
import dialogAddItem from './dialogAddItem';
import {
  getTransAccountList
} from '@/api';
export default {
  name: 'bank',
  components: {
    Wrapper,
    PageTable,
    Flex,
    dialogCont,
    headerTitle,
    dialogAddItem
  },
  props: {
    initId: {
      type: [Number, String],
      default: ''
    },
    data: {},
    dto: {
      type: Array,
      default () {
        return []
      }
    },
    show: Boolean
  },
  data () {
    return {
      initAttachData: null,
      tableData: [],
      tableCols: [
        { label: '收款单位', prop: 'name' },
        { label: '收款银行', prop: 'bankName' },
        // { label: '币种', prop: 'currency' },
        { label: '收款账户', prop: 'no' }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      goodsId: this.data.row && this.data.row.id,
      isAdd: !this.data.row,
      isDetail: ['detail'].includes(this.data.configType),
      dialog: {
        addItem: false, // 上传
        title: '增加银行', // 弹窗标题
        apiPath: getTransAccountList,
        selectIds: [],
        selectIdTimes: []
      },
      selectIds: []
    }
  },
  watch: {
    initId (val) {
      this.initId = val;
    },
    data (val) {
      this.data = val;
      this.goodsId = val.row && val.row.id;
      this.isAdd = !val.row;
      this.isDetail = ['detail'].includes(val.configType);
    },
    show (val) {
      if (val) {
        this.getDataAllList();
      }
    },
    dto (val) {
      this.$refs.pageTable.onRowChange(val);
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.pageTable.onRowChange(this.dto);
    });
  },
  created () {
    this.getDataAllList()
  },
  methods: {
    // 获取所有/查询数据列表
    getDataAllList () {
      let data = {
        data: {
          ...this.searchVal
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      getTransAccountList(data).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data
          this.tableData = data;
          this.page.total = total;
          this.publishId(this.tableData);
        }
      })
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList()
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    },
    handleSelectChange (vals) {
      this.selectIds = vals;
      this.publishId(vals);
    },
    handleDelBtnClick () {
      const ids = this.selectIds.map(item => item.id);
      const selectIds = this.dialog.selectIds.filter(item => {
        return ids.indexOf(item.id) > -1 ? null : item;
      });
      this.dialog.selectIds = selectIds;
      this.publishId(this.dialog.selectIds);
    },
    handleAddBtnClick () {
      this.dialog.addItem = true;
    },
    handleDialogCancel () {
      this.dialog.addItem = false
      this.dialog.selectIdTimes = [];
    },
    handleDialogConfirm () {
      this.dialog.addItem = false
      this.dialog.selectIds.push(...this.dialog.selectIdTimes);
      this.dialog.selectIdTimes = [];
      this.publishId(this.dialog.selectIds);
    },
    publishId (items) {
      const ids = items.map(val => val.id);
      this.$emit('change', ids);
    },
    handleDialogSelectChange (vals) {
      this.dialog.selectIdTimes = vals;
    },
    resetForm () {
      this.$refs.pageTable.getPageTable()
    }
  }
};
</script>

<style lang="less" scoped>
.box{
  /deep/#headerTitle .searchBox{
    padding-top: 10px;
  }
  /deep/.comp-wrapper-content{
    padding-top: 0px;
  }
  /deep/.dialogCustomClass{
    .el-dialog__body{
      padding-bottom: 0;
    }
  }
}
</style>
