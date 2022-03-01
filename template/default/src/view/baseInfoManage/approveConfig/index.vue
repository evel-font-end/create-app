/* eslint-disable camelcase */
<template>
  <div id='approveConfigList' >
    <!-- 业务执行管理 -->
    <header-title
      icon="iconfont icon-shouye"
      title="审核流程"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
      />
    </header-title>

    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="left"
          operator-width="100"
          operator
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
          <template
            slot-scope="scope"
            slot="operator"
          >
          <flex>
            <!-- <el-button
              type="text"
              size="small"
              icon="iconfont icon-jinyong"
              title="禁用"
              :style="{marginRight: '10px'}"
              v-if="(scope.row.canDisEnable !== 1)&&($_hasOperation($options.name,'disable'))"
              @click.prevent.stop="handleModify({status: 0,id: scope.row.id})"></el-button>
          <el-button
              type="text"
              size="small"
              icon="iconfont icon-qiyong"
              title="启用"
              :style="{marginRight: '10px'}"
              v-if="(scope.row.canEnable !== 1)&&($_hasOperation($options.name,'enable'))"
              @click.prevent.stop="handleModify({status: 1,id: scope.row.id})"></el-button> -->
          <el-button
              type="text"
              size="small"
              icon="iconfont icon-peizhishenpijiedian"
              title="配置审批节点"
              v-if="$_hasOperation($options.name,'addnode')"
              @click.prevent.stop="jump('edit', {row: scope.row})"></el-button>
          </flex>
          </template>
        </page-table>
      </div>
    </div>

    <edit :show="editshow" :data="editdata" @cancel="closeEdit"></edit>
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle'
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import {
  getApproveLinkedBusinessType,
  getApproveList,
  modifyApproveLinkedConfig
} from '@/api/baseInfoManage';
export default {
  name: 'approve_config',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'select',
        label: '业务标识',
        props: {
          fieldName: 'businessType',
          placeholder: '业务标识选择',
          options: []
        }
      }, {
        type: 'input',
        label: '流程名称',
        props: {
          fieldName: 'approveName',
          placeholder: '请输入流程名称'
        }
      }, {
        type: 'input',
        label: '流程编码',
        props: {
          fieldName: 'approveNo',
          placeholder: '请输入流程编码'
        }
      }],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '审核业务', prop: 'businessTypeText' },
        { label: '流程名称', prop: 'approveName' },
        { label: '流程编码', prop: 'approveNo' },
        { label: '审批节点数', prop: 'nodeCount', width: '100px' },
        { label: '创建时间', prop: 'createDate', width: '180px' },
        // { label: '状态', prop: 'statusText', width: '80px' }
        // { label: '备注', prop: 'account' }
      ],
      editshow: false,
      editdata: {}
    }
  },
  created () {
    this._getApproveLinkedBusinessType()
    this.getDataAllList();
  },
  // mounted () {
  //   this.$nextTick(() => {
  //   });
  // },
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
      this.editData = {};
      if (type === 'cancel') {
        this.getDataAllList();
      }
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
      getApproveList(data).then(res => {
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
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    },
    jump (configType, parames) {
      this.editdata = { configType, ...parames };
      this.editshow = true;
    },
    handleModify (data) {
      modifyApproveLinkedConfig(data).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '删除状态成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.onCurrentChange()
        }
      })
    },
    _getApproveLinkedBusinessType () {
      this.searchItems[0].props.options = [];
      getApproveLinkedBusinessType().then(res => {
        if (res.code === '200') {
          res.data.map(item => {
            this.searchItems[0].props.options.push({
              name: item.value,
              id: item.key
            })
          });
        }
        this.$forceUpdate();
      });
    }
  }
}
</script>

<style lang="less">
#approveConfigList{}
</style>
