<template>
  <view class="map-container">
    <!-- 地图容器 -->
    <map
      class="map"
      id="map"
      :longitude="bMapTransQQMap(longitude, latitude).lng"
      :latitude="bMapTransQQMap(longitude, latitude).lat"
      scale="15"
      show-location="true"
      :markers="state.markers"
      bindmarkertap="makertap"
    ></map>
  </view>
</template>

<script>
import { onMounted, onUnmounted, reactive, watch } from 'vue'
import './index.scss'
import { akRequire } from '@/utils/require.js';
// 引用腾讯地图微信小程序JSAPI模块
import QQMapWX from '@/libs/tMap/qqmap-wx-jssdk.min.js'
const bMapTransQQMap = (baiduLng = 113.32452, baiduLat = 23.099994) => {
  let x_pi = (3.14159265358979324 * 3000.0) / 180.0
  let x = baiduLng - 0.0065
  let y = baiduLat - 0.006
  let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
  let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
  let tencentLng = z * Math.cos(theta)
  let tencentLat = z * Math.sin(theta)
  return { lng: tencentLng, lat: tencentLat }
}
export default {
  name: 'mapView',
  props: {
    longitude: {
      type: String,
      default: '',
    },
    latitude: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      BMap: null,
      markers: [],
    })

    watch(
      () => {
        props.longitude
      },
      () => {
        state.markers = [
          {
            id: 1,
            longitude: bMapTransQQMap(props.longitude, props.latitude).lng,
            latitude: bMapTransQQMap(props.longitude, props.latitude).lat,
            width: 20,
            height: 25,
          },
        ]
      },
      { deep: true, immediate: true }
    )
    onMounted(() => {
      initMap()
    })
    onUnmounted(() => {
    })
    const initMap = () => {
      // 创建地图实例
      // 确保 BMapWX 对象存在
      if (typeof QQMapWX !== 'undefined') {
        // 创建地图实例
        state.qqmapsdk = new QQMapWX({
            key: akRequire()
        });
        // 设置地图中心点等属性（根据需要配置）
        // state.BMap.centerAndZoom(new state.BMap.Point(116.404, 39.915), 14)
      } else {
        console.error('QQMapWX 对象未定义，请确保百度地图 JSAPI 已正确加载')
      }
    }

    return {
      state,
      bMapTransQQMap,
    }
  },
}
</script>
