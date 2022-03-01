<template>
  <dialog-cont
    @on-cancel="canceledit('close')"
    @on-close="canceledit('close')"
    @on-confirm="canceledit('close')"
    @on-open="openedit"
    :title="`${title}`"
    
    :visible.sync="editshow"
    ref="dialog"
    :append-to-body="appendToBody"
    className="bidding_price_list_info"
  >
  <div class="info">
    <wrapper :title="item.title" v-for="(item, index) in dataItems" :key="index" className="wrapperInfo">
      <FormItemText
        :layout="item.formItems"
        labelWidth="150px"
      >
      </FormItemText>
    </wrapper>
    <attach :idata="detaildata" :show="detailshow"/>
    <wrapper title="联合竞买人" v-if="tableData.length > 0" className="wrapperInfo">
      <page-table
        col-align="left"
        :data.sync="tableData"
        :cols.sync="tableCols"
        :showPage="false"
      >
      </page-table>
    </wrapper>
  </div>
  </dialog-cont>
</template>

<script>
import dialogCont from '@/components/dialog';
import FormItemText from '@/components/formItemText/formItemText';
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table'
import { selectListByParentCode, initSuppleNoticeAttach as initGoodsAttach } from '@/api';
import { STATUS_YESNO } from '@/util/constants';
import attach from './detail/attach';
//
export default {
  name: 'info',
  components: {
    Wrapper,
    dialogCont,
    FormItemText,
    PageTable,
    attach
  },
  props: {
    data: {},
    show: '',
    items: {
      type: Array,
      default () {
        return [];
      }
    },
    appendToBody: false,
    tableData: {
      type: Array,
      default () {
        return [];
      }
    },
    tableCols: {
      type: Array,
      default () {
        return [];
      }
    },
    hasAttach: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      title: '申请信息',
      editshow: false,
      editData: {},
      dataItems: [],
      detaildata: {},
      detailshow: false
    }
  },
  computed: {
  },
  watch: {
    show (val) {
      this.editshow = val;
    },
    data (val) {
      this.editData = val;
      this.detaildata = {
        configType: 'detail',
        id: val.id
      };
      this.detailshow = true;
    }
  },
  methods: {
    openedit () {
      const { types } = this.$_useTypes(STATUS_YESNO);
      // console.log(this.items)
      const items = this.items.map(item => {
        const formItems = item.formItems.map(fItem => {
          const value = this.editData.data[fItem.id];
          const numberVal = !isNaN(value) && (value === 0 || value === 1);
          return {
            id: fItem.id,
            label: fItem.label,
            value: numberVal ? types[value] : value,
            span: fItem.span,
            important: fItem.important
          }
        })
        return {
          title: item.title,
          formItems
        }
      });
      this.dataItems = items;
      // this.$set(this.items, items);
    },
    closeedit () {
      this.editshow = false;
      this.editData = {};
      this.detaildata = {};
    },
    canceledit (type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    init () {
    },
    typeBetweed (itemObj) {
      const isNode = `${itemObj}`.indexOf('object') > -1;
      if (!!isNode) {
        return true;
      }
      return false;
    }
  },
  created () {
    // this.isAdd && this.init();
  }
}
</script>

<style lang="less">

.bidding_price_list_info{
  .info{
    /deep/.el-form-item{
      margin-bottom: 0px !important;
    }
    >div{
      .comp-wrapper-header{
        padding-left: 0;
        border-top: none;
      }
      .comp-wrapper-content{
        padding-bottom: 10px;
      }
      &:nth-child(3){
        .comp-wrapper-content{
          padding: 0;
          .el-row{
            .el-col{
              &:nth-child(4n), &:nth-child(4n-1) {
                background: #F1F1F1;
              }
            }
            .el-form-item__label, .el-form-item__content{
              height: 44px;
              line-height: 44px;
            }
          }
        }
      }
    }
    /deep/.wrapperInfo{
      .comp-wrapper-header{
        padding: 0;
        border-top: none;
        overflow: hidden;
        .comp-wrapper-header__left{
          span{
            display: inline-block;
            height: 30px;
            line-height: 30px;
            padding: 0 5px 0 10px;
            background: #518FF4;
            border-left: 0;
            font-size:14px;
            font-family:PingFangSC-Semibold,PingFang SC;
            font-weight:600;
            color:rgba(255,255,255,1);
            position: relative;
            &::after{
              content: '';
              position: absolute;
              right: -21px;
              bottom: -21.5px;
              border-width: 21.5px;
              border-style: solid;
              border-color: transparent #518FF4 transparent transparent;
              transform: rotate(-45deg); /*顺时针旋转90°*/
            }
          }
        }
      }
    }
  }
}
</style>
