<template>
  <div class="container">
    <header-title>
      <search-form slot="searchBox" :searchItems="searchItems" @onSearch="onSearch" :addBtnVisible="$_hasOperation($options.name,'add')" @on-addBtn="openDialog()"/>
    </header-title>

    <page-table
      :data="tableData"
      :cols="tableCols"
      col-align="left"
      operator
      operator-width="150"
      :page-current="page.current"
      :total="page.total"
      :page-size="page.pageSize"
      @current-change="onCurrentChange"
      @size-change="onPageSizeChange"
    >
      <template slot-scope="scope" slot="operator">
        <el-button
          type="text"
          icon="iconfont icon-xiugaii"
          title="编辑"
          size="small"
          :disabled="!scope.row.enabled"
          @click="openDialog('edit',scope.row.id)"
        ></el-button>
        <el-button
          type="text"
          icon="iconfont icon-peizhijiaose"
          title="配置角色"
          size="small"
          :disabled="!scope.row.enabled"
          @click="setRole({
                        id: scope.row.id,
                        index: scope.$index,
                        row: scope.row})"
        ></el-button>
        <el-button
          type="text"
          icon="iconfont icon-jinyong"
          title="禁用"
          size="small"
          @click="enabledUser(scope.row)"
          v-if="scope.row.enabled"></el-button>
        <el-button
          type="text"
          icon="iconfont icon-qiyong"
          title="启用"
          size="small"
          @click="enabledUser(scope.row)"
          v-if="!scope.row.enabled"></el-button>
        <el-button
          type="text"
          icon="iconfont icon-zhongzhimima"
          title="重置密码"
          size="small"
          :disabled="!scope.row.enabled"
          @click="resetPW(scope.row.username)"></el-button>
      </template>
    </page-table>

    <user-dialog
      :visible="editShow"
      @success="handleSearch"
      @close="editShow=false"
      :data="editData"
    ></user-dialog>
    <!-- 配置用户角色 -->
    <dialog-cont :visible="dialog.userRole" title="配置用户角色"  @on-cancel="dialog.userRole=false" @on-close="dialog.userRole=false" @on-confirm="subFromUserRole">
      <user-role ref="userRole" :get-user-info="dialog.getUserInfo" @get-user-role-list="getUserRoleList"></user-role>
    </dialog-cont>
  </div>
</template>

<script>
import { JSEncrypt } from 'jsencrypt';
import Flex from '@/components/flex';
import PageTable from '@/components/page-table';
import UserDialog from './users/EditUserDialog.vue';
import dialogCont from '@/components/dialog';
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import userRole from './users/userRole';
import { userList, resetPassword, cancelUser, enableUser, listRolesByUsername, addUserRoles } from '@/api';
import { PRIVATE_KEY } from 'util/constants';

export default {
  name: 'user_management',
  components: {
    PageTable,
    UserDialog,
    dialogCont,
    Flex,
    headerTitle,
    searchForm,
    userRole
  },
  data () {
    return {
      tableCols: [
        { label: '用户名称', prop: 'username' },
        { label: '真实姓名', prop: 'realName' },
        { label: '性别', prop: 'sex', minWidth: '50px' },
        { label: '邮箱', prop: 'email' },
        { label: '手机号', prop: 'mobile', minWidth: '150px' }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],

      searchVal: {
        username: '',
        realName: '',
        sex: ''
      },
      searchItems: [
        {
          type: 'input',
          label: '用户姓名：',
          props: {
            placeholder: '请输入用户姓名',
            fieldName: 'username'
          }
        },
        {
          type: 'input',
          label: '真实姓名：',
          props: {
            placeholder: '请输入真实姓名',
            fieldName: 'realName'
          }
        },
        {
          type: 'select',
          label: '性别：',
          labelWidth: '45px',
          props: {
            fieldName: 'sex',
            placeholder: '性别选择',
            options: [
              // { name: '全部', id: '' },
              { name: '男', id: 1 },
              { name: '女', id: 0 }
            ]
          }
        }
      ],
      editShow: false,
      editData: {},
      dialog: {
        // view: false, // 添加用户
        // title: "添加用户", // 弹窗标题
        // stateType: "add", // 弹窗的模式
        getUserInfo: {}, // (添加/修改/查看)当前窗口打开的用户行
        // remove: false, // 删除提示窗口
        userRole: false // 配置用户角色弹窗
      }
    };
  },
  methods: {
    openDialog (type, id) {
      this.editShow = !this.editShow;
      if (type) {
        this.editData = { id: id, type: 'edit' };
      } else {
        this.editData = {};
      }
    },
    onSearch (val) {
      this.searchVal = {
        username: val.username ? val.username : '',
        realName: val.realName ? val.realName : '',
        sex: val.sex ? val.sex : ''
      };
      this.handleSearch();
    },
    getList () {
      const param = {
        data: this.searchVal,
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      userList(param).then(res => {
        const { data, total } = res.data;
        this.page.total = total;
        this.tableData = data;
      });
    },
    // 重置用户密码
    resetPW (username) {
      // 公钥加密
      const encrypt = new JSEncrypt();
      // 设置公钥
      encrypt.setPublicKey(PRIVATE_KEY);
      resetPassword(username).then(res => {
        if (res.code === '200') {
          const data = res.data;
          const password = encrypt.decrypt(data.password);
          this.$alert(`<div><strong>账号：</strong><div>${data.username}</div><br /><strong>密码：</strong><div>${password}</div></div>`, '重置密码成功', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
          });
        }
      });
    },
    // 禁用启用
    enabledUser (row) {
      let username = row.username;
      if (row.enabled) {
        cancelUser(username).then(res => {
          if (res.code === '200') {
            this.$notify({
              type: 'success',
              title: '成功',
              message: '用户禁用成功',
              position: 'bottom-right'
            });
            this.getList();
          }
        });
      } else {
        enableUser(username).then(res => {
          if (res.code === '200') {
            this.$notify({
              type: 'success',
              title: '成功',
              message: '用户启用成功',
              position: 'bottom-right'
            });
            this.getList();
          }
        });
      }
    },
    // 配置用户角色
    setRole (info) {
      listRolesByUsername(info.row.username).then(res => {
        if (res.code === '200') {
          const list = Object.assign({}, { userRoleList: res.data }, info);
          this.dialog.userRole = true;
          this.dialog.getUserInfo = list;
        }
      });
    },
    // 配置用户角色 弹窗按确定
    subFromUserRole () {
      if (this.dialog.userRole && this.$refs.userRole) {
        let userFrom = this.$refs.userRole;
        userFrom.subUserRole();
      }
    },
    // 得到用户配置角色的数据
    getUserRoleList (role) {
      const { username, rolesList } = role;
      addUserRoles({ rolesList, username }).then(res => {
        if (res.code === '200') {
          this.dialog.userRole = false;
          this.$notify({
            title: '成功',
            message: '配置用户角色成功',
            type: 'success',
            position: 'bottom-right'
          });
        }
      });
    },
    onConfirm () {},
    onCurrentChange (val) {
      this.page.current = val;
      this.getList();
    },
    onPageSizeChange (val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    handleSearch () {
      this.editShow = false;
      this.onCurrentChange(1);
    }
  },
  created () {
    this.getList();
  }
};
</script>

<style lang="less" scoped>
// .container {
//   padding: 20px !important;
// }
</style>
