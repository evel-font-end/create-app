<template>
  <div class="sideMenu pos-a">
    <el-menu 
      class="el-menu-vertical-demo"
      background-color="#f4f6f8"
      text-color="#777777"
      active-text-color="#000000"
      :collapse="openMenu"
      :default-active="defaultActive"
      >
      <el-submenu :index="itemPar.name" v-for="itemPar in menuData" :key="itemPar.name">
        <template slot="title">
          <i :class="itemPar.icon"></i>
          <span slot="title">{{itemPar.meta.title}}</span>
        </template>
        <!-- 二级 -->
        <el-menu-item @click="activeTage(itemSon)" v-if="itemPar.children && itemPar.children.length > 0 && (!itemSon.children || itemSon.children.length <=0)" v-for="itemSon in itemPar.children" :key="itemSon.name" :index="itemSon.name">
          <i :class="itemSon.icon"></i><span slot="title">{{itemSon.meta.title}}</span>
        </el-menu-item>
        <!-- 三级 -->
        <el-submenu v-if="itemPar.children && itemPar.children.length > 0 && itemSon.children && itemSon.children.length >=1" v-for="itemSon in itemPar.children" :key="itemSon.name" :index="itemSon.name">
          <span slot="title"><i class="pos-r" :class="itemSon.icon" style="top:-2px"></i>{{itemSon.meta.title}}</span>
          <el-menu-item @click="activeTage(itemSonSub)" :index="itemSonSub.name" v-for="itemSonSub in itemSon.children" :key="itemSonSub.name">
            <i :class="itemSonSub.icon"></i><span slot="title">{{itemSonSub.meta.title}}</span>
          </el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "" // 当前选中菜单的title名
    };
  },
  props: {
    menuData: {
      type: Array,
      default() {
        return [];
      }
    },
    defaultActive: {
      type: String,
      default: ""
    },
    openMenu: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 左侧菜单激活时候
    activeTage(item) {
      this.$emit("on-select", {
        name: item.name,
        title: item.meta.title,
        icon: item.icon
      });
    }
  }
};
</script>

<style lang="less">
// 重置
.sideMenu {
  bottom: 0;
  top: 0;
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    overflow: hidden;
    overflow-y: auto;
    position: absolute;
    bottom: 0;
    top: 0;
  }

  .el-menu {
    border-right: 1px solid #d2d6de;
  }
  .el-menu--collapse {
    min-height: 400px;
    position: absolute;
    bottom: 0;
    top: 0;
  }
  .el-menu-item:hover,
  .el-submenu__title:hover {
    background-color: transparent !important;
    color: #000 !important;
  }
  .el-menu-item.is-active {
    background-color: #fff !important;
  }
  .el-menu-item i,
  .el-submenu__title i {
    font-size: 16px;
    margin-right: 5px;
  }

  .el-submenu__title:hover i,
  .el-menu-item:hover i {
    transition: 0.3s color, 0.5s transform;
    color: #000 !important;
  }

  .el-menu-item,
  .el-submenu__title,
  .el-submenu .el-menu-item {
    padding: 7px 5px 8px 20px;
    line-height: normal;
    height: auto;
    min-height: 36px;
  }

  .el-tooltip {
    padding: 7px 5px 8px 20px !important;
  }

  .el-submenu__title .el-submenu__icon-arrow {
    transform: rotateZ(90deg);
    font-size: 14px;
    margin-top: -5px;
  }
  .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
    transform: rotateZ(0deg);
  }
  .minActiveBg.is-active {
    background-color: transparent !important;
  }
  .minActiveBg.is-active:hover {
    background-color: transparent !important;
  }

  .el-menu-item:focus,
  .el-menu-item:hover {
    background-color: #fff !important;
  }
}

// 收起时候
.el-menu--vertical {
  .el-menu {
    min-width: 130px;
    li[role="menuitem"] {
      height: 36px;
      line-height: 36px;
      i {
        margin-right: 5px;
      }
    }
    li[role="menuitem"]:hover{
      background-color: #fff!important
    }
  }
}
</style>

