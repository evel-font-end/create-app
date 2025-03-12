# vue3admin

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Cannot find module vue-loader-v16/package.json

```
npm uninstall vue-loader-v16
cnpm i vue-loader-v16
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### vue3新写法

<https://v3.cn.vuejs.org/>

#### template

```
<template v-slot="suffix"></template>
改成
<template #suffix></template>
```

#### emit

```
this.$emit('haha', parames);
改成
emits:['haha'],
context.emit("haha", parames)
```

#### deep穿透样式

```
/deep/ input{}
改成
&:deep(input) {
    text-align: right;
    color: #555555;
}
```

#### watch监听ref定义的一个响应数据

```
a为监听数据
watch(a, (newValue, oldValue) => {})
```

#### watch监听ref定义的多个响应数据

```
a, b为监听数据
watch([a, b], (newValue, oldValue) => {})
```

#### watch监听reactive定义的一个响应数据的全部属性

```
obj为监听数据
其中无法正确获取oldValue，且自动开启开启深度监听，无法关闭
watch(obj, (newValue, oldValue) => {})
```

#### watch监听reactive定义的一个响应数据的某个属性

```
obj = {
    name: 'xxx'
} 为监听数据

watch(()=>obj.name, (newValue, oldValue) => {})
```

#### watch监听reactive定义的一个响应数据的某些属性

```
obj = {
    name: 'xxx',
    age: 18,
    gender: '男'
}为监听数据

watch([()=>obj.name, ()=>obj.age], (newValue, oldValue) => {})
```

#### 特殊情况(此处深度监听生效)

```
obj = {
    name: 'xxx',
    age: 18,
    gender: '男',
    work: {
        job: {
            c: 100
        }
    }
}为监听数据

watch(()=>obj.work, (newValue, oldValue) => {}, {deep: true})
```

#### setup执行比created快，其中的this为undefind

```
```

#### 通过ref获取formItem值

```
const baseFormItem = ref<any>({});
const formValues = await baseFormItem.value.getValue()
```

#### vue3.0中，对象和数组的操作

```
可以不使用this.$set()来对数据进行动态更新了。直接操作数据就行。（放弃了object.definedProperty()的写法，使用了Proxy）
```
