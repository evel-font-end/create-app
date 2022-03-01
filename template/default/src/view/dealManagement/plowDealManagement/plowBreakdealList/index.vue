<template>
    <div class="container">
        <header-title>
          <search-form
            slot="searchBox"
            :searchItems="searchItems"
            @onSearch="onSearch"
            otherBtnVisible
            :otherBtnLists="[{
              label: '中止',
              click: () => handleSuspend()
            }, {
              label: '终止',
              click: () => handleStop()
            }]"
          />
        </header-title>

        <page-table
          :data="tableData"
          :cols="tableCols"
          col-align="left"
          operator
          operator-width="100"
          selection
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          @selection-change="onSelectionChange"
        >
          <template slot-scope="scope" slot="operator">
            <el-button type="text" size="small" title="详情" icon="iconfont icon-feeds-fill" @click="toPage('infoTrans',{row: scope.row})"></el-button>
          </template>
        </page-table>
        <edit :show="editshow" :data="editdata" @cancel="closeEdit"></edit>
        
    </div>
</template>
<script>
import PageTable from '@/components/page-table';
import headerTitle from '@/components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import edit from '@/view/plowMmanagement/lowIndexList/Edit/index';
// import edit from '@/view/landManagement/tarageList/Edit/edit';
import {
  getTargetStatus,
  getBreakPlowTargetList,
  getSelectListByParentCode
} from '@/api/dealManagement/plowDealManagement/plowBreakdealList';
import {
  getTransactionType,
  getBusinessType
} from '@/api/dealManagement/plowDealManagement/common';
import {
  getTargetSuspend,
  getTargetStop
} from '@/api/dealManagement/breakdealList';
export default {
    name: 'plow_breakdeal_list',
    components: {
      PageTable,
      headerTitle,
      searchForm,
      edit
    },
    data () {
      return {
        searchVal: {
          no: '', // 宗地编号
          cantonId: '', // 所属区域
          transType: '', // 交易方式
          businessType: '', // 交易类型
          status: '' // 状态
        },
        searchItems: [
          {
            type: 'input',
            label: '宗地编号',
            props: {
              placeholder: '请输入编号',
              fieldName: 'no'
            }
          },
          // {
          //   type: 'select',
          //   label: '所属区域',
          //   props: {
          //     fieldName: 'canton',
          //     placeholder: '所属区域选择',
          //     options: []
          //   }
          // },
          {
            type: 'select',
            label: '交易方式',
            props: {
              fieldName: 'transType',
              placeholder: '交易方式选择',
              options: []
            }
          },
          {
            type: 'select',
            label: '交易类型',
            props: {
              fieldName: 'businessType',
              placeholder: '交易类型选择',
              options: []
            }
          },
          {
            type: 'select',
            label: '状态',
            labelWidth: '45px',
            props: {
              fieldName: 'status',
              placeholder: '状态选择',
              options: []
            }
          }
        ],
        tableCols: [
          { label: '公告编号', prop: 'noticeNo', minWidth: 300 },
          { label: '宗地编号', prop: 'name', minWidth: 300 },
          // { label: '所属区域', prop: 'canton' },
          { label: '交易类型', prop: 'businessTypeText' },
          { label: '起始价(万元)', prop: 'beginPriceText', minWidth: 150, align: 'right' },
          { label: '保证金(万元)', prop: 'earnestMoneyText', minWidth: 150, align: 'right' },
          { label: '竞价幅度（万元）', prop: 'priceStepText', minWidth: 150, align: 'right' },
          { label: '竞买(卖)申请人数', prop: 'applyNum', minWidth: 100 },
          { label: '状态', prop: 'statusText', width: '80px' },
          { label: '是否中止', prop: 'isSuspend', width: '80px',
            render: (h, scope) => {
              const type = scope.row.isSuspend;
              if(type === 0){
                return <div>否</div>;
              }else{
                return <div>是</div>;

              }
            }
          },
          { label: '是否终止', prop: 'isStop', width: '80px',
            render: (h, scope) => {
              const type = scope.row.isStop;
              if(type === 0){
                return <div>否</div>;
              }else{
                return <div>是</div>;

              }
            }
          },
          { label: '保证金缴纳截至时间', prop: 'endEarnestTime', width: '180px' },
          { label: '竞买申请结束时间', prop: 'endApplyTime', width: '180px' },
          // { label: '自由报价开始时间', prop: 'beginFocusTime', width: '180px' },
          { label: '限时竞价开始时间', prop: 'beginLimitTime', width: '180px' }
        ],
        page: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        tableData: [],
        selectIds: [],
        editshow: false,
        editdata: {}
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.init();
      });
    },
    methods: {
      init () {
        // this._getSelectListByParentCode();
        this._getTransactionType();
        this._getBusinessType();
        this._getTargetStatus();
        this.getList();
      },
      /**
       * 获取交易方式下拉框数据
       */
      _getTransactionType () {
        this.searchItems[1].props.options = [];
        getTransactionType().then(res => {
          if (res.code === '200') {
            res.data.map(item => {
              this.searchItems[1].props.options.push({
                name: item.value,
                id: item.key
              })
            });
          }
          this.$forceUpdate();
        });
      },
      /**
       * 获取交易类型下拉框数据
       */
      _getBusinessType () {
        this.searchItems[2].props.options = [];
        getBusinessType().then(res => {
          if (res.code === '200') {
            res.data.map(item => {
              this.searchItems[2].props.options.push({
                name: item.value,
                id: item.key
              })
            });
          }
          this.$forceUpdate();
        });
      },
      /**
       * 获取区域下拉框数据
       */
      _getSelectListByParentCode () {
        this.searchItems[1].props.options = [];
        getSelectListByParentCode().then(res => {
          if (res.code === '200') {
            res.data.map(item => {
              this.searchItems[1].props.options.push({
                name: item.name,
                id: item.code
              })
            });
          }
          this.$forceUpdate();
        });
      },
      /**
       * 获取状态下拉框数据
       */
      _getTargetStatus () {
        this.searchItems[3].props.options = [];
        getTargetStatus().then(res => {
          if (res.code === '200') {
            res.data.map(item => {
              this.searchItems[3].props.options.push({
                name: item.value,
                id: item.key
              })
            });
          }
          this.$forceUpdate();
        });
      },
      onCurrentChange (val) {
        this.page.current = val;
        this.getList();
      },
      onPageSizeChange (val) {
        this.page.pageSize = val;
        this.onCurrentChange(1);
      },
      /**
       * 查询
       */
      onSearch (val) {
        this.searchVal = {
          ...val
        }
        this.page.current = 1;
        this.getList();
      },
      /**
       * 获取列表
       */
      getList () {
        const param = {
          data: this.searchVal,
          pageNo: this.page.current,
          pageSize: this.page.pageSize
        };
        getBreakPlowTargetList(param).then(res => {
          const { data, total } = res.data;
          this.page.total = total;
          this.tableData = data;
        });
      },
      closeEdit (type) {
        this.editshow = false;
        this.getList();
      },
      /**
       * 详情
       */
      toPage (configType, parames) {
        this.editdata = { configType, ...parames , btnStatusData: { isSuspend : parames.row.canSuspend, isStop : parames.row.canStop, isRestart : parames.row.canRestart},transManage:'transManage' };
        // this.editdata = { type: type, id: id, btnStatusData: { isSuspend : row.canSuspend, isStop : row.canStop, isRestart : row.canRestart},transManage:'transManage' };
        this.editshow = true;
      },
      onSelectionChange (args) {
        this.selectIds = args.map(item => item.id);
      },
      handleSuspend () {
        getTargetSuspend({targetIds:this.selectIds}).then(res => {
          if (res.code === '200') {
              this.$notify({
                title: '成功',
                message: '中止成功',
                type: 'success',
                position: 'bottom-right'
              });
              this.getList();
          }
        });
      },
      handleStop () {
        getTargetStop({targetIds:this.selectIds}).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '终止成功',
              type: 'success',
              position: 'bottom-right'
            });
            this.getList();
          }
        });
      }
    }
}
</script>
<style lang="less" scoped>
.container{
    >.comp-page-table{
    padding:0 20px;
    background: #fff;
  }
}
</style>