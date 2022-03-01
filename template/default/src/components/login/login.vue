<template>
  <div id="login">
    <div class="logoContainer">
      <!-- <img src="./images/img5.png" class="img5"/> -->
      交易管理系统
    </div>
    <div class="content cont-w  pos-r">
      <!-- <img src="./images/img4.png" class="img1"/> -->
      <div class="container">
      <div class="flexCloumn flexCenter cont-login">
        <p style="text-align: center; color:#333333">用户登录</p>
        <form class="login-form">
          <div class="item">
            <span>请输入登录账号</span>
            <el-input
              class="form-input"
              type="username"
              name="username"
              placeholder="账号"
              prefix-icon="iconfont el-icon-user ml-5 f-20"
              v-model="form.username"
              clearable
            ></el-input>
          </div>
          <div class="item">
            <span>请输入登录密码</span>
            <el-input
              class="form-input"
              type="password"
              name="password"
              placeholder="密码"
              prefix-icon="iconfont el-icon-lock ml-5 f-20"
              v-model="form.password"
              @keyup.enter.native="loginTo"
              clearable
            ></el-input>
          </div>
          <div class="item">
              <el-input class="form-input" placeholder="请输入验证码" v-model="form.captcha">
                <template slot="append">
                  <img :src="verifyCode" title="验证码" @click="_getVerifyCode"/>
                </template>
              </el-input>
            </div>
          <el-button
            :disabled="butDisabled"
            @click="loginTo"
            :class="{'butDisabled':butDisabled}"
            :loading="butDisabled"
            class="form-but"
          >
            <span v-if="butDisabled">登录中...</span>
            <span v-else>登&nbsp;&nbsp;录</span>
          </el-button>
          <span class="fs14 tx_c goRegistered" v-if="false">还没有账号？去注册</span>
        </form>
        <!-- <p>总账户：admin</p>
        <p>土地：landadmin</p>
        <p>矿产：mineadmin</p>
        <p>竞买人：bidder</p> -->
      </div>
      </div>
    </div>
    <!-- loading -->
    <div class="loading-bg" v-if="butDisabled"></div>
    <div class="loading noselect pos-f" v-if="butDisabled">
      <i class="iconfont icon-jiazailoading-A mr-5 anim-rotate anim-loop el-anim"></i>
      <span class="f-13">登录中，请稍后...</span>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
import Config from '@/config';
import { encrypt } from 'util/jsencrypt';
// import routes, { loginRoute, biderRoute } from 'router/routers.js';
import { loadJS } from 'util/util';
import axios from 'axios';
import {
  getPublicKey,
  verifyCertAndGenRandom
} from '@/api/user';
export default {
  name: 'login',
  data () {
    return {
      form: {
        username: 'admin',
        password: 'abc123!@#',
        captcha: ''
      },
      showBg2: false,
      butDisabled: false, // 登录按钮状态
      verifyCode: '',
      Container: null,
      UserSignCertB64: null,
      loginType: 1
    };
  },
  mounted () {
    this.$nextTick(() => {
      this._getVerifyCode();
    });
  },
  methods: {
    ...mapActions({
      userLoginTo: 'user/userLoginTo',
      userLoginDealRecord: 'user/userLoginDealRecord',
      getUserRoleRouter: 'getUserRoleRouter'
    }),
    ...mapMutations({
      setUserInfo: 'user/setUserInfo',
      set_dynamicMenuList: 'set_dynamicMenuList'
    }),
    _getVerifyCode () {
      axios.get('/api/verifyCode', {responseType: 'arraybuffer'}).then((data) => {
        const url = 'data:image/png;base64,' + btoa(new Uint8Array(data.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        this.verifyCode = url;
      }).catch(function (err) {
        this.$message.error(err)
      });
    },
    async _getPublicKey () {
      let res = await getPublicKey({});
      if (res.code == '200') {
        return res.data.key;
      }
    },
    // 登录
    async loginTo () {
      const loginType = this.loginType;
      let parames = {
        ...this.form,
        loginType: 0
      };
      parames.caLogin = 0;

      // this.form.password = parames.password = 888888;
      if (this.form && this.form.username && this.form.password && this.form.captcha) {
        const captchaPatn = /^[^\s?<>\'\"!@%#$~&*():;]*$/;
        if (!captchaPatn.test(this.form.captcha)) {
          this.$message.error('验证码输入错误');
          return;
        }
        this.butDisabled = true;
        // 加密
        let publicKey = await this._getPublicKey();
        parames = {
          ...parames,
          username: this.form.username,
          password: encrypt(this.form.password, publicKey),
          key: publicKey
        }
        if (parames.password.length < 20) {
          this.$message.error('登录失败，请稍后重试...');
          return;
        }
        this.userLoginTo({ ...parames })
          .then(resData => {
            this.userLoginDealRecord();
            // 获取rolecode传进去
            console.log('1')
            this.getUserRoleRouter(resData.username).then(res => {
              this.setUserInfo({
                username: resData.username,
                user: resData.modifyUser,
                userType: resData.userType
              });
              this.$router.push(Config.homeName);
            });
          })
          .catch(err => {
            this._getVerifyCode();
            this.form.captcha = '';
            this.butDisabled = false;
          });
      } else {
        this.$message.error('请填写您的登录账号 / 密码 / 验证码');
        this.butDisabled = false;
      }
    },
    gdcaDown () {
      window.open('https://www.gdca.com.cn/customer_service/download/client/', '_blank');
    }
  }
};
</script>
<style lang="less">
// 重置
.login-form {
  .form-input input {
    border: 0;
    border-radius: 0;
    font-size: 14px;
    background-color: transparent;
    height: 40px !important;
  }

  .item {
    overflow: hidden;
    margin-bottom: 20px;
    color: #c4c4c4;
    text-align: left;
    >span{
      display: block;
      text-align: left;
      font-size:14px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
    }
    .form-input{
      width: 321px;
      margin-top: 10px;
      background:rgba(255,255,255,1);
        input{
          border:1px solid rgba(170,170,170,1);
          box-shadow:0px 3px 7px 0px rgba(228,231,234,1);
          &:focus{
            outline: 0;
            border-color: rgba(30,107,201,1);
          }
        }
    }
    .el-input--suffix .el-input__inner {
      padding-right: 35px;
    }
    .el-input--prefix .el-input__inner {
      padding-left: 35px;
    }
    .el-input__prefix {
      top: 2px;
    }
    .el-input{
      .el-input-group__append{
        cursor: pointer;
        width: 100px;
        height: 40px;
        padding: 0;
        border: none;
        img{
          height: 100%;
        }
      }
    }
  }

  .form-but {
    color: #fff;
    margin-top: 25px;
    // margin-left: 58px;
    margin-left: 22px;
    font-size: 16px;
    padding: 0;
    text-align: center;
    width: 116px;
    height: 39px;
    background: linear-gradient(
      90deg,
      rgba(51, 139, 208, 1) 0%,
      rgba(97, 178, 244, 1) 100%
    );
    border-radius: 5px;
  }
  .form-but:hover {
    color: #fff;
    background: linear-gradient(
      90deg,
      rgba(51, 139, 208, 1) 0%,
      rgba(97, 178, 244, 1) 100%
    );
  }

  .butDisabled,
  .butDisabled:hover {
    background-color: #fab6b6;
  }
}
</style>

<style lang="less" scoped>
@import "./login.less";
</style>




