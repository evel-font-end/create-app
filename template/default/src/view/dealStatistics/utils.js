export const statusOptions = {
  待审核: 0,
  已发布: 1
}

export const BUSINESS_TYPE = {
  土地: 'LAND_BUSINESS_TYPE',
  矿业: 'MINE_BUSINESS_TYPE',
  耕地: 'PLOW_BUSINESS_TYPE',
};

export const toThousands = (num) => {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

export const toChinese = (str) => {
  let num = parseFloat(str);
  let strOutput = '';
  let strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
  num += '00';
  const intPos = num.indexOf('.');
  if (intPos >= 0) {
    num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
  }
  strUnit = strUnit.substr(strUnit.length - num.length);
  for (let i = 0; i < num.length; i++) {
    strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
  }
  return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, '零元')
}

export const countTime = (time) => {
  // 获取当前时间
  const date = new Date();
  const now = date.getTime();
  // 设置截止时间
  const str = time || '2020/5/17 00:00:00';
  const endDate = new Date(str);
  const end = endDate.getTime();

  // 时间差
  const leftTime = end - now;
  // 定义变量 d,h,m,s保存倒计时的时间
  var d, h, m, s;
  if (leftTime >= 0) {
    d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
    h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
    m = Math.floor(leftTime / 1000 / 60 % 60);
    s = Math.floor(leftTime / 1000 % 60);
  }
  // 将倒计时赋值到div中
  setTimeout(countTime, 1000);
  return {
    d,
    h,
    m,
    s
  };
  // 递归每秒调用countTime方法，显示动态时间效果
}

export const agreeLotteryText = {
  0: '您已放弃参与此次摇号！',
  1: '您已确认参与此次摇号！'
};

export const lotteryTip= (text) => `(出到${text}者默认自动参与此次摇号，如果无其他人同意参与此次摇号，则系统自动判定出到${text}者为竞得人)`;

export const titleInfos = (curNode, tradeBegin) => {
  const text = tradeBegin === 0 ? '开始' : '结束';
  const curNodeInfo = {
    'N02': {
      bide: '该标的挂牌活动已经截止',
      bideTitle: '已结束'
    },
    'stop': {
      bide: '该标的挂牌活动已经截止',
      bideTitle: '已终止'
    },
    'suspend': {
      bide: '该标的挂牌活动已经截止',
      bideTitle: '已中止'
    },
    'success': {
      bide: '该标的挂牌活动已经截止',
      bideTitle: '已成交'
    },
    'L01': {
      bide: '该标的处于公告阶段',
      bideTitle: '公告中',
      time: `距离公告${text}剩余`
    },
    'L02': {
      bide: '该标的处于集中报价阶段',
      bideTitle: tradeBegin === 0 ? '竞价等待期' : '挂牌中',
      time: `距离集中报价${text}剩余`
    },
    'L03': {
      bide: '该标的处于限时竞价阶段',
      bideTitle: tradeBegin === 0 ? '竞价等待期': '竞价中',
      time: `距离限时竞价${text}剩余`
    },
    'F01': {
      bide: '该标的处于摇号确认阶段',
      bideTitle: '摇号中',
      time: `距离摇号确认${text}剩余`
    }
  };
  return !curNode ? curNodeInfo : curNodeInfo[curNode];
}

export const landBusinessTypeList = ['101002'];
export const plowBusinessTypeList = ['购买指标', '出售指标'];
export const plowPriceList = ['plowArea', 'plowTotalPriceText'];
const symbolArray = ['万元', '万元'];
export const symbolText = (symbol, businessType, id) => {
  if(symbolArray.indexOf(symbol) < 0) return symbol;
  if ((plowBusinessTypeList.indexOf(businessType) > -1) && (id !== 'plowTotalPriceText')) {
    return symbolArray[0];
  }
  return symbolArray[1];
};

export const colors = ["#207FD8", "#EF830E"];

export const random = (num, min, max) => {
  return Math.floor((num/10) * (max - min) + min)
}
