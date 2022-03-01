<template>
  <div id="tarage_apply">
    <div v-if="routeName == 'edit'">
      <Edit />
    </div>
    <header-title>
      <div slot="searchBox">
        <el-form ref="form" :model="form" label-width="80px" class="form">
          <el-form-item label="行政区域：">
            <el-radio-group v-model="form.cantonName" size="medium" @change="val => groupChange(val, 'cantonName')">
              <el-radio-button
                :label="''"
              >
              全部
              </el-radio-button>
              <el-radio-button
                v-for="(item, index) in contentOption"
                :key="index"
                :label="item.id"
              >
              {{item.name}}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="交易方式：">
            <el-radio-group v-model="form.transType" size="medium" @change="val => groupChange(val, 'transType')">
              <el-radio-button
                :label="''"
              >
              全部
              </el-radio-button>
              <el-radio-button
                v-for="(item, index) in bidTransactionOptions"
                :key="index"
                :label="item.id"
              >
              {{item.name}}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="交易类型：">
            <el-radio-group v-model="form.businessType" size="medium" @change="val => groupChange(val, 'businessType')">
              <el-radio-button
                :label="''"
              >
              全部
              </el-radio-button>
              <el-radio-button
                v-for="(item, index) in bidBusinessOptions"
                :key="index"
                :label="item.id"
              >
              {{item.name}}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </header-title>
    <div
      class="TradingPost"
    >
    <div>
      <div
        class="container"
        v-for="(item,index) in tableData"
        :key="`item.id${index}`"
        @click="showApply({
          ...item,
          licenseId: item.licenseId
        })"
      >
        <div>
          <div class="title">
            <img src="./images/biao.png" />
            <p>{{item.name}}</p>
          </div>
          <div class="piceList">
            <div>
              <h2>{{item.beginPrice}}</h2>
              <p>起始价(万元)</p>
            </div>
            <div>
              <h2>{{item.priceStep}}</h2>
              <p>增加幅度(万元)</p>
            </div>
            <div>
              <h2>{{item.earnestMoney}}</h2>
              <p>保证金(万元）</p>
            </div>
          </div>
          <div style="display:flex;">
            <div style="display:flex;line-height: 20px;margin: 6px 35px 6px 0;">
              <h4 style="font-weight: bold;margin-right: 8px;">所属区域：</h4>
              <p>{{item.cantonName}}</p>
            </div>
            <div style="display:flex;line-height: 20px;margin: 6px 0;">
              <h4 style="font-weight: bold;margin-right: 8px;">标的编号：</h4>
              <p>{{item.id}}</p>
            </div>
          </div>
          <div class="item" v-if="!(item.transType === '102')">
            <h4>挂牌开始时间：</h4>
            <p>{{item.beginFocusTime}}</p>
          </div>
          <div class="item" v-if="!(item.transType === '102')">
            <h4>挂牌结束时间：</h4>
            <p>{{item.endFocusTime}}</p>
          </div>
          <div class="item">
            <h4>竞价开始时间：</h4>
            <p>{{item.beginLimitTime}}</p>
          </div>
          <div class="item">
            <h4>保证金缴纳截至时间：</h4>
            <p>{{item.endEarnestTime}}</p>
          </div>
          <!-- <div class="applyButton">
            <el-button
              type="text"
              size="small"
              title="申请"
              @click.prevent.stop="showApply({
                ...item,
                id: item.id,
                noticeId: item.noticeId
              })"
            >
            <img src="./images/apply.png" />
            申请
            </el-button>
          </div> -->
        </div>
      </div>

    </div>
    <el-pagination
        @size-change="onPageSizeChange"
        @current-change="onCurrentChange"
        :current-page.sync="page.current"
        :page-size="page.pageSize"
        layout="total, prev, pager, next"
        :total="page.total">
      </el-pagination>
    </div>

    <!-- <edit :show="applyShow" :data="applyData" @cancel="closeEdit"/> -->
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import headerTitle from 'components/headerTitle/headerTitle';
import { selectListByParentCode } from '@/api';
import commonApi from '@/mixins/commonApi';
import Edit from '@/view/peopleDealManagement/peopleDealOfferLog/Edit/index';
import { saveLocal } from 'util/tool';
import store from '@/store';
import {
  getRuningTarget
} from '@/api/peopleDealNoticList/tarageApply';

import {
  getTransactionType,
  getBusinessType
} from '@/api/dealManagement/breakdealList';
export default {
  name: 'tarage_apply',
  mixins: [commonApi()],
  data () {
    return {
      contentOption: this.common && this.common.contentOption,
      bidBusinessOptions: this.common && this.common.bidBusinessOptions,
      bidTransactionOptions: this.common && this.common.bidTransactionOptions,
      form: {
        cantonName: '',//区域名称
        businessType: '',//交易类型
        transType: '',//交易方式
        cantonId: '',//区域编码
        goodsType: '',//101:土地 ,301:采矿, 401:探矿
        id: '',
        no: '',
        status: ''
      },
      tableData: [],
      applyShow: false,
      applyData: {},
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      type: ''
    };
  },
  created () {
  },
  components: {
    headerTitle,
    Edit
  },
  computed: {
    ...mapGetters(['common']),
    
    routeName () {
      return this.$route.name
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getDataAllList();
      this.getContent();
      this._getTransactionType();
      this._getBusinessType();
      this.contentOption = this.common && this.common.contentOption;
      this.bidBusinessOptions = this.common && this.common.bidBusinessOptions;
      this.bidTransactionOptions = this.common && this.common.bidTransactionOptions;
    });
  },
  methods: {
    closeEdit (type) {
      this.applyShow = false;
      this.applyData = {};
      if (type === 'cancel') {
        this.getDataAllList();
      }
    },
    groupChange (val, type) {
      this.getDataAllList();
    },
    // 获取所有/查询数据列表
    getDataAllList () {
      let data = {
        data: {
          ...this.form
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      getRuningTarget(data).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data
          this.tableData = data;
          this.page.total = total;
        }
      })
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList()
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    },
    //查看详情
    showApply (row) {
      this.editdata = {
        row: {
          ...row,
          licenseId: row.licenseId
        }
      };
      store.commit('set_currentEditData', this.editdata);
      saveLocal('currentEditData', this.editdata);
      this.$router.push({
        name: 'edit',
        query: this.editdata
      }, () => {}, () => {});
    }
  }
};
</script>
<style lang="less" scoped>
#tarage_apply{
  .el-radio-button__orig-radio:checked+.el-radio-button__inner{
    background-color: rgb(6, 91, 220);
  }
  .form{
    /deep/.el-radio-button__inner {
      border: none;
      border-radius: 0;
      width:auto;
      height:25px;
      padding: 3px 12px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      line-height:20px;
    }
  }
  .el-pagination{
    margin-top: 20px;
    text-align: center;
  }
  #headerTitle {
    width: 100%;
    padding: 23px 15px;
    background: #fff;
    margin-top: 20px;
  }
  .TradingPost{
    width: 1200px;
    height: calc(100vh - 330px);
    overflow-x: auto;
    position: relative;
    margin: auto 0;
    >div{
      display: flex;
      flex-direction: row;
      flex-wrap:wrap;
      margin-top: 20px;
      min-width: 1200px;
    }
    .el-pagination{
      position: fixed;
      bottom: 25px;
      left: 50%;
      transform: translate(-50%, 0);
      justify-content: center;
    }
    .container{
      overflow: hidden;
      width: 33.3%;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      &:nth-child(3n - 1) {
        align-items: center;
      }
      &:nth-child(3n) {
        align-items: flex-end;
      }
      >div{
        width: 80%;
      // max-width:520px;
      // min-width: 420px;
      height:100%;
      background:rgba(255,255,255,1);
      box-shadow:0px 2px 8px 0px rgba(192,205,226,1);
      border:1px solid rgba(37,115,241,1);
      border-top:4px solid rgba(161,197,255,1);
      padding: 33px 20px 20px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      cursor: pointer;
      .title{
        position: relative;
        img{
          position: absolute;
          width: 30px;
          height: 30px;
          top: 0;
          left: 0;
        }
        p{
          padding-left: 40px;
          font-size:20px;
          font-weight:500;
          color:rgba(20,20,20,1);
        }
      }
      .piceList{
        margin: 14px 0;
        background:rgba(241,241,241,1);
        padding: 8px 20px;
        display: flex;
        flex-direction: row;
        justify-content:space-between;
        h2 {
          font-size:20px;
          font-weight:500;
          color:rgba(247,121,28,1);
          line-height:28px;
          text-align: center;
        }
        p{
          font-size:12px;
          font-weight:400;
          color:rgba(66,66,66,1);
          line-height:17px;
          text-align: center;
        }
      }
      .item{
        display: flex;
        flex-direction: row;
        font-size:14px;
        line-height: 20px;
        margin: 6px 0;
        h4{
          font-weight: bold;
          margin-right: 8px;
        }
      }
      .applyButton{
        display: flex;
        justify-content: flex-end;
        margin-top: 8px;
        button{
          width: 72px;
          height: 34px;
          background:rgba(255,255,255,1);
          border:1px solid rgba(37,115,241,1);
          font-size:14px;
          font-weight:400;
          color:rgba(37,115,241,1);
          line-height:20px;
          padding: 7px 14px 7px 30px;
          position: relative;
          img{
            position: absolute;
            width: 13px;
            height: 18px;
            top: 50%;
            margin-top: -9px;
            left: 14px;
          }
        }
      }
      }

    }
  }
}
.bidderMain{
  .TradingPost{
    height: auto !important;
    width: 100% !important;
    .el-pagination{
      position: relative !important;
      min-width: auto !important;
    }
  }
}
</style>
