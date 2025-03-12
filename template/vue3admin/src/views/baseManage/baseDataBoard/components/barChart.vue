<template>
  <div id="barChart" ref="barChart" />
</template>

<script lang="ts">
import * as echarts from "echarts"; // 引入echarts
import { ref, reactive, onMounted, watch } from "vue";
import { getUserPowerStatistics } from "@/api/dataBoard";
export default {
  name: "barChart",
  components: {},
  props: {
    siteId: Number,
  },
  setup(props: any) {
    function initPieChart(data: any) {
      const pieData = data.reverse();
      const maxData: any[] = [],
        minData: any[] = [],
        monthData: any[] = [];
      pieData.map((e: any) => {
        maxData.push(e.maxUsePower);
        minData.push(e.minUsePower);
        monthData.push(e.simpleTimeAxis);
      });
      let lineChart = echarts.init(
        document.getElementById("barChart") as any,
        "chalk"
      );
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          data: ["最低用电量（kw/h）", "最高用电量（kw/h）"],
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
        grid: {
          left: "3%",
          right: "4%",
          bottom: "8%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: monthData,
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
        ],
        series: [
          {
            name: "最高用电量（kw/h）",
            type: "bar",
            barWidth: 18,
            stack: "广告",
            color: "#69EDBB",
            emphasis: {
              focus: "series",
            },
            data: maxData,
          },
          {
            name: "最低用电量（kw/h）",
            type: "bar",
            stack: "广告",
            color: "#709FFA",
            emphasis: {
              focus: "series",
            },
            data: minData,
          },
        ],
      };
      lineChart.clear();
      setTimeout(() => {
        lineChart.setOption(option);
      }, 500);
      window.addEventListener("resize", () => lineChart.resize(), true);
    }
    const getUserPower = (id: number) => {
      getUserPowerStatistics(id).then((res: any) => {
        if (res.code == "200") {
          let { data } = res;
          initPieChart(data);
        }
      });
    };
    onMounted(() => {
      // getUserPower();
    });
    watch(
      () => props.siteId,
      (newVal, oldVal) => {
        getUserPower(newVal);
      },
      { immediate: true }
    );
    return {
      initPieChart,
      getUserPower,
    };
  },
};
</script>
<style lang="less" scoped>
#barChart {
  width: 100%;
  height: 100%;
}
</style>
