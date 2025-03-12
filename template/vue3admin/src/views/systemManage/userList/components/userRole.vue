<template>
    <DialogCont
      @on-cancel="canceledit('close')"
      @on-close="canceledit('close')"
      @="confirmedit"
      @on-open="openedit"
      :title="`${obj.title}`"
      width="700px"
      :visible="obj.show"
      ref="dialog"
      customClass="flexColumn userFormDialog"
    >
    <div id="userJurisdiction">
        <!-- 用户管理 - 配置用户角色 -->
        <div class="content-bd">
            <el-form :model="obj.roleInfo" label-width="70px">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="用户账号：" prop="username">
                            <el-input v-model="obj.roleInfo.username" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="姓名：" prop="realName">
                            <el-input v-model="obj.roleInfo.realName" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            <el-row>
                <el-col :span="24">
                  <el-form-item label="配置角色：" prop="realName">
                    <el-checkbox-group v-model="obj.userRoleListData" v-if="obj.roleInfo.userRoleList && obj.roleInfo.userRoleList.length > 0">
                      <el-checkbox :title="item.roleName" :label="item.roleCode" v-for="(item,index) in obj.roleInfo.userRoleList" :key="index">{{item.roleName}}</el-checkbox>
                    </el-checkbox-group>
                    <div v-else>(当前角色暂无权限信息)</div>
                  </el-form-item>
                </el-col>

            </el-row>
            </el-form>
        </div>
    </div>
    </DialogCont>
</template>

<script lang="ts">
import { ref, toRefs, reactive, onMounted, getCurrentInstance, watch } from "vue";
 import { ElNotification } from 'element-plus';
import DialogCont from '@/components/dialog/Dialog.vue';
import {
  addUserRoles
} from '@/api/systemManage';
interface UserInfo {
  row: {
    username: any,
    realName: any
  },
  userRoleList: any[]
}
export default {
  name: 'userJurisdiction',
  components: {
    DialogCont
  },
  props: {
    getUserInfo: {
      // 当前操作用户信息
      type: Object,
      default () {
        return {
          row: {
            username: undefined,
            realName: undefined,
          },
          userRoleList: []
        };
      }
    },
    title: {
      type: String,
      default: '配置角色'
    },
    show: {
      type: Boolean,
      default: false
    },
    siteId: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['get-user-role-list', 'cancel'],
  setup(props: any, context: any) {
    const { show, title, item, dialogType } = toRefs(props)
    let obj: any = reactive({
      show,
      title,
      roleInfo: {
        username: props.item.username, // 用户账号
        realName: props.item.realName, // 姓名
        userRoleList: [] // 当前用户权限
      },
      asd: [],
      userRoleListData: [] // 当前用户权限
    })
    onMounted(() => {
      addUserInfo(props.getUserInfo);
    })
    // watch(() => props.item, (changeVal) => {
    //   console.log('changeVal', changeVal)
    //   obj.roleInfo = {
    //     username: changeVal.username, // 用户账号
    //     realName: changeVal.realName, // 姓名
    //     userRoleList: [] // 当前用户权限
    //   }
    // })
    watch(() => props.getUserInfo, (changeVal) => {
      addUserInfo(JSON.parse(JSON.stringify(changeVal)))
    })
    // 同步更新数据显示
    const addUserInfo = (newVal: UserInfo) => {
      console.log('newVal', newVal);
      // eslint-disable-next-line one-var
      const { username, realName } = newVal.row;
      const { userRoleList } = newVal;

      let rolesRet: any[] = [];
      userRoleList.forEach((item: any) => {
        if (item.checked) {
          rolesRet.push(item.roleCode);
        }
      });

      obj.userRoleListData = rolesRet;
      let objItem: any = Object.assign(
        {},
        { username, realName },
        { userRoleList: userRoleList }
      );
      obj.roleInfo = objItem;
    };
    // 当前选中的角色
    const subUserRole = () => {
      const objItem = Object.assign(
        {},
        { rolesList: obj.userRoleListData },
        obj.roleInfo
      );
      context.emit('get-user-role-list', objItem);
    }
    const openedit = () => {

    }
    const confirmedit = () => {
       const role = Object.assign(
        {},
        { rolesList: obj.userRoleListData },
        obj.roleInfo
      );
      const { username, rolesList } = role;
      addUserRoles({ rolesList, username }).then((res: any) => {
        if (res.code === "200") {
          ElNotification({
            title: '成功',
            message: '配置用户角色成功',
            type: 'success',
            position: 'bottom-right'
          });
          canceledit('cancel')
        }
      });
    }
    const canceledit = (type: string) => {
      context.emit('cancel', type)
    };
    return {
      obj,
      addUserInfo,
      subUserRole,
      openedit,
      confirmedit,
      canceledit
    }
  }
};
</script>

<style lang="less">
#userJurisdiction {
  .el-form-item{
    .el-form-item__label{
      display: flex;
      align-items: center;
    }
  }
  .el-checkbox__inner:hover,
  .el-checkbox__inner:focus,
  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #606266;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #3c8dbc;
    border-color: #3c8dbc;
  }

  .el-checkbox__inner::after {
    border-color: #fff;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #3c8dbc;
  }

  .el-checkbox {
    max-width: 120px;
    width: 120px;
    display: inline-block;
    margin-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: top;
  }
}
</style>
