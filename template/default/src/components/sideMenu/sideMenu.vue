<template>
  <div class="sideMenu">
    <el-menu
      class="el-menu-vertical"
      :collapse="openMenu"
      background-color="#FFF"
      text-color="#333"
      active-text-color="#5189FF"
      :default-active="defaultActive"
      unique-opened
    >
      <el-submenu :index="itemPar.name" v-for="itemPar in menuData" :key="itemPar.name">
        <template slot="title">
          <i :class="itemPar.icon"></i>
          <span slot="title">{{itemPar.meta.title}}</span>
            <span v-if="itemPar.meta.title === '个人事项' && record > 0" class="record">
              ({{record}})
            </span>
            <span v-if="itemPar.meta.title === '交易管理' && dealRecord.tradeManage > 0" class="record">
              ({{dealRecord.tradeManage}})
            </span>
        </template>

        <!-- 三级 -->
        <el-submenu
          v-if="itemPar.children && itemPar.children.length > 0 && itemSon.children && itemSon.children.length >=1"
          v-for="itemSon in itemPar.children"
          :key="itemSon.name"
          :index="itemSon.name"
        >
          <span slot="title">
            <i class="pos-r" :class="itemSon.icon" style="top:-2px"></i>
            {{itemSon.meta.title}}
            <span v-if="itemSon.meta.title === '土地交易' && dealRecord.landTrade > 0" class="record">
              ({{dealRecord.landTrade}})
            </span>
            <span v-if="itemSon.meta.title === '矿产交易' && dealRecord.mineTrade > 0" class="record">
              ({{dealRecord.mineTrade}})
            </span>
            <span v-if="itemSon.meta.title === '耕地指标交易' && dealRecord.farmTrade > 0" class="record">
              ({{dealRecord.farmTrade}})
            </span>
          </span>
          <el-menu-item
            @click="activeTage(itemSonSub)"
            :index="itemSonSub.name"
            v-for="itemSonSub in itemSon.children"
            :key="itemSonSub.name"
          >
            <i :class="itemSonSub.icon"></i>
            <span slot="title">
              {{itemSonSub.meta.title}}
              <span v-if="itemSon.meta.title === '土地交易' && itemSonSub.meta.title === '成交确认' && dealRecord.landDeal > 0" class="record">
                ({{dealRecord.landDeal}})
              </span>
              <span v-if="itemSon.meta.title === '矿产交易' && itemSonSub.meta.title === '成交确认' && dealRecord.mineDeal > 0" class="record">
                ({{dealRecord.mineDeal}})
              </span>
              <span v-if="itemSon.meta.title === '耕地指标交易' && itemSonSub.meta.title === '成交确认' && dealRecord.farmDeal > 0" class="record">
                ({{dealRecord.farmDeal}})
              </span>
            </span>
          </el-menu-item>
        </el-submenu>
        <!-- 二级 -->
        <el-menu-item
          @click="activeTage(itemSon)"
          v-if="itemPar.children
            && itemPar.children.length > 0
            && (!itemSon.children || itemSon.children.length <=0)
            && !itemSon.meta.hidden"
          v-for="itemSon in itemPar.children"
          :key="itemSon.name"
          :index="itemSon.name"
        >
          <i :class="itemSon.icon"></i>
          <span slot="title">
            {{itemSon.meta.title}}
            <span v-if="itemSon.meta.title === '我的待办' && record > 0" class="record">
              ({{record}})
            </span>
          </span>
        </el-menu-item>
      </el-submenu>
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
  computed: {
    record () {
      return this.$store.state.user.record;
    },
    dealRecord () {
      return this.$store.state.user.dealRecord;
    },
  },
  methods: {
    // 左侧菜单激活时候
    activeTage (item) {
      this.$emit('on-select', {
        name: item.name,
        title: item.meta.title,
        icon: item.icon
      });
    }
  }
};
</script>

<style lang="less">
.sideMenu {
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


  .el-menu-item.is-active {
    background-color: #0D1831 !important;
    // border-right: 2px solid #2573F1;
    i {
      color:rgba(81,137,255,1) !important;
    }
    span{
      color:rgba(81,137,255,1) !important;
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


.el-menu--vertical{
  .el-menu-item.is-active {
    background-color: #0D1831 !important;
    // border-right: 2px solid #2573F1;
    i {
      color: #333 !important;
    }
  }
}

.el-menu-item,
  .el-submenu__title {
    height: 46px;
    line-height: 46px;
    font-size: 16px;
    i {
      color: #333;
    }
    i.el-submenu__icon-arrow {
      margin-top: -4px;
      color: #909399;
    }
    &:hover {
      // background-color: #2573F1 !important;
      // box-shadow: 0px 0px 11px 2px #f5f5f5;
      color: #333 !important;
      i {
        color: #333 !important;
      }
    }
  }

  .el-menu--collapse li[role="menuitem"].el-submenu.is-active .el-submenu__title{
    i{color: #fff !important;}
    background-color: #2573F1 !important;
  }
}

.el-menu--inline .el-submenu__title,
.el-menu-item{
  font-size: 14px !important;
}

.record{
  color:red;
}
</style>

