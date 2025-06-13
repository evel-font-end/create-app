<template>
  <View class="index">
    <navBar  :back="true" />
    <!-- 卡片组件 -->
    <Card :title="state.title" :isLeftLine="true" :isNoBottomLine="true">
      <!-- 列表组件 -->
      <FormRow v-model:form="state.form" :list="state.rowList" :align="'left'"> </FormRow>
    </Card>
    <Card
      v-for="(item, idx) in state.extraRows"
      :key="idx"
      :title="'填报事项'"
      :isLeftLine="true"
      :isNoBottomLine="true"
    >
      <FormRow v-model:form="item.form" :list="item.rowList" :align="'left'"></FormRow>
    </Card>
    <View class="flex flexColumn flexAlignCenter bottom-content" v-if="!state.itemName">
      <view class="operatingButton">
        <AtButton type="primary" @click="submit">保存</AtButton>
      </view>
    </View>
  </View>
</template>

<script>
import { AtButton } from 'taro-ui-vue3'
import { onMounted, ref, reactive, watch } from 'vue'
import './index.scss'
import { useRouter } from '@tarojs/taro'
import navBar from '@/components/navBar/index.vue'
import Card from '@/components/card/index.vue'
import FormRow from '@/components/formRow/index.vue'
import Taro from '@tarojs/taro'
import AtToast from '@/components/AtToast/index.vue'
import { showToast } from '@/utils/showToast'
import { addProgram } from '@/api/programList/index.js'


export default {
  name: 'dailyMattersAdd',
  components: {
    AtButton,
    navBar,
    Card,
    FormRow,
    AtToast,
  },
  setup() {
    const router = useRouter()
    const itemName = router.params.itemName
    const projectId = router.params.projectId
    const title =  '新增项目'
    const state = reactive({
      title,
      itemName: itemName,
      extraRows: [],
      form: {
        itemName: itemName || '',
      },

      rowList: [
        {
          name: '项目名称',
          column: true,
          type: 'text',
          prop: 'projectName',
          placeholder: '请输入项目名称',
        },
        {
          name: '项目描述',
          column: true,
          type: 'textArea',
          prop: 'projectDetailed',
          placeholder: '请输入项目描述',
        },
        {
          name: '所属区域',
          column: true,
          type: 'region',
          prop: 'districtId',
          placeholder: '请输入项目描述',
        },
        {
          name: '队长',
          column: true,
          type: 'text',
          prop: 'manager',
          placeholder: '请输入队长',
        },
        {
          name: '联系电话',
          column: true,
          type: 'text',
          prop: 'managerPhone',
          placeholder: '请输入联系电话',
        },
      ],
      
    })

    // 初始化执行
    onMounted(() => {
        state.title = title;
        state.form = {
          itemName: itemName
        };
    })


    const getData = function () {
      if (state.itemName) {
        state.form.itemName = state.itemName
      }
    }


    const submit = () => {

      addProgram(state.form).then(async(res) => {
        const solve = await showToast('日常事项填报成功!', 'success')
        if(solve) {
          close()
        }
      })
    }

    const handleAddItem = () => {
      state.extraRows.push({
        form: {
          itemName: '',
        },
        rowList: [
          {
            column: true,
            type: 'textArea',
            prop: 'itemName',
            placeholder: '请输入事项内容',
            disabled: false,
          },
        ],
      })
    }

    const close = () => {
      Taro.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
        success: () => {
          const page = Taro.getCurrentPages().pop()
          if (!page) return
          page.onLoad()
        },
      })
    }

    return {
      state,
      title,
      submit,
      handleAddItem
    }
  },
}
</script>
