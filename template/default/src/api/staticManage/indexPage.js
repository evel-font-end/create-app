import api from 'util/axios'

/** 获取土地统计 */
export const getLandCount = () => {
  return api.request({
    method: 'get',
    url: '/index/api/indexNotice/getLandCount'
  })
}

/** 获取矿业地统计 */
export const getMineCount = () => {
    return api.request({
        method: 'get',
        url: '/index/api/indexNotice/getMineCount'
    })
}

/** 获取耕植统计 */
export const getPlowCount = () => {
    return api.request({
        method: 'get',
        url: '/index/api/indexNotice/getPlowCount'
    })
}

/** 土地正在竞价公告列表以公告未基准 */
export const landLimitPriceFromNotice = (data) => {
    return api.request({
        method: 'post',
        url: '/index/api/indexNotice/landLimitPriceFromNotice',
        data
    })
}

/** 土地正在公告列表以公告为基准 */
export const landNoticeFromNotice = (data) => {
    return api.request({
        method: 'post',
        url: '/index/api/indexNotice/landNoticeFromNotice',
        data
    })
}

/** 土地补充公告列表以公告为基准 */
export const landSupplementaryNotice = (data) => {
    return api.request({
        method: 'post',
        url: '/index/api/indexNotice/landSupplementaryNotice',
        data
    })
}

/** 矿业正在竞价公告列表以公告未基准 */
export const mineLimitPriceFromNotice = (data) => {
    return api.request({
        method: 'post',
        url: '/index/api/indexNotice/mineLimitPriceFromNotice',
        data
    })
}

/** 矿产正在公告列表以公告为基准 */
export const mineNoticeFromNotice = (data) => {
    return api.request({
        method: 'post',
        url: '/index/api/indexNotice/mineNoticeFromNotice',
        data
    })
}

/** 矿产补充公告列表以公告为基准 */
export const mineSupplementaryNotice = (data) => {
    return api.request({
        method: 'post',
        url: '/index/api/indexNotice/mineSupplementaryNotice',
        data
    })
}

/** 耕地正在竞价公告列表以公告未基准 */
export const plowLimitPriceFromNotice = (data) => {
  return api.request({
      method: 'post',
      url: '/index/api/indexNotice/plowLimitPriceFromNotice',
      data
  })
}

/** 耕地正在公告列表以公告为基准 */
export const plowNoticeFromNotice = (data) => {
  return api.request({
      method: 'post',
      url: '/index/api/indexNotice/plowNoticeFromNotice',
      data
  })
}

/** 耕地补充公告列表以公告为基准 */
export const plowSupplementaryNotice = (data) => {
  return api.request({
      method: 'post',
      url: '/index/api/indexNotice/plowSupplementaryNotice',
      data
  })
}

/** 获取公告详情 */
export const getNoticeDtl = (id) => {
    return api.request({
        method: 'get',
        url: '/index/api/indexNotice/noticeDtl?noticeId=' + id,
    })
}

/** 可以直播的标的 */
export const canAllowLiveTarget = (data) => {
    return api.request({
        method: 'post',
        url: '/index/api/target/canAllowLiveTarget',
        data
    })
}

// 根据字典code获取子级字典(无权限)
export const indexSelectListByParentCode = (id) => {
    return api.request({
      method: 'get',
      url: '/index/api/common/selectListByParentCode?code=' + id
    })
  }

  // 查询公告附件目录信息
export const noticeAttach = (id) => {
    return api.request({
      method: 'get',
      url: '/index/api/indexNotice/noticeAttach?noticeId=' + id
    })
  }

    // 主页获取申请标的交易记录详情
export const getBidderTradeTargetDtl = (id) => {
    return api.request({
      method: 'get',
      url: '/index/api/common/getBidderTradeTargetDtl?targetId=' + id
    })
  }
  
    // 主页获取竞价信息
export const tradeInfo = (id) => {
    return api.request({
      method: 'get',
      url: '/index/api/common/tradeInfo/' + id
    })
  }

    // 获取下载中心数据
export const getDownloadFiles = (data) => {
    return api.request({
      method: 'post',
      url: '/index/api/common/getDownloadFiles',
      data
    })
  }

      // 获取系统帮助数据
export const getTransHelp = (data) => {
  return api.request({
    method: 'post',
    url: '/api/transHelp/list',
    data
  })
}

    // 主页获取标的状态
export const getTargetStatus = () => {
    return api.request({
      method: 'get',
      url: '/index/api/common/getTargetStatus',
    })
  }

      // 主页获取土地标的交易类型
export const getLandBusinessType = () => {
    return api.request({
      method: 'get',
      url: '/index/api/common/getLandBusinessType',
    })
  }
  
      // 主页获取土地标的交易类型
export const getMineBusinessType = () => {
    return api.request({
      method: 'get',
      url: '/index/api/common/getMineBusinessType',
    })
  }
  
      // 主页获取耕地标的交易类型
export const getPloweBusinessType = () => {
    return api.request({
      method: 'get',
      url: '/index/api/common/getPloweBusinessType',
    })
  }

// 获取交易统计
export const getTradeStatistics = (data) => {
  return api.request({
    method: 'post',
    url: '/api/common/getTradeStatistics',
    data
  })
}

// 按月份获取交易统计
export const getTradeStatisticsByMonth = (data) => {
  return api.request({
    method: 'post',
    url: '/api/common/getTradeStatisticsByMonth',
    data
  })
}

// 按状态获取交易统计
export const getTradeStatisticsByStatus = (data) => {
  return api.request({
    method: 'post',
    url: '/api/common/getTradeStatisticsByStatus',
    data
  })
}
