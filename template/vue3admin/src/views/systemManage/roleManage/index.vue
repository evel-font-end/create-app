<template>
  <div class="flexRow userList">
    <div class="flex treeMain">
      <Tree :leaf="0" @onClick="handleTree" />
    </div>
    <div class="flex setTab">
      <search-form
        @onSearch="getSearchVal"
        :searchItems="data.searchItems"
        :addBtnVisible="true"
        :delBtnVisible="false"
        @on-addBtn="() => handleChange('add', {})"
      />
      <page-table
        ref="pageTable"
        col-align="center"
        operator
        :operatorWidth="120"
        :selection="false"
        :data="data.tableData"
        :cols="data.tableCols"
        :total="data.page.total"
        highlightCurrentRow
        @current-change="onCurrentChange"
        :page-size="data.page.pageSize"
        :page-current="data.page.current"
      >
        <template #operator="scope">
          <div class="footerBtnList flexRow">
            <!-- v-if="$_hasOperation($options.name,'edit')" -->
            <div
              class="iconfont icon-bianji primary"
              style="margin-right: 10px"
              title="编辑角色"
              @click="() => handleChange('edit', scope)"
            ></div>
            <!-- v-if="$_hasOperation($options.name,'addRolePermissions')" -->
            <div
              class="iconfont icon-jiaoseshezhi primary"
              style="margin-right: 10px"
              title="配置角色"
              @click="() => setRoleBtn(scope.row)"
            ></div>
            <div
              class="iconfont icon-jinyong primary"
              style="margin-right: 10px"
              title="禁用"
              v-if="scope.row.enabled"
              @click="() => handlerDisable(scope.row)"
            ></div>
            <div
              class="iconfont icon-qiyong primary"
              style="margin-right: 10px"
              title="启用"
              v-if="!scope.row.enabled"
              @click="() => handlerDisable(scope.row)"
            ></div>
            <div
              class="iconfont icon-shanchu primary"
              style="margin-right: 10px"
              title="删除角色"
              @click="() => deleteRole(scope.row)"
            ></div>
          </div>
        </template>
      </page-table>
    </div>
    <Edit
      :show="data.editshow"
      :dataWatch="data.editdata"
      :siteId="data.siteId"
      @success="onCurrentChange(1)"
      @cancel="closeEdit"
    />
    <!-- 分配角色权限 -->
    <dialog-cont
      width="800px"
      :visible="data.matchJurisdiction"
      title="分配角色权限"
      @on-cancel="data.matchJurisdiction = false"
      @on-close="data.matchJurisdiction = false"
      @on-confirm="subRoleJurisdiction"
    >
      <match-jurisdiction
        class="jurisdiction"
        ref="matchJurisdictionRef"
        :stateType="data.stateType"
        :get-user-info="data.getUserInfo"
        @getRoleJurisdiction="getRoleJurisdiction"
      ></match-jurisdiction>
    </dialog-cont>
  </div>
</template>
<script lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElNotification } from "element-plus";
import Tree from "@/components/tree/tree.vue";
import PageTable from "../../../components/adminPage-table/PageTable.vue";
import searchForm from "../../../components/adminSearchForm/searchForm.vue";
import Edit from "./Edit/index.vue";
import DialogCont from "@/components/dialog/Dialog.vue";
import matchJurisdiction from "./matchJurisdiction.vue";
import { TreeData } from "@/util/constants";
import {
  listRolesByCondition,
  disableRole,
  enableRole,
  addRolePermissions,
  deleteRole,
} from "@/api/role";
export default {
  name: "roleManage",
  components: {
    Tree,
    PageTable,
    searchForm,
    Edit,
    matchJurisdiction,
    DialogCont,
  },
  setup() {
    const data = reactive({
      tableData: [],
      tableCols: [
        {
          label: "角色ID",
          prop: "id",
        },
        {
          label: "角色名称",
          prop: "roleName",
        },
        {
          label: "角色描述",
          prop: "roleDescribe",
        },
        {
          label: "状态",
          prop: "enabledName",
        },
        {
          label: "创建时间",
          prop: "createTime",
        },
      ],
      searchItems: [
        {
          type: "input",
          label: "角色名称",
          props: {
            fieldName: "roleName",
          },
        },
        {
          type: "select",
          label: "角色状态：",
          props: {
            fieldName: "status",
            options: [
              { name: "启用", id: 1 },
              { name: "禁用", id: 0 },
            ],
          },
        },
      ],
      searchVal: {},
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      siteId: 0,
      editdata: {},
      editshow: false,
      matchJurisdiction: false,
      stateType: "edit", // 弹窗的模式
      getUserInfo: {}, // (添加/修改/查看)当前窗口打开的用户信息
    });
    const matchJurisdictionRef = ref<any>(null);
    onMounted(() => {});
    /** 方法 */
    const methods = {
      handleTree(treeData: TreeData) {
        data.siteId = treeData.parentId === 0 ? treeData.id : treeData.parentId;
        methods.getDataAllList();
      },
      // 根据siteId获取列表数据
      getDataAllList() {
        let params = {
          data: {
            siteId: data.siteId,
            ...data.searchVal,
          },
          pageNo: data.page.current,
          pageSize: data.page.pageSize,
        };
        listRolesByCondition(params).then((res: any) => {
          if (res.code === "200") {
            const { data: allData, total } = res.data;
            allData.map((e: any) => {
              if (e.enabled) {
                e.enabledName = "启用";
              } else {
                e.enabledName = "禁用";
              }
            });
            data.tableData = allData;
            data.page.total = total;
          }
        });
      },
      // 分页切换页面
      onCurrentChange(val: any) {
        data.page.current = val;
        methods.getDataAllList();
      },
      getSearchVal(val: any) {
        data.searchVal = {
          ...val,
        };
        methods.onCurrentChange(1);
      },
      // 弹框操作
      handleChange(configType: any, parames: any) {
        data.editdata = { configType, ...parames };
        data.editshow = true;
      },
      // 禁用
      handlerDisable(row: any) {
        if (row && row.id) {
          let data = row.id;
          if (row.enabled) {
            disableRole(data).then((res: any) => {
              if (res.code == "200") {
                ElNotification({
                  title: "成功",
                  message: "角色禁用成功",
                  type: "success",
                  position: "bottom-right",
                });
                methods.onCurrentChange(1);
              }
            });
          } else {
            enableRole(data).then((res: any) => {
              if (res.code == "200") {
                ElNotification({
                  title: "成功",
                  message: "角色启用成功",
                  type: "success",
                  position: "bottom-right",
                });
                methods.onCurrentChange(1);
              }
            });
          }
        } else {
          return false;
        }
      },
      deleteRole(row: any) {
        if (row && row.id) {
          let data = row.id;
          deleteRole(data).then((res: any) => {
            if (res.code == "200") {
              ElNotification({
                title: "成功",
                message: "角色删除成功",
                type: "success",
                position: "bottom-right",
              });
              methods.onCurrentChange(1);
            }
          });
        }
      },
      setRoleBtn(row: any) {
        data.matchJurisdiction = true;
        data.stateType = "edit";
        data.getUserInfo = { id: row.id, index: row.$index, row: row };
      },
      // 分配角色权限弹窗-确定
      subRoleJurisdiction() {
        matchJurisdictionRef.value.getJurisdictionInfo();
      },
      // 获取分配角色权限弹窗 数据
      getRoleJurisdiction(info: any) {
        addRolePermissions({ ...info }).then((res: any) => {
          if (res.code === "200") {
            ElNotification({
              type: "success",
              title: "成功",
              message: "分配角色成功",
              position: "bottom-right",
            });
            data.matchJurisdiction = false;
            data.getUserInfo = {};
          }
        });
      },
      closeEdit() {
        data.editdata = {};
        data.editshow = false;
      },
    };

    return {
      data,
      ...methods,
      matchJurisdictionRef,
    };
  },
};
</script>

<style lang="less" scoped>
.userList {
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
  }
}
</style>
