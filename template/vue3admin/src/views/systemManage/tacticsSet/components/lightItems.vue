<template>
    <el-form
      class="flexRow lightMain"
      :model="ruleForm.obj"
      ref="ruleFormRef"
    >
      <div
        v-for="lightItem in formItem"
        :key="lightItem.id"
        class="flexColumn lightItem"
      >
        <div class="title">{{lightItem.name}}</div>
        <div class="flexRow flexCenter slider">
          <i class="iconfont close icon-deng" />
            <el-slider v-model="ruleForm.obj[lightItem.id]" :disabled="type === 'detail'"></el-slider>
          <i class="iconfont open icon-deng" />
        </div>
      </div>
    </el-form>
</template>
<script lang="ts">
import { ref, reactive, watch, toRefs } from 'vue'

export default {
  name: 'lightItems',
  components: {
  },
  props: {
    lightArray: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'edit'
    },
  },
  emits: [],
  setup(props: any, context: any) {
    const { lightArray, type } = toRefs(props)
    const formItem = reactive([
      {
        id: 'blackboardOne',
        name: '黑板灯1'
      },
      {
        id: 'blackboardTwo',
        name: '黑板灯2'
      },
      {
        id: 'blackboardThree',
        name: '黑板灯3'
      },
      {
        id: 'lampOne',
        name: '教室灯1'
      },
      {
        id: 'lampTwo',
        name: '教室灯2'
      },
      {
        id: 'lampThree',
        name: '教室灯3'
      },
      {
        id: 'lampFour',
        name: '教室灯4'
      },
      {
        id: 'lampFive',
        name: '教室灯5'
      },
      {
        id: 'lampSix',
        name: '教室灯6'
      },
      {
        id: 'lampSeven',
        name: '教室灯7'
      },
      {
        id: 'lampNine',
        name: '教室灯8'
      },
      {
        id: 'lampNight',
        name: '教室灯9'
      }
    ])
    const ruleFormRef = ref<any>({})
    let ruleForm = reactive({
      obj: {
        blackboardOne: props.lightArray[0] || 0,
        blackboardTwo:props.lightArray[1] || 0,
        blackboardThree:props.lightArray[2] || 0,
        lampOne:props.lightArray[3] || 0,
        lampTwo:props.lightArray[4] || 0,
        lampThree:props.lightArray[5] || 0,
        lampFour:props.lightArray[6] || 0,
        lampFive:props.lightArray[7] || 0,
        lampSix:props.lightArray[8] || 0,
        lampSeven:props.lightArray[9] || 0,
        lampNine:props.lightArray[10] || 0,
        lampNight:props.lightArray[11] || 0,
      }
    })
    watch(() => props.lightArray, (changeVal,oldVal) => {
      if (changeVal && changeVal.length > 0) {
        ruleForm.obj = {
          blackboardOne: changeVal[0],
          blackboardTwo:changeVal[1],
          blackboardThree:changeVal[2],
          lampOne:changeVal[3],
          lampTwo:changeVal[4],
          lampThree:changeVal[5],
          lampFour:changeVal[6],
          lampFive:changeVal[7],
          lampSix:changeVal[8],
          lampSeven:changeVal[9],
          lampNine:changeVal[10],
          lampNight:changeVal[11],
        }
      } else {
        ruleForm.obj = {
          blackboardOne: 0,
          blackboardTwo:0,
          blackboardThree:0,
          lampOne:0,
          lampTwo:0,
          lampThree:0,
          lampFour:0,
          lampFive:0,
          lampSix:0,
          lampSeven:0,
          lampNine:0,
          lampNight:0,
        }
      }
    })
    const getValue = () => {
      return {
        ...ruleForm.obj,
        light: [
          ruleForm.obj.blackboardOne,
          ruleForm.obj.blackboardTwo,
          ruleForm.obj.blackboardThree,
          ruleForm.obj.lampOne,
          ruleForm.obj.lampTwo,
          ruleForm.obj.lampThree,
          ruleForm.obj.lampFour,
          ruleForm.obj.lampFive,
          ruleForm.obj.lampSix,
          ruleForm.obj.lampSeven,
          ruleForm.obj.lampNine,
          ruleForm.obj.lampNight,
          ]
      }
    }
    return{
      formItem,
      ruleForm,
      ruleFormRef,
      getValue
    }
  }
}
</script>

<style lang="less" scoped>
  .lightMain{
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 20px;/*no*/
    .lightItem{
      width: calc(50% - 10px);/*no*/
      margin-bottom: 10px;/*no*/
      .title{
        font-size: 14px;/*no*/
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: left;
        color: #666666;
        margin-bottom: 5px;/*no*/
      }
      .slider{
        width: 100%;
        i{
          &.close{
            font-size: 16px;/*no*/
            color:#ECECEC;
          }
          &.open{
            font-size: 20px;/*no*/
            color:#31353E;
          }
        }
        &:deep(.el-slider){
          flex: 1;
          margin: 0 15px;/*no*/
        }
      }
    }
  }
</style>
