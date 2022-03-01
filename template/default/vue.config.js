// import config from './config';
const baseConfig = require('./config');
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');
const isProduction = process.env.NODE_ENV !== 'development';
function resolve(dir) {
  return path.join(__dirname, dir)
}
const customPlugins = [];
if (isProduction) {
  customPlugins.concat([
    new UglifyJsPlugin({
      uglifyOptions: {
        uglifyOptions: {
          compress: {
            drop_debugger: true,
            drop_console: true,  //生产环境自动删除console
          },
          warnings: false,
        },
        sourceMap: false,
        parallel: true,
      }
    })
  ])
}
module.exports = {
  transpileDependencies: ['@jiaminghi/data-view'],
  publicPath: './',
  /*这个是我存放在github在线预览的Reader项目*/

  // 将构建好的文件输出到哪里（或者说将编译的文件）
  outputDir: 'dist',
  // 放置静态资源的地方 (js/css/img/font/...)
  assetsDir: 'static',
  filenameHashing: true, //文件名哈希
  productionSourceMap: isProduction ? false : true,
  lintOnSave: true, //是否在保存的时候使用 `eslint-loader` 进行检查
  runtimeCompiler: true,
  // CSS 相关选项
  css: {
    // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
    // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
    extract: isProduction ? {
      ignoreOrder: true,
    } : false,

    // 是否开启 CSS source map？
    sourceMap: false,

    // 为预处理器的 loader 传递自定义选项。比如传递给
    // sass-loader 时，使用 `{ sass: { ... } }`。
    loaderOptions: {
      // postcss: {
      //   plugins: [
      //       require('postcss-px2rem')({remUnit: 192, // 设计图宽度÷10
      //         remPrecision: 5}),
      //   ]
      // }
    },

    // 为所有的 CSS 及其预处理文件开启 CSS Modules。
    // 这个选项不会影响 `*.vue` 文件。
    requireModuleExtension: false
  },
  devServer: {
    overlay: {
      warning: false,
      errors: false
    },
    open: true,
    host: 'localhost',
    port: 3000,
    https: false,
    hotOnly: true,
    proxy: baseConfig.dev.proxyTable, // 设置代理
    before: app => { }
  },
  chainWebpack: (config) => {
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        mozjpeg: { progressive: true, quality: 65 },
        optipng: { enabled: false },
        pngquant: { quality: [0.65, 0.9], speed: 4 },
        gifsicle: { interlaced: false }
      })
      .end();
    config.plugins.delete('prefetch')
    config.resolve.alias
      .set('@', resolve('src'))
      .set('api', resolve('src/api'))
      .set('config', resolve('src/config'))
      .set('base', resolve('src/base'))
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'))
      .set('pages', resolve('src/pages'))
      .set('router', resolve('src/router'))
      .set('store', resolve('src/store'))
      .set('util', resolve('src/util'))
      .set('view', resolve('src/view'))
      .set('static', resolve('public/static'));
    // config.module
    //   .rule('less')
    //   .test(/\.less$/)
    //   .oneOf('vue')
    //   .use('px2rem-loader')
    //   .loader('px2rem-loader')
    //   .before('postcss-loader') // this makes it work.
    //   .options({ remUnit: 75, remPrecision: 5 })
    //   .end();
    if (isProduction) {
      if (baseConfig.build.bundleAnalyzerReport) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
        config.plugins.push(new BundleAnalyzerPlugin())
      }
      config.plugin('compression').use(CompressionWebpackPlugin).tap(() => [
        {
          test: /\.js$|\.html$|\.css/, // 匹配文件名
          threshold: 1024, // 超过1k进行压缩
          minRatio: 0.8,
          deleteOriginalAssets: false // 是否删除源文件
        }
      ])
      // 压缩代码
      config.optimization.minimize(true)
      // 分割代码
      config.optimization.splitChunks({
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 300000, // 依赖包超过300000bit将被单独打包
        automaticNameDelimiter: "-",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `chunk.${packageName.replace("@", "")}`;
            },
            priority: 10
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
    }
  },
  configureWebpack: config => {
    config.plugins.concat([...customPlugins]),
      config.plugins.forEach((val) => {
        if (val instanceof HtmlWebpackPlugin) {
          val.options = {
            ...val.options,
            filename: baseConfig.build.index,
            template: 'index.html',
            chunks: ['manifest', 'vendor', baseConfig.build.index],
            title: '',
            inject: true,
            favicon: path.resolve(__dirname, '../src/common/images/logo2.ico'),
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeAttributeQuotes: true
              // more options:
              // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'manual'
          }
        }
      })
    config.externals = {
      "vue": 'Vue',
      "vuex": "Vuex",
      "vue-router": "VueRouter",
      'element-ui': 'ELEMENT',
      "moment": "moment",
      'vue-awesome-swiper': 'VueAwesomeSwiper',
      'swiper': 'Swiper',
      'axios': 'axios',
      'echarts': 'echarts',
      'vue-quill-editor': 'VueQuillEditor'
    }
  }
}
