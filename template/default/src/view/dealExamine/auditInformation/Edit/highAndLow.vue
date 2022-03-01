<template>
  <dialog-content
    @on-cancel="canceledit"
    @on-close="canceledit"
    @on-open="openedit"
    :title="`${title}`"
    
    :visible.sync="editshow"
    ref="dialog"
    :dialogModel="dialogModel"
    :confirmShow="edit"
    :cancelShow="edit"
  >
    <div id="edits">
      <div class="content-bd">
        <el-form label-width="151px" status-icon>
          <wrapper title="基本情况">
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="宗地编号：" class="valueLine">
                  <span>{{ name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="交易方式：" class="valueLine">
                  <span>{{ transType }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="起始价：" class="valueLine">
                  <span>{{ beginPrice }}万元</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保证金：" class="valueLine">
                  <span>{{ ensure }}万元</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item :label="highAndLowPriceTitle" class="valueLine">
                  <span>{{ highAndLowPrice }}万元</span>
                </el-form-item>
              </el-col>
            </el-row>
          </wrapper>
        </el-form>
      </div>

      
    </div>
  </dialog-content>
</template>
<script>
import Wrapper from '@/components/wrapper';
import dialogContent from '@/components/dialog';
import { getTransTargetPriceDtl } from "@/api/dealExamine/auditInformation";
export default {
  components: {
    Wrapper,
    dialogContent
  },
  props: {
    id: '',
    type: '',
    show: '',
    dialogModel: true,
    data: '',
    status:'',
  },
  data () {
    return {
      title: '交易审核',
      editshow: false,
      inputDisabled: true,
      name: "",
      transType: "", //交易方式
      beginPrice: "",
      ensure: "", //保证金
      highAndLowPrice: "", //封顶价or底价
      highAndLowPriceTitle: "",
      dialog: {
        show: false
      },
      edit: true,
      editshow: false,
      curr_chengePriceId: '',
      curr_highOrLow: '',
      curr_status: ''
    };
  },
  watch: {
    data: {
      deep: true,
      handler (newval, oldval) {
        this.curr_chengePriceId = newval.id;
        this.curr_highOrLow = newval.highOrLow;
        this.curr_status = newval.status;
        this.edit = false;
        if (!this.dialogModel) {
          this.openedit()
        }
      }
    },
    show (val) {
      this.editshow = val;
      this.curr_chengePriceId = this.id;
      this.curr_highOrLow = this.highOrLow;
      this.curr_status = this.status;
    }
  },
  created () {
    this.infoData = this.data
    this.curr_chengePriceId = this.data.id;
    this.curr_highOrLow = this.data.highOrLow;
    this.curr_status = this.data.status;
    this.edit = false;
    this.openedit()
  },
  methods: {
    canceledit () {
      // if (this.$refs.multipleTable && this.$refs.multipleTable) {
      //   this.$refs.multipleTable.getPageTable();
      // }
      this.editshow = false;
      this.$emit('cancel');
      
      this.edit = true;
      this.editshow = false;
      this.curr_chengePriceId = '';
      this.curr_highOrLow = '';
      this.curr_status = '';

      this.$_resetForm();
    },
    openedit () {
      this.editshow = this.show;
      this.curr_chengePriceId = this.id || (this.data && this.data.id);
      this.curr_highOrLow = this.highOrLow || (this.data && this.data.highOrLow);
      this.curr_status = this.status || (this.data && this.data.status);
      this.edit = false;
      this.getTransTargetPriceDtl();
    },
    getTransTargetPriceDtl() {
      const id = this.curr_chengePriceId;
      let statusPrice = this.curr_status;
      getTransTargetPriceDtl(id).then(async result => {
        const resultData = result;
        if (resultData.code === "200") {
          this.name = resultData.data.name;
          this.transType = resultData.data.transTypeText;
          this.beginPrice = resultData.data.beginPriceText;
          this.ensure = resultData.data.earnestMoneyText;
          //审核业务类型（0限价/1底价）
          if(this.curr_highOrLow == '0'){
            //审核状态
            if(statusPrice == 1){
              this.highAndLowPrice = resultData.data.highPriceText;
              this.highAndLowPriceTitle = "待审核封顶价：";
            }else{
              this.highAndLowPrice = resultData.data.finalPriceText;
              this.highAndLowPriceTitle = "封顶价：";
            }
          }else{
            //审核状态
            if(statusPrice == 1){
              this.highAndLowPrice = resultData.data.lowPriceText;
              this.highAndLowPriceTitle = "待审核底价：";
            }else{
              this.highAndLowPrice = resultData.data.reservePriceText;
              this.highAndLowPriceTitle = "底价：";
            }
          }
        }
      });
    }
    
  }
};
</script>

<style lang="less" scoped>
#edits {
  .valueLine span {
    line-height: 35px !important;
  }
}
</style>
