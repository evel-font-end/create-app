<template>
  <view class="pullToRefreshView container">
    <scroll-view
      :scroll-y="true"
      :scroll-top="scrollTop"
      @scrolltolower="handleScrollToLower"
      class="scroll-view"
    >
      <view class="scroll-main">
        <slot name="items" :items="data"></slot>
      </view>
      <view v-if="loading" class="loading-indicator">加载中...</view>
      <view v-if="noMoreData" class="no-more-data-indicator">没有更多数据</view>
    </scroll-view>
  </view>
</template>

<script>
import { ref, onMounted, watch, provide } from 'vue'
import './index.scss'

// 创建一个符号用于在组件树中提供和注入数据
const PullToRefreshSymbol = Symbol('PullToRefresh')

export default {
  name: 'pullToRefreshView',
  props: {
    initialData: {
      type: Array,
      required: true,
    },
    limit: {
      type: Number,
      default: 10,
    },
    onFetch: {
      type: Function,
      required: true,
    },
  },
  setup(props, { slots, emit }) {
    const data = ref([...props.initialData])
    const loading = ref(false)
    const noMoreData = ref(false)
    const page = ref(1)
    const scrollTop = ref(0)

    const fetchMoreData = async () => {
      if (loading.value || noMoreData.value) return
      loading.value = true
      try {
        const newData = await props.onFetch(page.value, props.limit)
        if (newData && newData.length) {
          data.value = [...data.value, ...newData]
          page.value += 1
        } else {
          noMoreData.value = true
        }
      } catch (error) {
        console.error('加载更多数据时出错:', error)
        // 这里可以添加错误处理逻辑，比如显示错误提示
      } finally {
        loading.value = false
      }
    }

    const handleScrollToLower = () => {
      console.log('handleScrollToLower')
      fetchMoreData()
    }

    // 提供一个函数给子组件（如果需要的话），以便它们可以触发刷新（可选）
    provide(PullToRefreshSymbol, refresh)

    const refresh = () => {
      scrollTop.value = 0
      noMoreData.value = false
      page.value = 1 // 如果需要重置分页，可以设置回第一页
      data.value = []
      fetchMoreData()
    }

    // 监听数据变化（可选，用于在数据更新时重置加载状态）
    watch(
      data,
      () => {
        loading.value = false
        noMoreData.value = false // 如果数据被重置，可以移除这个标志
      },
      { immediate: false, deep: true }
    )

    // 在组件挂载时，可以触发一次数据加载
    onMounted(() => {
      scrollTop.value = 0
      fetchMoreData()
    })

    return {
      data,
      loading,
      noMoreData,
      scrollTop,
      refresh,
      handleScrollToLower,
    }
  },
}
</script>
