<template>
  <div class="flexColumn baseDataBoard">
    <div class="selectContainer">
      <el-select v-model="options.value" placeholder="请选择">
        <el-option
          v-for="item in options.data"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <CardList :siteId="options.value" />
    <div class="flexColumn chartList">
      <div class="flexRow chartItem item1">
        <div class="analyseChart">
          <div class="title">能耗本年度情况统计</div>
          <BarChart :siteId="options.value" />
        </div>
        <div class="useChart">
          <div class="title">教室用电量排行</div>
          <UseList :siteId="options.value" />
        </div>
      </div>
      <div class="flexRow chartItem item2">
        <div class="analyseChart">
          <div class="title">能耗分项分析</div>
          <LineBarChart :siteId="options.value" />
        </div>
        <div class="useChart">
          <div class="title">智慧教室模式应用情况分析</div>
          <PieChart :siteId="options.value" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import PieChart from "./components/pieChart.vue";
import UseList from "./components/useList.vue";
import BarChart from "./components/barChart.vue";
import LineBarChart from "./components/lineBarChart.vue";
import CardList from "./components/card.vue";
import { listSiteTree } from "@/api/user";
export default {
  name: "baseDataBoard",
  components: {
    UseList,
    PieChart,
    BarChart,
    LineBarChart,
    CardList,
  },
  setup() {
    const options = reactive({
      data: [],
      value: "",
    });
    const getListSiteTree = () => {
      listSiteTree().then((res: any) => {
        if (res.code == "200") {
          let { data } = res;
          options.data = data.map((e: any) => {
            return {
              value: e.id,
              label: e.name,
            };
          });
          options.value = (options.data[0] as any).value;
        }
      });
    };
    onMounted(() => {
      getListSiteTree();
    });
    return {
      options,
      getListSiteTree,
    };
  },
};
</script>
<style lang="less" scoped>
&:deep(.el-select-dropdown) {
  padding: 0 10px !important;
}
.baseDataBoard {
  height: 100%;
  padding: 20px; /*no*/
  .selectContainer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
    &:deep(.el-select) {
      width: 200px;
    }
  }
  .chartList {
    flex: 1;
    height: calc(100% - 200px);
    justify-content: space-between;
    .chartItem {
      height: calc(50% - 10px); /*no*/
      .analyseChart {
        width: 0;
        padding: 20px;
        height: 100%;
        flex: 3;
        margin-right: 20px; /*no*/
        background: #ffffff;
        border-radius: 0px 2px 2px 0px;
        box-shadow: -4px 0px 16px 0px rgba(209, 218, 239, 0.51);
      }
      .useChart {
        width: 0;
        padding: 20px;
        background: #ffffff;
        border-radius: 0px 2px 2px 0px;
        box-shadow: -4px 0px 16px 0px rgba(209, 218, 239, 0.51);
        flex: 2;
        overflow: hidden;
        #pieChart {
          width: 100%;
          height: calc(100% - 10px);
        }
      }
    }
  }
  .title {
    font-size: 20px;
    font-family: PingFangSC, PingFangSC-Semibold;
    font-weight: 600;
    text-align: left;
    color: #353535;
    line-height: 28px;
  }
}
</style>
