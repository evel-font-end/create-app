<template>
  <div class="placesForm">
    <DialogCont
      @on-cancel="canceledit('close')"
      @on-close="canceledit('close')"
      @on-confirm="confirmedit"
      @on-open="openedit"
      :title="`${title}`"
      width="1200px"
      :visible="baseInfo.show"
      ref="dialog"
      customClass="flexColumn placesFormDialog"
    >
      <div class="flexColumn makeList">
        <div
          v-for="(makeItem, makeIndex) in (new Array(+baseInfo.propItemData.count).fill('1'))"
          :key="`makeItem${makeIndex}`"
          class="flexRow makeItem"
        >
          <div class="flexCenter icon"><i class="iconfont icon-weixiu" /></div>
          <div class="flexColumn makeInfo">
            <div class="flexRow titleInfo">
              <div class="name">{{ baseInfo.propItemData.name }}</div>
              <div class="classic">{{ baseInfo.propItemData.alarmTime }}</div>
            </div>
            <FormItem
              :ref="`formItem${makeIndex}`"
              :formItems="baseInfo.formItems"
              :rules="baseInfo.formRules"
              :form="baseInfo.form[makeIndex]"
              @change="(val) => handleFormChange(val, makeIndex)"
              labelWidth="85px"
            />
          </div>
        </div>
      </div>
      <div class="title"><i class="iconfont icon-lishijilu" />历史记录</div>
      <page-table
        col-align="center"
        :operator="false"
        :data="baseInfo.tableData"
        :cols="historyTableCols"
        :page-current="baseInfo.page.current"
        :total="baseInfo.page.total"
        :page-size="baseInfo.page.pageSize"
        @current-change="onCurrentChange"
        :showPage="true"
      >
      </page-table>
    </DialogCont>
  </div>
</template>
<script lang="ts">
import {
  ref,
  toRefs,
  reactive,
  onMounted,
  defineComponent,
  watch,
  getCurrentInstance,
} from "vue";
 import { ElNotification } from 'element-plus';
import DialogCont from "@/components/dialog/Dialog.vue";
import PageTable from "@/components/adminPage-table";
import FormItem from "@/components/adminFormItem";
import { getQueryRepair, addRepair } from "@/api/breakDown";
export default {
  name: "placesForm",
  components: {
    DialogCont,
    PageTable,
    FormItem,
  },
  props: {
    title: {
      type: String,
      default: "维修处理记录",
    },
    show: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["cancel"],
  setup(props: any, context: any) {
    const { show, title, type, dialogType } = toRefs(props);
    const tableCols = reactive([
      {
        label: "班级",
        prop: "classroomName",
      },
      {
        label: "维修记录",
        prop: "serialNumber",
      },
      {
        label: "维修时间",
        prop: "deviceModuleName",
      },
      {
        label: "问题描述",
        prop: "a",
        custom: true,
      },
      {
        label: "处理意见",
        prop: "b",
        custom: true,
      },
    ]);
    const historyTableCols = reactive([
      {
        label: "班级",
        prop: "classRoom",
      },
      {
        label: "维修记录",
        prop: "repairResult",
      },
      {
        label: "维修结果",
        prop: "deviceModuleName",
      },
      {
        label: "维修时间",
        prop: "repairTime",
      },
      {
        label: "问题描述",
        prop: "description",
      },
      {
        label: "处理意见",
        prop: "opinion",
      },
    ]);
    let baseInfo: any = reactive({
      show,
      formItems: [
        {
          label: "维修记录",
          prop: "repairResult",
          inputType: "input",
          required: true,
          span: 8,
        },
        {
          label: "问题描述",
          prop: "description",
          inputType: "input",
          required: true,
          span: 8,
        },
        {
          label: "处理意见",
          prop: "opinion",
          inputType: "input",
          required: true,
          span: 8,
        },
      ],
      formRules: {
        ruleName: [{ required: true, trigger: "change" }],
      },
      form: [],
      propItemData: {},
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      siteId: "",
    });
    const formItem = ref<any>({});
    const onCurrentChange = (val: number) => {
      baseInfo.page.current = val;
      getQueryRepairData(baseInfo.siteId);
    };
    const getQueryRepairData = (siteId: string | number) => {
      let params = {
        data: {
          siteId,
        },
        pageNo: baseInfo.page.current,
        pageSize: baseInfo.page.pageSize,
      };
      getQueryRepair(params).then((res: any) => {
        if (res.code === "200") {
          const { data, total } = res.data;
          baseInfo.tableData = data;
          baseInfo.page.total = total;
        }
      });
    };
    watch(
      () => props.item,
      (newValue, oldValue) => {
        new Array()
        baseInfo.propItemData = newValue;
        baseInfo.siteId = newValue.siteId;
        getQueryRepairData(baseInfo.siteId);
      }
    );
    onMounted(() => {
      //  console.log('mounted!')
    });
    const openedit = () => {};
    const canceledit = (type: string) => {
      context.emit("cancel", type);
    };
    const handleFormChange = (val: any, index: number) => {
      console.log(val)
      console.log(index)
      baseInfo.form[index] = {
        ...baseInfo.form[index],
        ...val
      };
    }
    const confirmedit = async () => {
      const formItems = baseInfo.form.map((formItem: any) => {
        return {
          classRoom: baseInfo.siteId,
          ...formItem
        }
      })
      const parames = {
        className: baseInfo.propItemData.name,
        repair: [
          ...formItems
        ],
        siteId: baseInfo.siteId,
      }
      addRepair(parames).then((res: any) => {
        if (res && res.code === '200') {
          ElNotification({
            title: '成功',
            message: '新增维修记录成功',
            type: 'success',
            position: 'bottom-right'
          });
          canceledit('cancel')
        }
      })
    };
    return {
      baseInfo,
      tableCols,
      historyTableCols,
      openedit,
      canceledit,
      confirmedit,
      getQueryRepairData,
      onCurrentChange,
      handleFormChange,
      formItem
    };
  },
};
</script>

<style lang="less" scoped>
.placesForm {
  padding-bottom: 20px; /*no*/
  .makeList {
    margin-bottom: 10px;/*no*/
    .makeItem {
      width: 100%;
      align-items: center;
      margin-bottom: 10px;/*no*/
      .icon {
        width: 64px; /*no*/
        height: 64px; /*no*/
        margin-right: 20px; /*no*/
        background: #3f5cc5;
        border-radius: 50%;
        i {
          color: #fff;
          font-size: 30px; /*no*/
        }
      }
      .makeInfo {
        flex: 1;
        .titleInfo {
          justify-content: space-between;
          margin-bottom: 5px; /*no*/
          .name {
            font-size: 18px; /*no*/
            font-family: PingFangSC, PingFangSC-Semibold;
            font-weight: 600;
            text-align: left;
            color: #353535;
            line-height: 25px; /*no*/
          }
          .classic {
            font-size: 18px; /*no*/
            font-family: PingFangSC, PingFangSC-Semibold;
            font-weight: 600;
            text-align: left;
            color: #353535;
            line-height: 25px; /*no*/
          }
        }
        &:deep(.el-form-item){
          margin-bottom: 0 !important;
        }
        .fixedMake {
          font-size: 14px; /*no*/
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: left;
          color: #31353e;
          line-height: 20px; /*no*/
          margin-bottom: 5px; /*no*/
        }
      }
    }
  }
  .title {
    font-size: 18px; /*no*/
    font-family: PingFangSC, PingFangSC-Semibold;
    font-weight: 600;
    text-align: left;
    color: #353535;
    line-height: 25px; /*no*/
    margin-bottom: 18px; /*no*/
    i {
      font-size: 21px; /*no*/
      color: #3f5cc5;
      margin-right: 10px; /*no*/
    }
  }
}
</style>
