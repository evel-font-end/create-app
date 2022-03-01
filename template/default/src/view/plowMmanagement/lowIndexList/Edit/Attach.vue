<template>
  <div class="box">
    <wrapper title="附件目录">
      <template slot="header-right">
        <el-button
          type="text"
          icon="el-icon-plus"
          size="small"
          @click="dialog.addAttach = true"
          v-if="isDetail"
        >新增附件目录</el-button>
      </template>
      <collapse @item-click="itemClick" accordion>
        <collapse-item
          v-for="(item, index) in tableData"
          :title="item.name"
          :name="item.id"
          :key="`c-item-${index}`"
        >
          <page-table
            :data="attachDataList[item.id]"
            :cols="tableCols"
            col-align="left"
            :show-page="false"
            operator
            operator-width="110"
          >
            <template slot-scope="scope" slot="operator">
              <flex>
                <a :href="`/api/fileupload/download?fileCode=${scope.row.fileCode}`">
                  <el-button type="text" size="small" :style="{marginRight: '10px'}">下载</el-button>
                </a>
                <el-button
                  type="text"
                  size="small"
                  @click.prevent.stop="singAction('delete', {
                        fileCode: scope.row.fileCode,
                        id: item.id
                      })"
                  v-if="(isDetail)"
                >删除</el-button>
              </flex>
            </template>
          </page-table>
          <flex justify="flex-end">
            <button
              class="upload-button"
              v-if="isDetail"
              @click.prevent.stop="dialog.importFile = true; dialog.uploadId=item.id"
            >
              <i class="el-icon-top"></i>
              上传
            </button>
          </flex>
        </collapse-item>
      </collapse>
    </wrapper>
    <dialog-cont
      @on-cancel="dialog.importFile=false"
      :visible.sync="dialog.importFile"
      :confirmShow="false"
      :cancelShow="false"
      title="上传"
      width="500px"
      append-to-body
    >
      <upload
        ref="upload"
        postUrl="#"
        :fileLists="uploadFileList"
        :multiple="true"
        @change="uploadChange"
        @remove="uploadRemove"
        @submit="uploadSubmit"
        @beforeUpload="beforeUpload"
      ></upload>
    </dialog-cont>
    <dialog-cont
      @on-cancel="dialog.addAttach=false"
      @on-confirm="attachSubmit"
      :visible.sync="dialog.addAttach"
      title="新增附件目录"
      width="500px"
      append-to-body
    >
      <el-form
        ref="attachModel"
        :model="attachModel"
        :rules="attachRules"
        label-width="150px"
        status-icon
      >
        <el-form-item label="附件目录名称：">
          <el-input v-model="attachModel.name" placeholder="请输入附件目录名称"></el-input>
        </el-form-item>
      </el-form>
    </dialog-cont>
  </div>
</template>

<script>
import Flex from '@/components/flex';
import Wrapper from '@/components/wrapper';
import { Collapse, CollapseItem } from '@/components/collapse';
import PageTable from '@/components/page-table';
import upload from '@/components/upload/upload';
import dialogCont from '@/components/dialog';
import { getLandTargetAttach } from '@/api/landManagement/tarageList';
import {
  plowTargetAttach,
  attachList,
  upload as uploadRequest,
  saveAttach,
  deleteFileByFileCode,
  fileDownload
} from 'api/common';
export default {
  name: 'lowIndexList_attach',
  components: {
    Wrapper,
    Collapse,
    CollapseItem,
    PageTable,
    Flex,
    upload,
    dialogCont
  },
  props: {
    initId: {
      type: [Number, String],
      default: ''
    },
    edit: true
  },
  data () {
    return {
      initAttachData: null,
      tableData: [],
      tableCols: [{ label: '文件名', prop: 'fileName' }],
      isDetail: this.edit,
      attachDataList: {},
      dialog: {
        importFile: false, // 上传
        title: '附件', // 弹窗标题
        uploadId: null,
        addAttach: false
      },
      attachModel: {
        name: ''
      },
      attachRules: {
        name: [
          { required: true, message: '请输入附件目录名称', trigger: 'blur' }
        ]
      },
      uploadFileList: [],
      id: ''
    };
  },
  watch: {
    initId (val) {
      if (val) {
        this.id = val;
        this.reqAttach();
      }
    },
    edit (val) {
      this.edit = val;
      this.isDetail = val;
    }
  },
  methods: {
    itemClick (val) {
      const name = val.name;
      if (!this.attachDataList[name]) {
        this.getAttachList(name);
      }
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
      wfForm.append('attachId', this.dialog.uploadId);
      wfForm.append('serviceCode', 'TRANS_TARGET');
      wfForm.append('serviceId', this.id);
      this.uploadFileList.forEach(file => {
        wfForm.append('file', file.raw);
      });
      uploadRequest(wfForm).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '文件上传成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.dialog.importFile = false;
          this.uploadFileList = [];
          this.$refs.upload.fileList.map(list => list.clearFiles);
          this.getAttachList(this.dialog.uploadId);
        } else {
          this.$notify.error({
            title: '失败',
            message: res.message,
            position: 'bottom-right'
          });
          return false;
        }
      });
    },
    singAction (type, { fileCode, id }) {
      const method = {
        download: {
          api: fileDownload,
          message: '下载成功'
        },
        delete: {
          api: deleteFileByFileCode,
          message: '删除成功'
        }
      };
      if (fileCode) {
        const apiMethod = method[type].api;
        const message = method[type].message;
        apiMethod(fileCode).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message,
              type: 'success',
              position: 'bottom-right'
            });
            if (type === 'delete') {
              this.getAttachList(id);
            }
          } else {
            this.$notify.error({
              title: '失败',
              message: res.message,
              position: 'bottom-right'
            });
          }
        });
      }
    },
    attachSubmit () {
      const { isAdd, id } = this;
      this.$refs.attachModel.validate(valid => {
        if (valid) {
          const request = {
            ...this.attachModel,
            refId: id,
            refTableName: 'TRANS_TARGET'
          };
          saveAttach(request).then(res => {
            if (res.code === '200') {
              this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success',
                position: 'bottom-right'
              });
              this.dialog.addAttach = false;
              this.reqAttach();
            } else {
              this.$notify.error({
                title: '失败',
                message: '请填写完整必填数据!!!',
                position: 'bottom-right'
              });
            }
          });
        }
      });
    },
    getAttachList (id) {
      attachList(id).then(res => {
        if (res.code === '200') {
          this.$set(this.attachDataList, id, res.data);
        }
      });
    },
    reqAttach () {
      const { id } = this;
      if (id) {
        plowTargetAttach(id).then(res => {
          if (res.code === '200') {
            this.tableData = res.data;
          }
        });
      }
    }
  },
  created () {
    this.id = this.initId
    this.reqAttach();
  }
};
</script>

<style lang="less" scoped>
.box {
  /deep/.comp-wrapper-header {
    padding: 0;
    // border-top: 1px solid #e2e2e2;
  }
}
.upload-button {
  margin: 12px 30px;
  width: 64px;
  height: 28px;
  background: rgba(219, 233, 255, 1);
  color: #065bdc;
  font-size: 14px;
  cursor: pointer;
}
</style>
