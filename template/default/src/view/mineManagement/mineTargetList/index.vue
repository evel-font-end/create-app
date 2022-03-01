<template>
  <div class="container">
    <header-title
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        :addBtnVisible="$_hasOperation($options.name,'add')"
        :delBtnVisible="false && $_hasOperation($options.name,'delete')"
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
      operator-width="110"
      :page-current="page.current"
      :total="page.total"
      :page-size="page.pageSize"
      @current-change="onCurrentChange"
      @size-change="onPageSizeChange"
      @selection-change="onCurrentSelection"
    >
      <template slot-scope="scope" slot="operator">
        <el-button type="text" size="small" title="详情" icon="iconfont icon-feeds-fill" @click="toPage(scope.row.id,'info')" v-if="$_hasOperation($options.name,'examine')"></el-button>
        <el-button type="text" size="small" title="编辑" icon="iconfont icon-xiugaii" @click="toPage(scope.row.id,'edit')" v-if="(scope.row.canEdit===1)&&($_hasOperation($options.name,'edit'))"></el-button>
        <!-- <el-button type="text" size="small" title="审核进度" icon="iconfont icon-trackProgress" @click="toPageProgress(scope.row)"></el-button> -->
      </template>
    </page-table>
    <edit
      :show="editshow"
      :type="editdata.type"
      :id="editdata.id"
      @cancel="editshow=false"
      @success="editSuccess"
    ></edit>
    
    <edit-progress 
      :show="progressShow" 
      :data="progressdata" 
      @cancel="closeEdit"
    ></edit-progress>
  </div>
</template>
<script>
import PageTable from '@/components/page-table';
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import edit from './Edit/edit';
import {
  getTransMineTargetList,
  getMineBusinessType,
  getTransactionType,
  getTargetStatus,
  delTransByIds
} from '@/api/mineManagement/mineTargetList';
import editProgress from '@/view/dealExamine/auditInformation/Edit/index';

export default {
  name: 'mine_target_list',
  components: {
    PageTable,
    headerTitle,
    searchForm,
    edit,
    editProgress
  },
  data () {
    return {
      tableCols: [
        { label: '矿区名称', prop: 'name', minWidth: 200 },
        { label: '交易方式', prop: 'transTypeText', width: '140px' },
        { label: '交易类型', prop: 'businessTypeText', width: '120px' },
        { label: '起始价（万元）', prop: 'beginPriceText', minWidth: 120, align: 'right' },
        { label: '保证金（万元）', prop: 'earnestMoneyText', minWidth: 120, align: 'right' },
        { label: '加价幅度（万元）', prop: 'priceStepText', minWidth: 120, align: 'right' },
        { label: '状态', prop: 'statusText', width: '80px' },
        { label: '创建时间', prop: 'createDate', width: '180px' }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      dialogShow: false,
      searchVal: {
        no: '', // 编号
        transType: '', // 交易方式
        businessType: '', // 交易类型
        status: '', // 状态
        goodsType: ''
      },
      searchItems: [
        {
          type: 'input',
          label: '矿区名称：',
          props: {
            placeholder: '请输入矿区名称',
            fieldName: 'no'
          }
        },
        {
          type: 'select',
          label: '交易方式：',
          props: {
            fieldName: 'transType',
            placeholder: '交易方式选择',
            options: []
          }
        },
        {
          type: 'select',
          label: '交易类型：',
          props: {
            fieldName: 'businessType',
            placeholder: '交易类型选择',
            options: []
          }
        },
        {
          type: 'select',
          label: '状态：',
          labelWidth: '45px',
          props: {
            fieldName: 'status',
            placeholder: '状态选择',
            options: []
          }
        }
      ],
      tableDataSelect: [],
      editshow: false,
      editdata: {},
      progressShow: false,
      progressdata: {}
    };
  },
  methods: {
    editSuccess ($event) {
      if ($event.code === '200') {
        this.editshow = !this.editshow;
        this.getList();
      }
    },
    onCurrentSelection (val) {
      this.tableDataSelect = val;
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getList();
    },
    onPageSizeChange (val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    toPage (id, type) {
      this.editdata = { type: type, id: id };
      this.editshow = true;
    },
    closeEdit () {
      this.progressShow = false;
      this.progressdata = {};
      this.getList();
    },
    toPageProgress (row) {
      this.progressdata = {
        approveId: row.id,
        refId: row.refId,
        // approveLinkedId: row.approveLinkedId,
        status: row.status,
        businessType: row.businessType,
        isShowBtn: false,
        type:'target',
        pageType: false,
        title:row.no
      }
      this.progressShow = true;
    },
    delData () {
      if (this.tableDataSelect.length !== 0) {
        const ids = this.tableDataSelect.map(item => item.id);

        this.$alert('确定删除？', '提示', {
          confirmButtonText: '确定'
        })
          .then(() => {
            delTransByIds(ids)
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
    // 查询
    onSearch (val) {
      this.searchVal.no = val.no ? val.no : '';
      this.searchVal.transType = val.transType ? val.transType : '';
      this.searchVal.businessType = val.businessType ? val.businessType : '';
      this.searchVal.status = val.status ? +val.status : '';
      this.page.current = 1;
      this.getList();
    },
    // 获取列表
    getList () {
      const param = {
        data: this.searchVal,
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      getTransMineTargetList(param).then(res => {
        const { data, total } = res.data;
        this.page.total = total;
        this.tableData = data;
      });
    },
    // 获取交易方式下拉框数据
    _getMineBusinessType () {
      this.searchItems[2].props.options = [];
      getMineBusinessType().then(res => {
        if (res.code === '200') {
          res.data.map(item => {
            this.searchItems[2].props.options.push({
              name: item.value,
              id: item.key
            });
          });
        }
      });
      this.$forceUpdate();
    },
    // 获取交易类型下拉框数据
    _getTransactionType () {
      this.searchItems[1].props.options = [];
      getTransactionType().then(res => {
        if (res.code === '200') {
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
    // 获取状态下拉
    _getTargetStatus () {
      this.searchItems[3].props.options = [];
      getTargetStatus().then(res => {
        if (res.code === '200') {
          res.data.map(item => {
            this.searchItems[3].props.options.push({
              name: item.value,
              id: `${item.key}`
            });
          });
        }
      });
      this.$forceUpdate();
    }
  },
  created () {
    this._getMineBusinessType();
    this._getTransactionType();
    this._getTargetStatus();
    this.getList();
  }
};
</script>
