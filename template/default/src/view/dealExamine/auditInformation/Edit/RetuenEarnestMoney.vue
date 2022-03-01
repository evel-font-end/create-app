<template>
  <div id="RetuenEarnestMoney">
    <wrapper :title="item.title" v-for="(item, index) in dataItems" :key="index" className="wrapperInfo">
      <FormItemText
        :layout="item.formItems"
        labelWidth="150px"
      >
      </FormItemText>
    </wrapper>
  </div>
</template>

<script>
import Wrapper from '@/components/wrapper';
import FormItemText from '@/components/formItemText/formItemText';
import {
  approveRecord
} from '@/api/dealExamine/auditInformation';
export const childInfoItems = [
  {id: 'childAccountBank', label: '保证金子账户开户行', value: ''},
  {id: 'childAccountName', label: '保证金子账户户名', value: ''},
  {id: 'childAccountNo', label: '保证金缴纳子账户', value: ''},
  {id: 'accountName', label: '开户单位', value: ''},
  {id: 'applyDate', label: '申请时间', value: ''}
];
const infoItems = [
  {id: 'applyNo', label: '竞买申请号', value: ''},
  {id: 'no', label: '编号', value: ''},
  {id: 'payer', label: '缴纳人', value: ''},
  {id: 'accountId', label: '缴纳人的银行账户', value: ''},
  {id: 'earnestMoneyText', label: '缴纳保证金', value: ''},
  {id: 'earnestTime', label: '缴纳时间', value: ''}
];
export default {
  name: 'RetuenEarnestMoney',
  components: {
    Wrapper,
    FormItemText
  },
  props: {
    data: {}
  },
  data () {
    return {
      dataItems: [
        {
          title: '保证金子账户信息',
          formItems: childInfoItems
        },
        {
          title: '缴纳信息',
          formItems: infoItems
        }
      ],

    };
  },
  mounted () {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init () {
        approveRecord({refId: this.data.row.refId, refTableName: this.data.row.refTableName}).then(async res => {
          if (res.code === '200') {
            const dataItems = await this.dataItems.map(dataItem => {
              const formItems = dataItem.formItems.map(item => {
                return {
                  ...item,
                  value: res.data[item.id]
                }
              });
              return {
                title: dataItem.title,
                formItems
              }
            });
            this.dataItems = dataItems;
          }
        })
    }
  }
};
</script>

<style lang="less" scoped>
#RetuenEarnestMoney {
}
</style>
