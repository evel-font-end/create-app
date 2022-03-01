/* eslint-disable camelcase */
<template>
  <div id='peopleDealOfferLog' >
    <div v-if="routeName == 'edit'">
      <Edit />
    </div>
    <!-- 业务执行管理 -->
    <div v-if="routeName == 'afterdeal_list'">
      <header-title>
      <div
        class="TradingPost"
        slot="searchBox"
      >
        <div>
          <div
            class="container"
            v-for="(item, index) in items"
            :key="index"
            @click="showApply({
              ...item,
              licenseId: item.licenseId
            })"
          >
            <div>
              <div class="item">
                <h4>项目名称：</h4>
                <p>{{item.name}}</p>
              </div>
              <div class="item">
                <h4>交易方式：</h4>
                <p>{{item.transTypeText}}</p>
              </div>
              <div class="item">
                <h4>起始价：</h4>
                <p>{{item.beginPriceText}}{{plowBusinessTypeList.indexOf(item.businessType) > -1 ? '万元' : '万元'}}</p>
              </div>
              <div class="item" v-if="(item.transType !== '102')">
                <h4>挂牌开始时间：</h4>
                <p>{{item.beginFocusTime}}</p>
              </div>
              <div class="item" v-if="(item.transType !== '102')">
                <h4>挂牌结束时间：</h4>
                <p>{{item.endFocusTime}}</p>
              </div>
              <div class="item">
                <h4>竞价开始时间：</h4>
                <p>{{item.beginLimitTime}}</p>
              </div>
              <div
                class="applyLogo"
                :style="{background: item.targetStatus === 4 ? '#5189FF' : '#F5A163' }"
              >
                {{ item.statusText }}
              </div>
            </div>
          </div>
        </div>
        <el-pagination
          @size-change="onPageSizeChange"
          @current-change="onCurrentChange"
          :current-page.sync="page.current"
          :page-size="page.pageSize"
          layout="total, prev, pager, next"
          :total="page.total"
          v-if="items.length > 0"
        >
        </el-pagination>
      </div>
      </header-title>

    </div>
    <!-- <edit :show="editshow" :data="editdata" @cancel="closeEdit"></edit> -->
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import { saveLocal } from 'util/tool'
import store from '@/store'
import Edit from './Edit';
import { plowBusinessTypeList } from './utils';
import {
  getBidderTradeTarget
} from '@/api/peopleDealManagement/peopleDealOfferLog';
export default {
  name: 'afterdeal_list',
  data () {
    return {
      plowBusinessTypeList: plowBusinessTypeList,
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      items: [],
      editshow: false,
      editdata: {},
      symbol: '万元',
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.routeName === 'afterdeal_list') {
        this.getDataAllList();
      }
    });
  },
  components: {
    Edit,
    headerTitle
  },
  computed: {
    routeName () {
      return this.$route.name
    }
  },
  methods: {
    closeEdit () {
      this.editshow = false;
      this.editdata = {};
    },
    onSearch (val) {
      this.searchVal = {
        ...val
      }
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList () {
      // setTimeout(() => {
      //   this.showApply({
      //     id: 1,
      //     licenseId: 1
      //   })
      // }, 2000)

      let data = {
        data: {
          ...this.searchVal
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      getBidderTradeTarget(data).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data
          this.items = data;
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
}
</script>

<style lang="less" scope>
#peopleDealOfferLog{
  height: auto !important;
    .el-pagination{
    margin-top: 20px;
    text-align: center;
  }

  .searchBox{
    background: transparent !important;
    overflow: auto;
  }
  .TradingPost{
    height: calc(100vh - 175px);
    width: 100%;
      // overflow-x: auto;
    >div{
    display: flex;
    flex-direction: row;
    flex-wrap:wrap;
    min-width: 1200px;
    }
    .el-pagination{
      // position: fixed;
      // bottom: 25px;
      // left: 50%;
      // transform: translate(-50%, 0);
      justify-content: center;
    }
    .container{
      overflow: hidden;
      width: 33.3%;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      cursor: pointer;
      &:nth-child(3n - 1) {
        align-items: center;
      }
      &:nth-child(3n) {
        align-items: flex-end;
      }
      >div{
      width:87%;
      height: 100%;
      background:rgba(255,255,255,1);
      box-shadow:0px 2px 8px 0px rgba(228,233,241,1);
      border-top:4px solid rgba(161,197,255,1);
      padding: 25px 20px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      position: relative;
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
      .applyLogo{
        width:85px;
        height:29px;
        background:rgba(81,137,255,1);
        border-radius:100px 0px 0px 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 0;
        top: 20px;
        color: #fff;
        cursor: pointer;
        font-size: 16px;
        &.done{
          background:rgba(245,161,99,1);
        }
      }
      }

    }
  }
}
.bidderMain{
  #peopleDealOfferLog{
    margin-top: 20px !important;
    .TradingPost{
      height: auto;
      >div{
        min-width: auto;
      }
    }
    .el-pagination{
      position: relative !important;
    }
  }
}
</style>
