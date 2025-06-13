<template>
  <view class="programDetail">
    <navBar :back="true" />
    <view class="container">
      <AtTabs :tabList="state.tabList" :current="state.current">
        <template v-slot:keyMatters>
          <KeyMatters :projectId="state.projectId"/>
        </template>
        <template v-slot:dailyMatters>
          <DailyMatters :projectId="state.projectId"/>
        </template>
      </AtTabs>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { ref, onMounted, reactive, watch } from 'vue'

import { useRouter } from '@tarojs/taro'
import AtTabs from '@/components/AtTabs/index.vue'
import navBar from '@/components/navBar/index.vue'


import DailyMatters from './dailyMatters/index.vue'
import KeyMatters from './keyMatters/index.vue'
import './index.scss'

export default {
  name: 'programDetail',
  components: {
    navBar,
    AtTabs,
    DailyMatters,
    KeyMatters
  },
  props: {
    projectId: {
      type: String,
      default: '',
    },
  },
  setup(props) {

    const router = useRouter()
    const projectId = router.params.projectId || props.projectId
    const state = reactive({
      tabList: [{  title: '重点事项', id: 'keyMatters' }, {  title: '日常事项', id: 'dailyMatters' }],
      projectId,
      current: 0,
    })
    // 初始化执行
    onMounted(() => {
    })
    

    return {
      state,
    }
  },
}
</script>
