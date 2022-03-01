<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-open="openedit"
    @on-confirm="confirmedit"
    :cancelShow="false"
    :confirmShow="false || !!(canPrint && editData.linkedStatus === 1)"
    :confirmText="canPrint ? '打印' : '确定'"
    :title="`${title}`"
    
    :visible.sync="editshow"
    ref="dialog"
    className="audit_Information_edit"
    :bottomShow="!!((isShowBtn && isEdit && canApprove) || (canPrint && editData.linkedStatus === 1))"
  >
    <div id="printMe" ref="printMe">
      <wrapper title="审核业务单据详情" className="businessDetails" v-if="curr_type == ''">
        <info :data="data" v-if="editshow"/>
      </wrapper>
      <el-form ref="formData" :model="form" label-width="100px" :rules="formRules" style="margin-bottom: 15px; margin-top: 20px" >
        <wrapper title="审核业务操作" className="actionDetails">
          <div class="timeBlock" v-if="editData.linkedStatus !== 1">
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
          </div>
          <el-row v-if="editData.linkedStatus !== 1">
            <el-col :span="24" v-if="curr_type == '' && canApprove">
              <el-form-item label="审核状态：" prop="approveStatus" class="approveStatus">
                <el-radio-group v-model="form.approveStatus" @change="handleChangeStatus">
                  <el-radio label="1">通过</el-radio>
                  <el-radio label="0">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="审核意见：" prop="approveRemark">
                <el-input
                  v-model="form.approveRemark"
                  type="textarea"
                  placeholder="请输入审核意见"
                  :disabled="!isEdit && !canApprove"
                  :autosize="{
                    minRows: 1.821
                  }"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </wrapper>
      </el-form>
      <page-table
        col-align="left"
        :data="tableData"
        :cols="tableCols"
        :selection="true"
        :page-current="page.current"
        :total="page.total"
        :page-size="page.pageSize"
        @current-change="onCurrentChange"
        @size-change="onPageSizeChange"
      ></page-table>
    </div>
    <div slot="footer" :style="{display: 'flex',justifyContent:'flex-end'}" v-if="isShowBtn">
      <el-button @click="canceledit('close')" style="margin-right: 10px;" class="button" v-if="isEdit && canApprove">取消</el-button>
      <el-button type="primary" class="button" @click="handleSumbit" style="height:40px;" v-if="isEdit && canApprove && ($_hasOperation('audit_Information','back') || $_hasOperation('audit_Information','pass'))">确定</el-button>
      <!-- <el-button type="primary" @click="resolveForm" style="margin-right: 10px;height:40px;" v-if="isEdit && canApprove && $_hasOperation('audit_Information','pass')">审核通过</el-button> -->
    </div>
  </dialog-cont>
</template>

<script>
import html2canvas from 'html2canvas'  // 转图片打印需要先安装html2Canvas和print-js
import printJS from 'print-js'
import dialogCont from '@/components/dialog';
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import FormItem from '@/components/formItem';
import {
  getApproveInfo,
  getSuppleTransNoticeDtl,
  saveSupplementarNotic,
  getApproveHistory,
  dealApprovePass,
  dealApproveBack,
  getNodeList,
  getNodeListBytargetId,
  getListByTargetId,
  getNodeListByNoticeId,
  getListByNoticeId,
  listApproveByLicenceId,
  nodeListByLicenceId
} from '@/api';
import {
  returnNodeListByRefundId,
  returnListByRefundId
} from '@/api/common';
import Info from './info';
import { noticeTypeOptions } from '../utils';

export default {
  name: 'edit',
  components: {
    dialogCont,
    Wrapper,
    Flex,
    FormItem,
    Info,
    PageTable
  },
  props: {
    data: {},
    show: '',
    canPrint: false
  },
  data () {
    return {
      title: '公告审核',
      editshow: false,
      editData: {},
      isEdit: false, // 是否能审核
      form: {
        approveRemark: '同意',
        approveStatus: '1'
      },
      formRules: {
        // approveRemark: {
        //   required: true,
        //   message: '请输入审批意见',
        //   trigger: 'blur'
        // }
      },
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '审批日期', prop: 'approveDate', minWidth: 300 },
        { label: '审批意见', prop: 'approveRemark', minWidth: 300 },
        { label: '审批状态', prop: 'approveStatus' },
        { label: '审批人', prop: 'approveUserRealName' },
        { label: '审批节点名称', prop: 'nodeName' }

      ],
      activities: [],
      isShowBtn:true,
      canApprove:false,//是否能审核--根据用户身份
      curr_type:'',
      img: '',
      className: ''
    };
  },
  watch: {
    show: {
      deep: true,
      handler (newVal, oldVal) {
        if (newVal) {
          this.editData = this.data;
          this.editshow = newVal;
        }
      }
    }
  },
  methods: {
    // 打开弹窗
    openedit () {
      if(this.editData.pageType){
        this.title = this.editData.status === 1 ? this.editData.approveTitle + ' ' + this.editData.refTableNameText : this.editData.approveTitle + ' ' + this.editData.refTableNameText + '详情';
      }else{
        this.title = this.editData.title
      }
      
      this.isEdit = this.editData.status;
      this.isShowBtn = this.editData.isShowBtn;
      this.canApprove = this.editData.canApprove;
      this.curr_type = !this.editData.type ? '' : this.editData.type;
      // setTimeout(() => {
        //标的信息
        console.log('this.editData', this.editData);
        if(this.editData.type === 'target'){
          this.getNodeListBytargetIdFn();
          this.getListByTargetIdFn();
        }else if(this.editData.type === 'notice'){
          this.getNodeListByNoticeIdFn();
          this.getListByNoticeIdFn();
        }else if (this.editData.type === 'retuenEarnest') {
          this.getNodeListBytargetIdFn(1);
          this.getListByTargetIdFn(1);
        } else if(this.editData.type === 'deal') {
          this.getNodeListByNoticeIdFn(1);
          this.getListByNoticeIdFn(1);
        } else {
          this.getNodeListFn();
          this.getRecordList();
        }
      // }, 10);
    },
    getNodeListByNoticeIdFn (type) {
      const api = type === 1 ? nodeListByLicenceId : getNodeListByNoticeId;
      api(this.editData.approveId)
        .then(async result => {
          const resultData = result;
          if (resultData.code === '200') {
            const res = resultData.data;
            const getPrevNode = async (data, idx) => {
              let array = [];
              const index = data.findIndex(da => da.id === idx);
              array.push(data[index]);
              if (data[index].previousNode) {
                const childArr = await getPrevNode(data, data[index].previousNode);
                array.push(...childArr);
              }
              return array;
            }
            // let result = [];
            // const start = res.findIndex(re => !re.nextNode);
            // result.push(res[start]);
            // const resArr = await getPrevNode(res, res[start].previousNode);
            // await result.push(...resArr);
            let result = res;
            console.log(res)
            this.activities = result.map(re => {
              return {
                content: re.nodeName,
                size: 'large',
                pass: re.isPass
              }
            });
          }
        });
    },
    getNodeListBytargetIdFn (type = 0) {
      const api = type === 0 ? getNodeListBytargetId : returnNodeListByRefundId;
      api(this.editData.approveId)
        .then(async result => {
          const resultData = result;
          if (resultData.code === '200') {
            const res = resultData.data;
            const getPrevNode = async (data, idx) => {
              let array = [];
              const index = data.findIndex(da => da.id === idx);
              array.push(data[index]);
              if (data[index].previousNode) {
                const childArr = await getPrevNode(data, data[index].previousNode);
                array.push(...childArr);
              }
              return array;
            }
            // let result = [];
            // const start = res.findIndex(re => !re.nextNode);
            // result.push(res[start]);
            // const resArr = await getPrevNode(res, res[start].previousNode);
            // await result.push(...resArr);
            let result = res;
            console.log(res)
            this.activities = result.map(re => {
              return {
                content: re.nodeName,
                size: 'large',
                pass: re.isPass
              }
            });
          }
        });
    },
    getNodeListFn () {
      getNodeList(this.editData.approveId)
        .then(async result => {
          const resultData = result;
          if (resultData.code === '200') {
            const res = resultData.data;
            const getPrevNode = async (data, idx) => {
              let array = [];
              const index = data.findIndex(da => da.id === idx);
              array.push(data[index]);
              if (data[index].previousNode) {
                const childArr = await getPrevNode(data, data[index].previousNode);
                array.push(...childArr);
              }
              return array;
            }
            // let result = [];
            // const start = res.findIndex(re => !re.nextNode);
            // result.push(res[start]);
            // const resArr = await getPrevNode(res, res[start].previousNode);
            // await result.push(...resArr);
            let result = res;
            console.log(res)
            this.activities = result.map(re => {
              return {
                content: re.nodeName,
                size: 'large',
                pass: re.isPass
              }
            });
          }
        });
    },
    // 取消
    canceledit (type) {
      this.editshow = false;
      this.editData = {};
      this.curr_type = '';
      this.$refs.formData.resetFields();
      this.$emit('cancel', type);
    },
    handleSumbit () {
      const status = this.form.approveStatus;
      if (status === '1') {
        this.resolveForm();
      } else {
        this.rejectForm();
      }
    },
    handleChangeStatus (val) {
      console.log(val);
      if (val === '1') {
        this.form.approveRemark = this.form.approveRemark ? this.form.approveRemark : '通过'
      } else {
        this.form.approveRemark = ''
      }
    },
    // 通过
    resolveForm (val) {
      let _this = this;
      this.$refs.formData.validate(valid => {
        if (valid) {
          let params = {
            approveId: this.editData.approveId,
            approveRemark: this.form.approveRemark ? this.form.approveRemark : '通过'
          };
          dealApprovePass(params)
            .then(res => {
              if (res.code === '200') {
                _this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  position: 'bottom-right'
                });
                _this.canceledit('success');
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
            approveId: this.editData.approveId,
            approveRemark: this.form.approveRemark ? this.form.approveRemark : '打回'
          };
          dealApproveBack(params)
            .then(res => {
              if (res.code === '200') {
                _this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  position: 'bottom-right'
                });
                _this.canceledit('success');
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
    onCurrentChange (val) {
      this.page.current = val;
    },
    onPageSizeChange (val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    // 审核记录
    getRecordList () {
      let params = {
        data: {
          approveId: this.editData.approveId
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
    // 标的审核记录
    getListByTargetIdFn (type = 0) {
      const api = type === 0 ? getListByTargetId : returnListByRefundId;
      let params = {
        data: {
          id: this.editData.approveId
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      api(params)
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
    // 公告审核记录
    getListByNoticeIdFn (type) {
      const api = type === 1 ? listApproveByLicenceId : getListByNoticeId;
      let params = {
        data: {
          id: this.editData.approveId
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      api(params).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data;
          this.tableData = data;
          this.page.total = total;
        }
      }).catch(err => {
        console.log(err);
      });
    },
    confirmedit() { // 转图片打印
      window.pageYoffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      let htmlDom = document.getElementById('printMe');
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const that = this;
      html2canvas(this.$refs.printMe, {
        logging: false,
        width: htmlDom.clientWidth,
        height: htmlDom.clientHeight - 170,
        scrollY: -170, 
        scrollX: 0,
        backgroundColor: null,
        useCORS: true,
        scale: 2, //放大
        dpi: 300,
        ignoreElements:(element)=>{
          return element.className.indexOf('no-want-print') > -1;
        }
      }).then((canvas) => {
        const url = canvas.toDataURL();
        that.img = url;
        printJS({
          printable: url,
          type: 'image',
          documentTitle: that.title
        });
      })
    }
  }
};
</script>

<style lang="less">
.audit_Information_edit{
  .button.el-button--default {
    border: 1px solid #409eff !important;
  }
  .timeBlock{
    padding: 0 20px 10px;
    // margin-left: 20px;
    .el-timeline{
      display: flex;
      flex-direction: row;
      .el-timeline-item{
        position: relative;
        padding-bottom: 0;
        .el-timeline-item__dot{
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
        .el-timeline-item__wrapper{
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
  /deep/.businessDetails, .actionDetails{
    >.comp-wrapper-header{
      border: 0;
      padding: 0;
    }
    >.comp-wrapper-content{
      padding: 10px 0 10px;
      .info{
        padding: 0;
      }
    }
  }
  /deep/.comp-page-table{
    margin-bottom: 0px;
  }
  /deep/.businessDetails .comp-wrapper, .actionDetails{
    .comp-wrapper-header{
      padding: 0 !important;
      border-top: none;
      overflow: hidden;
      border-bottom:1px #eee solid;
      .comp-wrapper-header__left{
        span{
          display: inline-block;
          height: 30px;
          line-height: 30px;
          padding: 0 5px 0 10px;
          background: #518FF4;
          border-left: 0;
          font-size:14px;
          font-family:PingFangSC-Semibold,PingFang SC;
          font-weight:600;
          color:rgba(255,255,255,1);
          position: relative;
          &::after{
            content: '';
            background: transparent;
            width: auto;
            height: auto;
            left: auto;
            top: auto;
            margin-top: 0;
            position: absolute;
            right: -21px;
            bottom: -21.5px;
            border-width: 21.5px;
            border-style: solid;
            border-color: transparent #518FF4 transparent transparent;
            transform: rotate(-45deg); /*顺时针旋转90°*/
          }
        }
      }
    }
  }
  .el-dialog_wrapper .dialog-fade-leave-active{
		animation-fill-mode:forwards;
	}
  #printMe{
    .approveStatus{
      .el-radio{
        .el-radio__inner{
          width: 18px;
          height: 18px;
          border: 1px solid #aaaaaa;
        }
        .el-radio__label{
          font-size: 16px;
        }
      }
    }
    .el-input, .el-textarea{
      &.is-disabled{
        .el-input__inner, .el-textarea__inner{
          color: #000;
          background-color: #fff;
        }
      }
    }
  }
}

</style>
