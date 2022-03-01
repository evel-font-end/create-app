<template>
  <dialog-cont
    @on-confirm="confirmedit"
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-open="openedit"
    :title="pageType === 'add' ? '新增黑名单' : '编辑黑名单'"
    
    :visible.sync="editshow"
    ref="dialog"
    :confirmShow="edit"
    :cancelShow="edit"
    :bottomShow="edit"
  >
    <div id="details">
      <div class="content-bd">
        <el-form
          :model="formData"
          label-width="151px"
          status-icon
          :rules="rules"
          ref="formData"
        >
          <wrapper title="黑名单基本情况">
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="竞买人名称：" prop="bidderId">
                  <el-select
                    v-model="formData.bidderId"
                    placeholder="请选择竞买人名称"
                  >
                    <el-option
                      v-for="(item,index) in Options.bidderId"
                      :key="index"
                      :label="item.realName"
                      :value="item.username"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col >
                <el-form-item label="竞买人类型：" prop="banType">
                  <el-checkbox-group
                    v-model="formData.banType"
                  >
                    <el-checkbox
                      v-for="(item, index) in Options.banType"
                      :title="item.value"
                      :label="item.key"
                      :key="index"
                      style="width:auto;text-align:left;"
                      >{{ item.value }}</el-checkbox
                    >
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="截止时间：" prop="limitTime">
                  <el-date-picker
                    v-model="formData.limitTime"
                    style="width: 100%"
                    type="datetime"
                    placeholder="请选择截止时间"
                    format="yyyy年MM月dd日 HH时mm分ss秒"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="加入时间：" prop="createDate">
                  <el-input
                    v-model="formData.createDate"
                    style="width:250px;"
                    type="datetime"
                    placeholder="加入时间"
                    format="yyyy年MM月dd日 HH时mm分ss秒"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row> -->
          </wrapper>
        </el-form>
      </div>
    </div>
  </dialog-cont>
</template>
<script>
import Wrapper from "@/components/wrapper";
import dialogCont from "@/components/dialog";
import {
  getBusinessType,
  toBlacklistAdd,
  toBlacklistEdit,
  getUserList
} from "@/api/dealManagement/blacklistDealManagement";
export default {
  name: "edit",
  components: {
    Wrapper,
    dialogCont
  },
  props: {
    show: "",
    data: ""
  },
  data() {
    return {
      title: "新增黑名单",
      edit: true,
      editshow: false,
      pageType: "",
      editData: [],
      // row: null,
      formData: {
        banType: [],
        bidderId: "",
        limitTime: ''
      },
      rules: {
        bidderId: [
          { required: true, message: "请选择竞买人名称", trigger: "change" }
        ],
        banType: [
          { required: true, message: "请选择竞买人类型", trigger: "change" }
        ],
        limitTime: [
          { required: true, message: "请选择截止时间", trigger: "change" }
        ]
      },
      Options: {
        banType: [],
        bidderId:""
      }
    };
  },
  watch: {
    show(val) {
      this.editshow = val;
    },
    data(val) {
      this.pageType = val.type;
      this.editData = val.data;
    }
  },
  methods: {
    // 打开弹窗
    openedit() {
      if (this.pageType === "edit") {
        this.formData.bidderId = this.editData.bidderId;
        this.formData.banType = this.editData.banType;
        this.formData.limitTime = this.editData.limitTime;
      }
      this._getBusinessType();
      this._getUserList();
    },
    canceledit(type) {
      this.editshow = false;
      this.$emit("cancel", type);
      this.formData = {
        banType: [],
        bidderId: "",
        limitTime: ''
      }
    },
    confirmedit() {
      if (this.pageType === "add") {
        this.toAdd();
      } else {
        this.toEdit();
      }
    },
    //选择的类型
    // bantypeChange(val) {
    //   console.log(this.formData.banType);
    // },
    //新增
    toAdd() {
      let _this = this;
      this.$refs.formData.validate(valid => {
        if (valid) {
          let param = {
            banType: this.formData.banType,
            bidderId: this.formData.bidderId,
            limitTime: this.formData.limitTime
          };
          toBlacklistAdd(param).then(res => {
            if (res.code === "200") {
              this.$notify({
                title: "成功",
                message: res.message,
                type: "success",
                position: "bottom-right"
              });
              _this.canceledit('success');
            } else {
              this.$notify.error({
                title: "失败",
                message: res.message,
                position: "bottom-right"
              });
            }
          });
          this.$forceUpdate();
        } else {
          this.$notify.error({
            title: "失败",
            message: "请填写完整必填数据!!!",
            position: "bottom-right"
          });
          return false;
        }
      });
    },
    //编辑
    toEdit() {
      let _this = this;
      this.$refs.formData.validate(valid => {
        if (valid) {
          let param = {
            banType: this.formData.banType,
            bidderId: this.formData.bidderId,
            limitTime: this.formData.limitTime,
            applyExplain: ''
          };
          toBlacklistEdit(param).then(res => {
            if (res.code === "200") {
              this.$notify({
                title: "成功",
                message: res.message,
                type: "success",
                position: "bottom-right"
              });
              _this.canceledit('success');
            } else {
              this.$notify.error({
                title: "失败",
                message: res.message,
                position: "bottom-right"
              });
            }
          });
          this.$forceUpdate();
        } else {
          this.$notify.error({
            title: "失败",
            message: "请填写完整必填数据!!!",
            position: "bottom-right"
          });
          return false;
        }
      });
    },
    // 获取交易方式下拉框数据
    _getBusinessType() {
      this.Options.transType = [];
      getBusinessType().then(res => {
        if (res.code === "200") {
          this.Options.banType = res.data;
        }
      });
      this.$forceUpdate();
    },
    // 获取所有用户
    _getUserList() {
      this.Options.bidderId = [];
      getUserList().then(res => {
        if (res.code === "200") {
          this.Options.bidderId = res.data
          // res.data.map(item => {
          //   this.searchItems[0].props.options.push({
          //     name: item.realName,
          //     id: item.id
          //   });
          // });
        }
      });
      this.$forceUpdate();
    },
  }
};
</script>

<style lang="less">
#details {
  background: #e6e6e6 !important;
  .el-checkbox-group{
    display: flex;
    flex-wrap: wrap;
  }
  .valueLine span {
    line-height: 35px !important;
  }
  /deep/.comp-wrapper-content{
    padding: 20px 0 0px !important;
    .el-form-item__label,
    .el-form-item__content{
      // line-height: 14px;
    }
  }
  /deep/.el-form-item{
    margin-bottom: 24px;
  }
}
// /deep/.el-dialog--center .el-dialog__body{
//   padding: 20px 0 15px !important;
// }
</style>
