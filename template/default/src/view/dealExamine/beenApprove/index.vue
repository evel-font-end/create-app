/* eslint-disable camelcase */
<template>
  <div id="auditInformation">
    <!-- 审核信息 -->
    <header-title
      icon="iconfont icon-shouye"
      title="审核信息"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        :addBtnVisible="false"
        @on-addBtn="jump('edit', {
          row: 1 || scope.row
        })"
      />
    </header-title>

    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="left"
          operator-width="50"
          operator
          :data="tableData"
          :cols="tableCols"
          :selection="true"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
          <template slot-scope="scope" slot="operator">
            <el-button title="详情" icon="iconfont icon-feeds-fill" type="text" size="small" @click.prevent.stop="jump(scope.row)"></el-button>
          </template>
        </page-table>
      </div>
    </div>
    <edit :show="editshow" :data="editdata" @cancel="closeEdit" :canPrint="1"></edit>
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import Flex from '@/components/flex';
import PageTable from '@/components/page-table';
import Edit from '@/view/dealExamine/auditInformation/Edit/index';
import { getBeenlist } from '@/api/dealExamine/beenApprove';
import { getApproveLinkedBusinessType, getApproveStatus } from '@/api';
export default {
  name: 'been_done',
  data () {
    return {
      searchVal: {
        businessType: '',
        status: '',
        startCreateDate: '',
        endCreateDate: '',
        approveTitle: ''
      },
      searchItems: [
        {
          type: 'input',
          label: '事项：',
          labelWidth: '45px',
          props: {
            placeholder: '请输入事项',
            fieldName: 'approveTitle'
          }
        },
        {
          type: 'select',
          label: '类别',
          labelWidth: '45px',
          props: {
            fieldName: 'businessType',
            placeholder: '请选择类别',
            width: '160px',
            options: []
          }
        },
        {
          type: 'select',
          label: '状态',
          labelWidth: '45px',
          props: {
            fieldName: 'status',
            placeholder: '状态',
            width: '90px',
            options: []
          }
        },
        {
          type: 'dataPicker',
          label: '完成时间',
          labelWidth: '80px',
          props: {
            fieldName: 'date',
            width: '280px',
            type: 'daterange'
          }
        }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '事项', prop: 'approveTitle', minWidth: 340 },
        { label: '类别', prop: 'refTableNameText', minWidth: 120 },
        { label: '来源', prop: 'createUserText' },
        { label: '状态', prop: 'status', minWidth: '80px' },
        { label: '当前处理人', prop: 'curApproveUserRealName', minWidth: 100 },
        // { label: '关联方式', prop: 'associationMethodText' },
        { label: '完成时间', prop: 'createDate', width: '180px' }
      ],
      editshow: false,
      editdata: {}
    };
  },
  created () {
    this.getSearchOptionList();
    this.getDataAllList();
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Edit,
    Flex
  },
  methods: {
    closeEdit (type) {
      this.editshow = false;
      if (type === 'cancel' || type === 'success') {
        this.onCurrentChange(1);
      }
    },
    onSearch (val) {
      this.searchVal = {
        businessType: val.businessType ? val.businessType : '',
        status: val.status ? val.status : '',
        startCreateDate: (val.date && val.date[0]) || '',
        endCreateDate: (val.date && val.date[1]) || '',
        approveTitle: val.approveTitle ? val.approveTitle : ''
      };
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
      getBeenlist(data).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data;
          this.tableData = data;
          this.page.total = total;
        }
      });
    },
    getSearchOptionList () {
      this.searchItems[0].props.options = [];
      this.searchItems[2].props.options = [];
      let _this = this;
      getApproveLinkedBusinessType().then(res => {
        if (res.code === '200') {
          res.data.map(item => {
            _this.searchItems[1].props.options.push({
              name: item.value,
              id: item.key
            });
          });
        }
      });
      getApproveStatus().then(res => {
        if (res.code === '200') {
          res.data.map(item => {
            _this.searchItems[2].props.options.push({
              name: item.value,
              id: item.key
            });
          });
        }
      });
      this.$forceUpdate();
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList();
    },
    onPageSizeChange (val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    jump (row) {
      this.editdata = {
        ...row,
        approveId: row.id,
        refId: row.refId,
        // approveLinkedId: row.approveLinkedId,
        status: row.status === '审批中' ? 1 : 0,
        businessType: row.businessType,
        isShowBtn: false,
        canApprove: row.canApprove,
        approveTitle: row.approveTitle,
        refTableNameText: row.refTableNameText,
        pageType: true,
        title:''
      }
      this.editshow = true;
    }
  }
};
</script>

<style lang="less">
#auditInformation {
  .Modeltable{
    >.comp-page-table{
      padding:0 20px;
      background: #fff;
    }
  }
}
</style>
