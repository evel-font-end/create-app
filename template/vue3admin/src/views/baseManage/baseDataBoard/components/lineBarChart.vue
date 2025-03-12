<template>
  <div id="lineBarChart" ref="lineBarChart" />
</template>

<script lang="ts">
import * as echarts from "echarts"; // 引入echarts
import { ref, reactive, onMounted, watch } from "vue";
import { getHalfYearTceAnalysis } from "@/api/dataBoard";
export default {
  name: "lineBarChart",
  components: {},
  props: {
    siteId: Number,
  },
  setup(props: any) {
    function initLineChart(data: any) {
      const lineData = data.reverse();
      const onlineData: any[] = [],
        useData: any[] = [],
        monthData: any[] = [];
      lineData.map((e: any) => {
        onlineData.push(e.onlineNum);
        useData.push(e.usePower);
        monthData.push(e.simpleTimeAxis);
      });
      let lineChart = echarts.init(
        document.getElementById("lineBarChart") as any,
        "chalk"
      );
      let option = {
        tooltip: {
          trigger: "axis",
          /* axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          }, */
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        legend: {
          data: ["月用电量（kw/h）", "在线数"],
          left: "right",
          itemWidth: 11,
          itemHeight: 10,
          textStyle: {
            //图例文字的样式
            color: "#8C8C8C",
            fontSize: 14,
            fontWeight: 400,
            fontFamily: "PingFangSC",
          },
        },
        xAxis: [
          {
            type: "category",
            data: monthData,
            axisPointer: {
              type: "shadow",
            },
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#D1DAEF", //左边线的颜色
                width: "1", //坐标线的宽度
              },
            },
            axisLabel: {
              textStyle: {
                color: "#353535",
                fontSize: 14,
                fontWeight: 400,
                fontFamily: "PingFangSC",
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              textStyle: {
                color: "#353535",
                fontSize: 14,
                fontFamily: "ArialMT",
              },
            },
          },
          {
            type: "",
            name: "",
            show: false,
          },
        ],
        series: [
          {
            name: "月用电量（kw/h）",
            type: "bar",
            barWidth: 18,
            color: "#709FFA",
            data: useData,
          },
          {
            name: "在线数",
            type: "line",
            yAxisIndex: 1,
            symbolSize: 8,
            symbol: "circle",
            animation: true,
            lineStyle: {
              normal: {
                color: "#51CDFF", //折线的颜色
              },
            },
            itemStyle: {
              normal: {
                color: "#51CDFF", //拐点颜色
                borderColor: "#fff", //拐点边框颜色
                borderWidth: 2, //拐点边框大小
              },
              emphasis: {
                color: "#51CDFF", //hover拐点颜色定义
                borderColor: "rgba(81,205,255,0.5)", //拐点边框颜色
                borderWidth: 8, //拐点边框大小
              },
            },
            data: onlineData,
          },
        ],
      };
      lineChart.clear();
      setTimeout(() => {
        lineChart.setOption(option);
      }, 500);
      window.addEventListener("resize", () => lineChart.resize(), true);
    }
    const getHalfYear = (id: number) => {
      getHalfYearTceAnalysis(id).then((res: any) => {
        if (res.code == "200") {
          let { data } = res;
          initLineChart(data);
        }
      });
    };
    onMounted(() => {
      // getHalfYear();
    });
    watch(
      () => props.siteId,
      (newVal, oldVal) => {
        getHalfYear(newVal);
      }
    );
    return {
      initLineChart,
      getHalfYear,
    };
  },
};
</script>
<style lang="less" scoped>
#lineBarChart {
  width: 100%;
  height: 90%;
}
</style>
