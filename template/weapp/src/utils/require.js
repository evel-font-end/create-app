// 请求静态资源 有时候会转化为第三方资源
// export const resRequire = function (url) {
//   ;
//   if (url.indexOf("http") === 0) {
//     return url;
//   }

//   return require(url);
//   // return import(url);
// };

/**
 * 图片引入地址
 * @param url 图片相对地址
 * @returns
 */
export const imagesRequire = function (url) {
  if (!url) {
    return ''
  }

  const path = process.env.TARO_APP_IMAGE + url
  if (path.indexOf('http') > -1) {
    return path
  }
  try {
    // return require(url ? process.env.TARO_APP_IMAGE + url : './des.js')
    return require(process.env.TARO_APP_IMAGE + url)
  } catch (e) {
    console.log(process.env.TARO_APP_IMAGE + url)
  }
  return ''
}

export const akRequire = () => {
  return 'S2UBZ-AX5EN-2B4FL-SBXRT-2GL7O-LQF7J'
}
