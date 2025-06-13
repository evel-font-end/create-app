import * as echarts from './echarts'

let clientWidth = document.documentElement.clientWidth || document.body.clientWidth
let nowSize = function (val, initWidth = 750) {
  return val * (clientWidth / initWidth)
}
// 线性图
export const getLine = function (value) {
  const defaultData = {
    legendData: ['预警44', '误报44', '维保测试44'],
    data: [],
    dataX: ['1/1', '1/2', '1/3', '6/14', '6/15', '6/16', '6/17'],
    color: ['#6BD98D', '#EE3E3E', '#FB9A55', '#FFD541', '#B3C9D5', '#8285FF'],
    series: [
      {
        name: '预警',
        type: 'line',
        symbol: 'circle',
        showAllSymbol: true,
        symbolSize: 5,
        smooth: true,
        barWidth: 8, // 设置柱子宽度为类目宽度的 16px
        barGap: '0', // 设置相邻柱子间距为类目宽度的0,挨着一起
        data: [50, 70, 90, 80, 100, 60, 20],
        itemStyle: {
          // 设置柱状图颜色
          color: '#EE3E3E',
        },
        lineStyle: {
          width: 2,
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: '#EE3E3E',
            },
            {
              offset: 1,
              color: '#EE3E3E',
            },
          ]),
          shadowColor: 'rgba(238, 62, 62, .4)',
          shadowBlur: 20,
          shadowOffsetY: 5,
        },
      },
      {
        name: '误报',
        type: 'line',
        symbol: 'circle',
        showAllSymbol: true,
        symbolSize: 5,
        smooth: true,
        barWidth: 8, // 设置柱子宽度为类目宽度的 16px
        barGap: '0', // 设置相邻柱子间距为类目宽度的20%
        data: [30, 50, 55, 70, 90, 50, 18],
        itemStyle: {
          // 设置柱状图颜色
          color: '#34D2D0',
        },
        lineStyle: {
          width: 2,
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: '#34D2D0',
            },
            {
              offset: 1,
              color: '#34D2D0',
            },
          ]),
          shadowColor: 'rgba(52, 210, 208, .4)',
          shadowBlur: 20,
          shadowOffsetY: 5,
        },
      },
      {
        name: '维保测试',
        type: 'line',
        symbol: 'circle',
        showAllSymbol: true,
        symbolSize: 5,
        smooth: true,
        barWidth: 8, // 设置柱子宽度为类目宽度的 16px
        barGap: '0', // 设置相邻柱子间距为类目宽度的20%
        data: [50, 50, 45, 60, 90, 100, 38],
        itemStyle: {
          // 设置柱状图颜色
          color: '#0070FF',
        },
        lineStyle: {
          width: 2,
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: '#0070FF',
            },
            {
              offset: 1,
              color: '#0070FF',
            },
          ]),
          shadowColor: 'rgba(0, 112, 255, .4)',
          shadowBlur: 20,
          shadowOffsetY: 5,
        },
      },
    ],
  }
  const obj = Object.assign({}, defaultData, value)
  const option = {
    legend: {
      data: obj.legendData,
      top: '2%',
      right: '2%',
      itemWidth: 16, // 宽度
      itemHeight: 12, // 高度
      textStyle: {
        color: '#2E2E2E',
        fontSize: 14,
        fontFamily: 'SourceHanSansSC-Normal',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
      confine:true,
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      top: '25%',
      left: '3%',
      right: '4%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: obj.dataX,
        axisTick: {
          alignWithLabel: true,
          show: false,
        },
        axisLine: {
          show: false, // 隐藏X轴线
        },
        axisLabel: {
          textStyle: {
            color: '#6B6B6B', // 文字颜色
            fontSize: 12, // 文字字号
            fontWeight: 400,
            fontFamily: 'SourceHanSansSC',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: false, // 隐藏分割线
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false, // 隐藏X轴线
        },
        axisLabel: {
          textStyle: {
            color: '#6B6B6B', // 文字颜色
            fontSize: 12, // 文字字号
            fontWeight: 400,
            fontFamily: 'SourceHanSansSC',
          },
        },
      },
    ],
    series: obj.series,
  }
  return option
}
// 柱状图样式
export const getBar = function (value) {
  const defaultData = {
    legendData: ['预警44', '误报44', '维保测试44'],
    data: [],
    dataX: ['1/1', '1/2', '1/3', '6/14', '6/15', '6/16', '6/17'],
    color: ['#6BD98D', '#EE3E3E', '#FB9A55', '#FFD541', '#B3C9D5', '#8285FF'],
    series: [{
        name: '报警次数',
        type: 'bar',
        barWidth: 8, // 设置柱子宽度为类目宽度的 16px
        barGap: '0', // 设置相邻柱子间距为类目宽度的0,挨着一起
        data: [50, 70, 90, 80, 100, 60, 20],
        itemStyle: {
          // 设置柱状图颜色
          color: '#306FFF',
        },
      },
      {
        name: '报警同比',
        type: 'bar',
        barWidth: 8, // 设置柱子宽度为类目宽度的 16px
        barGap: '0', // 设置相邻柱子间距为类目宽度的20%
        data: [30, 50, 55, 70, 90, 50, 18],
        itemStyle: {
          // 设置柱状图颜色
          color: '#5FDAE5',
        },
      },
    ],
  }
  const obj = Object.assign({}, defaultData, value)
  const option = {
    legend: {
      data: obj.legendData,
      right: '2%',
      orient: 'vertical',
      itemWidth: 8, // 宽度
      itemHeight: 8, // 高度
      textStyle: {
        color: '#2E2E2E',
        fontSize: 14,
        fontFamily: 'SourceHanSansSC-Normal',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      top: '20%',
      left: '3%',
      right: '4%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: obj.dataX,
        axisTick: {
          alignWithLabel: true,
          show: false,
        },
        axisLine: {
          show: false, // 隐藏X轴线
        },
        axisLabel: {
          textStyle: {
            color: '#6B6B6B', // 文字颜色
            fontSize: 12, // 文字字号
            fontWeight: 400,
            fontFamily: 'SourceHanSansSC',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: false, // 隐藏分割线
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false, // 隐藏X轴线
        },
        axisLabel: {
          textStyle: {
            color: '#6B6B6B', // 文字颜色
            fontSize: 12, // 文字字号
            fontWeight: 400,
            fontFamily: 'SourceHanSansSC',
          },
        },
      },
    ],
    series: obj.series,
  }
  return option
}

// 混合型 图
export const getMixedType = function () {
  const option = {
    title: {
      text: '混合型图示例',
      left: 'left', // 或者 '0%'
      textStyle: {
        color: '#2E2E2E',
        fontSize: nowSize(30),
        fontFamily: 'SourceHanSansSC-Medium',
        fontWeight: 500,
        letterSpacing: 0,
      },
    },
    legend: {
      // data:['故障次数', '故障环比', '故障同比'],
      data: [
        {
          name: '故障次数',
          icon: 'rect',
        },
        {
          name: '故障环比',
          icon: 'rect',
        },
        {
          name: '故障同比',
          icon: 'rect',
        },
      ],
      right: '0%',
      itemWidth: nowSize(17), // 宽度
      itemHeight: nowSize(17), // 高度
      textStyle: {
        color: '#2E2E2E',
        fontSize: nowSize(22),
        fontFamily: 'SourceHanSansSC-Normal',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (data) => {
        console.log('parma', data)
        let str = ''
        data.reverse().forEach((item) => {
          str =
            str +
            '<div style="font-size: 12px;padding: 0 4px;">' +
            '<div style="display:inline-block;margin-right:4px;width:10px;height:10px;background-color:' +
            item.color +
            ';"></div>' +
            item.data +
            '</br></div>'
        })
        return str
      },
    },
    grid: {
      top: 100,
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: ['6/11', '6/12', '6/13', '6/14', '6/15', '6/16', '6/17'],
        axisTick: {
          alignWithLabel: true,
          show: false,
        },
        axisLine: {
          show: false, // 隐藏X轴线
        },
        axisLabel: {
          textStyle: {
            color: '#6B6B6B', // 文字颜色
            fontSize: 14, // 文字字号
            fontWeight: 400,
            fontFamily: 'SourceHanSansSC-Normal',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: false, // 隐藏分割线
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false, // 隐藏X轴线
        },
        axisLabel: {
          textStyle: {
            color: '#6B6B6B', // 文字颜色
            fontSize: 22, // 文字字号
            fontWeight: 400,
            fontFamily: 'SourceHanSansSC-Normal',
          },
        },
      },
    ],
    series: [
      {
        name: '故障同比',
        type: 'line',
        barWidth: 8, // 设置柱子宽度为类目宽度的 16px
        barGap: '0', // 设置相邻柱子间距为类目宽度的20%
        data: [30, 50, 55, 70, 90, 50, 18],
        smooth: 0.5, // 设置曲线弧度为 0.5
        itemStyle: {
          // 设置柱状图颜色
          color: '#FB573D',
        },
      },
      {
        name: '故障环比',
        type: 'line',
        barWidth: 8, // 设置柱子宽度为类目宽度的 16px
        barGap: '0', // 设置相邻柱子间距为类目宽度的0,挨着一起
        data: [50, 70, 90, 80, 100, 60, 20],
        smooth: 0.5, // 设置曲线弧度为 0.5
        itemStyle: {
          // 设置柱状图颜色
          color: '#FD9628',
        },
      },
      {
        name: '故障次数',
        type: 'bar',
        barWidth: 8, // 设置柱子宽度为类目宽度的 16px
        barGap: '0', // 设置相邻柱子间距为类目宽度的0,挨着一起
        data: [50, 70, 90, 80, 100, 60, 20],
        smooth: 0.5, // 设置曲线弧度为 0.5
        itemStyle: {
          // 设置柱状图颜色
          color: '#0B67E5',
        },
      },
    ],
  }

  return option
}

// 面积图
export const getlineArea = function () {
  const option = {
    title: {
      text: '面积图示例',
      left: 'left', // 或者 '0%'
      textStyle: {
        color: '#2E2E2E',
        fontSize: nowSize(30),
        fontFamily: 'SourceHanSansSC-Medium',
        fontWeight: 500,
        letterSpacing: 0,
      },
    },
    legend: {
      data: [
        {
          name: '故障次数',
          icon: 'rect',
        },
        {
          name: '故障同比',
          icon: 'rect',
        },
      ],
      right: '0%',
      itemWidth: nowSize(17), // 宽度
      itemHeight: nowSize(17), // 高度
      textStyle: {
        color: '#2E2E2E',
        fontSize: nowSize(22),
        fontFamily: 'SourceHanSansSC-Normal',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (data) => {
        console.log('parma', data)
        let str = ''
        // data.reverse().forEach((item) => {
        //   str =
        //     str +
        //     '<div style="font-size: 12px;padding: 0 4px;">' +
        //     '<div style="display:inline-block;margin-right:4px;width:10px;height:10px;background-color:' +
        //     item.color +
        //     ';"></div>' +
        //     item.data +
        //     '</br></div>'
        // })
        data.reverse().forEach((item) => {
          str += '<view style="font-size: 12px;padding: 0 4px;">'
          str +=
            '<view style="display:inline-block;margin-right:4px;width:10px;height:10px;background-color:'
          str += item.color
          str += ';"></view>'
          str += item.data
          str += '</n></view>'
        })
        console.log('str', str)
        return str
      },
    },
    grid: {
      top: nowSize(100),
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: ['6/11', '6/12', '6/13', '6/14', '6/15', '6/16', '6/17'],
        axisTick: {
          alignWithLabel: true,
          show: false,
        },
        axisLine: {
          show: false, // 隐藏X轴线
        },
        axisLabel: {
          textStyle: {
            color: '#6B6B6B', // 文字颜色
            fontSize: nowSize(20), // 文字字号
            fontWeight: 400,
            fontFamily: 'SourceHanSansSC-Normal',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: false, // 隐藏分割线
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false, // 隐藏X轴线
        },
        axisLabel: {
          textStyle: {
            color: '#6B6B6B', // 文字颜色
            fontSize: nowSize(22), // 文字字号
            fontWeight: 400,
            fontFamily: 'SourceHanSansSC-Normal',
          },
        },
      },
    ],
    series: [
      {
        name: '故障同比',
        type: 'line',
        barWidth: nowSize(16), // 设置柱子宽度为类目宽度的 16px
        barGap: '0', // 设置相邻柱子间距为类目宽度的20%
        data: [30, 50, 55, 70, 90, 50, 18],
        smooth: 0.5, // 设置曲线弧度为 0.5
        itemStyle: {
          // 设置柱状图颜色
          color: '#FD9628',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#FD9628' },
            { offset: 0.5, color: '#C35525' },
            { offset: 1, color: '#FFCEB5' },
          ]),
        },
      },
      {
        name: '故障次数',
        type: 'line',
        barWidth: nowSize(16), // 设置柱子宽度为类目宽度的 16px
        barGap: '0', // 设置相邻柱子间距为类目宽度的0,挨着一起
        data: [50, 70, 90, 80, 100, 60, 20],
        smooth: 0.5, // 设置曲线弧度为 0.5
        itemStyle: {
          // 设置柱状图颜色
          color: '#34D2D0',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#34D2D0' },
            { offset: 0.5, color: '#C6FFFF' },
            { offset: 1, color: '#BBFFFE' },
          ]),
        },
      },
    ],
  }

  return option
}
//圆环
export const getCricleOption = function (value) {
  const defaultData = {
    center: ['30%', '50%'],
    radius: ['55%', '65%'],
    titleX: '29%',
    titleY: '34%',
    title: '全部设备',
    legendTop: '16%',
    legendRight:'25%',
    titleNum: '0',
    data: [],
    serBorderWidth: 3,
    legendShow: true,
    innerRadius: '50%',
    color: ['#6BD98D', '#EE3E3E', '#FB9A55', '#FFD541', '#B3C9D5', '#8285FF'],
  }

  const obj = Object.assign({}, defaultData, value)
  const option = {
    title: {
      z: 1001,
      text: '{a|' + obj.titleNum + '}\n{b|' + obj.title + '}',
      x: obj.titleX,
      y: obj.titleY,
      textAlign: 'center',
      textStyle: {
        rich: {
          a: {
            lineHeight: 22,
            fontSize: 18,
            color: '#171717',
          },
          b: {
            fontSize: 14,
            color: '#626262',
          },
        },
      },
    },
    legend: {
      show: obj.legendShow,
      top: obj.legendTop,
      width: '30%',
      right: obj.legendRight,
      itemGap: 8,
      itemWidth: 8,
      itemHeight: 8,
      data: obj.data,
      formatter: function (name) {
        for (let i = 0; i < option.series[0].data.length; i++) {
          var dpercent = option.series[0].data[i].value
          if (option.series[0].data[i].name == name) {
            // return dpercent
            return '{title|' + name + '}{value|' + dpercent + '}'
          }
        }
      },
      textStyle: {
        rich: {
          title: {
            fontSize: 12,
            lineHeight: 14,
            color: '#626262',
          },
          value: {
            fontSize: 12,
            lineHeight: 14,
            padding: [0, 10],
            color: '#171717',
          },
        },
      },
    },
    series: [
      {
        type: 'pie',
        z: 1,
        radius: obj.radius,
        center: obj.center,
        color: obj.color,
        itemStyle: {
          normal: {
            borderWidth: obj.serBorderWidth,
            borderColor: '#fff',
          },
        },
        data: obj.data,
        labelLine: {
          normal: {
            show: false,
          },
        },
        label: {
          normal: {
            show: false,
          },
        },
      },
      {
        //内圆
        type: 'pie',
        radius: obj.innerRadius,
        center: obj.center,
        z: 100,
        itemStyle: {
          normal: {
            color: new echarts.graphic.RadialGradient(
              0.5,
              0.5,
              0.8,
              [
                {
                  offset: 0,
                  color: 'rgba(8, 177, 255, 0)',
                },
                {
                  offset: 0.5,
                  color: 'rgba(7, 172, 255, 0.11)',
                },
                {
                  offset: 1,
                  color: 'rgba(6, 162, 255, 0.35)',
                },
              ],
              false
            ),
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
          },
        },
        hoverAnimation: false,
        label: {
          show: false,
        },
        tooltip: {
          show: false,
        },
        data: [100],
      },
    ],
  }
  return option
}
