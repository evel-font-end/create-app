<template>
  <div id="updatePassword">
    <div class="content-view pt-20">
        <el-form status-icon :model="dataInfo" label-width="85px" ref="formData" :rules="rules">
        <el-row :gutter="10">
            <el-col :span="24">
            <el-form-item label="旧密码：" prop="oldPassword">
                <el-input type="password" v-model="dataInfo.oldPassword" suffix-icon="iconfont icon-password f-14">
                <i
                    slot="suffix"
                    title="请输入旧密码"
                    v-if="rulesTips.oldPassword"
                    class="el-input__icon validateIconErrorIcon el-icon-circle-close"
                ></i>
                </el-input>
            </el-form-item>
            </el-col>
            <el-col :span="24">
            <el-form-item label="新密码：" prop="newPassword">
                <el-input type="password" v-model="dataInfo.newPassword" suffix-icon="iconfont icon-password f-14">
                <i
                    slot="suffix"
                    title="请输入新密码"
                    v-if="rulesTips.newPassword"
                    class="el-input__icon validateIconErrorIcon el-icon-circle-close"
                ></i>
                </el-input>
            </el-form-item>
            </el-col>
            <el-col :span="24">
            <el-form-item label="确认密码：" prop="confirmNewPassword">
                <el-input type="password" v-model="dataInfo.confirmNewPassword" suffix-icon="iconfont icon-password f-14">
                <i
                    slot="suffix"
                    title="请输入确认新密码"
                    v-if="rulesTips.confirmNewPassword"
                    class="el-input__icon validateIconErrorIcon el-icon-circle-close"
                ></i>
                </el-input>
            </el-form-item>
            </el-col>
            <el-col :span="24">
            <div class="btnInfo text-center mt-10">
                <el-button
                size="small"
                type="primary"
                @click="submitForm(1)"
                :disabled="$_loading"
                >确认</el-button>
                <el-button  size="small" @click="$_resetForm">重置</el-button>
            </div>
            </el-col>
        </el-row>
        </el-form>
    </div>
  </div>
</template>

<script>
import { getPublicKey, updatePassword } from 'api/user'
import { encrypt } from "util/jsencrypt";

export default {
  name: "updatePassword",
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("原密码不能为空"));
      }
      this.dataInfo["oldPassword"] = value;
      callback();
    };
    var validatePass2 = (rule, value, callback) => {
      this.dataInfo["newPassword"] = value;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.dataInfo.confirmNewPassword !== "") {
          this.$refs.formData.validateField(
            "confirmNewPassword"
          );
        }
        callback();
      }
    };
    var checkNewPass = (rule, value, callback) => {
      this.dataInfo["confirmNewPassword"] = value;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.dataInfo.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dataInfo: {
        confirmNewPassword: "", // 确认新密码
        newPassword: "", // 新密码
        oldPassword: "" // 旧密码
      },
      // 验证
      rules: {
          oldPassword: [
            { required: true, validator: validatePass, trigger: "blur" }
          ],
          newPassword: [
            { required: true, validator: validatePass2, trigger: "blur" }
          ],
          confirmNewPassword: [
            { required: true, validator: checkNewPass, trigger: "blur" }
          ]
      },
      // 验证提示
      rulesTips: {
        confirmNewPassword: false, // 确认新密码
        newPassword: false, // 新密码
        oldPassword: false // 旧密码
      }
    };
  },
  methods: {
    async _getPublicKey() {
      let res = await getPublicKey({});
      console.log(res);
      if (res.code == "200") {
        return res.data.key;
      }
    },
    // 确定数据
    submitForm() {
      const _this = this;
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          let publicKey = await this._getPublicKey();
          this.dataInfo = {
            ...this.dataInfo,
            confirmNewPassword: encrypt(this.dataInfo.confirmNewPassword, publicKey),
            newPassword: encrypt(this.dataInfo.newPassword, publicKey),
            oldPassword: encrypt(this.dataInfo.oldPassword, publicKey),
            publicKey: publicKey
          }
          updatePassword(this.dataInfo).then(res => {
            if(res.code == '200'){
                this.$notify({
                    title: "成功",
                    message: "修改密码成功",
                    type: "success",
                    position: "bottom-right"
                });
                this.$_resetForm()
            }
          })
        } else {
          this.$notify.error({
            title: "失败",
            message: "请填写完整必填数据!!!",
            position: "bottom-right"
          });
          return false;
        }
      });
    },
    // 重置验证规则状态
    resetRulesTips() {
      this.rulesTips = Object.assign(this.rulesTips, {
        confirmNewPassword: false, // 确认新密码
        newPassword: false, // 新密码
        oldPassword: false // 旧密码
      });
    }
  },
  components: {}
};
</script>