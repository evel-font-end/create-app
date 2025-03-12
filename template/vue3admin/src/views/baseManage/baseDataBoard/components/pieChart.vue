<template>
  <div id="pieChart" ref="pieChart" />
</template>

<script lang="ts">
import * as echarts from "echarts"; // 引入echarts
import { ref, reactive, onMounted, watch } from "vue";
import { getClassroomModeAnalysis } from "@/api/dataBoard";
var colorList = [
  "#5B8FF9",
  "#5AD8A6",
  "#5D7092",
  "#F6BD16",
  "#E8684A",
  "#6DC8EC",
  "#58D5FF",
];
export default {
  name: "pieChart",
  components: {},
  props: {
    siteId: Number,
  },
  setup(props: any) {
    function initPieChart(data: any) {
      const modeData: any[] = [],
        pieData: any[] = [];
      data.map((e: any) => {
        modeData.push(e.modeName);
        pieData.push({
          name: e.modeName,
          value: e.modeRate,
        });
      });
      let pieChart = echarts.init(
        document.getElementById("pieChart") as any,
        "chalk"
      );
      let option = {
        title: {
          text: "",
          x: "center",
          y: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          icon: "circle",
          orient: "horizontal",
          // x: 'left',
          data: modeData,
          bottom: 0,
          textStyle: {
            color: "#8C8C8C",
          },
          itemGap: 10,
        },
        series: [
          {
            type: "pie",
            center: ["50%", "40%"],
            radius: ["40%", "55%"],
            hoverAnimation: true,
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 30,
            itemStyle: {
              normal: {
                color: function(params: any) {
                  return colorList[params.dataIndex];
                },
                borderColor: "#fff",
                borderWidth: 1,
              },
            },
            label: {
              show: true,
              position: "outside",
              formatter: "{d}%",
              rich: {
                hr: {
                  backgroundColor: "t",
                  borderRadius: 3,
                  width: 3,
                  height: 3,
                  padding: [3, 3, 0, -12],
                },
                a: {
                  padding: [-30, 15, -20, 15],
                },
              },
            },
            labelLine: {
              normal: {
                length: 18,
                lineStyle: {
                  width: 1,
                  color: "#7FB5FF",
                },
              },
            },
            data: pieData,
          },
        ],
      };
      pieChart.clear();
      setTimeout(() => {
        pieChart.setOption(option);
      }, 500);
      // pieChart.setOption(option);
      window.addEventListener("resize", () => pieChart.resize(), true);
    }
    const getClassroomMode = (id: number) => {
      getClassroomModeAnalysis(id).then((res: any) => {
        if (res.code == "200") {
          let { data } = res;
          initPieChart(data);
        }
      });
    };
    onMounted(() => {});
    watch(
      () => props.siteId,
      (newVal, oldVal) => {
        getClassroomMode(newVal);
      },
      { immediate: true }
    );
    return {
      initPieChart,
      getClassroomMode,
    };
  },
};
</script>
<style lang="less" scoped>
#pieChart {
  width: 100%;
  //   height: calc(100% - 565px);
  height: 100%;
}
</style>
