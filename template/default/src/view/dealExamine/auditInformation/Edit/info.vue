<template>
  <div class="info" id="printInfo">
    <normal-notice :data="info" :show="true" :dialogModel="false" v-if="data.businessType==='TRANS_NOTICE_LAND'" />
    <mine-normal-notice :data="info" :show="true" :dialogModel="false" v-else-if="data.businessType==='TRANS_NOTICE_MINE'" />
    <supply-notice :data="info" :dialogModel="false" v-if="data.businessType==='TRANS_NOTICE_SUPPLEMENT'"/>
    <tarage-edit :data="info" :dialogModel="false" v-else-if="data.businessType==='TRANS_TARGET_LAND'" />
    <mine-tarage-edit :data="info" :dialogModel="false" v-else-if="data.businessType==='TRANS_TARGET_MINE'" />
    <high-and-low :data="info" :dialogModel="false" v-else-if="data.businessType==='TRANS_FINAL_PRICE'" />
    <high-and-low :data="info" :dialogModel="false" v-else-if="data.businessType==='TRANS_RESERVE_PRICE'" />
    <plow-bidder-edit :data="info" :dialogModel="false" v-else-if="data.businessType==='TRANS_TRUST'" />
    <plow-tarage-edit :data="info" :dialogModel="false" v-else-if="data.businessType==='TRANS_TARGET_PLOW'" />
    <plow-normal-notice :data="info" :dialogModel="false" v-else-if="data.businessType==='TRANS_NOTICE_PLOW'" />
    <RetuenEarnestMoney :data="info" v-else-if="data.businessType==='TRANS_REFUND'"/>
    <MineUpdateDealList :data="info" :dialogModel="false"  v-else-if="data.businessType==='TRANS_SUCCESSFUL'" />
    <!--
    <land-trade :data="editdata"  :dialogModel="false"/>
    <!-- <mine-supply-notice :id="data.refId" type="info"  :dialogModel="false" v-if="data.businessType==='TRANS_NOTICE_SUPPLEMENT'"/> -->
    <!-- -->

    <!--
TRANS_TRUST
耕指委托审核

TRANS_TARGET_LAND
土地标的审核

TRANS_TARGET_MINE
矿业标的审核

TRANS_TARGET_PLOW
耕指标的审核

TRANS_NOTICE_LAND
土地公告审核

TRANS_NOTICE_MINE
矿业公告审核

TRANS_NOTICE_PLOW
耕指公告审核

TRANS_NOTICE_SUPPLEMENT
补充公告审核

TRANS_FINAL_PRICE
限价审核

TRANS_RESERVE_PRICE
底价审核

TRANS_SUCCESSFUL
成交确认审核

TRANS_REFUND
保证金审核
    -->
  </div>
</template>

<script>
// import landTrade from '@/view/landManagement/landTrade/LandTradeConfig';
import NormalNotice from '@/view/landManagement/noticeList/normalDetail';
import SupplyNotice from '@/view/landManagement/noticeList/supplyDetail';
import MineNormalNotice from '@/view/mineManagement/mineNoticeList/normalDetail';
import MineSupplyNotice from '@/view/mineManagement/mineNoticeList/supplyDetail';
import TarageEdit from '@/view/landManagement/tarageList/Edit/edit';// 土地  标的管理
import MineTarageEdit from '@/view/mineManagement/mineTargetList/Edit/edit';// 矿业  标的管理
import HighAndLow from './highAndLow';// 限价与底价基本信息
import PlowTarageEdit from '@/view/plowMmanagement/lowIndexList/Edit';// 耕指  标的管理
import PlowBidderEdit from '@/view/plowMmanagement/lowBidderList/Edit';// 耕指  委托管理
import PlowNormalNotice from '@/view/plowMmanagement/lowNoticelist/normalDetail';// 耕指  公告管理
import MineUpdateDealList from '@/view/dealManagement/dealLandManage/updatedealLlist/Edit/index.vue';// 矿业 成交确认
import RetuenEarnestMoney from './RetuenEarnestMoney';
export default {
  name: 'info',
  components: {
    // landTrade,
    NormalNotice,
    SupplyNotice,
    MineNormalNotice,
    MineSupplyNotice,
    TarageEdit,
    MineTarageEdit,
    HighAndLow,
    PlowTarageEdit,
    PlowBidderEdit,
    PlowNormalNotice,
    MineUpdateDealList,
    RetuenEarnestMoney
  },
  props: {
    data: {}
  },
  watch: {
    data (val) {
      this.init(val);
    }
  },
  data () {
    return {
      info: {},
      show: false
    };
  },
  computed: {},
  methods: {
    init (val) {
      if (this.data.businessType === 'TRANS_NOTICE_LAND') {
        this.info = {
          configType: 'detail',
          row: {
            id: val.refId
          }
        };
      } else if (this.data.businessType === 'TRANS_NOTICE_MINE') {
        this.info = {
          configType: 'detail',
          row: {
            id: val.refId
          }
        };
      } else if (this.data.businessType === 'TRANS_NOTICE_SUPPLEMENT') {
        this.info = {
          configType: 'detail',
          row: {
            id: val.refId
          }
        };
      } else if (this.data.businessType === 'TRANS_TARGET_LAND') {
        this.info = {
          type: 'info',
          id: val.refId
        };
      } else if (this.data.businessType === 'TRANS_TARGET_MINE') {
        this.info = {
          type: 'info',
          id: val.refId
        };
      } else if (this.data.businessType === 'TRANS_FINAL_PRICE') {
        this.info = {
          id: val.refId,
          highOrLow: '0', // 审核业务类型（0限价/1底价）
          status: val.status// 审批状态
        };
      } else if (this.data.businessType === 'TRANS_RESERVE_PRICE') {
        this.info = {
          id: val.refId,
          highOrLow: '1',
          status: val.status
        };
      } else if (this.data.businessType === 'TRANS_TRUST') {
        this.info = {
          configType: 'detail',
          row: {
            id: val.refId
          }
        };
      } else if (this.data.businessType === 'TRANS_TARGET_PLOW') {
        this.info = {
          configType: 'detail',
          row: {
            id: val.refId
          }
        };
      } else if (this.data.businessType === 'TRANS_NOTICE_PLOW') {
        this.info = {
          configType: 'detail',
          row: {
            id: val.refId
          }
        };
      } else if (this.data.businessType === 'TRANS_REFUND') {
        this.info = {
          configType: 'detail',
          row: {
            refId: val.refId,
            refTableName: val.refTableName,
          }
        };
      } else if (this.data.businessType === 'TRANS_SUCCESSFUL') {
        this.info = {
            id: val.targetId,
            licenseId: val.refId,
            status: val.status// 审批状态
          };
      }
    }
  },
  created () {
    this.init(this.data);
  }
};
</script>

<style>
.info {
  padding: 0 10px;
}
</style>
