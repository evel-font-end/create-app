<template>
  <div class="flexRow userList">
    <div class="flex treeMain">
      <Tree
        :leaf="0"
        @onClick="handleTree"
      />
    </div>
    <div class="flex setTab">
      <search-form
        @onSearch="getSearchVal"
        :searchItems="searchItems"
        :addBtnVisible="true"
        :delBtnVisible="false"
        @on-addBtn="() => handleAddTactics()"
        @on-delBtn="() => handleDelTactics()"
      />
      <page-table
        ref="pageTable"
        col-align="center"
        operator
        :operatorWidth="200"
        :selection="false"
        :data="obj.tableData" 
        :cols="tableCols"
        :showPage="false"
        :page-size="obj.page.pageSize"
        :page-current="obj.page.current"
      >
        <template #operator="scope">
          <div class="footerBtnList flexRow">
            <div
              class="iconfont icon-bianji primary"
              style="margin-right: 10px"
              title="编辑"
              @click="() => handleChange(scope, 'edit')"
            ></div>
            <div
              class="iconfont icon-jiaoseshezhi primary"
              style="margin-right: 10px"
              title="配置角色"
              @click="() => handleChange(scope, 'user')"
            ></div>
            <div
              class="iconfont icon-jinyong primary"
              style="margin-right: 10px"
              title="禁用"
              @click="() => handleChange(scope, 'stop')"
            ></div>
            <div
              class="iconfont icon-qiyong primary"
              style="margin-right: 10px"
              title="启用"
              @click="() => handleChange(scope, 'start')"
            ></div>
            <div
              class="iconfont icon-zhongzhimima primary"
              style="margin-right: 10px"
              title="重置密码"
              @click="() => handleChange(scope, 'reset')"
            ></div>
          </div>
        </template>
      </page-table>
    </div>
    <UserForm
      :title="obj.dialogTitle"
      :show="obj.setFormShow"
      :item="obj.dialogItem"
      :dialogType="obj.dialogType"
      :siteId="obj.siteId"
      :siteName="obj.siteName"
      @cancel="userFormCancel"
    />
    <UserRole
      :title="'配置角色'"
      :show="obj.userRoleShow"
      :item="obj.userRoleItem"
      @cancel="userRoleCancel"
      :get-user-info="obj.getUserInfo"
      @get-user-role-list="getUserRoleList"
    />
  </div>
</template>
<script lang="ts">
import { reactive } from "vue";
 import { ElNotification } from 'element-plus';
import Tree from '@/components/tree/tree.vue';
import PageTable from "@/components/adminPage-table";
import searchForm from "@/components/adminSearchForm/searchForm.vue";
import UserForm from './components/userForm.vue';
import UserRole from './components/userRole.vue';
import { TreeData, sexOptions } from '@/util/constants';
import {
  getUserListByCondition,
  deleteUser,
  cancelUser,
  enableUser,
  resetPassword,
  listRolesByUsername
} from '@/api/systemManage';
export default {
  name: 'userList',
  components: {
    Tree,
    PageTable,
    searchForm,
    UserForm,
    UserRole
  },
  setup() {
    let obj = reactive({
      dialogTitle: '新增用户',
      setFormShow: false,
      dialogItem: {},
      dialogType: 'edit',
      siteId: 0,
      siteName: '',
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      getUserInfo: {
        row: {
          username: undefined,
          realName: undefined
        },
        userRoleList: []
      }, // (添加/修改/查看)当前窗口打开的用户行
      tableData: [],
      userRoleShow: false,
      userRoleItem: {}
    });
    const tableCols = reactive([
      {
        label: "用户名称",
        prop: "username",
      },
      {
        label: "真实姓名",
        prop: "realName",
      },
      {
        label: "性别",
        prop: "sex",
      },
      {
        label: "邮箱",
        prop: "email",
      },
      {
        label: "手机号",
        prop: "mobile",
      },
      {
        label: "区域分配",
        prop: "siteName",
      }
    ]);

    const searchItems = reactive([
    {
      type: "input",
      label: "用户名",
      props: {
        fieldName: "username",
      },
    }, {
      type: "input",
      label: "真实姓名",
      props: {
        fieldName: "realName",
      },
    }, {
      type: "select",
      label: "性别",
      props: {
        fieldName: "sex",
        options: sexOptions
      },
    }]);
    let defaultSearchVal: { className?: string, gatewayId?: string } = reactive({
      className: '',
      gatewayId: ''
    });
    /** 方法 */
    const handleTree = (treeData: TreeData) => {
      obj.siteId = treeData.parentId === 0 ? treeData.id : treeData.parentId;
      obj.siteName = treeData.name;
      getList();
    }
    const getList = () => {
      let params = {
        data: {
          siteId: obj.siteId,
          ...defaultSearchVal
        },
        pageNo: obj.page.current,
        pageSize: obj.page.pageSize,
      };
      getUserListByCondition(params).then((res: any) => {
        if (res.code === '200') {
          obj.tableData = res.data.data;
          obj.page.total = res.data.total;
        }
      })
    }
    const getSearchVal = (val: any) => {
      defaultSearchVal = val;
      getList();
    }
    const handleChange = (scope: any, type: 'edit' | 'user' | 'stop' | 'start' | 'delete') => {
      if (type === 'delete') {
        deleteUser(scope.row.username).then((res: any) => {
          if (res && res.code === '200') {
            getList();
            ElNotification({
              title: '成功',
              message: '用户删除成功',
              type: 'success',
              position: 'bottom-right'
            });
          }
        })
      } else if (type === 'user') {
         listRolesByUsername(scope.row.username).then((res: any) => {
        if (res.code === "200") {
          const list = Object.assign({}, { userRoleList: res.data }, scope);
          obj.userRoleShow = true;
          obj.getUserInfo = list
        }
      });
      } else if (type === 'edit') {
        obj.dialogTitle = '修改用户';
        obj.setFormShow = true;
        obj.dialogType = type;
        obj.dialogItem = scope.row;
      } else if (type === 'stop') {
        cancelUser(scope.row.username).then((res: any) => {
          if (res && res.code === '200') {
            getList();
            ElNotification({
              title: '成功',
              message: '用户禁用成功',
              type: 'success',
              position: 'bottom-right'
            });
          }
        })
      } else if (type === 'start') {
        enableUser(scope.row.username).then((res: any) => {
          if (res && res.code === '200') {
            getList();
            ElNotification({
              title: '成功',
              message: '用户启动成功',
              type: 'success',
              position: 'bottom-right'
            });
          }
        })
      } else {
        resetPassword(scope.row.username).then((res: any) => {
          if (res && res.code === '200') {
            // getList();
            ElNotification({
              title: '成功',
              message: '用户密码重置成功',
              type: 'success',
              position: 'bottom-right'
            });
          }
        })
      }
    }

    const handleAddTactics = () => {
      obj.dialogTitle = '新增用户';
      obj.setFormShow = true;
      obj.dialogItem = {};
      obj.dialogType = 'add';
    }

    const handleDelTactics = () => {

    }

    const userFormCancel = (type: string) => {
      type === 'cancel' && getList()
      obj.setFormShow = false
    }

    const userRoleCancel = (type: string) => {
      type === 'cancel' && getList()
      obj.userRoleShow = false;
    }
    return{
      obj,
      tableCols,
      searchItems,
      handleTree,
      userFormCancel,
      getSearchVal,
      handleChange,
      handleAddTactics,
      handleDelTactics,
      userRoleCancel
    }
  }
}
</script>

<style lang="less" scoped>
.userList{
  height: 100%;
  .treeMain{
    width: 300px;
    border-right: 1px solid #e6eafe;/*no*/
    .tree{
      height: 100%;
    }
  }
  .setTab{
    width: 0;
    flex: 1;
    padding: 15px;/*no*/
  }
}
</style>
