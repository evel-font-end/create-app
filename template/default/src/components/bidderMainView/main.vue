<template>
  <div id="mainContent" class="bidderMain">
    <!-- <div class="cont-left pos-f" :style="{width: openMenu ? '55px' : '220px'}">
      <SideMenu
        :openMenu="openMenu"
        :default-active="tageActive"
        :menuData="menuData"
        @on-select="openMenuSelect"
      ></SideMenu>
    </div> -->
    <div class="head w tx_c">
        <div class="main h">
            <img class="logo" src="./images/logo@2x.png"/>
        </div>
    </div>
    <header id="topHeader">
      <div class="flexRow">
        <SideMenu
          :openMenu="openMenu"
          :default-active="tageActive"
          :menuData="menuData"
          @on-select="openMenuSelect"
        ></SideMenu>
        <flex inline align="center">
          <el-dropdown>
            <span class="h-handler dropdown-link">
              <img class="avatar" />
              {{userName}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="h-handler">
            <el-button type="text" class="quit-button" @click="_outUserLogin">
              <i class="iconfont icon-tuichu"></i>
              退出</el-button>
          </div>
        </flex>
      </div>
    </header>

    <div class="cont-center">
      <!-- <tabs
        @close-type="closeType"
        :menuTagsData="menuTagsData"
        @delTage="delTage"
        @on-select="_tageActive"
        :defaultTage="tageActive"
      ></tabs> -->
      <!-- <div class="pageTitle">
        <span
          :style="{color:(currentRouteName==item.name?'#065BDC':'#606060')}"
          v-for="(item, index) in currentTitleList"
          :key="index"
        >
          <span>{{item.title}}</span>
          <span style="padding:0 5px" v-if="index!=currentTitleList.length-1">/</span>
        </span>
      </div> -->
      <div class="back" :style="{display: (this.$route.matched[this.$route.matched.length - 1].name === 'edit' ? 'block' : 'none')}">
        <el-button type="primary" class="quit-button" @click="goBack">
          <i class="el-icon-back"></i>
          返回
        </el-button>
      </div>
      <keep-alive :include="keepAliveName" :max="8">
        <router-view ref="keepAlive229" class="mainContent" :style="{
          paddingBottom: contentPaddingBottom
        }">
        </router-view>
      </keep-alive>
    </div>
    <div class="flexCenter footer">
        <!-- abs b0 l0 r0 -->
        Copyright © 汕尾市公共资源交易中心 版权所有 最佳浏览效果:IE8.0版本以上 1024*768分辨率
    </div>
    <!-- loading -->
    <div class="loading-bg" v-if="$_loading"></div>
    <div class="loading noselect pos-f" v-if="$_loading">
      <i class="iconfont icon-jiazailoading-A mr-5 anim-rotate anim-loop el-anim"></i>
      <span class="f-13">正在加载，请稍后...</span>
    </div>
  </div>
</template>

<script>
import Flex from '@/components/flex';
import Tabs from 'components/tabs/tabs';
import SideMenu from './sideMenu/sideMenu';
import Config from '@/config';
import { saveLocal } from 'util/tool'
// import dialogCont from 'components/dialog';
import { mapGetters, mapMutations, mapActions } from 'vuex';
export default {
  name: 'mainContent',
  data () {
    return {
      dialog: {
        note: false, // 便签
        content: '' // 便签内容
      },
      menuActiveClass: false, // 当前被选中菜单
      menuBdWidth: '0px', // 右侧宽度
      openMenu: false, // logo
      zoom: false, // 是否全屏
      openUserCenter: false, // 个人头像下的菜单栏
      currentRouteName: '' // 当前路由name
      // currentTitleList: [] //当前路由标题列表
    };
  },
  mounted () {
    this.window = window;
  },
  methods: {
    ...mapMutations([
      'set_menuTags',
      'set_delMenuTage',
      'set_openPage',
      'set_menuTagsList',
      'set_closeAllTab',
      'set_keepAliveRouter'
    ]),
    ...mapActions({
      userLoginOut: 'user/userLoginOut'
    }),
    // 页面刷新
    _refreshPage () {
      window.location.reload();
      this.$router.push({
        name: 'indexPage'
      });
    },
    // 点击左侧菜单添加tage
    openMenuSelect (list) {
      if (list.link) {
        if (typeof window !== 'undefined') {
          this.window.location.href = list.link;
          return false;
        }
      } else {
        this.set_openPage(list.name);
        this.set_menuTags(list);
        this.$router.push({
          name: list.name
        });
      }
    },
    // 关闭当前tage
    delTage (name) {
      this.set_delMenuTage(name);
      this.$router.push({
        name: this.openPage
      });
    },
    // 当前选中的tage
    _tageActive (toName) {
      this.set_openPage(toName);
    },
    // 个人头像下的菜单栏
    _openUserCenter (flag) {
      this.openUserCenter = flag;
    },
    // 打开侧栏
    _openMenu () {
      this.openMenu = !this.openMenu;
    },
    // 窗口缩放
    _zoom () {
      this.zoom = !this.zoom;
    },
    // 退出登录
    _outUserLogin () {
      this.userLoginOut()
        .then()
        .catch(err => {
          this.$notify.error({
            title: '失败',
            message: err,
            position: 'bottom-right'
          });
        });
    },
    // tab当前关闭菜单方式
    closeType (type) {
      if (!this.menuTags.length) return;
      switch (type) {
        case 'all': // 关闭全部
          this.set_openPage('indexPage');

          // 首页没有打开过缓存则在首页进行关闭操作
          if (this.keepAliveName.some(i => i == 'indexPage')) {
            this.set_menuTagsList([]);
            this.set_keepAliveRouter('indexPage');
          } else {
            // 清空操作放在首页进行 (没有缓存下首页打开有需要时间,会有卡顿情况)
            this.set_closeAllTab(true);
          }

          break;
        case 'other': // 关闭其他
          if (
            this.menuTags.length === 1 &&
            this.menuTags[0].name === this.openPage
          ) {
            return;
          }
          for (let i = 0; i < this.menuTags.length; i++) {
            if (this.menuTags[i].name === this.openPage) {
              let a = this.menuTags.slice(i, i + 1);
              this.set_menuTagsList(a);
              return;
            }
          }
          break;
      }

      this.$router.push({
        name: this.openPage
      });
    },
    goBack () {
      this.$router.go(-1);
    }
  },
  computed: {
    ...mapGetters(['menuList', 'menuTags', 'openPage', 'keepAliveName']),
    // 左侧菜单列表
    menuData () {
      let childrenList = [];
      this.menuList.map(list => {
        childrenList.push(...list.children);
      });
      return childrenList;
    },
    // 当前打开的tags路由列表
    menuTagsData () {
      return this.menuTags;
    },
    // 当前选中的tage
    tageActive () {
      if (this.openPage === Config.homeName) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.$router.push(
          Config.homeName,
          () => {},
          () => {}
        );
      }
      return this.openPage;
    },
    userName () {
      return this.$store.state.user.username;
    },
    // 菜单标题
    currentTitleList () {
      let currentTitleList = []; // 当前路由标题列表
      this.currentRouteName = this.$route.name;
      this.$route.matched.map(item => {
        currentTitleList.push({
          name: item.name,
          title: item.meta.title
        });
      });
      return currentTitleList;
    },
    contentPaddingBottom () {
      const {
        name: routeName,
        query
      } = this.$route
      if (['landTradeConfig'].includes(routeName) && ['add', 'edit'].includes(query.configType)) {
        return '90px'
      }
      return '0'
    }
  },
  components: {
    Tabs,
    SideMenu,
    Flex
  }
};
</script>

<style lang="less">
html{
  overflow: auto;
}
</style>


<style lang="less" scoped>
@import "./main.less";
#mainContent {
  .head{
      height: 267px;
  background: url(./images/banner.jpg) no-repeat;
  background-size: cover;
  background-position: center;
  .main {
    min-width: 1200px;
    width: 1200px;
    margin: 0 auto;
    text-align: left;
    .logo {
      width: 660px;
      height: auto;
      padding: 82px 0 0 0;
    }
  }
  }
  #topHeader > div{
    min-width: 1200px;
    width: 1200px;
    margin: 0 auto;
    justify-content: space-between;
  }
  .pageTitle {
    margin: 10px 0px 0px 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #dddddd;
    font-size: 16px;
  }
  .back{
    margin-top:20px;
  }
  .mainContent {
    // height: calc(100vh - 125px);
    height: auto;
    // min-width: 1366px;
    // overflow: auto;
    // margin: 20px;
    // margin-top: 20px;
    padding-top: 20px;
    box-sizing: border-box;
    overflow: auto;
  }

  .noteBox {
    border: 0;
    width: 100%;
  }

  .transformRotate {
  }
  .icon-tuichu{
    width: 20px
  }
    .footer {
      height: 92px;
      line-height: 92px;
      font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(255,255,255,1);
    background:rgba(21,97,211,1);
    }
}
.bidderMain{
  .mainContent {
    margin-top: 0 !important;
    overflow: hidden !important;
    #headerTitle{
      margin-top: 0 !important;
    }
  }

}
</style>



