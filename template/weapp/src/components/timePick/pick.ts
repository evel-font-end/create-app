import { withData } from '@/utils/common'

/**
 * 取所有开始-结束值的数组
 * @param start 开始数值
 * @param end 结束数值
 */
function getLoopArray(start, end) {
  const startVal = start || 0
  const endVal = end || 1
  const array: string[] = []
  for (let i = startVal; i <= endVal; i++) {
    array.push(withData(i))
  }
  return array
}

/**
 * 计算xx年x月所有的天数
 * @param year 年
 * @param month 月
 */
function getMonthDay(year, month, defaultDay = 1) {
  let flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0),
    array: any

  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = getLoopArray(parseInt(String(defaultDay), 10), 31)
      break
    case '04':
    case '06':
    case '09':
    case '11':
      array = getLoopArray(parseInt(String(defaultDay), 10), 30)
      break
    case '02':
      array = flag
        ? getLoopArray(parseInt(String(defaultDay), 10), 29)
        : getLoopArray(parseInt(String(defaultDay), 10), 28)
      break
    default:
      array = '月份格式不正确，请重新输入！'
  }
  return array
}

function dateTimePicker(startYear, endYear, date, minData) {
  // 返回默认显示的数组和联动数组的声明
  const dateTime: number[] = [],
    dateTimeArray: any = [[], [], [], [], [], []]
  const start = startYear || 1978
  const end = endYear || 2100

  // 解析 minData 为日期对象
  const minDateObj = minData // 处理日期格式兼容性
  const minYear = minDateObj ? minDateObj.getFullYear() : null
  const minMonth = minDateObj ? String(minDateObj.getMonth() + 1).padStart(2, '0') : String(1) // 月份从0开始，需要加1
  const minDay = minDateObj ? String(minDateObj.getDate()).padStart(2, '0') : String(1)

  // 默认开始显示数据
  const defaultDate = date
    ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')]
    : [
        ...new Date().toISOString().slice(0, 10).split('-'),
        ...new Date().toTimeString().split(' ')[0].split(':').slice(0, 2),
      ]

  // 确保默认日期不小于最小日期
  const [defaultYear, defaultMonth, defaultDay, defaultHour, defaultMinute, defaultSecond] =
    defaultDate.map((val, index) => {
      if (
        index < 3 &&
        parseInt(val, 10) <
          (index === 0 ? minYear : index === 1 ? parseInt(minMonth, 10) : parseInt(minDay, 10))
      ) {
        return index === 0 ? minYear : index === 1 ? minMonth : minDay
      }
      return val
    })
  // 处理联动列表数据
  dateTimeArray[0] = getLoopArray(Math.max(start, minYear), end) // 年份从 minYear 或 startYear 开始
  dateTimeArray[1] = getLoopArray(parseInt(minMonth, 10), 12) // 月份从 minMonth 开始，但不超过12
  dateTimeArray[2] = getMonthDay(defaultYear, defaultMonth) // 根据年和月获取天数
  dateTimeArray[3] = getLoopArray(0, 23) // 小时从 minHour 开始，但不超过23
  dateTimeArray[4] = getLoopArray(0, 59) // 分钟从 minMinute 开始，但不超过59
  dateTimeArray[5] = getLoopArray(0, 59) // 秒从 minSecond 开始，但不超过59
  // console.log('dateTimeArray', dateTimeArray)
  // 设置默认时间在联动数组里的下标
  dateTimeArray.forEach((current, index) => {
    dateTime.push(current.indexOf(String(defaultDate[index]).padStart(2, '0'))) // 确保使用两位数字符串进行查找
  })
  // console.log('dateTime', dateTime)
  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime,
    defaultYear,
    defaultMonth,
    defaultDay,
  }
}
export { dateTimePicker, getMonthDay }
