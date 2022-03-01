<template>
  <dialog-content
    @on-cancel="canceledit"
    @on-close="canceledit"
    @on-open="openedit"
    :title="`${title}`"
    
    :visible.sync="editshow"
    ref="dialog"
    :dialogModel="dialogModel"
    :confirmShow="false"
    :cancelShow="edit"
    :bottomShow="edit || canApprove"
  >
    <div id="update_edits">
      <div class="content-bd">
        <el-form label-width="151px" status-icon :model="form" ref="formData">
          <wrapper title="交易标的基本情况">
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="宗地编号：" class="valueLine">
                  <span>{{ pageInfo.name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="交易方式：" class="valueLine">
                  <span>{{ pageInfo.transTypeText }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="交易类型：" class="valueLine">
                  <span>{{ pageInfo.businessTypeText }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="允许联合竞买：" class="valueLine">
                  <span>{{ pageInfo.allowUnionText }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="资格审核：" class="valueLine">
                  <span>{{ pageInfo.isAfterCheckText }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="网上直播交易：" class="valueLine">
                  <span>{{ pageInfo.allowLiveText }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </wrapper>
          <wrapper title="价款信息">
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="起始价(万元)：" class="valueLine">
                  <span>{{ pageInfo.beginPriceText }}万元</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="加价幅度(万元)：" class="valueLine">
                  <span>{{ pageInfo.priceStepText }}万元</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="保证金(万元)：" class="valueLine">
                  <span>{{ pageInfo.earnestMoneyText }}万元</span>
                </el-form-item>
              </el-col>
            </el-row>
          </wrapper>
          <wrapper title="成交信息">
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="竞买人编号：" class="valueLine">
                  <span>{{ licenseInfo.dealApplyNo }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="成交人：" class="valueLine">
                  <span>{{ licenseInfo.licenseNmae }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="成交价：" class="valueLine">
                  <span>{{ licenseInfo.transPriceText }}万元</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="成交时间：" class="valueLine">
                  <span>{{ licenseInfo.transDate }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
            </el-row>
            <el-row :gutter="5" v-if="curr_status === 6">
              <el-col :span="12">
                <el-form-item label="取消成交原因：" class="valueLine">
                  <span>{{ licenseInfo.abortReason }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </wrapper>
          <!-- <wrapper title="成交信息">
            <page-table
              :data="tableData"
              :cols="tableCols"
              col-align="left"
              operator
              operator-width="110"
              :page-current="page.current"
              :total="page.total"
              :page-size="page.pageSize"
              @current-change="onCurrentChange"
              @size-change="onPageSizeChange"
            >
              <template slot-scope="scope" slot="operator">
                <flex>
                  <a
                    :href="
                      `/api/fileupload/download?fileCode=${scope.row.fileCode}`
                    "
                  >
                    <el-button
                      type="text"
                      size="small"
                      :style="{ marginRight: '10px' }"
                      >下载</el-button
                    >
                  </a>
                </flex>
              </template>
            </page-table>
          </wrapper> -->
          <attach-modal :id="curr_licenseId" :curr_id="curr_id" title="成交确认书" :api="getDealConfirmBookAttach" :update="canDelete" :canDelete="canDelete"/>
          <attach-modal :id="curr_licenseId" title="成交通知书" :api="getDealNoticeBookAttach"/>
          <attach-modal :id="curr_licenseId" title="附件目录" :api="getLicenseAttach" />
          <wrapper title="审核业务操作" className="actionDetails" v-if="canApprove">
            <!-- <div class="timeBlock">
              <el-timeline>
                <el-timeline-item
                  v-for="(activity, index) in activities"
                  :key="index"
                  :type="activity.type"
                  :color="activity.color"
                  :size="activity.size">
                  <div slot="dot" class="flexCenter dot" :class="activity.pass === 1 ? 'pass' : (activity.pass === 0 ? 'normal' : 'nopass')">
                    {{index + 1}}
                  </div>
                  {{activity.content}}
                </el-timeline-item>
              </el-timeline>
            </div> -->
            <el-row>
              <el-col :span="24">
                <el-form-item label="审核状态：" prop="approveStatus" class="approveStatus">
                  <el-radio-group v-model="form.approveStatus" @change="handleChangeStatus">
                    <el-radio label="2">提交至上级</el-radio>
                    <el-radio label="1">打回至成交人</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="审核意见：" prop="approveRemark">
                  <el-input
                    v-model="form.approveRemark"
                    type="textarea"
                    placeholder="请输入审核意见"
                    :autosize="{
                      minRows: 1.821
                    }"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </wrapper>
        </el-form>
      </div>
    </div>
    <div slot="footer" v-if="canApprove" :style="{display: 'flex',justifyContent:'flex-end'}">
      <el-button @click="canceledit('close')" style="margin-right: 10px;" class="button">取消</el-button>
      <el-button type="primary" class="button" @click="handleSumbit" style="height:40px;">确定</el-button>
    </div>
    <!-- <div class="bottom-btn">
      <el-button class="submitBtn" type="primary" size="small"
        >摇号竞得</el-button
      >
      <el-button class="submitBtn" type="primary" size="small"
        >审核通过</el-button
      >
      <el-button class="submitBtn" type="primary" size="small"
        >审核不通过</el-button
      >
    </div> -->
  </dialog-content>
</template>
<script>
import Wrapper from "@/components/wrapper";
import dialogContent from "@/components/dialog";
import PageTable from "@/components/page-table";
import AttachModal from '@/view/dealManagement/dealLandManage/updatedealLlist/Edit/licenseAttach';
import { getTransMineTargetInfo,getBidderTradeTargetDtl } from "@/api/dealManagement/mineDealManagement/mineAfterdealList";
import { getLicenseAttach, getDealConfirmBookAttach, getDealNoticeBookAttach, getSubmitTrade } from "@/api/dealManagement/updatedealList";
import {
  nodeListByLicenceId,
  getApproveHistory
} from '@/api';
export default {
  name: "edit",
  components: {
    Wrapper,
    dialogContent,
    PageTable,
    AttachModal
  },
  props: {
    show: "",
    dialogModel: true,
    data: ""
  },
  data() {
    return {
      title: "成交审核详情",
      editshow: false,
      inputDisabled: true,
      edit: true,
      curr_licenseId: '',
      curr_id: '',
      curr_status:'',
      pageInfo: {
        name: '',//宗地编号
        transTypeText:'',//交易方式
        businessTypeText:'',//交易类型
        allowUnionText:'',//允许联合竞买
        isAfterCheckText:'',//资格审核--交易后审核
        allowLiveText:'',//网上直播交易
        beginPriceText:'',//起始价
        priceStepText:'',//加价幅度
        earnestMoneyText:''//保证金
      },
      licenseInfo:{
        dealApplyNo:'',//竞买人编号
        licenseNmae:'',//竞买方式--没有字段
        licenseNmae:'',//成交人
        transDate:'',//成交时间
        transPriceText:'',//成交价
        abortReason:''//取消成交原因
      },
      // tableCols: [
      //   { label: "资格文件", prop: "" },
      //   { label: "文件日期", prop: "" }
      // ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '审批日期', prop: 'approveDate', minWidth: 100 },
        { label: '审批意见', prop: 'approveRemark', minWidth: 100 },
        { label: '审批状态', prop: 'approveStatus' },
        { label: '审批人', prop: 'approveUserRealName' },
        { label: '审批节点名称', prop: 'nodeName' }

      ],
      attachshow: false,
      attachdata: {},
      form: {
        approveRemark: '',
        approveStatus: '2'
      },
      activities: [],
      editData: {},
      canApprove:false,//是否能审核--根据用户身份
      canDelete: true,
      getLicenseAttach: getLicenseAttach,
      getDealConfirmBookAttach,
      getDealNoticeBookAttach: getDealNoticeBookAttach
    };
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.curr_licenseId = val.licenseId;
        this.curr_id = val.id;
        this.curr_status = val.status;
        this.edit = false;
      }
    },
    show(val) {
      this.editshow = val;
      this.curr_licenseId = this.licenseId;
      this.curr_id = this.id;
      this.curr_status = this.status;
    }
  },
  created() {
    this.infoData = this.data;
    this.curr_licenseId = this.data.licenseId;
    this.curr_id = this.data.id;
    this.curr_status = this.data.status;
    this.edit = false;
    // console.log(this.data);
  },
  methods: {
    canceledit(type = 'close') {
      this.edit = true;
      this.editshow = false;
      this.$emit("cancel", type);
      this.curr_licenseId = "";
      this.curr_id = "";
      this.curr_status = "";
      this.$_resetForm();
    },
    openedit() {
      this.editshow = this.show;
      this.curr_licenseId = this.licenseId || (this.data && this.data.licenseId);
      this.curr_id = this.id || (this.data && this.data.id);
      this.curr_status = this.status || (this.data && this.data.status);
      this.edit = false;
      this.attachdata = {
        id: this.curr_licenseId
      };
      this.attachshow = true;
      this._getTransMineTargetInfo();
      this._getBidderTradeTargetDtl();
      // this.handlenodeListByLicenceId()
    },
    handlenodeListByLicenceId() {
      nodeListByLicenceId(this.curr_licenseId).then(result => {
        if (result.code === '200') {
          this.activities = result.data.map(re => {
            return {
              content: re.nodeName,
              size: 'large',
              pass: re.isPass
            }
          });
        }
      })
    },
    handleChangeStatus (val) {
      console.log(val);
      if (val === '2') {
        this.form.approveRemark = this.form.approveRemark ? this.form.approveRemark : '通过'
      } else {
        this.form.approveRemark = ''
      }
    },
    handleSumbit () {
      const status = this.form.approveStatus;
      if (status === '1') {
        this.rejectForm();
      } else {
        this.$alert('是否已完成成交确认书的提交？', '提示', {
          confirmButtonText: '确定'
        })
        .then(() => {
            this.resolveForm();
        })
        .catch(err => {
          console.log(err);
        });
      }
    },
    // 通过
    resolveForm (val) {
      let _this = this;
      this.$refs.formData.validate(valid => {
        if (valid) {
          let params = {
            auditStatus: +this.form.approveStatus,
            licenseId: this.curr_licenseId,
            auditMsg: this.form.approveRemark ? this.form.approveRemark : '通过'
          };
          getSubmitTrade(params)
            .then(res => {
              if (res.code === '200') {
                _this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  position: 'bottom-right'
                });
                _this.canceledit('cancel');
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          _this.$notify.error({
            title: '失败',
            message: '请填写完整必填数据!!!',
            position: 'bottom-right'
          });
          return false;
        }
      });
    },
    // 驳回
    rejectForm () {
      let _this = this;
      this.$refs.formData.validate(valid => {
        if (valid) {
          if (!this.form.approveRemark) {
            this.$notify.error({
              title: '失败',
              message: `请输入审核意见!!!`,
              position: 'bottom-right'
            });
            return;
          }
          let params = {
            auditStatus: +this.form.approveStatus,
            licenseId: this.curr_licenseId,
            auditMsg: this.form.approveRemark ? this.form.approveRemark : '打回'
          };
          getSubmitTrade(params)
            .then(res => {
              if (res.code === '200') {
                _this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  position: 'bottom-right'
                });
                _this.canceledit('cancel');
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          _this.$notify.error({
            title: '失败',
            message: '请填写完整必填数据!!!',
            position: 'bottom-right'
          });
          return false;
        }
      });
    },
    _getTransMineTargetInfo() {
      let id = this.curr_id;
      getTransMineTargetInfo(id).then(res => {
          if (res.code === "200") {
            this.pageInfo = {  
              name: res.data.name,
              transTypeText:res.data.transTypeText,
              businessTypeText:res.data.businessTypeText,
              allowUnionText:res.data.allowUnionText,
              // isAfterCheckText:res.data.isAfterCheckText,
              // allowLiveText:res.data.allowLiveText,
              beginPriceText:res.data.beginPriceText,
              priceStepText:res.data.priceStepText,
              earnestMoneyText:res.data.earnestMoneyText
            };
            this.pageInfo.isAfterCheckText = res.data.isAfterCheck === 0 ? '交易后审核' : '交易前审核';
            this.pageInfo.allowLiveText = res.data.allowLive === 0 ? '禁止' : '允许';
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getBidderTradeTargetDtl() {
      let id = this.curr_licenseId;
      getBidderTradeTargetDtl(id).then(res => {
          if (res.code === "200") {
            const { bidderApproveStatus, auditStatus } = res.data;
            this.licenseInfo = {
              dealApplyNo:res.data.dealApplyNo,
              transType:res.data.allowUnionText,
              licenseNmae:res.data.dealBidderText,
              transDate:res.data.endTransTime,
              transPriceText:res.data.dealPriceText,
              abortReason:res.data.abortReason
            };
            if ((auditStatus === 0) || (auditStatus === 1) || (auditStatus === 4)) {
              this.canDelete = false;
            }
            this.canApprove = !!((bidderApproveStatus === 0 && (!auditStatus || auditStatus === 2)) || (bidderApproveStatus === 1 && auditStatus === 2));
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 审核记录
    getRecordList () {
      let params = {
        data: {
          approveId: this.curr_licenseId
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      getApproveHistory(params)
        .then(res => {
          if (res.code === '200') {
            const { data, total } = res.data;
            this.tableData = data;
            this.page.total = total;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onCurrentChange(val) {
      this.page.current = val;
      // this.getList();
    },
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    handleDownCJComfirBook () {
      this.$emit('toTransBooks', {
        licenseId: this.curr_licenseId,
        bookNo: 'DEAL_CONFIRM_BOOK'
      })
      // let targetId = this.curr_id;
      // window.location.href = `/api/approveRecord/downloadTargetFile?targetId=${targetId}`
    }
  }
};
</script>

<style lang="less" scoped>
#update_edits {
  .downBtn{
    background: rgba(37, 115, 241, 1) !important;
    color: #fff;
    margin-bottom: 20px;
  }
  .valueLine span {
    line-height: 14px !important;
  }
  /deep/.comp-wrapper-content{
    padding: 20px 0 0px !important;
    .el-form-item__label,
    .el-form-item__content{
      line-height: 14px;
    }
  }
  /deep/.el-form-item{
    margin-bottom: 24px;
  }
}
.bottom-btn {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.actionDetails{
  .timeBlock{
    padding: 0 10px 20px;
    .el-timeline{
      display: flex;
      flex-direction: row;
      .el-timeline-item{
        position: relative;
        padding-bottom: 0;
        display: flex;
        align-items: center;
        /deep/ .el-timeline-item__dot{
          top: 50%;
          margin-top: -10px;
          .dot{
            width: 20px;
            height: 20px;
            border-radius: 50%;
            font-size: 12px;
            border: 1px solid #ddd;
            color: #606266;
            //1 蓝色--通过
            &.pass{
              background: #2573F1;
              border-color: #2573F1;
              color: #fff;
            }
            //0 灰色--未到达
            &.normal{
              border: 1px solid #ddd;
              color: #606266;
            }
            //3 绿色--审核中
            &.nopass{
              background: #67c23a;
              border-color: #67c23a;
              color: #fff;
            }
          }
        }
        .el-timeline-item__tail{
          border-top: 2px solid #E4E7ED;
          width: 70px;
          height: 2px;
          top: 50%;
          margin-top: -1px;
          right: 0;
          left: auto;
        }
        /deep/ .el-timeline-item__wrapper{
          height: 100%;
          padding-right: 80px;
          padding-left: 30px;
          display: flex;
          align-items: center;
          top: auto;
          .el-timeline-item__content{
            color: #000;
          }
        }
      }
    }
  }
}
</style>
