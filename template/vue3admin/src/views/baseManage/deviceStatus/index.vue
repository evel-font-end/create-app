<template>
  <!-- 智能设备状态 -->
  <div class="wistomPatrol">
    <div class="treeContainer">
      <Tree @onClick="handleTree" />
    </div>
    <div class="tableContainer">
      <div class="switchBox">
        <label for="">全部智能灯光</label>
        <el-switch
          v-model="value"
          active-color="#20BECF"
          inactive-color="#3F5CC5"
          active-text="开"
          inactive-text="关"
          @change="switchChange"
        ></el-switch>
      </div>
      <div class="container">
        <div class="c-title">
          <h3 v-if="treeData[0] && treeData[0].level == 0">
            {{ treeData[0].name }}
          </h3>
          <i class="t-img" v-if="treeData[1] && treeData[1].level == 1">
            <img src="./images/t_icon.png" alt="" />
          </i>
          <h3 v-if="treeData[1] && treeData[1].level == 1">
            {{ treeData[1].name }}
          </h3>
        </div>
        <div class="c-content">
          <div class="list" v-for="(item, index) in listData" :key="index">
            <div class="list-t">
              <ul class="t-ul">
                <li class="icon">
                  <i class="iconfont icon-jiaoshi"></i>
                </li>
                <li class="info">
                  <div class="info-bg">
                    {{ item.siteName }}
                  </div>
                  <div class="line-box">
                    <p>信号强度</p>
                    <div
                      class="line"
                      :class="
                        item.signal == '低'
                          ? 'lowLine'
                          : item.signal == '中'
                          ? 'middleLine'
                          : 'hightLine'
                      "
                    >
                      <div
                        class="point"
                        :class="
                          item.signal == '低'
                            ? 'lowPoint'
                            : item.signal == '中'
                            ? 'middlePoint'
                            : 'hightPoint'
                        "
                      ></div>
                    </div>
                    <p class="lineText">{{ item.signal }}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="list-b">
              <div>
                <p>
                  <i class="iconImg">
                    <img src="./images/d.png" alt="" />
                  </i>
                  <span>电压</span>
                </p>
                <p>{{ item.voltage }}V</p>
              </div>
              <div>
                <p>
                  <i class="iconImg">
                    <img src="./images/g.png" alt="" />
                  </i>
                  <span>功率</span>
                </p>
                <p>{{ item.power }}W</p>
              </div>
              <div>
                <p>
                  <i class="iconImg">
                    <img src="./images/z.png" alt="" />
                  </i>
                  <span>自动状态</span>
                </p>
                <!-- <p
                  :class="item.autoStatus == '1' ? 'openStatus' : 'closeStatus'"
                >
                  {{ item.status | statusFilter }}
                </p> -->
                <p v-if="item.autoStatus == '1'" class="openStatus">打开</p>
                <p v-else class="closeStatus">关闭</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// import { Options, Vue } from "vue-class-component";
import { Prop, Options, Emit, Vue } from "vue-property-decorator";
import Tree from "../../../components/tree/tree.vue";
import { ElMessage } from "element-plus";
import {
  listGatewayInfo,
  controlDeviceBySiteId,
  getSwitchStatusBySiteId,
} from "@/api/basicManage";
@Options({
  components: {
    Tree,
  },
})
export default class extends Vue {
  value: boolean = true;
  listData: any = [];
  siteId: string = "";
  treeData: any = [];
  handleTree(data: any) {
    if (data.level == 0) {
      this.treeData.splice(0, 1, data);
      this.treeData.splice(1, 0, data);
    } else if (data.level == 1) {
      this.treeData.splice(1, 1, data);
    }
    if (data.hasOwnProperty("id")) {
      this.siteId = data.id;
      this.getDataAllList();
      this._getSwitchStatusBySiteId();
    } else {
      return false;
    }
  }
  getDataAllList(): void {
    let data = this.siteId;
    listGatewayInfo(data).then((res: any) => {
      if (res.code == "200") {
        let { data } = res;
        this.listData = data;
      }
    });
  }
  // 获取当前siteId的开关状态
  _getSwitchStatusBySiteId(): void {
    let data = this.siteId;
    getSwitchStatusBySiteId(data).then((res: any) => {
      if (res.code == "200") {
        let { data } = res;
        this.value = data == 0 ? false : true;
      }
    });
  }
  // 开关控制
  switchChange(val: boolean): void {
    let data: any = {
      // isClass: 1, //是否是从班级进入：从班级过去传0，其他随意
      mode: "", //灯光模式
      siteId: this.siteId, //班级ID
    };
    if (val) {
      // 开关开
      data.status = 1;
      this._controlDeviceBySiteId(data);
    } else {
      data.status = 0;
      this._controlDeviceBySiteId(data);
    }
  }
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
  mounted(): void {}
  created(): void {}
}
</script>
<style lang="less">
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
    padding: 0 15px;
    .switchBox {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 50px;
      border-bottom: 1px solid #dfdfdf;
      label {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #353535;
        margin-right: 15px;
      }
    }
    .container {
      .c-title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        line-height: 52px;
        h3 {
          font-size: 16px;
          font-family: PingFangSC, PingFangSC-Semibold;
          font-weight: 600;
          color: #353535;
        }
        .t-img {
          display: inline-block;
          margin-left: 14px;
          margin-right: 4px;
          img {
            max-width: 80%;
          }
        }
      }
      .c-content {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        .list {
          width: calc(100% / 5 - 15px);
          height: 182px;
          background: #ffffff;
          border-radius: 2px;
          box-shadow: 0px 2px 6px 0px #dce6ff;
          margin-bottom: 15px;
          margin-right: 15px;
          .list-t {
            height: 76px;
            background: url("./images/bg.png") no-repeat center center;
            background-size: 100% 100%;
            .t-ul {
              display: flex;
              justify-content: space-around;
              align-items: center;
              height: 100%;
              .icon {
                width: 42px;
                height: 42px;
                background: linear-gradient(315deg, #2594ff, #217bf4);
                border-radius: 6px;
                box-shadow: 0px 5px 16px 0px rgba(22, 28, 73, 0.49);
                text-align: center;
                .iconfont {
                  font-size: 28px;
                  color: #ffffff;
                  line-height: 42px;
                }
              }
              .info {
                .info-bg {
                  font-size: 16px;
                  font-family: PingFangSC, PingFangSC-Semibold;
                  font-weight: 600;
                  text-align: left;
                  color: #ffffff;
                  line-height: 20px;
                  text-shadow: 0px 2px 4px 0px #798099;
                  // min-width: 54px;
                  height: 20px;
                  background: url("./images/t_bg.png") no-repeat center center;
                  background-size: 100% 100%;
                  padding: 0 10px;
                }
                p {
                  font-size: 14px;
                  font-family: PingFangSC, PingFangSC-Regular;
                  font-weight: 400;
                  text-align: left;
                  color: #ffffff;
                  line-height: 22px;
                }
                .line-box {
                  display: flex;
                  align-items: center;
                  margin-top: 3px;
                  .line {
                    position: relative;
                    width: 75px;
                    height: 6px;
                    border-radius: 4px;
                    border: 1px solid rgba(255, 255, 255, 0.89);
                    margin-left: 8px;
                  }
                  .point {
                    position: absolute;
                    top: -3px;
                    width: 10px;
                    height: 10px;
                    border: 2px solid #ffffff;
                    box-shadow: 0px 2px 4px 0px rgba(13, 20, 36, 0.5);
                    border-radius: 50%;
                  }
                  .lineText {
                    font-size: 14px;
                    font-family: PingFangSC, PingFangSC-Regular;
                    font-weight: 400;
                    color: #ffffff;
                    line-height: 18px;
                    margin-left: 10px;
                  }
                  // 低
                  .lowLine {
                    background: #55b2ff;
                  }
                  .lowPoint {
                    left: 0;
                    background: #55b2ff;
                  }
                  // 中
                  .middleLine {
                    background: #ffbc1c;
                  }
                  .middlePoint {
                    left: 50%;
                    background: #ffbc1c;
                  }
                  // 高
                  .hightLine {
                    background: #ffa255;
                  }
                  .hightPoint {
                    right: 0;
                    background: #ffa255;
                  }
                }
              }
            }
          }
          .list-b {
            height: calc(100% - 76px);
            padding: 15px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            div {
              display: flex;
              justify-content: space-between;
              align-items: center;
              p {
                font-size: 14px;
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                color: #353535;
                line-height: 18px;
                .iconImg {
                  display: inline-block;
                  width: 19px;
                  height: 17px;
                  margin-right: 8px;
                  img {
                    max-width: 100%;
                  }
                }
              }
              .openStatus {
                background: #20becf;
                border-radius: 2px;
                padding: 2px 7px;
                color: #ffffff;
              }
              .closeStatus {
                background: #2591fe;
                border-radius: 2px;
                padding: 2px 7px;
                color: #ffffff;
              }
            }
          }
          &:nth-child(5n) {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
