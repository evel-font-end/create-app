<template>
  <div class="flexRow tacticsSet">
    <div class="flex treeMain">
      <Tree
        @onClick="handleTree"
      />
    </div>
    <div class="flex setTab">
      <search-form
        @onSearch="getSearchVal"
        :searchItems="searchItems"
        :addBtnVisible="true"
        @on-addBtn="() => handleAddTactics()"
        :otherBtnVisible="true"
        :otherBtnLists="[
          {
            label: '下载EXCEL模板',
            icon: 'icon-xiazaiexcel',
            onClick: () => handleClick('get'),
          },
          {
            label: '导入EXCEL模板',
            icon: 'icon-daoruexcel',
            onClick: () => handleClick('import'),
          },
        ]"
      />
      <page-table
        ref="pageTable"
        col-align="center"
        operator
        :operatorWidth="120"
        :selection="false"
        :data="obj.tableData" 
        :cols="tableCols"
        :showPage="false"
        :page-size="obj.page.pageSize"
        :page-current="obj.page.current"
      >
        <template #operator="scope">
          <div class="footerBtnList flexRow">
            <div
              class="iconfont icon-bianji primary"
              style="margin-right: 10px"
              @click="() => handleChange(scope, 'edit')"
            ></div>
            <div
            class="iconfont icon-shanchu error"
              @click="() => handleChange(scope, 'delete')"
            ></div>
          </div>
        </template>
      </page-table>
    </div>
    <PlacesForm
      :title="obj.dialogTitle"
      :show="obj.setFormShow"
      :item="obj.dialogItem"
      :dialogType="obj.dialogType"
      @cancel="placeCancel"
      :type="obj.activeTab"
    />
    <ImportTemp
      :title="'导入模板'"
      :show="obj.importShow"
      @cancel="importCancel"
    />
  </div>
</template>
<script lang="ts">
import { reactive } from "vue";
 import { ElNotification } from 'element-plus';
import Tree from '@/components/tree/tree.vue';
import PageTable from "@/components/adminPage-table";
import searchForm from "@/components/adminSearchForm/searchForm.vue";
import PlacesForm from './components/placesForm.vue';
import ImportTemp from './components/importTemp.vue';
import { TreeData } from '@/util/constants';
import { download } from '@/util/util';
import {
  getIntelligentPlace,
  deleteIntelligentPlace,
  getTemp
} from '@/api/systemManage';
export default {
  components: {
    Tree,
    PageTable,
    searchForm,
    PlacesForm,
    ImportTemp
  },
  setup() {
    let obj = reactive({
      dialogTitle: '新增场所',
      activeTab: 'defaultSet',
      setFormShow: false,
      dialogItem: {},
      dialogType: 'edit',
      siteId: 0,
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      importShow: false
    });
    const tableCols = reactive([
      {
        label: "班级",
        prop: "classroom",
      },
      {
        label: "网关类型",
        prop: "gatewayTypeText",
      },
      {
        label: "网关编号",
        prop: "gatewayId",
      },
      {
        label: "所属年级",
        prop: "gradeName",
      },
      {
        label: "所在学校",
        prop: "schoolName",
      },
      {
        label: "黑板灯数量",
        prop: "boardLight",
      },
      {
        label: "教室灯数量",
        prop: "classroomLight",
      }
    ]);

    const searchItems = reactive([
    {
      type: "input",
      label: "班级",
      props: {
        fieldName: "className",
      },
    }, {
      type: "input",
      label: "网关ID",
      props: {
        fieldName: "gatewayId",
      },
    }]);
    let defaultSearchVal: { className?: string, gatewayId?: string } = reactive({
      className: '',
      gatewayId: ''
    });
    /** 方法 */
    const handleTree = (treeData: TreeData) => {
      obj.siteId = treeData.id;
      getList();
    }
    const getList = () => {
      let params = {
        data: {
          siteId: obj.siteId,
          ...defaultSearchVal
        },
        pageNo: obj.page.current,
        pageSize: obj.page.pageSize,
      };
      getIntelligentPlace(params).then((res: any) => {
        if (res.code === '200') {
          obj.tableData = res.data.data;
          obj.page.total = res.data.total;
        }
      })
    }
    const handleClick = (type: string) => {
      if (type === 'get') {
        getTemp().then((res: any) => {
          let blob = new Blob([res.data]);
          let url = window.URL.createObjectURL(blob);
          download(url, '智能场所excel模板.xlsx');
        })
      } else {
        obj.importShow = true; 
      }
    }
    const getSearchVal = (val: any) => {
      defaultSearchVal = val;
      getList();
    }
    const handleChange = (scope: any, type: 'edit' | 'edtail' | 'delete') => {
      if (type === 'delete') {
        deleteIntelligentPlace(scope.row.id).then((res: any) => {
          if (res && res.code === '200') {
            ElNotification({
              title: '成功',
              message: '场所删除成功',
              type: 'success',
              position: 'bottom-right'
            });
            getList();
          }
        })
      } else {
        obj.dialogTitle = '修改场所';
        obj.setFormShow = true;
        obj.dialogType = type;
        obj.dialogItem = scope.row;
      }
    }

    const handleAddTactics = () => {
      obj.dialogTitle = '新增场所';
      obj.setFormShow = true;
      obj.dialogItem = {};
      obj.dialogType = 'add';
    }

    const placeCancel = (type: string) => {
      type === 'cancel' && getList()
      obj.setFormShow = false
      obj.dialogItem = {};
    }

    const importCancel = () => {
      obj.importShow = false;
    }
    return{
      obj,
      tableCols,
      searchItems,
      handleTree,
      placeCancel,
      handleClick,
      getSearchVal,
      handleChange,
      handleAddTactics,
      importCancel
    }
  }
}
</script>

<style lang="less" scoped>
.tacticsSet{
  height: 100%;
  .treeMain{
    width: 300px;
    border-right: 1px solid #e6eafe;/*no*/
    .tree{
      height: 100%;
    }
  }
  .setTab{
    width: 0;
    flex: 1;
    padding: 15px;/*no*/
    .setList{
      margin-top: 15px;/*no*/
    }
    .defaultSet{
      .footerBtnList{
        .iconfont{
          cursor: pointer;
        }
      }
    }
  }
}
</style>
