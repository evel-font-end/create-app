<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-open="openedit"
    :title="`${title}`"
    
    :visible.sync="editshow"
    ref="dialog"
    :confirmShow="edit"
    :cancelShow="edit"
    :bottomShow="edit"
  >
    <div id="price_details">
      <div class="content-bd">
        <el-form label-width="151px" status-icon>
          <wrapper title="基本情况" className="comDetails">
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="宗地编号：" class="valueLine">
                  <span>{{ detailData.name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="detailData.status" class="valueLine">
                  <span>{{ detailData.finalPrice }}万元</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="起始价：" class="valueLine">
                  <span>{{ detailData.beginPrice }}万元</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="增价幅度：" class="valueLine">
                  <span>{{ detailData.priceStep }}万元</span>
                </el-form-item>
              </el-col>
            </el-row>
          </wrapper>
          <wrapper title="封顶价设置历史记录">
            <el-row :gutter="5">
              <el-col :span="24">
                <page-table
                  col-align="left"
                  :data="detailData.tableData"
                  :cols="tableCols"
                  :page-current="page.current"
                  :total="page.total"
                  :page-size="page.pageSize"
                  @current-change="onCurrentChange"
                  @size-change="onPageSizeChange"
                >
                </page-table>
              </el-col>
            </el-row>
          </wrapper>
        </el-form>
      </div>
    </div>
  </dialog-cont>
</template>
<script>
import Wrapper from "@/components/wrapper";
import PageTable from "@/components/page-table";
import dialogCont from "@/components/dialog";
import { getHistoryList } from "@/api/dealManagement/highPriceMangeList";
export default {
  name: "highPriceDetail",
  components: {
    Wrapper,
    PageTable,
    dialogCont
  },
  props: {
    data: {},
    show: ""
  },
  data() {
    return {
      title: "限价管理详情",
      edit: false,
      editshow: false,
      row: null,
      initAttachData: null,
      detailData: {
        name: "",
        transType: "",
        businessType: "",
        targetId: "",
        finalPrice: "",
        beginPrice: "",
        priceStep: "",
        status: "",
        tableData: []
      },
      tableCols: [
        { label: "原封顶价(万元)", prop: "oldValue", minWidth: 200, align: 'right' },
        { label: "新封顶价(万元)", prop: "newValue", minWidth: 200, align: 'right' },
        { label: "录入时间", prop: "createDate", minWidth: 180 },
        { label: "提交人", prop: "username", width: '100px' }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  watch: {
    show(val) {
      this.detailData.name = this.data.row.name;
      this.detailData.transType = this.data.transType;
      this.detailData.businessType = this.data.businessType;
      this.detailData.targetId = this.data.row.targetId;
      this.detailData.beginPrice = this.data.row.beginPriceText;
      this.detailData.priceStep = this.data.row.priceStepText;
      this.editshow = val;
      this.detailData.status = "封顶价：";
      this.detailData.finalPrice = this.data.row.newValue;
    }
  },
  methods: {
    // 打开弹窗
    openedit() {
      this.historyList();
    },
    canceledit(type) {
      this.editshow = false;
      this.editData = {};
      this.$emit("cancel", type);
    },
    onPageSizeChange(val) {
      this.$emit("size-change", val);
    },
    onCurrentChange(val) {
      this.$emit("current-change", val);
    },
    historyList() {
      const param = {
        data: {
          no: this.detailData.name, // 宗地编号
          transType: !this.detailData.transType
            ? ""
            : this.detailData.transType, // 交易方式
          businessType: !this.detailData.businessType
            ? ""
            : this.detailData.businessType, // 交易类型
          goodsType: "101",
          // priceType:1,
          targetId: this.detailData.targetId
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      getHistoryList(param).then(res => {
        const { data, total } = res.data;
        this.page.total = total;
        this.detailData.tableData = data;
      });
    }
  }
};
</script>

<style lang="less" scoped>
#price_details {
  background: #e6e6e6 !important;
  .valueLine span {
    line-height: 14px !important;
  }
  /deep/.comDetails{
    >.comp-wrapper-content{
      padding: 20px 0 0px !important;
      .el-form-item__label,
      .el-form-item__content{
        line-height: 14px;
      }
    }
  }
  // /deep/.el-row:first-child {
  //   padding-bottom: 0px;
  // }
  /deep/.el-form-item{
    margin-bottom: 12px;
  }
}
</style>
