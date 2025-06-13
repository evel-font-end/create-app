<template>
  <view class="flex flexColumn tabView">
    <view class="flex flexRow flexAlignCenter flexBetween top">
      <text class="title">事项列表</text>
      <view class="flex flexRow flexAlignCenter addDetail" @click="clickAdd()">
        <text>填报</text>
        <AtIcon
          :value="'add-circle'"
          :size="14"
          class="iconfont"
          :color="'#0050B0'"
        ></AtIcon>
      </view>
    </view>
    <view class="flex flexColumn items">
      <view
        class="flex flexColumn item"
        v-for="(item, i) in state.dataList"
        :key="i"
        @click="clickRight(item)"
      >
        <text class="content">{{ item.itemName }}</text>
        <view class="flex flexRow infoList">
          <view class="flex flexAlignCenter infoItemRow" v-for="(rowItem, idx) in state.infoList" :key="idx">
            <AtIcon
              prefixClass="icon"
              :value="rowItem.icon"
              :size="14"
              class="iconfont"
              :color="'#ABABAB'"
            />
            <text class="ellipsis infoText">{{ item[rowItem.prop] }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { ref, onMounted, reactive, watch } from 'vue'
import { AtIcon } from 'taro-ui-vue3'

import navBar from '@/components/navBar/index.vue'

import { queryItems } from '@/api/programList/index.js'
import './index.scss'

export default {
  name: 'dailyMatters',
  components: {
    navBar,
    AtIcon,
  },
  props: {
    projectId: {
      type: String,
      default: '',
    },
  },
  setup(props) {

    const projectId =props.projectId
    const state = reactive({
      infoList: [
        {
          icon: 'gerenzhongxin',
          prop: 'createdBy',
        },
        {
          icon: 'chakanzhiban1',
          prop: 'createdTime',
        }
      ],
      pageSize: 5, // 每页条数
      pageNo: 1, // 页码
      dataList: [], // 待处理 数据列表
    })
    // 初始化执行
    onMounted(() => {
      fetchData()
    })

    watch(
      () => {
        return projectId
      },
      (now) => {
        fetchData()
      }
    )

    const fetchData = async (page, limit) => {
      // 模拟 API 请求
      let parames = {
        projectId: projectId,
        priorities: '0',
      }
      queryItems(parames).then((res) => {
        const { code, result } = res
        if(result && code === 200) {
          state.dataList = result;
        }
      })
    }

    const clickRight = (item) => {
      Taro.navigateTo({
        url: `/pages/programDetail/dailyMattersAdd/index?itemName=${item.itemName}&priorities=0`,
      })
    }

    const clickAdd = () => {
      Taro.navigateTo({
        url: `/pages/programDetail/dailyMattersAdd/index?projectId=${projectId}&priorities=0`,
      })
    }


    return {
      state,
      fetchData,
      clickRight,
      clickAdd
    }
  },
}
</script>
