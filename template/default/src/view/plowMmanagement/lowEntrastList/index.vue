/* eslint-disable camelcase */
<template>
  <div id='lowEntrastList' >
    <!-- 指标管理 -->
    <header-title
      icon="iconfont icon-shouye"
      title="指标管理"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        :addBtnVisible="$_hasOperation($options.name,'add') || true"
        :delBtnVisible="$_hasOperation($options.name,'delete') && false"
        otherBtnVisible
        :otherBtnLists="[{
          label: '批量提交',
          click: () => batchSubmit()
        }]"
        @on-addBtn="jump('add', null);"
        @on-delBtn="delData"
      />
    </header-title>

    <div class="content-view">
      <div class="Modeltable">
        <page-table
            col-align="left"
            operator-width="150"
            operator
            :data="tableData"
            :cols="tableCols"
            selection
            :page-current="page.current"
            :total="page.total"
            :page-size="page.pageSize"
            @current-change="onCurrentChange"
            @size-change="onPageSizeChange"
            @selection-change="onCurrentSelection"
        >
          <template
            slot-scope="scope"
            slot="operator"
          >
          <flex>
            <el-button
              type="text"
              size="small"
              title="详情"
              icon="iconfont icon-feeds-fill"
              :style="{marginRight: '10px'}"
              @click.prevent.stop="jump('detail', {
                row: scope.row
              })">
          </el-button>
          <el-button
              type="text"
              size="small"
              title="编辑"
              icon="iconfont icon-xiugaii"
              @click.prevent.stop="jump('edit', {
                row: scope.row
              })"
              v-if="(scope.row.canEdit ===1)">
          </el-button>
          <!-- <el-button
            icon="iconfont icon-delete" type="text" size="small" title="删除"
            @click.prevent.stop="handleDelBtnClick(scope.row)"
            v-if="(scope.row.canEdit ===1)">
          </el-button> -->
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
          <el-button type="text" size="small" title="审核进度" icon="iconfont icon-trackProgress" @click="toPageProgress(scope.row)"  v-if="scope.row.canProgress === 1 && false"></el-button>
          </flex>
          </template>
        </page-table>
      </div>
    </div>

    <edit :show="editshow" :data="editdata" @cancel="closeEdit"></edit>
    <edit-progress 
      :show="progressShow" 
      :data="progressdata" 
      @cancel="closeProgressEdit"
    ></edit-progress>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import headerTitle from '@/components/headerTitle/headerTitle'
import searchForm from '@/components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import commonApi from '@/mixins/commonApi';
import Edit from './Edit';
import editProgress from '@/view/dealExamine/auditInformation/Edit/index';
import { getTargetStatus } from '@/api';
import {
  getPlowTarget,
  deletePlowTarget
} from '@/api/plowMmanagement/lowIndexList';
import {
  delTransByIds
} from '@/api/landManagement/tarageList';
import {
  getList,
  pushTrust,
  commitTrust
} from '@/api/plowMmanagement/tradeList';
export default {
  name: 'low_entrast_list',
  mixins: [commonApi()],
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '编号',
        labelWidth: '45px',
        props: {
          fieldName: 'no'
        }
      }, {
        type: 'select',
        label: '交易类型',
        props: {
          fieldName: 'businessType',
          placeholder: '交易方式选择',
          options: []
        }
      }, {
        type: 'select',
        label: '交易方式',
        props: {
          fieldName: 'transType',
          placeholder: '交易类型选择',
          options: []
        }
      }, {
        type: 'input',
        label: '委托人',
        props: {
          fieldName: 'createUser'
        }
      }, {
        type: 'select',
        label: '状态',
        labelWidth: '45px',
        props: {
          fieldName: 'status',
          placeholder: '状态选择',
          options: []
        }
      }],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      selectionTargets: [],
      tableData: [],
      tableCols: [
        { label: '编号', prop: 'no', minWidth: 300 },
        { label: '交易面积(亩)', prop: 'area', minWidth: 120 },
        { label: '委托人', prop: 'trustName' },
        { label: '委托时间', prop: 'trustTime' },
        { label: '状态', prop: 'statusStr' },
        { label: '公告制作状态', prop: 'noticeStatusStr' },
        { label: '创建时间', prop: 'createDate', minWidth: 200 }
      ],
      editshow: false,
      editdata: {},
      progressShow: false,
      progressdata: {}
    }
  },
  mounted () {
    this.$nextTick(async () => {
      this.getDataAllList();
      this.searchItems[1].props.options = await this._getPlowBusinessType();
      this.searchItems[2].props.options = await this._getPlowTransactionType();
      this.searchItems[4].props.options = await this._getPlowTrustStatus();
      this.getStatus();
    });
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Edit,
    Flex,
    editProgress
  },
  computed: {
    ...mapGetters(['common'])
  },
  methods: {
    onSearch (val) {
      this.searchVal = {
        ...val
      }
      this.onCurrentChange(1);
    },
    getStatus () {
      getTargetStatus().then(res => {
        if (res.code === '200') {
          this.searchItems[4].props.options = res.data.map(data => {
            return {
              id: data.key,
              name: data.value
            }
          })
        }
      })
    },
    // 获取所有/查询数据列表
    getDataAllList () {
      let data = {
        data: {
          ...this.searchVal,
          status: +this.searchVal.status,
          byTrust: '1'
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      getList(data).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data
          this.tableData = data;
          this.page.total = total;
        }
      })
    },
    onCurrentSelection (val) {
      this.tableDataSelect = val;
      this.selectionTargets = val.map(item => item.targetId)
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList()
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
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
                  this.getDataAllList();
                }
              })
              .catch(err => {
              });
          })
          .catch(err => {
          });
      } else {
        this.$notify.error({
          title: '失败',
          message: '请先选择数据!!!',
          position: 'bottom-right'
        });
      }
    },
    handleDelBtnClick (row) {
      this.$confirm('此操作将永久删除该所选指标, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePlowTarget(row.targetId).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              position: 'bottom-right'
            });
            this.onCurrentChange(1);
          }
        }).catch(() => {
        });
      });
    },
    jump (configType, parames) {
      this.editdata = configType === 'add' ? { configType, btnStatusData: { isRestart : null } } : { configType, ...parames, btnStatusData: { isRestart : null } };
      this.editshow = true;
    },
    closeEdit (type) {
      this.editdata = {};
      this.editshow = false;
      if (type === 'cancel') {
        this.getDataAllList();
      }
    },
    closeProgressEdit () {
      this.progressShow = false;
      this.progressdata = {};
      this.getDataAllList();
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
      pushTrust({targetIds: [row.targetId]}).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '提交成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.getDataAllList()
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
          this.getDataAllList()
        }
      });
    },
    batchSubmit () {
      const data = {
        targetIds: this.selectionTargets
      };
      pushTrust(data).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '提交成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.selectionTargets = [];
          this.getDataAllList()
        }
      })
    }
  }
}
</script>

<style lang="less">
#lowEntrastList{
    .Modeltable{
    >.comp-page-table{
      padding:0 20px;
      background: #fff;
    }
  }
}
</style>
