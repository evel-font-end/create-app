<template>
  <div class="flexRow tacticsSet">
    <div class="flex treeMain">
      <Tree @onClick="handleTree" />
    </div>
    <el-scrollbar class="flex setTab">
      <el-tabs v-model="obj.activeTab" @tab-click="handleClick">
        <el-tab-pane label="设置主页" name="allSet" class="flexColumn allSet">
          <el-button type="primary" @click="handleSetAll">
            <i class="iconfont icon-piliangshezhi" />批量设置
          </el-button>
          <div class="setList">
            <page-table
              ref="pageTable"
              col-align="center"
              operator
              :operatorWidth="120"
              :selection="true"
              :data="obj.tableData"
              :cols="tableCols"
              :total="obj.page.total"
              @selection-change="onSelectionChange"
              @selectAll="selectAll"
              @current-change="onCurrentChange"
              :page-size="obj.page.pageSize"
              :page-current="obj.page.current"
            >
              <template #operator="scope">
                <div
                  class="iconfont icon-shezhizhaomingcelve"
                  style="fontSize: 20px; color: #3F5CC5"
                  @click="() => handleChange(scope)"
                ></div>
              </template>
            </page-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="通用策略管理" name="defaultSet" class="defaultSet">
          <search-form
            @onSearch="getSearchVal"
            :searchItems="searchItems"
            :addBtnVisible="true"
            @on-addBtn="() => handleAddTactics()"
          />
          <page-table
            ref="pageTable"
            col-align="center"
            operator
            :operatorWidth="120"
            :selection="false"
            :data="obj.defaultTableData"
            :cols="defaultTableCols"
            :showPage="false"
          >
            <template #operator="scope">
              <div class="footerBtnList flexRow">
                <div
                  class="iconfont icon-bianji"
                  style="margin-right: 10px;color: #3F5CC5"
                  @click="() => handleChange(scope, 'edit')"
                  title="编辑"
                ></div>
                <div
                  class="iconfont icon-xiangqing"
                  style="margin-right: 10px; color: #3F5CC5"
                  @click="() => handleChange(scope, 'detail')"
                  title="查看"
                ></div>
                <div
                  class="iconfont icon-shanchu"
                  style="color: #F68156"
                  @click="() => handleChange(scope, 'delete')"
                  title="删除"
                ></div>
              </div>
            </template>
          </page-table>
        </el-tab-pane>
      </el-tabs>
    </el-scrollbar>
    <SetLightTactics
      :title="obj.dialogTitle"
      :show="obj.setLightStatusShow"
      :item="obj.dialogItem"
      :dialogType="obj.dialogType"
      @cancel="lightTacticsCancel"
      :type="obj.activeTab"
    />
    <SetAllTactics
      :title="'批量设置照明策略'"
      :show="obj.setAllStatusShow"
      :item="obj.dialogItem"
      @cancel="lightAllCancel"
    />
  </div>
</template>
<script lang="ts">
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { ElNotification } from "element-plus";
import Tree from "@/components/tree/tree.vue";
import PageTable from "@/components/adminPage-table";
import searchForm from "@/components/adminSearchForm/searchForm.vue";
import SetLightTactics from "./components/setLightTactics.vue";
import SetAllTactics from "./components/setAllTactics.vue";
import { TreeData } from "@/util/constants";
import { transformTimestamp } from "@/util/util";
import {
  getClassRoomList,
  getLightPolicy,
  deleteLightPolicy,
} from "@/api/systemManage";
export default {
  components: {
    Tree,
    PageTable,
    searchForm,
    SetLightTactics,
    SetAllTactics,
  },
  setup() {
    let obj = reactive({
      dialogTitle: "设置照明策略",
      activeTab: "allSet",
      setLightStatusShow: false,
      setAllStatusShow: false,
      dialogItem: {},
      dialogType: "edit",
      siteId: 0,
      siteParentId: 0,
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      selectList: [],
      defaultTableData: [],
      tableData: [],
    });
    const tableCols = reactive([
      {
        label: "班级",
        prop: "classroom",
      },
      {
        label: "网关ID号",
        prop: "gatewayId",
      },
      {
        label: "网关类型",
        prop: "gatewayType",
      },
      {
        label: "所属年级",
        prop: "grade",
      },
      {
        label: "所在学校",
        prop: "school",
      },
    ]);

    const searchItems = reactive([
      {
        type: "input",
        label: "名称",
        props: {
          fieldName: "name",
        },
      },
    ]);
    let defaultSearchVal: { name?: string } = reactive({
      name: "",
    });
    const defaultTableCols = reactive([
      {
        label: "通用策略名称",
        prop: "lightName",
      },
      {
        label: "创建时间",
        prop: "createTimeText",
      },
      {
        label: "修改时间",
        prop: "updateTimeText",
      },
    ]);
    onMounted(() => {});
    /** 方法 */
    const handleTree = (treeData: TreeData) => {
      obj.siteParentId =
        treeData.parentId === 0 ? treeData.id : treeData.parentId;
      obj.siteId = treeData.id;
      getList();
      getDefaultList();
    };
    const getList = () => {
      let params = {
        data: {
          siteId: obj.siteId,
        },
        pageNo: obj.page.current,
        pageSize: obj.page.pageSize,
      };
      getClassRoomList(params).then((res: any) => {
        if (res.code === "200") {
          obj.tableData = res.data.data;
          obj.page.total = res.data.total;
        }
      });
    };
    const onCurrentChange = (val: number) => {
      obj.page.current = val;
      getList();
    };
    const getDefaultList = () => {
      let params = {
        siteId: obj.siteParentId,
        name: defaultSearchVal.name,
      };
      getLightPolicy(params).then((res: any) => {
        if (res && res.code === "200") {
          res.data.map((e: any) => {
            if (e.createTime) {
              e.createTimeText = transformTimestamp(e.createTime);
            }
            if (e.updateTime) {
              e.updateTimeText = transformTimestamp(e.updateTime);
            }
          });
          obj.defaultTableData = res.data;
        }
      });
    };
    const onSelectionChange = (list: any) => {
      obj.selectList = list.map((ls: any) => ls.id);
    };
    const selectAll = () => {};
    const handleSetAll = () => {
      if (obj.selectList.length > 0) {
        obj.setAllStatusShow = true;
        obj.dialogItem = {
          ids: obj.selectList,
          siteId: obj.siteId,
          lightItems: obj.defaultTableData,
        };
      } else {
        ElNotification({
          title: "失败",
          message: "请勾选所需要修改的班级",
          type: "error",
          position: "bottom-right",
        });
      }
    };
    const handleClick = () => {};
    const getSearchVal = (val: any) => {
      defaultSearchVal = val;
      getDefaultList();
    };
    const handleChange = (scope: any, type: "edit" | "detail" | "delete") => {
      if (type === "delete") {
        deleteLightPolicy(scope.row.id).then((res: any) => {
          if (res && res.code === "200") {
            lightTacticsCancel("cancel");
            ElNotification({
              title: "成功",
              message: "策略删除成功",
              type: "success",
              position: "bottom-right",
            });
          }
        });
      } else {
        /* obj.dialogTitle =
          obj.activeTab === "allSet" ? "设置照明策略" : "修改通用照明策略"; */
        obj.dialogTitle =
          type === "edit" ? "修改通用照明策略" : "查看通用照明策略";
        obj.setLightStatusShow = true;
        obj.dialogType = type;
        obj.dialogItem = scope.row;
      }
    };

    const handleAddTactics = () => {
      obj.dialogTitle = "新增通用照明策略";
      obj.setLightStatusShow = true;
      obj.dialogItem = {
        siteId: obj.siteParentId,
      };
      obj.dialogType = "add";
    };

    const lightTacticsCancel = (type: string) => {
      type === "cancel" && getDefaultList();
      type === "allSetCancel" && getList();
      obj.dialogItem = {};
      obj.setLightStatusShow = false;
    };
    const lightAllCancel = (type: string) => {
      type === "cancel" && getList();
      obj.dialogItem = {};
      obj.setAllStatusShow = false;
    };
    return {
      obj,
      tableCols,
      searchItems,
      defaultTableCols,
      handleTree,
      onCurrentChange,
      onSelectionChange,
      selectAll,
      handleSetAll,
      handleClick,
      getSearchVal,
      handleChange,
      handleAddTactics,
      lightTacticsCancel,
      lightAllCancel,
    };
  },
};
</script>

<style lang="less" scoped>
.tacticsSet {
  height: 100%;
  .treeMain {
    width: 300px;
    border-right: 1px solid #e6eafe; /*no*/
    .tree {
      height: 100%;
    }
  }
  .setTab {
    width: 0;
    flex: 1;
    padding: 15px; /*no*/
    .allSet {
      &:deep(.el-button) {
        width: fit-content;
      }
    }
    .setList {
      margin-top: 15px; /*no*/
    }
    .defaultSet {
      .footerBtnList {
        .iconfont {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
