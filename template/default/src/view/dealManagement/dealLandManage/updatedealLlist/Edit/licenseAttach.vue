<template>
  <div class="box">
    <wrapper :title="title">
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
                <el-button
                  type="text"
                  size="small"
                  @click.prevent.stop="handleDelete({
                        fileCode: scope.row.fileCode,
                        id: item.id
                      })"
                  v-if="canDelete"
                >删除</el-button>
              </flex>
            </template>
          </page-table>
          <flex justify="flex-end">
            <button class="upload-button" v-if="update" @click.prevent.stop="() => handleClickUpdate(item)">
              <i class="el-icon-top"></i>
              上传
            </button>
          </flex>
        </collapse-item>
      </collapse>
    </wrapper>
    <dialogContent
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
    </dialogContent>
  </div>
</template>
<script>
import Flex from "@/components/flex";
import Wrapper from "@/components/wrapper";
import { Collapse, CollapseItem } from "@/components/collapse";
import PageTable from '@/components/page-table';
import dialogContent from "@/components/dialog";
import Upload from '@/components/upload/upload';
import { attachList, deleteFileByFileCode } from "api/common";
import { uploadDoc } from '@/api/dealManagement/updatedealList';
export default {
  name: "attach",
  components: {
    Flex,
    Wrapper,
    Collapse,
    CollapseItem,
    PageTable,
    dialogContent,
    Upload
  },
  props: {
    id:"",
    curr_id: '',
    title: {
      type: String,
      default: '附件目录'
    },
    api: {
      type: Function,
    },
    update: false,
    canDelete: false
  },
  data() {
    return {
      attachshow: false,
      inputDisabled: true,
      tableData: [],
      tableCols: [{ label: '文件名', prop: 'fileName' }],
      dialog: {
        show: false
      },
      attach: true,
      attachshow: false,
      curr_licenseId: "",
      attachDataList: [],
      dialog: {
        show: false,
        importFile: false,
        uploadId: null
      },
      uploadFileList: [],
    };
  },
  watch: {
    id: {
      deep: true,
      handler(val) {
        if (val) {
          this.curr_licenseId = val;
          this.attach = false;
          this.reqAttach();
        }
      }
    }
  },
  created() {
    this.curr_licenseId = this.id;
    this.attach = false;
    this.openattach();
  },
  methods: {
    itemClick(val) {
      const name = val.name;
      if (!this.attachDataList[name]) {
        this.getAttachList(name);
      }
    },
    getAttachList(id) {
      attachList(id).then(res => {
        if (res.code === "200") {
          this.$set(this.attachDataList, id, res.data);
        }
      });
    },
    cancelattach() {
      this.attach = true;
      this.attachshow = false;
      this.$emit("cancel");
      this.curr_licenseId = "";

      this.$_resetForm();
    },
    openattach() {
      this.attachshow = this.show;
      this.curr_licenseId = this.id || this.data.id;
      this.attach = false;
      this.reqAttach();
    },
    reqAttach() {
      const { curr_licenseId } = this;
      this.api(curr_licenseId).then(res => {
        if (res.code === "200") {
          this.tableData = res.data;
        }
      });
    },
    handleClickUpdate (item) {
      this.dialog.importFile = true;
      this.dialog.uploadId=item.id
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
      uploadDoc(wfForm, this.curr_id, this.id).then(res => {
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
      })
    },
    handleDelete({ fileCode, id }) {
    if (fileCode) {
        const apiMethod = deleteFileByFileCode;
        const message = '删除成功';
        apiMethod(fileCode).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message,
              type: 'success',
              position: 'bottom-right'
            });
            this.getAttachList(id);
          } else {
            this.$notify.error({
              title: '失败',
              message: res.message,
              position: 'bottom-right'
            });
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
#edits {
  .valueLine span {
    line-height: 35px !important;
  }
}
.box{
  margin-bottom: 20px;
}
.upload-button {
  margin: 12px 30px;
  width:64px;
  height:28px;
  background:rgba(219,233,255,1);
  color:#065BDC;
  font-size: 14px;
  cursor: pointer;
}
</style>
