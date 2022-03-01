/* eslint-disable camelcase */
<template>
  <div id='lowBidderList'>
    <!-- 委托人管理 -->
    <header-title
      icon="iconfont icon-shouye"
      title="委托人管理"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        :addBtnVisible="$_hasOperation($options.name,'add')"
        :delBtnVisible="$_hasOperation($options.name,'delete') && selection"
        @on-addBtn="jump('add', null);"
        @on-delBtn="delData"
      />
    </header-title>

    <!-- <div class="content-view"> -->
      <!-- <div class="Modeltable"> -->
        <page-table
          ref="pageTable"
          col-align="left"
          operator-width="110"
          operator
          :data="tableData"
          :cols="tableCols"
          :selection="selection !== undefined ? selection : true"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          @selection-change="onCurrentSelection"
          @row-current-change="onRowCurrentSelection"
          highlightCurrentRow
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
              })"
              v-if="$_hasOperation($options.name,'examine')">
          </el-button>
          <el-button
            type="text"
            size="small"
            title="编辑"
            icon="iconfont icon-xiugaii"
            @click.prevent.stop="jump('edit', {
              row: scope.row
            })"
            v-if="(scope.row.canEdit ===1 || true)&&($_hasOperation($options.name,'edit'))"
          >
          </el-button>
          </flex>
          </template>
        </page-table>
      <!-- </div> -->
    <!-- </div> -->

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
  getTrustList,
  deletePlowTargets
} from '@/api/plowMmanagement/index';
export default {
  name: 'low_bidder_list',
  props: {
    selection: true
  },
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '委托人编号',
        labelWidth: '100px',
        props: {
          fieldName: 'no'
        }
      }, {
        type: 'input',
        label: '委托人',
        props: {
          fieldName: 'bidderName'
        }
      },
      {
        type: 'input',
        label: '委托日期',
        props: {
          fieldName: 'no',
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
        { label: '委托人编号', prop: 'no', minWidth: 100 },
        { label: '委托人', prop: 'name', minWidth: 100 },
        { label: '联系人', prop: 'contacts', minWidth: 100 },
        { label: '委托说明', prop: 'description', minWidth: 100 },
        { label: '标的数', prop: 'targets', minWidth: 100 },
        { label: '委托日期', prop: 'createDate', minWidth: 200 }
      ],
      editshow: false,
      editdata: {},
      tableDataSelect: []
    }
  },
  created () {
    this.getDataAllList()
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Edit,
    Flex
  },
  methods: {
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
      getTrustList(data).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data
          this.tableData = data;
          this.page.total = total;
        }
      })
    },
    delData () {
      if (this.tableDataSelect.length !== 0) {
        let moreBidder = this.tableDataSelect.map(item => {
          return item.targets > 0 && item;
        });
        let zeroBidder = this.tableDataSelect.map(item => {
          return item.targets === 0 && item;
        });
        zeroBidder = zeroBidder.filter(val => !!val);
        moreBidder = moreBidder.filter(val => !!val);
        const ids = zeroBidder.map(item => item.id);
        let message = '确定删除？';
        if(moreBidder.length > 0) {
          if(zeroBidder.length > 0) {
            message = `只能删除标的数为0的${zeroBidder.map(item => item.no).join(',')}编号的委托人！`;
            this.$refs.pageTable.onRowChange(moreBidder, 'id', false);
          } else {
            message = `该编号的委托人不允许删除！`;
            this.$alert(message, '提示', {
              confirmButtonText: '确定'
            }).then(() => {});
            return;
          }
        }
        this.$alert(message, '提示', {
          confirmButtonText: '确定'
        })
          .then(() => {
            deletePlowTargets(ids)
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
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList()
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    },
    onCurrentSelection (val) {
      this.tableDataSelect = val;
    },
    jump (configType, parames) {
      this.editdata = configType === 'add' ? { configType } : { configType, ...parames };
      this.editshow = true;
    },
    closeEdit (type) {
      this.editdata = {};
      this.editshow = false;
      if (type === 'cancel') {
        this.getDataAllList();
      }
    },
    onRowCurrentSelection (val) {
      this.$emit('select', val);
    },
    clearCurrentRow () {
      this.$refs.pageTable.onSetCurrentRow();
    }
  }
}
</script>

<style lang="less">
#lowBidderList{}
</style>
