<template>
  <div class="importTemp">
    <DialogCont
      @on-cancel="canceledit('close')"
      @on-close="canceledit('close')"
      :title="`${title}`"
      width="510px"
      :visible="show"
      ref="dialog"
      :bottomShow="false"
      customClass="flexColumn importTempDialog"
    >
      <el-upload
        class="upload-demo"
        action=""
        :on-preview="handlePreview"
        :on-success="handleSuccess"
        :limit="1"
        :http-request="httpRequest"
        :file-list="obj.fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </DialogCont>
  </div>
</template>
<script lang="ts">
import { ref, toRefs, reactive, onMounted, getCurrentInstance, watch } from "vue";
 import { ElNotification } from 'element-plus';
import DialogCont from '@/components/dialog/Dialog.vue';
import {
  importTemp
} from '@/api/systemManage';
export default {
  name: 'importTemp',
  components: {
    DialogCont
  },
  props: {
    title: {
      type: String,
      default: '导入模板'
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cancel'],
  setup(props: any, context: any) {
    const { show, title } = toRefs(props)
    const obj = reactive({
      fileList: []
    })
    const upload = ref<any>({})
    onMounted(() => {
       console.log('mounted!')
    })
    const canceledit = (type?: string) => {
      obj.fileList = [];
      context.emit('cancel', type)
    };
    const handleSuccess = (response: any, file: any, fileList: any) => {
      console.log(response, file, fileList)
    };
    const handlePreview = (file: any) => {
      console.log(file)
    };
    const httpRequest = (fileList: any) => {
      console.log('fileList', fileList)
      const wfForm = new FormData();
      wfForm.append("file", fileList.file);
      importTemp(wfForm).then((res: any) => {
        if (res && res.code === '200') {
          ElNotification({
            title: '成功',
            message: '导入模板成功',
            type: 'success',
            position: 'bottom-right'
          });
          canceledit('cancel');
        }
      })
    }
    return{
      obj,
      upload,
      canceledit,
      handleSuccess,
      handlePreview,
      httpRequest
    }
  }
}
</script>

<style lang="less" scoped>
.importTemp{
  padding-bottom: 20px;/*no*/
  .baseInfoInput{
    margin-bottom: 20px;/*no*/
  }
}
</style>
