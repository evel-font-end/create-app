/* eslint-disable camelcase */
<template>
  <div id='TradeList' >
    <!-- <router-view v-if="routeName == 'details'"></router-view> -->
    <!-- 交易物列表 -->
    <header-title
      icon="iconfont icon-shouye"
      title="交易物列表"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        :delBtnVisible="$_hasOperation($options.name,'delete') && false"
        :addBtnVisible301="$_hasOperation($options.name,'add')"
        otherBtnVisible
        :otherBtnLists="[{
          label: '批量提交',
          click: () => batchSubmit()
        }]"
        addTitleBtn301="新增"
        @on-delBtn="delDetails"
        @on-addBtn301="addMineBtn"
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
          :selection="true"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          @selection-change="onSelectionChange"
        >
          <template
            slot-scope="scope"
            slot="operator"
          >
            <div>
              <el-button type="text" icon="iconfont icon-feeds-fill" size="small" title="详情" :style="{marginRight: '10px'}" @click.prevent.stop="jump('look', {row: scope.row }, scope.row.goodsType)"></el-button>
              <el-button type="text" icon="iconfont icon-xiugaii" size="small" title="编辑" @click.prevent.stop="jump('edit', { row: scope.row}, scope.row.goodsType)" v-if="(scope.row.canEdit === 1)"></el-button>
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
            </div>
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
import PageTable from '@/components/page-table'
import editProgress from '@/view/dealExamine/auditInformation/Edit/index';
import commonApi from '@/mixins/commonApi';
import { getTargetStatus } from '@/api';
import {
  getTradeList,
  deleteByIds
} from 'api/tradeList';
import {
  getList,
  pushTrust,
  commitTrust
} from '@/api/mineManagement/tradeList';
import {
  getMineBusinessType
} from '@/api/mineManagement/mineTargetList';
import {
  TRADE_TYPE_OPTIONS
} from '@/util/constants';
import edit from './Details/index';

export default {
  name: 'mine_list',
  mixins: [commonApi()],
  data () {
    return {
      selectIds: [],
      selectionTargets: [],
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '矿区位置',
        props: {
          fieldName: 'address',
          placeholder: '请输入矿区位置'
        }
      }, {
        type: 'input',
        label: '矿区名称',
        props: {
          fieldName: 'no',
          placeholder: '请输入矿区名称'
        }
      }, {
        type: 'select',
        label: '交易类型',
        labelWidth: '90px',
        props: {
          fieldName: 'businessType',
          placeholder: '交易类型选择',
          options: this.common && this.common.mineBusinessType
        }
      },  {
        type: 'select',
        label: '状态',
        labelWidth: '45px',
        props: {
          width: '180px',
          fieldName: 'status',
          options: []
        }
      }],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '矿区名称', prop: 'name' },
        { label: '矿区位置', prop: 'address' },
        // { label: '经办人', prop: 'createUserId' },
        { label: '交易类型', prop: 'businessType', width: '80px' },
        { label: '矿种', prop: 'goodsUse' },
        { label: '委托人', prop: 'trustName' },
        { label: '委托时间', prop: 'trustTime', width: '180px' },
        { label: '行政区域', prop: 'cantonName' },
        { label: '状态', prop: 'statusStr' },
        { label: '公告制作状态', prop: 'noticeStatusStr' }
      ],
      editshow: false,
      editdata: {},
      progressShow: false,
      progressdata: {}
    }
  },
  created () {
    this.getDataAllList();
    this.getStatus();
  },
  computed: {
    ...mapGetters(['common'])
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    edit,
    editProgress
  },
  mounted() {
    this.$nextTick(() => {
      getMineBusinessType().then(res => {
          if (res.code === '200') {
            const mineBusinessType = res.data.map(item => {
              return {
                name: item.value,
                id: item.key
              }
            });
          this.searchItems[2].props.options = mineBusinessType;
          }
      });
    });
  },
  methods: {
    closeEdit (type) {
      this.editshow = false;
      if (type === 'cancel') {
        this.getDataAllList();
      }
    },
    onSearch (val) {
      this.searchVal = {
        ...val
      };
      this.onCurrentChange(1);
    },
    getStatus () {
      getTargetStatus().then(res => {
        if (res.code === '200') {
          this.searchItems[3].props.options = res.data.map(data => {
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
        pageNo: this.page.current, // 查询的分页页码
        pageSize: this.page.pageSize
      };
      getList(data).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data
          this.tableData = data;
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
      this.selectionTargets = args.map(item => item.targetId)
    },
    addDetails () {
      this.jump('edit', null, '采矿权')
    },
    addMineBtn () {
      this.jump('edit', null, '探矿权')
    },
    delDetails () {
      if (this.selectIds.length === 0) {
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
        deleteByIds(this.selectIds).then(res => {
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
      })
    },
    jump (configType, parames, option) {
      this.editdata = parames === null ? { configType, option } : { configType, ...parames, option };
      this.editshow = true;
      // this.$router.push({
      //   name: 'details',
      //   query: { type, ...parames, option }
      // });
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
        title:row.name
      }
      this.progressShow = true;
    },
     handleSubmit (row) {
      pushTrust({targetIds:[row.targetId]}).then(res => {
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
#TradeList{
  .Modeltable{
    >.comp-page-table{
      padding:0 20px;
      background: #fff;
    }
  }
}
</style>
