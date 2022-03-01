<template>
  <dialog-content
    @on-cancel="cancelattach"
    @on-close="cancelattach"
    @on-open="openattach"
    :title="`${title}`"
    
    :visible.sync="attachshow"
    ref="dialog"
    :dialogModel="dialogModel"
    :confirmShow="attach"
    :cancelShow="attach"
  >
    <div id="edits">
      <div class="box">
        <wrapper title="附件目录">
          <collapse @item-click="itemClick" accordion>
            <collapse-item
              v-for="(item, index) in tableData"
              :title="item.name"
              :name="item.id"
              :key="`c-item-${index}`"
            >
              <page-table
                :data="attachDataList[item.id]"
                :cols="tableCols"
                col-align="left"
                :show-page="false"
                operator
                operator-width="110"
              >
                <template slot-scope="scope" slot="operator">
                  <flex>
                    <a
                      :href="
                        `/api/fileupload/download?fileCode=${scope.row.fileCode}`
                      "
                    >
                      <el-button
                        type="text"
                        size="small"
                        :style="{ marginRight: '10px' }"
                        >下载</el-button
                      >
                    </a>
                  </flex>
                </template>
              </page-table>
            </collapse-item>
          </collapse>
        </wrapper>
      </div>
    </div>
  </dialog-content>
</template>
<script>
import Flex from "@/components/flex";
import Wrapper from "@/components/wrapper";
import { Collapse, CollapseItem } from "@/components/collapse";
import PageTable from '@/components/page-table';
import dialogContent from "@/components/dialog";
import { getLandTargetAttach } from "@/api/dealManagement/updatedealList";
import { attachList } from "api/common";
export default {
  name: "attach",
  components: {
    Flex,
    Wrapper,
    Collapse,
    CollapseItem,
    PageTable,
    dialogContent
  },
  props: {
    id: "",
    show: "",
    dialogModel: true,
    data: ""
  },
  data() {
    return {
      title: "交易审核",
      attachshow: false,
      inputDisabled: true,
      tableData: [],
      tableCols: [{ label: '文件名', prop: 'fileName' }],
      dialog: {
        show: false
      },
      attach: true,
      attachshow: false,
      curr_attachId: "",
      attachDataList: []
    };
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.curr_attachId = val.id;
        this.attach = false;
        // if (!this.dialogModel) {
        //   this.openattach();
        // }
      }
    },
    show(val) {
      this.attachshow = val;
      this.curr_attachId = this.id;
    }
  },
  created() {
    // console.log(this.data);
    this.curr_attachId = this.data.id;
    this.attach = false;
    // this.openattach();
  },
  methods: {
    itemClick(val) {
      const name = val.name;
      if (!this.attachDataList[name]) {
        this.getAttachList(name);
      }
    },
    getAttachList(id) {
      attachList(id).then(res => {
        if (res.code === "200") {
          this.$set(this.attachDataList, id, res.data);
        }
      });
    },
    cancelattach() {
      this.attach = true;
      this.attachshow = false;
      this.$emit("cancel");
      this.curr_attachId = "";

      this.$_resetForm();
    },
    openattach() {
      this.attachshow = this.show;
      this.curr_attachId = this.id || (this.data && this.data.id);
      this.attach = false;
      this.reqAttach();
    },
    reqAttach() {
      const { curr_attachId } = this;
      getLandTargetAttach(curr_attachId).then(res => {
        if (res.code === "200") {
          this.tableData = res.data;
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
