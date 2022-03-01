<template>
  <div id="edit">
    <dialog-cont
      @on-cancel="canceledit('close')"
      @on-close="canceledit('close')"
      @on-confirm="confirmedit"
      @on-open="openedit"
      :title="`${title}`"
      
      :visible.sync="editshow"
      ref="dialog"
    >
      <div>
        <FormItem
          :layout="bidItems"
          labelWidth="150px"
        >
        </FormItem>
        <wrapper title="选择保证金银行">
          <div class="bankContainer">
            <div
              class="bankItem"
              v-for="(item, index) in bankAllas"
              :key="index"
              :class="bankActiveId === item.id ? 'active' : ''"
              @click="bankActive(item.id)"
            >
              <img :src="item.imgUrl"/>
              <span>{{item.name}}</span>
            </div>
          </div>
        </wrapper>
        <wrapper title="是否联合竞买">
          <el-radio-group v-model="applyUnion">
            <el-radio-button
              v-for="(item, index) in statusOptions"
              :key="index"
              :label="item.id"
            >
            {{item.name}}
            </el-radio-button>
          </el-radio-group>
          <div class="Modeltable" v-if="applyUnion === 1">
            <el-form ref="form" :model="form"  status-icon>
              <page-table
                col-align="left"
                :data.sync="tableData"
                :cols.sync="tableCols"
                operator-width="150"
                operator
                :showPage="false"
              >
                <template
                  slot-scope="scope"
                  slot="operator"
                >
                  <flex>
                    <el-button
                      type="text"
                      size="small"
                      title="删除"
                      :style="{marginRight: '10px'}"
                      @click.prevent.stop="tableAction('del', {
                        index: scope.index
                      })"
                  >
                    {{tableData.length === 1 || (scope.index === tableData.length - 1) ? '重置' : '删除'}}
                  </el-button>
                  <el-button
                      type="text"
                      size="small"
                      title="新增"
                      @click.native.prevent="tableAction('add')"
                      v-if="tableData.length === 1 || (scope.index === tableData.length - 1)"
                  >
                    新增
                  </el-button>
                  </flex>
                </template>
              </page-table>
            </el-form>
          </div>
        </wrapper>
      </div>
      <application-info :show="aInfoShow" :data="aInfoData" :items="aInfoItems" :tableData="unionsTable" :tableCols="unionsClos" @cancel="cancelInfo" append-to-body/>
    </dialog-cont>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Wrapper from '@/components/wrapper';
import dialogCont from '@/components/dialog';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import FormItem from '@/components/formItem';
import applicationInfo from '@/view/peopleDealManagement/biddingPriceList/applicationInfo';
import { childInfoItems, infoItems } from '@/view/peopleDealManagement/biddingPriceList/utils';
import { STATUS_YESNO } from '@/util/constants';
import { phoneTest } from '@/util/tool';
import {
  applyTarget,
  accountBynoticeid,
  getUnionBidderList
} from '@/api/peopleDealNoticList/tarageApply';
import ABC from '../images/ABC.png';
import CCB from '../images/CCB.png';
import ICBC from '../images/ICBC.png';

const imgList = {
  'ABC': ABC,
  'CCB': CCB,
  'ICBC': ICBC
}
export default {
  name: 'edit',
  components: {
    Wrapper,
    dialogCont,
    PageTable,
    Flex,
    applicationInfo,
    FormItem
  },
  props: {
    data: {},
    show: ''
  },
  data () {
    return {
      title: '标的竞拍申请',
      form: {
      },
      applyUnion: 0,
      statusOptions: [],
      bankAllas: [],
      editshow: false,
      editData: {},
      bankActiveId: null,
      tableData: [{}],
      tableCols: [
        {
          label: '竞买人名称',
          prop: 'bidderName',
          render: (h, scope) => {
            return (
              <div class="el-input">
                {
                  <div>
                    {scope.row.bidderName ? <span>{scope.row.bidderName}</span> : <input class="editInput" size="mini" onInput={val => { this.changeInput(val, scope.column.property) } }>
                    </input>}
                  </div>
                }
              </div>
            )
          }
        },
        {
          label: '法人',
          prop: 'corporation',
          render: (h, scope) => {
            return (
              <div class="el-input">
                {
                  <div>
                    {scope.row.corporation ? <span>{scope.row.corporation}</span> : <input class="editInput" size="mini" onChange={val => { this.changeInput(val, scope.column.property) } }>
                    </input>}
                  </div>
                }
              </div>
            )
          }
        },
        {
          label: '联系电话',
          prop: 'bidderTel',
          render: (h, scope) => {
            return (
              <div class="el-input">
                {
                  <div>
                    {scope.row.bidderTel ? <span>{scope.row.bidderTel}</span> : <input class="editInput" size="mini" onChange={val => { this.changeInput(val, scope.column.property) } }>
                    </input>}
                  </div>
                }
              </div>
            )
          }
        },
        {
          label: '联系人',
          prop: 'bidderContact',
          render: (h, scope) => {
            return (
              <div class="el-input">
                {
                  <div>
                    {scope.row.bidderContact ? <span>{scope.row.bidderContact}</span> : <input size="mini" class="editInput" onChange={val => { this.changeInput(val, scope.column.property) } }>
                    </input>}
                  </div>
                }
              </div>
            )
          }
        },
        {
          label: '证件号',
          prop: 'bidderIdno',
          render: (h, scope) => {
            return (
              <div class="el-input">
                {
                  <div>
                    {scope.row.bidderIdno ? <span>{scope.row.bidderIdno}</span> : <input class="editInput" size="mini" onChange={val => { this.changeInput(val, scope.column.property) } }>
                    </input>}
                  </div>
                }
              </div>
            )
          }
        },
        {
          label: '所占比例',
          prop: 'percent',
          render: (h, scope) => {
            return (
              <div class="el-input">
                {
                  <div>
                    {scope.row.percent ? <span>{scope.row.percent}</span> : <input class="editInput" size="mini" onChange={val => { this.changeInput(val, scope.column.property) } }>
                    </input>}
                  </div>
                }
              </div>
            )
          }
        }
      ],
      selectIds: [],
      aInfoShow: false,
      aInfoData: {},
      aInfoItems: [
        {
          title: '保证金子账户信息',
          formItems: childInfoItems
        },
        {
          title: '基本信息',
          formItems: infoItems
        }
      ],
      unionsTable: [],
      unionsClos: [
        {label: '竞买人名称', prop: 'bidderName'},
        {label: '法人', prop: 'corporation'},
        {label: '联系电话', prop: 'bidderTel'},
        {label: '联系人', prop: 'bidderContact'},
        {label: '证件号', prop: 'bidderIdno'},
        {label: '所占比例', prop: 'percent'}
      ],
      bidItems: [
        {
          title: '标的信息',
          formItems: [
            {id: 'businessTypeText', label: '交易类型', value: ''},
            {id: 'transTypeText', label: '交易方式', value: ''},
            {id: 'beginPrice', label: '起始价', value: ''},
            {id: 'priceStep', label: '出价阶梯', value: ''},
            {id: 'earnestMoney', label: '保证金', value: ''},
            {id: 'beginNoticeTime', label: '公告开始时间', value: ''},
            {id: 'endNoticeTime', label: '公告结束时间', value: ''},
            {id: 'beginApplyTime', label: '竞买申请开始时间', value: ''},
            {id: 'endApplyTime', label: '竞买申请结束时间', value: ''},
            {id: 'beginEarnestTime', label: '保证金缴纳开始时间', value: ''},
            {id: 'endEarnestTime', label: '保证金缴纳截至时间', value: ''},
            {id: 'beginLimitTime', label: '限时竞价开始时间', value: ''}
          ]
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['common'])
  },
  watch: {
    show (val) {
      this.editData = this.data;
      this.editshow = val;
    }
  },
  mounted () {
    this.$nextTick(() => {
    });
  },
  methods: {
    ...mapMutations([
      'set_common'
    ]),
    openedit () {
      const { options } = this.$_useTypes(STATUS_YESNO);
      this.statusOptions = options;
      this._getBankList();
      this.getBidInfo();
      // this._getUnionBidderList();
    },
    getBidInfo () {
      const items = this.bidItems.map(item => {
        const formItems = item.formItems.map(fItem => {
          const value = this.editData.row[fItem.id];
          return {
            id: fItem.id,
            label: fItem.label,
            value: value
          }
        })
        return {
          title: item.title,
          formItems
        }
      });
      this.bidItems = items;
    },
    closeedit () {
      this.editshow = false;
      this.editData = {};
      this.form = {};
      this.tableData = [{}];
      this.applyUnion = null;
      this.bankAllas = [];
      this.bankActiveId = null;
    },
    canceledit (type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    cancelInfo () {
      this.aInfoShow = false;
      this.aInfoData = {};
      this.canceledit('cancel');
    },
    confirmedit () {
      const tableData = JSON.parse(JSON.stringify(this.tableData));
      tableData.pop();
      const formArray = Object.keys(this.form).find(formItem => !!this.form[formItem]);
      if (this.applyUnion === 1 && formArray) {
        const notifyinputErr = {
          'bidderName': {
            rule: !this.form.bidderName,
            message: '输入竞买人名称'
          },
          'corporation': {
            rule: !this.form.corporation,
            message: '输入法人'
          },
          'bidderTel': {
            rule: !this.form.bidderTel,
            message: '输入联系电话'
          },
          'bidderTel2': {
            rule: phoneTest(this.form.bidderTel),
            message: '联系电话格式错误'
          },
          'bidderContact': {
            rule: !this.form.bidderContact,
            message: '输入联系人'
          },
          'bidderIdno': {
            rule: !this.form.bidderIdno,
            message: '输入证件号'
          },
          'percent': {
            rule: !this.form.percent,
            message: '输入所占比例'
          }
        }
        const inputerrArray = this.$_notifyError(notifyinputErr)
        if (inputerrArray.length !== 0) {
          return false;
        }
        tableData.push(this.form);
      }
      const unions = tableData;
      const notifyErr = {
        'bank': {
          rule: !this.bankActiveId,
          message: '选择保证金银行'
        },
        'applyUnion': {
          rule: this.applyUnion === null,
          message: '选择是否联合竞买'
        },
        'unions': {
          rule: this.applyUnion === 1 && unions.length === 0,
          message: '输入联合竞买人信息'
        }
      }
      const errArray = this.$_notifyError(notifyErr)
      if (errArray.length !== 0) {
        return false;
      }
      const param = {
        applyUnion: this.applyUnion,
        targetId: this.data.row.id,
        unions,
        accountId: this.bankActiveId
      };
      applyTarget(param).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '竞拍成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.aInfoShow = true;
          this.aInfoData = res.data;
          this.unionsTable = res.data.unions;
          this.$emit('success');
        } else {
        }
      })
    },
    bankActive (id) {
      if (this.bankActiveId === id) {
        this.bankActiveId = null;
        return false;
      }
      this.bankActiveId = id;
    },
    changeInput (val, name) {
      const value = val.target.value;
      this.form = {
        ...this.form,
        [name]: value
      }
    },
    tableAction (type, row) {
      if (type === 'add') {
        this.$refs.form.validate(valid => {
          if (valid) {
            const inputError = {
              'percent': {
                rule: isNaN(this.form.percent),
                message: '所占比例输入数字'
              }
            };
            const inputerrArray = this.$_notifyError(inputError)
            if (inputerrArray.length !== 0) {
              return false;
            }
            this.tableData.unshift({
              ...this.form,
              bidderIdno: this.form.bidderIdno.replace(/\s+/g, ''),
              bidderContact: this.form.bidderContact.replace(/\s+/g, ''),
              bidderTel: this.form.bidderTel.replace(/\s+/g, ''),
              corporation: this.form.corporation.replace(/\s+/g, ''),
              bidderName: this.form.bidderName.replace(/\s+/g, ''),
              percent: +parseFloat(this.form.percent).toFixed(2)
            });
            this.form = {};
          } else {
            this.$notify.error({
              title: '失败',
              message: '请填写完整必填数据!!!',
              position: 'bottom-right'
            });
            return false;
          }
        });
      } else if (row) {
        if (this.tableData.length === 1 || (row.index === this.tableData.length - 1)) {
          const inputArray = Array.from(document.getElementsByClassName('editInput'));
          inputArray.map(inputItem => {
            inputItem.value = null;
          });
          this.form = {};
          return;
        }
        let items = [...this.tableData];
        items.splice(row.index, 1);
        this.tableData = items;
        this.$forceUpdate();
      }
    },
    _getBankList () {
      accountBynoticeid(this.editData.row.noticeId).then(res => {
        if (res.code === '200') {
          this.bankAllas = res.data.map(item => {
            return {
              name: item.bankName,
              id: item.id,
              imgUrl: imgList[item.bankAlias]
            }
          });
        }
      })
    },
    _getUnionBidderList () {
      getUnionBidderList(this.editData.row.noticeId).then(res => {
        if (res.code === '200') {
        }
      })
    },
    init () {
    }
  }
}
</script>

<style lang="less" scoped>
#edit{
  .bankContainer{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .bankItem{
          width: 236px;
    height: 150px;
      background:rgba(255,255,255,1);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      margin-right: -1px;
      &.active {
        background: url('../images/bankActive.png') no-repeat center;
        background-size: 100% 100%;
      }
      img{
        width: 71px;
        height: 67px;
        margin-bottom: 13px;
      }
      span{
        font-size:14px;
        font-weight:600;
        color:rgba(63,63,63,1);
        line-height:20px;
      }
    }
  }
  /deep/.el-input{
    input{
          padding: 3px 6px 4px;
    height: 28px;
    line-height: 17px !important;
    width: 100%;
    font-size: 14px;
    vertical-align: middle;
    color: #000;
    background-color: #fff;
    background-image: none;
    border: 1px solid #d9d9d9;
    border-radius: 0px;
    border-color: #d2d6de;
    box-sizing: border-box;
    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    }
  }
  /deep/.el-radio-button__inner{
    width:82px;
    height:36px;
    border-radius: 0;
  }
  /deep/.el-radio-button__orig-radio:checked+.el-radio-button__inner {
    background-color: #2573F1;
  }
  .Modeltable{
    margin-top: 20px
  }
}


</style>
