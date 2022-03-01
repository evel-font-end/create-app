<template>
  <div id="entrust">
    <FormItem
      ref="normalFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form="form"
      @submit="submitForm"
      @change="changeForm"
    >
      <template slot="name">
        <div class="flexRow entrastPersonMain">
          <el-input
            v-model="form['name']"
            placeholder="请选择委托人"
            :disabled="inputDisabled"
          />
          <el-button
            type="primary"
            class="selectBtn"
            @click="selelctEntrast"
            :disabled="inputDisabled"
          >选择</el-button>
        </div>
      </template>
      <template slot-scope="slotProps" slot="idType">
        <div class="flexRow" >
          <el-radio-group
            class="radioGroup"
            v-model="form['idType']"
            :disabled="inputDisabled"
          >
            <el-radio
              v-for="ch in slotProps.item.options"
              :label="ch.id"
              :key="ch.id"
            >
              {{ch.name}}
            </el-radio>
          </el-radio-group>
          <el-input
            v-model="form['idNumber']"
            placeholder="请输入身份证号/组织机构代码/营业执照"
            :disabled="inputDisabled"
          />
        </div>
      </template>
    </FormItem>
    <dialog-cont
      @on-cancel="canceledit('cancel')"
      @on-close="canceledit('close')"
      @on-confirm="confirmedit"
      @on-open="openedit"
      :title="`选择委托人`"
      
      :visible.sync="editshow"
      ref="dialog"
      appendToBody
      :dialogModel="dialogModel"
    >
      <LowBidderList ref="LowBidderList" :selection="false" @select="selectChange"/>
    </dialog-cont>
  </div>
</template>

<script>
import Wrapper from '@/components/wrapper';
import Flex from '@/components/flex';
import FormItem from '@/components/formItem';
import dialogCont from '@/components/dialog';
import LowBidderList from '@/view/plowMmanagement/lowBidderList'
import { getTransNoticeDtl, saveTransNotice } from '@/api';
import { phoneTest } from '@/util/tool';
import { mapGetters } from 'vuex';

export default {
  name: 'entrust',
  components: {
    Wrapper,
    Flex,
    FormItem,
    LowBidderList,
    dialogCont
  },
  props: {
    initId: {
      type: [Number, String],
      default: ''
    },
    data: {},
  },
  watch: {
    data: {
      handler (val, oldval) {
        this.data = val;
        this.inputDisabled = (val.configType === 'detail');
        this.isEdit = ['add', 'edit'].includes(val.configType);
        this.isAdd = ['add'].includes(val.configType);
        !this.isAdd && this.reqDetail();
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
        name: undefined,
        trustType: undefined,
        idType: undefined,
        idNumber: undefined,
        contacts: undefined,
        contactPhone: undefined,
        contactPhone: undefined,
        description: undefined
      },
      layout: [
        {
          title: '委托单位',
          formItems: [
            { 
              label: '委托人', prop: 'name', inputType: 'custom', span: 24, class: 'entrastPerson'
            },
            {
              label: '委托人类型',
              prop: 'trustType',
              inputType: 'radio',
              span: 12,
              options: [{
                id: 1,
                name: '个人'
              }, {
                id: 2,
                name: '企业'
              }, {
                id: 3,
                name: '法人'
              }]
            },
            {
              label: '',
              laberWidth: '0px',
              prop: 'idType',
              inputType: 'custom',
              class: 'entrastNumber',
              span: 12,
              options: [{
                id: 0,
                name: '身份证号'
              }, {
                id: 1,
                name: '组织机构代码'
              }, {
                id: 2,
                name: '营业执照'
              }]
            },
            {
              label: '',
              prop: 'e',
              inputType: 'custom',
              span: 12
            },
            {
              label: '联系人',
              prop: 'contacts',
              inputType: 'input',
              span: 12
            },
                        {
              label: '联系电话',
              prop: 'contactPhone',
              inputType: 'input',
              span: 12
            },
                        {
              label: '委托说明',
              prop: 'description',
              inputType: 'textarea',
              span: 24
            }
          ]
        }
      ],
      formRules: {
        name: { required: true, message: '请输入委托人', trigger: 'change' },
        idType: { required: true, message: '请选择证件类型', trigger: 'blur' },
        contacts: { required: true, message: '请输入联系人', trigger: 'change' },
        contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'change' },
        {
          validator: function(rule, value, callback) {
            if (phoneTest(value)) {
              callback(new Error("联系电话格式错误"));
            } else {
              callback();
            }
          },
          trigger: "blur"
        }]
      },
      editshow: false,
      dialogModel: true,
      bidder: {}
    };
  },
  mounted () {
    this.$nextTick(() => {
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
      const { id } = this.data;
      if (id) {
        this.form = this.data;
      }
    },
    submitFormItem () {
      return this.$refs.normalFormItem.submitForm()
    },
    changeForm (val) {
      this.form = {
        ...this.form,
        ...val
      }
    },
    cancelForm () {
      this.form = {
        name: undefined,
        trustType: undefined,
        idType: undefined,
        idNumber: undefined,
        contacts: undefined,
        contactPhone: undefined,
        contactPhone: undefined,
        description: undefined
      };
      this.$refs.normalFormItem.cancelForm();
    },
    selelctEntrast () {
      this.editshow = true;
    },
    submitForm (val) {
      this.$emit('success', val);
    },
    openedit () {
    },
    closeedit () {
      this.editshow = false;
    },
    canceledit (type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    confirmedit () {
      this.form = this.bidder;
      this.editshow = false;
      this.$refs.LowBidderList.clearCurrentRow();
    },
    selectChange (val) {
      this.bidder = val;
      console.log('val', val);
    }
  },
  created () {
    !this.isAdd && this.reqDetail();
  }
};
</script>

<style lang="less" scoped>
#entrust{
    /deep/.comp-wrapper-header{
    padding: 0;
  }
  /deep/.entrastPerson{
    .entrastPersonMain{
      .el-input{
        width: 40% !important;
        margin-right: 20px;/*no*/
      }
      .selectBtn{
        height: 30px;/*no*/
        padding:8px 20px;/*no*/
      }
    }

  }
  .entrastNumber{
    .radioGroup{
      display: flex;
      flex-direction: row;
      .el-radio{
        line-height: 32px !important;/*no*/
        margin-right: 8px;/*no*/
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
  z-index: 11111;
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
