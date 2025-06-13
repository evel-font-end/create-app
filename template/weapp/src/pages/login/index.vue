<template>
  <view class="flex flexColumn login">
    <view class="flex flexCenter top">登录</view>
    <!-- 登录模块 -->
    <view class="loginForm">

      <!-- input -->
      <view class="inputBox">
        <boxSearch
          class="username"
          :placeholder="'请输入登录账号'"
          v-model="username"
          type="text"
          :iconImgSrc="'/login2/username.png'"
        />

        <boxSearch
          class="password"
          :placeholder="'请输入登录密码'"
          v-model="password"
          type="password"
          :iconImgSrc="'/login2/password.png'"
        />
      </view>
      <view class="flex flexJustifyEnd rememberPassword">
        <AtCheckbox :options="[{label: '记住密码', value: 0}]" :selectedList="selectedList" @change="changeRemember"/>
      </view>
    </view>
    <view class="flex flexColumn btns">
      <!-- 下面的按钮 -->
      <view class="btnLogin" @click="login">
        <text>登录</text>
      </view>

      <!-- 下面的按钮 -->
      <!-- <view class="wxLogin" @click="wxLogin">
        <image class="wxicon" :src="imagesRequire('/login/icon3.png')" />
        <text>微信登录</text>
      </view> -->
    </view>

    <view class="bottom">
      <image class="login-bottom" :src="imagesRequire('/login2/login-bottom.png')" />
    </view>

    <!-- 提示账号密码不正确 -->
    <!-- <at-toast :isOpened="true" text="密码账号错误"></at-toast> -->
    <AtToast
      :isOpened="toastObj.showErrorPasswor"
      :closeAtToast="closeAtToast"
      :text="toastObj.toastText"
      :status="toastObj.status"
      :duration="3000"
    ></AtToast>
  </view>
</template>

<script>
import navBar from '@/components/navBar/index.vue'

import Taro from '@tarojs/taro'
import { AtCheckbox } from 'taro-ui-vue3'

import boxSearch from '@/components/boxSearch/index.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import AtToast from '@/components/AtToast/index.vue'
import { imagesRequire } from '@/utils/require'

import './index.scss'

import { encryptDes } from '../../utils/des.js'
import { userLogin, wxMiniAppLoginByUnionId } from '@/api/login/index.js'

export default {
  name: 'loginView',
  components: {
    boxSearch,
    AtToast,
    AtCheckbox,
    navBar
  },
  setup() {
    const username = ref('')
    const password = ref('')
    const selectedList = ref([])
    // const username = ref('admin')
    // const password = ref('123456')
    const toastObj = ref({
      toastText: '',
      showErrorPasswor: false,
      status: 'error', // error, loading, success
    })
    onMounted(() => {
      reLogin()
    })
    // 点击登录
    const login = () => {
      if (!username.value) {
        showErro('请输入账号', 'error')
        return
      }
      if (!password.value) {
        showErro('请输入密码', 'error')
        return
      }

      const parames = {
        loginName: username.value,
        password: password.value,
      }

      handleUserLogin(parames)
    }

    const handleUserLogin = async (parames) => {
      const res = await userLogin(parames)
      console.log('handleUserLogin', res)
      const { code } = res
      if (code === 200) {
        Taro.setStorageSync('userInfo', res.result)
        saveAccount(parames)
        // 登录后跳转首页
        goToHome()
      }
    }

    // 跳转首页
    const goToHome = function () {
      // 跳转到目的页面，在当前页面打开
      Taro.reLaunch({
        url: '/pages/programList/index',
      })
    }

    const showErro = (value = '', status = 'error') => {
      toastObj.value.toastText = value
      toastObj.value.showErrorPasswor = true
      toastObj.value.status = status
    }

    // 微信一键登录
    const wxLogin = function () {
      wx.login({
        success(res) {
          console.log(res)
          if (res.code) {
            let param = {
              code: res.code,
            }
            wxMiniAppLoginByUnionId(param).then((wxRes) => {
              console.log(wxRes)
              const { errorCode, errorMsg } = wxRes
              if (errorCode) {
                showErro(errorMsg, 'error')
              } else {
                Taro.setStorageSync('userInfo', wxRes)
                // 登录后跳转首页
                goToHome()
              }
              console.log('loginInfo', wxRes)
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        },
      })
    }

    const reLogin = () => {
      const usernamePassword = Taro.getStorageSync('usernamePassword')
      if(usernamePassword) {
        handleUserLogin(usernamePassword)
      }
    }

    const closeAtToast = () => {
      toastObj.value.toastText = ''
      toastObj.value.showErrorPasswor = false
      toastObj.value.status = ''
    }

    const changeRemember = (e) => {
      selectedList.value = e;
    }

    const saveAccount = (parames) => {
      console.log('selectedList.value', selectedList.value, selectedList.value.length)
      if(selectedList.value.length) {
        Taro.setStorageSync('usernamePassword', {
          ...parames,
        })
      } else {
        Taro.removeStorageSync('usernamePassword')
      }

    }

    return {
      username,
      password,
      selectedList,
      toastObj,
      login,
      wxLogin,
      reLogin,
      imagesRequire,
      closeAtToast,
      changeRemember
    }
  },
}
</script>
