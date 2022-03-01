<template>
  <div id="headerTitle" class="pos-r">
    <div class="searchBox pos-r w1">
      <!-- 需要显示的的隐藏内容插槽 -->
      <slot name="searchBox" ref="searchBox">
      </slot>
    </div>

  </div>
</template>

<script>
import otherBtnList from './otherBtnList';

export default {
  props: {
    
  },
  data () {
    return {
      searchName: '查询', // 查询按钮显示文字
      slideSearchBox: false, // 查询列表是否隐藏
      searchActiveClass: false, // 查询按钮选中样式
    };
  },
  components: {
    otherBtnList
  },
  watch: {
  },
  methods: {
    // 显示隐藏收缩列表
    // slideSearch() {
    //   this.slideSearchBox = !this.slideSearchBox;
    //   this.searchActiveClass = this.slideSearchBox ? true : false;
    //   this.searchName = this.slideSearchBox ? "隐藏" : "查询";
    // },
    // 点击查询
    // searchBtn() {
    //   this.$emit("on-search", true);
    // },
    // 点击重置
    // resetBtn() {
    //   this.$_resestSearchModel(this.$refs.searchBox);
    //   this.$emit("on-resetBtn", true);
    // },
  }
};
</script>

<style lang="less">
#headerTitle {
  display: flex;
  padding: 0;
  .el-button.default.active {
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  }

  .btnInfo {
    // margin-left:10px;
    min-width: 100px;
    // margin-top: 1px;
  }
}
</style>

<style lang="less" scoped>
#headerTitle {
  display: block;
  // flex-direction: row;
  .search {
    right: 0;
    top: 0;
    &.hasbtnList {
      // max-width: 300px;
      height: auto;
      padding-right: 0px;
      // margin-bottom: 12px;
      // margin-top: 12px;
      // display: flex;
      // flex-direction: row;
      // align-items: center;
    }
  }

  .searchBox {
    flex: 3;
    background: #fff;
    padding: 20px 20px 0;
    overflow: hidden;
    box-sizing: border-box;
  }
}
</style>
