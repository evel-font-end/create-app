<template>
  <div class="box">
    <wrapper title="附件">
      <template slot="header-right">
        <el-button
          type="text"
          icon="el-icon-plus"
          size="small"
        >
          新增附件目录
        </el-button>
      </template>
      <collapse accordion>
        <collapse-item
          v-for="(item, index) in 2"
          :title="`平面交易类型${index+1}`"
          :name="`${index+1}`"
          :key="`c-item-${index}`"
        >
          <page-table
            :data="tableData"
            :cols="tableCols"
            col-align="left"
            :show-page="false"
            operator
            operator-width="110"
          >
            <template
              slot-scope="scope"
              slot="operator"
            >
            <flex>
              <el-button type="text" size="small" :style="{marginRight: '10px'}">
                下载
              </el-button>
              <el-button type="text" size="small">
                删除
              </el-button>
            </flex>
            </template>
          </page-table>
          <flex justify="flex-end">
            <button class="upload-button">
              <i class="el-icon-top"></i>
              上传
            </button>
          </flex>
        </collapse-item>

      </collapse>
    </wrapper>
  </div>
</template>

<script>
import Flex from '@/components/flex'
import Wrapper from '@/components/wrapper';
import { Collapse, CollapseItem } from '@/components/collapse';
import PageTable from '@/components/page-table'

export default {
  name: 'BidAttachment',
  components: {
    Wrapper,
    Collapse,
    CollapseItem,
    PageTable,
    Flex
  },
  data () {
    return {
      tableData: Array.from({ length: 4 }, (v, i) => ({
        account: 6666660 + i + 1
      })),
      tableCols: [
        { label: '银行账号', prop: 'account' }
      ]
    }
  }
};
</script>

<style lang="less" scoped>
.box {
  padding: 20px !important;
  width: 100%;
  height: 100%;
  background: #e6e6e6 !important;

}
.upload-button {
  margin: 12px 30px;
  width:64px;
  height:28px;
  background:rgba(219,233,255,1);
  color:#065BDC;
  font-size: 14px;
  cursor: pointer;
}
</style>
