<template>
  <!-- <dialog-cont
    @on-close="canceledit('close')"
    @on-open="openedit"
    :confirmShow="false"
    :cancelShow="false"
    :title="`${title}`"
    
    :visible.sync="editshow"
    ref="dialog"
  > -->
    <div class="people_deal_offer_log_edit">
      <!-- <warnTip :data="info" :show="warnShow" @cancel="cancelWarn" /> -->
      <div class="flexRow tipContainer" v-if="tradeInfo.bide && tradeInfo.bideTitle">
        <div class="flexCenter colorBlock">
          <img src="../images/tipIcon.png"/>
        </div>
        <div class="tipText">
          {{tradeInfo.bide}}，宗地<span class="flexCenter">{{tradeInfo.bideTitle}}</span>
        </div>
      </div>
      <div class="flexCloumn flexCenter infoContainer">
        <div>
          <div
            class="item"
            v-for="(item, index) in infoItems"
            :key="index"
            :style="item.style"
            v-if="!item.hide"
          >
            <h4>{{item.name}}：</h4>
            <el-tooltip  effect="light" :content="`${item.value} ${item.value && item.symbol}`" placement="top-start"><p>{{item.value}} {{item.value && item.symbol}}</p></el-tooltip>
          </div>
          <div class="item">
            <h4>资格颁发数：</h4>
            <p>{{ requireBidderNum }}人</p>
          </div>
          <div class="item" v-if="finalPriceText">
            <h4>封顶价：</h4>
            <p>{{ finalPriceText }}万元</p>
          </div>
          <div class="item">
            <h4>出价人数：</h4>
            <p>{{ requirePriceNum }}人</p>
          </div>
          <div class="item" v-if="reservePriceText">
            <h4>底价：</h4>
            <p>{{ reservePriceText }}万元</p>
          </div>
        </div>
      </div>
      <!-- <div class="flexCloumn flexCenter infoContainer" style="border-top: none;">
        <div>
          <div class="item" style="width: 50% !important;">
            <h4>申请人数：</h4>
            <p>{{ requireBidderNum }}人</p>
          </div>
          <div class="item" style="width: 50% !important;">
            <h4>封顶价：</h4>
            <p>{{ finalPriceText }}万元</p>
          </div>
          <div class="item" style="width: 50% !important;">
            <h4>出价人数：</h4>
            <p>{{ requirePriceNum }}人</p>
          </div>
          <div class="item" style="width: 50% !important;">
            <h4>底价：</h4>
            <p>{{ reservePriceText }}万元</p>
          </div>
        </div>
      </div> -->
      <!-- <resultTip :data="view" :info="info" v-if="((view.targetStatus === 5 || view.targetStatus === 6) && (view.isSuspend !== 1 && view.isStop !== 1)) || (((info.targetStatus === 6 || info.targetStatus === 5 || info.targetStatus === 3) && info.curNode === 'N02' && (!onLineLotteryShow || info.dealStatus !== 4)) && (info.isSuspend !== 1 && info.isStop !== 1)) "/> -->
      <wrapper title="竞价动态趋势" class="historyContainer">
        <div id="myChart" :style="{width: '90%', height: '400px'}" style="padding-bottom:'20px';"></div>
      </wrapper>
      <wrapper title="竞价记录" class="historyContainer">
         <page-table
          col-align="left"
          :data="(view.targetStatus === 3 || view.targetStatus === 4) ? info.offerLog : view.offerLog"
          :cols="tableCols"
          :showPage="false"
          tableHeight="340px"
          sortByBack
        >
        </page-table>
      </wrapper>
      <!-- <offer-plice :show="offershow" :data="offerdata" @cancel="cancelOffer" @success="successOffer"/>
      <results :show="resultshow" :data="resultdata" @cancel="cancelResult" /> -->
      <!-- <lottery :show="lotteryshow" :data="lotterydata" @cancel="cancelLottery" /> -->
      <!-- <auction :show="auctionshow" :data="auctionData"  @cancel="cancelAuction"/> -->
      <!-- <dialog-cont
        @on-cancel="pliceShow = false"
        @on-close="pliceShow = false"
        @on-confirm="pliceShow = false"
        title="出价提醒"
        width="680px"
        :visible.sync="pliceShow"
        ref="dialog"
        append-to-body
      >
        <div class="container" style="font-size: 14px;line-height: 22px;">
          {{pliceText}}
          <div style="margin-top: 10px">请等待进入摇号阶段。</div>
        </div>
      </dialog-cont> -->
    </div>
  <!-- </dialog-cont> -->
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import { MessageBox } from 'element-ui';
import Wrapper from '@/components/wrapper';
import dialogCont from '@/components/dialog';
import PageTable from '@/components/page-table';
// import results from './results';
// import resultTip from './resultTips';
import lottery from './lottery';
import auction from './auction';
import warnTip from './warnTip';
import { toThousands, toChinese, agreeLotteryText, lotteryTip, titleInfos, Ball, landBusinessTypeList, plowBusinessTypeList, plowPriceList, symbolText } from '../utils';
import offerPlice from './offerPlice';
import lotteryCanvas from './canvas';
import suspendStop from './suspendStop';
import {
  getBidderTradeTargetDtl,
  getTradeInfo,
  savePrice
} from '@/api/peopleDealManagement/peopleDealOfferLog';
import axios from 'axios';
import { baseURL } from '@/util/axios';
import { getTime } from '@/util/tool';
import { TRANS_OFFER_YESNO } from '@/util/constants';
import { infoDate } from './date';
// import { mapGetters, mapMutations } from 'vuex';
// ("N01", "开始节点"),
// ("N02", "结束节点"),
// ("L01", "公告期"),
// ("L02", "挂牌期"),
// ("L03", "竞价期"),
// ("F01", "封顶价/底价");
const changeList = ['serverTime', 'currentPriceText', 'curNodeName', 'plowTotalPriceText'];
const plowChangeList = ['beginFocusTime', 'endFocusTime'];
const visualMapColor = ['#096', '#ffde33', '#ff9933', '#cc0033', '#660099'];
export default {
  name: 'people_deal_offer_log_edit',
  components: {
    Wrapper,
    dialogCont,
    PageTable,
    offerPlice,
    // results,
    // resultTip,
    lottery,
    auction,
    warnTip,
    lotteryCanvas,
    suspendStop
  },
  data () {
    const { types } = this.$_useTypes(TRANS_OFFER_YESNO);
    return {
      title: '新增补充公告',
      form: {
      },
      requireBidderNum: "",
      finalPriceText: "",
      requirePriceNum: "",
      reservePriceText: "",
      infoItems: [{
        id: 'name',
        name: '项目名称',
        value: null,
        style: {
          width: '100%'
        }
      }, {
        id: 'transTypeText',
        name: '交易方式',
        value: null
      }, {
        id: 'businessTypeText',
        name: '交易类型',
        value: null
      }, {
        id: 'beginFocusTime',
        name: '挂牌开始时间',
        value: null
      }, {
        id: 'endFocusTime',
        name: '挂牌结束时间',
        value: null
      }, {
        id: 'beginLimitTime',
        name: '竞价开始时间',
        value: null
      }, {
        id: 'currentPriceText',
        name: '当前最高价',
        value: null,
        symbol: '万元'
      }, {
        id: 'beginPriceText',
        name: '起始价',
        value: null,
        symbol: '万元'
      }, {
        id: 'priceStepText',
        name: '增加幅度',
        value: null,
        symbol: '万元'
      }, {
        id: 'plowArea',
        name: '面积',
        value: null,
        hide: true,
        symbol: '亩'
      }, {
        id: 'plowTotalPriceText',
        name: '总价',
        value: null,
        hide: true,
        symbol: '万元'
      }, {
        id: 'curNodeName',
        name: '当前阶段',
        value: null
      }],
      editData: {},
      plice: {
        text: toChinese(0),
        value: 0,
        formatting: toThousands(0)
      },
      stepPrice: 1000,
      canUp: true,
      canDown: true,
      symbol: '万元',
      singSymbol: '元',
      tableCols: [
        { label: '竞买人', prop: 'bidderName', minWidth: '150px' },
        { label: '出价时间', prop: 'offerDate', minWidth: '120px' },
        {
          label: '竞买出价',
          prop: 'priceText',
          render: (h, scope) => {
            return (<div style="color: #F98943">{scope.row.priceText}{this.symbol}</div>)
          }
        },
        { label: '出价类型', prop: 'typeText' },
      ],
      offershow: false,
      offerdata: {},
      view: {},
      info: {},
      curStartTime: '2020-07-31 08:00:00',
      resultshow: false,
      resultdata: {},
      timeId: null,
      countdownShow: true,
      lotteryBidder: [],
      lotteryshow: false,
      lotterydata: {},
      page: {
        current: 1,
        pageSize: 6,
        total: 0
      },
      auctionshow: false,
      auctionData: {},
      agreeLottery: null,
      warnShow: false,
      lotteryTip: '',
      tradeInfo: titleInfos('N02', 0),
      rowKey: '',
      percentage: null,
      onLineLotteryShow: true,
      pliceShow: false,
      pliceText: '',
      option:{
        // title: {
        //   text: "Beijing AQI"
        // },
        tooltip: {
          trigger: "axis",
          formatter:
            "出价金额: {c} 万元"
        },
        legend: {
          right: 'auto',
          data: ['出价'],
          top: 10
        },
        xAxis: {
          name: "出价时间",
          data:[]
        },
        yAxis: {
          name: "单位（万元）",
          minInterval: 1,
          min: 'dataMin',
          axisLabel: {
            formatter: `{value}`
          },
          splitLine: {
            show: false
          },
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
          },
          {
            type: 'inside',
            realtime: true,
          }
        ],
        visualMap: {
          top: 0,
          right: 0,
          pieces:[],
          outOfRange: {
            color: '#999'
          }
        },
        series: {
          name: "出价",
          type: "line",
          symbolSize: 12,
          smooth: true,
          hoverAnimation: false,
          data:[],
          markLine: {
            silent: true,
            label: {
              formatter: '{c}'
            },
            data: [{
                yAxis: 50
            }, {
                yAxis: 100
            }, {
                yAxis: 150
            }, {
                yAxis: 200
            }, {
                yAxis: 300
            }]
          }
        },
        // {
        //    name: "竞买人",
        //   type: "line",
        //   symbolSize: 12,
        //   smooth: true,
        //   hoverAnimation: false,
        //   data:[],
        //   markLine: {
        //     silent: true,
        //     data: [{
        //         yAxis: 50
        //     }, {
        //         yAxis: 100
        //     }, {
        //         yAxis: 150
        //     }, {
        //         yAxis: 200
        //     }, {
        //         yAxis: 300
        //     }]
        //   }
        // }
        // ]
      },
      endTimeId: null,
      serverTime: null,
      day: 0,
      hour: 0,
      min: 0,
      second: 0,
      myChart: null
    }
  },
  computed: {
    ...mapGetters(['currentEditData'])
  },
  watch: {
    '$route.query': {
      deep: true,
      immediate: true,
      handler: function (to, from) {
        if (to.hasOwnProperty('rowKey')) {
          this.rowKey = to.rowKey;
        }
      }
    }
  },
  mounted () {
    this.$nextTick(async () => {
      if (this.currentEditData.hasOwnProperty("row")) {
        this.editData = this.currentEditData;
        this.init();
      }
      this.draw();
    });
  },
  methods: {
    draw(){
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(document.getElementById('myChart'));
      this.myChart.setOption(this.option);
      window.addEventListener('resize',  () => {
        this.myChart.resize();
      });
    },
    toChinese (number) {
      return toChinese(number)
    },
    closeedit () {
      this.editData = {};
      this.timeId = null;
      this.info = {};
      this.curStartTime = '2020-07-31 08:00:00';
      this.agreeLottery = null;
    },
    cancelLottery (status) {
      this.lotteryshow = false;
      this.lotterydata = {};
      if (status.type === 'cancel') {
        this.agreeLottery = agreeLotteryText[status.status];
      }
    },
    init () {
      getBidderTradeTargetDtl(this.editData.row.id).then(res => {
        if (res.code === '200' && res.data) {
          this.view = res.data;
          this.lotteryBidder = this.view.lotteryBidder;
          this.getTradeInfoTitle(res.data);
          res.data.offerLog.length === 0 && this.setBeginPrice(res.data.beginPrice, 0);
          if (res.data.targetStatus === 3 || res.data.targetStatus === 4 || res.data.targetStatus === 9) {
            this.countTime()
          } else {
            this.view = {
              ...this.view,
              offerLog: res.data.offerLog.map(item => {
                return {
                  ...item,
                  bidderName: item.bidderRealName
                };
              })
            }
          }
          this.changeEchart(res.data);
          // 土地、矿业
          const isHide = res.data.targetStatus === 3 || res.data.targetStatus === 4;
          const landIsHide = landBusinessTypeList.indexOf(res.data.businessType) > -1;
          // 耕地指标
          const paimaiIsHide = res.data.transType != '102';
          const plowIsHide = plowBusinessTypeList.indexOf(res.data.businessType) > -1;
          // 购买
          if(plowIsHide) {
            this.symbol = '万元';
            this.singSymbol = '万元';
          }
          this.infoItems = this.infoItems.map(item => {
            // 土地、矿业
            const currentIsHiden = changeList.indexOf(item.id) > -1;
            // 耕地指标
            const plowCurrentIsHiden = plowChangeList.indexOf(item.id) > -1;
            const plowTotalPrice = (plowIsHide && (plowPriceList.indexOf(item.id) > -1)) ? false : item.hide;
            // 购买
            const isBuyType = this.view.businessType === '购买指标' && item.id === 'currentPriceText';
            const isPriceStepType = this.view.businessType === '购买指标' && item.id === 'priceStepText';
            const getName = () => {
              if(isBuyType) return '当前最低价';
              if(isPriceStepType) return '竞价幅度';
              return item.name;
            }
            return {
              ...item,
              id: item.id,
              name: getName(),
              value: item.value ? item.value : res.data[item.id],
              symbol: item.symbol ? symbolText(item.symbol, res.data.businessType, item.id) : '',
              hide: (!isHide && currentIsHiden) || (!paimaiIsHide && plowCurrentIsHiden) || plowTotalPrice
            }
          })
        }
      })
    },
    changeEchart (data) {
      if (data.offerLog.length === 0) return;
      let offerlogData = [...data.offerLog]
      offerlogData.reverse();
      const offerDateList = offerlogData.map((item) => {
        return item.offerDate;
      });
      const priceList = offerlogData.map((item) => {
        return Math.round((item.price) * 100)/100;
      });
      const bidderRealNameList = offerlogData.map((item) => {
        return item.bidderRealName;
      });
      const iMin = Math.min(...priceList);
      const iMax = Math.max(...priceList);
      const length = priceList.length <= visualMapColor.length ? priceList.length : visualMapColor.length;
      const interval = (iMax - iMin)/length;
      const _arr = Array.apply(null, Array(length -1)).map((item, i) => {
        return i + 1
      });
      const visualMapPieces = _arr.map(leng => {
        return {
          gt: iMin + (interval * leng),
          lte: iMin + (interval * (leng + 1)),
          color: visualMapColor[leng]
        };
      });
      const markLine = _arr.map(leng => {
        return {
           yAxis: parseFloat(iMin + (interval * leng)).toFixed(4)
        };
      });
      console.log('markLine', markLine);
      this.option.visualMap.pieces = visualMapPieces;
      this.option.series.markLine.data = markLine;
      this.option.xAxis.data = offerDateList;
      this.option.series.data = priceList;
      this.option.tooltip.formatter = (datas) => {
        return `${datas[0].name} <br/>出价金额: ${offerlogData[datas[0].dataIndex].priceText}${this.symbol}<br/>竞买人：${offerlogData[datas[0].dataIndex].bidderRealName}`;
      };
      // this.option.series[1].data = bidderRealNameList;
      //设置true每次重新绘制echarts
      this.myChart.setOption(this.option,true);
    },
    setBeginPrice(currentPrice, type) {
      const pliceVal = this.plice.value;
      const pliceStepPrice = this.stepPrice < 0 ? pliceVal >= currentPrice : pliceVal <= currentPrice;
      let changeValue = type === 0 ? currentPrice : currentPrice + this.stepPrice;
      if ((pliceStepPrice || pliceVal === 0) && !(changeValue < 0)) {
        this.plice = {
          text: toChinese(changeValue),
          value: changeValue,
          formatting: toThousands(changeValue)
        };
      }
    },
    suptime (time) {
      return +time < 10 ? `0${time}` : time;
    },
    submitOfferPlice () {
      this.offershow = true;
      this.offerdata = {
        plice: this.plice.value,
        pliceText: this.plice.formatting
      };
    },
    setValue (data) {
      const infoItems = this.infoItems.map(item => {
        const isChange = changeList.indexOf(item.id) > -1;
        return {
          ...item,
          id: item.id,
          name: item.name,
          value: isChange ? data[item.id] : item.value,
        }
      });
      this.infoItems = infoItems;
    },
    // 倒计时
    countTime () {
      const { row } = this.editData;
      const url = '/api/trade/tradeInfo/' + row.id;
      axios.get(url).then(r => {
        const res = r.data;
        if (res.code === '200' && res.data) {
          this.info = res.data;
          this.requireBidderNum = res.data.applyCount;
          this.finalPriceText = res.data.finalPriceText;
          this.requirePriceNum = res.data.priceCount;
          this.reservePriceText = res.data.reservePriceText;
          this.lotteryBidder = this.info.lotteryBidder;
          this.changeEchart(res.data);
          if(res.data.curNode === 'L03' && res.data.tradeBegin === 1 && res.data.dateDownAry) {
            const dateDownAry = res.data.dateDownAry;
            const remainTime = (+dateDownAry[2] * 60) + (+dateDownAry[3]);
            this.percentage = ((remainTime / res.data.limitWait) * 100);
          }
          this.setValue(res.data);
          this.getTradeInfoTitle(res.data);
          this.lotteryTip = lotteryTip(res.data.isFinalPrice === 1 ? '封顶价' : '底价');
          window.clearTimeout(this.endTimeId);
          this.setTime({
            serverTime: res.data.serverTime,
            endTime: res.data.endTime
          });
          this.stepPrice = res.data.stepPrice;
          res.data.offerLog.length > 0 && this.setBeginPrice(res.data.currentPrice, 1);
          if(this.stepPrice < 0) {
            this.canDown = true;
            if((this.info.currentPrice === 0 && this.plice.value >= this.view.beginPrice) || (this.info.currentPrice !== 0 && this.plice.value >= this.info.currentPrice)) {
              this.canUp = false;
            } else {
              this.canUp = true;
            }
          } else {
            this.canUp = true;
            if ((this.info.currentPrice === 0 && this.plice.value <= this.view.beginPrice) || (this.info.currentPrice !== 0 && this.plice.value <= this.info.currentPrice)) {
              this.canDown = false;
            } else {
              this.canDown = true;
            }
          }
          if(res.data.isStop === 1 || res.data.isSuspend === 1) {
            window.clearTimeout(this.timeId);
            this.timeId = null;
            window.clearTimeout(this.endTimeId);
            this.endTimeId = null;
            return;
          }
          // 摇号
          if (res.data.curNode === 'F01' && this.agreeLottery === null) {
            this.lotteryshow = true;
            this.lotterydata = res.data;
          }
          // 限时竞价
          if (res.data.curNode === 'L03') {
            this.warnShow = true;
          }
          // 根据交易状态判断
          if (res.data.dealStatus !== null && res.data.dealStatus !== undefined && res.data.dealStatus !== 0) {
            window.clearTimeout(this.timeId);
            this.timeId = null;
            this.countdownShow = false;
            this.info = {
              ...res.data,
              offerLog: res.data.offerLog.map(item => {
                return {
                  ...item,
                  bidderName: item.bidderRealName
                };
              })
            };
            // dealStatus
            // 交易状态0：未结束 1：成交 2：未成交 3:摇号 4：摇号竞得
            if (res.data.dealStatus === 1) {
              this.lotteryshow = false;
              this.lotterydata = {};
              this.resultshow = true;
              this.resultdata = res.data;
            } else if (res.data.dealStatus === 2) {
              this.auctionshow = true;
              this.auctionData = res.data;
            } else if (res.data.dealStatus === 3) {
              this.lotteryshow = false;
              this.lotterydata = {};
            } else if (res.data.dealStatus === 4) {
              this.lotteryshow = false;
              this.lotterydata = {};
              this.getLotteryResult();
            }
          } else {
            // 递归每秒调用countTime方法，显示动态时间效果,
            this.timeId = setTimeout(this.countTime, 10000)
          }
        }
      });
    },
    setTime(times) {
      // 获取当前时间
      let now = moment(times.serverTime, "YYYY-MM-DD HH:mm:ss").valueOf();
      // 设置截止时间
      let end = moment(times.endTime, "YYYY-MM-DD HH:mm:ss").valueOf()
      // 时间差
      let leftTime = end - now;
      // 定义变量 d,h,m,s保存倒计时的时间
      if (leftTime >= 0) {
        // 天
        this.day = Math.floor(leftTime / 1000 / 60 / 60 / 24)
        // 时
        let h = Math.floor(leftTime / 1000 / 60 / 60 % 24)
        this.hour = h
        // 分
        let m = Math.floor(leftTime / 1000 / 60 % 60)
        this.min = m
        // 秒
        let s = Math.floor(leftTime / 1000 % 60)
        this.second = s
      } else {
        this.day = 0
        this.hour = 0
        this.min = 0
        this.second = 0
      }
      this.serverTime = getTime(this.serverTime, 1);
      // 等于0的时候不调用
      if (Number(this.hour) === 0 && Number(this.day) === 0 && Number(this.min) === 0 && Number(this.second) === 0) {
          window.clearTimeout(this.endTimeId);
          this.endTimeId = null;
        return
      } else {
          this.endTimeId = setTimeout(() => this.setTime({
            ...times,
            serverTime: this.serverTime
          }), 1000);
      }
    },
    getLotteryResult () {
      const { row } = this.editData;
      const url = '/api/trade/lotteryTradeInfo/' + row.id;
      axios.get(url).then(r => {
        const res = r.data;
        if (res.code === '200') {
          this.info = {
            ...this.info,
            ...res.data
          };
          window.clearTimeout(this.timeId);
          this.timeId = null;
        } else {
          this.timeId = setTimeout(this.getLotteryResult, 1000)
        }
      });
    },
    getTradeInfoTitle (info) {
      const curNodes = Object.keys(titleInfos())
      const isChange = curNodes.indexOf(info.curNode) > -1;
      const isSuspendAndStop = info.isSuspend === 1 || info.isStop === 1;
      let curNode = info.curNode;
      if(isSuspendAndStop) {
        curNode = info.isSuspend === 1 ? 'suspend' : 'stop';
      }
      if(info.dealStatus === 1 || this.view.targetStatus === 5) {
        curNode = 'success';
      }
      this.tradeInfo = titleInfos(curNode, info.tradeBegin);
    },
    changePlice (type) {
      const pliceVal = this.plice.value;
      const value = (type === 'up') ? pliceVal + Math.abs(this.stepPrice) : pliceVal - Math.abs(this.stepPrice);
      let pliceStepPrice = true;
      if(this.stepPrice < 0) {
        if((this.info.currentPrice === 0 && value <= this.view.beginPrice) || (this.info.currentPrice !== 0 && value <= this.info.currentPrice)) {
          pliceStepPrice = true;
        } else {
          pliceStepPrice = false;
        }
      } else {
        if((this.info.currentPrice === 0 && value >= this.view.beginPrice) || (this.info.currentPrice !== 0 && value >= this.info.currentPrice)) {
          pliceStepPrice = true;
        } else {
          pliceStepPrice = false;
        }
      }
      if (pliceStepPrice) {
        this.plice = {
          text: toChinese(value),
          value: value,
          formatting: toThousands(value)
        }
      }
    },
    cancelOffer (type) {
      this.offerdata = {};
      this.offershow = false;
    },
    successOffer (data) {
      this.offerdata = {};
      this.offershow = false;
      const parames = {
        price: data.plice,
        targetId: this.editData.row.id
      };
      savePrice(parames).then(res => {
        if (res.code === '200') {
          const currentPrice = parames.price
          this.plice = {
            text: toChinese(currentPrice + this.stepPrice),
            value: currentPrice + this.stepPrice,
            formatting: toThousands(currentPrice + this.stepPrice)
          };
          // const isBuyType = this.info.businessType === '购买指标';
          // const isReservePrice = this.info.reservePrice >=  currentPrice;
          // const isFinalPrice = this.info.finalPrice <=  currentPrice;
          // console.log(isBuyType, isReservePrice, isFinalPrice);
          // if(isReservePrice && isBuyType) {
          //   this.pliceShow = true;
          //   this.pliceText = `出价${currentPrice}${this.singSymbol}小于该指标的底价${this.info.reservePrice}${this.singSymbol}。所以您此次出价为出底价${this.info.reservePrice}${this.singSymbol}成功!`;
          // } else if(isFinalPrice && !isBuyType) {
          //   this.pliceShow = true;
          //   this.pliceText = `出价${currentPrice}${this.singSymbol}大于该指标的封顶价${this.info.finalPrice}${this.singSymbol}。所以您此次出价为出封顶价${this.info.finalPrice}${this.singSymbol}成功!`;
          // } else {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              position: 'bottom-right'
            });
          // }
        }
      });
    },
    cancelResult () {
      this.resultshow = false;
      this.resultdata = {};
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataLotteryAllList()
    },
    onPageSizeChange (val) {
      this.page.pageSize = val
      this.onCurrentChange(1)
    },
    getDataLotteryAllList () {

    },
    cancelAuction () {
      this.auctionshow = false;
    },
    cancelWarn () {
      this.warnShow = false;
    },
    cancelLotteryCanvas () {
      this.onLineLotteryShow = false;
      this.resultshow = true;
      this.resultdata = this.info;
    }
  },
  created () {
    // this.isAdd && this.init();
  },
  destroyed () {
    window.clearTimeout(this.timeId);
    this.timeId = null;
    this.closeedit();
  }
}
</script>

<style lang="less" scoped>
.people_deal_offer_log_edit {
  position: relative;
  padding-bottom: 40px;
  font-size: 14px;
  .tipContainer {
    height: 38px;
    margin-bottom: 20px;
    .colorBlock {
      width: 38px;
      height: 38px;
      background: linear-gradient(
        270deg,
        rgba(85, 139, 233, 1) 0%,
        rgba(104, 157, 247, 1) 100%
      );
      img {
        width: 20px;
        height: 20px;
      }
    }
    .tipText {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex: 1;
      background: #fff;
      font-size: 14px;
      font-weight: 400;
      color: rgba(63, 63, 63, 1);
      padding: 0 20px;
      span {
        height: 26px;
        background: linear-gradient(
          90deg,
          rgba(243, 131, 31, 1) 0%,
          rgba(249, 137, 37, 1) 100%
        );
        border-radius: 5px;
        margin-left: 10px;
        color: #fff;
        padding: 0 15px;
      }
    }
  }
  .infoContainer {
    padding: 20px 20px 10px;
    border: 1px solid #d9d9d9;
    background: #fff;
    > div {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .item {
      display: flex;
      flex-direction: row;
      width: 35%;
      margin-bottom: 10px;
      &:nth-child(3n) {
        width: 30%;
      }
    }
  }
  .pliceContainer {
    background: #fff;
    position: relative;
    width: 100%;
    height: 415px;
    padding: 20px;
    margin: 20px 0 0;
    display: flex;
    flex-direction: column;
    border: 1px solid #d9d9d9;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    .container {
      min-width: 401px;
      &.finalPrice {
        padding: 30px 0 50px;
      }
    }
    .timeInfo {
      position: absolute;
      top: 20px;
      left: 20px;
      display: flex;
      flex-direction: column;
    }
    .countdown {
      width: auto;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      align-items: flex-start;
      margin-right: 16px;
      &:first-child {
        margin-bottom: 20px;
        .time {
          width: 225px;
        }
      }
      &:last-child {
        .time {
          width: 200px;
          > div > span {
            &:last-child {
              font-size: 12px;
              margin: 0 5px;
              color: #868686;
              font-weight: normal;
            }
          }
        }
      }
      > span {
        font-size: 14px;
        font-weight: 600;
        color: #5d5d5d;
        padding: 0 5px;
      }
      .time {
        // width: 100%;
        height: 25px;
        padding: 5px 0px;
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        height: 34px;
        background: linear-gradient(
          102deg,
          rgba(226, 234, 255, 1) 0%,
          rgba(214, 225, 255, 1) 100%
        );
        box-shadow: 0px 2px 4px 0px rgba(109, 143, 207, 0.5);
        border-radius: 5px;
        color: #334878;
        font-size: 18px;
        box-sizing: border-box;
        > div {
          display: flex;
          flex-direction: row;
          align-items: center;
          > span {
            color: #334878;
            font-size: 18px;
          }
        }
      }
    }
    h4 {
      font-size: 22px;
      font-weight: 500;
      color: rgba(63, 63, 63, 1);
      line-height: 30px;
    }
    .content {
      position: relative;
      .plice {
        width: auto;
        height: 80px;
        padding: 0 30px;
        margin: 20px 55px 20px 0;
        background: linear-gradient(
          132deg,
          rgba(247, 152, 58, 1) 0%,
          rgba(239, 136, 31, 1) 100%
        );
        box-shadow: 0px 9px 9px 0px rgba(255, 206, 159, 0.5);
        border-radius: 5px;
        font-size: 50px;
        font-family: Impact;
        color: rgba(255, 255, 255, 1);
        line-height: 61px;
        letter-spacing: 1px;
        text-shadow: 0px 2px 4px rgba(225, 121, 16, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        h5 {
          font-size: 18px;
          font-weight: 500;
          color: rgba(123, 123, 123, 1);
          line-height: 25px;
        }
      }
      .el-button {
        position: absolute;
        right: 0;
        width: 35px;
        height: 35px;
        background: rgba(255, 255, 255, 1);
        border-radius: 2px;
        border: 1px solid rgba(167, 167, 167, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        &.up {
          top: 0;
        }
        &.down {
          bottom: 0;
        }
        i {
          font-size: 17px;
          color: #696969;
          &.disable {
            background: #d8d8d8;
            color: #a1a1a1;
          }
        }
      }
      .unit {
        position: absolute;
        bottom: 0;
        right: -45px;
        font-size: 18px;
        font-weight: 500;
        color: rgba(63, 63, 63, 1);
      }
    }
    .submit {
      position: absolute;
      right: 20px;
      bottom: 20px;
      width: 110px;
      height: 50px;
      background: rgba(37, 115, 241, 1);
      font-size: 16px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 20px;
    }
  }
  .lotteryContainer {
    height: auto;
    padding: 0;
    padding-bottom: 20px;
    border-top: none;
    /deep/.comp-wrapper {
      width: 100%;
      .comp-wrapper-header__right {
        font-size: 14px;
      }
      .comp-wrapper-content {
        padding: 0 20px;
        > div:first-child {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          margin-top: 20px;
        }
        .el-pagination {
          margin-top: 0 !important;
        }
      }
    }
    .center {
      width: 33.33%;
      padding-right: 13.33px;
      box-sizing: border-box;
      margin-bottom: 20px;
      position: relative;
      > img {
        width: 79px;
        height: 64px;
        position: absolute;
        bottom: 0;
        right: 24px;
      }
      .info {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 1px 8px 0px rgba(170, 171, 197, 0.5);
        padding: 16px 20px;

        > div {
          align-items: center;
          margin: 3px 0 20px;
          > span {
            width: 97px;
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(63, 63, 63, 1);
            text-align: left;
          }
          &:first-child {
            div {
              font-size: 20px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: rgba(63, 63, 63, 1);
            }
          }
          &:nth-child(2) {
            align-items: flex-start;
            > div {
              > span {
                display: flex;
                &:first-child {
                  font-size: 30px;
                  font-family: Impact;
                  color: rgba(255, 121, 1, 1);
                  line-height: 36px;
                  letter-spacing: 2px;
                  margin-right: 10px;
                }
                &:last-child {
                  font-size: 18px;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: 500;
                  color: rgba(63, 63, 63, 1);
                  margin-top: 5px;
                }
              }
            }
          }
          &:last-child {
            margin-bottom: 0;
            div {
              font-size: 20px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: rgba(63, 63, 63, 1);
            }
          }
        }
      }
      &:nth-child(3n) {
        padding-right: 0;
        padding-left: 13.33px;
      }
      &:nth-child(3n-1) {
        padding-left: 6.66px;
        padding-right: 6.66px;
      }
    }
  }
  .historyContainer {
    margin-top: 20px;
    #myChart{
      padding-bottom: 10px;
      margin: 0 auto;
    }
    /deep/.el-table__fixed-body-wrapper {
      top: 44px !important;
    }
  }
}
</style>
<style lang="less">
.people_deal_offer_log_edit{
  .comp-wrapper{
    // background: transparent !important;
    /deep/.comp-wrapper-content{
      padding: 0;
    }
  }
}
</style>
