<template>
  <div id="resourcesManagement">
    <!-- 资源管理 -->
    <!-- <header-title icon="iconfont icon-shouye" :search="false">

    </header-title> -->

    <div class="content-view">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-upload"
        @click="updateTree"
      >更新资源可用性</el-button>
        <!-- v-if="$_hasOperation($options.name,'update')" -->
        <!-- :disabled="disabled || treeData.length === 0" -->
      <el-tree
        :data="treeData"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="checkedKeys"
        class="jurisdictionTree mt-10"
        ref="jurisdictionTree"
        @check-change="checkTreeList"
        :props="defaultProps"
        :render-content="renderContent"
      ></el-tree>
    </div>
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import { updatePermissionsStatus, listAllPermissions } from '@/api';
import { toTree, CheckTreeData } from 'util/util';
export default {
  name: 'resources_management',
  data () {
    return {
      disabled: false, // 更新资源可用性 按钮
      defaultProps: {
        children: 'children',
        label: 'permissionName'
      },
      treeData: [], // 权限树数据
      checkedKeys: [], // 默认选中权限树数据
      updateTreeList: [] // 当前权限树被修改的数据
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.getDataAllList();
    });
  },
  components: {
    headerTitle
  },
  methods: {
    // 设置底层打横
    setBoxX () {
      this.$nextTick(() => {
        const _levelname = document.getElementsByClassName('levelname');
        const _levelname2 = document.getElementsByClassName('levelname2');

        for (let i = 0; i < _levelname2.length; i++) {
          _levelname2[i].parentNode.nextSibling.classList.add('levelnamePar');
        }

        for (let i = 0; i < _levelname.length; i++) {
          _levelname[i].parentNode.style.cssFloat = 'left';
          _levelname[i].parentNode.style.styleFloat = 'left';
          _levelname[i].parentNode.style.paddingLeft = '15px';
        }
      });
    },
    // 最底层添加样式
    renderContent (h, { node, data, store }) {
      let classname = '';
      if (node.level === 3) {
        classname = 'levelname';
      }
      if (node.level === 2) {
        classname = 'levelname2';
      }

      return (
        <span class={classname}>
          <span>{node.label}</span>
        </span>
      );
    },
    // 更新资源可用性
    updateTree () {
      this.disabled = true;
      this.HalfCheckedNodes();

      updatePermissionsStatus(this.updateTreeList).then(res => {
        if (res.code === '200') {
          this.$notify({
            type: 'success',
            title: '成功',
            message: '更新资源成功',
            position: 'bottom-right'
          });
          this.disabled = false;
          this.getDataAllList();
        }
      });
    },
    // 获取所有权限信息
    getDataAllList (_this = this) {
      listAllPermissions().then(res => {
        if (res.code === '200') {
          _this.updateTreeList = [];
          _this.checkedKeys = _this.checkTree(res.data);
          _this.treeData = toTree(res.data);
          _this.setBoxX();
        }
      });
    },
    // 当前被选中的相关树节点
    checkTreeList (data, checked) {
      // 节点本身是否被选中, 节点的子树中是否有被选中的节点
      const _this = this;

      let parNode = this.$refs.jurisdictionTree.getNode(data.id).parent; // 拿到当前节点父级

      let checkNode = new CheckTreeData(Object.assign({}, data)); // 当前被选中
      let parNodeInfo;
      parNodeInfo = new CheckTreeData(Object.assign({}, parNode.data)); // 构造当前父节点

      let hasNode = this.updateTreeList.some(
        item => item.permissionCode === checkNode.permissionCode
      );

      if (!hasNode) {
        checkNode.status = checked ? '1' : '0';
        checkNode.frontFlag = checked;

        this.updateTreeList.push(checkNode);
      } else {
        this.updateTreeList.forEach((item, index) => {
          if (item.permissionCode === checkNode.permissionCode) {
            _this.updateTreeList.splice(index, 1);
          }
        });
      }

      if (parNodeInfo) {
        let hasParNode = this.updateTreeList.some(
          item => item.permissionCode === parNodeInfo.permissionCode
        );

        if (!hasParNode) {
          parNodeInfo.status = parNode.checked ? '1' : '0';
          parNodeInfo.frontFlag = parNode.checked;

          this.updateTreeList.push(parNodeInfo);
        } else {
          this.updateTreeList.forEach((item, index) => {
            if (item.permissionCode === parNodeInfo.permissionCode) {
              parNodeInfo.status = parNode.checked ? '1' : '0';
              parNodeInfo.frontFlag = parNode.checked;
              // _this.updateTreeList.splice(index, 1);
            }
          });
        }
      }
    },
    // 合并半节点数据
    HalfCheckedNodes () {
      const _this = this;
      const HalfCheckedNodes = this.$refs.jurisdictionTree.getHalfCheckedNodes();
      if (!HalfCheckedNodes.length) return false;
      let HalfNode = [];

      HalfCheckedNodes.forEach((parItem, parItemIndex) => {
        let node = new CheckTreeData(Object.assign({}, parItem)); // 当前被选中
        node.status = '1';
        node.frontFlag = false;
        let flag = true; // 判断当前树中有没有半选父节点

        _this.updateTreeList.forEach((item, index) => {
          if (item.permissionCode === parItem.permissionCode) {
            _this.updateTreeList.splice(index, 1);
            _this.updateTreeList.push(node);
            flag = false;
          }
        });
        if (flag) _this.updateTreeList.push(node);
      });
    },
    // 获取当前被选中的数
    checkTree (treeData) {
      if (!treeData) return [];
      let check = [];
      treeData.forEach(item => {
        if (item.frontFlag) check.push(item.id);
      });
      return check;
    }
  }
};
</script>

<style lang="less" scoped>
#resourcesManagement{
  font-size: 14px;
}
.content-view{
    background:#fff;
    padding:10px 20px;
}
.jurisdictionTree {
  .el-tree-node__content span.levelname {
    float: left;
  }
  .is-leaf {
    display: none;
  }
  .levelnamePar > div.el-tree-node:first-child .el-tree-node__content {
    padding-left: 58px !important;
  }
}
</style>

