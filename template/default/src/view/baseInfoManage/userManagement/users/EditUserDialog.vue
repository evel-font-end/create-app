<template>
  <custom-dialog
    @on-open="open"
    @on-close="cancel('close')"
    @on-confirm="confirm"
    @on-cancel="cancel('cancel')"
    :visible.sync="dialogShow"
    width="800px"
  >
    <div class="content-bd" id="editUser">
      <el-form ref="formData" :rules="rules" :model="formData" label-width="151px" status-icon>
        <wrapper title="用户基本信息">
          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="用户名：" prop="username">
                <el-input
                  placeholder="请输入用户名"
                  :disabled="data.type==='edit'?true:false"
                  v-model="formData.username"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="真实姓名：" prop="realName">
                <el-input
                  placeholder="请输入真实姓名"
                  :disabled="edit ? false : true"
                  v-model="formData.realName"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="部门信息：" prop="department">
                <el-select
                  :disabled="edit ? false : true"
                  v-model="formData.department"
                  placeholder="请选择部门信息"
                >
                  <el-option
                    v-for="item in selectList.DEPT"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职位信息：" prop="position">
                <el-select
                  :disabled="edit ? false : true"
                  v-model="formData.position"
                  placeholder="请选择职位信息"
                >
                  <el-option
                    v-for="item in selectList.position"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="性别：" prop="sex">
                <el-radio-group class="va-m" v-model="formData.sex" :disabled="edit ? false : true">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="0">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12"></el-col>
          </el-row>
        </wrapper>
        <wrapper title="附属信息">
          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="手机号：" prop="mobile">
                <el-input
                  placeholder="请输入手机号"
                  :disabled="edit ? false : true"
                  v-model="formData.mobile"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱地址：" prop="email">
                <el-input
                  placeholder="请输入邮箱地址"
                  :disabled="edit ? false : true"
                  v-model="formData.email"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="办公电话：" prop="officePhone">
                <el-input
                  placeholder="请输入办公电话"
                  :disabled="edit ? false : true"
                  v-model="formData.officePhone"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="CA绑定：">
                <el-input
                  placeholder="CA待绑定账号"
                  disabled
                  v-model="formData.caKeyId"
                >
                <el-button slot="append" type="primary" @click="handleBindCa(formData.caKeyId)" :loading="bindCaLoading" class="appendBtn">{{!hasCaKeyId ? '绑定' : '解绑'}}</el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="24">
              <el-form-item label="备注：">
                <el-input
                  placeholder="请输入备注"
                  type="textarea"
                  :disabled="edit ? false : true"
                  v-model="formData.remark"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </wrapper>
      </el-form>
    </div>
  </custom-dialog>
</template>

<script>
import Wrapper from '@/components/wrapper';
import dialogReact from '@/mixins/dialogReact';
import bubbleEvents from '@/mixins/bubbeEvents';
import CustomDialog from '@/components/dialog';
import { loadJS } from 'util/util';
// import { getDictionaryListByCode } from 'api/basicsManagement/dictionaries';
import {
  selectListByParentCode,
  addUser,
  getUserById,
  updateUser
} from '@/api';
import {
  bindCA,
  unBindCA,
  verifyCertAndGenRandom
} from '@/api/user';

export default {
  name: 'EditUser',
  components: {
    CustomDialog,
    Wrapper
  },
  props: {
    visible: '',
    data: {}
  },
  data () {
    return {
      dialogShow: false,
      formData: {
        username: '', // (string, optional): 用户名称
        realName: '', // (string, optional): 真实姓名 ,
        department: '', // (string, optional): 所属部门 ,
        sex: '', // (string, optional): 性别(1男，0女) ,
        email: '', // (string, optional): 电子邮箱 ,
        mobile: '', // (string, optional): 手机号码 ,
        officePhone: '', // (string, optional): 办公电话 ,
        position: '', // (string, optional): 职位 ,
        remark: '' // (string, optional): 备注 ,
      },
      // 验证
      rules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'change' }
        ], // 用户账号
        realName: [
          { required: true, message: '请填写真实姓名', trigger: 'change' }
        ], // 姓名
        email: [
          { required: true, message: '请填写邮箱地址', trigger: 'change' }
        ], // email
        department: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ], // 所属部门
        mobile: [
          { required: true, message: '请填写手机号', trigger: 'change' }
        ], // 手机号码
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }] // 手机号码
      },
      selectList: {
        DEPT: [], // 所属部门
        position: [] // 现任职务
      },
      edit: true,
      bindCaLoading: false,
      caKeyId: null,
      hasCaKeyId: false
    };
  },
  watch: {
    visible (val) {
      this.dialogShow = val;
    }
  },
  mounted() {
    this.$nextTick(() => {
      loadJS('static/js/GDCA/jquery.jsonp.js');
      loadJS('static/js/GDCA/cryptojs/core.js');
      loadJS('static/js/GDCA/cryptojs/enc-base64.min.js');
      loadJS('static/js/GDCA/util.js');
      loadJS('static/js/GDCA/gdca-pki-def.js');
      loadJS('static/js/GDCA/gdca-pki-lib-s.js');
    });
  },
  methods: {
    open () {
      this._getSelectList('DEPT');
      this._getSelectList('position');
      if (this.data.id) {
        this._getInfo();
      }
    },
    cancel () {
      this.formData = {
        username: '',
        realName: '',
        department: '',
        sex: '',
        email: '',
        mobile: '',
        officePhone: '',
        position: '',
        remark: ''
      };
      this.$emit('close')
      this.dialogShow = false;
    },
    _getSelectList (code) {
      selectListByParentCode(code).then(res => {
        if (res.code === '200') {
          this.selectList[code] = Object.freeze(res.data);
        }
      });
    },
    _getInfo () {
      let id = this.data.id;
      getUserById(id)
        .then(res => {
          this.formData = {
            username: res.data.username,
            realName: res.data.realName,
            department: res.data.department,
            sex: res.data.sex === '男' ? 1 : 0,
            email: res.data.email,
            mobile: res.data.mobile,
            officePhone: res.data.officePhone,
            position: res.data.position,
            remark: res.data.remark,
            id: res.data.id,
            caKeyId: res.data.caKeyId
          };
          this.hasCaKeyId = !!res.data.caKeyId;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 抛出当前定义的数据
    confirm () {
      this.$refs.formData.validate(valid => {
        if (valid) {
          if (this.data.id) {
            this.editSubmit();
          } else {
            this.addSubmit();
          }
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
    addSubmit () {
      let params = {
        ...this.formData,
      };
      addUser(params)
        .then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              position: 'bottom-right'
            });
            this.$emit('success');
          }
        })
        .catch(err => {
          console.log(err);
        });
      // this.$emit("success-from", this.userInfo, this.stateType);
    },
    editSubmit () {
      let params = {
        ...this.formData
      };
      updateUser(params)
        .then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              position: 'bottom-right'
            });
            this.$emit('success');
          }
        })
        .catch(err => {
          console.log(err);
        });
      // this.$emit("success-from", this.userInfo, this.stateType);
    },
    handleBindCa (caKeyId) {
      if(!$GDCA) {
        this.$message.error('请确保您的GDCA数字证书安装完毕!');
        return;
      }
      this.bindCaLoading = true;
      let password = prompt("请输入您的PIN码","");
      let sContainer = null;
      $GDCA.getUserList(1,(res) => {
        if(res[0].length == 0) {
          this.$message.error('用户列表为空!');
          this.bindCaLoading = false;
          return;
        } else {
          sContainer = res[0].split("||")[1];		//证书容器（用户名）
          // certName = res[0].split("||")[0];
          $GDCA.Login(sContainer,password,(pinRes) => {
            //读取用户签名证书
              $GDCA.exportUserCert(sContainer,(userRes) => {
                let UserSignCertB64 = userRes;
                const wfForm = new FormData();
                wfForm.append('UserSignCertB64', UserSignCertB64);
                wfForm.append('Container', sContainer);
                wfForm.append('UserPin', password);
                wfForm.append('captcha', null);
                verifyCertAndGenRandom(wfForm).then(randomRes => {
                  if(randomRes.data.CertId === ""){
                    this.$message.error("CA证书标识不存在!");
                    this.bindCaLoading = false;
                    return;
                  }
                  if(!caKeyId) {
                    this.formData.caKeyId = randomRes.data.CertId;
                    this.hasCaKeyId = true;
                  } else {
                    if(this.formData.caKeyId !== randomRes.data.CertId) {
                        this.$message.error(`请插入对应的GDCA证书!`);
                        this.hasCaKeyId = true;
                        this.bindCaLoading = false;
                        return;
                    }
                    this.formData.caKeyId = null;
                    this.hasCaKeyId = false;
                  }
                  this.bindCaLoading = false;
                });
              }, err => {
                this.bindCaLoading = false;
                this.$message.error(`GDCA.exportUserCert error! CA读取失败!`);
              });
          },  err => {
            $GDCA.getPinRetryCount(sContainer,(res) => {
              this.$message.error("PIN码登录失败，可能密码不正确,剩余重试次数:" + res);
            },(err) =>{
              this.bindCaLoading = false;
              this.$message.error(`GDCA.getPinRetryCount error! CA读取失败!`);
            });
            this.bindCaLoading = false;
            this.$message.error(`GDCA.Login error! CA读取失败!`);
          });
        }
      }, err => {
        this.bindCaLoading = false;
        this.$message.error(`GDCA.getUserList error! CA读取失败!`);
      });
    }
  }
};
</script>

<style lang="less" scoped>
#editUser {
  /deep/.el-form-item {
    margin-bottom: 12px;
    .appendBtn{
      background-color: #2573F1;
      border-color: transparent;
      color: #FFF;
      &.bind{
      }
      &.unBind{}
    }
  }
}
</style>
