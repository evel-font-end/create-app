<template>
  <div id="scrollContainer">
    <vue-seamless-scroll
      :class-option="defaultOption"
      :data="state.useList"
    >
      <div class="flexColumn useList">
        <div
          class="flexRow useItem"
          v-for="(useItem, index) in state.useList"
          :key="index"
        >
          <div class="flexCenter icon">
            <i class="iconfont icon-lou" />
          </div>
          <div class="flexColumn useInfo">
            <div class="infoTitle">{{ useItem.schoolName }}</div>
            <div class="flexRow useLevel">
              <div class="classRoom">{{ useItem.classroomName }}</div>
              <div class="progress">
                <div :style="`width: ${useItem.usePowerRate}%`" />
              </div>
              <div class="num">{{ useItem.usePower }}kw/h</div>
            </div>
          </div>
        </div>
      </div>
    </vue-seamless-scroll>
  </div>
</template>

<script lang="ts">
import {
  ref,
  reactive,
  onMounted,
  getCurrentInstance,
  computed,
  watch,
} from "vue";
import vueSeamlessScroll from "vue-seamless-scroll/src";
import { getUsePowerTop20 } from "@/api/dataBoard";
export default {
  name: "useList",
  components: {
    vueSeamlessScroll,
  },
  props: {
    siteId: Number,
  },
  setup(props: any) {
    let state = reactive({
      useList: [
        {
          id: "1",
          schoolName: "广州市天河区第一师范高级中学",
          classroomName: "902教室",
          usePower: "1933",
        },
        {
          id: "2",
          schoolName: "广州市第二私立中学",
          classroomName: "902教室",
          usePower: "1933",
        },
        {
          id: "3",
          schoolName: "佛山市禅城区第45中学",
          classroomName: "902教室",
          usePower: "1933",
        },
        {
          id: "4",
          schoolName: "广州市第一三五中学",
          classroomName: "902教室",
          usePower: "1933",
        },
        {
          id: "5",
          schoolName: "广州市第一中学",
          classroomName: "902教室",
          usePower: "30",
        },
      ],
    });
    onMounted(() => {});
    let defaultOption = computed(() => {
      return {
        step: 0.4, // 数值越大速度滚动越快
        limitMoveNum: 4, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    });
    // 获取数据
    const _getUsePowerTop20 = (id: number) => {
      getUsePowerTop20(id).then((res: any) => {
        if (res.code == "200") {
          let { data } = res;
          state.useList = data;
        }
      });
    };
    watch(
      () => props.siteId,
      (newVal, oldVal) => {
        if (newVal) {
          _getUsePowerTop20(newVal);
        }
      }
    );
    return {
      state,
      defaultOption,
      _getUsePowerTop20,
    };
  },
};
</script>
<style lang="less" scoped>
#scrollContainer {
  // height: calc(100% -28px);
  overflow: hidden;
  .useList {
    margin-top: 20px;
    min-height: 220px;
    .useItem {
      margin-bottom: 14px; /*no*/
      .icon {
        width: 46px;
        height: 46px;
        opacity: 1;
        background: #eff3ff;
        border-radius: 50%;
        margin-right: 14px;
        i {
          font-size: 22px;
          color: #3f5cc5;
        }
      }
      .useInfo {
        flex: 1;
        .infoTitle {
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Semibold;
          font-weight: 600;
          text-align: left;
          color: #353535;
          line-height: 20px;
          margin-bottom: 5px;
        }
        .useLevel {
          justify-content: space-between;
          align-items: center;
          .classRoom {
            width: 45%;
            font-size: 14px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #353535;
            line-height: 20px;
          }
          .progress {
            width: 159px;
            height: 12px;
            opacity: 1;
            background: #edf3ff;
            position: relative;
            div {
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              background: #709efa;
            }
          }
          .num {
            width: 30%;
            font-size: 14px;
            font-family: PingFangSC, PingFangSC-Semibold;
            font-weight: 600;
            text-align: right;
            color: #353535;
            line-height: 20px;
          }
        }
      }
      &:nth-of-type(1) {
        .useInfo {
          .progress {
            div {
              background: #ff9248;
            }
          }
        }
      }
      &:nth-of-type(2) {
        .useInfo {
          .progress {
            div {
              background: #f4c539;
            }
          }
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
