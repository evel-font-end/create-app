<template>
  <!-- 智能巡检 -->
  <div class="wistomPatrol">
    <div class="treeContainer">
      <Tree @onClick="handleTree" />
    </div>
    <div class="tableContainer">
      <search-form
        @onSearch="getSearchVal"
        :searchItems="searchItems"
        :delBtnVisible="false"
        :addBtnVisible="false"
        :otherBtnVisible="false"
        :otherBtnLists="[]"
      />
      <div class="pageTableWrapper">
        <page-table
          ref="pageTable"
          col-align="center"
          operator
          :operatorWidth="120"
          :selection="false"
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          highlightCurrentRow
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
          <template #operator="scope">
            <flex class="footerBtnList flexRow">
              <el-button
                type="text"
                size="small"
                title="巡检结果"
                @click.prevent.stop="
                  showView('result', {
                    ...scope.row,
                  })
                "
                v-if="true || $_hasOperation($options.name, 'edit')"
              >
                <i
                  class="iconfont icon-xunjianjieguo"
                  style="fontSize: 20px; color: #3F5CC5"
                />
              </el-button>
            </flex>
          </template>
        </page-table>
      </div>
    </div>
    <DialogCount
      @on-cancel="dialogCancel"
      @on-confirm="dialogSubmit"
      :visible.sync="dialog.show"
      :bottomShow="false"
      width="1200px"
      :title="dialog.title"
      append-to-body
    >
      <div class="dialogContainer">
        <div class="dialogTitle">
          <div class="iconTitle">
            <i class="iconfont icon-jiaoshi"></i>
            <h3>{{ dialog.className }}</h3>
          </div>
          <el-radio-group v-model="radio" @change="handlerIsShow">
            <el-radio :label="1">隐藏设备名称</el-radio>
            <el-radio :label="2">显示设备名称</el-radio>
          </el-radio-group>
        </div>
        <div class="dialogC">
          <ul class="switchUl">
            <!-- 黑板灯 -->
            <li
              :class="`blackboard${index + 1}`"
              v-for="(item, index) in blackBoardData"
              :key="index"
            >
              <el-progress
                type="dashboard"
                :percentage="Number(item.powerLevel)"
                color="#0080D1"
              >
                <template #default="{ percentage }">
                  <i
                    class="iconfont icon-heibandeng"
                    :class="item.onlineStatus == 2 ? 'fault' : 'offLine'"
                  ></i>
                </template>
              </el-progress>
              <span
                v-show="isShowText"
                :class="item.onlineStatus == 2 ? 'fault' : 'onLine'"
                >{{ item.deviceTypeText }}{{ item.locationId }}</span
              >
              <p
                class="percentage"
                :class="item.onlineStatus == 2 ? 'fault' : 'onLine'"
              >
                {{ item.powerLevel }}%
              </p>
            </li>
            <!-- 窗帘灯 -->
            <!-- <li
              :class="`curtain${index + 1}`"
              v-for="(item, index) in curtainData"
              :key="index"
            >
              <i
                class="iconfont icon-chuanglian"
                :class="
                  item.onlineStatus == 2
                    ? 'fault'
                    : item.onlineStatus == 3
                    ? 'offLine'
                    : ''
                "
              ></i>
              <span :class="item.onlineStatus == 2 ? 'fault' : ''"
                >{{ item.deviceTypeText }}{{ item.locationId }}</span
              >
            </li> -->
            <!-- 教室灯 -->
            <li
              :class="`classRoom${index + 1}`"
              v-for="(item, index) in classRoomData"
              :key="index"
            >
              <el-progress
                type="dashboard"
                :percentage="Number(item.powerLevel)"
                color="#0080D1"
              >
                <template #default="{ percentage }">
                  <i
                    class="iconfont icon-jiaoshideng"
                    :class="
                      item.onlineStatus == 2
                        ? 'fault'
                        : item.onlineStatus == 3
                        ? 'offLine'
                        : ''
                    "
                  ></i>
                </template>
              </el-progress>
              <span
                v-show="isShowText"
                :class="item.onlineStatus == 2 ? 'fault' : ''"
                >{{ item.deviceTypeText }}{{ item.locationId }}</span
              >
              <p
                class="percentage"
                :class="item.onlineStatus == 2 ? 'fault' : 'onLine'"
              >
                {{ item.powerLevel }}%
              </p>
            </li>
          </ul>
        </div>
        <ul class="labelUl">
          <li>
            <span class="onLine"></span>
            <span class="labelText">在线</span>
          </li>
          <li>
            <span class="breakDown"></span>
            <span class="labelText">故障</span>
          </li>
          <li>
            <span class="offLine"></span>
            <span class="labelText">离线</span>
          </li>
        </ul>
      </div>
    </DialogCount>
  </div>
</template>
<script lang="ts">
import { Options, prop, Vue } from "vue-class-component";
// import { Prop, Component, Emit } from "vue-property-decorator";
import Tree from "../../../components/tree/tree.vue";
import PageTable from "../../../components/adminPage-table/PageTable.vue";
import searchForm from "../../../components/adminSearchForm/searchForm.vue";
import Flex from "../../../components/flex/Flex.vue";
import DialogCount from "../../../components/dialog/Dialog.vue";
import { getClassroomBySiteId, getPatrolInfoBySiteId } from "@/api/basicManage";
@Options({
  components: {
    Tree,
    PageTable,
    searchForm,
    Flex,
    DialogCount,
  },
})
export default class extends Vue {
  tableData: any = [];
  dialog: any = {
    show: false,
    title: "巡检结果",
    className: "",
  };
  isShowText: boolean = false;
  radio: number = 1;
  siteId: string = "";
  form: any = {};
  searchItems: any = [
    {
      type: "input",
      label: "班级、网关",
      props: {
        fieldName: "grade",
        width: "200px",
      },
    },
  ];
  // 分页
  page: any = {
    current: 1,
    pageSize: 10,
    total: 0,
  };
  searchVal: any = {};
  tableCols: any = [
    { label: "班级", prop: "classroom" },
    { label: "网关ID", prop: "gatewayId" },
    { label: "网关类型", prop: "gatewayType" },
    { label: "所属年级", prop: "gradeName" },
    { label: "所在学校", prop: "school" },
  ];
  // 教室灯数据
  classRoomData: any = [];
  // 黑板灯数据
  blackBoardData: any = [];
  // 窗帘电机数据
  // curtainData: any = [];
  getSearchVal(val: any): void {
    this.searchVal = {
      ...val,
    };
    this.onCurrentChange(1);
  }
  showView(type: any, item: any) {
    switch (type) {
      case "result":
        this.dialog.show = true;
        this.dialog.title = "巡检结果";
        this.dialog.className = `${item.school}${item.classroom}`;
        if (item.id) {
          this._getPatrolInfoBySiteId(item.id);
        } else {
          return false;
        }
        break;
    }
  }
  handlerIsShow(val: number) {
    switch (val) {
      case 1:
        this.isShowText = false;
        break;
      case 2:
        this.isShowText = true;
        break;
      default:
        this.isShowText = false;
        break;
    }
  }
  dialogCancel() {
    this.dialog.show = false;
    // this.$refs.formItem.resetForm();
    this.classRoomData = [];
    // 黑板灯数据
    this.blackBoardData = [];
    this.form = {};
    this.isShowText = false;
    this.radio = 1;
  }
  dialogSubmit() {}
  // 分页切换页面
  onCurrentChange(val: any): void {
    this.page.current = val;
    this.getDataAllList();
  }
  onPageSizeChange(val: any): void {
    this.page.pageSize = val;
    this.onCurrentChange(1);
  }
  // 根据tree获取SiteId
  handleTree(data: any): void {
    if (data.hasOwnProperty("id")) {
      this.siteId = data.id;
      this.getDataAllList();
    }
  }
  // 根据siteId获取列表数据
  getDataAllList(): void {
    let params = {
      data: {
        siteId: this.siteId,
        ...this.searchVal,
      },
      pageNo: this.page.current,
      pageSize: this.page.pageSize,
    };
    getClassroomBySiteId(params).then((res: any) => {
      if (res.code === "200") {
        const { data, total } = res.data;
        this.tableData = data;
        this.page.total = total;
      }
    });
  }
  // 获取巡检结果
  _getPatrolInfoBySiteId(id: string): void {
    getPatrolInfoBySiteId(id).then((res: any) => {
      if (res.code == "200") {
        let { data } = res;
        data.map((e: any) => {
          if (e.deviceType == 1) {
            this.classRoomData.push(e);
          } else if (e.deviceType == 2) {
            this.blackBoardData.push(e);
          }
        });
      }
    });
  }
  mounted(): void {}
  created(): void {}
}
</script>
<style lang="less" scoped>
&:deep(.flexRow) {
  justify-content: flex-start !important;
}
&:deep(.el-progress-circle) {
  width: 28px !important;
  height: 30px !important;
}
&:deep(.el-progress__text) {
  text-align: left;
  padding-left: 3px;
}
&:deep(.el-radio__input.is-checked .el-radio__inner) {
  background: #365ccf;
  border-color: #365ccf;
}
&:deep(.el-radio__input.is-checked + .el-radio__label) {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Semibold;
  font-weight: 600;
  color: #365ccf;
}
&:deep(.el-radio__label) {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #31353e;
}
&:deep(.el-radio) {
  margin-right: 10px;
}
.wistomPatrol {
  width: 100%;
  height: 100%;
  display: flex;
  .treeContainer {
    width: 300px;
    overflow: auto;
    border-right: 1px solid #e6eafe;
  }
  .treeContainer::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 2px; /*高宽分别对应横竖滚动条的尺寸*/
    padding-right: 2px;
  }
  .treeContainer::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 2px;
    background: #d5daeb;
  }
  .treeContainer::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    background: #fff;
  }
  .tableContainer {
    width: calc(100% - 300px);
    padding: 0 12px;
  }
}
.dialogContainer {
  .dialogTitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .iconTitle {
      display: flex;
      align-items: center;
      .iconfont {
        display: inline-block;
        width: 28px;
        height: 28px;
        background: linear-gradient(135deg, #50a4ef, #5478fa, #3f5cc5);
        border-radius: 3px;
        box-shadow: 0px 2px 4px 0px rgba(150, 191, 233, 0.5);
        font-size: 20px;
        color: #ffffff;
        text-align: center;
        line-height: 28px;
        margin-right: 10px;
      }
      h3 {
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Semibold;
        font-weight: 600;
        text-align: left;
        color: #353535;
        line-height: 25px;
      }
    }
  }
  .dialogC {
    position: relative;
    width: 100%;
    height: 500px;
    background: url("./images/class_room.png") no-repeat center center;
    background-size: 100% 100%;
    .switchUl {
      li {
        min-width: 120px;
        height: 40px;
        position: absolute;
        background: url("../../../common/images/switchIcon.png") no-repeat
          center center;
        background-size: 100% 100%;
        padding: 0 6px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        i.iconfont {
          color: #26bad8;
          font-size: 22px;
          // margin-left: 7px;
        }
        // 故障
        i.fault {
          color: #ff7a40;
        }
        i.offLine {
          color: #26bad8;
        }
        span {
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Semibold;
          font-weight: 600;
          color: #555555;
          line-height: 20px;
        }
        span.fault {
          color: #e45208;
        }
        .percentage {
          min-width: 30px;
          height: 16px;
          line-height: 10px;
          padding: 3px 6px;
          text-align: center;
          border-radius: 9px;
          font-size: 14px;
          font-family: DINAlternate-Bold;
          font-weight: 700;
          color: #003870;
          margin-bottom: 2px;
        }
        .percentage.onLine {
          background: #b6daff;
        }
        .percentage.fault {
          background: #eaeaea;
        }
      }
      .blackboard1 {
        top: 33%;
        left: 32%;
      }
      .blackboard2 {
        top: 33%;
        left: 44%;
      }
      .blackboard3 {
        top: 33%;
        left: 56%;
      }

      .curtain1 {
        top: 40%;
        left: 18%;
      }
      .curtain2 {
        top: 40%;
        left: 71%;
      }
      .curtain3 {
        top: 40%;
        left: 5%;
      }
      .curtain4 {
        top: 40%;
        left: 83%;
      }
      .classRoom1 {
        top: 22%;
        left: 24%;
      }
      .classRoom2 {
        top: 22%;
        left: 44%;
      }
      .classRoom3 {
        top: 22%;
        left: 63%;
      }
      .classRoom4 {
        top: 14%;
        left: 12%;
      }
      .classRoom5 {
        top: 14%;
        left: 44%;
      }
      .classRoom6 {
        top: 15%;
        left: 78%;
      }
      .classRoom7 {
        top: 6%;
        left: 3%;
      }
      .classRoom8 {
        top: 6%;
        left: 44%;
      }
      .classRoom9 {
        top: 6%;
        left: 85%;
      }
    }
  }
  .labelUl {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    li {
      margin-right: 14px;
      .labelText {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #555555;
        line-height: 20px;
        margin-left: 4px;
      }
      .onLine {
        display: inline-block;
        width: 14px;
        height: 14px;
        background: linear-gradient(180deg, #56dbb0 5%, #26bad8 99%);
        border-radius: 2px;
        box-shadow: 0px 3px 4px 0px rgba(157, 233, 227, 0.73);
      }
      .breakDown {
        display: inline-block;
        width: 14px;
        height: 14px;
        background: linear-gradient(180deg, #ff7a40, #e45208 99%);
        border-radius: 2px;
        box-shadow: 0px 3px 4px 0px rgba(255, 239, 233, 0.73);
      }
      .offLine {
        display: inline-block;
        width: 14px;
        height: 14px;
        background: linear-gradient(180deg, #c9cfd3 2%, #727a87 98%);
        border-radius: 2px;
        box-shadow: 0px 3px 4px 0px rgba(202, 226, 255, 0.73);
      }
    }
  }
}
</style>
