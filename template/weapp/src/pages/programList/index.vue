<template>
  <view class="programList">
    <navBar :back="false"/>
    <view class="flex flexRow flexCenter addProgram" @click="addProgram">
      <AtIcon
        prefixClass="icon"
        :value="'jiahao'"
        :size="14"
        class="iconfont"
        :color="'#fff'"
      ></AtIcon>
      <text>新增项目</text>
    </view>
    <view class="flex flexRow searchContainer">
      <view class="flex regionView">
        <RegionPicker @onAreaChange="onAreaChange" class="regionPicker">
        </RegionPicker>
      </view>
      <view class="flex flexAlignCenter nameView">
        <inputVue
          class="at-input ellipsis"
          placeholder="查询项目"
          v-model="state.projectName"
        />
        <view class="flex flexCenter btnView" @click="handleSearch">
          <AtIcon
            prefixClass="icon"
            :value="'sousuo'"
            :size="14"
            class="flex iconfont"
            :color="'#fff'"
          ></AtIcon>
        </view>
      </view>
    </view>
    <view class="flex flexColumn mineBox">
      <PullToRefresh
        ref="PullToRefresh"
        :initialData="state.dataList"
        :limit="state.pageSize"
        :onFetch="fetchData"
      >
      <template v-slot:items="scope">
        <view
          class="item"
          v-for="(item, i) in scope.items"
          :key="i" @click="clickRight(item)">
          <view class="flex flexRow flexAlignCenter title">
            <view class="flex flexAlignCenter flexJustifyCenter iconView">
              <AtIcon
                prefixClass="icon"
                :value="'suozailouceng2'"
                :size="20"
                class="iconfont"
                :color="'#1671D4'"
              ></AtIcon>
            </view>
            <text class="flex ellipsis name">{{ item.projectName }}</text>
            <AtIcon
              prefixClass="icon"
              :value="'youbianjiantou'"
              :size="16"
              class="iconfont arrow-icon"
              :color="'#6C6C6C'"
            ></AtIcon>
          </view>
          <view class="introduce">
            {{ item.projectDetailed }}
          </view>
          <view class="infoList">
            <view
              class="flex flexRow flexAlignCenter infoItem"
              v-for="(row, rowIdx) in infoList"
              :key="rowIdx"
            >
              <view class="flex flexAlignCenter infoItemRow" v-for="(rowItem, idx) in row" :key="idx">
                <AtIcon
                  prefixClass="icon"
                  :value="rowItem.icon"
                  :size="16"
                  class="iconfont"
                  :color="'#69A1DD'"
                />
                <text class="ellipsis infoText">{{rowItem.text}}:{{ item[rowItem.prop] }}</text>
              </view>
            </view>
          </view>
        </view>
        </template>
      </PullToRefresh>
    </view>
    <tabBar :current="0" />
  </view>
</template>

<script>
import { onMounted, reactive, useTemplateRef } from 'vue'
import { AtIcon } from 'taro-ui-vue3'
import Taro from '@tarojs/taro'

import navBar from '@/components/navBar/index.vue'
import PullToRefresh from 'comp/PullToRefresh/index.vue'
import tabBar from '@/components/tabBar/index.vue'
import RegionPicker from '@/components/regionPicker/index.vue'
import inputVue from 'comp/input/index.vue'

import { queryProjectList } from '@/api/programList/index.js'
import './index.scss'
import { ref } from 'vue'

export default {
  name: 'programList',
  components: {
    navBar,
    AtIcon,
    PullToRefresh,
    RegionPicker,
    inputVue,
    tabBar
  },
  watch: {},
  setup() {
    onMounted(() => { })

    const state = reactive({
      districtId: '',
      projectName: '', // 项目名称
      pageSize: 5, // 每页条数
      pageNo: 1, // 页码
      dataList: [], // 待处理 数据列表
    })

  const PullToRefresh = useTemplateRef('PullToRefresh')

  //数据列表
  const fetchData = async (page, limit) => {
    // 模拟 API 请求
    return new Promise((resolve) => {
      let parames = {
        districtId: state.districtId,
        projectName: state.projectName,
        pageNo: page,
        pageSize: limit,
      }
      queryProjectList(parames).then((res) => {
        const { code, result } = res
        if(result && code === 200) {
          resolve(result.records)
        }
      })
    })
  }
    const infoList = [
      [
        { icon: 'kaoqindaka1', text: '所属区域', prop: 'districtName' }
      ],
      [
        { icon: 'gerenzhongxin', text: '队长', prop: 'manager' },
        { icon: 'tel', text: '电话:', prop: 'managerPhone' }
      ],
      [
        { icon: 'weibaoceshijilu', text: '设备数', prop: 'deviceNumber' },
        { icon: 'gerenzhongxin', text: '用户数', prop: 'userNumber' }
      ]
    ]

    const clickRight = function (item) {
        Taro.navigateTo({
          url: `/pages/programDetail/index?projectId=${item.id}`,
        })
    }

    const addProgram = () => {
      Taro.navigateTo({
        url: `/pages/programList/programAdd/index`,
      })
    }

    const onAreaChange = (e) => {
      const { province, city, district, street } = e;
      state.districtId = street.id || district.id || city.id || province.id;
      // 重新请求数据
      handleSearch()
    }

    const handleSearch = () => {
      PullToRefresh.value.refresh()
    }
    
    return {
      state,
      infoList,
      fetchData,
      clickRight,
      addProgram,
      onAreaChange,
      handleSearch
    }
  },
}
</script>
