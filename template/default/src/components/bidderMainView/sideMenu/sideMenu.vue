<template>
  <div class="bidderSideMenu">
    <el-menu
      class="el-menu-vertical"
      :collapse="openMenu"
      background-color="#1561D3"
      text-color="#fff"
      active-text-color="#fff"
      :default-active="defaultActive"
      unique-opened
      mode="horizontal"
    >
      <el-menu-item
        @click="activeTage(itemPar)"
        v-for="itemPar in menuData"
        :key="itemPar.name"
        :index="itemPar.name"
      >
        <!-- <i :class="itemSon.icon"></i> -->
        <span slot="title">{{itemPar.meta.title}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '' // 当前选中菜单的title名
    };
  },
  props: {
    menuData: {
      type: Array,
      default () {
        return [];
      }
    },
    defaultActive: {
      type: String,
      default: ''
    },
    openMenu: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 左侧菜单激活时候
    activeTage (item) {
      this.$emit('on-select', {
        name: item.name,
        title: item.meta.title,
        icon: item.icon,
        link: item.link
      });
    }
  }
};
</script>

<style lang="less" scope>
.bidderSideMenu {
  // position: fixed;
  // bottom: 0;
  // top: 59px;
  // width: 220px;
  // bottom: 0;
  background: #ffffff;

  // 滚动条
  &::-webkit-scrollbar-track-piece {
    //滚动条凹槽的颜色，还可以设置边框属性
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    //滚动条的宽度
    width: 2px;
    height: 2px;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    //滚动条的设置
    background-color: transparent;
    background-clip: padding-box;
    min-height: 28px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: transparent;
  }
  .el-menu-vertical {
    width: 100%;
    border: 0;
    // padding-bottom: 50px;
  }

.el-menu-item {
  border: none;
}

  .el-menu-item.is-active {
    background-color: #003A91 !important;
    border: none;
    span{
      color:#fff !important;
    }
  }

  .el-submenu {
    &.is-active{
      > .el-submenu__title, ul > li {
        background-color: #fff !important;
        &.is-active {
          background-color: #f0f5ff !important;
          position: relative;
        }
        &.is-active:not(.is-opened)::after{
          content: "";
          width: 4px;
          height: 50px;
          right: 0;
          bottom: 0;
          background: #2573f1 ;
          position: absolute;
        }
      }
    }
    > .el-submenu__title {
      height: 56px;
      line-height: 56px;
    }
  }


.el-menu-item,
  .el-submenu__title {
    height: 46px;
    line-height: 46px;
    font-size: 16px;
    i.el-submenu__icon-arrow {
      font-size: 13px;
      font-weight: bold;
    }
    &:hover {
      color: #fff !important;
    }
  }

  .el-menu--collapse li[role="menuitem"].el-submenu.is-active .el-submenu__title{
    i{color: #fff !important;}
    background-color: #2573F1 !important;
  }
}
</style>

