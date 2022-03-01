<template>
  <div id="operationRoles">
    <!-- 角色管理 - 新增/修改角色 -->
    <div class="content-bd">
      <el-form :model="roleInfo" :rules="rules" label-width="90px" ref="formData">
        <el-row :gutter="10" v-if="stateType !== 'add'">
          <el-col :span="24">
            <el-form-item label="角色ID：" prop="id">
              <el-input v-model="roleInfo.id" :disabled="true" style="width:250px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="角色名称：" prop="roleName">
              <el-input v-model="roleInfo.roleName" :disabled="stateType === 'show'" style="width:250px;">
                <i
                  slot="suffix"
                  title="请输入角色名称"
                  v-if="rulesTips.roleName"
                  class="el-input__icon validateIconErrorIcon el-icon-circle-close"
                ></i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="角色描述：" prop="roleDescribe">
              <el-input v-model="roleInfo.roleDescribe" :disabled="stateType === 'show'" style="width:250px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- class="border-t mt-10" -->
      <founder-box
        class=""
        :name="stateType === 'add' ? _userName : roleInfo.createUser"
        :date="stateType === 'add' ? '' : roleInfo.createTime"
        :dateVisible="stateType !== 'add'"
      ></founder-box>
    </div>
  </div>
</template>

<script>
import founderBox from 'components/founder';
export default {
  name: 'operationRoles',
  props: {
    stateType: {
      type: String,
      default: 'add' // add 新增用户/修改用户  show查看用户
    },
    getUserInfo: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      // 基本信息
      roleInfo: {
        createTime: '', // 创建日期
        createUser: '', // 创建人员
        enabled: true, // 角色状态
        id: '', // 角色ID
        modifyTime: '', // 修改时间
        modifyUser: '', // 修改人员
        remark: '', // 备注
        roleCode: '', // 角色编码
        roleDescribe: '', // 角色描述
        roleName: '' // 角色名称
      },
      // 验证
      rules: {
        roleName: [
          { required: true, trigger: 'change', validator: this.$_checkValidate }
        ]
      },
      // 验证提示
      rulesTips: {
        roleName: false // 角色名称
      }
    };
  },
  watch: {
    // 同步更新数据显示
    getUserInfo: {
      immediate: true,
      handler: function (newVal, oldVal) {
        this.$_resetForm(); // 重置
        this.addUserInfo(JSON.parse(JSON.stringify(newVal))); // 拉取新数据
      }
    }
  },
  components: {
    founderBox
  },
  computed: {
    _userName () {
      return this.$store.state.user.username;
    }
  },
  methods: {
    // 当前选中的角色
    subUserRole () {
      this.$refs.formData.validate(valid => {
        if (valid) {
          const obj = Object.assign({}, this.roleInfo);
          this.$emit('getRoleInfo', obj, this.stateType);
        } else {
          this.$notify.error({
            title: '失败',
            message: '请填写完整必填数据!!!',
            position: 'bottom-right'
          });
          return false;
        }
      });
    },
    // 同步更新数据显示
    addUserInfo (newVal) {
      const { row } = newVal;

      let obj = row || newVal;
      this.roleInfo = obj;
    },
    // 重置验证规则状态
    resetRulesTips () {
      this.rulesTips = Object.assign(this.rulesTips, {
        roleName: false // 角色名称
      });
    }
  }
};
</script>

<style lang="less" scoped>
#operationRoles{
  /deep/.el-form-item{
    padding-bottom: 12px;
    margin-bottom: 0;
  }
}
</style>
