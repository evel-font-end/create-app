<template>
  <div id="matchJurisdiction">
    <!-- 角色管理 - 匹配权限 -->
    <div class="content-bd">
      <el-row :gutter="10" class="mb-5" v-if="!showMatch">
        <el-col :span="6">
          <div class="label">角色名称：</div>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="getUserInfo.row.roleName"
            :disabled="true"
          ></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <div class="label" v-html="title"></div>
        </el-col>
        <el-col :span="18">
          <el-tree
            :data="treeData"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="jurisdictionTree"
            :default-checked-keys="checkedKeys"
            :props="defaultProps"
            :render-content="renderContent"
          >
          </el-tree>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { toTree } from "util/util";
import { listPermissionsByRoleCode } from "@/api/role";
export default {
  name: "matchJurisdiction",
  props: {
    stateType: {
      type: String,
      default: "add", // set 匹配权限  show查看权限
    },
    getUserInfo: {
      // 当前操作用户信息
      type: Object,
      default() {
        return {};
      },
    },
    showMatch: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "请选择需要配置资源权限：",
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getListAllJurisdiction();
      this.addMatchInfo(this.getUserInfo);
    });
  },
  watch: {
    // 同步更新数据显示
    getUserInfo(newVal, oldVal) {
      this.addMatchInfo(newVal);
    },
  },
  data() {
    return {
      defaultProps: {
        label: "permissionName",
      },
      matchInfo: {
        roleName: "",
      },
      treeData: [], // 权限树数据
      checkedKeys: [], // 默认选中权限树数据
    };
  },
  methods: {
    // 设置底层打横
    setBoxX() {
      this.$nextTick(() => {
        const _levelname = document.getElementsByClassName("levelname");
        const _levelname2 = document.getElementsByClassName("levelname2");

        for (let i = 0; i < _levelname2.length; i++) {
          _levelname2[i].parentNode.nextSibling.classList.add("levelnamePar");
        }

        for (let i = 0; i < _levelname.length; i++) {
          _levelname[i].parentNode.style.cssFloat = "left";
          _levelname[i].parentNode.style.styleFloat = "left";
          _levelname[i].parentNode.style.paddingLeft = "15px";
        }
      });
    },
    // 最底层添加样式
    renderContent(h, { node, data, store }) {
      let classname = "";
      if (node.level === 3) {
        classname = "levelname";
      }
      if (node.level === 2) {
        classname = "levelname2";
      }

      return (
        <span class={classname}>
          <span>{node.label}</span>
        </span>
      );
    },
    // 抛出当前角色所选权限
    getJurisdictionInfo() {
      let checkNode = this.$refs.jurisdictionTree.getCheckedNodes(); // 获取当前全部被选中的元素
      let checkParNode = this.$refs.jurisdictionTree.getHalfCheckedNodes(); // 当前被选中的父节点

      const checkTreeList = [...checkNode, ...checkParNode];

      let treeArr = [];
      checkTreeList.forEach((item) => {
        let { permissionCode } = item;
        treeArr.push(permissionCode);
      });

      const info = Object.assign(
        {},
        { roleCode: this.getUserInfo.row.roleCode },
        { permissionsList: treeArr }
      );

      this.$emit("getRoleJurisdiction", info);
    },
    // 获取当前角色所有权限信息
    getListAllJurisdiction(roleCode) {
      if (!roleCode) return;
      listPermissionsByRoleCode(roleCode).then((res) => {
        if (res.code === "200") {
          this.updateTreeList = [];
          if (this.stateType === "show") {
            res.data.forEach((item) => {
              item["disabled"] = true;
            });
          }
          this.treeData = toTree(res.data);
          this.checkedKeys = this.checkTree(res.data);
          this.setBoxX();
        }
      });
    },
    // 获取当前被选中的数
    checkTree(treeData) {
      if (!treeData) return [];
      let check = [];
      treeData.forEach((item) => {
        if (item.isCheck) check.push(item.id);
      });
      return check;
    },
    // 同步更新数据显示
    addMatchInfo(newVal) {
      const { row } = newVal;

      let obj = row;
      this.matchInfo = obj;
      this.getListAllJurisdiction(obj.roleCode);
    },
  },
};
</script>

<style lang="less" scoped>
#matchJurisdiction {
  .label {
    font-size: 14px;
    text-align: right;
  }
}
</style>

<style lang="less">
#matchJurisdiction {
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
