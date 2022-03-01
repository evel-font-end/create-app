/* eslint-disable camelcase */
<template>
  <div id='low_noticelist' >
    <!-- <router-view v-if="routeName == 'landNormal'"></router-view>
    <router-view v-if="routeName == 'landSupply'"></router-view> -->
    <!-- 公告管理 -->
    <header-title
      icon="iconfont icon-shouye"
      title="公告管理"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        :addBtnVisible="$_hasOperation($options.name,'add')"
        @on-addBtn="handleAddBtnClick"
      />
    </header-title>

    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="left"
          operator-width="130"
          operator
          :data="tableData"
          :cols="tableCols"
          :selection="true"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          @selection-change="onSelectionChange"
          :row-key="getRowKey"
          :load="load"
          lazy
          :tree-props="{hasChildren: 'hasChildren'}"
          hideDefaultIndex
          ref="tableDom"
        >
          <template
            slot-scope="scope"
            slot="operator"
          >
          <flex>
            <el-button 
              icon="iconfont icon-feeds-fill" type="text" size="small" title="详情" :style="{marginRight: '10px'}"
              @click.prevent.stop="jump(scope.row.noticeType === 0 ? 'plowNormal' : 'plowSupply', 'detail', {row: scope.row})"
              v-if="$_hasOperation($options.name,'examine')">
            </el-button>
            <el-button 
              icon="iconfont icon-xiugaii" type="text" size="small" title="编辑"
              @click.prevent.stop="jump(scope.row.noticeType === 0 ? 'plowNormal' : 'plowSupply', 'edit', {row: scope.row})"
              v-if="(scope.row.canEdit ===1)&&($_hasOperation($options.name,'edit'))">
            </el-button>
            <el-button 
              icon="iconfont icon-xinjiantianjiabiaodanyemian" type="text" size="small" title="新建补充公告"
              @click.prevent.stop="jump('plowSupply', 'add', {row: scope.row})"
              v-if="(scope.row.canAddChild ===1)&&($_hasOperation($options.name,'supplementadd'))">
            </el-button>
            <el-button 
              icon="iconfont icon-wancheng" type="text" size="small" title="提交"
              @click.prevent.stop="handleSubmit(scope.row)"
              v-if="(scope.row.canSubmit ===1)&&($_hasOperation($options.name,'submit'))">
            </el-button>
            <el-button 
              icon="iconfont icon-yubaofabu" type="text" size="small" title="发布"
              @click.prevent.stop="handleRelease(scope.row)"
              v-if="(scope.row.canPublish ===1)&&($_hasOperation($options.name,'publish'))">
            </el-button>
            <el-button 
              icon="iconfont icon-delete" type="text" size="small" title="删除"
              @click.prevent.stop="handleDelBtnClick(scope.row)"
              v-if="(scope.row.canDelete ===1)&&($_hasOperation($options.name,'delete'))">
            </el-button>
            <el-button type="text" size="small" title="审核进度" icon="iconfont icon-trackProgress" @click="toPageProgress(scope.row)" v-if="(scope.row.canEdit !==1) || (scope.row.isAudit === 1)"></el-button>
            <el-button
              type="text"
              size="small"
              title="撤回"
              icon="iconfont icon-reset"
              @click="selectReturn(scope.row)"
              v-if="scope.row.status === '审核中'"
            ></el-button>
          </flex>
          </template>
        </page-table>
      </div>
    </div>
    <landNormal :show="editshow.plowNormal" :data="editdata" @cancel="closeEdit"></landNormal>
    <landSupply :show="editshow.plowSupply" :data="editdata" @cancel="closeEdit"></landSupply>
    <edit-progress 
      :show="progressShow" 
      :data="progressdata" 
      @cancel="closeEdit"
    ></edit-progress>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import headerTitle from 'components/headerTitle/headerTitle';
import Flex from '@/components/flex';
import searchForm from '@/components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import commonApi from '@/mixins/commonApi';
import landNormal from './normalDetail';
import landSupply from './supplyDetail';
import editProgress from '@/view/dealExamine/auditInformation/Edit/index';
import {
  getPlowNotice,
  deletePlowNotice,
  getTransNoticeStatus,
  publishPlowNotice,
  submitTransNotice
} from '@/api/plowMmanagement/lowNoticeList';
import {
  deleteSuppleNotic,
  getSupplementaryNoticeList
} from '@/api';
import{
  revertNotice
} from '@/api/common';
import {
  statusOptions,
  noticeTypeOptions,
  tradeTypeOptions
} from './utils';

const method = {
  0: {
    'delete': deletePlowNotice
  },
  1: {
    'delete': deleteSuppleNotic
  }
}
export default {
  name: 'low_noticelist',
  mixins: [commonApi()],
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '公告编号',
        props: {
          fieldName: 'no'
        }
      }, {
        type: 'input',
        label: '公告名称',
        props: {
          fieldName: 'name'
        },
        hide: true
      }, {
        type: 'select',
        label: '状态',
        labelWidth: '45px',
        props: {
          fieldName: 'status',
          placeholder: '状态选择',
          options: this.statusOption
        }
      }, {
        type: 'select',
        label: '公告类型',
        props: {
          fieldName: 'status',
          placeholder: '公告类型选择',
          options: noticeTypeOptions
        },
        hide: true
      }, {
        type: 'select',
        label: '交易类型',
        props: {
          fieldName: 'businessType',
          placeholder: '交易类型选择',
          options: []
        },
        hide: true
      }],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '序号', prop: 'index', minWidth: 60, fixed: 'left' },
        { label: '公告编号', prop: 'no', minWidth: 300 },
        // { label: '公告名称', prop: 'name', minWidth: 300 },
        {
          label: '公告类型',
          prop: 'noticeType',
          minWidth: 120,
          render: (h, scope) => {
            const type = scope.row.noticeType;
            const obj = noticeTypeOptions.find(option => `${option.id}` === `${type}`);
            return <div>{obj.name}</div>
          }
        },
        // { label: '交易类型', prop: 'businessTypeText', minWidth: 120 },
         { label: '公告开始时间', prop: 'beginNoticeTime', width: '180px' },
        { label: '公告结束时间', prop: 'endNoticeTime', width: '180px' },
        { label: '创建人', prop: 'createUserRealName', width: '80px' },
        { label: '状态', prop: 'status', minWidth: 100 }
      ],
      statusOption: [],
      selectIds: [],
      editshow: {
        plowNormal: false,
        plowSupply: false
      },
      editdata: {},
      progressShow: false,
      progressdata: {},
      loadNodeMap: {},
      selectCurrRowId: null,
      refresh: false
    }
  },
  watch: {
    "$route.query": {
      deep: true,
      immediate: true,
      handler: function(to, from) {
        const name = `${to.noticeName}Refresh`;
        if (to.hasOwnProperty("noticeId") && this.common[name]) {
          this.set_common({
            ...this.common,
            [name]: false
          });
          setTimeout(() => {
            this.jump(to.noticeType === 0 ? 'plowNormal' : 'plowSupply', 'detail', {row: { ...to, id: to.noticeId }})
          }, 500);
        }
      }
    }
  },
  created () {
    this.getDataAllList();
  },
  computed: {
    ...mapGetters(['common'])
  },
  mounted () {
    this.$nextTick(async () => {
      this.getDataAllList();
      // this.searchItems[4].props.options z= await this._getPlowBusinessType();
      this.searchItems[2].props.options = await this._getTransNoticeStatus();
    });
  },
  // computed: {
  //   routeName () {
  //     return this.$route.name
  //   }
  // },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    landNormal,
    landSupply,
    editProgress
  },
  methods: {
    ...mapMutations([
      'set_common'
    ]),
    getRowKey (row) {
      return row.id;
    },
    load(tree, treeNode, resolve) {
      this.loadNodeMap[tree.id] = {tree, treeNode, resolve};
      const parames = {
        noticeId: tree.id
      };
      getSupplementaryNoticeList(parames).then(res => {
        if (res.code === '200') {
          resolve(res.data);
        }
      });
    },
    closeEdit (type) {
      this.editshow = {
        plowNormal: false,
        plowSupply: false
      };
      this.editdata = {};
      this.progressShow = false;
      this.progressdata = {};
      if (type === 'cancel') {
        this.getDataAllList();
      }
    },
    toPageProgress (row) {
      this.progressdata = {
        approveId: row.id,
        refId: row.refId,
        // approveLinkedId: row.approveLinkedId,
        status: row.status,
        businessType: row.businessType,
        isShowBtn: false,
        type:'notice',
        pageType: false,
        title:row.no
      }
      this.progressShow = true;
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
      getPlowNotice(data).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data
          this.tableData = data.map((item, index) => {
            return {
              ...item,
              index: index + 1
            };
          });
          this.page.total = total;
        }
      });
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList()
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    },
    onSelectionChange (args) {
      this.selectIds = args.map(item => item.id);
    },
    handleDelBtnClick (row) {
      this.$confirm('此操作将永久删除该所选公告, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const apiMethod = method[row.noticeType].delete;
        apiMethod(row.id).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              position: 'bottom-right'
            });
            if(!!row.parentId) {
              this.selectCurrRowId = row;
              this._reRenderChildrenNodeAfterAdd()
            }
            this.onCurrentChange(1);
          }
        }).catch(() => {
        });
      });
    },
    handleAddBtnClick () {
      this.jump('plowNormal', 'add', {
        row: {}
      })
    },
    handleSubmit (item) {
      submitTransNotice(item.id).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '提交成功',
            type: 'success',
            position: 'bottom-right'
          });
          if(!!item.parentId) {
            this.selectCurrRowId = item;
            this._reRenderChildrenNodeAfterAdd()
          }
          this.onCurrentChange(1);
        }
      })
    },
    handleRelease (item) {
      publishPlowNotice(item.id).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '发布成功',
            type: 'success',
            position: 'bottom-right'
          });
          if(!!item.parentId) {
            this.selectCurrRowId = item;
            this._reRenderChildrenNodeAfterAdd()
          }
          this.onCurrentChange(1);
        }
      })
    },
    _reRenderChildrenNodeAfterAdd(callbackRow) {
      const { parentId } = this.selectCurrRowId;
      if (this.loadNodeMap[parentId]) {
        const {tree, treeNode, resolve} = this.loadNodeMap[parentId];
        this.$set(this.$refs.tableDom.$refs.pageTable.store.states.lazyTreeNodeMap, parentId, []);
        this.load(tree,treeNode,resolve);
      }
    },
    jump (path, configType, parames) {
      this.editdata = configType === 'add' && path !== 'plowSupply' ? { configType } : { configType, ...parames };
      this.editshow[path] = true;
      // this.$router.push({
      //   name: path,
      //   query: { configType, ...parames }
      // });
    },
    selectReturn (row) {
      revertNotice(row.id).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '回撤成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.getDataAllList();
        }
      });
    }
  }
}
</script>

<style lang="less">
#low_noticelist{
  /deep/.el-table{
    .el-table__expand-icon{
      position: absolute;
      right: 10px;
    }
  }
  .Modeltable{
    >.comp-page-table{
      padding:0 20px;
      background: #fff;
    }
  }
}
</style>
