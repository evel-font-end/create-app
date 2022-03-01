<template>
  <div class="box">
    <wrapper title="标的信息">
      <header-title
      icon="iconfont icon-shouye"
      title="标的信息"
    >
      <search-form
        slot="searchBox"
        :searchItems="[]"
        :otherBtnVisible="!this.isDetail"
        :otherBtnLists="[{
          label: '新增',
          class: 'addBtn',
          addBtnIconfont: 'icon-xinzeng',
          click: () => handleAddBidClick()
        }, {
          label: '绑定',
          class: 'delBtn',
          click: () => handleAddBtnClick()
        }, {
          label: '删除',
          class: 'delBtn',
          addBtnIconfont: 'icon-shanchu',
          click: () => handleDelBtnClick()
        }]"
      />
    </header-title>

    <div class="content-view">
      <div class="table">
        <page-table
          ref="pageTable"
          col-align="left"
          operator
          operator-width="110"
          :data="dialog.selectIds"
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
          <template slot-scope="scope" slot="operator">
            <el-button
              type="text" icon="iconfont icon-xiugaii" title="编辑"
              @click="handleAddBidClick('edit', scope.row)"
            >
            </el-button>
          </template>
        </page-table>
      </div>
    </div>
    </wrapper>
    <dialog-cont
      @on-cancel="handleDialogCancel"
      @on-confirm="handleDialogConfirm"
      @on-open="openeditAddItem"
      :visible.sync="dialog.addItem"
      :customClass="'dialogCustomClass'"
      title="绑定标的"
      width="80%"
      append-to-body
    >
      <dialog-add-item
        ref="addItem"
        :tableCols="[{
          label: '矿区名称',
          prop: 'no'
        }, {
          label: '位置',
          prop: 'address'
        },{
          label: '委托人',
          prop: 'no'
        },{
          label: '交易类型',
          prop: 'businessTypeText'
        }, {
          label: '起始价(万元)',
          prop: 'beginPriceText'
        }, {
          label: '保证金(万元)',
          prop: 'earnestMoneyText'
        }, {
          label: '创建时间',
          prop: 'createDate'
        }]"
        :apiPath="dialog.apiPath"
        @selection-change="handleDialogSelectChange"
        :businessOptions="businessOptions"
        :transactionOptions="transactionOptions"
        :data="data"
        :businessType="type"
      />
    </dialog-cont>
    <Edit
      :show="editshow"
      :type="editdata.type"
      :id="editdata.id"
      @cancel="editshow=false"
      @success="editSuccess"
    ></Edit>
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import Flex from '@/components/flex';
import searchForm from 'components/searchForm/searchForm';
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table'
import dialogCont from '@/components/dialog';
import dialogAddItem from './dialogAddItem';
import Edit from '@/view/mineManagement/mineTargetList/Edit/edit'
import {
  getMineUnBindList
} from '@/api';
import {
  getTransMineTargetList,
  getMineBusinessType,
  getTransactionType
} from '@/api/mineManagement/mineTargetList';
export default {
  name: 'bid',
  components: {
    Wrapper,
    PageTable,
    Flex,
    dialogCont,
    headerTitle,
    dialogAddItem,
    searchForm,
    Edit
  },
  props: {
    initId: {
      type: [Number, String],
      default: ''
    },
    data: {},
    transTargetDtos: {
      type: Array,
      default () {
        return []
      }
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      initAttachData: null,
      tableData: [],
      tableCols: [
        { label: '矿区名称', prop: 'no' },
        { label: '面积', prop: 'mineBuildAreaCount' },
        { label: '起始价(万元)', prop: 'beginPriceText' },
        { label: '竞价幅度(万元)', prop: 'priceStepText' },
        { label: '保证金(万元)', prop: 'earnestMoneyText' },
        { label: '挂牌开始时间', prop: 'beginListTime' },
        { label: '挂牌结束时间', prop: 'endListTime' }
        // { label: '状态', prop: 'fileName' },
        // { label: '经办人', prop: 'createUserId' }
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
        addItem: false,
        title: '增加标的', // 弹窗标题
        apiPath: getMineUnBindList,
        selectIds: [],
        selectIdTimes: []
      },
      selectIds: [],
      businessOptions: [],
      transactionOptions: [],
      dto: [],
      editshow: false,
      editdata: {}
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
    transTargetDtos (val) {
      this.dto = val;
      this.dialog.selectIds = val;
      this.$refs.pageTable.toggleAllSelection();

      this.publishId(this.dialog.selectIds);
    }
  },
  mounted () {
    this.$nextTick(() => {
     this.$refs.pageTable.toggleAllSelection();
    });
  },
  created () {
    this._getMineBusinessType();
    this._getTransactionType();
    // this.getDataAllList()
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
      getMineUnBindList(data).then(res => {
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
    handleSelectChange (vals) {
      this.selectIds = vals;
      this.publishId(this.dialog.selectIds);
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
    handleAddBidClick (type = 'add', data) {
      this.editshow = true;
      this.editdata = {
        ...data,
        type: type
      }
    },
    async editSuccess (res) {
      if (res.code === '200') {
        this.editshow = false;
        const newTarger = await this.getTargetList(res.data);
        const selectIds = [...this.dialog.selectIds];
        selectIds.push(newTarger);
        let hash = {};
        const data = [];
        await selectIds.map(curVal => {
          if (hash[curVal.id]) {
            const valIndex = data.findIndex(val => val.id === curVal.id);
            data[valIndex] = { ...curVal, canEdit: 1}
          } else {
            hash[curVal.id] = true && data.push({ ...curVal, canEdit: 1 }); 
          }
        });
        this.dialog.selectIds = data;
        this.$set(this.dialog.selectIds, data);
        this.publishId(this.dialog.selectIds);
        this.$forceUpdate();
      }
    },
    getTargetList (targetId) {
      const param = {
        data: {
          targetId
        },
        pageNo: 1,
        pageSize: 1
      };
      return getTransMineTargetList(param).then(res => {
        const { data, total } = res.data;
        this.page.total = total;
        return data[0];
      });
    },
    handleDialogCancel () {
      this.dialog.addItem = false
      this.dialog.selectIdTimes = [];
      //加个定时器解决--调用的时候出现了undefined异常
      setTimeout(() => {
        this.$refs.addItem.clear();
      }, 10);
      this.$refs.pageTable.getPageTable()
    },
    handleDialogConfirm () {
      this.dialog.addItem = false;
      this.dialog.selectIds.push(...this.dialog.selectIdTimes);
      let hash = {};
      const data = this.dialog.selectIds.reduce((preVal, curVal) => {
          hash[curVal.id] ? '' : hash[curVal.id] = true && preVal.push({ ...curVal, canEdit: 1 }); 
          return preVal 
      }, []);
      this.dialog.selectIds = data;
      this.dialog.selectIdTimes = [];
      setTimeout(() => {
        this.$refs.addItem.clear();
      }, 10);
      this.publishId(this.dialog.selectIds);
    },
    openeditAddItem () {
      this.$emit('getValue');
      setTimeout(() => {
        this.$refs.addItem.onSearchItem({
          businessType: this.type
        }, this.dialog.selectIds);
      }, 10);
    },
    publishId (items) {
      const ids = items.map(val => val.id);
      this.$emit('change', ids);
    },
    handleDialogSelectChange (vals) {
      this.dialog.selectIdTimes = vals;
    },
    // 获取交易方式下拉框数据
    _getMineBusinessType () {
      getMineBusinessType().then(res => {
        if (res.code === '200') {
          this.businessOptions = res.data.map(item => {
            return {
              name: item.value,
              id: item.key
            }
          });
        }
      });
    },
    // 获取交易类型下拉框数据
    _getTransactionType () {
      getTransactionType().then(res => {
        if (res.code === '200') {
          this.transactionOptions = res.data.map(item => {
            return {
              name: item.value,
              id: item.key
            }
          });
        }
      });
    },
    resetForm () {
      this.$refs.pageTable.getPageTable()
      this.dialog.selectIds = []
    }
  }
};
</script>

<style lang="less" scoped>
.box{
  /deep/.hasbtnList {
    margin: 10px 0 0 !important;
  }
  /deep/#headerTitle .searchBox{
    padding-top: 0;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 10px;
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
