<template>
  <pageModel class="updatePassword">
    <view class="model">
      <view class="name">旧密码</view>
      <inputVue type="password" :placeholder="'请输入旧密码'" v-model="form.oldPwd" />
      <view class="name">新密码</view>
      <inputVue type="password" :placeholder="'请输入新密码'" v-model="form.newPwd" />
      <view class="name">确认新密码</view>
      <inputVue type="password" :placeholder="'请再次输入新密码'" v-model="form.comfirmPassword" />

      <!-- 按钮 -->
      <buttomConfirm class="buttomConfirm" @next="submitUpdatePwd" @close="cancelUpdatePwd" />
      <!-- @close="toastObj.value.showErrorPasswor = false" -->
      <AtToast
        :isOpened="toastObj.showErrorPasswor"
        :closeAtToast="closeAtToast"
        :text="toastObj.toastText"
        :status="toastObj.status"
        :duration="3000"
      ></AtToast>
    </view>
  </pageModel>
</template>

<script>
import inputVue from 'comp/input/index.vue'
import buttomConfirm from 'comp/buttomConfirm/index.vue'
import pageModel from 'comp/pageModel/index.vue'
import Taro from '@tarojs/taro'
import AtToast from 'comp/AtToast/index.vue'
import { changepwd } from '@/api/mine/index.js'
import { encryptDes } from '../../utils/des.js'

import './index.scss'
import { ref } from 'vue'

export default {
  name: 'indexView',
  components: {
    inputVue,
    buttomConfirm,
    pageModel,
    AtToast,
  },
  watch: {},
  setup() {
    const form = ref({
      oldPwd: '',
      newPwd: '',
      comfirmPassword: '',
    })
    const toastObj = ref({
      toastText: '',
      showErrorPasswor: false,
      status: 'error', // error, loading, success
    })

    const key = ref(null)

    // 提交修改密码
    const submitUpdatePwdHandle = () => {
      // console.log('parames', parames, toastObj.value.showErrorPasswor)

      if (!form.value.oldPwd) {
        showErro('请输入旧密码', 'error')
        return
      }
      if (!form.value.newPwd) {
        showErro('请输入新密码', 'error')
        return
      }

      if (!form.value.newPwd.length > 8) {
        showErro('新密码长度应该大于8位', 'error')
        return
      }
      if (!form.value.comfirmPassword) {
        showErro('请输入确认密码', 'error')
        return
      }
      if (form.value.newPwd !== form.value.comfirmPassword) {
        showErro('新密码与确认密码不一致，请重新输入', 'error')
        return
      }
      let parames = {
        oldPassword: form.value.oldPwd,
        newPassword: form.value.newPwd,
      }
      changepwd(parames).then(res => {
        const { code } = res;
        if (res.code === 200) {
            showErro('密码修改成功', 'success')
            key.value = setTimeout(() => {
              cancelUpdatePwd()
            }, 2000)
          }
      })
    }
    // 取消 返回上一级
    const cancelUpdatePwd = () => {
      Taro.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
        success: () => {
          const page = Taro.getCurrentPages().pop()
          if (!page) return
          page.onLoad()
        },
      })
    }
    // 确认修改密码，关闭，返回上一级
    const submitUpdatePwd = function () {
      submitUpdatePwdHandle()
    }

    const showErro = (value = '', status = 'error') => {
      toastObj.value.toastText = value
      toastObj.value.showErrorPasswor = true
      toastObj.value.status = status
    }

    const closeAtToast = () => {
      console.log('closeAtToast')
      toastObj.value.toastText = ''
      toastObj.value.showErrorPasswor = false
      toastObj.value.status = ''
    }

    return {
      form,
      toastObj,
      cancelUpdatePwd,
      submitUpdatePwd,
      closeAtToast,
    }
  },
}
</script>
