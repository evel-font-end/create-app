// image-path-loader.js
module.exports = function (source) {
  // 假设我们有一个环境变量来区分开发环境和生产环境
  // 这里使用process.env.NODE_ENV，但你可能需要根据你的设置来调整
  const isProduction = process.env.NODE_ENV === 'production'

  // 如果在生产环境下，则替换图片路径
  if (isProduction) {
    // 在处理一下require的放啊
    // source = handleRequireImages(source);

    // 优先处理css中的
    // source = handleCssImages(source);

    source = handleImages(source)
  }

  // 返回修改后的源代码
  return source
}

// 处理 images/* 图片地址
const handleImages = function (source) {
  // 生产环境下的图片URL前缀
  const productionImageUrlPrefix = process.env.TARO_APP_IMAGE //||'http://127.0.0.1:8848/assets';

  // 使用正则表达式来查找图片路径（这里以简单的<img>标签src属性为例）
  // 注意：这个正则表达式很基础，可能需要根据实际情况进行调整
  const imageUrlRegex = /~\@\/assets\/images(\/.+\.(png|jpg))/gi

  // 判断正则
  source = source.replace(imageUrlRegex, (match, p1) => {
    // 检查路径是否已经是绝对路径（可选）
    // if (!p1.startsWith('http://') && !p1.startsWith('https://')) {
    // 假设p1是相对路径，我们将其转换为CDN路径
    // return match.replace(p1, `${productionImageUrlPrefix}${p1}`);
    if (!p1) {
      return match
    }
    return `${productionImageUrlPrefix}${p1}`
    // }
    // return match; // 如果已经是绝对路径，则不做修改
  })

  return source
}

// 处理 images/* 图片地址
const handleCssImages = function (source) {
  // 生产环境下的图片URL前缀
  const productionImageUrlPrefix = 'http://127.0.0.1:8848/assets'

  // 使用正则表达式来查找图片路径（这里以简单的<img>标签src属性为例）
  // 注意：这个正则表达式很基础，可能需要根据实际情况进行调整
  const imageUrlRegex = /\~\@\/assets\/images(\/.+\.(png|jpg))/gi

  // 判断正则
  source = source.replace(imageUrlRegex, (match, p1) => {
    // 检查路径是否已经是绝对路径（可选）
    if (!p1.startsWith('http://') && !p1.startsWith('https://')) {
      // 假设p1是相对路径，我们将其转换为CDN路径
      // return match.replace(p1, `${productionImageUrlPrefix}${p1}`);
      return `${productionImageUrlPrefix}${p1}`
    }
    return match // 如果已经是绝对路径，则不做修改
  })

  return source
}

// 处理一下Require的方法
const handleRequireImages = function (source) {
  // 生产环境下的图片URL前缀
  const productionImageUrlPrefix = 'http://127.0.0.1:8848/assets'

  // 使用正则表达式来查找图片路径（这里以简单的<img>标签src属性为例）
  // 注意：这个正则表达式很基础，可能需要根据实际情况进行调整
  const imageUrlRegex = /require\(\'\@\/assets\/images(\/.+\.(png|jpg))\'\)/gi

  if (source.indexOf('require') > -1) {
    // source = + source;
  }

  // // 判断正则
  source = source.replace(imageUrlRegex, (match, p1) => {
    // 检查路径是否已经是绝对路径（可选）
    if (!p1.startsWith('http://') && !p1.startsWith('https://')) {
      // 假设p1是相对路径，我们将其转换为CDN路径
      // return match.replace(p1, `${productionImageUrlPrefix}${p1}`);
      return `'${productionImageUrlPrefix}${p1}'`
    }
    return match // 如果已经是绝对路径，则不做修改
  })

  return source
}
