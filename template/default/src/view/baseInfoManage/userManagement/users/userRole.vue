<template>
    <div id="userJurisdiction">
        <!-- 用户管理 - 配置用户角色 -->
        <div class="content-bd">
            <el-form :model="roleInfo" label-width="70px">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="用户账号：" prop="username">
                            <el-input v-model="roleInfo.username" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="姓名：" prop="realName">
                            <el-input v-model="roleInfo.realName" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            <el-row>
                <el-col :span="24">
                  <el-form-item label="配置角色：" prop="realName">
                    <el-checkbox-group v-model="userRoleListData" v-if="roleInfo.userRoleList && roleInfo.userRoleList.length > 0">
                      <el-checkbox :title="item.roleName" :label="item.roleCode" v-for="(item,index) in roleInfo.userRoleList" :key="index">{{item.roleName}}</el-checkbox>
                    </el-checkbox-group>
                    <div v-else>(当前角色暂无权限信息)</div>
                  </el-form-item>
                </el-col>

            </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  name: 'userJurisdiction',
  props: {
    getUserInfo: {
      // 当前操作用户信息
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      roleInfo: {
        username: '', // 用户账号
        realName: '', // 姓名
        userRoleList: [] // 当前用户权限
      },
      asd: [],
      userRoleListData: [] // 当前用户权限
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.addUserInfo(this.getUserInfo);
    });
  },
  watch: {
    // 同步更新数据显示
    getUserInfo (newVal, oldVal) {
      this.addUserInfo(JSON.parse(JSON.stringify(newVal)))
    }
  },
  methods: {
    // 同步更新数据显示
    addUserInfo (newVal) {
      // eslint-disable-next-line one-var
      const { username, realName } = newVal.row,
        { userRoleList } = newVal;

      let rolesRet = [];
      userRoleList.forEach(item => {
        if (item.checked) {
          rolesRet.push(item.roleCode);
        }
      });

      this.userRoleListData = rolesRet;
      let obj = Object.assign(
        {},
        { username, realName },
        { userRoleList: userRoleList }
      );
      this.roleInfo = obj;
    },
    // 当前选中的角色
    subUserRole () {
      const obj = Object.assign(
        {},
        { rolesList: this.userRoleListData },
        this.roleInfo
      );
      this.$emit('get-user-role-list', obj);
    }
  }
};
</script>

<style lang="less">
#userJurisdiction {
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
