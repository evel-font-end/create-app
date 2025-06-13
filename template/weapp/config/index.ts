import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import devConfig from './dev'
import prodConfig from './prod'
const path = require('path')
const args = process.argv
const isOpenDevTools = args.includes('--devtools')
// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数

// 自定义图片地址替换渲染器
// import imageLoader from "./image-loader.js"

export default defineConfig(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport = {
    projectName: 'ProgressMiniProgram',
    date: '2024-7-1',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
    },
    env: {
      COWA_Image_Path: 'http://127.0.0.1:8848',
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: isOpenDevTools
      ? ['@tarojs/plugin-html', '@tarojs/plugin-vue-devtools', 'taro-plugin-pinia']
      : ['@tarojs/plugin-html', 'taro-plugin-pinia'],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {},
    },
    framework: 'vue3',
    compiler: 'webpack5',
    cache: {
      enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        url: {
          enable: true,
          config: {
            limit: 1024, // 设定转换尺寸上限
          },
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
        chain.module
          .rule('otherImage')
          .test(/\.(scss|css)(\?.*)?$/)
          .use('imageLoader')
          .loader(path.resolve(__dirname, './image-loader.js'))
          .end()

        // chain
        //   .module
        //   .rule("images")
        //   .test(/\.(jpg|png|gif)$/)
        //   .use("url-loader")
        //   .loader("url-loader")
        //   .options({
        //     // 根据环境使用cdn或相对路径
        //     publicPath: process.env.NODE_ENV === 'production' ? 'http://127.0.0.1:8848/assets/' : 'http://127.0.0.1:8848/assets/',
        //   })
        //   .end();
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js',
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css',
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
      },
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
  }
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})
