<template>
  <Picker
    ref="Picker"
    mode="multiSelector"
    :value="state.dateTime"
    @change="changeDateTime"
    @columnchange="changeDateTimeColumn"
    :range="['美国', '中国', '巴西', '日本']"
  >
    <slot></slot>
  </Picker>
</template>

<script>
import { ref, onMounted, reactive, useTemplateRef } from 'vue'
import { Picker } from '@tarojs/components'

import './index.scss'
import { dateTimePicker, getMonthDay } from './pick'
import dayjs from 'dayjs'

export default {
  name: 'timePicker',
  components: {
    Picker,
  },
  props: {
    defaultTime: {
      type: String,
    },
    minDate: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      date: '2025-01-01',
      time: '12:00',
      dateTimeArray: [],
      dateTime: '',
      startYear: 2000,
      endYear: 2050,
    })
    const Picker = useTemplateRef('Picker')

    onMounted(() => {
      const { defaultTime, minDate } = props
      // 获取完整的年月日 时分秒，以及默认显示的数组
      var obj = dateTimePicker(
        state.startYear,
        state.endYear,
        defaultTime || dayjs().format('YYYY-MM-DD HH:mm:ss'),
        minDate
      )
      state.dateTime = obj.dateTime
      state.dateTimeArray = obj.dateTimeArray
    })

    const changeDateTime = (e) => {
      state.dateTime = e.detail.value

      var aaa1 = state.dateTime[0]
      var aaa2 = state.dateTime[1]
      var aaa3 = state.dateTime[2]
      var aaa4 = state.dateTime[3]
      var aaa5 = state.dateTime[4]
      var aaa6 = state.dateTime[5]

      var time1 = state.dateTimeArray[0][aaa1]
      var time2 = state.dateTimeArray[1][aaa2]
      var time3 = state.dateTimeArray[2][aaa3]
      var time4 = state.dateTimeArray[3][aaa4]
      var time5 = state.dateTimeArray[4][aaa5]
      var time6 = state.dateTimeArray[5][aaa6]
      var time = time1 + '-' + time2 + '-' + time3 + ' ' + time4 + ':' + time5 + ':' + time6
      emit('onDateChange', { detail: { value: time } })
    }

    const changeDateTimeColumn = (e) => {
      // console.log('changeDateTimeColumn', e)
      var arr = state.dateTime,
        dateArr = state.dateTimeArray
      // console.log('dateArr', dateArr)
      // console.log('arr', arr)
      arr[e.detail.column] = e.detail.value
      dateArr[2] = getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]])
      // console.log('dateArr', dateArr)
      state.dateTimeArray = dateArr
      state.dateTime = arr
    }

    return {
      state,
      changeDateTime,
      changeDateTimeColumn,
    }
  },
}
</script>
