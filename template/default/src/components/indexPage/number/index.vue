<template>
  <div id="number">
    <div id="indexChart" :style="{width: '50%', height: '500px'}" style="padding-bottom:'20px';"></div>
    <div class="home_module_1 w">
      <div class="card card_1 c_50">
          <div class="left_item">
              <img class="mgb_3" src="./images/img1.png" alt="">
              <p class="fs18 b tx_c">土地交易</p>
          </div>
          <div class="right_item fs14 ">
              <div class="ri_t">
                  <el-tooltip  effect="light" :content="`${data.land.counts}`" placement="top-start"><p class="mgb_3"><span class="fs30">{{data.land.counts}}</span><span class="c_73">个</span></p></el-tooltip>
                  <p class="c_73">总成交数</p>
              </div>
              <div class="ri_b">
                  <el-tooltip  effect="light" :content="`${data.land.sumPriceText}`" placement="top-start"><p class="mgb_3"><span class="fs30">{{data.land.sumPriceText}}</span><span class="c_73">万元</span></p></el-tooltip>
                  <p class="c_73">总成交金额</p>
              </div>
          </div>
      </div>
      <div class="card card_2 c_50">
          <div class="left_item">
              <img class="mgb_3" src="./images/img2.png" alt="">
              <p class="fs18 b tx_c">矿业权交易</p>
          </div>
          <div class="right_item fs14 ">
              <div class="ri_t">
                  <el-tooltip  effect="light" :content="`${data.mine.counts}`" placement="top-start"><p class="mgb_3"><span class="fs30">{{data.mine.counts}}</span><span class="c_73">个</span></p></el-tooltip>
                  <p class="c_73">总成交数</p>
              </div>
              <div class="ri_b">
                  <el-tooltip  effect="light" :content="`${data.mine.sumPriceText}`" placement="top-start"><p class="mgb_3"><span class="fs30">{{data.mine.sumPriceText}}</span><span class="c_73">万元</span></p></el-tooltip>
                  <p class="c_73">总成交金额</p>
              </div>
          </div>
      </div>
      <div class="card card_3 c_50">
          <div class="left_item">
              <img class="mgb_3" src="./images/img3.png" alt="">
              <p class="fs18 b tx_c">耕地指标</p>
          </div>
          <div class="right_item fs14 ">
              <div class="ri_t">
                  <el-tooltip  effect="light" :content="`${data.plow.counts}`" placement="top-start"><p class="mgb_3"><span class="fs30">{{data.plow.counts}}</span><span class="c_73">个</span></p></el-tooltip>
                  <p class="c_73">总成交数</p>
              </div>
              <div class="ri_b">
                  <el-tooltip  effect="light" :content="`${data.plow.sumPriceText}`" placement="top-start"><p class="mgb_3"><span class="fs30">{{data.plow.sumPriceText}}</span><span class="c_73">万元</span></p></el-tooltip>
                  <p class="c_73">总成交金额</p>
              </div>
          </div>
      </div>
    </div>
    <div id="barChart" :style="{width: '100%'}" style="padding-bottom:'20px';"></div>
  </div>
</template>

<script>
const dataType = {
  'land': '土地交易',
  'mine': '矿业权交易',
  'plow': '耕地指标'
};
let legend = [];
let selected = {};
Object.keys(dataType).map(item => {
  legend.push(dataType[item]);
  selected[dataType[item]] = true;
});
export default {
  data () {
    return {
      data: {
        land: {},
        mine: {},
        plow: {}
      },
      option: {
        title: {
            text: '交易金额构成',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
           left: 'center',
            bottom: 20,
            data: ["花史", "屈华邬"],
            // selected: {花史: true, 屈华邬: true}
        },
        series: [
            {
                name: '姓名',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [{name: "花史", value: 47869},{name: "屈华邬", value: 12144}],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
      },
      barOption: {
        title: {
            text: '交易信息趋势图'
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
        legend: {
            data:['成交金额', '成交宗数']
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }
        },
        dataZoom: {
            show: false,
            start: 0,
            end: 100
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                data: (function (){
                    var now = new Date();
                    var res = [];
                    var len = 10;
                    while (len--) {
                        res.unshift(now.toLocaleTimeString().replace(/^\D*/,''));
                        now = new Date(now - 2000);
                    }
                    return res;
                })()
            },
            {
                type: 'category',
                boundaryGap: true,
                data: (function (){
                    var res = [];
                    var len = 10;
                    while (len--) {
                        res.push(10 - len - 1);
                    }
                    return res;
                })()
            }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                name: '单位（宗）',
                max: 10,
                min: 0,
                boundaryGap: [0.2, 0.2]
            },
            {
                type: 'value',
                scale: true,
                name: '单位（万元）',
                max: 1200,
                min: 0,
                boundaryGap: [0.2, 0.2]
            }
        ],
        series: [
            {
                name: '成交宗数',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: (function (){
                    var res = [];
                    var len = 10;
                    while (len--) {
                        res.push(Math.round(Math.random() * 1000));
                    }
                    return res;
                })()
            },
            {
                name: '成交金额',
                type: 'line',
                data: (function (){
                    var res = [];
                    var len = 0;
                    while (len < 10) {
                        res.push((Math.random()*10 + 5).toFixed(1) - 0);
                        len++;
                    }
                    return res;
                })()
            }
        ]
      }
    };
  },
  props: {
    items: {
      type: Object,
      default: {}
    },
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.draw();
        // this.init();
        // this.changeDraw();
      }, 1000);
    });
  },
  methods: {
    draw () {
      // 基于准备好的dom，初始化echarts实例
      let indexChart = this.$echarts.init(document.getElementById('indexChart'));
      indexChart.setOption(this.option); 
      let barChart = this.$echarts.init(document.getElementById('barChart'));
      barChart.setOption(this.barOption); 
    },
    init () {
      const _this = this;
      Object.keys(this.items).map(item => {
        this.items[item]().then(res => {
          if (res.code === '200') {
            const data = {
              ...this.data
            };
            data[item] = res.data;
            this.data = data;
          }
        })
      });

    },
    changeDraw () {
      const seriesData =  Object.keys(this.data).map((item) => {
        const itemData = this.data[item];
        return {
          name: dataType[item],
          value: itemData.sumPrice || 0
        }
      });
      // return;
      this.option.series[0].data = seriesData;
      let myChart = this.$echarts.init(document.getElementById('myChart'));
      //设置true每次重新绘制echarts
      myChart.setOption(this.option,true);
      window.addEventListener('resize', function () {
        myChart.resize()
      });
    }
  },
  watch: {
  }
};
</script>

<style lang="less">
#number{
  position: relative;
  #indexChart{
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
  }
  .home_module_1 {
    display: block;
    width: 416px;
    margin-left: 620px;
    height: auto;
    // display: flex;
    // flex: 3;
    justify-content: space-between;
    box-sizing: border-box;
    overflow: hidden;
    img {
      width: 104px;
      height: 104px;
    }
    .card {
      width: 416px;
      margin-bottom: 20px;
      display: flex;
      flex: 2;
      justify-content: space-between;
      align-items: center;
      background:linear-gradient(136deg,rgba(255,255,255,1) 0%,rgba(250,252,255,1) 100%);
      box-shadow:0px 3px 8px 0px rgba(193,217,209,0.5);
      border-radius:4px;
      padding: 16px 16px;
      box-sizing: border-box;
      .left_item {
        width: 104px;
      }
      .right_item {
        flex: 1;
        margin-left: 37px;
        .mgb_3{
          display: flex;
          flex-direction: row;
          margin-bottom: 6px;
          .fs30{
            line-height: 26px;
            max-width: 180px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            display: inline-block;
            margin-right: 3px;
          }
          .c_73{
            align-self: flex-end;
          }
        }
        .ri_t .fs30{
            color: #F36012;
        }
      }
      .ri_t {
        margin-bottom: 20px;
      }
      .ri_b {
      }
    }
    .card_1,
    .card_2 {
      margin-right: 24px;
    }
    .card_3{
      .ri_t .fs30{
        color: #0B9C66 !important;
      }
    }
    .card_1{
      .ri_t .fs30{
        color: #006BBF !important;
      }
    }
  }
}
</style>
