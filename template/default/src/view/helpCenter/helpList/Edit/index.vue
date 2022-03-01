<template>
  <dialog-cont
    @on-confirm="confirmedit"
    @on-close="canceledit"
    @on-open="openedit"
    :title="type==='add'?'新增资料':(type==='edit'?'编辑资料':'资料详情')"
    
    :visible.sync="editshow"
    ref="dialog"
    :dialogModel="dialogModel"
    :confirmShow="edit"
    :cancelShow="edit"
    :bottomShow="edit"
  >
    <div>
      <el-form ref="formData" :rules="rules" :model="formData" label-width="160px" status-icon>
        <wrapper title="资料基本情况">
          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="资料名称：" prop="name">
                <el-input v-model="formData.name" style="width:300px;" :disabled="edit ? false : true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="资料类型：" prop="helpType">
                <el-select
                  :disabled="edit ? false : true"
                  v-model="formData.helpType"
                  placeholder="请选择资料类型"
                >
                  <el-option
                    v-for="item in Options.helpType"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="文件说明：" prop="remark">
                <el-input 
                  type="textarea" 
                  v-model="formData.remark" 
                  :autosize="{ minRows: 3 }"
                  :maxlength="200"
                  :show-word-limit="true" 
                  style="width:780px;"
                  :disabled="edit ? false : true"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </wrapper>
        <wangeditor ref="editor" @catchData="catchData" :data="editData" :html="formData.htmlContent"/>
        <Attach :initId="initId" :edit="edit" />
      </el-form>
    </div>
  </dialog-cont>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Wrapper from '@/components/wrapper'
import Attach from './attach.vue';
import dialogCont from '@/components/dialog';
import Wangeditor from './editor.vue';
import {
  getHelpType,
  getAddTransHelp,
  getUpdateTransHelp,
  initHelpAttach
} from '@/api/helpCenter/helpList';
export default {
  name: 'normalDetail',
  components: {
    Wrapper,
    Attach,
    dialogCont,
    Wangeditor
  },
  props: {
    type: '',
    show: '',
    dialogModel: true,
    data: ''
  },
  data () {
    return {
      formData: {
        id:'',
        name:'',
        helpType:'',
        remark:'',
        // isValid:1,
        htmlContent:'',
        // status:''
      },
      rules: {
        name: [
          { required: true, message: '请选择资料类型', trigger: 'blur' }
        ],
        helpType: [
          { required: true, message: '请选择资料类型', trigger: 'blur' }
        ]
      },
      Options: {
        helpType: [],
      },
      edit: true,
      editshow: false,
      pageType: '',
      initId: '',
      selectBindList: [],
      editData: {}
    };
  },
  watch: {
    data: {
      deep: true,
      handler (newval, oldval) {
        this.initId = newval.id;
        this.editData = newval;
        this.pageType = newval.type;
        if(newval.type === 'info'){
          this.edit = false;
        }
        if (!this.dialogModel) {
          // this.openedit()
        }
      }
    },
    show (val) {
      this.editshow = val;
      this.initId = this.data.id;
      this.pageType = this.type;
       if(this.type === 'info'){
        this.edit = false;
      }
    },
  },
  created () {
    if ((this.data && this.data.hasOwnProperty('id')) && !this.dialogModel) {
      // this.editshow = this.data;
      this.editData = this.data
      this.initId = this.data.id;
      this.pageType = this.data.type;
      this.edit = false;
      this.openedit()
    } else {
      this.editshow = this.show;
      this.initId = this.id;
    }
  },
  methods: {
    
    handleData (val) {
      this.$emit('catchData', val);
    },
    canceledit () {
      this.editshow = false;
      this.$emit('cancel');
      this.Options = {
        helpType: []
      };
      this.formData = {
        id:'',
        name:'',
        helpType:'',
        remark:'',
        htmlContent:'',
      };
      this.editData = {};
      this.edit = true;
      this.editshow = false;
      this.pageType = '';
      this.initId = '';
      this.$_resetForm();
    },
    catchData (val) {
      this.formData.htmlContent = val;
    },
    confirmedit () {
      this.submitForm();
    },
    /**
     * 获取资料类型下拉框数据
     */
    _getHelpType() {
      this.Options.helpType = [];
      getHelpType().then(res => {
        if (res.code === "200") {
          res.data.map(item => {
            this.Options.helpType = res.data;
          });
        }
        this.$forceUpdate();
      });
    },
    openedit () {
      this.editshow = this.show;
      this.initId = this.data.type === 'add' ? '' : this.data.data.id;
      this.pageType = this.type || (this.data && this.data.type);
      this._getHelpType();
      if (this.pageType === 'info') {
        this.edit = false;
        this.formData = {
          name: this.editData.data.name,
          helpType: this.editData.data.helpType+'',
          remark: this.editData.data.remark,
          htmlContent: this.editData.data.htmlContent
        }
      }else if(this.pageType === 'edit'){
        this.edit = true;
        this.formData = {
          name: this.editData.data.name,
          helpType: this.editData.data.helpType+'',
          remark: this.editData.data.remark,
          htmlContent: this.editData.data.htmlContent
        }
      } else {
        this._getInitHelpAttach()
        this.edit = true;
      }
    },
    // 新增时初始化附件信息，获取id
    _getInitHelpAttach () {
      initHelpAttach()
        .then(res => {
          this.initId = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 确定数据
    submitForm () {
      let vm = this;
      this.$refs.formData.validate(valid => {
        const formData = {
          ...this.formData
        };
        formData.id = this.initId;
        if (valid) {
          formData.htmlContent = this.$refs.editor.getHtmlValue();
          if(!formData.htmlContent){
            this.$notify.error({
              title: '失败',
              message: '请填写附件内容!!!',
              position: 'bottom-right'
            });
            return;
          }
          if(this.pageType === 'add'){
            getAddTransHelp(formData)
            .then(res => {
              if (res.code === '200') {
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  position: 'bottom-right'
                });
                vm.$emit('cancel', res.code);
              }
            })
            .catch(err => {
              console.log(err);
            });
          }else{
            getUpdateTransHelp(formData)
            .then(res => {
              if (res.code === '200') {
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  position: 'bottom-right'
                });
                vm.$emit('cancel', res.code);
              }
            })
            .catch(err => {
              console.log(err);
            });
          }
          
        } else {
          this.$notify.error({
            title: '失败',
            message: '请填写完整必填数据!!!',
            position: 'bottom-right'
          });
          return false;
        }
      });
    },
    closeEdit (type) {
      this.$refs.editor.clear();
      this.canceledit();
    }
  }
};
</script>

<style lang="less" scoped>
.box {
  // padding: 20px !important;
  width: 100%;
  height: 100%;
  // background: #e6e6e6 !important;
  .el-table__fixed-body-wrapper,
  .el-table__fixed-header-wrapper {
    z-index: 0;
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
.inb {
  display: inline-block;
  vertical-align: middle;
}
.va-m {
  vertical-align: -webkit-baseline-middle;
}
.bottom-btn{
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
/deep/.el-form-item {
  margin-bottom: 12px;
}
</style>
