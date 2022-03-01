<template>
  <div class="canvasContainer">
    <div class="container">
      <span class="line" :class="!result && 'active'"/>
      <canvas id="c" ref="c"></canvas>
      <img src="../images/img3.png" ref="ballImg" style="display: none"/>
      <img src="../images/img7.png" ref="activeBallImg" style="display: none"/>
    </div>
    <div class="list">
      <h4>参加摇号名单</h4>
      <page-table
        col-align="left"
        :data="tableData"
        :cols="tableCols"
        :showPage="false"
        hideDefaultIndex
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import PageTable from '@/components/page-table';
import { colors, particles, random } from '../utils';

export default {
  name: 'lotteryCanvas',
  components: {
    PageTable
  },
  props: {
    data: {
      type: Array,
      default: []
    },
    time: {
      type: String,
      default: ''
    },
    dealApplyNo: {
      type: String,
      default: ''
    },
    lotteryTime:  {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      c: this.$refs.c,
      ctx: null,
      colors: [],
      R: 164 - 30,
      cx: 328/2,
      cy: 328/2 - 30,
      rad: Math.PI / 180,
      r: 0,
      w: (1/2)*Math.PI, //角速度，（1/2）弧度每秒
      t: new Date(),   //起始时间
      lotterTimerId: null,
      lotteryCanvas: {},
      tableData: [],
      tableCols: [
        { label: '球号', prop: 'lotteryNo', align: 'left', width: 50},
        { label: '竞买人编号', prop: 'applyNo', align: 'left' }
      ],
      result: null,
      timeValue: null,
      timeArray: null,
      Aball: [],
      maxWidth: null,
      maxHeight: null,
      timeId: null,
      ballImg: new Image(),
      activeBallImg: new Image(),
      xyLength: 0,
      allStepNumber: 0,
      stepNumber: 0
    }
  },
  computed: {
  },
  watch: {
    data: {
      immediate: true,
      handler: function(val, oldVal) {
        this.tableData = val;
      },
    },
    time: {
      immediate: true,
      handler: function(val, oldVal) {
        this.timeValue = moment(val, "YYYY-MM-DD HH:mm:ss").valueOf();
        this.timeAll = this.timeValue + this.lotteryTime;
        this.allStepNumber = this.lotteryTime * 1000 / 10;
        if(this.lotterTimerId === null && this.tableData && this.tableData.length > 0) {
          this.timeId = setTimeout(() => {
            this.initDraw();
          }, 500)
        }
      },
    },
    dealApplyNo: {
      immediate: true,
      handler: function(val, oldVal) {
        if(val) {
          this.result = val;
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.c = this.$refs.c;
      this.ballImg = this.$refs.ballImg;
      this.activeBallImg = this.$refs.activeBallImg;
      // this.timeId = setTimeout(() => {
      //   this.result = this.dealApplyNo;
      // }, this.lotteryTime)
    });
  },
  methods: {
    initDraw () {
      this.colors = colors;
      this.ctx = this.c.getContext("2d");
      this.c.width = 600;
      this.c.height = 500;
      this.maxWidth = 328;
      this.maxHeight = 328;
      this.Aball = [];
      this.xyLength = this.tableData[0] && this.tableData[0].lotteryXY && this.tableData[0].lotteryXY.length;
      for (var i = 0; i < this.tableData.length; i++) {
        this.Aball[i] = new this.Ball(this, this.tableData[i], this.maxWidth, this.maxHeight);
      }
      this.lotterTimerId = setInterval(() => {
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
        this.stepNumber = this.stepNumber + 1;
        for (var i = 0; i < this.tableData.length; i++) {
          this.Aball[i].moveBall();
        }
      }, 10)
    },
    getNumber (array, number) {
      return number <= array.length ? array[number - 1] : array[(number - 1) - array.length];
    },
    Ball(that, item, maxWidth, maxHeight) {
      this.a = true;
      this.b = true;
      this.info = false;
      this.r = 27;
      this.ball = { color: that.ballImg, applyNo: item.applyNo, number: item.lotteryNo, lotteryXY: item.lotteryXY };
      if (item.lotteryXY) {
        this.vx = this.ball.lotteryXY && this.ball.lotteryXY[0].x;
        this.vy = this.ball.lotteryXY && this.ball.lotteryXY[0].y;
      } else {
        const timeArray = [1,5,8,9,2,4,9,1,6,6];
        const num = that.getNumber(timeArray, this.ball.number);
        const num2 = that.getNumber(timeArray.reverse(), this.ball.number);
        this.ispeed = random(num, 8, 10);
        this.ispeed2 = random(num2, 8, 10);
        this.vx = random(num, 30, maxWidth-30);
        this.vy = random(num2, 30, maxHeight-30);
      }
        this.stop = false;
        this.moveBall = () => {
          if(that.result && this.ball.applyNo === that.result) {
            this.ball.color = that.activeBallImg;
          }
          if(!that.result && that.stepNumber <= that.allStepNumber) {
            const a = Math.floor(that.stepNumber/that.xyLength);
            const b = that.xyLength * a;
            if (this.ball.lotteryXY) {
            const stepNumber = (that.stepNumber - b) - 1;
            this.vx = this.ball.lotteryXY && this.ball.lotteryXY[that.stepNumber].x;
            this.vy = this.ball.lotteryXY && this.ball.lotteryXY[that.stepNumber].y;
            } else {
              if (this.a) {
                this.vx += this.ispeed;
                if (this.vx >= that.maxWidth - 65) {
                    this.a = false;
                }
              } else {
                  this.vx -= this.ispeed;
                  if ((this.vx <= 65)) {
                      this.a = true;
                  }
              }

              if (this.b) {
                  this.vy += this.ispeed2;
                  if (this.vy >= that.maxHeight - 65) {
                      this.b = false;
                  }

              } else {
                  this.vy -= this.ispeed2;
                  if ((this.vy <= 60)) {
                      this.b = true;
                  }
              }
            }
          }
          else if(that.result && this.ball.applyNo === that.result) {
            if(!this.stop) {
              let tt = new Date();
              let T = (tt - that.t) / 1000; //时间间隔
              that.t = tt;
              that.r += ((that.w * T)/1.3)
              this.vx = that.cx + that.R * Math.cos(that.r);
              this.vy = 30　+ (that.R - that.R * Math.sin(that.r));
              if(this.vy >= 290 && this.vx >= 149) {
                this.stop = true;
              }
            } else if(this.vx <= 370){
              this.vx = this.vx + 1
              this.vy = this.vy + 0.1;
              if(this.vx > 328) {
                this.vy = this.vy + 1;
              }
              if(this.vx > 350) {
                this.r = 68.58/2;
                this.info = true;
              }
              if(this.vx > 370) {
                window.clearInterval(that.lotterTimerId);
                that.lotterTimerId = null;
                that.timeId = setTimeout(() => {
                  that.$emit('cancel');
                }, 6000);
              }
            }
          }
          // console.log('this.vx, this.vy', this.vx, this.vy);
          that.ctx.save();
          that.ctx.beginPath();
          that.ctx.arc(this.vx, this.vy, this.r, 0, Math.PI * 2, false);
          that.ctx.fill();
          that.ctx.clip();
          that.ctx.drawImage(this.ball.color, this.vx - this.r, this.vy - this.r, this.r * 2, this.r * 2);
          that.ctx.restore();
          that.ctx.beginPath();
      　　that.ctx.font = "normal 31px 微软雅黑";//字体
      　　that.ctx.textBaseline = "middle";//竖直对齐
      　　that.ctx.textAlign = "center";//水平对齐
          that.ctx.fillStyle = '#fff';
          that.ctx.fillText(this.ball.number, this.vx, this.vy);
          that.ctx.fill();
          if(this.info) {
            that.drawText(that.ctx, `竞买人编号为：`, this.vx + 50, this.vy - 20, 100, 16);
            that.drawText(that.ctx, `${this.ball.applyNo}`, this.vx + 50, this.vy, 200, 16);
            that.drawText(that.ctx, `获得竞买`, this.vx + 50, this.vy + 20, 100, 16);
          }
      }
    },
    drawText(ctx, text, x, y, maxWidth, lineHeight) {
      let canvas = ctx.canvas;
      let arrText = text.split('');
      let line = '';
      ctx.beginPath()
      ctx.font = "normal 14px 微软雅黑";//字体
      ctx.textBaseline = "middle";//竖直对齐
      ctx.textAlign = "left";//水平对齐
      ctx.fillStyle = '#3E3E3E';
      for (let n = 0; n < arrText.length; n++) {
          let testLine = line + arrText[n];
          let metrics = ctx.measureText(testLine);
          let testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
              ctx.fillText(line, x, y);
              line = arrText[n];
              y += lineHeight;
          } else {
              line = testLine;
          }
      }
      ctx.fillText(line, x, y);
      ctx.fill();
    },
    cancelAnimation() {
      window.clearTimeout(this.timeId);
      this.timeId = null;
    }
  },
  created () {
  },
  destroyed() {
    this.cancelAnimation();
  }
}
</script>

<style lang="less" scoped>
.canvasContainer{
  width: 100%;
  height: 100%;
  .container{
    display: inline-block;
    width: 328px;
    height: 416px;
    background: url('../images/img5.png') no-repeat center;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-65%,-50%);
    .line{
      position: absolute;
      width: 285px;
      height: 44.78px;
      background: url('../images/img6.png') no-repeat center;
      background-size: 100% 100%;
      left: 50%;
      top: 145px;
      margin-left: -142.5px;
      &.active{
      animation: rotate360 0.5s linear infinite;
      }
    }
    #c {
      background-color: transparent;
      display: block;
      // border-radius: 50%;
      position: absolute;
    }
    .ball{
      width: 54px;
      height: 54px;
      line-height: 54px;
      border-radius: 50%;
      background: url('../images/img3.png') no-repeat center;
      background-size: 100% 100%;
      color: #fff;
      font-size:31px;
      text-align: center;
    }
  }
  .list{
    position: absolute;
    right: 20px;
    top: 20px;
    padding: 12px 8px;
    width:232px;
    height:auto;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 6px 0px rgba(163,163,163,0.5);
    border-radius:10px;
    h4{
      font-size:14px;
      font-family:PingFangSC-Semibold,PingFang SC;
      font-weight:600;
      color:rgba(62,62,62,1);
      text-align: center;
      margin-bottom: 5px;
    }
    /deep/.comp-page-table{
      .el-table{
        &::before{
          content: none;
        }
      }
      .el-table__header-wrapper{
        th{
          height: 30px;
          padding: 0;
          font-size:12px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(62,62,62,1);
          border-bottom: none;
        }
      }
      .el-table__body-wrapper{
        tbody{
          tr,td{
            height: 30px !important;
            font-size:12px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(62,62,62,1);
            &.warning{
              background: #F6F6F6;
            }
            &:last-child{
              td{
                border-bottom: none;
              }
            }
          }
        }
        .el-table__empty-block{
          font-size:12px;
        }
      }
    }
  }
}
@keyframes rotate360 {
    from{
      transform: rotate(0deg);
    }
    to{
      transform: rotate(-360deg);
    }
}
</style>
