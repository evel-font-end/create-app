<template>
  <div id="base">
    <dialog-cont
      @on-cancel="canceledit('cancel')"
      @on-close="canceledit('close')"
      @on-confirm="confirmedit"
      @on-open="openedit"
      :title="`${title}`"
      
      :visible.sync="editshow"
      ref="dialog"
      append-to-body
    >
      <FormItem
        ref="formItem"
        :layout="layout"
        :rules="formRules"
        :disabled="inputDisabled"
        :isEdit="isEdit"
        :form="form"
        @submit="submitForm"
      />
      <div class="table">
        <page-table
          col-align="left"
          operator-width="200"
          operator
          :data="sureUserNameList"
          :cols="tableCols"
          :showPage="false"
        >
          <template
            slot-scope="scope"
            slot="operator"
          >
            <div>
              <el-button
                plain
                size="small"
                title="减"
                :style="{marginRight: '10px'}"
                icon="el-icon-minus"
                @click.prevent.stop="delUser(scope)"
                class="addAndDelBtn"
                :disabled="(sureUserNameList.length === 1) && (scope.index === sureUserNameList.length - 1)"
              >
              </el-button>
              <el-button
                plain
                size="small"
                title="加"
                icon="el-icon-plus"
                @click.prevent.stop="addUser"
                v-if="scope.index === sureUserNameList.length - 1"
                class="addAndDelBtn"
              >
              </el-button>
            </div>
          </template>
        </page-table>
      </div>
          <dialog-cont
            @on-cancel="cancelUseredit('cancel')"
            @on-close="cancelUseredit('close')"
            @on-confirm="confirmUseredit"
            @on-open="openUseredit"
            :title="`${title}`"
            width="680px"
            :visible.sync="usershow"
            ref="dialog"
            append-to-body
          >
            <search-form
              :searchItems="searchItems"
              @onSearch="onSearch"
            />
            <page-table
              ref="userPageTable"
              col-align="left"
              :data="userTableData"
              :cols="userTableCols"
              selection
              :page-current="page.current"
              :total="page.total"
              :page-size="page.pageSize"
              @current-change="onCurrentChange"
              @size-change="onPageSizeChange"
              @selection-change="onSelectionChange"
              reserveSelection
              :row-key="getRowKey"
            >
            </page-table>
          </dialog-cont>
    </dialog-cont>
  </div>
</template>

<script>
import Wrapper from '@/components/wrapper';
import Flex from '@/components/flex';
import searchForm from '@/components/searchForm/searchForm';
import FormItem from '@/components/formItem';
import dialogCont from '@/components/dialog';
import PageTable from '@/components/page-table';
import {
  selectListByParentCode
} from '@/api';
import {
  getApproveLinkedBusinessType,
  getUserList,
  saveApproveNode,
  getApproveNodeDetail
} from '@/api/baseInfoManage';

export default {
  name: 'baseInfo',
  components: {
    Wrapper,
    Flex,
    FormItem,
    dialogCont,
    PageTable,
    searchForm
  },
  props: {
    show: Boolean,
    data: {}
  },
  data () {
    const { configType, row } = this.data;
    return {
      title: '节点编辑',
      inputDisabled: false,
      isEdit: true,
      isOpen: false,
      searchItems: [{
        type: 'input',
        label: '用户名称',
        props: {
          fieldName: 'realName',
          placeholder: '请输入用户名称'
        }
      }, {
        type: 'select',
        label: '职位',
        props: {
          fieldName: 'position',
          options: []
        }
      }],
      form: {
      },
      layout: [
        {
          title: '基本信息',
          formItems: [
            {
              label: '节点名称',
              prop: 'nodeName',
              inputType: 'input',
              span: 12
            },
            {
              label: '节点编号',
              prop: 'nodeNo',
              inputType: 'input',
              span: 12
            },
            {
              label: '节点模式',
              prop: 'nodeModle',
              inputType: 'select',
              span: 12,
              options: [{
                id: '1',
                name: '传统模式'
              }, {
                id: '2',
                name: '比例模式'
              }]
            },
            {
              label: '同意人数',
              prop: 'agreePercentage',
              inputType: 'inputNumber',
              span: 12
            }
          ]
        }
      ],
      formRules: {
        nodeName: { required: true, message: '请输入节点名称', trigger: 'change' },
        nodeNo: { required: true, message: '请输入节点编号', trigger: 'change' },
        nodeModle: { required: true, message: '请输入节点模式', trigger: 'change' },
        agreePercentage: { type: 'number', message: '同意人数必须为数字值', trigger: 'change' }
      },
      editshow: false,
      editdata: {},
      tableCols: [
        { label: '审核人', prop: 'realName' },
        { label: '审核人账号', prop: 'username' },
        { label: '所属部门', prop: 'department' }
      ],
      usershow: false,
      userNameList: [],
      sureUserNameList: [{}],
      userTableData: [],
      userTableCols: [
        { label: '用户名称', prop: 'realName' },
        { label: '手机号码', prop: 'mobile' },
        {
          label: '职位',
          prop: 'position',
          render: (h, scope) => {
            const selectOptions = this.searchItems[1].props.options;
            const positionTest = selectOptions.find(option => option.id === scope.row.position);
            return (
              <div>
                {positionTest && positionTest.name}
              </div>
            )
          }
        }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      rowId: 'approveUserId'
    };
  },
  mounted () {
    this.$nextTick(() => {
      // this._getApproveLinkedBusinessType()
    });
  },
  computed: {
  },
  watch: {
    show (val) {
      this.editshow = val;
    },
    data (val) {
      this.editdata = val;
      this.isOpen = val.configType && val.configType === 'open';
    }
  },
  methods: {
    // 用户数据选择翻页记忆
    getRowKey (row) {
      return row.id;
    },
    openedit () {
      this.isOpen && this.init()
    },
    init () {
      const { id } = this.editdata;
      getApproveNodeDetail(id).then(res => {
        if (res.code === '200') {
          this.form = {
            nodeName: res.data.nodeName,
            nodeNo: res.data.nodeNo,
            nodeModle: res.data.nodeModle+'',
            agreePercentage: res.data.agreePercentage
          };
          this.sureUserNameList = res.data.approveUserDtos.map(dto => {
            return {
              ...dto,
              realName: dto.approveUserRealName,
              username: dto.approveUser
            }
          });
          this.$forceUpdate()
        }
      });
      if (this.searchItems[1].props.options.length === 0) {
        this._getSelectList('position');
      }
    },
    openUseredit () {
      // if (this.userTableData.length === 0) {
        this._getUserList();
      // }
    },
    _getSelectList (code) {
      selectListByParentCode(code).then(res => {
        if (res.code === '200') {
          this.searchItems[1].props.options = Object.freeze(res.data).map(data => {
            return {
              ...data,
              id: data.code
            }
          });
        }
      });
    },
    onSearch (val) {
      this._getUserList(val);
    },
    _getUserList (searchVal) {
      let data = {
        data: {
          'userType': 0,
          ...searchVal
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      getUserList(data).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data
          this.userTableData = data;
          this.page.total = total;
        }
      });
    },
    onCurrentChange (val) {
      this.page.current = val;
      this._getUserList()
      setTimeout(() => {
        if (this.sureUserNameList && this.$refs.userPageTable) {
          this.$refs.userPageTable.onRowChange(this.sureUserNameList, this.rowId)
        }
      }, 1000);
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    },
    onSelectionChange (args) {
      this.userNameList = args.map(arg => {
        return {
          ...arg,
          approveUserId: arg.id
        }
      });
    },
    delUser (scope) {
      const sureUserNameList = JSON.parse(JSON.stringify(this.sureUserNameList));
      sureUserNameList.splice(scope.index, 1);
      this.sureUserNameList = sureUserNameList;
      this.$forceUpdate();
    },
    addUser () {
      this.usershow = true;
      setTimeout(() => {
        if (this.sureUserNameList && this.$refs.userPageTable) {
          this.$refs.userPageTable.onRowChange(this.sureUserNameList, this.rowId)
        }
      }, 1000);
    },
    closeedit () {
      this.editshow = false;
      this.editData = {};
      this.userTableData = [];
      this.sureUserNameList = [{}];
      this.$refs.formItem.cancelForm();
      if (this.$refs.userPageTable) {
        this.$refs.userPageTable.getPageTable();
      }
    },
    canceledit (type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    cancelUseredit () {
      if (this.$refs.userPageTable) {
        this.$refs.userPageTable.getPageTable();
      }
      this.page = {
        current: 1,
        pageSize: 10,
        total: 0
      };
      this.usershow = false;
    },
    confirmUseredit () {
      if (this.userNameList.length > 0) {
        this.sureUserNameList = this.userNameList;
        this.userNameList = [];
        // this.rowId = 'id';
      }
      this.cancelUseredit();
    },
    confirmedit () {
      this.$refs.formItem.submitForm()
    },
    submitForm (val) {
      const { id, configId } = this.editdata;
      if (this.sureUserNameList.length === 1 && !this.sureUserNameList[0].id) {
        this.$notify.error({
          title: '失败',
          message: '请选择审批人!!!',
          position: 'bottom-right'
        });
        return;
      }
      const approveUserCommands = this.sureUserNameList.map(list => {
        return {
          approveUser: list.username || list.approveUser
        };
      });
      let param = {
        approveUserCommands,
        nodeName: val.nodeName,
        nodeNo: val.nodeNo,
        nodeModle: +val.nodeModle,
        agreePercentage: +val.agreePercentage,
        operateFlag: 'add',
        configId
      };
      if (id) {
        if (this.isOpen) {
          param = {
            ...param,
            operateFlag: 'edit',
            id
          }
        } else {
          param = {
            ...param,
            previousNode: id
          }
        }
      }
      saveApproveNode(param).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.$emit('success');
          this.editshow = false;
          this.editdata = {};
        } else {
        }
      })
    },
    _getApproveLinkedBusinessType () {
      this.layout[0].formItems[2].options = [];
      getApproveLinkedBusinessType().then(res => {
        if (res.code === '200') {
          res.data.map(item => {
            this.layout[0].formItems[2].options.push({
              name: item.value,
              id: item.key
            })
          });
        }
        this.$forceUpdate();
      });
    },
    cancelForm () {
      this.$refs.supplyFormItem.cancelForm();
    }
  },
  created () {
    // !this.isAdd && this.reqDetail()
  }
};
</script>

<style lang="less" scoped>
#base{

}
  .addAndDelBtn{
    border: 1px solid #DCDFE6;
    padding: 9px;
  }
</style>
