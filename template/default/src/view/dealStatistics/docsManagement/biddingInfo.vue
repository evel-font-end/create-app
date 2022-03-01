<template>
  <dialog-cont
    @on-cancel="canceledit('close')"
    @on-close="canceledit('close')"
    @on-confirm="canceledit('close')"
    @on-open="openedit"
    :title="`${title}`"
    :visible.sync="editshow"
    ref="dialog"
    :append-to-body="appendToBody"
    className="bidding_info"
  >
    <div class="info">
      <page-table
        col-align="left"
        :data="tableData"
        :cols="tableCols"
        :showPage="false"
        tableHeight="340px"
      >
        <!-- sortByBack -->
      </page-table>
    </div>
  </dialog-cont>
</template>

<script>
import dialogCont from "@/components/dialog";
import PageTable from "@/components/page-table";

import { formatDate } from "@/util/tool";
import {
  toThousands,
  toChinese,
  agreeLotteryText,
  lotteryTip,
  titleInfos,
  Ball,
  landBusinessTypeList,
  plowBusinessTypeList,
  plowPriceList,
  symbolText,
} from "../utils";

//
export default {
  name: "biddingInfo",
  components: {
    dialogCont,
    PageTable,
  },
  props: {
    data: {},
    show: "",
    appendToBody: false,
  },
  data() {
    return {
      title: "竞价记录",
      editshow: false,
      editData: {},
      tableCols: [
        { label: "竞买人", prop: "bidderName", minWidth: "150px" },
        {
          label: "出价时间",
          prop: "offerDate",
          minWidth: "120px",
          render: (h, scope) => {
            return (
              <div>
                {formatDate(new Date(scope.row.offerDate), "yyyy-MM-dd hh:mm:ss")}
              </div>
            );
          },
        },
        {
          label: "竞买出价",
          prop: "priceText",
          minWidth: "150px",
          render: (h, scope) => {
            return (
              <div style="color: #F98943;font-family:Microsoft YaHei;">
                {scope.row.price}
                {this.symbol}
              </div>
            );
          },
        },
        {
          label: "出价类型",
          prop: "typeText",
        },
      ],
      tableData: [],
      symbol: "万元",
    };
  },
  computed: {},
  watch: {
    show(val) {
      this.editshow = val;
    },
    data(val) {
      this.editData = val;
      this.detailshow = true;
      this.tableData = val.data;
    },
  },
  methods: {
    openedit() {},
    closeedit() {
      this.editshow = false;
      this.editData = {};
    },
    canceledit(type) {
      this.closeedit();
      this.$emit("cancel", type);
    },
  },
  created() {},
};
</script>

<style lang="less">
.info {
  // padding: 20px 0 0 0;
}
</style>
