<template>
    <div id="error_404">
        <div class="error_404">
            <div class="img innBlock pos-r">
                404
                <router-link class="goBack pos-a" to="">上一页</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"error_404"
};
</script>

<style lang="less" scoped>
#error_404{
    .error_404{
        text-align: center;
        .img{
            .goIndex,.goBack{
                width: 200px;
                height: 68px;
                background: #fff;
                bottom: 30px;
            }
        }
        img{width: 530px}
    }
}
</style>

