<template>
  <div id="adminFormItem">
    <el-form
      ref="preForm"
      :model="data.preForm"
      :label-width="data.labelWidth"
      :rules="data.preRules"
    >
      <!-- <baseInfo :formItems="formItems" :disabled="disabled" :form="preForm"/> -->
      <el-row :gutter="10">
        <el-col
          v-for="(item, index) in formItems"
          :key="`item-${index}`"
          :span="(item && item.span) || 12"
          :offset="item.offset"
          :style="item.style"
        >
          <el-form-item
            :class="item.class"
            :label="
              item.label != '' && item.label
                ? item.label + (item.label.indexOf('：') > -1 ? '' : '：')
                : ''
            "
            :label-width="
              `${
                !item.label
                  ? '0px'
                  : item.labelWidth
                  ? item.labelWidth
                  : data.labelWidth
              }`
            "
            :prop="item && item.prop"
            v-if="!item.hide"
          >
            <div
              v-if="item.value && !item.prop && !item.custom"
              class="textItem"
            >
              <div>{{ item.value }}</div>
              <slot :name="item.prop" :value="data.preForm[item.prop]" />
            </div>

            <!-- <slot
              :name="item.prop"
              :value="data.preForm[item.prop]"
            /> -->
            <div v-if="!item.custom && item.prop">
              <!-- 输入框 -->
              <template v-if="item && item.inputType === 'input'">
                <el-input
                  v-model="data.preForm[item.prop]"
                  :disabled="item.disabled || data.disabled"
                  :show-password="item.showPassword || false"
                  :type="item.type || 'text'"
                  :placeholder="
                    item.placeholder ? item.placeholder : `请输入${item.label}`
                  "
                  @change="
                    value => {
                      onChange(value, item.onChange);
                    }
                  "
                />
                <div style="line-height: 1.5;">{{item.tip}}</div>
              </template>
              <template v-if="item && item.inputType === 'inputUnit'">
                <el-input
                  v-model="data.preForm[item.prop]"
                  :placeholder="
                    item.placeholder ? item.placeholder : `请输入${item.label}`
                  "
                  :disabled="data.disabled || item.disabled"
                >
                  <template #append>{{ item.unit }}</template>
                </el-input>
              </template>
              <template v-if="item && item.inputType === 'inputRang'">
                <el-row>
                  <el-col :span="10">
                    <el-form-item prop="min">
                      <el-input
                        v-model="data.preForm[item.prop].min"
                        :disabled="item.disabled || data.disabled"
                        :placeholder="
                          item.placeholder
                            ? item.placeholder[0]
                            : `请输入${item.label}最小值`
                        "
                        @input="change($event)"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" :style="{ textAlign: 'center' }">
                    至
                  </el-col>
                  <el-col :span="10">
                    <el-form-item prop="min">
                      <el-input
                        v-model="data.preForm[item.prop].max"
                        :disabled="item.disabled || data.disabled"
                        :placeholder="
                          item.placeholder
                            ? item.placeholder[1]
                            : `请输入${item.label}最大值`
                        "
                        @input="change($event)"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
              <template v-if="item && item.inputType === 'textarea'">
                <el-input
                  v-model="data.preForm[item.prop]"
                  type="textarea"
                  :placeholder="
                    item.placeholder ? item.placeholder : `请输入${item.label}`
                  "
                  :disabled="item.disabled || data.disabled"
                  :autosize="{
                    minRows: item.minRows || 3
                  }"
                  :show-word-limit="!!item.maxlength"
                  :maxlength="item.maxlength"
                  @input="change($event)"
                >
                </el-input>
              </template>
              <!-- 数字输入框 -->
              <template v-if="item && item.inputType === 'inputNumber'">
                <div class="flexRow">
                  <el-input-number
                    v-model="data.preForm[item.prop]"
                    controls-position="right"
                    :min="item.min || 1"
                    :max="item.max || 'Infinity'"
                    :disabled="item.disabled || data.disabled"
                    :placeholder="
                      item.placeholder
                        ? item.placeholder
                        : `请输入${item.label}`
                    "
                  ></el-input-number>
                  <div style="margin-left: 10px" v-if="item.relevanceLabel">
                    {{ item.relevanceLabel }}
                  </div>
                </div>
              </template>
              <template v-if="item && item.inputType === 'cascader'">
                <Cascader
                  :model="data.preForm[item.prop]"
                  @change="(val) => { data.preForm[item.prop] = val }"
                />
              </template>
              <!-- 密码输入框 -->
              <template v-if="item && item.inputType === 'inputPassWord'">
                <el-input
                  v-model="data.preForm[item.prop]"
                  show-password
                  :disabled="data.disabled || item.disabled"
                  :placeholder="
                    item.placeholder ? item.placeholder : `请输入${item.label}`
                  "
                  @change="change($event)"
                />
                <p style="line-height: 1.5;">{{item.tip}}</p>
              </template>
              <!-- 选择框 -->
              <template v-if="item && item.inputType === 'select'">
                <el-select
                  @change="val => handleSelectChange(val, item.prop)"
                  v-model="data.preForm[item.prop]"
                  :placeholder="
                    item.placeholder ? item.placeholder : `请选择${item.label}`
                  "
                  :disabled="item.disabled || disabled"
                  :multiple="item.multiple || false"
                  value-key="name"
                >
                  <el-option
                    v-for="(option, oIndex) in item.options"
                    :label="option.name || option.value"
                    :value="item.obj ? option : option.id"
                    :key="`select-${oIndex}`"
                  />
                </el-select>
              </template>
              <!-- 选择框 -->
              <template v-if="item && item.inputType === 'switch'">
                <el-switch
                  v-model="data.preForm[item.prop]"
                  :active-color="item.activeColor || '#2870FF'"
                  :inactive-color="item.inactiveColor || '#e0e0e0'"
                >
                </el-switch>
              </template>
              <template v-if="item && item.inputType === 'slider'">
                <el-slider
                  v-model="data.preForm[item.prop]"
                  :show-input="item.showInput || false"
                >
                </el-slider>
              </template>
              <template v-if="item && item.inputType === 'dataPicker'">
                <el-date-picker
                  v-model="data.preForm[item.prop]"
                  type="date"
                  :placeholder="
                    item.placeholder ? item.placeholder : `请选择${item.label}`
                  "
                  :disabled="item.disabled || data.disabled"
                  :format="
                    item.format || 'yyyy 年 MM 月 dd 日  HH 时 mm 分 ss 秒'
                  "
                  :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
                >
                </el-date-picker>
              </template>
              <template v-if="item && item.inputType === 'datetimePicker'">
                <el-date-picker
                  v-model="data.preForm[item.prop]"
                  type="datetime"
                  :placeholder="
                    item.placeholder ? item.placeholder : `请选择${item.label}`
                  "
                  :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
                >
                </el-date-picker>
              </template>
              <template v-if="item && item.inputType === 'daterange'">
                <el-date-picker
                  v-model="data.preForm[item.prop]"
                  :type="item.type || 'daterange'"
                  range-separator="至"
                  :start-placeholder="`请选择开始日期`"
                  :end-placeholder="`请选择结束日期`"
                  :disabled="
                    item.disabled !== undefined || item.disabled !== null
                      ? item.disabled
                      : data.disabled
                  "
                  :format="
                    item.format || 'yyyy 年 MM 月 dd 日  HH 时 mm 分 ss 秒'
                  "
                  :value-format="item.formatValue || 'yyyy-MM-dd HH:mm:ss'"
                >
                </el-date-picker>
              </template>
              <template v-if="item && item.inputType === 'timePicker'">
                <el-time-picker
                  :is-range="item.range || false"
                  :arrow-control="false"
                  v-model="data.preForm[item.prop]"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  :disabled="
                    item.disabled !== undefined || item.disabled !== null
                      ? item.disabled
                      : data.disabled
                  "
                  :format="item.format || 'HH:mm'"
                  :value-format="item.formatValue || 'HH:mm'"
                />
              </template>
              <template v-if="item && item.inputType === 'radio'">
                <el-radio-group
                  class="radioGroup"
                  v-model="data.preForm[item.prop]"
                  :disabled="
                    item.disabled !== undefined || item.disabled !== null
                      ? item.disabled
                      : data.disabled
                  "
                >
                  <el-radio
                    v-for="ch in item.options"
                    :label="ch.value || ch.id"
                    :key="ch.value || ch.id"
                  >
                    {{ ch.text || ch.name }}
                  </el-radio>
                </el-radio-group>
              </template>
              <template v-if="item && item.inputType === 'checkbox'">
                <el-checkbox-group
                  class="checkBoxGroup"
                  v-model="data.preForm[item.prop]"
                >
                  <el-checkbox
                    v-for="ch in item.options"
                    :key="ch.value || ch.id"
                    :label="ch.text || ch.name"
                    :disabled="
                      item.disabled !== undefined || item.disabled !== null
                        ? item.disabled
                        : false
                    "
                  >
                  </el-checkbox>
                </el-checkbox-group>
              </template>
              <template v-if="item && item.inputType === 'editor'">
                <!-- <quill-editor
                  ref="myQuillEditor"
                  v-model="preForm[item.prop]"
                  class="myQuillEditor"
                  :options="editorOption"
                  @focus="onEditorFocus($event)"
                  @blur="onEditorBlur($event)"
                  @change="onEditorChange($event)"
                /> -->
              </template>
              <template v-if="item && item.inputType === 'selectTree'">
                <!-- <treeselect
                  :style="{ maxWidth: item.width ? item.width : '330px' }"
                  :multiple="item.multiple || false"
                  :options="item.options"
                  :disable-branch-nodes="item.disableBranch || false"
                  :normalizer="
                    node => {
                      return formatterNode(node, item.normalizer);
                    }
                  "
                  :load-options="
                    ({ action, parentNode, callback }) => {
                      return loadOptions(
                        action,
                        parentNode,
                        callback,
                        item.callback
                      );
                    }
                  "
                  :placeholder="
                    item.placeholder ? item.placeholder : `请选择${item.label}`
                  "
                  :valueFormat="item.value || id"
                  v-model="preForm[item.prop]"
                /> -->
              </template>
              <template v-if="item && item.inputType === 'custom'">
                <slot :name="item.prop"></slot>
              </template>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="handle-footer" v-if="isEdit && haveFoot">
      <el-button class="reset-btn" @click="$_resetForm"> 取消 </el-button>
      <el-button
        class="submit-btn"
        type="primary"
        :disabled="$_loading"
        @click="submitForm"
      >
        确定
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { toRefs, ref, reactive, onMounted, getCurrentInstance, watch, watchEffect } from "vue";
import { ElNotification } from 'element-plus';
import type { FormInstance, FormRules } from "element-plus"
import Cascader from '../cascader.vue';
// import treeselect from "@riophae/vue-treeselect";
export default {
  components: {
    Cascader
  },
  props: {
    form: {
      type: Object,
      default() {
        return {};
      }
    },
    formItems: {
      type: Array,
      default() {
        return [];
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return false;
      }
    },
    rules: {
      type: Object,
      default() {
        return {};
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    submit: Function,
    labelWidth: {
      type: [Number, String],
      default: "120px"
    },
    haveFoot: {
      type: Boolean,
      default: false
    },
    midway: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change', 'select', 'submit'],
  setup(props: any, content: any) {
    const { form, midway, layout, formItems, rules, disabled, labelWidth } = toRefs(props);
    let data: any = reactive({
      unChange: true,
      preForm: JSON.parse(JSON.stringify(props.form)),
      preFormItems: [],
      preRules: props.rules,
      tempPreForm: {},
      form: form,
      labelWidth: labelWidth,
      disabled: disabled
    });
    console.log('data', data);
    const preForm = ref<FormInstance | null>({})
    watch(data.preForm, (changeValue) => {
      if(JSON.stringify(changeValue) !== JSON.stringify(props.form)) {
        content.emit('change', changeValue)
      }
    })
    watch(() => props.form, (formVal) => {
      const changeForm = midway
          ? { ...data.preForm, ...formVal }
          : formVal;
      if (JSON.stringify(changeForm) === JSON.stringify(data.preForm)) return;
      data.preForm = JSON.parse(JSON.stringify(changeForm));
    })
    watch(() => props.formItems, (nowVal) => {
      if (nowVal !== data.preFormItems) {
        // formItems = nowVal;
        data.preFormItems = nowVal;
      }
      if (nowVal.length !== data.preFormItems.length) {
        setRules(nowVal);
      }
    })
    onMounted(() => {
    })
    const submitForm = () => {
      preForm.value.validate((valid: any) => {
        if (valid) {
          content.emit("submit", data.preForm);
        } else {
          ElNotification({
            title: "失败",
            message: "请填写完整必填数据!!!",
            position: "bottom-right",
            type: 'error'
          });
          return false;
        }
      });
    };
    const cancelForm = () => {
      preForm.value.resetFields();
    };
    const resetForm = () => {
      data.preForm = {};
      preForm.value.resetFields();
      console.log('resetFields');
    };
    const onChange = (val: any, fun: any) => {
      if (fun) {
        if (typeof fun == "function") {
          fun(val);
        } else {
          return;
        }
      }
    };
    const getValue = async(name = false, canValid = true) => {
      if (canValid) {
        let validValue = await preForm.value.validate().then((valid: any) => {
          if (valid) {
            return data.preForm;
          } else {
            ElNotification({
              title: "失败",
              message: "请填写完整必填数据!!!",
              position: "bottom-right",
              type: 'error'
            });
            return false;
          }
        });
        return validValue;
      } else {
        if (name) {
          return data.preForm[(name) as any];
        }
        return data.preForm;
      }
    };
    // 延迟加载
    const loadOptions = (action: any, parentNode: any, callback: any, fn: any) => {
      if (fn) {
        if (typeof fn == "function") {
          fn(action, parentNode, callback);
          // callback()
        } else {
          return;
        }
      }
    };
    // 自定义健名
    const formatterNode = (node: any, fun: any) => {
      if (fun) {
        if (typeof fun == "function") {
          return fun(node);
        } else {
          return;
        }
      }
    };
    const setRules = (formItemsVal: any) => {
      let preRules: FormRules = {};
      formItemsVal.map((item: any) => {
        if (props.rules[item.prop]) {
          preRules[item.prop] = props.rules[item.prop];
        } else if (item.required && !item.hide) {
          const message = item.inputType === "select" ? "请选择" : "请输入";
          const trigger = item.inputType === "select" ? "change" : "blur";
          preRules[item.prop] = {
            required: true,
            message: `${message}${item.label}`,
            trigger
          };
        }
      });
      data.preRules = preRules;
    };
    const handleSelectChange = (val: any, props: any) => {
      data.preForm[props] = val;
      content.emit("select", data.preForm);
    }
    if (!disabled.value) {
      setRules(formItems.value);
    }
    return {
      data,
      preForm,

      submitForm,
      cancelForm,
      resetForm,
      onChange,
      getValue,
      loadOptions,
      formatterNode,
      setRules,
      handleSelectChange
    }
  }
};
</script>

<style lang="less" scoped>
#adminFormItem {
  &:deep(.el-form-item) {
    min-height: 36px !important; /*no*/
    height: auto;
    margin-bottom: 12px; /*no*/
    align-items: center;
    &.noBottom {
      margin-bottom: 0;
    }
    &.is-error {
      margin-bottom: 20px; /*no*/
    }
    .el-form-item__label {
      font-size: 14px; /*no*/
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 36px; /*no*/
      color: #666666;
      align-self: flex-start;
    }
    .textItem{
      color: #31353E;
    }
    input {
      // min-width: 200px;/*no*/
      font-size: 12px; /*no*/
      // font-family:PingFangSC-Regular,PingFang SC;
      font-weight: 400;
      // color:rgba(230,236,255,1);
      // background:#fff;
      border-radius: 4px; /*no*/
      // border:1px solid rgba(98,117,191,1);
      color: rgb(136, 96, 96);
    }
    textarea {
      font-size: 12px; /*no*/
      font-weight: 400;
      min-width: 200px; /*no*/
      // max-width: 350px;/*no*/
    }
    .filter-item-input {
      width: 250px; /*no*/
    }
    .el-form-item__content {
      min-height: 36px; /*no*/
      height: auto;
      line-height: 36px; /*no*/
    }
    .el-cascader {
      width: 100%;
      line-height: 0 !important;
    }
    .el-input {
      width: 100% !important;
      input {
        height: 36px !important; /*no*/
      }
      &.is-disabled {
        input {
          color: #606266;
        }
      }
    }
    .el-range-editor {
      min-width: 200px; /*no*/
      max-width: 350px; /*no*/
      input {
        min-width: auto;
      }
      .el-range-separator {
        width: auto;
      }
    }
  }
  .el-row {
    .el-col {
      &:last-child {
        .el-form-item {
          margin-bottom: 0;
        }
      }
    }
  }
  .el-input-number:not(.el-slider__input) {
    width: 100%;
    display: block;
    line-height: 36px; /*no*/
    height: 36px; /*no*/
    > span {
      height: 15px; /*no*/
      display: flex;
      align-items: center;
      justify-content: center;
      &.el-input-number__increase {
        top: 2px; /*no*/
      }
      &.nput-number__decrease {
        bottom: 0px; /*no*/
      }
    }
    .el-input {
      input {
        text-align: left;
      }
    }
  }
  .el-slider {
    .el-slider__runway {
      width: calc(100% - 10px); /*no*/
      margin: 12px 0; /*no*/
      margin-left: 10px; /*no*/
      .el-slider__button-wrapper {
        height: 36px; /*no*/
        width: 30px; /*no*/
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .radioGroup {
    width: 100%;
    text-align: left;
    label {
      margin-right: 30px;
      margin-left: 0;
    }
  }
  /deep/.vue-treeselect {
    height: 36px; /*no*/
    .vue-treeselect__control {
      height: 36px; /*no*/
      font-size: 12px; /*no*/
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(230, 236, 255, 1);
      border-radius: 4px; /*no*/
      .vue-treeselect__value-container {
        height: 36px; /*no*/
        .vue-treeselect__multi-value {
          height: 36px; /*no*/
          margin-bottom: 0px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .vue-treeselect__input-container {
          padding-top: 0;
        }
        .vue-treeselect__multi-value-item-container {
          height: 24px; /*no*/
          padding: 0;
          .vue-treeselect__multi-value-item {
            height: 24px; /*no*/
            line-height: 24px; /*no*/
            margin: 2px 0 2px 6px;
            padding: 0 20px 0 8px;
            background-color: #f4f4f5;
            border-color: #e9e9eb;
            color: #909399;
            position: relative;
            border-radius: 4px; /*no*/
            .vue-treeselect__multi-value-label {
              padding: 0;
            }
            .vue-treeselect__value-remove {
              display: inline-block;
              color: #909399;
              padding: 0;
              background-color: #c0c4cc;
              border-radius: 50%;
              height: 16px; /*no*/
              width: 16px; /*no*/
              line-height: 16px; /*no*/
              text-align: center;
              transform: scale(0.8);
              position: absolute;
              top: 0;
              svg {
                width: 12px;
                height: 12px;
              }
            }
          }
        }
      }
    }
    .vue-treeselect__menu-container {
      z-index: 1002 !important;
      .vue-treeselect__menu {
        padding: 0;
        margin-top: 10px; /*no*/
      }
    }
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
  z-index: 1;
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
</style>
