<template>
  <div class="container">
    <header-title>
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
      />
    </header-title>
    <page-table
      :data="tableData"
      :cols="tableCols"
      col-align="left"
      operator
      operator-width="100"
      :page-current="page.current"
      :total="page.total"
      :page-size="page.pageSize"
    >
      <template slot-scope="scope" slot="operator">
        <el-button
          type="text"
          icon="iconfont icon-feeds-fill"
          title="详情"
          size="small"
          @click="toPage(scope.row)"
        >
        </el-button>

        <el-button
          type="text"
          icon="iconfont icon-xiugaii"
          title="编辑"
          @click="openDialogEdit({ id: scope.row.targetId, row: scope.row })"
          v-if="scope.row.canAdd === 1"
        >
        </el-button>
      </template>
    </page-table>
    <!-- 编辑封顶价 -->
    <dialog-cont
      @on-cancel="dialogData.editHighPrice = false"
      @on-close="dialogData.editHighPrice = false"
      width="500px"
      @on-confirm="editSure('dialogData')"
      :visible="dialogData.editHighPrice"
      :title="dialogData.title"
      class="dialogCont"
    >
      <div class="content-bd">
        <el-form
          :model="dialogData"
          :rules="rules"
          label-width="90px"
          ref="dialogData"
        >
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="原封顶价：">
                <span style="width:250px;line-height:35px;"
                  >{{ dialogData.oldValueText }}万元</span
                >
              </el-form-item>
              <el-form-item label="新封顶价：" prop="newValue">
                <el-input
                  type="number"
                  :min="1"
                  v-model="dialogData.newValue"
                  style="width:250px;"
                ></el-input>
                <span>万元</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </dialog-cont>
    <edit :show="editshow" :data="editdata" @cancel="closeEdit"></edit>
  </div>
</template>
<script>
import headerTitle from "@/components/headerTitle/headerTitle";
import searchForm from "components/searchForm/searchForm";
import pageTable from "@/components/page-table";
import dialogCont from "@/components/dialog";
import edit from "./highPriceDetail";
import {
  getPriceChangeLogList,
  savePriceChangeLog
} from "@/api/dealManagement/plowDealManagement/plowHighPriceMangeList";
import {
  getTransactionType,
  getBusinessType,
} from "@/api/dealManagement/plowDealManagement/common";
export default {
  name: "plow_high_price_mange_list",
  components: {
    headerTitle,
    searchForm,
    pageTable,
    dialogCont,
    edit
  },
  data() {
    return {
      searchVal: {
        no: "", // 宗地编号
        transType: "", // 交易方式
        businessType: "", // 交易类型
        goodsType: "501",
        // priceType:1,
        targetId: ""
      },
      searchItems: [
        {
          type: "input",
          label: "宗地编号",
          props: {
            placeholder: "请输入编号",
            fieldName: "no"
          }
        },
        {
          type: "select",
          label: "交易方式",
          props: {
            fieldName: "transType",
            placeholder: "交易方式选择",
            options: []
          }
        },
        {
          type: "select",
          label: "交易类型",
          props: {
            fieldName: "businessType",
            placeholder: "交易类型选择",
            options: []
          }
        }
      ],
      tableCols: [
        { label: "宗地编号", prop: "name", minWidth: 300 },
        { label: "起始价(万元)", prop: "beginPriceText", minWidth: 200, align: 'right' },
        { label: "增价幅度(万元)", prop: "priceStepText", minWidth: 200, align: 'right' },
        { label: "封顶价(万元)", prop: "finalPriceText", minWidth: 200, align: 'right' },
        { label: "录入时间", prop: "createDate", width: '180px' },
        { label: "状态", prop: "status", width: '80px' }
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      dialogData: {
        editHighPrice: false,
        title: "封顶价设置",
        highPriceInfo: {},
        newValue: "",
        oldValueText: "",
        oldValue: ""
      },
      // 验证
      rules: {
        newValue: [{ required: true, message: "该项为必填", trigger: "blur" }]
      },

      editshow: false,
      editdata: {}
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      this._getTransactionType();
      this._getBusinessType();
      this.getList();
    },
    /**
     * 获取交易方式下拉框数据
     */
    _getTransactionType() {
      this.searchItems[1].props.options = [];
      getTransactionType().then(res => {
        if (res.code === "200") {
          res.data.map(item => {
            this.searchItems[1].props.options.push({
              name: item.value,
              id: item.key
            });
          });
        }
        this.$forceUpdate();
      });
    },
    /**
     * 获取交易类型下拉框数据
     */
    _getBusinessType() {
      this.searchItems[2].props.options = [];
      getBusinessType().then(res => {
        if (res.code === "200") {
          res.data.map(item => {
            this.searchItems[2].props.options.push({
              name: item.value,
              id: item.key
            });
          });
        }
        this.$forceUpdate();
      });
    },
    onCurrentChange(val) {
      this.page.current = val;
      this.getList();
    },
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    /**
     * 查询
     */
    onSearch(val) {
      this.searchVal = {
        ...val,
        goodsType: "501"
        // priceType:1
      };
      this.page.current = 1;
      this.getList();
    },
    /**
     * 获取列表
     */
    getList() {
      const param = {
        data: this.searchVal,
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      getPriceChangeLogList(param).then(res => {
        const { data, total } = res.data;
        this.page.total = total;
        for (let i = 0; i < data.length; i++) {
          switch (data[i].status) {
            case 0:
              data[i].status = "草稿";
              break;
            case 1:
              data[i].status = "待审核";
              break;
            case 2:
              data[i].status = "审核通过";
              break;
            case 3:
              data[i].status = "审核不通过";
              break;
          }
        }
        this.tableData = data;
      });
    },
    /**
     * 打开编辑
     */
    openDialogEdit(info = {}) {
      this.dialogData.newValue = "";
      this.dialogData.editHighPrice = true;
      this.dialogData.title = info.row.name + "封顶价设置";
      this.dialogData.oldValueText = !info.row.finalPriceText ? "" : info.row.finalPriceText;
      this.dialogData.oldValue = !info.row.finalPrice ? "" : info.row.finalPrice;
      this.dialogData.highPriceInfo = info;
    },
    /**
     * 确定编辑弹窗
     */
    editSure(dialogData) {
      let params = {
        changeCause: "",
        newValue: Number(this.dialogData.newValue),
        oldValue: this.dialogData.oldValue,
        priceType: 1,
        targetId: this.dialogData.highPriceInfo.row.targetId
      };
      this.$refs[dialogData].validate(valid => {
        if (valid) {
          savePriceChangeLog(params).then(res => {
            if (res.code === "200") {
              this.getList();
              this.$notify({
                type: "success",
                title: "成功",
                message: "封顶价修改成功",
                position: "bottom-right"
              });
              this.dialogData.editHighPrice = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 查看详情
     */
    toPage(row) {
      this.editdata = {
        row: row,
        transType: this.searchVal.transType,
        businessType: this.searchVal.businessType
      };
      this.editshow = true;
    },
    closeEdit(type) {
      this.editshow = false;
      if (type === "cancel") {
        this.getList();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.container{
    >.comp-page-table{
    padding:0 20px;
    background: #fff;
  }
}
</style>
