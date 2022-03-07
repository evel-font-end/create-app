# @efont/create-app

## 使用说明

```bash
npx @efont/create-app my-app
cd my-app
npm start
```

*([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f))*

Then open <http://localhost:3000> to see your app.
When you’re ready to deploy to production, create a minified bundle with npm run build.

## options

```bash
npx @efont/create-app my-app
```

vue3版

```bash
npx @epig/create-app my-app --vue3

```
提交版本
```
# 注册 npm <https://www.npmjs.com/>账号密码，并在命令行进行登录
npm adduser

# 检测是否登陆成功
npm who am i

# 版本号格式：主版本号.次版本号.修订号
# 版本号递增规则：
#  - 主版本号：做了不兼容修改或颠覆式的重写
#  - 次版本号：向下兼容的功能性新增
#  - 修订号：向下兼容的问题修正
#  大版本为 1.0.0，小版本是0.1.0，小修复是0.0.1
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease [--preid=<prerelease-id>]

# 发布@efont/vue-baselib
npm publish --access public

