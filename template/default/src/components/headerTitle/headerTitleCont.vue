<template>
    <div id="headerTitleCont" :class="[visibleBorder ? 'border' : '',visibleMt20 ? 'mt-20' : '']">
        <div class="title f-16 mb-20">{{title}}<slot name="icon-r"></slot></div>
        <div><slot></slot></div>
    </div>
</template>

<script>
export default {
    props:{
        title: {
            type: String,
            default: ''
        },
        visibleBorder:{
            type: Boolean,
            default: true
        },
        visibleMt20:{
            type: Boolean,
            default: true
        }
    }
}
</script>

<style lang="less" scoped>
#headerTitleCont{
    .title{
        border-left: 2px solid #2573F1;
        padding-left: 5px;
        color: #000
    }
    &.border{
        padding-bottom: 5px;
        border-bottom: 1px solid rgba(217,217,217,1);
    }
}
</style>
