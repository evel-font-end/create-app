<template>
  <div id="base">
      <el-form
        ref="formData"
        :model="form"
        label-width="150px"
        :rules="formRules"
      >
        <wrapper
          v-for="(section, sIndex) in layout"
          :key="`section${sIndex}`"
          :title="section.title"
        >
          <el-row>
            <el-col
              v-for="(item, index) in section.formItems"
              :key="`item${sIndex}-${index}`"
              :span="item.span"
              :offset="item.offset"
              v-if="!item.hide"
            >
              <el-form-item :label="`${item.label}：`" :prop="item.prop">
                <!-- 输入框 -->
                <template v-if="item.inputType === 'input'">
                  <el-input
                    v-model.trim="form[item.prop]"
                    :disabled="inputDisabled"
                    :placeholder="item.placeholder ? item.placeholder : `请输入${item.label}`"
                  />
                </template>
                <template v-if="item && item.inputType === 'inputNumber'">
                    <el-input-number
                      v-model="form[item.prop]"
                      controls-position="right"
                      :controls="item.controls !== undefined ? item.controls : true"
                      :min="(item.min !== undefined) ? item.min : 1"
                      :type="item.type"
                      :precision="item.precision ? +item.precision : undefined"
                      :step="item.step ? +item.step : undefined"
                      :disabled="inputDisabled"
                      :placeholder="item.placeholder ? item.placeholder : `请输入${item.label}`"
                      :style="`width: ${'100%'}`"
                    >
                    </el-input-number>
                    <div class="inputNumberAppend">{{item.append}}</div>
                  </template>
                <!-- 选择框 -->
                <template v-if="item.inputType === 'select'">
                  <el-select
                    v-model="form[item.prop]"
                    :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
                    :disabled="inputDisabled"
                    :filterable="item.allowCreate || false"
                    :allow-create="item.allowCreate || false"
                    :default-first-option="item.allowCreate || false"
                  >
                    <el-option
                      v-for="(option, oIndex) in item.options"
                      :label="option.label || option.name"
                      :value="option.value || option.id || option.code"
                      :key="`select-${oIndex}`"
                    />
                  </el-select>
                </template>
                <!-- 文本框 -->
                <template v-if="item.inputType === 'textarea'">
                  <el-input
                    v-model="form[item.prop]"
                    type="textarea"
                    :disabled="inputDisabled"
                    :autosize="{
                      minRows: 3
                    }"
                    :maxlength="item.maxlength"
                    :show-word-limit="item.maxlength ? true : false"
                    :placeholder="item.placeholder ? item.placeholder : `请输入${item.label}`"
                  >
                  </el-input>
                </template>
                <!-- 范围选择 -->
                <template v-if="item.inputType === 'rangeSelect'">
                  <flex
                    :direction="
                      isRangeTypeLower(item.rangeType) ? 'row' : 'row-reverse'
                    "
                  >
                    <el-input
                      v-model="form[item.inputProp]"
                      :disabled="inputDisabled"
                      :style="{
                        marginRight: isRangeTypeLower(item.rangeType)
                          ? '5px'
                          : '0'
                      }"
                    />
                    <el-select
                      v-model="form[item.selectProp]"
                      :disabled="inputDisabled"
                      :style="{
                        width: '85px',
                        marginRight: isRangeTypeLower(item.rangeType)
                          ? '0'
                          : '5px'
                      }"
                    :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
                    >
                      <el-option
                        v-for="(rangeOption, rIndex) in item.rangeOptions"
                        :label="rangeOption.label"
                        :value="rangeOption.value"
                        :key="`${index}-${rIndex}-rop`"
                      >
                      </el-option>
                    </el-select>
                  </flex>
                </template>
                <template v-if="item.inputType === 'radioGroup'">
                  <el-radio-group v-model="form[item.prop]" :disabled="inputDisabled">
                    <el-radio
                      v-for="(radioOption, rIndex) in item.radioOptions"
                      :key="`${radioOption.value}-${rIndex}-rop`"
                      :label="radioOption.label"
                    >
                    {{radioOption.label}}
                    </el-radio>
                  </el-radio-group>
                </template>
                <template v-if="item.inputType === 'radioGroupInput'">
                  <div class="flexRow radioGroupInput">
                    <el-radio-group v-model="form[item.prop]" :disabled="inputDisabled">
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
                      v-if="item.inputShow"
                      :disabled="inputDisabled"
                      controls-position="right"
                      :precision="4"
                    />
                  </div>
                </template>
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
import Flex from '@/components/flex';
import commonApi from '@/mixins/commonApi';
import { GOODS_USE_OPTIONS } from './constants';
import { landTradeConfig, saveLandTrade, getDictionaryListByConditions } from '@/api';
import { mapGetters, mapMutations, mapActions } from 'vuex';

// const UPPER_OPTIONS = [
//   { label: '>=', value: '>=' },
//   { label: '>', value: '>' },
//   { label: '=', value: '=' }
// ];

// const LOWER_OPTIONS = [
//   { label: '<=', value: '<=' },
//   { label: '<', value: '<' },
//   { label: '=', value: '=' }
// ];

const DEVELOP_LEVELS = [
  { label: '一通一平', value: '一通一平' },
  { label: '两通一平', value: '两通一平' },
  { label: '三通一平', value: '三通一平' }
];

// const USES = [
//   { label: '商用', value: '商用' },
//   { label: '工业用地', value: '工业用地' },
//   { label: '住宅', value: '住宅' }
// ];

export default {
  name: 'LandTradeConfigBase',
  components: {
    Wrapper,
    Flex
  },
  mixins: [commonApi()],
  props: {
    initId: {
      type: [Number, String],
      default: ''
    },
    options: {
      type: Array,
      default () {
        return [];
      }
    },
    data: {}
  },
  watch: {
    options (val, old) {
      this.options = val;
      const items = this.layout[0].formItems;
      items[6] = {
        ...items[6],
        options: val
      }
      this.$set(this.layout[0], 'formItems', items);
    },
    data (val) {
      this.data = val;
      this.inputDisabled = (val.configType === 'detail');
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      !this.isAdd && this.reqDetail();
    },
    form: {
      handler (val, oldval) {
        if (val.businessType !== this.businessType) {
          this.businessType = val.businessType;
          this.$emit('changeBusinessType', val.businessType);
        }
        const inputShow = (this.data.configType === 'detail' && !!this.data.reservePrice) || (this.data.configType !== 'detail' && val.hasReservePrice === 1);
        this.layout[1].formItems[3].inputShow = inputShow;
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    const { configType } = this.data;
    return {
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {
        /** 宗地编号 */
        no: '',
        address: '',
        buildArea: '',
        buildAreaCount: '',
        goodsUse: '',
        useYears: '',
        plot: '',
        buildDensity: '',
        buildHeight: '',
        greenRatio: '',
        aggregateInvestment: '',
        projectTerm: '',
        property: '',
        owner: '',
        submitTime: '',
        startTime: '',
        endTime: '',
        period: '',
        tdxztj: '',
        remark: '',
        cantonId: '441501',
        beginPrice: undefined,
        priceStep: undefined,
        earnestMoney: undefined,
        // hasReservePrice: 1,
        reservePrice: '',
        greenHRatio: '',
        businessType: undefined
      },
      businessType: undefined,
      layout: [
        {
          title: '基本情况',
          formItems: [
            { label: '宗地编号', prop: 'no', inputType: 'input', span: 12 },
            {
              label: '宗地位置',
              prop: 'address',
              inputType: 'input',
              span: 12
            },
            {
              label: '使用权面积(㎡)',
              prop: 'buildArea',
              inputType: 'input',
              span: 12
            },
            {
              label: '规划建筑总面积(㎡)',
              prop: 'buildAreaCount',
              inputType: 'input',
              span: 12
            },
            {
              label: '用途',
              prop: 'goodsUse',
              inputType: 'select',
              allowCreate: true,
              options: [],
              span: 12
            },
            {
              label: '出让年限',
              prop: 'useYears',
              inputType: 'input',
              span: 12
            },
            {
              inputType: 'select',
              label: '交易类型',
              span: 12,
              prop: 'businessType',
              allowCreate: true,
              options: []
            },
            {
              label: '区域',
              prop: 'cantonId',
              inputType: 'select',
              options: this.options,
              span: 12
            }
          ]
        },
                {
          title: '价款信息和时间信息',
          formItems: [ {
              label: '起始价(万元)',
              prop: 'beginPrice',
              inputType: 'inputNumber',
              precision: 4,
              span: 12
            }, {
              label: '加价幅度(万元)',
              prop: 'priceStep',
              inputType: 'inputNumber',
              precision: 4,
              span: 12
            }, {
              label: '保证金(万元)',
              prop: 'earnestMoney',
              class: 'earnestMoney',
              placeholder: '0.0000',
              inputType: 'inputNumber',
              type: 'number',
              precision: 4,
              min: 0,
              span: 12
            },
            {
              label: '是否设置底价(万元)',
              prop: 'hasReservePrice',
              inputProp: 'reservePrice',
              inputType: 'radioGroupInput',
              radioOptions: [{
                label: '有保护价',
                id: 1
              }, {
                label: '无保护价',
                id: 0
              }],
              append: '万元',
              inputShow: true,
              hide: true,
              span: 12
            }
            ]
        },
        {
          title: '规划指标要求',
          formItems: [
            {
              label: '容积率',
              prop: 'plot',
              inputType: 'input',
              span: 6
            },
            {
              label: '建筑密度(%)',
              prop: 'buildDensity',
              inputType: 'input',
              span: 6
            },
            {
              label: '建筑高度',
              prop: 'buildHeight',
              inputType: 'input',
              span: 6
            },
            {
              label: '绿地率',
              prop: 'greenRatio',
              inputType: 'input',
              span: 6
            },
            {
              label: '投资强度',
              prop: 'aggregateInvestment',
              inputType: 'input',
              span: 12
            },
            {
              label: '开发程度',
              prop: 'projectTerm',
              inputType: 'select',
              options: DEVELOP_LEVELS,
              span: 12
            }
          ]
        },
        {
          title: '其他要求',
          formItems: [
            {
              label: '权属性质',
              prop: 'property',
              inputType: 'input',
              span: 12
            },
            {
              label: '权属单位',
              prop: 'owner',
              inputType: 'input',
              span: 12
            },
            {
              label: '交地时间',
              prop: 'submitTime',
              inputType: 'input',
              span: 12
            },
            {
              label: '动工时间',
              prop: 'startTime',
              inputType: 'input',
              span: 12
            },
            {
              label: '竣工时间',
              prop: 'endTime',
              inputType: 'input',
              span: 12
            },
            {
              label: '开发周期',
              prop: 'period',
              inputType: 'input',
              span: 12
            },
            {
              label: '产业类别',
              prop: 'industryType',
              inputType: 'input',
              span: 24
            },
            {
              label: '绿化率',
              prop: 'greenHRatio',
              inputType: 'input',
              span: 12
            },
            {
              label: '限高(米)',
              prop: 'limitUp',
              inputType: 'input',
              span: 12
            },
            {
              label: '限低(米)',
              prop: 'limitDown',
              inputType: 'input',
              span: 12
            },
            {
              label: '建设用地类型',
              prop: 'transLandTypeValue',
              inputType: 'radioGroup',
              radioOptions: [{
                label: '地上',
                value: '地上'
              }, {
                label: '地下',
                value: '地下'
              }, {
                label: '地表',
                value: '地表'
              }],
              span: 12
            },
            {
              label: '坐标',
              prop: 'positionXY',
              inputType: 'input',
              span: 24
            },
            {
              label: '土地现有条件',
              prop: 'tdxztj',
              inputType: 'textarea',
              span: 24
            },
            { label: '备注', prop: 'remark', inputType: 'textarea', span: 24, maxlength: 200 }
          ]
        }
      ],
      formRules: {
        no: { required: true, message: '请输入宗地编号', trigger: 'blur' },
        address: { required: true, message: '请输入宗地位置', trigger: 'blur' },
        businessType: { required: true, message: '请选择交易类型', trigger: ['blur', 'change'] },
        earnestMoney: [
          { required: true, message: '请输入保证金金额', trigger: ['blur', 'change'] }
        ],
        beginPrice: [
          { required: true, message: '请输入起始价', trigger: ['blur', 'change'] }
        ],
        priceStep: [
          { required: true, message: '请输入加价幅度', trigger: ['blur', 'change'] }
        ],
        // hasReservePrice: [
        //   { required: true, message: '请输入是否设置底价', trigger: ['blur', 'change'] }
        // ],
        buildArea: {
          required: true,
          message: '请输入宗地使用权面积',
          trigger: 'blur'
        },
        goodsUse: {
          required: true,
          message: '请选择宗地用途',
          trigger: 'change'
        }
      }
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.layout[0].formItems[7] = {
        ...this.layout[0].formItems[7],
        options: this.common.contentOption
      }
      this.layout[0].formItems[6] = {
        ...this.layout[0].formItems[6],
        options: this.common.landBusinessType
      }
      this._getDictionaryListByConditions();
    });
  },
  computed: {
    ...mapGetters(['common']),
    contentPadding () {
      const { configType } = this.data;
      return ['add', 'edit'].includes(configType)
        ? '90px'
        : '0'
    }
  },
  methods: {
    reqDetail () {
      const { targetId } = this.data;
      if (targetId) {
        this.form = this.data;
      }
    },
    isRangeTypeLower (type) {
      return type === 'lower';
    },
    submitForm () {
      let status;
      this.$refs.formData.validate(valid => {
        if (valid) {
          const { configType, id } = this.data;
          const param = {
            ...this.form,
            reservePrice: +this.form.reservePrice,
            // plotDown: +this.form.plotDown,
            // plotUp: +this.form.plotUp,
            // buildDensityDown: +this.form.buildDensityDown,
            // buildDensityUp: +this.form.buildDensityUp,
            // buildHeightDown: +this.form.buildHeightDown,
            // buildHeightUp: +this.form.buildHeightUp,
            // greenRatioDown: +this.form.greenRatioDown,
            // greenRatioUp: +this.form.greenRatioUp,
            operateFlag: configType,
          }
          const message = configType === 'add' ? '新增成功' : '修改成功';
          this.$emit('success', param);
          // saveLandTrade(param).then(res => {
          //   if (res.code === '200') {
          //     this.$notify({
          //       title: '成功',
          //       message,
          //       type: 'success',
          //       position: 'bottom-right'
          //     });
          //     this.$emit('success');
          //   }
          // })
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
      this.$refs.formData.resetFields();
      this.form = {
        no: '',
        address: '',
        buildArea: '',
        buildAreaCount: '',
        goodsUse: '',
        useYears: '',
        plot: '',
        buildDensity: '',
        buildHeight: '',
        greenRatio: '',
        aggregateInvestment: '',
        projectTerm: '',
        property: '',
        owner: '',
        submitTime: '',
        startTime: '',
        endTime: '',
        period: '',
        tdxztj: '',
        remark: '',
        cantonId: '441501',
        beginPrice: undefined,
        priceStep: undefined,
        earnestMoney: undefined,
        // hasReservePrice: 1,
        reservePrice: undefined,
        greenHRatio: '',
        businessType: undefined
      }
    },
    _getDictionaryListByConditions() {
      const paremsData = {
        "data": {
            "code": "LAND_USAGE"
        },
        "pageNo": "1",
        "pageSize": "999"
      };
      if (this.layout[0].formItems[4].options.length !== 0) return;
      getDictionaryListByConditions(paremsData).then(res => {
        if (res.code === '200') {
          this.layout[0].formItems[4].options = res.data.data.map(data => {
            return {
              id: data.code,
              name: data.name
            }
          })
        }
      })
    }
  },
  created () {
    !this.isAdd && this.reqDetail();
  }
};
</script>

<style lang="less" scoped>

#base{
  /deep/.el-form-item {
    margin-bottom: 12px;
    .el-input__inner{
      text-align: left;
    }
  }
  // /deep/.comp-wrapper-header{
  //   padding: 0;
  // }
}
.radioGroupInput{
  height: 35px;
  .el-radio-group{
    align-items: center;
    display: flex;
    margin-right: 15px;
    .el-radio{
      margin-right: 5px;
      margin-left: 0;
      .el-radio__label{
        padding-left: 5px;
      }
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
</style>
