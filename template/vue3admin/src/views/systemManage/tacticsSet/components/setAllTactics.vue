<template>
  <div class="setAllTactics">
    <DialogCont
      @on-cancel="canceledit('close')"
      @on-close="canceledit('close')"
      @on-confirm="confirmedit"
      @on-open="openedit"
      :title="`${obj.title}`"
      width="1100px"
      :visible="obj.show"
      ref="dialog"
      customClass="flexColumn setAllTacticsDialog"
    >
      <div class="flexCenter">
        <div class="flexRow selectType">
          <div
          :class="baseInfo.activeType === 'common' ? 'active' : ''"
          @click="() => handleChangeType('common')"
          >普通设置</div>
          <div
          :class="baseInfo.activeType === 'default' ? 'active' : ''"
          @click="() => handleChangeType('default')"
          >通用策略设置</div>
        </div>
      </div>
      <div class="flexRow lightMain">
        <LightItems ref="lightItems" :lightArray="obj.lightArray" v-show="baseInfo.activeType === 'common'"/>
        <div class="flexColumn tacticsList" v-show="baseInfo.activeType === 'default'">
          <el-radio-group v-model="obj.lightItemTactics">
            <el-radio
              v-for="radioItem in obj.item.lightItems"
              :key="radioItem.id"
              :label="radioItem.id"
            >
            {{radioItem.lightName}}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
    </DialogCont>
  </div>
</template>
<script lang="ts">
import { toRefs, reactive, ref, onMounted, getCurrentInstance, watch } from "vue";
import DialogCont from '@/components/dialog/Dialog.vue';
import LightItems from './lightItems.vue';
import { lampControll } from '@/api/systemManage';
export default {
  name: 'setAllTactics',
  components: {
    DialogCont,
    LightItems
  },
  props: {
    title: {
      type: String,
      default: '设置照明策略'
    },
    show: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['cancel'],
  setup(props: any, context: any) {
    const { show, title, item } = toRefs(props)
    const obj = reactive({
      show,
      title,
      item,
      lightItemTactics: '',
      lightArray: []
    })
    const lightItems = ref<any>({});
    // watch(show, (val) => {
    // })
    const baseInfo = reactive({
      activeType: 'common',
      radio1: '1'
    })
    const openedit = () => {}
    const canceledit = (type?: string) => {
      obj.lightArray = [];
      context.emit('cancel', type)
    };
    const confirmedit = async () => {
      const lightItemsValues = await lightItems.value.getValue()
      if (baseInfo.activeType === 'common') {
        const parames = {
          ids: props.item.ids,
          siteId: props.item.siteId,
          light: lightItemsValues.light
        }
        lampControll(parames).then((res: any) => {
          if (res && res.code === '200') {
            canceledit('cancel');
          }
        })
      } else {
        const parames = {
          lightPlanId: obj.lightItemTactics,
          ids: props.item.ids,
          siteId: props.item.siteId,
          light: lightItemsValues.light
        }
        console.log('parames', parames);
        lampControll(parames).then((res: any) => {
          if (res && res.code === '200') {
            canceledit('cancel');
          }
        })
      }
    }
    const handleChangeType = (type: string) => {
      baseInfo.activeType = type;
    }
    return{
      obj,
      baseInfo,
      lightItems,
      openedit,
      canceledit,
      confirmedit,
      handleChangeType
    }
  }
}
</script>

<style lang="less" scoped>
.setAllTactics{
  padding-bottom: 20px;/*no*/
  .selectType{
    display: inline-flex;
    margin-bottom: 20px;/*no*/
    font-size: 14px;/*no*/
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    text-align: left;
    color: #31353e;
    background: #f1f6ff;
    border-radius: 50px;
    margin: 0 auto;
    div{
      padding:8px 18px;/*no*/
      cursor: pointer;
      &.active{
        background: #365ccf;
        border-radius: 50px;
        color: #ffffff;
      }
    }
  }
  .baseInfoInput{
    margin-bottom: 20px;/*no*/
  }
  .lightMain{
    width: 100%;
    .tacticsList{
      width: 100%;
      margin-top: 25px;/*no*/
      &:deep(.el-radio) {
        width: 100%;
        margin: 0;
        margin-bottom: 10px;/*no*/
        padding: 10px;/*no*/
        height: auto;
        border: 1px solid #f1f6ff;/*no*/
        .el-radio__input{
          .el-radio__inner{
            width: 18px;/*no*/
            height: 18px;/*no*/
          }
        }
        .el-radio__label{
          font-size: 14px;/*no*/
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          text-align: left;
          color: #31353E;
        }
        &.is-checked{
          background: #f1f6ff;
          border-radius: 4px;/*no*/
          border: none;
          .el-radio__inner {
            background: #365CCF;
            border-color: #365CCF;
          }
          .el-radio__label{
            color: #365ccf;
          }
        }
      }
    }
  }
}
</style>
