<template>
  <div id="dictionariesMenu" class="pos-r">
    <div>
      <div class="tree_tit">字典选择<i @click="getTreeList" title="刷新列表" class="iconfont icon-reset"></i></div>
      <div class="tree_content">
        <el-tree
          class="SingleElection"
          node-key="code"
          ref="tree"
          lazy
          highlight-current
          show-checkbox
          :data="menuTree"
          :load="loadNode"
          @node-click="nodeClick"
          :default-expanded-keys="defaultCheckedKeys"
          :default-checked-keys="defaultCheckedKeys"
          :check-strictly="true"
          @check-change="checkChange"
          :props="defaultProps"
        ></el-tree>
      </div>
    </div>
    <!-- <header-title-cont class="headerTitleCont pos-r f-16" icon="el-icon-menu mr-5" title="字典选择"> -->
      <!-- <i slot="icon-r" @click="getTreeList" title="刷新列表" class="iconfont icon-reset cursor pos-a refresh"></i> -->
      <!-- <div> -->
        <!-- <el-tree
          class="SingleElection"
          node-key="code"
          ref="tree"
          lazy
          highlight-current
          show-checkbox
          :data="menuTree"
          :load="loadNode"
          @node-click="nodeClick"
          :default-expanded-keys="defaultCheckedKeys"
          :default-checked-keys="defaultCheckedKeys"
          :check-strictly="true"
          @check-change="checkChange"
          :props="defaultProps"
        ></el-tree> -->

        <!-- <div class="xian"></div> -->
      <!-- </div> -->
    <!-- </header-title-cont> -->
  </div>
</template>

<script>
import headerTitleCont from 'components/headerTitle/headerTitleCont';
import { dictionaryList, getDictionaryListCode } from '@/api';
export default {
  props: {
    // 默认选中
    defaultCheckedKeys: {
      type: Array,
      default () {
        return ['ROOT'];
      }
    }
  },
  name: 'dictionariesMenu',
  data () {
    return {
      editCheckId: '',
      menuTree: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: data => {
          if (!data.identification) return true;
        }
      }
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.getTreeList();
    });
  },
  methods: {
    getTreeList () {
      dictionaryList().then(res => {
        if (res.code === '200') {
          this.formatList(res.data);
          this.$emit('check-node', res.data[0]);
        }
      });
    },
    checkChange (item, node, self) {
      if (node === true) {
        this.editCheckId = item.code;
        this.$refs.tree.setCheckedKeys([item.code]);

        this.$emit('check-node', item);
      } else {
        this.editCheckId = '';
      }
    },
    // 格式化成需要的树结构组
    formatList (list) {
      let root = [];
      let children = [];
      list.forEach(item => {
        item['parentCode'] = 'ROOT';
        if (item.code === 'ROOT') {
          root.push(item);
        } else {
          children.push(item);
        }
      });

      root[0]['children'] = children;
      this.menuTree = root;
    },
    // 懒加载
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve(this.menuTree);
      }

      if (node.level === 1) {
        return resolve(this.menuTree[0].children);
      }

      if (node.level > 1) {
        this.getTreeListCode(node.data, resolve);
      }
    },
    // 根据code懒加载树节点
    getTreeListCode (node, resolve) {
      let data = {
        data: {
          name: '',
          code: node.code,
          enabled: ''
        },
        pageNo: 1, // 查询的分页页码
        pageSize: 10000, // 查询的分页页大小, 默认10
        sorting: ''
      };

      getDictionaryListCode(data).then(res => {
        if (res.code === '200') {
          let arr = res.data.data;
          arr.forEach(item => {
            item['parentCode'] = node.code;
          });

          resolve(arr);
        }
      });
    },
    nodeClick (item, node, self) {
      this.editCheckId = item.code;

      this.$refs.tree.setCheckedKeys([item.code]);
    }
  },
  components: {
    headerTitleCont
  },
  computed: {}
};
</script>

<style lang="less">
#dictionariesMenu {
  min-height: 100%;
  .el-checkbox {
    width: 1px;
    overflow: hidden;
    opacity: 0;
    margin-right: 0;
  }
    .tree_content{
    box-shadow:0px 2px 6px 0px rgba(221,222,223,0.5);
    border-radius:4px;
    .el-tree{
      color: #3F3F3F;
    }
    /deep/.el-tree-node{
      padding: 10px 0;
      box-shadow:0px 1px 0px 0px rgba(224,224,224,0.5);
    }
    /deep/.el-tree--highlight-current .el-tree-node.is-current:not(.is-expanded){
      .el-tree-node__label{
        color: #2573F2;
      }
      /deep/.el-tree-node__content{
        background:transparent;
      }
    }
  }
}
// #dictionariesMenu >>>
</style>


<style lang="less" scoped>
#dictionariesMenu {
  // padding-right: 8px;
  .cursor {
    cursor: pointer;
  }
  .refresh {
    right: 5%;
    top: 24px;
    transform: translateY(-50%);
  }

  .xian {
    position: absolute;
    padding: 0px;
    margin: 0px;
    font-size: 1px;
    text-align: left;
    overflow: hidden;
    z-index: 2;
    // cursor: w-resize;
    right: 0;
    width: 8px;
    top: 0px;
    bottom: 0px;
    border-right: 1px solid #eee;
    background: #fafafa;
  }

  .headerTitleCont {
    margin-top: 0;
    color: #606266;
    padding: 13px 10px 13px 15px;
  }

  .SingleElection {
    padding-bottom: 0px;
  }
  .tree_tit {
    // width:69px;
    height:37px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(63, 63, 63, 1);
    line-height: 37px;
    letter-spacing: 1px;
    position: relative;
    padding-left: 7px;
    // margin-top: 7px;
    margin-bottom: 20px;
    .icon-reset{
      position: absolute;
      right: 0;
      top: 2px;
    }
  }
  .tree_tit::after{
    width:3px;
    height:15px;
    background:rgba(37,115,242,1);
    content: '';
    position: absolute;
    top: 12px;
    left: 0;
  }
}
</style>
