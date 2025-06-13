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
      <Card
        v-for="(item, i) in state.dataList"
        :key="i"
        :title="item.itemName"
        :isLeftLine="true"
        :isNoBottomLine="true">
        <view
          v-if="item.pmItemSpecificList && item.pmItemSpecificList.length > 0"
          class="flex flexColumn item"
          v-for="(speciItem, speciIndex) in item.pmItemSpecificList"
          :key="speciIndex"
          @click="clickRight(speciItem)"
        >
          <text class="content">{{ speciItem.specificContent }}</text>
          <view class="flex flexRow infoList">
            <view class="flex flexAlignCenter infoItemRow" v-for="(rowItem, idx) in state.infoList" :key="idx">
              <AtIcon
                prefixClass="icon"
                :value="rowItem.icon"
                :size="14"
                class="iconfont"
                :color="'#ABABAB'"
              />
              <text class="ellipsis infoText">{{ speciItem[rowItem.prop] }}</text>
            </view>
          </view>
        </view>
        <view v-if="state.showInput[i]" class="inputBox">
          <AtTextarea
            :value="state.inputContent[i] || ''"
            :maxLength=" 200"
            :placeholder="'请输入事项内容'"
            @change="string => atTextareaChangeValue(i, string)"
          />
        </view>
        <view class="flex flexRow flexAlignCenter flexJustifyEnd pmItemContainer">
          <view class="flex flexRow flexAlignCenter addPmItem" @click="state.showInput[i] ? onSave(i, item) : clickAddPm(i)">
            <text>{{ state.showInput[i] ? '保存' : '填报' }}</text>
            <AtIcon
              v-if="state.showInput[i]"
              prefixClass="icon"
              :value="'gaishu'"
              :size="14"
              class="iconfont"
              :color="'#0050B0'"
            ></AtIcon>
            <AtIcon
              v-else
              :value="'add-circle'"
              :size="14"
              class="iconfont"
              :color="'#0050B0'"
            ></AtIcon>
          </view>
          <view class="flex flexRow flexAlignCenter packUp" @click.stop="toggleExpand(i)">
            <text>{{ state.expandedItems[i] ? '收起' : '展开' }}</text>
            <AtIcon
              :value="state.expandedItems[i] ? 'chevron-up' : 'chevron-down'"
              :size="14"
              class="iconfont"
              :color="'#0050B0'"
            ></AtIcon>
          </view>
        </view>
      </Card>

    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { ref, onMounted, reactive, watch } from 'vue'
import { AtIcon, AtTextarea } from 'taro-ui-vue3'

import navBar from '@/components/navBar/index.vue'
import Card from '@/components/card/index.vue'
import FormRow from '@/components/formRow/index.vue'

import { queryItems, addItemSpecific } from '@/api/programList/index.js'

import { showToast } from '@/utils/showToast'

import './index.scss'

export default {
  name: 'keyMatters',
  components: {
    navBar,
    Card,
    FormRow,
    AtIcon,
    AtTextarea
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
      expandedItems: {}, // 记录每个item的展开状态
      showInput: {}, // 每个item的输入框显示状态
      inputContent: {}, // 每个item的输入内容
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
        priorities: '1',
      }
      queryItems(parames).then((res) => {
        const { code, result } = res
        if(result && code === 200) {
          state.dataList = result;
          state.expandedItems = {}
          state.showInput = {}
          state.inputContent = {}
          result.forEach((item, idx) => {
            state.expandedItems[idx] = false
            state.showInput[idx] = false
            state.inputContent[idx] = ''
          })
        }
      })
    }

    const clickRight = (item) => {
      Taro.navigateTo({
        url: `/pages/programDetail/dailyMattersAdd/index?itemName=${item.itemName}&priorities=1`,
      })
    }

    const clickAdd = () => {
      Taro.navigateTo({
        url: `/pages/programDetail/dailyMattersAdd/index?projectId=${projectId}&priorities=1`,
      })
    }

    // 新增：切换展开/收起
    const toggleExpand = (idx) => {
      state.expandedItems[idx] = !state.expandedItems[idx]
    }

  // 新增：点击“填报”显示输入框
  const clickAddPm = (idx) => {
    state.showInput[idx] = !state.showInput[idx]
  }

  // 输入框内容变化
  const atTextareaChangeValue = (idx, str) => {
    state.inputContent[idx] = str
  }

    // 示例保存方法
  const onSave = (idx, item) => {
    // 这里可以调用接口提交 state.inputContent[idx]
    const specificContent = state.inputContent[idx];
    addItemSpecific({
      itemId: item.id,
      specificContent: specificContent,
    }).then(async (res) => {
       const { code, message } = res
        if(code === 200) {
          const solve = await showToast(message, 'success')
          if(solve) {
            state.showInput[idx] = false
            state.inputContent[idx] = '' // 清空输入内容
            fetchData()
          }
        }
    })
    
  }
    

    return {
      state,
      fetchData,
      clickRight,
      clickAdd,
      clickAddPm,
      toggleExpand,
      atTextareaChangeValue,
      onSave
    }
  },
}
</script>
