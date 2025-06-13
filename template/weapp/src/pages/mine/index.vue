<template>
  <view class="mine">
    <navBar :back="false" />
    <view class="info-box">
      <view class="left"> <image :src="imagesRequire('/mine/header.png')" /></view>
      <view class="right">
        <view class="name">{{ userInfo.userName || '张建国' }}</view>
        <view class="num">{{ userInfo.tel || '17693762783' }}</view>
      </view>
    </view>
    <view class="mineBox">
      <view
        class="mine-list"
        v-for="(item, index) in list.filter((item) => !!item.url)"
        :key="index"
        @click="clickModel(item.url)"
      >
        <view class="img-box"><image :src="item.imgUrl" /></view>
        <view class="name">{{ item.name }}</view>
        <AtIcon
          prefixClass="icon"
          :value="'youbianjiantou'"
          :size="12"
          class="iconfont"
          :color="'#6C6C6C'"
        ></AtIcon>
      </view>
    </view>
    <!-- 注销登录 -->
    <AtButton type="primary" @click="logOut">退出登录</AtButton>
    <tabBar :current="1" />
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
import tabBar from '@/components/tabBar/index.vue'
import { AtIcon, AtButton } from 'taro-ui-vue3'
import AtToast from 'comp/AtToast/index.vue'
import { onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { securityLogout, getUserInfo } from '@/api/mine/index.js'

import './index.scss'
import { ref } from 'vue'
import { imagesRequire } from '@/utils/require'
import { removeSorage } from '../../utils/service'

export default {
  name: 'mineView',
  components: {
    navBar,
    tabBar,
    AtIcon,
    AtToast,
    AtButton
  },
  watch: {},
  setup() {
    onMounted(() => {
      // getUserInfoData()
    })
    const userInfoStorage = Taro.getStorageSync('userInfo')
    const list = ref([
      // {
      //   name: '基本信息',
      //   url: '/pages/baseInfo/index',
      //   imgUrl: imagesRequire('/mine/icon01.png'),
      // },
      {
        name: '修改密码',
        imgUrl: imagesRequire('/mine/icon02.png'),
        url: '/pages/updatePassword/index',
      },
      // {
      //   name: '关于我们',
      //   imgUrl: imagesRequire('/mine/icon03.png'),
      //   // url: '/pages/pagesInspection/plan/index',
      // },
      // {
      //   name: '意见反馈',
      //   imgUrl: imagesRequire('/mine/icon04.png'),
      //   // url: '/pages/pagesInspection/plan/index',
      // },
    ])

    const toastObj = ref({
      toastText: '',
      showErrorPasswor: false,
      status: 'error', // error, loading, success
    })

    const userInfo = ref({
      userName: userInfoStorage.userName,
      tel: userInfoStorage.phone
    })

    // 获取用户账号信息
    const getUserInfoData = () => {
      let parames = {
        userCode: '',
      }
      getUserInfo(parames).then((res) => {
        userInfo.value = res.userVO
      })
    }

    // 获取用户信息
    const logOut = () => {
      securityLogout().then((res) => {
        const { code } = res;
        if (res.code === 200) {
          showErro('退出登陆成功', 'success')
          removeSorage()
        }
      })
    }

    const updatePwd = () => {
      Taro.navigateTo({
        url: '/pages/updatePassword/index',
      })
    }
    const clickModel = function (url) {
      console.log(url)
      if (url) {
        // 跳转到目的页面，在当前页面打开
        Taro.navigateTo({
          url: url,
        })
      }
    }
    const showErro = (value = '', status = 'error') => {
      toastObj.value.toastText = value
      toastObj.value.showErrorPasswor = true
      toastObj.value.status = status
    }
    return {
      toastObj,
      list,
      userInfo,
      clickModel,
      imagesRequire,
      logOut,
      updatePwd,
    }
  },
}
</script>
