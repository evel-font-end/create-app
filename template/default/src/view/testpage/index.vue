<template>
  <div id="indexPage">
    <el-form
      :inline="true"
      class="searchFrom"
      label-width="50px"
    >
      <el-form-item label="年份：">
        <el-select :value="year" placeholder="选择年份" @change="handleChangeYear" style="width: 100px">
          <el-option
            v-for="(item, index) in years"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="numberContainer">
      <div
        class="main"
        v-for="(item, index) in items"
        :key="index"
        @click="changeBusinessType(item)"
        :class="businessType === item.type ? 'active' : ''"
      >
        <div>
          <div class="image"><img :src="item.img" /></div>
          <div class="title">{{item.title}}</div>
        </div>
        <div>
          <div class="value"><el-tooltip  effect="light" :content="`${item.number}`" placement="top-start"><div>{{item.number}}</div></el-tooltip></div>
          <div class="title">交易宗数(宗)</div>
        </div><div>
          <div class="value"><el-tooltip  effect="light" :content="`${item.money}`" placement="top-start"><div>{{item.money}}</div></el-tooltip></div>
          <div class="title">交易金额(万元)</div>
        </div>
      </div>
    </div>
    <div class="flexRow tendencyContainer">
      <div>
        <span>交易金额构成</span>
        <div id="moneyChart" :style="{width: '100%', height: '365px'}" style="margin: 0 auto"></div>
      </div><div>
        <span>{{title}}</span>
        <div id="infoChart" :style="{width: '100%', height: '335px'}" style="margin: 0 auto"></div>
        <div class="leng">
          <div><span></span>成交宗数</div>
          <div><span></span>成交金额</div>
        </div>
      </div>
    </div>
    <div class="bidderContainer">
      <span>{{bidderTitle}}</span>
      <div id="bidderChart" :style="{width: '100%', height: '300px'}" style="margin: 0 auto"></div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import number from 'components/indexPage/number'
import tableToogle from 'components/indexPage/table'
import {
  getTradeStatistics,
  getTradeStatisticsByMonth,
  getTradeStatisticsByStatus
} from 'api/staticManage/indexPage';
import { transformMoney, getYear } from '@/util/tool';
import img1 from './images/img1.png';
import img2 from './images/img2.png';
import img3 from './images/img3.png';
const animationDuration = 2000;
export default {
  name: 'indexPage',
  data () {
    return {
      year: null,
      businessType: null,
      title: '交易信息趋势图',
      bidderTitle: '标的状态对比图',
      years: [],
      moneyChart: null,
      infoChart: null,
      bidderChart: null,
      items: [{
        type: '101',
        title: '土地交易',
        img: img1,
        number: 0,
        money: 0
      }, {
        type: '301',
        title: '矿业权交易',
        img: img2,
        number: 0,
        money: 0
      }, {
        type: '501',
        title: '耕地指标',
        img: img3,
        number: 0,
        money: 0
      }],
      moneyOption: {
        tooltip: {
            trigger: 'item',
            formatter: '金额：{c}亿'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            bottom: 10,
            itemWidth: 18,
            itemHeight: 10,
            textStyle: {
              color: '#454545',
            },
            borderRadius: 0,
            data: ['土地交易', '矿业权交易', '耕地指标'],
            selected: {'土地交易': true, '矿业权交易': true, '耕地指标': true}
        },
        label:{
          formatter: (datas) => {
            return `${datas.data.value}亿`;
          }
        },
        series: [
            {
                name: '交易金额构成',
                type: 'pie',
                radius: '55%',
                center: ['50%', '40%'],
                minAngle: 15,
                data: [
                    {value: 0, name: '土地交易', type: '101',
                      label: {
                        fontSize: 14,
                        color: '#fff',
                        backgroundColor: 'rgba(25,25,25,0.58)',
                        padding: [10, 15, 7],
                        borderRadius: 9
                      },
                      labelLine: {
                        length: 15,
                        lineStyle: {
                          width: 2,
                          color: '#D3D3D3'
                        }
                      },
                      itemStyle: {
                        color: '#FF7938'
                      },
                    },
                    {value: 0, name: '矿业权交易', type: '301',
                      label: {
                        fontSize: 14,
                        color: '#fff',
                        backgroundColor: 'rgba(25,25,25,0.58)',
                        padding: [10, 15, 7],
                        borderRadius: 9
                      },
                      labelLine: {
                        length: 15,
                        lineStyle: {
                          width: 2,
                          color: '#D3D3D3'
                        }
                      },
                      itemStyle: {
                        color: '#26C4F5'
                      }
                    },
                    {value: 0, name: '耕地指标', type: '501',
                      label: {
                        fontSize: 14,
                        color: '#fff',
                        backgroundColor: 'rgba(25,25,25,0.58)',
                        padding: [10, 15, 7],
                        borderRadius: 9
                      },
                      labelLine: {
                        length: 15,
                        lineStyle: {
                          width: 2,
                          color: '#D3D3D3'
                        }
                      },
                      itemStyle: {
                        color: '#4564F2'
                      }
                    },
                ],
                itemStyle: {
                  borderWidth: 3,
                  borderColor: '#fff'
                },
                animationDuration,
                animationEasing: 'cubicInOut'
            }
        ],
      },
      infoOption: {
        grid: {
          show: true,
          borderWidth: 0,
          borderColor: '#fff',
          left: '3%',
          right: '4%',
          containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#283b56'
                }
            }
        },
        xAxis: [
          {
              type: 'category',
              boundaryGap: true,
              data: [],
              splitLine: {
                show: false,
              },
              borderWidth: 0,
              borderColor: '#fff',
              axisLine: {
                show: false,
                length: 0,
                color: '#454545'
              },
              axisTick:{
                show: false
              }
          }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                name: '单位：宗',
                max: 'dataMax',
                min: 0,
                boundaryGap: [0.2, 0.2],
                splitLine: {
                  lineStyle: {
                    color: '#F3F3F3'
                  }
                },
                axisLine: {
                  show: false,
                  length: 0,
                  color: '#454545'
                },
                axisTick:{
                  show: false
                }
            },
            {
                type: 'value',
                scale: true,
                name: '单位：万元',
                max: 'dataMax',
                min: 0,
                boundaryGap: [0.2, 0.2],
                splitLine: {
                  show: false,
                },
                axisLine: {
                  show: false,
                  length: 0,
                  color: '#454545'
                },
                axisTick:{
                  show: false
                }
            }
        ],
        series: [
            {
                name: '成交金额',
                type: 'line',
                yAxisIndex: 1,
                data: [],
                itemStyle: {
                  color: '#FF8E41'
                }
            },
            {
                name: '成交宗数',
                type: 'bar',
                yAxisIndex: 0,
                data: [],
                barMaxWidth: 41,
                itemStyle: {
                  color: '#44CCD2'
                }
            }
        ]
      },
      bidderOption:{
        grid: {
          left: '3%',
          right: '4%',
          containLabel: true
        },
        legend: {
          right: 10,
          bottom: 10,
          itemWidth: 18,
          itemHeight: 10,
          data: ['标的数量']
        },
        xAxis: {
          type: 'category',
          splitLine: {
            show: false
          },
          data: [],
          axisLine: {
            show: false,
            length: 0,
            color: '#454545'
          },
          axisTick:{
            show: false
          }
        },
        yAxis: {
            type: 'value',
            name: '单位：宗',
            splitLine: {
              lineStyle: {
                color: '#F3F3F3'
              }
            },
            axisLine: {
              show: false,
              length: 0,
              color: '#454545'
            },
            axisTick:{
              show: false
            }
        },
        series: [{
            name: '标的数量',
            data: [],
            type: 'bar',
            showBackground: false,
            barMaxWidth: 41,
            large: true,
            label: {
              show: true,
              position: 'top',
              distance: 10,
              fontSize: 12,
              color: '#fff',
              backgroundColor: 'rgba(25,25,25,0.58)',
              padding: [4, 10, 2],
              borderRadius: 4
            },
            itemStyle: {
              color: '#56C9A2',
            }
        }]
      }
    };
  },
  components: {
    number,
    tableToogle
  },
  mounted () {
    this.$nextTick(async () => {
      this.years = await getYear(10);
      this.year = this.years[0];
      this.getDataAllList();
      this.getMonthDataList();
      this.getStatusDataList();
      this.draw();
    });
  },
  methods: {
    ...mapMutations([
      'set_common'
    ]),
    draw(){
      // 基于准备好的dom，初始化echarts实例
      this.moneyChart = this.$echarts.init(document.getElementById('moneyChart'));
      this.moneyChart.setOption(this.moneyOption);   
      this.infoChart = this.$echarts.init(document.getElementById('infoChart'));
      this.infoChart.setOption(this.infoOption);   
      this.bidderChart = this.$echarts.init(document.getElementById('bidderChart'));
      this.bidderChart.setOption(this.bidderOption);
      window.addEventListener('resize',  () => {
        this.moneyChart.resize()
        this.infoChart.resize()
        this.bidderChart.resize()
      }); 
    },
    // 获取所有/查询数据列表
    getDataAllList () {
      let parames = {
        date: this.year
      };
      getTradeStatistics(parames).then(res => {
        if (res.code === '200') {
          this.setItems(res.data);
          this.setMoney(res.data);
        }
      })
    },
    // 按月份获取交易统计
    getMonthDataList () {
      let parames = {
        date: this.year,
        businessType: this.businessType
      };
      getTradeStatisticsByMonth(parames).then(res => {
        if (res.code === '200') {
          this.setMonth(res.data);
        }
      })
    },
    // 按状态获取交易统计
    getStatusDataList () {
      let parames = {
        date: this.year,
        businessType: this.businessType
      };
      getTradeStatisticsByStatus(parames).then(res => {
        if (res.code === '200') {
          this.setStatus(res.data);
        }
      })
    },
    setItems (data) {
       this.items = this.items.map(item => {
        const objItem = data.find(da => da.businessType === item.type);
        return {
          ...item,
          number: objItem && objItem.counts,
          money: objItem && objItem.sumPriceText
        }
      });
    },
    setMoney (data) {
      this.moneyOption.series[0].data = this.moneyOption.series[0].data.map(seriesData => {
        const objItem = data.find(da => da.businessType === seriesData.type);
        return {
          ...seriesData,
          value: objItem && transformMoney(objItem.sumPrice, 10000) // 万元转亿元
        }
      });
      //设置true每次重新绘制echarts
      this.moneyChart.setOption(this.moneyOption,true);
    },
    setMonth (data) {
      let xData = [];
      let xCounts = [];
      let xValue = [];
      data.map(da => {
        xData.push(da.dateMonth);
        xCounts.push(da.counts);
        xValue.push(da.sumPriceText)
      });
      this.infoOption.xAxis[0].data = xData;
      this.infoOption.series[1].data = xCounts;
      this.infoOption.series[0].data = xValue;
      this.infoOption.tooltip.formatter = (datas) => {
        const dataIndex = datas[0].dataIndex;
        return `日期：${data[dataIndex].dateMonth} <br/>成交金额: ${datas[0].value}万元<br/>成交宗数：${datas[1].value}宗`;
      };
      this.infoChart.setOption(this.infoOption,true);
    },
    setStatus (data) {
      let xData = [];
      let xValue = [];
      data.map(da => {
        xData.push(da.targetStatusText);
        xValue.push(da.counts);
      });
      this.bidderOption.xAxis.data = xData;
      this.bidderOption.series[0].data = xValue;
      this.bidderChart.setOption(this.bidderOption,true);
    },
    handleChangeYear (year) {
      this.setMoneyOption();
      if(this.year !== year) {
        this.year = year;
        this.getDataAllList();
        this.getMonthDataList();
        this.getStatusDataList();
      }
    },
    changeBusinessType (item) {
      if(this.businessType !== item.type) {
        this.businessType = item.type;
        this.title = `${item.title}信息趋势图`;
        this.bidderTitle = `${item.title}标的状态对比图`.replace('交易', '');
        let selectObj = {};
        Object.keys(this.moneyOption.legend.selected).map(select => {
          if(select === item.title) {
            selectObj[select] = true;
          } else {
            selectObj[select] = false;
          }
        });
        this.moneyOption.legend.selected = selectObj;
        this.moneyOption.series[0].itemStyle.borderWidth = 0;
        this.moneyChart.setOption(this.moneyOption,true);
      } else {
        this.setMoneyOption();
      }
      this.getMonthDataList();
      this.getStatusDataList();
    },
    setMoneyOption () {
      this.businessType = null;
      this.title = `交易信息趋势图`;
      this.bidderTitle = `标的动态对比图`;
      let selectObj = {};
      Object.keys(this.moneyOption.legend.selected).map(select => {
        selectObj[select] = true;
      });
      this.moneyOption.legend.selected = selectObj;
      this.moneyOption.series[0].itemStyle.borderWidth = 3;
      this.moneyChart.setOption(this.moneyOption,true);
    },
    goDetail (item, name) {
      let query = {
        noticeId: item.id,
        noticeType: item.noticeType,
        noticeName: name,
      }
      if(item.noticeType !== 0) {
        query = {
          ...query,
          no: item.no,
          name: item.name,
          noticeDate: item.noticeDate
        };
      }
      this.$router.push({
        name: name,
        query: {
          ...query
        }
      });
      const goName = `${name}Refresh`;
      this.set_common({
        ...this.common,
        [goName]: true
      });
    },
    goMore(name) {
      this.$router.push({
        name: name
      });
    }
  }
};
</script>

<style lang="less" scoped>
#indexPage {
  overflow-x: auto;
  .searchFrom {
    text-align: right;
    .el-form-item{
      margin: 0;
      margin-bottom: 10px;
    }
  }
  .numberContainer{
    width: 100%;
    .main{
      display: inline-block;
      position: relative;
      // width: calc(33.33% - 13.33px);
      width: calc(33.33% - 7px);
      padding: 20px 30px 20px 101px;
      background:rgba(255,255,255,1);
      box-sizing: border-box;
      cursor: pointer;
      >div{
        display: inline-block;
        width: 50%;
        text-align: center;
        &:first-child{
          width: 71px;
          position: absolute;
          top: 20px;
          left: 30px;
          .image{
            width:38px;
            height:38px;
            line-height: 32px;
            background:rgba(40,146,253,1);
            border-radius:19px;
            margin: 0 auto;
            img{
              width: 26px;
              height: 15px;
              vertical-align: middle;
            }
          }
          .title{
            margin-top: 5px;
            font-size:14px;
            font-family:PingFangSC-Semibold,PingFang SC;
            font-weight:600;
            color:rgba(70,70,70,1);
          }
        }
        &:nth-child(2), &:last-child {
          .value{
            height: 38px;
            text-align: center;
            font-size:26px;
            font-family:DINAlternate-Bold,DINAlternate;
            font-weight:bold;
            color:rgba(29,47,101,1);
            >div{
              width: 100%;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
       
          }
          .title{
            text-align: center;
            margin-top: 5px;
            font-size:14px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(70,70,70,1);
          }
        }
      }
      &.active{
        background:rgba(243,247,255,1);
        box-shadow:0px 4px 8px 0px rgba(227,227,227,1);
        border:1px solid rgba(37,115,241,1);
      }
      &:nth-child(2){
        margin:0 10px;
        .image{
          background:rgba(253,196,95,1) !important;
        }
      }
      &:last-child{
        .image{
          background:rgba(90,208,146,1) !important;
        }
      }
    }
  }
  .tendencyContainer{
    margin-top: 10px;
    width: 100%;
    justify-content: space-between;
    >div{
      display: inline-block;
      background: #fff;
      // width: calc(50% - 10px);
      width: calc(50% - 5px);
      height: 420px;
      box-sizing: border-box;
      padding: 17px 19px;
      overflow: hidden;
      &:first-child{
        margin-right: 10px;
      }
      >span{
        font-size:16px;
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:rgba(70,70,70,1);
      }
      .leng{
        // margin-top: 10px;
        text-align: right;
        >div{
          display: inline-block;
          font-size:12px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(69,69,69,1);
          span{
            margin-right: 6px;
          }
          &:first-child{
            margin-right: 20px;
            span{
              display: inline-block;
              width:18px;
              height:10px;
              background:rgba(68,204,210,1);
            }
          }
           &:last-child{
            span{
              display: inline-block;
              position: relative;
              width:7px;
              height:7px;
              background:rgba(255,142,65,1);
              border:2px solid rgba(255,255,255,1);
              border-radius: 50%;
              margin-bottom: -2px;
              margin-right: 15px;
              &::before{
                content: '';
                position: absolute;
                top: 50%;
                left: -9px;
                margin-top: -2px;
                width: 6px;
                height:3px;
                background:rgba(255,142,65,1);
              }
              &::after{
                content: '';
                position: absolute;
                top: 50%;
                right: -9px;
                margin-top: -2px;
                width: 6px;
                height:3px;
                background:rgba(255,142,65,1);
              }
            }
          }
        }
      }
    }
  }
  .bidderContainer{
    background: #fff;
    margin: 10px 0;
    padding: 17px 19px;
    >span{
        font-size:16px;
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:rgba(70,70,70,1);
    }
  }
}
</style>
