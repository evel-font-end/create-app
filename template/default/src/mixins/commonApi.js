/**
 * 公共请求
 */
import {
  mapGetters,
  mapMutations
} from 'vuex';
import {
  selectListByParentCode
} from '@/api';
import {
  getTargetStatus
} from '@/api/landManagement/tarageList';
import {
  getTransactionType,
  getBusinessType
} from '@/api/peopleDealManagement/biddingPriceList/index';
import {
  getBusinessType as getLandBusinessType
} from '@/api/landManagement/tarageList';
import {
  getMineBusinessType
} from '@/api/mineManagement/mineTargetList';
import {
  getBusinessType as getContentBusinessType
} from "@/api/dealManagement/blacklistDealManagement";
import {
  getPlowBusinessType,
  getPlowTransactionType,
  getPlowTrustStatus
} from '@/api/plowMmanagement/lowIndexList';
import {
  getTransNoticeStatus
} from '@/api/plowMmanagement/lowNoticeList';

const commonApi = () => ({
  data() {
    return {
      contentOption: this.common && this.common.contentOption,
      businessType: this.common && this.common.businessType,
      landBusinessType: this.common && this.common.landBusinessType,
      mineBusinessType: this.common && this.common.mineBusinessType,
      bidBusinessOptions: this.common && this.common.bidBusinessOptions,
      bidTransactionOptions: this.common && this.common.bidTransactionOptions,
      plowBusinessOptions: this.common && this.common.plowBusinessOptions,
      plowTransactionOptions: this.common && this.common.plowTransactionOptions,
      plowStatusOptions: this.common && this.common.plowStatusOptions,
      plowNoticeStatusOptions: this.common && this.common.plowNoticeStatusOptions
    }
  },
  computed: {
    ...mapGetters(['common'])
  },
  mounted() {
    this._getContentBusinessType();
    this.getContent();
    this._getLandBusinessType();
    this._getMineBusinessType();
    this._getPlowBusinessType();
    this.$nextTick(() => {});
  },
  methods: {
    ...mapMutations([
      'set_common'
    ]),
    getContent() {
      if (!(this.common && this.common.contentOption && this.common.contentOption.length > 0)) {
        selectListByParentCode('4635').then(res => {
          if (res.code === '200') {
            this.contentOption = res.data.map(item => {
              return {
                name: item.name,
                id: item.code
              }
            });
            this.set_common({
              ...this.common,
              contentOption: this.contentOption
            });
          }
        })
        this.$forceUpdate();
      }
    },
    _getLandBusinessType() {
      if (!(this.common && this.common.landBusinessType && this.common.landBusinessType.length > 0)) {
        getLandBusinessType().then(res => {
          if (res.code === '200') {
            this.landBusinessType = res.data.map(item => {
              return {
                name: item.value,
                id: item.key
              }
            });
            this.set_common({
              ...this.common,
              landBusinessType: this.landBusinessType
            });
          }
        });
        this.$forceUpdate();
      }
    },
    _getContentBusinessType() {
      if (!(this.common && this.common.businessType && this.common.businessType.length > 0)) {
        getContentBusinessType().then(res => {
          if (res.code === '200') {
            this.businessType = res.data.map(item => {
              return {
                name: item.value,
                id: item.key
              }
            });
            this.set_common({
              ...this.common,
              businessType: this.businessType
            });
          }
        })
        this.$forceUpdate();
      }
    },
    // 获取交易类型下拉框数据
        _getMineBusinessType() {
          if (!(this.common && this.common.mineBusinessType && this.common.mineBusinessType.length > 0)) {
            getMineBusinessType().then(res => {
              if (res.code === '200') {
                this.mineBusinessType = res.data.map(item => {
                  return {
                    name: item.value,
                    id: item.key
                  }
                });
                this.set_common({
                  ...this.common,
                  mineBusinessType: this.mineBusinessType
                });
              }
              this.$forceUpdate();
              return this.mineBusinessType;
            });
          }
        },
    // 获取交易类型下拉框数据
    _getBusinessType() {
      if (!(this.common && this.common.bidBusinessOptions && this.common.bidBusinessOptions.length > 0)) {
        getBusinessType().then(res => {
          if (res.code === '200') {
            this.bidBusinessOptions = res.data.map(item => {
              return {
                name: item.value,
                id: item.key
              }
            });
            this.set_common({
              ...this.common,
              bidBusinessOptions: this.bidBusinessOptions
            });
          }
          this.$forceUpdate();
          return this.bidBusinessOptions;
        });
      }
    },
    // 获取交易方式下拉框数据
    _getTransactionType() {
      if (!(this.common && this.common.bidTransactionOptions && this.common.bidTransactionOptions.length > 0)) {
        getTransactionType().then(res => {
          if (res.code === '200') {
            this.bidTransactionOptions = res.data.map(item => {
              return {
                name: item.value,
                id: item.key
              }
            });
            this.set_common({
              ...this.common,
              bidTransactionOptions: this.bidTransactionOptions
            });
          }
          this.$forceUpdate();
        });
      }
    },
    // 获取耕地指标交易方式下拉框数据
    async _getPlowBusinessType() {
      if (!(this.common && this.common.plowBusinessOptions && this.common.plowBusinessOptions.length > 0)) {
        return await getPlowBusinessType().then(res => {
          if (res.code === '200') {
            this.plowBusinessOptions = res.data.map(item => {
              return {
                name: item.value,
                id: `${item.key}`
              }
            });
            this.set_common({
              ...this.common,
              plowBusinessOptions: this.plowBusinessOptions
            });
          }
          return this.plowBusinessOptions;
        });
      } else {
        return this.common.plowBusinessOptions;
      }
    },
    // 获取耕地指标交易类型下拉框数据
    async _getPlowTransactionType() {
      if (!(this.common && this.common.plowTransactionOptions && this.common.plowTransactionOptions.length > 0)) {
        return await getPlowTransactionType().then(res => {
          if (res.code === '200') {
            this.plowTransactionOptions = res.data.map(item => {
              return {
                name: item.value,
                id: `${item.key}`
              }
            });
            this.set_common({
              ...this.common,
              plowTransactionOptions: this.plowTransactionOptions
            });
          }
          return this.plowTransactionOptions;
        });
      } else {
        return this.common.plowTransactionOptions;
      }
    },
    // 获取耕地指标交易类型下拉框数据
    async _getPlowTrustStatus() {
      if (!(this.common && this.common.plowStatusOptions && this.common.plowStatusOptions.length > 0)) {
        return await getTargetStatus().then(res => {
          if (res.code === '200') {
            this.plowStatusOptions = res.data.map(item => {
              return {
                name: item.value,
                id: item.key
              }
            });
            this.set_common({
              ...this.common,
              plowStatusOptions: this.plowStatusOptions
            });
          }
          return this.plowStatusOptions;
        });
      } else {
        return this.common.plowStatusOptions;
      }
    },
    // 获取耕地指标交易类型下拉框数据
    async _getTransNoticeStatus() {
      if (!(this.common && this.common.plowNoticeStatusOptions && this.common.plowNoticeStatusOptions.length > 0)) {
        return await getTransNoticeStatus().then(res => {
          if (res.code === '200') {
            this.plowNoticeStatusOptions = res.data.map(item => {
              return {
                name: item.value,
                id: item.key
              }
            });
            this.set_common({
              ...this.common,
              plowNoticeStatusOptions: this.plowNoticeStatusOptions
            });
          }
          return this.plowNoticeStatusOptions;
        });
      } else {
        return this.common.plowNoticeStatusOptions;
      }
    }
  }
})

export default commonApi
