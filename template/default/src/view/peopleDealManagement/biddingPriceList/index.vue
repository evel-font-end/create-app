<template>
  <div class="container">
    <header-title>
      <search-form slot="searchBox" :searchItems="searchItems" @onSearch="onSearch" />
    </header-title>

    <page-table
      :data="tableData"
      :cols="tableCols"
      col-align="left"
      operator
      operator-width="100"
      :page-current="page.current"
      :total="page.total"
      :page-size="page.pageSize"
      @current-change="onCurrentChange"
      @size-change="onPageSizeChange"
    >
      <template slot-scope="scope" slot="operator">
        <el-button type="text" icon="iconfont icon-feeds-fill" title="详情" size="small" @click.prevent.stop="showView(scope.$index, scope.row)"></el-button>
        <el-button
          type="text"
          size="small"
          title="删除"
          icon="iconfont icon-delete"
          v-if="scope.row.canDel === 1"
          @click.prevent.stop="handleDelBtnClick(scope.row)"></el-button>
        <el-button
          type="text"
          size="small"
          icon="iconfont icon-shangchuan"
          title="上传附件"
          v-if="scope.row.canDel !== 1"
          @click.prevent.stop="toPage(scope.row)"></el-button>
      </template>
    </page-table>
    <application-info :show="aInfoShow" :data="aInfoData" :items="aInfoItems" @cancel="dialogCancel" :tableData="unionsTable" :tableCols="unionsClos" :hasAttach="true"/>
    <Detail :show="editshow" :idata="editdata" @cancel="closeEdit" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PageTable from '@/components/page-table';
import headerTitle from '@/components/headerTitle/headerTitle';
import searchForm from '@/components/searchForm/searchForm';
import { STATUS_YESNO } from '@/util/constants';
import commonApi from '@/mixins/commonApi';
import { childInfoItems, infoItems, timeItems } from './utils';
import applicationInfo from './applicationInfo';
import Detail from './detail';
import {
  getUserTransLicense,
  getTransLicenseInfo,
  getLicenseStatus,
  delTransLicense
} from '@/api/peopleDealManagement';
import {
  getTransactionType,
  getBusinessType
} from '@/api/peopleDealManagement/biddingPriceList/index';
export default {
  name: 'bidding_price_list',
  components: {
    PageTable,
    headerTitle,
    searchForm,
    applicationInfo,
    Detail
  },
  mixins: [commonApi()],
  data () {
    const { options } = this.$_useTypes(STATUS_YESNO);
    return {
      tableCols: [
        {
          label: '竞买编号',
          prop: 'applyNo',
          render: (h, scope) => {
            return (
              <div>
                {
                  <div>
                    <el-button size="mini" type="text" onClick={() => { this.showView(scope.$index, scope.row) } } >{scope.row.applyNo}
                    </el-button>
                  </div>
                }
              </div>
            )
          }
        },
        { label: '宗地编号', prop: 'targetNo' },
        { label: '交易类型', prop: 'businessTypeText' },
        { label: '交易方式', prop: 'transTypeText' },
        { label: '申请状态', prop: 'statusText', width: '100px' },
        { label: '是否联合竞买', prop: 'isUnionText', width: '110px' },
        { label: '是否缴足保证金', prop: 'earnestMoneyText', width: '120px' },
        { label: '申请时间', prop: 'applyDate', width: '180px' },
        { label: '标的状态', prop: 'targetStatusText', width: '80px' }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      aInfoShow: false,
      aInfoData: {},
      aInfoItems: [
        {
          title: '保证金子账户信息',
          formItems: childInfoItems
        },
        {
          title: '申请信息',
          formItems: infoItems
        },
        {
          title: '详细时间表',
          type: 'time',
          formItems: timeItems
        }
      ],
      unionsTable: [],
      unionsClos: [
        {label: '竞买人名称', prop: 'bidderName'},
        {label: '法人', prop: 'corporation'},
        {label: '联系电话', prop: 'bidderTel'},
        {label: '联系人', prop: 'bidderContact'},
        {label: '证件号', prop: 'bidderIdno'},
        {label: '所占比例', prop: 'percent'}
      ],
      searchVal: {
        targetNo: '', // 标的编号
        applyUnion: '', // 联合竞买
        status: '', // 资格状态
        businessType: '', // 资格状态
        transType: '' // 资格状态
      },
      searchItems: [
        {
          type: 'input',
          label: '编号：',
          props: {
            placeholder: '请输入编号',
            fieldName: 'targetNo'
          }
        },
        {
          type: 'select',
          label: '联合竞买：',
          props: {
            fieldName: 'applyUnion',
            placeholder: '竞买方式选择',
            options: options
          },
          hide: true
        },
        {
          type: 'select',
          label: '资格状态：',
          props: {
            fieldName: 'status',
            placeholder: '状态选择',
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
          label: '交易方式',
          props: {
            fieldName: 'transType',
            placeholder: '交易方式选择',
            options: []
          }
        }
      ],
      tableDataSelect: [],
      editshow: false,
      editdata: {}
    };
  },
  computed: {
    ...mapGetters(['common'])
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init () {
      this._getLicenseStatus();
      this._getbidBusinessType();
      this._getbidTransactionType();
      this.getList();
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getList();
    },
    onPageSizeChange (val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    toPage (row) {
      const configType = 'add';
      this.editdata = { configType, id: row.licenseId }; // licenseId
      this.editshow = true;
    },
    dialogCancel (type) {
      this.aInfoData = {};
      this.aInfoShow = false;
    },
    closeEdit (type) {
      this.editdata = {};
      this.editshow = false;
    },
    // 查询
    onSearch (val) {
      this.searchVal = {
        ...val
      }
      this.getList();
    },
    // 获取列表
    getList () {
      const param = {
        data: this.searchVal,
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      getUserTransLicense(param).then(res => {
        const { data, total } = res.data;
        this.page.total = total;
        this.tableData = data;
      });
    },
    handleDelBtnClick (row) {
      this.$confirm('此操作将永久删除该所选申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTransLicense(row.id).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              position: 'bottom-right'
            });
            this.onCurrentChange(1);
          }
        });
      });
    },
    // 申请状态下拉框数据
    _getLicenseStatus () {
      this.searchItems[2].props.options = [];
      getLicenseStatus().then(res => {
        if (res.code === '200') {
          res.data &&
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
    _getbidBusinessType () {
      this.searchItems[3].props.options = [];
      getBusinessType().then(res => {
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
    // 获取交易方式下拉框数据
    _getbidTransactionType () {
      this.searchItems[4].props.options = [];
      getTransactionType().then(res => {
        if (res.code === '200') {
          res.data.map(item => {
            this.searchItems[4].props.options.push({
              name: item.value,
              id: item.key
            })
          });
        }
        this.$forceUpdate();
      });
    },
    showView (index, row) {
      getTransLicenseInfo(row.id).then(res => {
        if (res.code === '200') {
          this.aInfoData = {
            data: res.data,
            configType: 'detail',
            id: row.licenseId // licenseId
          };
          this.aInfoShow = true;
          this.unionsTable = res.data.unions;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
// .container {
//   padding: 20px !important;
// }
</style>
