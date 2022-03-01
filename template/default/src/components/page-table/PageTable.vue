
<template>
  <div class="comp-page-table" id="PageTable">
    <el-table
      ref="pageTable"
      v-loading="loading || $_loading"
      :data="data"
      :element-loading-text="loadingText"
      :row-key="rowKey"
      :height="tableHeight"
      tooltip-effect="light"
      :empty-text="emptyText"
      v-bind="$attrs"
      :highlight-current-row="highlightCurrentRow"
      @selection-change="onSelectionChange"
      @current-change="onRowCurrentChange"
      :border="border"
      :load="load"
      :lazy="lazy"
      :tree-props="treeProps">
    >
      <el-table-column
        v-if="selection"
        align="center"
        type="selection"
        width="50"
        fixed="left"
        :selectable="selectable"
        :reserve-selection="reserveSelection"
      />
      <el-table-column
        v-if="expand"
        type="expand"
        fixed="left"
      >
        <template slot-scope="scope">
          <div>
            <slot
              name="expand"
              :row="scope.row"
              :index="scope.$index"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="data.length > 0 && !hideDefaultIndex"
        label="序号"
        type="index"
        width="60"
        :align="colAlign"
        fixed="left"
      >
       <template slot-scope="scope" >
          <span v-if="sortByBack">{{scope._self.data.length - scope.$index}}</span>
          <span v-else>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(col, index) in cols"
        :key="`col-${index}`"
        :label="col.label"
        :prop="col.prop"
        :align="col.align || colAlign"
        :fixed="col.fixed || false"
        :width="col.width"
        :min-width="col.minWidth || 80"
        :show-overflow-tooltip="showOverflowTooltip"
      >
        <template slot-scope="scope">
          <span v-if="!col.render">{{ getDataName(scope.row, col) }}</span>
          <lb-render :scope="scope"
            :render="col.render"
            v-if="col.render"
            >
          </lb-render>
        </template>
      </el-table-column>
      <el-table-column
        v-if="operator"
        fixed="right"
        label="操作"
        :width="operatorWidth"
        :align="colAlign"
      >
        <template slot-scope="scope">
          <div>
            <slot
              name="operator"
              :row="scope.row"
              :index="scope.$index"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div :style="pageWrapperStyle" v-if="showPage" class="bg-f">
      <el-pagination
        class="pagination"
        background
        :layout="pageLayout"
        :pager-count="5"
        :current-page="pageCurrent"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :total="total"
        @current-change="onCurrentChange"
        @size-change="onPageSizeChange"
      />
    </div>
  </div>
</template>

<script>
import LbRender from './lb-render'
/* eslint-disable vue/require-default-prop */
export default {
  name: 'PageTable',
  props: {
    data: {
      type: Array,
      default () {
        return [];
      }
    },
    cols: {
      type: Array,
      default () {
        return [];
        // e.g
        // [{
        //  label: '标题',
        //  prop: '字段名',
        //  minWidth: '100'
        // }]
      }
    },
    /** 每列文字的对齐方式 */
    colAlign: {
      type: String,
      default: 'left'
    },
    /** 当前分页页码 */
    pageCurrent: {
      type: Number,
      default: 1
    },
    /** 数据总量 */
    total: {
      type: Number,
      default: 0
    },
    /** 每页的数据数量 */
    pageSize: {
      type: Number,
      default: 10
    },
    /** 可选的每页数量 */
    pageSizes: {
      type: Array,
      default () {
        return [10, 20, 30, 40, 50, 100];
      }
    },
    /** 分页组件显示的子组件 */
    pageLayout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    /** 分页组件在页面中的对齐方式 */
    pageAlign: {
      type: String,
      default: 'center'
    },
    /** 是否显示操作列 */
    operator: {
      type: Boolean,
      default: false
    },
    /** 操作列的宽度 */
    operatorWidth: {
      type: [String, Number],
      default: 80
    },
    /** 是否多选 */
    selection: {
      type: Boolean,
      default: false
    },
    /** 是否显示加载动画 */
    loading: {
      type: Boolean,
      default: false
    },
    /** 当内容过长被隐藏时显示 tooltip */
    showOverflowTooltip: {
      type: Boolean,
      default: true
    },
    rowKey: [String, Function],
    /** type=selection时, 数据更新之后保留之前选中的数据 */
    reserveSelection: {
      type: Boolean,
      default: false
    },
    // eslint-disable-next-line vue/require-default-prop
    tableHeight: {
      type: [String, Number]
    },
    /** 当前行是否可选 */
    selectable: {
      type: [Function, Boolean],
      default: null
    },
    hideDefaultIndex: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: '数据加载中...'
    },
    showPage: {
      type: Boolean,
      default: true
    },
    /** 列是否能拖拉 */
    border: {
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    expand: {
      type: Boolean,
      default: false
    },
    lazy: {
      type: Boolean,
      default: false
    },
    load: {
      type: Function,
      default: null
    },
    treeProps: {
      type: [Object, Array],
    },
    sortByBack: {
      type: Boolean,
      default: false
    }
  },
  components: {
    LbRender
  },
  computed: {
    pageWrapperStyle () {
      const { pageAlign } = this;
      const ALIGN = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end'
      };
      return {
        display: 'flex',
        justifyContent: ALIGN[pageAlign],
        padding: '10px 0 20px',
        backgroundColor: '#FFFFFF'
      };
    },
    emptyText () {
      return this.loading ? '' : '暂无数据';
    }
  },
  mounted () {
    this.$emit('mounted', this.$refs.pageTable);
  },
  methods: {
    onPageSizeChange (val) {
      this.$emit('size-change', val);
    },
    onCurrentChange (val) {
      this.$emit('current-change', val);
    },
    onSelectionChange (args) {
      this.$emit('selection-change', args);
    },
    onRowCurrentChange (val) {
      this.$emit('row-current-change', val);
    },
    onRowChange (rowItems, idx = 'id', bool = true) {
      rowItems.map(row => {
        const id = row[idx];
        const index = this.data.findIndex(data => data.id == id);
        // console.log('index', index);
        if (index > -1) {
          this.$refs.pageTable.toggleRowSelection(this.data[index], bool);
        }
      });
    },
    onSetCurrentRow (id) {
      const index = this.data.findIndex(data => data.id == id);
      this.$refs.pageTable.setCurrentRow(this.data[index]);
    },
    getDataName (scope, items) {
      return scope[items.prop]
    },
    toggleAllSelection () {
      this.$refs.pageTable.toggleAllSelection()
    },
    getPageTable () {
      this.$refs.pageTable.clearSelection()
    }
  }
};
</script>

<style lang="less" scoped>
.bg-f{
  background: #fff;
}
.flex-center {
  display: flex;
  justify-content: center;
}
/deep/ .el-button {
  margin-right: 10px;
}
.comp-page-table{  //table的class
  /deep/.el-table__fixed, /deep/.el-table__fixed-right{
    height: 100% !important; //设置高优先，以覆盖内联样式
  }
}
/deep/ .el-loading-mask{
  .circular{
    .path{
      stroke: #409EFF;
    }
  }
}
</style>
