export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  CLIENT_ERROR: 400,
  SESSIONTIMEOU: 401,
  UNKONOWNERROR: 4011,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
}

export const REFRESH_STATUS = {
  NORMAL: 0,
  REFRESHING: 1,
  NO_MORE_DATA: 2,
}

// 消警标志 N 未消警  D 待消警（确认火灾后，进入待消警环节）  Y 已消警
export const XJBZ_STATUS = {
  N: '未消警',
  D: '待消警',
  Y: '已消警',
}
