<template>
  <Picker
    class="regionPicker"
    :class="border ? 'border' : ''"
    ref="Picker"
    mode="multiSelector"
    :value="state.areaIndex"
    @change="changeArea"
    @columnchange="changeAreaColumn"
    :range="state.areaArray"
  >
    <AtList>
      <AtListItem :extraText="state.extraText || '请选择区域'" />
    </AtList>
  </Picker>
</template>

<script>
import { ref, onMounted, reactive, useTemplateRef, watch } from 'vue'
import { Picker } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui-vue3'

import './index.scss'

export default {
  name: 'areaPicker',
  components: {
    Picker,
    AtList,
    AtListItem
  },
  props: {
    border: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      extraText: null,
      addressOptions: [],
      areaArray: [[], [], [], []], // 省、市、区
      areaIndex: [0, 0, 0, 0],
      provinceList: [],
      cityList: [],
      districtList: [],
      streetList: [],
    })
    const PickerRef = useTemplateRef('Picker')

    
    // 初始化省市区
    onMounted(() => {
        init()
    })

    const init = () => {
        import('@/libs/json/allDistrict.min.json').then(res => {
        state.addressOptions = res.subDistrict;
        initData()
      });
    }

    const initData = () => {
        // 省
        state.provinceList = state.addressOptions.map(item => ({
            name: item.districtName,
            value: item.districtId,
            subDistrict: item.subDistrict || [],
        }))
        state.areaArray[0] = state.provinceList.map(item => item.name)
        // 市
        const firstProvince = state.provinceList[0]
        state.cityList = firstProvince.subDistrict.map(item => ({
            name: item.districtName,
            value: item.districtId,
            subDistrict: item.subDistrict || [],
        }))
        state.areaArray[1] = state.cityList.map(item => item.name)
        // 区
        state.districtList = state.cityList[0].subDistrict.map(item => ({
            name: item.districtName,
            value: item.districtId,
            subDistrict: item.subDistrict || [],
        }))
        state.areaArray[2] = state.districtList.map(item => item.name)

        // 村
        state.streetList = state.districtList[0].subDistrict.map(item => ({
            name: item.districtName,
            value: item.districtId,
            subDistrict: item.subDistrict || [],
        }))
        state.areaArray[3] = state.streetList.map(item => item.name)
    }

    // 选择省/市/区
    const changeArea = (e) => {
        state.areaIndex = e.detail.value
  const [pIdx, cIdx, dIdx, sIdx] = state.areaIndex

  // 取出对象
  const provinceObj = state.provinceList[pIdx]
  const cityObj = (state.addressOptions[pIdx]?.subDistrict || [])[cIdx]
  const districtObj = (cityObj?.subDistrict || [])[dIdx]
  const streetObj = (districtObj?.subDistrict || [])[sIdx]

  // 名称
  const province = provinceObj?.name || ''
  const city = cityObj?.districtName || ''
  const district = districtObj?.districtName || ''
  const street = streetObj?.districtName || ''

  // id
  const provinceId = provinceObj?.value || ''
  const cityId = cityObj?.districtId || ''
  const districtId = districtObj?.districtId || ''
  const streetId = streetObj?.districtId || ''

  state.extraText = `${province}-${city}-${district}-${street}`
  emit('onAreaChange', {
      province: {
        name: province,
        id: provinceId
      },
      city: {
        name: city,
        id: cityId
      },
      district: {
        name: district,
        id: districtId
      },
      street: {
        name: street,
        id: streetId
      }
    })
  }

    // 联动逻辑
    const changeAreaColumn = (e) => {
      const column = e.detail.column
      const value = e.detail.value
      let areaIndex = state.areaIndex.slice()
      areaIndex[column] = value

      if (column === 0) {
        // 省变更，重置市、区
        const province = state.addressOptions[value]
        const cities = (province.subDistrict || []).map(item => item.districtName)
        const city = province.subDistrict?.[0]
        const districtList = (city?.subDistrict || []).map(item => item.districtName)
        const district = city?.subDistrict?.[0]
        const streetList = (district?.subDistrict || []).map(item => item.districtName)
        // 关键：整体赋值新数组
        state.areaArray = [
          state.areaArray[0], // 省不变
          cities,
          districtList,
          streetList
        ]
        state.areaIndex[1] = 0
        state.areaIndex[2] = 0
        state.areaIndex[3] = 0
      } else if (column === 1) {
        // 市变更，重置区、街道
        const pIdx = areaIndex[0]
        const cIdx = value
        const province = state.addressOptions[pIdx]
        const city = province.subDistrict?.[cIdx]
        const districtList = (city?.subDistrict || []).map(item => item.districtName)
        const district = city?.subDistrict?.[0]
        const streetList = (district?.subDistrict || []).map(item => item.districtName)
        state.areaArray = [
          state.areaArray[0],
          state.areaArray[1],
          districtList,
          streetList
        ]
        areaIndex[2] = 0
        areaIndex[3] = 0
      } else if (column === 2) {
        // 区变更，重置街道
        const pIdx = areaIndex[0]
        const cIdx = areaIndex[1]
        const dIdx = value
        const province = state.addressOptions[pIdx]
        const city = province.subDistrict?.[cIdx]
        const district = city?.subDistrict?.[dIdx]
        const streetList = (district?.subDistrict || []).map(item => item.districtName)
        state.areaArray = [
          state.areaArray[0],
          state.areaArray[1],
          state.areaArray[2],
          streetList
        ]
        areaIndex[3] = 0
      }
      state.areaIndex = areaIndex
    } 

    return {
      border: props.border || false,
      state,
      changeArea,
      changeAreaColumn,
    }
  },
}
</script>