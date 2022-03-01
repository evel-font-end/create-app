<template>
  <div id="upload">
    <!-- 文件上传 -->
    <div class="content-view mb-50">
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="postUrl"
        :on-remove="remove"
        :on-success="success"
        :on-error="error"
        :on-progress="progress"
        :on-change="change"
        :before-upload="beforeUpload"
        :accept="accept"
        :auto-upload="false"
        :http-request="httpRequest"
        :file-list="fileLists"
        :multiple="multiple"
        :limit="limit"
        :on-exceed="handleExceed"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
        >上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip" v-if="accept.length">只能上传{{accept}}文件</div>
      </el-upload>
      <div class="Modeltable">
            <el-table tooltip-effect="light" :data="fileList" stripe class="f-13 mt-10" style="width: 100%" border>
            <el-table-column prop="name" label="文件名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="size" label="大小" show-overflow-tooltip>
              <template slot-scope="scope">
                  {{Math.round(scope.row.size / 1024 * 100) / 100}}kb
              </template>
            </el-table-column>
            <el-table-column label="状态" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="scope.row.status == 'success'">
                    <span v-if="scope.row.response.data.success" style="color:#67c23a">上传成功</span>
                    <span v-else style="color:red">上传失败<br/><em class="f-12" style="color:#a5a5a5">({{scope.row.response.data.resultMsg}})</em></span>
                  </div>

                  <span v-if="scope.row.status == 'error'" style="color:red">上传失败</span>
                  <span v-if="scope.row.status == 'ready'">准备上传</span>
                  <span v-if="scope.row.status == 'uploading'" style="border:0" class="loading"><i class="iconfont icon-jiazailoading-A mr-5 anim-rotate anim-loop el-anim"></i>上传中...</span>
                </template>
            </el-table-column>
            </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'upload',
  props: {
    // 上传文件类型  .jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF
    accept: {
      type: String,
      default: ''
    },
    // 上传地址
    postUrl: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 10
    },
    fileLists: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      fileList: []
    };
  },
  watch: {
    fileLists (newValue, oldValue) {
      this.fileList = newValue;
    }
  },
  methods: {
    submitUpload () {
      this.$refs.upload.submit();
      this.$emit('submit')
    },
    // 文件列表移除文件时的钩子
    remove (file, fileList) {
      this.$emit('remove', {file, fileList})
    },
    // 文件上传成功时的钩子
    success (response, file, fileList) {
      this.$emit('success', {response, file, fileList})
    },
    // 文件上传失败时的钩子
    error (err, file, fileList) {
      this.$emit('error', {err, file, fileList})
    },
    // 文件上传时的钩子
    progress (event, file, fileList) {
      this.$emit('progress', {event, file, fileList})
    },
    beforeUpload (file) {
      this.$emit('beforeUpload', {file})
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    change (file, fileList) {
      this.fileList = fileList
      this.$emit('change', {file, fileList})
    },
    httpRequest () {
      this.$emit('httpRequest');
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
  }
};
</script>

<style lang="less">
</style>
