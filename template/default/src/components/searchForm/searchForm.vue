<template>
  <div id="searchForm">
    <el-form
      class="searchFrom"
      :label-width="labelWidth"
      :model="formData"
      ref="formRef"
    >
      <div style="width: 100%; overflow: hidden">
        <div class="searchItem">
          <template v-for="(item, index) in searchItem" :span="item.span || 6">
            <el-form-item
              :key="`formItem${newKeys[index + 1]}`"
              class="form-group"
              :label="`${item.label}${
                item.label.indexOf('：') > -1 ? '' : '：'
              }`"
              :label-width="`${
                !item.label ? '0px' : item.labelWidth || labelWidth
              }`"
              :prop="item.props.fieldName"
              :rules="item.props.rules"
              v-if="!item.hide && !(senior && index > 2)"
            >
              <form-item
                v-model="formData[item.props.fieldName]"
                :item="item"
              />
            </el-form-item>
          </template>
          <div
            class="btnInfo text-center cl"
            v-if="searchItem.length > 0 && searchBtnShow"
          >
            <el-button
              class="submitBtn f-12 cl f-l"
              size="small"
              @click="onSearch"
              :disabled="$_loading"
            >
              <!-- <i class="iconfont icon-chaxun"></i> -->
              查询</el-button
            >
            <el-button
              class="seniorBtn f-12 cl f-l"
              size="small"
              v-if="searchItem.length > 3"
              @click="setSenior"
            >
              <!-- <i class="iconfont icon-chaxun"></i> -->
              {{ senior ? "高级查询" : "取消高级查询" }}
            </el-button>
            <el-button
              class="f-12 resetBtn cl f-l"
              size="small"
              @click="onReset"
            >
              <!-- <i class="iconfont icon-reset"></i> -->
              重置</el-button
            >
          </div>
          <div
            class="search"
            :class="addBtnVisible || otherBtnVisible ? 'hasbtnList' : ''"
          >
            <div class="btnList addBtn" @click="addBtn" v-if="addBtnVisible">
              <i class="iconfont icon-xinzeng f-12" v-if="addBtnIconfont"></i>
              <span class="pos-r">{{ addTitleBtn }}</span>
            </div>
            <div
              class="btnList addBtn"
              @click="addBtn301"
              v-if="addBtnVisible301"
            >
              <i class="iconfont icon-xinzeng f-12" v-if="addBtnIconfont"></i>
              <span class="pos-r">{{ addTitleBtn301 }}</span>
            </div>
            <div class="btnList delBtn" @click="delBtn" v-if="delBtnVisible">
              <i class="iconfont icon-shanchu f-12"></i>
              <span class="pos-r">{{ delTitleBtn }}</span>
            </div>
            <div
              :class="`btnList ${item.class}`"
              v-for="(item, index) in otherBtnLists"
              :key="index"
              @click="
                () => {
                  item.click();
                }
              "
              v-if="otherBtnVisible"
            >
              <i
                :class="`iconfont ${item.addBtnIconfont} f-12`"
                v-if="item.addBtnIconfont"
              ></i>
              <span class="pos-r">{{ item.label }}</span>
            </div>
            <!-- <other-btn-list :anBoolean="anBoolean" v-if="otherBtnVisible">
              <ul>
                <li v-for="(item, index) in otherBtnLists" :key="index" @click="() => {anBoolean = 1; item.click(); }">{{item.label}}</li>
              </ul>
            </other-btn-list> -->
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import formItem from "./formItem";
import searchFormTools from "util/searchFormTools";
export default {
  props: {
    // label width
    labelWidth: {
      type: String,
      default: "70px",
    },
    // 所有的搜索组件
    searchItems: {
      type: Array,
      required: true,
      default: () => [],
    },
    searchBtnShow: {
      type: Boolean,
      default: true,
    },
    addTitleBtn: {
      type: String,
      default: "新增",
    },
    addTitleBtn301: {
      type: String,
      default: "新增",
    },
    delTitleBtn: {
      type: String,
      default: "删除",
    },
    search: {
      type: Boolean,
      default: true,
    },
    // 添加按钮显示
    addBtnVisible: {
      type: Boolean,
      default: false,
    },
    addBtnVisible301: {
      type: Boolean,
      default: false,
    },
    delBtnVisible: {
      type: Boolean,
      default: false,
    },
    // 是否显示查询按钮
    otherBtnVisible: {
      type: Boolean,
      default: false,
    },
    otherBtnLists: {
      type: Array,
      default: null,
    },
    addBtnIconfont: {
      type: Boolean,
      default: true,
    },
    an: Number,
  },
  data() {
    return {
      formData: {},
      senior: true,
      searchItem: [],
      anBoolean: 0,
    };
  },
  computed: {
    newKeys() {
      return this.searchItem.map((v) => {
        return searchFormTools.createUniqueString();
      });
    },
  },
  created() {
    this.addInitValue();
    this.searchItem = this.searchItems.filter((value) => !value.hide);
    this.senior = this.searchItem.length > 3;
  },
  methods: {
    // 校验
    onValidate(callback) {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          callback();
        }
      });
    },
    // 搜索按钮传给父组件
    onSearch() {
      this.onValidate(() => {
        this.$emit("onSearch", this.formData);
      });
    },
    onReset() {
      this.$refs.formRef.resetFields();
      this.forceUpdate(); // 重置组件
    },
    // 添加初始值
    addInitValue() {
      const obj = {};
      this.searchItem.forEach((v) => {
        if (v.initValue !== undefined) {
          obj[v.props.fieldName] = v.initValue;
        }
      });
      this.formData = obj;
    },
    forceUpdate() {
      this.addInitValue();
      this.$forceUpdate();
    },
    setSenior() {
      this.senior = !this.senior;
      if (this.senior) {
        this.searchItem.map((item, index) => {
          if (index > 2) {
            delete this.formData[item.props.fieldName];
          }
        });
      }
    },
    // 点击新增按钮
    addBtn() {
      this.$emit("on-addBtn", true);
    },
    delBtn() {
      this.$emit("on-delBtn", true);
    },
    addBtn301() {
      this.$emit("on-addBtn301", true);
    },
  },
  components: {
    formItem,
  },
};
</script>
<style lang="less">
#searchForm {
  display: inline-block;
  float: left;
}
.searchFrom {
  // justify-content: flex-end;
  .el-row {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: -10px;
    /deep/.el-col {
      margin-bottom: 10px;
      // margin-right: 10px;
      .el-form-item {
        margin-bottom: 0px;
      }
    }
  }
  .searchItem {
    // margin-left: 20px;
    label {
      height: 30px;
      line-height: 30px;
    }
  }
  .searchItem,
  .btnInfo {
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
  }
  .btnInfo {
    margin-bottom: 10px;
  }
  button {
    min-width: 70px;
    font-size: 14px !important;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    // margin-bottom: 10px;
    border-radius: 0 !important;
  }
  .form-group {
    margin-right: 10px;
    float: left;
  }
  .submitBtn,
  .seniorBtn,
  .resetBtn {
    margin-left: 0px !important;
    margin-right: 10px;
    background: rgba(37, 115, 241, 1) !important;
    color: #fff;
    &:hover,
    &:focus,
    &:active {
      color: #fff;
    }
    span {
      vertical-align: middle;
      i {
        vertical-align: inherit;
      }
    }
  }
  .resetBtn {
    margin-left: 0px !important;
    margin-right: 10px;
    // background:rgba(247,247,247,1);
    // background-color: #fff;
    // border:1px solid rgba(192,192,192,1);
    // color:rgba(77,77,77,1);
    &:hover,
    &:focus,
    &:active {
      background-color: #fff;
    }
  }
  .submitBtn,
  .seniorBtn,
  .resetBtn {
    height: 30px;
    line-height: 0;
    span {
      line-height: 14px;
    }
  }
  .search {
    display: inline-block;
    margin: 0px 0 10px 0px;
    vertical-align: middle;
    .btnList {
      min-width: 70px;
      background: rgba(37, 115, 241, 1);
      font-size: 14px;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      padding: 0px 15px;/*no*/
      // flex-direction: row;
      // align-items: center;
      // justify-content: center;
      margin-right: 10px;
      box-sizing: border-box;
      height: 30px;
      line-height: 30px;
      i {
        // margin-right: 8px;
      }
      &.delBtn {
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(37, 115, 241, 1);
        color: rgba(37, 115, 241, 1);
      }
    }
    .addBtn {
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
