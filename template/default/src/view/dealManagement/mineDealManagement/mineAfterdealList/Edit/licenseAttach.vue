<template>
  <div class="box">
    <wrapper :title="title">
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
</template>
<script>
import Flex from "@/components/flex";
import Wrapper from "@/components/wrapper";
import { Collapse, CollapseItem } from "@/components/collapse";
import PageTable from '@/components/page-table';
import { attachList } from "api/common";
export default {
  name: "attach",
  components: {
    Flex,
    Wrapper,
    Collapse,
    CollapseItem,
    PageTable,
  },
  props: {
    id:"",
    title: {
      type: String,
      default: '附件目录'
    },
    api: {
      type: Function,
    }
  },
  data() {
    return {
      attachshow: false,
      inputDisabled: true,
      tableData: [],
      tableCols: [{ label: '文件名', prop: 'fileName' }],
      dialog: {
        show: false
      },
      attach: true,
      attachshow: false,
      curr_licenseId: "",
      attachDataList: []
    };
  },
  watch: {
    id: {
      deep: true,
      handler(val) {
        this.curr_licenseId = val;
        this.attach = false;
        this.reqAttach();
      }
    }
  },
  created() {
    this.curr_licenseId = this.id;
    this.attach = false;
    this.openattach();
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
      this.curr_licenseId = "";

      this.$_resetForm();
    },
    openattach() {
      this.attachshow = this.show;
      this.curr_licenseId = this.id || this.data.id;
      this.attach = false;
      this.reqAttach();
    },
    reqAttach() {
      const { curr_licenseId } = this;
      this.api(curr_licenseId).then(res => {
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
.box{
  margin-bottom: 20px;
}
</style>
