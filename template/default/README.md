# vueApp

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

```
├── Dockerfile.web
├── README.md
├── build                          # webpack 打包文件配置
│   ├── build.js
│   ├── check-versions.js
│   ├── logo.png
│   ├── utils.js
│   ├── vue-loader.conf.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   └── webpack.prod.conf.js
├── config                         # 配置文件
│   ├── dev.env.js                 # 开发环境配置
│   ├── index.js                   # 文件配置
│   └── prod.env.js                # 线上环境配置
├── dist.zip
├── docker-compose.yml
├── index.html                     # html 模版
├── package-lock.json
├── package.json
├── src
│   ├── App.vue                    # app 组件
│   ├── api                        # axios 请求接口集合
│   ├── base
│   ├── common                     # 公用 css、js、images、fonts
│   ├── components                 # ui 组件 components
│   ├── config
│   ├── main.js                    # 应用入口文件
│   ├── router                     # 路由文件
│   ├── store                      # vuex 状态管理
│       ├── index.js               # 组装模块并导出 store
│       ├── modules                # 用户信息模块
│       │   └── user.js
│       └── public                 # 公用
│           ├── actions.js         # action
│           ├── getters.js         # getters
│           ├── mutations.js       # mutation
│           └── state.js           # state
│   ├── util                       # 共用 js 工具文件
│   └── view                       # 页面
├── static                         # 静态资源
└── web.nginx.conf
```
### 创建Component

```bash
node --harmony tools component <fileName> --folder=<folderName>
```

#### options

* `--folder` -- foler path

#### usage


```bash
node --harmony tools component index --folder=/system/EditRole
```

### 创建Table

```bash
node --harmony tools table <fileName> --folder=<folderName>
```

#### options

* `--folder` -- folder path

#### usage

```bash
node --harmony tools table index --folder=/system/EditRole
```

