<template>
  <div id="formItem">
    <el-form
      ref="formData"
      :model="preForm"
      :label-width="labelWidth"
      :rules="rules"
    >
      <wrapper
        v-for="(section, sIndex) in layout"
        :key="`section${sIndex}`"
        :title="section.title"
        v-if="!section.hide"
      >
        <el-row>
          <el-col
            v-for="(item, index) in section.formItems"
            :key="`item${sIndex}-${index}`"
            :span="(item && item.span) || 12"
            :offset="item.offset"
            v-if="!item.hide"
          >
            <el-form-item
              :label="`${item && item.label && (item.label + '：')}`"
              :label-width="(item.laberWidth !== undefined && item.laberWidth !== null) ? item.laberWidth : labelWidth"
              :prop="item && item.prop"
              :class="`${item.required && 'is-required'} ${item.class}`"
            >
                <div class="value" v-if="item.value && !item.prop">{{item.value}}</div>
                <div v-else>
                  <!-- 输入框 -->
                  <template v-if="item && item.inputType === 'input'">
                    <el-input
                      v-model="preForm[item.prop]"
                      :disabled="(item.disabled !== undefined && item.disabled !== null) && inPage != 'infoTrans' ? disabled : (item.disabled !== undefined ? item.disabled : disabled)"
                      :placeholder="item.placeholder ? item.placeholder : `请输入${item.label}`"
                      @input="change($event)"
                    >
                      <template slot="prepend" v-if="item.prepend">
                        <span @click.prevent.stop="item.prependClick">{{item.prepend}}</span>
                      </template>
                      <template slot="append" v-if="item.append">
                        <span
                          @click.prevent.stop="item.appendClick"
                          :style="{...item.appendStyle}"
                        >
                        {{item.append}}
                        </span>
                      </template>
                    </el-input>
                  </template>
                  <!-- 密码输入框 -->
                  <template v-if="item && item.inputType === 'inputPassWord'">
                    <el-input
                      v-model="form[item.prop]"
                      show-password
                      :disabled="disabled || item.disabled"
                      :placeholder="
                        item.placeholder ? item.placeholder : `请输入${item.label}`
                      "
                      @input="change($event)"
                    />
                  </template>
                  <template v-if="item && item.inputType === 'textarea'">
                    <el-input
                      v-model="preForm[item.prop]"
                      type="textarea"
                      :placeholder="item.placeholder ? item.placeholder : `请输入${item.label}`"
                      :disabled="(item.disabled !== undefined && item.disabled !== null) && inPage != 'infoTrans' ? disabled : (item.disabled !== undefined ? item.disabled : disabled)"
                      :autosize="{
                        minRows: 3
                      }"
                      :maxlength="+item.maxlength"
                      :show-word-limit="item.maxlength ? true : false"
                      @input="change($event)"
                    >
                    </el-input>
                  </template>
                  <!-- 数字输入框 -->
                  <template v-if="item && item.inputType === 'inputNumber'">
                    <el-input-number
                      v-model="preForm[item.prop]"
                      controls-position="right"
                      :controls="item.controls !== undefined ? item.controls : true"
                      :min="(item.min !== undefined) ? item.min : 1"
                      :type="item.type"
                      :precision="item.precision ? +item.precision : undefined"
                      :step="item.step ? +item.step : undefined"
                      :disabled="(item.disabled !== undefined && item.disabled !== null) && inPage != 'infoTrans' ? disabled : (item.disabled !== undefined ? item.disabled : disabled)"
                      :placeholder="item.placeholder ? item.placeholder : `请输入${item.label}`"
                      :style="`width: ${item.width ? item.width : '100%'}`"
                    >
                    </el-input-number>
                    <div class="inputNumberAppend">{{item.append}}</div>
                  </template>
                  <!-- 选择框 -->
                  <template v-if="item && item.inputType === 'select'">
                    <el-select
                      v-model="preForm[item.prop]"
                      :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
                      :disabled="(item.disabled !== undefined && item.disabled !== null) && inPage != 'infoTrans' ? disabled : (item.disabled !== undefined ? item.disabled : disabled)"
                      :filterable="item.allowCreate || false"
                      :allow-create="item.allowCreate || false"
                      :default-first-option="item.allowCreate || false"
                    >
                      <el-option
                        v-for="(option, oIndex) in item.options"
                        :label="option.label || option.name"
                        :value="option.id || option.value || option.code"
                        :key="`select-${option.id || option.value || option.code}-${oIndex}`"
                      />
                    </el-select>
                  </template>
                  <template v-if="item && item.inputType === 'dataPicker'">
                    <el-date-picker
                      v-model="preForm[item.prop]"
                      type="datetime"
                      :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
                      :disabled="(item.disabled !== undefined && item.disabled !== null) && inPage != 'infoTrans' ? disabled : (item.disabled !== undefined ? item.disabled : disabled)"
                      :format="item.format || 'yyyy-MM-dd HH:mm:ss'"
                      :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
                    >
                    </el-date-picker>
                  </template>
                  <template v-if="item && item.inputType === 'radio'" >
                    <el-radio-group
                      class="radioGroup"
                      v-model="preForm[item.prop]"
                      :disabled="(item.disabled !== undefined && item.disabled !== null) && inPage != 'infoTrans' ? disabled : (item.disabled !== undefined ? item.disabled : disabled)"
                    >
                      <el-radio
                        v-for="ch in item.options"
                        :label="ch.value || ch.id"
                        :key="ch.value || ch.id"
                      >
                        {{ch.text || ch.name || ch.label}}
                      </el-radio>
                    </el-radio-group>
                  </template>
                  <template v-if="item.inputType === 'radioGroupInput'">
                    <div class="flexRow radioGroupInput">
                      <el-radio-group v-model="form[item.prop]" :disabled="(item.disabled !== undefined && item.disabled !== null) && inPage != 'infoTrans' ? disabled : (item.disabled !== undefined ? item.disabled : disabled)">
                        <el-radio
                          v-for="(radioOption, rIndex) in item.radioOptions"
                          :key="`${radioOption.value}-${rIndex}-rop`"
                          :label="radioOption.value || radioOption.id"
                        >
                        {{radioOption.label}}
                        </el-radio>
                      </el-radio-group>
                      <el-input-number
                        v-model="form[item.inputProp]"
                        :precision="4"
                        controls-position="right"
                        v-if="item.inputShow"
                        :disabled="(item.disabled !== undefined && item.disabled !== null) && inPage != 'infoTrans' ? disabled : (item.disabled !== undefined ? item.disabled : disabled)"
                      />
                    </div>
                  </template>
                  <template v-if="item && item.inputType === 'custom'">
                    <slot :name="item.prop" :item="item"></slot>
                  </template>
                  <div class="error" v-if="item.error">{{item.error}}</div>
                </div>
            </el-form-item>
          </el-col>
        </el-row>
      </wrapper>
    </el-form>
    <!-- <div class="handle-footer" v-if="isEdit">
      <el-button class="reset-btn" @click="$_resetForm">
        取消
      </el-button>
      <el-button
        class="submit-btn"
        type="primary"
        :disabled="$_loading"
        @click="submitForm"
      >
        确定
      </el-button>
    </div> -->
  </div>
</template>

<script>
import Wrapper from '@/components/wrapper';
export default {
  data () {
    return {
      unChange: true,
      preForm: JSON.parse(JSON.stringify(this.form))
    };
  },
  components: {
    Wrapper
  },
  props: {
    form: {
      type: Object,
      default  () {
        return {}
      }
    },
    layout: {
      type: Array,
      default () {
        return null
      }
    },
    isEdit: {
      type: Boolean,
      default () {
        return false
      }
    },
    inPage: {
      type: String,
      default () {
        return ""
      }
    },
    rules: {
      type: Object,
      default () {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    submit: Function,
    labelWidth: {
      type: String,
      default: '120px'
    }
  },
  watch: {
    form: {
      deep: true,
      handler: function (nowVal, oldVal) {
        if (JSON.stringify(nowVal) !== JSON.stringify(this.preForm)) {
          this.preForm = JSON.parse(JSON.stringify(nowVal));
        }
      }
    },
    layout: {
      deep: true,
      handler: function (nowVal, oldVal) {
        this.$set(this.layout, nowVal);
      }
    },
    preForm: {
      deep: true,
      handler: function (nowVal, oldVal) {
        this.$emit('change', nowVal);
      }
    }
  },
  computed: {
  },
  created () {
    this.$nextTick(() => {

    });
  },
  methods: {
    submitForm () {
      let status;
      this.$refs.formData.validate(valid => {
        if (valid) {
          var $this = this;
          this.$emit('submit', this.preForm)
          status = true;
        } else {
          this.$notify.error({
            title: '失败',
            message: '请填写完整必填数据!!!',
            position: 'bottom-right'
          });
          status = false
          return status;
        }
      });
      return status;
    },
    cancelForm () {
      this.$refs.formData.clearValidate();
      this.$refs.formData.resetFields();
    },
    change (e) {
      this.$forceUpdate()
    },
    getValue (name) {
      return this.preForm[name];
    }
  }
};
</script>

<style lang="less">

#formItem{
  // .comp-wrapper-header{
  //   padding: 0;
  // }
  .el-form-item {
    margin-bottom: 12px;
    position: relative;
    .el-input{
      width: 100% !important;
    }
    .value{
      line-height: 35px;
    }
    .error{
      color: #F56C6C;
      font-size: 12px;
      line-height: 1;
      padding-top: 0px;
      position: absolute;
      top: 100%;
      left: 0;
    }
    .inputNumberAppend{
      position: absolute;
      top: 50%;
      right: 15px;
      transform: translateY(-50%);
    }
  }
  .el-input-number{
    width: 100%;
    display: block;
    line-height: 33px;
    height: 35px;
    >span{
      height: 17.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.el-input-number__increase{
        top: 2px;
      }
    }
    .el-input{
      input{
        text-align: left;
      }
    }
  }
  .radioGroup{
    width: 100%;
    text-align: left;
  }
}
.handle-footer {
  height: 70px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background: #fff;
  box-shadow: 0px -3px 4px 0px rgba(222, 222, 222, 0.5);
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
  box-sizing: border-box;
  z-index: 12000;
  button {
    width: 88px;
    height: 40px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
  .reset-btn {
    border: 1px solid rgba(37, 115, 241, 1);
    margin-right: 20px;
  }
  .submit-btn {
    background: rgba(37, 115, 241, 1);
  }
}
.radioGroupInput{
  height: 35px;
  .el-radio-group{
    align-items: center;
    display: flex;
    margin-right: 15px;
    .el-radio{
      margin-right: 10px;
    }
  }
  .el-input-number{
    display: flex;
    flex: 1;
    width: auto !important;
  }
  >span{
    display: flex;
    align-self: flex-end;
    line-height: initial;
  }
}
</style>

