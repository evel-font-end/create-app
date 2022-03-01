<template>
  <div id="mine_afterdeal_list">
    <header-title>
      <search-form
        slot="searchBox"
        :labelWidth="labelWidth"
        :searchItems="searchItems"
        @onSearch="onSearch"
        otherBtnVisible
        :otherBtnLists="[{
          label: '下载成交确认书模板',
          click: () => downTemplate()
        }]"
      />
    </header-title>
    <div class="content-view">
      <div class="Modeltable">
        <page-table
          :data="tableData"
          :cols="tableCols"
          col-align="left"
          operator
          operator-width="100"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
          <template slot-scope="scope" slot="operator">
            <el-button type="text" size="small" title="详情" icon="iconfont icon-feeds-fill" @click="detailBtn(scope.row.licenseId,scope.row.id,scope.row.status)"></el-button>
            <!-- <el-button type="text" size="small" title="提交审核" icon="iconfont icon-wancheng" @click="submitTradeBtn(scope.row)" v-if="scope.row.remark === '1'"></el-button> -->
            <!-- <el-button type="text" size="small" title="成交通知书提交" icon="iconfont icon-yubaofabu" @click="handleUpdate(scope.row.id, scope.row.licenseId)" v-if="scope.row.remark === '0' || scope.row.remark === '1'"></el-button> -->
            <!-- <el-button type="text" size="small" title="取消成交" icon="iconfont icon-quxiaochengjiao" @click="cancelTradeBtn(scope.row)" v-if="scope.row.canSubmit"></el-button> -->
            <!-- <span v-for="(item,index) in scope.row.transBooks" :key="index">
              <el-button type="text" size="small" title="成交通知书" v-if="item.bookNo === 'DEAL_NOTICE_BOOK'" icon="iconfont icon-chengjiaotongzhishu" @click="toTransBooks(item)"></el-button>
              <el-button type="text" size="small" title="成交确认书" v-if="item.bookNo === 'DEAL_CONFIRM_BOOK'" icon="iconfont icon-zigequerenshu" @click="toTransBooks(item)"></el-button>
            </span> -->
            <el-button type="text" size="small" title="审核进度" icon="iconfont icon-trackProgress" @click="toPageProgress(scope.row)" v-if="((scope.row.auditStatus !== undefined) && (scope.row.auditStatus !== null))"></el-button>
          </template>
        </page-table>
      </div>
    </div>
    <!-- <attach
      :show="attachshow"
      :data="attachdata"
      @cancel="closeAttach"
    ></attach> -->
    <!-- 确认/取消成交 -->
    <dialog-cont
      @on-cancel="dialogData.editShow = false"
      @on-close="dialogData.editShow = false"
      width="540px"
      @on-confirm="editSure('dialogData')"
      :visible="dialogData.editShow"
      :title="dialogData.title"
      class="dialogCont"
    >
      <div class="content-bd">
        <el-form
          :model="dialogData"
          :rules="rules"
          label-width="120px"
          ref="dialogData"
        >
          <el-row :gutter="10">
            <el-col :span="24">
              <div v-if="dialogData.isSubmitOrCancel">
                <div class="dialogTxt">确认{{dialogData.realName}}成交{{dialogData.name}}标的？</div>
              </div>
              <div v-else>
                <div class="dialogTxt">确认取消{{dialogData.realName}}成交{{dialogData.name}}标的？若确定，此标的将流拍。</div>
                <el-form-item label="取消成交原因：" prop="reasonHtml">
                  <el-input
                    type="textarea"
                    v-model="dialogData.reasonHtml"
                    placeholder="请输入取消原因"
                    style="width:300px;"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </dialog-cont>
    <dialog-cont
      @on-cancel="dialog.importFile=false"
      :visible.sync="dialog.importFile"
      :confirmShow="false"
      :cancelShow="false"
      title="上传成交确认书"
      width="500px"
      append-to-body
    >
      <Upload
        ref="upload"
        postUrl="#"
        :fileLists="uploadFileList"
        :limit="1"
        @change="uploadChange"
        @remove="uploadRemove"
        @submit="uploadSubmit"
        @beforeUpload="beforeUpload"
      ></Upload>
    </dialog-cont>
    <edit :show="editshow" :data="editdata" @cancel="closeEdit" @toTransBooks="item => toTransBooks(item)"></edit>
    <edit-progress
      :show="progressShow"
      :data="progressdata"
      @cancel="closeProgressEdit"
    ></edit-progress>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { Base64 } from 'js-base64';
import PageTable from "@/components/page-table";
import headerTitle from "@/components/headerTitle/headerTitle";
import searchForm from "components/searchForm/searchForm";
import Upload from '@/components/upload/upload';
import editProgress from '@/view/dealExamine/auditInformation/Edit/index';
import dialogCont from "@/components/dialog";
import edit from "./Edit/index";
import {
  handleDownloadCJTemplate
} from '@/util/util';
import {
  getCheckMineTargetList,
  getSubmitDetermine
} from "@/api/dealManagement/mineDealManagement/mineAfterdealList";
import {
  getSubmitTrade,
  getCancelTrade,
  getTransBook,
  uploadDoc
} from "@/api/dealManagement/updatedealList";
import {
  getTransactionType,
  getMineBusinessType,
} from "@/api/dealManagement/mineDealManagement/common";
export default {
  name: "mine_afterdeal_list",
  components: {
    PageTable,
    headerTitle,
    searchForm,
    dialogCont,
    // attach,
    edit,
    Upload,
    editProgress
  },
  data() {
    return {
      searchVal: {
        budder: "",
        no: "",
        transType: "", // 交易方式
        businessType: "" // 交易类型
      },
      labelWidth: "85px",
      searchItems: [
        {
          type: "input",
          label: "竞买人名称",
          props: {
            width:'140px',
            placeholder: "请输入竞买人名称",
            fieldName: "budder"
          }
        },
        {
          type: "input",
          label: "宗地编号",
          props: {
            placeholder: "请输入宗地编号",
            fieldName: "no"
          }
        },
        {
          type: "select",
          label: "交易方式",
          props: {
            fieldName: "transType",
            placeholder: "交易方式选择",
            options: []
          }
        },
        {
          type: "select",
          label: "交易类型",
          props: {
            fieldName: "businessType",
            placeholder: "交易类型选择",
            options: []
          }
        }
      ],
      tableCols: [
        { label: "竞买人", prop: "realName", minWidth: 240 },
        { label: "宗地编号", prop: "name", minWidth: 300 },
        { label: "交易类型", prop: "businessTypeText", width: '80px' },
        { label: "交易方式", prop: "transTypeText", width: '150px' },
        { label: "交易结束时间", prop: "endTransTime", width: '110px' },
        { label: "成交价(万元)", prop: "transPriceText", minWidth: 200, align: 'right' },
        // { label: "是否竞得人", prop: "budderStatus", width: '100px' },
        { label: "标的状态", prop: "statusText", width: '80px' },
        { label: "受理状态", prop: "bidderApproveStatusStr", width: '80px' },
        { label: "审核状态", prop: "auditStatusStr", width: '80px' }
        // {
        //   label: "提交附件",
        //   prop: "",
        //   render: (h, scope) => {
        //     return (
        //       <div
        //         style="color:#2573f1;cursor:default;"
        //         onClick={() => {
        //           this.showEnclosure(scope.row);
        //         }}
        //       >
        //         附件
        //       </div>
        //     );
        //   }
        // }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      attachshow: false,
      attachdata: {},
      editshow: false,
      editdata: {},
      dialogData: {
        title: "确认成交",
        editShow: false,
        isSubmitOrCancel:true,
        name:"",
        licenseId:"",
        realName:"",
        reasonHtml: ""
      },
      // 验证
      rules: {
        reasonHtml: [{ required: true, message: "该项为必填", trigger: "blur" }]
      },
      dialog: {
        show: false,
        importFile: false,
        uploadId: undefined,
        uploadLicenseId: undefined
      },
      uploadFileList: [],
      progressShow: false,
      progressdata: {}
    };
  },
  methods: {
    ...mapActions({
      userLoginDealRecord: 'user/userLoginDealRecord',
    }),
    /**
     * 查询
     */
    onSearch(val) {
      this.searchVal = {
        ...val
      };
      this.page.current = 1;
      this.getList();
    },
    /**
     * 查看附件
     */
    // showEnclosure(row) {
    //   this.attachdata = {
    //     id: row.id
    //   };
    //   this.attachshow = true;
    // },
    // closeAttach(type) {
    //   this.attachshow = false;
    //   if (type === "cancel") {
    //     this.getList();
    //   }
    // },
    /**
     * 查看详情
     */
    detailBtn(licenseId,id,status) {
      this.editdata = {
        licenseId: licenseId,
        id: id,
        status: status
      };
      this.editshow = true;
    },
    closeEdit(type) {
      this.editshow = false;
      if (type === "cancel") {
        this.getList();
      }
    },
    onCurrentChange(val) {
      this.page.current = val;
      this.getList();
    },
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    /**
     * 获取交易方式下拉框数据
     */
    _getTransactionType() {
      this.searchItems[2].props.options = [];
      getTransactionType().then(res => {
        if (res.code === "200") {
          res.data.map(item => {
            this.searchItems[2].props.options.push({
              name: item.value,
              id: item.key
            });
          });
        }
        this.$forceUpdate();
      });
    },
    /**
     * 获取交易类型下拉框数据
     */
    _getMineBusinessType() {
      this.searchItems[3].props.options = [];
      getMineBusinessType().then(res => {
        if (res.code === "200") {
          res.data.map(item => {
            this.searchItems[3].props.options.push({
              name: item.value,
              id: item.key
            });
          });
        }
        this.$forceUpdate();
      });
    },
    getList() {
      const param = {
        data: this.searchVal,
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      getCheckMineTargetList(param).then(res => {
        const { data, total } = res.data;
        this.page.total = total;
        this.tableData = data;
        this.userLoginDealRecord();
      });
    },
    /**
     * 摇号竞得
     */
    submitDetermineBtn(licenseId, id) {
      const param = {
        licenseId: licenseId,
        targetId: id
      };
      getSubmitDetermine(param).then(res => {
        if (res.code === "200") {
          this.$notify({
            title: "成功",
            message: res.message,
            type: "success",
            position: "bottom-right"
          });
          this.getList();
        } else {
          this.$notify.error({
            title: "失败",
            message: res.message,
            position: "bottom-right"
          });
        }
      });
      this.$forceUpdate();
    },
    /**
     * 确认成交弹窗
     */
    submitTradeBtn(row) {
      this.dialogData.isSubmitOrCancel = true;
      this.dialogData.name = row.name;
      this.dialogData.licenseId = row.licenseId;
      this.dialogData.realName = row.realName;
      this.dialogData.title = '确认成交';
      this.dialogData.editShow = true;
    },
    /**
     * 取消成交弹窗
     */
    cancelTradeBtn(row) {
      this.dialogData.isSubmitOrCancel = false;
      this.dialogData.name = row.name;
      this.dialogData.licenseId = row.licenseId;
      this.dialogData.realName = row.realName;
      this.dialogData.title = '确认取消成交';
      this.dialogData.editShow = true;
    },
    /**
     * 确认/取消成交
     */
    editSure(dialogData) {
      //isSubmitOrCancel：true确认/false取消成交
      if(this.dialogData.isSubmitOrCancel){
        let param = {
          licenseId: this.dialogData.licenseId
        };
        getSubmitTrade(param).then(res => {
          if (res.code === "200") {
            this.$notify({
              title: "成功",
              message: res.message,
              type: "success",
              position: "bottom-right"
            });
            this.dialogData.editShow = false;
            this.getList();
          } else {
            this.$notify.error({
              title: "失败",
              message: res.message,
              position: "bottom-right"
            });
          }
        });
        this.$forceUpdate();
      }else{
        let param = {
          licenseId: this.dialogData.licenseId,
          abortReason: this.dialogData.reasonHtml
        };
        this.$refs.dialogData.validate(valid => {
          if (valid) {
            getCancelTrade(param).then(res => {
              if (res.code === "200") {
                this.$notify({
                  title: "成功",
                  message: res.message,
                  type: "success",
                  position: "bottom-right"
                });
                this.dialogData.editShow = false;
                this.getList();
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
              title: '失败',
              message: '请填写完整必填数据!!!',
              position: 'bottom-right'
            });
            return false;
          }
        });
      }
    },
    toTransBooks (row) {
      //打开一个不被拦截的新窗口
      getTransBook(row.licenseId,row.bookNo).then(res => {
        if (res.code === '200') {
          const visitFilePath = res.data.visitFilePath.split(':');
          const { href } = this.$router.resolve({
            name: 'pdf',
            query: {
              path: Base64.encode(visitFilePath[1] || res.data.visitFilePath),
              fileCode: Base64.encode(res.data.fileCode)
            }
          });
          window.open(href, "_blank");
        }
      });
    },
    downTemplate () {
      handleDownloadCJTemplate();
    },
    handleUpdate (id, licenseId) {
      this.dialog.importFile = true;
      this.dialog.uploadId=id
      this.dialog.uploadLicenseId=licenseId
    },
    uploadChange (file) {
      this.uploadFileList = file.fileList;
    },
    uploadRemove (file) {
      this.uploadFileList = file.fileList;
    },
    beforeUpload (file) {
      return this;
    },
    uploadSubmit () {
      if (this.uploadFileList.length === 0) {
        this.$notify.error({
          title: '失败',
          message: '请先选择上传文件!!!',
          position: 'bottom-right'
        });
        return;
      }
      const wfForm = new FormData();
      this.uploadFileList.forEach(file => {
        wfForm.append('file', file.raw);
      })
      uploadDoc(wfForm, this.dialog.uploadId, this.dialog.uploadLicenseId).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '文件上传成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.dialog.importFile = false;
          this.uploadFileList = [];
          this.getList();
        } else {
          this.$notify.error({
            title: '失败',
            message: res.message,
            position: 'bottom-right'
          });
          return false;
        }
      })
    },
    toPageProgress (row) {
      this.progressdata = {
        approveId: row.licenseId,
        refId: row.refId,
        // approveLinkedId: row.approveLinkedId,
        status: row.status,
        businessType: row.businessType,
        isShowBtn: false,
        type:'deal',
        pageType: false,
        title:row.no
      }
      this.progressShow = true;
    },
    closeProgressEdit () {
      this.progressShow = false;
      this.progressdata = {};
    },
  },
  created() {
    this._getTransactionType();
    this._getMineBusinessType();
    this.getList();
  }
};
</script>
<style lang="less" scoped>
#mine_afterdeal_list{
  .Modeltable{
    >.comp-page-table{
      padding:0 20px;
      background: #fff;
    }
  }
  .el-table .cell span {
    color: #25adf1 !important;
    cursor: default;
  }
  .el-table .cell span:hover {
    color: #2573f1 !important;
    cursor:pointer;
  }
  .dialogTxt{
    padding: 0px 0px 20px 20px;
    font-size: 15px;
  }
  .operatorUrl {
    color: #25adf1 !important;
    cursor: default;
    margin-right: 4px;
    float: left;
    .iconBtn{
      padding: 5px 4px 4px 5px;
      background:linear-gradient(317deg,#5BADFE 0%,#3881FC 100%);
      filter: progid:DXImageTransform.Microsoft.gradient(GradientType=1, startColorstr=#5BADFE, endColorstr=#3881FC);
      border-radius: 8px;
      i{
        font-size: 22px;
        color: #fff;
        border: none !important;
        padding: 0 !important;
      }
    }
  }
  .operatorUrl:nth-child(1){
    float: left;
  }
  .operatorUrl:hover {
    color: #2573f1 !important;
    cursor:pointer;
  }
}
</style>
