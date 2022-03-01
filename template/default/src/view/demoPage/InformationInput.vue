<template>
   <div id="informationInput">
    <div class="content-bd">
      <el-form ref="formData" :rules="rules" :model="formData" label-width="150px" status-icon>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span><em></em>基本情况</span>
          </div>
           <el-row :gutter="10">
            <el-col :span="11">
                <el-form-item label="宗地编号："  prop="a">
                  <el-input v-model="formData.a" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="交易方式：" prop="b">
                <el-input v-model="formData.b" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="11">
                <el-form-item label="使用权面积(m)："  prop="c">
                  <el-input v-model="formData.c" placeholder="请输入内容"></el-input>
                  <i class="el-icon-question f-blue f-20 pos-a" style="right: -30px; top: 7px;"></i>
                </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="建筑面积：" prop="d">
                <el-input v-model="formData.d" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="11">
                <el-form-item label="用途："  prop="e">
                  <el-input v-model="formData.c" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="出让年限：" prop="f">
                <el-input v-model="formData.d" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span><em></em>规划指标要求</span>
          </div>
           <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item label="容积率："  prop="g">
                <el-row>
                  <el-col :span="12">
                      <el-input v-model="formData.g" placeholder="请输入内容"></el-input>
                  </el-col>
                  <el-col :span="10" :offset="2">
                    <el-select v-model="formData.h" placeholder="请选择" style="max-width: 100px;">
                      <el-option
                        v-for="item in [{
                          id: 0,
                          label: '小于等于'
                        }]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="宗地保证金缴纳时间：" prop="i">
                <el-input v-model="formData.i" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="11">
                <el-form-item label="保证金缴纳截至时间："  prop="j">
                  <el-date-picker
                    v-model="formData.j"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="竞买申请结束时间：" prop="k">
                <el-date-picker
                  v-model="formData.k"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="11">
                <el-form-item label="允许联合竞买："  prop="l">
                  <el-radio-group v-model="formData.l">
                    <el-radio :label="3">是</el-radio>
                    <el-radio :label="6">否</el-radio>
                  </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="出让年限：" prop="n">
                <el-select v-model="formData.n" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
                <el-form-item label="备注：" prop="m">
                  <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  v-model="formData.m">
                  </el-input>
                </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <div class="btnInfo text-center mt-10">
          <el-button class="resetBtn" size="small" @click="$_resetForm">取消</el-button>
          <el-button
            size="small"
            type="primary"
            class="submitBtn"
            @click="submitForm(1)"
            :disabled="$_loading"
          >确定</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formData: {
        a: '',
        b: '',
        c: '',
        d: '',
        e: '',
        f: '',
        g: '',
        h: '',
        i: '',
        j: '',
        k: '',
        l: '',
        n: '',
        m: ''
      },
      rules: {
        a: [
          { required: true, message: '请输入宗地编号', trigger: 'blur' }
        ],
        b: [
          { required: true, message: '请输入交易方式', trigger: 'blur' }
        ],
        c: [
          { required: true, message: '请输入使用权面积(m)', trigger: 'blur' }
        ],
        e: [
          { required: true, message: '请输入用途', trigger: 'blur' }
        ]
      },
      options: [{
        id: 0,
        label: '一通一平'
      }]
    };
  },
  methods: {
    // 确定数据
    submitForm () {
      const _this = this;
      this.$refs.formData.validate(valid => {
        if (valid) {
          // updatePassword(this.formData).then(res => {
          //   if (res.code == '200') {
          //     this.$notify({
          //       title: '成功',
          //       message: '修改密码成功',
          //       type: 'success',
          //       position: 'bottom-right'
          //     });
          //     this.$_resetForm()
          //   }
          // })
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
  }
};
</script>

<style lang="less">
#informationInput{
  background: #e6e6e6 !important;
  padding: 0 !important;
  border: none !important;
  .content-bd{
    padding-bottom: 50px;
  }
  .box-card{
    background:rgba(255,255,255,1);
    border: none;
    box-shadow: none;
    margin-bottom: 20px;
    border-radius: 0;
    /deep/.el-form-item{
      margin-bottom: 20px;
    }
    /deep/.el-date-editor.el-input{
      width: 100%;
    }
    /deep/.el-card__header{
      padding: 13px 26px;
      span{
        font-size:18px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(63,63,63,1);
        line-height:25px;
        display: flex;
        flex-direction: row;
        align-items: center;
        em{
          width:4px;
          height:19px;
          background:rgba(37,115,241,1);
          margin-right: 8px;
        }
      }
    }
    /deep/.el-card__body{
      padding: 26px;
      .help{
        font-size: 20px;
      }
    }
  }
  .btnInfo{
    height: 70px;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #fff;
    box-shadow:0px -3px 4px 0px rgba(222,222,222,0.5);
    padding: 15px 20px;
    display: flex;
    justify-content: flex-end;
    box-sizing: border-box;
    button{
      width:88px;
      height:40px;
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
    }
    .resetBtn{
      border:1px solid rgba(37,115,241,1);
      margin-right: 20px;
    }
    .submitBtn{
      background:rgba(37,115,241,1);
    }
  }
}
</style>
