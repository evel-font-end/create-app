<template>
  <div class="container">
    <header-title>
      <search-form slot="searchBox" :searchItems="searchItems" @onSearch="onSearch" :addBtnVisible="$_hasOperation($options.name,'add')" @on-addBtn="openDialog('add')"/>
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
          type="text" icon="iconfont icon-fenpeijiaosequanxian" title="分配角色权限"
          @click="setRoleBtn(scope.row)"
          v-if="$_hasOperation($options.name,'addRolePermissions')">
        </el-button>
        <el-button
          type="text" icon="iconfont icon-xiugaii" title="编辑"
          @click="openDialog('edit',{id: scope.row.id,index: scope.$index,row: scope.row})"
          v-if="$_hasOperation($options.name,'edit')">
        </el-button>
        <el-button
          type="text" icon="iconfont icon-jinyong" title="禁用"
          @click="off({id: scope.row.id,index: scope.$index,row: scope.row})"
          v-if="(scope.row.enabled)&&($_hasOperation($options.name,'disable'))">
        </el-button>
        <el-button
          type="text" icon="iconfont icon-qiyong" title="启用"
          @click="off({id: scope.row.id,index: scope.$index,row: scope.row})"
          v-if="(!scope.row.enabled)&&($_hasOperation($options.name,'enable'))">
        </el-button>
        <el-button type="text" icon="iconfont icon-delete" title="删除" @click="delRoleBtn(scope.row)" v-if="false && $_hasOperation($options.name,'delete')"></el-button>
      </template>
    </page-table>

    <!-- 删除角色 -->
    <dialog-cont
      @on-cancel="dialog.delRole=false"
      @on-close="dialog.delRole=false"
      width="240px"
      @on-confirm="removeSure"
      :visible="dialog.delRole"
      class="dialogCont"
    >
      <span>确认删除当前角色?</span>
    </dialog-cont>
    <!--添加修改查看用户 -->
    <dialog-cont
      :visible="dialog.view"
      :title="dialog.title"
      width="400px"
      @on-cancel="dialog.view=false"
      @on-close="dialog.view=false"
      @on-confirm="subFromUser"
      :confirmShow="dialog.stateType==='show'? false : true"
    >
      <operation-roles
        ref="operationRoles"
        :stateType="dialog.stateType"
        v-if="dialog.stateType !== 'show'"
        :get-user-info="dialog.getUserInfo"
        @getRoleInfo="getRoleInfo"
      ></operation-roles>

      <el-tabs v-else :lazy="true" v-model="dialog.tab">
        <el-tab-pane label="角色基本信息" name="0">
          <operation-roles
            ref="operationRoles"
            :stateType="dialog.stateType"
            :get-user-info="dialog.getUserInfo"
            @getRoleInfo="getRoleInfo"
          ></operation-roles>
        </el-tab-pane>
        <el-tab-pane label="角色权限信息" name="1">
          <match-jurisdiction
            class="jurisdiction"
            ref="角色权限信息"
            title="当前角色权限信息："
            :showMatch="true"
            :stateType="dialog.stateType"
            :get-user-info="dialog.getUserInfo"
            @getRoleJurisdiction="getRoleJurisdiction"
          ></match-jurisdiction>
        </el-tab-pane>
      </el-tabs>
    </dialog-cont>
    <!-- 分配角色权限 -->
    <dialog-cont
      width="800px"
      :visible="dialog.matchJurisdiction"
      title="分配角色权限"
      @on-cancel="dialog.matchJurisdiction=false"
      @on-close="dialog.matchJurisdiction=false"
      @on-confirm="subRoleJurisdiction"
    >
      <match-jurisdiction
        class="jurisdiction"
        ref="matchJurisdiction"
        :stateType="dialog.stateType"
        :get-user-info="dialog.getUserInfo"
        @getRoleJurisdiction="getRoleJurisdiction"
      ></match-jurisdiction>
    </dialog-cont>
  </div>
</template>

<script>
import Flex from '@/components/flex';
import PageTable from '@/components/page-table';
import dialogCont from '@/components/dialog';
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import operationRoles from './operationRoles';
import matchJurisdiction from './matchJurisdiction';
import {
  listRolesByCondition,
  addRolePermissions,
  addRole,
  updateRole,
  deleteRole,
  addUserRoles,
  disableRole,
  enableRole
  //   resetPassword,
  //   cancelUser,
  //   enableUser,
  //   listRolesByUsername,
  //   addUserRoles
} from '@/api';

export default {
  name: 'role_management',
  components: {
    PageTable,
    dialogCont,
    Flex,
    headerTitle,
    searchForm,
    operationRoles,
    matchJurisdiction
  },
  data () {
    return {
      tableCols: [
        { label: '角色ID', prop: 'id' },
        { label: '角色名称', prop: 'roleName' },
        { label: '角色描述', prop: 'roleDescribe' },
        { label: '状态', prop: 'enabledText', minWidth: '80px' },
        { label: '创建时间', prop: 'createTime', width: '180px' }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],

      searchVal: {
        roleName: '',
        status: ''
      },
      searchItems: [
        {
          type: 'input',
          label: '角色名称：',
          props: {
            placeholder: '请输入角色名称',
            fieldName: 'roleName'
          }
        },
        {
          type: 'select',
          label: '角色状态：',
          props: {
            fieldName: 'status',
            placeholder: '状态选择',
            options: [
              // { name: '全部', id: '' },
              { name: '启用', id: 1 },
              { name: '禁用', id: 0 }
            ]
          }
        }
      ],
      editShow: false,
      editData: {},
      dialog: {
        view: false, // 添加角色
        title: '新增角色', // 弹窗标题
        stateType: 'add', // 弹窗的模式
        getUserInfo: {}, // (添加/修改/查看)当前窗口打开的用户信息
        rolesList: [],
        tab: '0', // 查看角色基本信息默认打开标签
        matchJurisdiction: false, // 匹配角色权限
        delRole: false // 删除角色
      }
    };
  },
  methods: {
    // 打开 新增/修改/查看 窗口
    openDialog (state, info = {}) {
      this.dialog.view = true;
      this.dialog.stateType = state;
      switch (state) {
        case 'add':
          this.dialog.title = '新增角色';
          this.dialog.getUserInfo = info;
          break;
        case 'edit':
          this.dialog.title = '修改角色';
          this.dialog.getUserInfo = info;
          break;
        case 'show':
          this.dialog.title = '查看角色信息';
          this.dialog.getUserInfo = info;
          break;
      }
    },
    onSearch (val) {
      this.searchVal = {
        roleName: val.roleName ? val.roleName : '',
        status: val.status ? val.status : ''
      };
      this.handleSearch();
    },
    getList () {
      const param = {
        data: this.searchVal,
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      let _this = this;
      listRolesByCondition(param).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data;
          data.map(item => {
            item.enabledText = item.enabled ? '启用' : '禁用';
          });
          this.tableData = data;
          this.page.total = total;
        }
      });
    },
    // 分配角色权限弹窗-确定
    subRoleJurisdiction () {
      this.$refs.matchJurisdiction.getJurisdictionInfo();
    },
    // 获取分配角色权限弹窗 数据
    getRoleJurisdiction (info) {
      addRolePermissions({ ...info }).then(res => {
        if (res.code === '200') {
          this.$notify({
            type: 'success',
            title: '成功',
            message: '分配角色成功',
            position: 'bottom-right'
          });
          this.dialog.matchJurisdiction = false;
        }
      });
    },
    // 添加/修改 角色 弹窗确定得到数据返回操作
    getRoleInfo (data, state) {
      const {
        remark, //  备注
        roleCode, //  角色编码
        id,
        roleDescribe, // 角色描述
        roleName // 角色名称
      } = data;

      switch (state) {
        case 'add':
          addRole({ remark, roleCode, roleDescribe, roleName }).then(res => {
            if (res.code === '200') {
              this.getList(1);

              this.dialog.view = false;
              this.$notify({
                title: '成功',
                message: '新增角色成功',
                type: 'success',
                position: 'bottom-right'
              });
            }
          });
          break;
        case 'edit':
          updateRole({ remark, id, roleDescribe, roleName }).then(res => {
            if (res.code === '200') {
              this.getList();
              this.dialog.view = false;
              this.$notify({
                title: '成功',
                message: '更新角色成功',
                type: 'success',
                position: 'bottom-right'
              });
            }
          });
          break;
        case 'show':
          break;
      }

      if (state !== 'show') this.getList();
    },
    // 分配角色
    setRoleBtn (row) {
      this.dialog.matchJurisdiction = true;
      this.dialog.stateType = 'edit';
      this.dialog.getUserInfo = {id: row.id, index: row.$index, row: row}
    },
    // 删除角色
    delRoleBtn (row) {
      this.dialog.delRole = true;
      this.dialog.getUserInfo = {
        id: row.id,
        index: row.$index,
        row: row
      };
    },

    // 新增/修改/查看用户 弹窗按确定
    subFromUser () {
      let userFrom = this.$refs.operationRoles;
      switch (this.dialog.stateType) {
        case 'add':
          userFrom.subUserRole();
          break;
        case 'edit':
          userFrom.subUserRole();
          break;
        case 'show':
          this.dialog.view = false;
          break;
      }
    },
    // 删除角色弹窗 确定
    removeSure () {
      let { id } = this.dialog.getUserInfo.row;

      deleteRole({ id }).then(res => {
        if (res.code === '200') {
          this.getList();
          this.$notify({
            type: 'success',
            title: '成功',
            message: '角色删除成功',
            position: 'bottom-right'
          });
          this.dialog.delRole = false;
        }
      });
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
    // 启用/禁用角色
    off (info) {
      const { enabled, id } = info.row;
      if (enabled) {
        disableRole({ id }).then(res => {
          if (res.code === '200') {
            this.getList();
            this.$notify({
              type: 'success',
              title: '成功',
              message: '角色禁用成功',
              position: 'bottom-right'
            });
          }
        });
      } else {
        enableRole({ id }).then(res => {
          if (res.code === '200') {
            this.getList();
            this.$notify({
              type: 'success',
              title: '成功',
              message: '用户启用成功',
              position: 'bottom-right'
            });
          }
        });
      }
    },
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
