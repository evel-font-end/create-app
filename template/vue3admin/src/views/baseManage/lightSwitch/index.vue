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
        :otherBtnVisible="true"
        :otherBtnLists="[
          {
            label: '全部打开',
            icon: 'icon-quanbudakai',
            onClick: allOpen,
          },
          {
            label: '全部关闭',
            icon: 'icon-quanbuguanbi',
            onClick: allClose,
          },
        ]"
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
          :total="page.total"
          highlightCurrentRow
          @current-change="onCurrentChange"
          :page-size="page.pageSize"
          :page-current="page.current"
        >
          <template #operator="scope">
            <flex>
              <el-button
                type="text"
                size="small"
                title="开关面板"
                @click.prevent.stop="
                  showView('result', {
                    ...scope.row,
                  })
                "
                v-if="true || $_hasOperation($options.name, 'edit')"
              >
                <i
                  class="iconfont icon-kaiguanmianban"
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
      :bottomShow="true"
      width="1200px"
      :title="dialog.title"
      append-to-body
    >
      <!-- :customClass="'smokerListDialog'" -->
      <div class="dialogContainer">
        <div class="dialogTitle">
          <div class="d-left">
            <div class="d-info">
              <div class="infoT">
                <i class="iconfont icon-jiaoshi"></i>
                <h3>
                  {{ dialog.school }}{{ dialog.gradeName
                  }}{{ dialog.classroom }}
                </h3>
              </div>
              <ul class="lightStatistics">
                <li>
                  <span class="label">照明灯总数</span>
                  <span class="num allNum">{{ classRoomData.length }}</span>
                </li>
                <li>
                  <span class="label">开灯数</span>
                  <span class="num openNum">{{ openData() }}</span>
                </li>
                <li>
                  <span class="label">关灯数</span>
                  <span class="num closeNum">{{ closeData() }}</span>
                </li>
              </ul>
            </div>
            <div class="d-radio">
              <div class="radioMode">
                <label for="">选择模式：</label>
                <el-radio-group v-model="dialogRadio" @change="toggleRadio">
                  <el-radio
                    v-for="(item, index) in radioData"
                    :key="item.modeId"
                    :label="index + 1"
                    >{{ item.modeName }}</el-radio
                  >
                </el-radio-group>
              </div>
              <div class="showText">
                <el-radio-group v-model="radio" @change="handlerIsShow">
                  <el-radio :label="1">隐藏设备名称</el-radio>
                  <el-radio :label="2">显示设备名称</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
          <ul class="d-right">
            <li class="open" @click="handleAllOpen">
              <i class="iconfont icon-quanbukaideng"></i>
              <p>全部开灯</p>
            </li>
            <li class="close" @click="handleAllClose">
              <i class="iconfont icon-quanbuguandeng"></i>
              <p>全部关灯</p>
            </li>
          </ul>
        </div>
        <div class="dialogC">
          <ul class="switchUl">
            <li
              :class="`classRoom${item.locationId}`"
              v-for="item in classRoomData"
              :key="item.locationId"
            >
              <el-progress
                type="dashboard"
                :percentage="Number(item.powerLevel)"
                color="#0080D1"
              >
                <template #default="{ percentage }">
                  <i
                    class="iconfont"
                    :class="
                      item.locationId < 4
                        ? 'icon-heibandeng'
                        : 'icon-jiaoshideng'
                    "
                  ></i>
                </template>
              </el-progress>
              <span v-show="isShowText">{{
                transDeviceName(item.locationId)
              }}</span>
              <p class="percentage onLine">{{ item.powerLevel }}%</p>
              <el-switch
                v-model="item.status"
                :active-value="1"
                :inactive-value="0"
                active-color="#20BECF"
                inactive-color="#3F5CC5"
              />
            </li>
          </ul>
        </div>
      </div>
    </DialogCount>
  </div>
</template>
<script lang="ts">
// import { Options, prop, Vue } from "vue-class-component";
import { Prop, Options, Emit, Vue } from "vue-property-decorator";
import Tree from "../../../components/tree/tree.vue";
import PageTable from "../../../components/adminPage-table/PageTable.vue";
import searchForm from "../../../components/adminSearchForm/searchForm.vue";
import Flex from "../../../components/flex/Flex.vue";
import DialogCount from "../../../components/dialog/Dialog.vue";
import { ElMessage } from "element-plus";
import {
  getClassroomBySiteId,
  getClassLightStatusEcho,
  getLocationStatusByModeId,
  controlDeviceBySiteId,
} from "@/api/basicManage";
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
  radioData: any = [];
  // 教室灯数据
  classRoomData: any = [];
  isShowText: boolean = false;
  // 黑板灯数据
  blackBoardData: any = [
    { name: "黑板灯1", value: false },
    { name: "黑板灯2", value: true },
    { name: "黑板灯3", value: false },
  ];
  dialogRadio: number = 0;
  dialog: any = {
    show: false,
    title: "开关面板",
    school: "",
    gradeName: "",
    classroom: "",
  };
  radio: number = 1;
  siteId: string = "";
  classId: string | number = "";
  searchVal: any = {};
  searchItems: any = [
    {
      type: "input",
      label: "班级名称",
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
  tableData: any = [];
  tableCols: any = [
    { label: "班级", prop: "classroom" },
    { label: "网关ID", prop: "gatewayId" },
    { label: "网关类型", prop: "gatewayType" },
    { label: "网关功率", prop: "gatewayPower" },
    { label: "所属年级", prop: "gradeName" },
    { label: "所在学校", prop: "school" },
  ];
  modeId: any = "";
  handleAllOpen(): void {
    this.classRoomData.map((e: any) => {
      // (this as any).$set(e, "status", true);  好像Vue3中用不了了
      e.status = 1;
    });
  }
  openData() {
    let open = this.classRoomData.filter((e: any) => e.status == 1);
    return open.length;
  }
  closeData() {
    let close = this.classRoomData.filter((e: any) => e.status == 0);
    return close.length;
  }
  handleAllClose(): void {
    this.classRoomData.map((e: any) => {
      e.status = 0;
    });
  }
  // 选择模式
  toggleRadio(val: any): void {
    this.modeId = val;
    this._getLocationStatusByModeId(val);
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
  // 根据不同的模式获取灯光状态
  _getLocationStatusByModeId(modeId: string | number): void {
    getLocationStatusByModeId(modeId).then((res: any) => {
      // console.log(res, "模式");
      if (res.code == "200") {
        let { locationStatus } = res.data;
        this.classRoomData = locationStatus;
      }
    });
  }
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
        this.dialog.school = item.school;
        this.dialog.gradeName = item.gradeName;
        this.dialog.classroom = item.classroom;
        if (item.id) {
          this.classId = item.id;
          this._getClassLightStatusEcho(this.classId);
        } else {
          return false;
        }
        break;
    }
  }
  allOpen() {
    let data = {
      siteId: this.siteId,
      status: 1,
    };
    this._controlDeviceBySiteId(data);
  }
  allClose() {
    let data = {
      siteId: this.siteId,
      status: 0,
    };
    this._controlDeviceBySiteId(data);
  }
  dialogCancel() {
    this.dialog.show = false;
    this.dialogRadio = 0;
    this.isShowText = false;
    this.radio = 1;
    this.classRoomData = [];
    this.radioData = [];
  }
  transDeviceName(val: number) {
    if (val < 4) {
      return `黑板灯${val}`;
    } else {
      return `教室灯${val}`;
    }
  }
  // 根据设备ID控制设备开关
  _controlDeviceBySiteId(data: any) {
    controlDeviceBySiteId(data).then((res: any) => {
      if (res.code == "200") {
        ElMessage.success({
          message: res.message,
          type: "success",
        });
      }
    });
  }
  // 弹框提交
  async dialogSubmit() {
    let data = {
      isClass: 0, //是否是从班级进入：从班级过去传0，其他随意
      locationStatusDtos: this.classRoomData,
      mode: this.modeId, //灯光模式
      siteId: Number(this.classId), //班级ID
    };
    await this._controlDeviceBySiteId(data);
    this.dialog.show = false;
    this.classRoomData = [];
    this.radioData = [];
  }
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
  _getClassLightStatusEcho(id: string | number): void {
    let data = id;
    getClassLightStatusEcho(data).then((res: any) => {
      if (res.code == "200" && res.data.locationStatusDtos && res.data.modeInfos) {
        let { locationStatusDtos, modeInfos } = res.data;
        this.radioData = modeInfos;
        let idx = modeInfos.findIndex((val: any) => {
          return val.modeStatus == 1;
        });
        this.classRoomData = locationStatusDtos;
        let modes = modeInfos.filter((e: any) => e.modeStatus == 1);
        if (modes.length > 0) {
          this.modeId = modes[0].modeId;
        } else {
          this.modeId = "";
        }
        this.dialogRadio = Number(idx) + 1; //确定开启哪个模式
      } else {
        return false
      }
    });
  }
  mounted(): void {}
  created(): void {}
}
</script>
<style lang="less" scoped>
&:deep(.c--flex) {
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
&:deep(.el-radio-group) {
  .el-radio.is-checked {
    margin-right: 8px;
    .el-radio__label {
      color: #365ccf;
    }
  }
  .el-radio {
    margin-right: 8px;
    .el-radio__label {
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 600;
      color: #31353e;
      line-height: 20px;
    }
  }
}
&:deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #365ccf;
  border-color: #d9e0ff;
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
    .d-left {
      .d-info {
        display: flex;
        align-items: center;
        .infoT {
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
        .lightStatistics {
          display: flex;
          align-items: center;
          margin-left: 60px;
          > li {
            margin-right: 30px;
            .label {
              font-size: 16px;
              font-family: PingFangSC, PingFangSC-Regular;
              font-weight: 400;
              color: #353535;
              line-height: 22px;
            }
            .num {
              display: inline-block;
              padding: 0 5px;
              width: 32px;
              height: 20px;
              font-size: 18px;
              font-family: PingFangSC, PingFangSC-Regular;
              font-weight: 400;
              text-align: center;
              color: #ffffff;
              line-height: 20px;
              border-radius: 2px;
              margin-left: 5px;
            }
            .allNum {
              background: #5472dc;
            }
            .openNum {
              background: #4ed8c0;
            }
            .closeNum {
              background: #969eb5;
            }
          }
        }
      }
      .d-radio {
        display: flex;
        align-items: center;
        margin-top: 16px;
        .radioMode {
          margin-right: 30px;
          label {
            font-size: 14px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 600;
            text-align: left;
            color: #31353e;
            line-height: 20px;
          }
        }
        .showText {
          border-left: 2px solid #9c9c9c;
          padding-left: 30px;
        }
      }
    }
    .d-right {
      display: flex;
      align-items: center;
      li {
        padding: 6px 12px;
        text-align: center;
        color: #ffffff;
        margin-left: 10px;
        cursor: pointer;
        i {
          font-size: 20px;
        }
        p {
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Semibold;
          font-weight: 600;
          line-height: 28px;
        }
      }
      .open {
        background: linear-gradient(135deg, #43e0e9, #20becf);
        border-radius: 2px;
        box-shadow: 0px 4px 7px 0px #cbf0f3;
      }
      .close {
        background: linear-gradient(135deg, #7395e4, #3f5cc5);
        border-radius: 2px;
        box-shadow: 0px 4px 7px 0px #deebff;
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
        min-width: 180px;
        height: 40px;
        position: absolute;
        background: url("./images/bg.png") no-repeat center center;
        background-size: 100% 100%;
        padding: 0 6px 0 10px;
        display: flex;
        // grid-template-columns: 20% 64px 36px 20%;
        justify-content: flex-start;
        align-items: center;
        i.iconfont {
          color: #26bad8;
          font-size: 22px;
        }
        .icon-jiaoshideng {
          // margin-right: 8px;
        }
        span {
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Semibold;
          font-weight: 600;
          color: #555555;
          line-height: 20px;
          margin: 0 0 3px 3px;
        }
        &:deep(.el-switch) {
          margin-bottom: 4px;
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
          margin-bottom: 4px;
          margin-right: 3px;
          margin-left: 3px;
        }
        .percentage.onLine {
          background: #b6daff;
        }
        .percentage.fault {
          background: #eaeaea;
        }
      }

      .curtain1 {
        top: 40%;
        left: 18%;
      }
      .curtain2 {
        top: 40%;
        left: 4%;
      }
      .curtain3 {
        top: 40%;
        left: 70%;
      }
      .curtain4 {
        top: 40%;
        left: 83%;
      }
      .classRoom1 {
        top: 33%;
        left: 27%;
      }
      .classRoom2 {
        top: 33%;
        left: 43%;
      }
      .classRoom3 {
        top: 33%;
        left: 59%;
      }
      .classRoom4 {
        top: 22%;
        left: 24%;
      }
      .classRoom5 {
        top: 15%;
        left: 10%;
      }
      .classRoom6 {
        top: 7%;
        left: 4%;
      }
      .classRoom7 {
        top: 22%;
        left: 44%;
      }
      .classRoom8 {
        top: 14%;
        left: 44%;
      }
      .classRoom9 {
        top: 6%;
        left: 44%;
      }
      .classRoom10 {
        top: 22%;
        left: 63%;
      }
      .classRoom11 {
        top: 15%;
        left: 78%;
      }
      .classRoom12 {
        top: 6%;
        left: 83%;
      }
    }
  }
}
</style>
