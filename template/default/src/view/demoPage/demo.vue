<template>
  <div id="demo">
    <header-title
      icon="iconfont icon-shouye"
      title="示例"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        :addBtnVisible="$_hasOperation($options.name,'add')"
        @on-addBtn="openDialog('add_modeTableData')"
      />
    </header-title>

    <div class="content-view">
      <div>
        搜索值：{{ searchVal }}
      </div>
      <div class="Modeltable">用户名显示：{{_userName}}{{_user}}</div>
      <div>按钮权限控制：mixin.js方法：$_hasOperation($options.name,'add')</div>
    </div>
  </div>
</template>
<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import {
  pickerOptionsRange
} from 'util/searchFormTools';

export default {
  name: 'adaptiveQuery',
  mounted () {
    this.$nextTick(() => {});
  },
  computed: {
    _userName () {
      return this.$store.state.user.username;
    },
    _user () {
      return this.$store.state.user.user;
    }
  },
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'input',
        label: '业务名称',
        props: {
          fieldName: 'instanceName'
        }
      }, {
        type: 'select',
        label: '业务状态',
        props: {
          fieldName: 'status',
          placeholder: '业务状态选择',
          options: [{
            id: null,
            name: '全部'
          }, {
            id: 0,
            name: '待下发'
          }, {
            id: 1,
            name: '待执行'
          }, {
            id: 2,
            name: '执行中'
          }, {
            id: 3,
            name: '已完成'
          }, {
            id: 4,
            name: '已取消'
          }]
        }
      }, {
        type: 'select',
        label: '业务结果',
        props: {
          fieldName: 'executionResult',
          placeholder: '业务结果选择',
          options: [{
            id: null,
            name: '全部'
          }, {
            id: 1,
            name: '待反馈'
          }, {
            id: 3,
            name: '部分成功'
          }, {
            id: 2,
            name: '全部成功'
          }, {
            id: 4,
            name: '失败'
          }]
        }
      }, {
        type: 'radio',
        label: '单选',
        props: {
          fieldName: 'radioCode',
          options: [{
            name: '羽毛球',
            id: 0
          }, {
            name: '篮球',
            id: 1
          }]
        }
      }, {
        type: 'checkbox',
        label: '多选框',
        props: {
          fieldName: 'instanceCode',
          options: [{
            name: '羽毛球',
            id: 0
          }, {
            name: '篮球',
            id: 1
          }]
        }
      }, {
        type: 'dataPicker',
        label: '业务日期',
        placeholder: '选择日期',
        props: {
          fieldName: 'dateNow',
          type: 'date'
        }
      }, {
        span: 8,
        type: 'dataPicker',
        label: '日期范围',
        props: {
          fieldName: 'datesNow',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: pickerOptionsRange
        }
      }]
    };
  },
  components: {
    headerTitle,
    searchForm
  },
  methods: {
    onSearch (val) {
      this.searchVal = {
        ...val,
        beginDate: (val.dateNow && val.dateNow[0]) || '',
        endDate: (val.dateNow && val.dateNow[1]) || ''
      }
    }
  }
};
</script>


<style lang="less">
</style>

