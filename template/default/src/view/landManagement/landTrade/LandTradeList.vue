<template>
  <div id="landTradeList">
    <!-- <router-view v-if="routeName == 'landTradeConfig'"></router-view> -->
    <header-title
    >
      <search-form
        slot="searchBox"
        :searchItems="filterItems"
        labelWidth="70px"
        @onSearch="onSearch"
        :addBtnVisible="$_hasOperation($options.name,'add')"
        :delBtnVisible="$_hasOperation($options.name,'delete') && false"
        otherBtnVisible
        :otherBtnLists="[{
          label: '批量提交',
          click: () => batchSubmit()
        }]"
        @on-addBtn="onAdd"
        @on-delBtn="reqDeleteGoods"
      />
    </header-title>
    <page-table
      :data="tableData"
      :cols="tableCols"
      operator
      operator-width="150"
      :page-current="page.current"
      :page-size="page.pageSize"
      :total="page.total"
      selection
      @size-change="onPageSizeChange"
      @current-change="onCurrentChange"
      @selection-change="onSelectionChange"
    >
      <template slot-scope="scope" slot="operator">
        <el-button type="text" title="详情" size="small" icon="iconfont icon-feeds-fill" @click="routeTo('detail', {targetId: scope.row.targetId, id: scope.row.targetId, canPush: scope.row.canPush})" v-if="$_hasOperation($options.name,'examine')"></el-button>
        <el-button type="text" title="编辑" size="small" icon="iconfont icon-xiugaii" @click="routeTo('edit', {targetId: scope.row.targetId, id: scope.row.targetId})" v-if="(scope.row.canEdit === 1)&&($_hasOperation($options.name,'add'))" ></el-button>
        <el-button
          icon="iconfont icon-wancheng" type="text" size="small" title="提交"
          @click.prevent.stop="handleSubmit(scope.row)"
          v-if="(scope.row.canCommit === 1)">
        </el-button>
        <el-button 
          icon="iconfont icon-yubaofabu" type="text" size="small" title="受理"
          @click.prevent.stop="handleRelease(scope.row)"
          v-if="(scope.row.canPush === 1)">
        </el-button>
        <el-button type="text" size="small" title="审核进度" icon="iconfont icon-trackProgress" @click="toPageProgress(scope.row)" v-if="scope.row.canProgress === 1 && false"></el-button>
      </template>
    </page-table>
    <edit :show="editshow" :data="editdata" @cancel="closeEdit"></edit>
    <edit-progress 
      :show="progressShow" 
      :data="progressdata" 
      @cancel="closeProgressEdit"
    ></edit-progress>
  </div>
</template>

<script>
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import { landTradeList, deleteGoods, selectListByParentCode, getDictionaryListByConditions, getTargetStatus } from '@/api';
import headerTitle from '@/components/headerTitle/headerTitle';
import searchForm from '@/components/searchForm/searchForm';
import editProgress from '@/view/dealExamine/auditInformation/Edit/index';
import { GOODS_USE_OPTIONS } from './constants'
import edit from './LandTradeConfig';
import { mapGetters, mapMutations } from 'vuex';
import {
  getList,
  batchPushTrust,
  commitTrust
} from '@/api/landManagement/tradeList';
import commonApi from '@/mixins/commonApi';
export default {
  name: 'goods_list',
  components: {
    Wrapper,
    PageTable,
    headerTitle,
    searchForm,
    edit,
    editProgress
  },
  mixins: [commonApi()],
  data () {
    return {
      filter: {},
      filterItems: [
        {
          type: 'input',
          label: '宗地编号',
          props: {
            fieldName: 'no'
          }
        },
        {
          type: 'select',
          label: '用途',
          labelWidth: '45px',
          props: {
            width: '180px',
            fieldName: 'goodsUse',
            options: []
          }
        },
        {
          type: 'select',
          label: '状态',
          labelWidth: '45px',
          props: {
            width: '180px',
            fieldName: 'status',
            options: []
          }
        }
      ],
      tableCols: [
        { label: '宗地编号', prop: 'no', minWidth: 200 },
        { label: '位置', prop: 'address', minWidth: 150 },
        { label: '委托人', prop: 'trustName' },
        { label: '委托时间', prop: 'trustTime' },
        { label: '行政区域', prop: 'cantonName' },
        { label: '交易物类型', prop: 'goodsType', minWidth: 150},
        { label: '用途', prop: 'goodsUse' },
        { label: '规划建筑总面积', prop: 'buildAreaCount' },
        { label: '状态', prop: 'statusStr' },
        { label: '公告制作状态', prop: 'noticeStatusStr' }
      ],
      tableData: [],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      selections: [],
      selectionTargets: [],
      editshow: false,
      editdata: {},
      progressShow: false,
      progressdata: {}
    };
  },
  created () {
    this.reqLandTradeList();
    this.getContent();
    this._getDictionaryListByConditions();
    this.getStatus();
  },
  computed: {
    ...mapGetters(['common'])
  },
  methods: {
    closeEdit (type) {
      this.editshow = false
      if (type === 'cancel') {
        this.reqLandTradeList();
      }
    },
    ...mapMutations([
      'set_common'
    ]),
    reqLandTradeList () {
      const param = {
        data: {
          goodsType: '101',
          ...this.filter,
          status: +this.filter.status,
          byTrust: '1'
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      getList(param).then(res => {
        if (res.data && res.data.data) {
          const { total, data } = res.data;
          this.tableData = data;
          this.page.total = total;
        }
      });
    },
    routeTo (configType, param = {}) {
      this.editdata = configType === 'add' ? { configType } : { configType, ...param };
      this.editshow = true;
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.reqLandTradeList();
    },
    onPageSizeChange (val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    onAdd () {
      this.routeTo('add')
    },
    onSearch (param) {
      this.filter = {
        ...param
      }
      this.onCurrentChange(1)
    },
    onSelectionChange (list) {
      this.selections = list.map(item => item.id)
      this.selectionTargets = list.map(item => item.targetId)
    },
    reqDeleteGoods () {
      if (this.selections.length === 0) {
        this.$notify.error({
          title: '失败',
          message: '请选择要删除的数据!!!',
          position: 'bottom-right'
        });
        return;
      }
      this.$confirm('此操作将永久删除该所选交易物, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selections;
        deleteGoods(ids).then(res => {
          this.reqLandTradeList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            position: 'bottom-right'
          });
        })
      }).catch(() => {
      });
    },
    getContent () {
      if (!(this.common && this.common.contentOption && this.common.contentOption.length > 0)) {
        selectListByParentCode('4635').then(res => {
          if (res.code === '200') {
            const contentOption = res.data.map(item => {
              return {
                name: item.name,
                id: item.code
              }
            });
            this.set_common({
              ...this.common,
              contentOption
            });
          }
        })
      }
    },
    _getDictionaryListByConditions() {
      const paremsData = {
        "data": {
            "code": "LAND_USAGE"
        },
        "pageNo": "1",
        "pageSize": "999"
      };
      if (this.filterItems[1].props.options.length !== 0) return;
      getDictionaryListByConditions(paremsData).then(res => {
        if (res.code === '200') {
          this.filterItems[1].props.options = res.data.data.map(data => {
            return {
              id: data.code,
              name: data.name
            }
          })
        }
      });
    },
    getStatus () {
      getTargetStatus().then(res => {
        if (res.code === '200') {
          this.filterItems[2].props.options = res.data.map(data => {
            return {
              id: data.key,
              name: data.value
            }
          })
        }
      })
    },
    closeProgressEdit () {
      this.progressShow = false;
      this.progressdata = {};
      this.reqLandTradeList();
    },
    toPageProgress (row) {
      this.progressdata = {
        approveId: row.targetId,
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
    handleSubmit (row) {
      batchPushTrust({targetIds:[row.targetId]}).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '提交成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.reqLandTradeList()
        }
      });
    },
    handleRelease (row) {
      commitTrust(row.targetId).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '受理成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.reqLandTradeList()
        }
      });
    },
    batchSubmit () {
      const data = {
        targetIds: this.selectionTargets
      };
      batchPushTrust(data).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '提交成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.selectionTargets = [];
          this.reqLandTradeList()
        }
      })
    }
  }
};
</script>

<style></style>
