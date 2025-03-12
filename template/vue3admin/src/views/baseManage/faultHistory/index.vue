<template>
  <div class="faultHistory">
    <search-form @onSearch="getSearchVal" :searchItems="searchItems" />
    <page-table
      ref="pageTable"
      col-align="center"
      operator
      :operatorWidth="120"
      :selection="true"
      :data="obj.tableData"
      :cols="obj.tableCols"
      :page-current="obj.page.current"
      :total="obj.page.total"
      :page-size="obj.page.pageSize"
      @current-change="onCurrentChange"
      :showPage="true"
      @selection-change="onSelectionChange"
      @selectAll="selectAll"
    >
      <template #operator="scope">
        <div class="footerBtnList flexRow">
          <div
            class="iconfont icon-bianji primary"
            style="margin-right: 10px"
            title="维修处理记录"
            @click="() => handleChange(scope, 'edit')"
          ></div>
        </div>
      </template>
    </page-table>
    <History
      :title="obj.dialogTitle"
      :show="obj.historyShow"
      :item="obj.dialogItem"
      @cancel="handleDialogCancel"
    />
  </div>
</template>
<script lang="ts">
import { ref, reactive, onMounted, getCurrentInstance, h } from "vue";
import PageTable from "@/components/adminPage-table";
import searchForm from "@/components/adminSearchForm/searchForm.vue";
import History from "./components/history.vue";
import { getQueryFault } from "@/api/breakDown";
export default {
  components: {
    PageTable,
    searchForm,
    History,
  },
  setup() {
    // 最好把所有数据全写在一个reactive中
    let obj = reactive({
      dialogTitle: "维修处理记录",
      historyShow: false,
      dialogItem: {},
      tableData: [], //写在对象里，可以生成页面
      searchVal: {},
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tableCols: [
        {
          label: "班级",
          prop: "name",
        },
        {
          label: "所属年级",
          prop: "grade",
        },
        {
          label: "所在学校",
          prop: "schoolName",
        },
        {
          label: "故障类型",
          prop: "alarmTypeName",
          /* render: (h: any, scope: any) => {
            console.log(scope, "444");
            switch (scope.row.alarmType) {
              case 1:
                return "电源故障";
                break;

              case 2:
                return "网络故障";
                break;

              case 3:
                return "电缆故障";
                break;

              case 4:
                return "其他故障";
                break;
            }
          }, */
        },
        {
          label: "故障时间",
          prop: "alarmTime",
        },
      ],
    });
    // let tableData = reactive([]);  //单独写，虽然数据拿到了，但是页面不能生成
    const searchItems = reactive([
      {
        type: "input",
        label: "班级",
        props: {
          fieldName: "className",
        },
      },
    ]);
    /** 方法 */
    const onSelectionChange = () => {};
    const onCurrentChange = (val: number) => {
      obj.page.current = val;
      getDataAllList();
    };
    const selectAll = () => {};
    const handleClick = () => {};
    const getSearchVal = (val: any) => {
      obj.searchVal = {
        ...val,
      };
      onCurrentChange(1);
    };

    // 查询故障信息
    const getDataAllList = () => {
      let params = {
        data: {
          siteId: "0",
          ...obj.searchVal,
        },
        pageNo: obj.page.current,
        pageSize: obj.page.pageSize,
      };
      getQueryFault(params).then((res: any) => {
        if (res.code === "200") {
          const { data, total } = res.data;
          data.map((e: any) => {
            // 新增一个alarmTypeName字段
            switch (e.alarmType) {
              case "1":
                return (e.alarmTypeName = "电源故障");
                break;
              case "2":
                return (e.alarmTypeName = "网络故障");
                break;
              case "3":
                return (e.alarmTypeName = "电缆故障");
                break;
              case "4":
                return (e.alarmTypeName = "其他故障");
            }
          });
          obj.tableData = data;
          obj.page.total = total;
        }
      });
    };
    onMounted(() => {
      getDataAllList();
    });
    const handleChange = (scope: any) => {
      obj.dialogTitle = "维修处理记录";
      obj.historyShow = true;
      obj.dialogItem = {
        ...scope.row
      };
    };
    const handleDialogCancel = (type: string) => {
      type === 'cancel' && getDataAllList();
      obj.historyShow = false;
    }
    return {
      obj,
      searchItems,
      onSelectionChange,
      onCurrentChange,
      selectAll,
      handleClick,
      getSearchVal,
      handleChange,
      getDataAllList,
      handleDialogCancel
    };
  },
};
</script>

<style lang="less" scoped>
.faultHistory {
  padding: 0 14px; /*no*/
}
</style>
