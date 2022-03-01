<template>
  <div id="operationDictionaries">
    <!-- 字典管理 - 新增/修改字典 -->
    <div class="content-bd">
      <el-form
        status-icon
        :model="dictionariesInfo"
        label-width="110px"
        ref="formData"
        :rules="rules"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="字典编码：" prop="code">
              <el-input :disabled="stateType === 'show'" v-model="dictionariesInfo.code">
                <i
                  slot="suffix"
                  title="请输入字典编码"
                  v-if="rulesTips.code"
                  class="el-input__icon validateIconErrorIcon el-icon-circle-close"
                ></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典排序：" prop="sortKey" label-width="82px">
              <el-input
                v-model="dictionariesInfo.sortKey"
                :class="dictionariesInfo.is_error?'is_errorFrom' : ''"
                :disabled="stateType === 'show'"
              >
                <i
                  slot="suffix"
                  :title="rulesTips.sortKeyTitle"
                  v-if="rulesTips.sortKey"
                  class="el-input__icon validateIconErrorIcon el-icon-circle-close"
                ></i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="字典名称/值：" prop="name">
              <el-input v-model="dictionariesInfo.name" :disabled="stateType === 'show'">
                <i
                  slot="suffix"
                  title="请输入字典名称/值"
                  v-if="rulesTips.name"
                  class="el-input__icon validateIconErrorIcon el-icon-circle-close"
                ></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典值：" prop="value" label-width="82px">
              <el-input v-model="dictionariesInfo.value" :disabled="stateType === 'show'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="字典描述：" prop="description">
              <el-input v-model="dictionariesInfo.description" :disabled="stateType === 'show'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getDictionaryManagerTypes, findSortKeyIsRepeated } from '@/api';
export default {
  name: 'operationDictionaries',
  props: {
    stateType: {
      type: String,
      default: 'add' // add 新增字典  show查看字典   edit修改字典信息
    },
    getUserInfo: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    let sortNumber = (rule, value, callback) => {
      let regex = /^[0-9]{1,3}$/;
      if (!value) {
        this.$set(this.rulesTips, 'sortKeyTitle', '请输入字典排序');
        this.$set(this.rulesTips, rule.fullField, true);
        return callback(new Error(' '));
      } else if (!regex.test(value)) {
        this.$set(this.rulesTips, 'sortKeyTitle', '字典排序不能超过3位数字');
        this.$set(this.rulesTips, rule.fullField, true);
        return callback(new Error(' '));
      } else {
        this.$set(this.rulesTips, rule.fullField, false);
        callback();
      }
    };
    return {
      // 基本信息
      dictionariesInfo: {
        code: '', // 字典编码
        name: '', // 字典名称/值
        value: '', // 字典值
        parentCode: '', // 父级字典编码
        description: '', // 字典类型
        sortKey: '', // 字典排序
        type: 0, // 管理类别
        is_errorIcon: '',
        is_error: '',
        id: ''
      },
      dictionaryTypes: [], // 字典类型
      // 验证
      rules: {
        sortKey: [
          {
            required: true,
            validator: sortNumber,
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            validator: this.$_checkValidate,
            trigger: 'change'
          }
        ],
        code: [
          {
            required: true,
            validator: this.$_checkValidate,
            trigger: 'change'
          }
        ]
      },
      // 验证提示
      rulesTips: {
        sortKey: false, // 字典排序
        name: false, // 字典名称/值
        code: false, // 字典编码
        sortKeyTitle: '请输入字典排序' // 字典排序描述
      }
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.addUserInfo(this.getUserInfo);
    });
  },
  watch: {
    // 同步更新数据显示
    getUserInfo (newVal, oldVal) {
      this.$_resetForm();
      this.addUserInfo(newVal);
    }
  },
  methods: {
    // 校验英文名称 模型code是否重复
    checkModelCode () {
      if (
        !this.dictionariesInfo.sortKey ||
        this.dictionariesInfo.sortKey.toString().length > 3
      ) {
        this.$set(this.dictionariesInfo, 'is_error', false);
        this.$set(this.dictionariesInfo, 'is_errorIcon', '12');
        return;
      }

      this.$set(this.dictionariesInfo, 'is_errorIcon', 'el-icon-loading');

      findSortKeyIsRepeated(
        this.dictionariesInfo.parentCode,
        this.dictionariesInfo.sortKey
      ).then(res => {
        if (res.code === '200') {
          if (res.data) {
            this.$set(this.dictionariesInfo, 'is_error', true);
            this.$set(
              this.dictionariesInfo,
              'is_errorIcon',
              'el-icon-info redIcon'
            );
          } else {
            this.$set(this.dictionariesInfo, 'is_error', false);
            this.$set(
              this.dictionariesInfo,
              'is_errorIcon',
              'el-icon-success successIcon'
            );
          }
        } else {
          this.$set(this.dictionariesInfo, 'is_error', false);
          this.$set(
            this.dictionariesInfo,
            'is_errorIcon',
            'el-icon-success successIcon'
          );
        }
      });
    },
    // 搜索下拉 获取字典类型
    getDictionaryList () {
      getDictionaryManagerTypes().then(res => {
        if (res.code === '200') {
          this.dictionaryTypes = Object.freeze(res.data);
        }
      });
    },
    // 同步更新数据显示
    addUserInfo (newVal) {
      const _this = this;
      let obj = newVal;
      class DataInfo {
        constructor ({
          code = '',
          name = '',
          description = '',
          sortKey = '',
          type = 0,
          id = '',
          value = '',
          parentCode
        }) {
          this.code = code;
          this.name = name;
          this.parentCode = parentCode;
          this.description = description;
          this.sortKey = String(sortKey);
          this.id = id;
          this.value = value;
          this.type = type;
        }
      }

      if (this.stateType === 'add') {
        obj.sortKey = '';
        obj.code = '';
        obj.value = '';
        obj.description = '';
        this.$_resetForm();
      }

      this.dictionariesInfo = new DataInfo({ ...obj });
    },
    // 抛出当前定义的数据
    submitForm () {
      this.$refs.formData.validate(valid => {
        if (this.dictionariesInfo.is_error) {
          this.$notify.error({
            title: '失败',
            message: '排序值重复,请重新输入',
            position: 'bottom-right'
          });
          return false;
        }

        if (valid && !this.dictionariesInfo.is_error) {
          this.dictionariesInfo.sortKey = parseInt(
            this.dictionariesInfo.sortKey
          );
          this.$emit('success-from', this.dictionariesInfo, this.stateType);
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
    // 重置验证规则状态
    resetRulesTips () {
      this.rulesTips = Object.assign(this.rulesTips, {
        sortKey: false, // 字典排序
        name: false, // 字典名称/值
        code: false // 字典编码
      });
    }
  }
};
</script>

<style lang="less">
#operationDictionaries {
  /deep/.el-form-item{
    padding-bottom: 12px;
    margin-bottom: 0;
  }
  .is_errorFrom.el-input--suffix .el-input__inner {
    border-color: #f56c6c;
  }
  .redIcon {
    color: #f56c6c;
  }
  .successIcon {
    color: #67c23a;
  }
}
</style>
