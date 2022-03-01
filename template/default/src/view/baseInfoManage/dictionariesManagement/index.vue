<template>
  <div id="dictionariesManagement" class="pos-r container">
    <div class="dictionariesMenu pos-a">
      <dictionaries-menu
        :defaultCheckedKeys="defaultCheckedKeys"
        @check-node="checkNode"
        ref="dictionariesMenu"
      ></dictionaries-menu>
    </div>
    <div class="bd-r">
      <header-title
      >
        <search-form
          slot="searchBox"
          labelWidth="100px"
          :searchItems="searchItems"
          @onSearch="onSearch"
          :addBtnVisible="$_hasOperation($options.name,'add')"
          @on-addBtn="openDialog('add')"
        />
      </header-title>

      <page-table
        :data="tableData"
        :cols="tableCols"
        col-align="left"
        operator
        operator-width="120"
        :page-current="page.current"
        :total="page.total"
        :page-size="page.pageSize"
        @current-change="onCurrentChange"
        @size-change="onPageSizeChange"
      >
        <template slot-scope="scope" slot="operator">
          <!-- <el-button 
            icon="iconfont icon-qiyong" title="启用" :disabled="$_loading" type="text" 
            v-if="(!scope.row.isEnabled)&&($_hasOperation($options.name,'enable'))" 
            @click="off('enabled',scope.row)">
          </el-button>
          <el-button 
            icon="iconfont icon-jinyong" title="禁用" :disabled="$_loading" type="text" 
            v-if="(scope.row.isEnabled)&&($_hasOperation($options.name,'disEnable'))" 
            @click="off('unEnabled',scope.row)">
          </el-button> -->
          <el-button 
            icon="iconfont icon-xiugaii" title="编辑" :disabled="$_loading" type="text" 
            @click="openDialog('edit',scope.row)" 
            v-if="$_hasOperation($options.name,'edit')">
          </el-button>
          <el-button 
            icon="iconfont icon-delete" title="删除" :disabled="$_loading" type="text" 
            @click="openDialog('delete',scope.row)" 
            v-if="$_hasOperation($options.name,'delete')">
          </el-button>
        </template>
      </page-table>
      <!-- 删除提示 -->
      <dialog-cont
        @on-cancel="dialog.remove=false"
        @on-close="dialog.remove=false"
        width="240px"
        @on-confirm="removeSure"
        :visible="dialog.remove"
        class="dialogCont"
      >
        <span>确认删除当前字典?</span>
      </dialog-cont>

      <!--添加修改查看字典 -->
      <dialog-cont
        :visible="dialog.view"
        :title="dialog.title"
        @on-cancel="dialog.view=false"
        @on-close="dialog.view=false"
        @on-confirm="subFromDictionary"
        :confirmShow="dialog.stateType==='show'? false : true"
      >
        <operation-dictionaries
          ref="operationDiction"
          :stateType="dialog.stateType"
          :get-user-info="dialog.getUserInfo"
          @success-from="submitFromData"
        ></operation-dictionaries>
      </dialog-cont>
    </div>
  </div>
</template>

<script>
import Flex from '@/components/flex';
import PageTable from '@/components/page-table';
import dialogCont from '@/components/dialog';
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import dictionariesMenu from './dictionaries-menu';
import operationDictionaries from './operationDictionaries';
import {
  getDictionariesList,
  getDictionaryTypes,
  dictionaryUpdate,
  addDictionary,
  setEnable,
  setDisEnable,
  getDictionaryListCode,
  deleteDictionary
} from '@/api';
export default {
  name: 'dictionaries_management',
  components: {
    headerTitle,
    searchForm,
    PageTable,
    dialogCont,
    Flex,
    dictionariesMenu,
    operationDictionaries
  },
  data () {
    return {
      searchVal: {
        name: '', // 字典名称/值
        code: '', // 字典code
        enabled: '' // 是否可用
      },
      searchItems: [
        {
          type: 'input',
          label: '字典名称/值：',
          props: {
            width: '140px',
            placeholder: '请输入字典名称/值',
            fieldName: 'name'
          }
        },
        {
          type: 'select',
          label: '是否可用：',
          labelWidth: '80px',
          hide: true,
          props: {
            fieldName: 'enabled',
            placeholder: '是否可用选择',
            options: [
              { name: '是', id: true },
              { name: '否', id: false }
            ]
          }
        }
      ],
      tableCols: [
        { label: '字典编码', prop: 'code' },
        { label: '字典名称/值', prop: 'name' },
        { label: '字典值', prop: 'value' },
        // { label: '是否可用', prop: 'isEnabledText', minWidth: '80px' },
        { label: '排序', prop: 'sortKey', minWidth: '80px' },
        { label: '字典描述', prop: 'description' }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      // 字典数据
      tableData: [],
      dialog: {
        title: '添加字典', // 新增/修改/查看字典弹窗 标题
        remove: false, // 删除弹窗
        view: false, // 新增/修改/查看字典
        stateType: 'add', // 弹窗的模式
        deleteCode: '', // 当前需要删除字典code
        getUserInfo: {} // (添加/修改/查看)当前窗口打开的用户行
      },
      getNodeChild: {},
      // 默认选中节点
      defaultCheckedKeys: ['ROOT']
    };
  },
  methods: {
    onSearch (val) {
      this.searchVal.name = val.name ? val.name : '';
      this.searchVal.enabled = val.enabled ? val.enabled : (val.enabled === false ? val.enabled : '');
      // val.enabled ? val.enabled === '1' ? true : val.enabled === '0' ? false : '' : '';
      this.onCurrentChange(1);
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getList();
    },
    onPageSizeChange (val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    // 字典设置可用/ 不可用
    off (state, row) {
      const _this = this;
      switch (state) {
        case 'enabled': // 可用
          setEnable(row.code).then(res => {
            if (res.code === '200') {
              this.getList();
              this.$notify({
                title: '成功',
                message: '字典成功设置为可用',
                type: 'success',
                position: 'bottom-right'
              });
            }
          });
          break;
        case 'unEnabled': // 不可用
          setDisEnable(row.code).then(res => {
            if (res.code === '200') {
              this.getList();
              this.$notify({
                title: '成功',
                message: '字典成功设置为不可用',
                type: 'success',
                position: 'bottom-right'
              });
            }
          });
          break;
      }
    },
    // 更新左侧列表数据
    updateMenu (parendCode) {
      this.defaultCheckedKeys = ['ROOT', parendCode];
      this.$refs.dictionariesMenu.getTreeList();
    },
    // 删除字典
    removeSure () {
      deleteDictionary(this.dialog.deleteCode).then(res => {
        if (res.code === '200') {
          this.dialog.remove = false;
          this.getList();
          this.updateMenu();
          this.$notify({
            title: '成功',
            message: '删除字典成功',
            type: 'success',
            position: 'bottom-right'
          });
        }
      });
    },
    // 新增/修改/查看字典 弹窗
    openDialog (state, info = '') {
      this.dialog.stateType = state;
      switch (state) {
        case 'add':
          this.dialog.view = true;
          this.dialog.title = '添加字典';
          if (this.dialog.view) {
            this.dialog.getUserInfo = {
              parentCode: this.getNodeChild.code // 父级字典编码
            };
          }
          break;
        case 'edit':
          this.dialog.view = true;
          this.dialog.getUserInfo = info;
          this.dialog.getUserInfo['parentCode'] = this.getNodeChild.code;
          this.dialog.title = '修改字典';
          break;
        case 'show':
          this.dialog.title = '查看字典信息';
          this.dialog.getUserInfo = info;
          this.dialog.view = true;
          break;
        case 'delete':
          this.dialog.remove = true;
          this.dialog.deleteCode = info.code;
          break;
      }
    },
    // 新增/修改/查看用户 弹窗返回信息
    submitFromData (data, state) {
      const _this = this;
      switch (state) {
        case 'add':
          addDictionary({ ...data }).then(res => {
            if (res.code === '200') {
              this.getList();
              this.updateMenu(data.parentCode);
              this.$notify({
                title: '成功',
                message: '新增字典成功',
                type: 'success',
                position: 'bottom-right'
              });
              this.dialog.view = false;
            }
          });
          break;
        case 'edit':
          dictionaryUpdate({ ...data }).then(res => {
            if (res.code === '200') {
              _this.dialog.view = false;
              this.getList();
              _this.$notify({
                title: '成功',
                message: '更新字典信息成功',
                type: 'success',
                position: 'bottom-right'
              });
            }
          });
          break;
        case 'show':
          break;
      }
    },
    // 设置不可用弹窗确定
    unavailableSure () {
      this.dialog.unavailable = false;
    },
    // 获取/查询字典列表
    getList () {
      const param = {
        data: this.searchVal,
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      getDictionaryListCode(param).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data;
          data.map(item => {
            item.isEnabledText = item.isEnabled ? '是' : '否';
          });
          this.page.total = total;
          this.tableData = data;
        }
      });
    },
    // 搜索下拉 获取字典类型
    getDictionaryList () {
      getDictionaryTypes().then(res => {
        if (res.code === '200') {
          this.searchVal.dictionaryTypes = Object.freeze(res.data);
        }
      });
    },
    // 新增/修改/查看字典 弹窗按确定
    subFromDictionary () {
      let userFrom = this.$refs.operationDiction;
      switch (this.dialog.stateType) {
        case 'add':
          userFrom.submitForm();
          break;
        case 'edit':
          userFrom.submitForm();
          break;
        case 'show':
          this.dialog.view = false;
          break;
      }
    },
    checkNode (node) {
      this.searchVal.code = node.code;
      this.getNodeChild = node;
      this.onCurrentChange(1);
    }
  },
  created () {}
};
</script>

<style lang="less" scoped>
#dictionariesManagement {
  .dialogCont {
    i {
      color: #e6a23c;
      font-size: 26px;
    }
    span {
      padding-left: 25px;
    }
  }

  .bd-r {
    padding-left: 213px;
    >.comp-page-table{
      padding:0 20px;
      background: #fff;
    }
  }

  .dictionariesMenu {
    width: 198px;
    z-index: 100;
    // bottom: 0;
    top: 0px;
    background: transparent;
  }
  /deep/.resetBtn{
    // margin-right: 20px;
    // background:rgba(247,247,247,1);
    // background-color: #fff;
    // border:1px solid rgba(192,192,192,1);
    // color:rgba(77,77,77,1);
  }
}
</style>
