import type { UserConfigExport } from '@tarojs/cli'

export default {
  logger: {
    quiet: false,
    stats: true,
  },
  mini: {},
  h5: {},
  env: {
    Image_Path: '"development"', // JSON.stringify('development')
    COWA_Image_Path: '"asdasdasd"',
  },
} satisfies UserConfigExport
