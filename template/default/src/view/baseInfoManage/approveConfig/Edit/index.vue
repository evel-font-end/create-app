<template>
  <div id="edit">
    <dialog-cont
      @on-cancel="canceledit('cancel')"
      @on-close="canceledit('close')"
      @on-confirm="canceledit('cancel')"
      @on-open="openedit"
      :title="`${title}`"
      width="1280px"
      :visible.sync="editshow"
      ref="dialog"
    >
        <div class="container" v-if="items.length === 0">
          <img src="../image/center.png"/>
          <el-button
              size="small"
              type="primary"
              title="添加审核节点"
              icon="el-icon-plus"
              @click.prevent.stop="handleAddBtnClick"
          >
              添加审核节点
          </el-button>
      </div>
      <div class="containerlist" v-else>
        <div class="fg">
          <span class="y top"></span>
          <span class="y bottom"></span>
        </div>
        <div class="list">
          <div class="item listItem" v-for="(item, index) in items" :key="`${item.id}${index}`" :ref="`item`">
            <div class="center" :ref="`listItem`" :style="getStyle(index)">
              <FormItemText
                :layout="item.formItems"
                labelWidth="100px"
              />
              <div class="btnList">
                <el-button
                type="text"
                size="small"
                class="up"
                title="添加上一节点"
                @click.prevent.stop="handleBtnChange('up', {item, index})"
                v-if="item.isStart === 1"
                >
                </el-button>
                <el-button
                type="text"
                size="small"
                class="open"
                title="编辑"
                @click.prevent.stop="handleBtnChange('open', {item, index})"
                >
                </el-button>
                <el-button
                type="text"
                size="small"
                class="del"
                title="删除当前节点"
                @click.prevent.stop="handleBtnChange('del', {item, index})"
                >
                </el-button>
                <el-button
                type="text"
                size="small"
                class="add"
                title="添加下一节点"
                @click.prevent.stop="handleBtnChange('add', {item, index})"
                ></el-button>
              </div>
              <div class="bq">
                <el-tag
                  color="#2573F1"
                  effect="dark">
                  <img src="../image/bq.png" />
                  <div class="arrow"></div>
                  审核节点{{index + 1}}
                </el-tag>
              </div>
              <img src="../image/y.png" class="dot"/>
            </div>
          </div>
        </div>
      </div>
      <baseInfo :show="baseshow" :data="basedata" @cancel="closeEdit" @success="successBase"/>
    </dialog-cont>
  </div>
</template>
<script>
import dialogCont from '@/components/dialog';
import FormItemText from '@/components/formItemText';
import Flex from '@/components/flex';
import BaseInfo from './base';
import {
  getApproveNode,
  delApproveNode
} from '@/api/baseInfoManage';
export default {
  name: 'approveConfig_edit',
  data () {
    return {
      title: '审核节点',
      editdata: {},
      editshow: false,
      baseshow: false,
      basedata: {},
      formItems: [{
        id: 'nodeName',
        label: '节点名称',
        value: ''
      }, {
        id: 'nodeNo',
        label: '节点编号',
        value: ''
      }, {
        id: 'nodeModleText',
        label: '节点模式',
        value: ''
      }, {
        id: 'userCount',
        label: '已配置人员数',
        value: ''
      }, {
        id: 'isStartText',
        label: '是否开始节点',
        value: ''
      }, {
        id: 'isEndText',
        label: '是否结束节点',
        value: ''
      }, {
        id: 'agreePercentage',
        label: '同意人数',
        value: '',
        span: 24
      }],
      items: []
    }
  },
  props: {
    data: {},
    show: ''
  },
  components: {
    BaseInfo,
    dialogCont,
    FormItemText,
    Flex
  },
  watch: {
    show (val) {
      this.editData = this.data;
      this.editshow = val;
    },
    data (val) {
      this.editData = val;
    }
  },
  mounted () {
    this.$nextTick(() => {
    });
  },
  methods: {
    openedit () {
      this._getApproveNode()
    },
    _getApproveNode () {
      const { row } = this.editData;
      const parems = {
        configId: row.id
      };
      getApproveNode(parems).then(res => {
        if (res.code === '200') {
          if (res.data) {
            const items = res.data.map(data => {
              const formItems = this.formItems.map(fItem => {
                const value = data[fItem.id];
                return {
                  id: fItem.id,
                  label: fItem.label,
                  value,
                  span: fItem.span
                }
              });
              const approveUserDtos = data.approveUserDtos;
              approveUserDtos.map((dto, index) => {
                formItems.push({
                  id: `${dto.approveLevel}${index}`,
                  label: '审核人',
                  value: dto.approveUserRealName,
                  span: 24
                });
              });
              return {
                ...data,
                formItems
              }
            });
            this.items = items;
            this.$forceUpdate();
          }
        }
      })
    },
    closeedit () {
      this.editshow = false;
      this.editData = {};
      this.items = [];
    },
    canceledit (type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    closeEdit () {
      this.baseshow = false;
      this.basedata = {};
    },
    handleAddBtnClick () {
      const { row } = this.editData;
      this.basedata = { configId: row.id };
      this.baseshow = true;
    },
    handleBtnChange (type, scope) {
      const { item, index } = scope;
      switch (type) {
        case 'del':
          this._delApproveNode(item, index)
          break;
        case 'add':
          this.addApproveNode(item, index)
          break;
        case 'up':
          this.addApproveNode({ configId: item.configId }, index)
          break;
        case 'open':
          this.addApproveNode({ configType: type, ...item }, index)
          break;
        default:
      }
    },
    _delApproveNode (item, index) {
      const { row } = this.editData;
      const items = JSON.parse(JSON.stringify(this.items));
      const p = {
        configId: row.id,
        nodeId: item.id
      };
      delApproveNode(p).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            position: 'bottom-right'
          });
          items.splice(index, 1);
          this.$set(this.items, items);
          this.items = items;
          this.$forceUpdate();
        }
      });
    },
    addApproveNode (item, index) {
      this.baseshow = true;
      this.basedata = { ...item };
    },
    successBase () {
      this._getApproveNode();
      this.baseshow = true;
      this.basedata = { };
    },
    getStyle (index) {
      setTimeout(() => {
        const currentItem = this.$refs.item[index];
        const prevOne = this.$refs.listItem[index - 1];
        const prevTow = this.$refs.listItem[index - 2];
        const prevCurrent = this.$refs.listItem[index];
        const iHeight = currentItem.offsetHeight;
        const cHeight = prevCurrent.offsetHeight;
        if (index > 1) {
          let height = prevTow.offsetHeight - prevOne.offsetHeight;
          if (index % 2 === 0) {
            if (height === 0) {
              height = height + 100;
            }
            this.$refs.listItem[index].style.marginTop = `${height - 100}px`;
          } else {
            this.$refs.item[index].style.marginTop = `${height + 50}px`;
          }
        }
      }, 0)
    }
  }
}
</script>
<style lang="less">
#edit .el-dialog__body{
    display: flex;
    align-items: center;
    justify-content: center;
}
#edit {
  .container {
    background: #fff;
    width: 352px;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    >img{
        margin-bottom: 95px;
        width: 352px;
        height: 376px;
    }
}
.containerlist{
  width: 100%;
  position: relative;
    .fg{
    width: 1px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -0.5px;
    background: #DEDEDE;
    span{
      &.y{
        position: absolute;
        width:11px;
        height:11px;
        background:rgba(200,200,200,1);
        border-radius: 50%;
        left: 50%;
        margin-left: -5.5px;
        &.top{
          top: 0;
          bottom: auto;
        }
        &.bottom{
          top: auto;
          bottom: 0;
        }
      }
    }
  }
  .list{
    width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: relative;

  .item{
        display: inline-block;
    position: relative;
    width: 50%;
    box-sizing: border-box;
    margin-bottom: 20px;
    .el-form-item__label{
      line-height: 32px;
    }
    .center{
      width: 485px;
      box-sizing: border-box;
      position: relative;
      background:rgba(255,255,255,1);
      box-shadow:0px 2px 12px 0px rgba(205,205,205,0.5);
      padding: 25px 30px;
      margin-right: 135px;
      border-radius: 10px;
      .btnList{
        position: absolute;
        bottom: 25px;
        right: 30px;
        button{
          width: 24px;
          height: 24px;
          padding: 0;
          &.up{
            background: url('../image/up.png') no-repeat center;
            background-size: 100% 100%;
          }
          &.down{
            background: url('../image/down.png') no-repeat center;
            background-size: 100% 100%;
          }
          &.add{
            background: url('../image/add.png') no-repeat center;
            background-size: 100% 100%;
          }
          &.del{
            background: url('../image/del.png') no-repeat center;
            background-size: 100% 100%;
          }
                    &.open{
            background: url('../image/open.png') no-repeat center;
            background-size: 100% 100%;
          }
        }
      }
    }
    .bq{
      display: flex;
      position: absolute;
      top: 50%;
      margin-top: -25px;
      right: -115px;
      span{
        position:relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 50px;
        line-height: 50px;
        font-size:14px;
        img{
          width:16px;
          height:16px;
          margin-right: 3px;
        }
      }
      .arrow{
        width:0;
        height:0;
        border: 10px solid transparent;
        border-left-color: #2573F1;
        position:absolute;
        top: 50%;
        margin-top: -10px;
        right: -20px;
        content:'';
      }
    }
    .dot{
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      right: -143px;
      margin-top: -8px;
    }
    .el-form-item{
      margin-bottom: 0px !important;
    }
    &:nth-child(2n){
      .center{
        margin-right: 0;
        margin-left: 135px;
      }
      .bq{
        right: auto;
        left: -115px;
        .arrow{
          right: auto;
          left: -20px;
          border-left-color: transparent;
          border-right-color: #2573F1;
        }
      }
      .dot{
        right: auto;
        left: -143px;
      }
    }
    &:nth-child(2) {
      margin-top: 100px;
    }
     &:nth-child(2n):not(:nth-child(2)) {
      .center{
        // position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  }
  }
}
</style>
