<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    :title="`${title}`"
    :visible.sync="editshow"
    ref="dialog"
    :confirmShow="edit || (data.row && data.row.canPush === 1) || (editData && editData.canStamp === 1)"
    :confirmText="(data.row && data.row.canPush === 1) ? '受理' : (editData.canStamp === 1 ? '审核通过' : '确定')"
    :cancelShow="edit"
    append-to-body
  >
    <div id="details" class="minTradeListDetail">
      <Entrust ref="entrust" @success="val => getEntrast(val)" :show="show" :data="{ ...data, ...trust}"/>
      <div class="content-bd">
          <el-form ref="formData" :rules="rules" :model="formData" label-width="150px" status-icon>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span><em></em>基本情况</span>
              </div>
              <el-row :gutter="5">
                <el-col :span="12">
                    <el-form-item label="矿区名称："  prop="no">
                      <el-input :disabled="!edit" v-model="formData.no" placeholder="请输入矿区名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="有效年限：" prop="useYears">
                    <el-input :disabled="!edit" v-model="formData.useYears" placeholder="请输入有效年限"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="矿区位置："  prop="address">
                      <el-input :disabled="!edit" v-model="formData.address" placeholder="请输入矿区位置"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                    <el-form-item label="矿区面积："  prop="mineralArea">
                      <el-input :disabled="!edit" v-model="formData.mineralArea" placeholder="请输入矿区面积">
                        <!-- <template slot="append">平方公里</template> -->
                      </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="矿种：" prop="goodsUse">
                    <el-input :disabled="!edit" v-model="formData.goodsUse" placeholder="请输入矿种"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12" v-if="option === '探矿权'">
                    <el-form-item label="可采储量："  prop="storage">
                      <el-input :disabled="!edit" v-model="formData.storage" placeholder="请输入可采储量">
                      </el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <el-form-item label="交易类型：" prop="businessType">
                    <el-select
                      v-model="formData.businessType"
                      placeholder="请选择交易类型"
                      @change="changeBusinessType"
                      clearable
                      :disabled="!edit"
                      filterable
                      allow-create
                      default-first-option
                    >
                      <el-option
                        v-for="optionItem in common.mineBusinessType"
                        :key="optionItem.id"
                        :label="optionItem.name || optionItem.text"
                        :value="optionItem.id"
                        
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="区域：" prop="cantonId">
                    <el-select
                      v-model="formData.cantonId"
                      placeholder="请选择区域"
                      clearable
                      :disabled="!edit"
                    >
                      <el-option
                        v-for="optionItem in common.contentOption"
                        :key="optionItem.id"
                        :label="optionItem.name || optionItem.text"
                        :value="optionItem.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5" v-if="option === '采矿权'">
                <el-col :span="12">
                    <el-form-item label="开采标高："  prop="mineralLevel1">
                      <el-input :disabled="!edit" v-model="formData.mineralLevel1" placeholder="请输入开采标高"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="保有储量：" prop="mineralStorage">
                    <el-input :disabled="!edit" v-model="formData.mineralStorage" placeholder="请输入保有储量"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5" v-if="option === '采矿权'">
                <el-col :span="12">
                    <el-form-item label="开采方式："  prop="mineralMethods">
                      <el-input :disabled="!edit" v-model="formData.mineralMethods" placeholder="请输入开采方式"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="矿区坐标："  prop="mineralCoordinate">
                      <el-input :disabled="!edit"
                        v-model="formData.mineralCoordinate"
                        placeholder="请输入矿区坐标"
                      ></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="投资总额："  prop="aggregateInvestment">
                      <el-input :disabled="!edit" v-model="formData.aggregateInvestment" placeholder="请输入投资总额"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="交付条件："  prop="abandonTerm">
                      <el-input :disabled="!edit" v-model="formData.abandonTerm" placeholder="请输入交付条件"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="备注："  prop="remark">
                      <el-input :disabled="!edit" v-model="formData.remark" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                    <el-form-item label="视频地址："  prop="mineralVideo">
                      <el-input :disabled="!edit" v-model="formData.mineralVideo" placeholder="请输入视频地址"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="地图地址："  prop="mineralMap">
                      <el-input :disabled="!edit" v-model="formData.mineralMap" placeholder="请输入地图地址"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5" v-if="option === '采矿权'">
                <el-col :span="24">
                    <el-form-item label="生产规模："  prop="mineralProductionScale">
                      <el-input :disabled="!edit" v-model="formData.mineralProductionScale" placeholder="请输入生产规模"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="以往地质工作："  prop="oldGeologicalWork">
                      <el-input :disabled="!edit" v-model="formData.oldGeologicalWork" placeholder="请输入以往地质工作"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="地质状况："  prop="mineralSituation">
                      <el-input :disabled="!edit" v-model="formData.mineralSituation" placeholder="请输入地质状况"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="评估人："  prop="mineralEvaluator">
                      <el-input :disabled="!edit" v-model="formData.mineralEvaluator" placeholder="请输入评估人"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="24">
                    <el-form-item label="其他内容："  prop="mineralOther">
                      <el-input
                        :disabled="!edit"
                        v-model="formData.mineralOther"
                        placeholder="请输入其他内容"
                        type="textarea"
                        :autosize="{
                          minRows: 3
                        }"
                      ></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5" v-if="option === '采矿权'">
                <el-col :span="24">
                    <el-form-item label="其他："  prop="mineralOther">
                      <el-input :disabled="!edit" v-model="formData.mineralOther" placeholder="请输入其他"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span><em></em>价款信息</span>
              </div>
              <el-row :gutter="5">
                <el-col :span="12">
                  <el-form-item label="起始价(万元)：" prop="beginPrice">
                    <el-input-number
                      controls-position="right"
                      type="number"
                      :precision="4"
                      :disabled="!edit"
                      v-model="formData.beginPrice"
                      :placeholder="`请输入起始价(万元)`"
                      style="width: 100%"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="加价幅度(万元)：" prop="priceStep">
                    <el-input-number
                      controls-position="right"
                      type="number"
                      :precision="4"
                      :disabled="!edit"
                      v-model="formData.priceStep"
                      :placeholder="`请输入加价幅度(万元)`"
                      style="width: 100%"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="12">
                  <el-form-item label="保证金(万元)：" prop="earnestMoney">
                    <el-input-number
                      controls-position="right"
                      type="number"
                      :precision="4"
                      placeholder="0.0000"
                      :step="0.0001"
                      :disabled="!edit"
                      v-model="formData.earnestMoney"
                      style="width: 100%"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                  <el-form-item label="是否设置底价(万元)：" prop="hasReservePrice">
                    <div class="flexRow radioGroupInput">
                      <el-radio-group v-model="formData.hasReservePrice" :disabled="!edit">
                        <el-radio
                          v-for="(radioOption, rIndex) in reservePriceOptions"
                          :key="`${radioOption.value}-${rIndex}-rop`"
                          :label="radioOption.value || radioOption.id"
                        >
                        {{radioOption.label}}
                        </el-radio>
                      </el-radio-group>
                      <el-input-number
                        v-model="formData.reservePrice"
                        v-if="reservePriceShow"
                        :disabled="!edit"
                        controls-position="right"
                        :precision="4"
                      />
                    </div>
                  </el-form-item>
                </el-col> -->
              </el-row>
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span><em></em>附件</span>
                <div class="addFJ">
                  <el-button
                      type="text"
                      icon="el-icon-plus"
                      size="small"
                      @click="dialog.addAttach = true"
                      v-if="(!(edit === false && !!row))"
                    >
                      新增附件目录
                    </el-button>
                </div>
              </div>
              <div class="box">
                <collapse :value="activeName" @item-click="itemClick" accordion>
                  <collapse-item
                    v-for="(item, index) in attachData"
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
                      <template
                        slot-scope="scope"
                        slot="operator"
                      >
                      <flex>
                        <a :href="`/api/fileupload/download?fileCode=${scope.row.fileCode}`">
                          <el-button type="text" size="small" :style="{marginRight: '10px'}">
                            下载
                          </el-button>
                        </a>
                        <el-button type="text" size="small" @click.prevent.stop="singAction('delete', {
                          fileCode: scope.row.fileCode,
                          id: item.id
                        })" v-if="(!(edit === false && !!row))">
                          删除
                        </el-button>
                      </flex>
                      </template>
                    </page-table>
                    <flex justify="flex-end" v-if="(!(edit === false && !!row)) || (item.isUpload === 1)">
                      <button class="upload-button" @click.prevent.stop="dialog.importFile = true; dialog.uploadId=item.id">
                        <i class="el-icon-top"></i>
                        上传
                      </button>
                    </flex>
                  </collapse-item>
                </collapse>
              </div>
            </el-card>
            <!-- <div class="btnInfo text-center mt-10" :style="{display: edit ? 'flex' : 'none'}">
              <el-button class="resetBtn" size="small" @click="$_resetForm">取消</el-button>
              <el-button
                size="small"
                type="primary"
                class="submitBtn"
                @click="submitForm(1)"
                :disabled="$_loading"
              >确定</el-button>
            </div> -->
          </el-form>
          <dialog-cont
            @on-cancel="dialog.importFile=false"
            :visible.sync="dialog.importFile"
            :confirmShow="false"
            :cancelShow="false"
            title="上传"
            width="500px"
            append-to-body
          >
            <upload
              ref="upload"
              postUrl="#"
              :fileLists="uploadFileList"
              :multiple="true"
              @change="uploadChange"
              @remove="uploadRemove"
              @submit="uploadSubmit"
              @beforeUpload="beforeUpload"
            ></upload>
          </dialog-cont>
          <dialog-cont
            @on-cancel="dialog.addAttach=false"
            @on-confirm="attachSubmit"
            :visible.sync="dialog.addAttach"
            title="新增附件目录"
            width="500px"
            append-to-body
          >
            <el-form ref="attachModel" :model="attachModel" :rules="attachRules" label-width="150px" status-icon>
              <el-form-item label="附件目录名称：">
                <el-input v-model="attachModel.name" placeholder="请输入附件目录名称"></el-input>
              </el-form-item>
            </el-form>
          </dialog-cont>
      </div>
    </div>
  </dialog-cont>
</template>
<script>
import Flex from '@/components/flex'
import Wrapper from '@/components/wrapper';
import { Collapse, CollapseItem } from '@/components/collapse';
import Entrust from './entrust';
import PageTable from '@/components/page-table';
import dialogCont from '@/components/dialog';
import upload from '@/components/upload/upload';
import {
  getTradeList,
  MineProspecting,
  getTransMineGoods,
  saveTransMineProspecting,
  saveTransMine
} from '@/api/tradeList';
import {
  initMineTargetAttach,
  mineTargetAttach,
  attachList,
  upload as uploadRequest,
  saveAttach,
  deleteFileByFileCode,
  fileDownload,
  selectListByParentCode,
  stampNotice
} from '@/api/common';
import {
  TRADE_TYPE_OPTIONS
} from '@/util/constants';
import {
  applyTrust,
  detail,
  commitTrust
} from '@/api/mineManagement/tradeList';
import { mapGetters, mapMutations } from 'vuex';
import commonApi from '@/mixins/commonApi';

const method = {
  '探矿权': {
    'get': MineProspecting,
    'save': saveTransMineProspecting
  },
  '采矿权': {
    'get': getTransMineGoods,
    'save': saveTransMine
  }
};
export default {
  components: {
    Wrapper,
    Collapse,
    CollapseItem,
    PageTable,
    Flex,
    upload,
    dialogCont,
    Entrust
  },
  props: {
    data: {},
    show: ''
  },
  mixins: [commonApi()],
  data () {
    const { configType } = this.data;
    return {
      title: '新增矿区',
      inputDisabled: configType === 'look',
      isAdd: !this.data.targetId,
      activeName: null,
      formItem: [[{
        label: '矿区名称',
        props: 'no'
      }, {
        label: '年限',
        props: 'useYears'
      }], [{
        label: '矿区位置',
        props: 'address'
      }], [{
        label: '矿区面积',
        props: 'mineralArea',
        export: <template slot="append">平方公里</template>
      }, {
        label: '矿种',
        props: 'goodsUse'
      }], [{
        label: '开采标高',
        props: 'mineralLevel1'
      }, {
        label: '保有储量',
        props: 'mineralStorage'
      }], [{
        label: '开采方式',
        props: 'mineralMethods',
        span: 11
      }], [{
        label: '矿区坐标',
        props: 'mineralCoordinate',
        type: 'textarea'
      }], [{
        label: '投资总额',
        props: 'aggregateInvestment'
      }], [{
        label: '交付条件',
        props: 'abandonTerm'
      }], [{
        label: '生产规模',
        props: 'mineralProductionScale'
      }], [{
        label: '以往地质工作',
        props: 'oldGeologicalWork'
      }], [{
        label: '地质概括',
        props: 'mineralSituation'
      }], [{
        label: '其他',
        props: 'mineralOther'
      }]],
      formData: {
        no: '',
        useYears: '',
        address: '',
        mineralArea: '',
        goodsUse: '',
        mineralLevel1: '',
        mineralStorage: '',
        mineralMethods: '',
        mineralCoordinate: '',
        aggregateInvestment: '',
        abandonTerm: '',
        mineralProductionScale: '',
        oldGeologicalWork: '',
        mineralSituation: '',
        mineralOther: '',
        mineralVideo: '',
        mineralMap: '',
        mineralEvaluator: '',
        storage: '',
        cantonId: '',
        remark: '',
        beginPrice: undefined,
        priceStep: undefined,
        earnestMoney: undefined,
        // hasReservePrice: 1,
        reservePrice: undefined
      },
      attachModel: {
        name: ''
      },
      attachRules: {
        name: [
          { required: true, message: '请输入附件目录名称', trigger: 'change' }
        ]
      },
      rules: {
        no: [
          { required: true, message: '请输入矿区名称', trigger: 'change' }
        ],
      mineralSituation: [
          { required: true, message: '请输入地质状况', trigger: 'change' }
        ],
        businessType: [
          { required: true, message: '请输入交易类型', trigger: 'change' }
        ],
        useYears: [
          { required: true, message: '请输入年限', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入矿区位置', trigger: 'change' }
        ],
        mineralArea: [
          { required: true, message: '请输入矿区面积', trigger: 'change' }
        ],
        goodsUse: [
          { required: true, message: '请输入矿种', trigger: 'change' }
        ],
        earnestMoney: [
          { required: true, message: '请输入保证金金额', trigger: ['blur', 'change'] }
        ],
        beginPrice: [
          { required: true, message: '请输入起始价', trigger: ['blur', 'change'] }
        ],
        priceStep: [
          { required: true, message: '请输入加价幅度', trigger: ['blur', 'change'] }
        ],
        // hasReservePrice: [
        //   { required: true, message: '请输入是否设置底价', trigger: ['blur', 'change'] }
        // ]
      },
      edit: true,
      editshow: false,
      row: null,
      initAttachData: null,
      tableCols: [
        { label: '文件名', prop: 'fileName' }
      ],
      attachData: [],
      attachDataList: {},
      dialog: {
        importFile: false, // 上传
        title: '附件', // 弹窗标题
        uploadId: null,
        addAttach: false
      },
      uploadFileList: [],
      option: this.data.option,
      editData: {},
      trust: {},
      goods: {},
      target: {},
      option: this.data.option ? this.data.option : '探矿权',
      reservePriceShow: true,
      reservePriceOptions: [{
        label: '设置',
        id: 1
      }, {
        label: '不设置',
        id: 0
      }]
    };
  },
  watch: {
    show (val) {
      const { configType, row, option } = this.data;
      this.editshow = val;
      this.row = row;
      this.option = option;
      if (configType === 'look') {
        this.edit = false;
      } else {
        this.edit = true;
      }
    },
    formData: {
      deep: true,
      handler (val, old) {
        const inputShow = (this.data.configType === 'look' && !!this.data.reservePrice) || (this.data.configType !== 'look' && val.hasReservePrice === 1);
        this.reservePriceShow= inputShow;
      }
    }
    // '$route.query': {
    //   deep: true,
    //   immediate: true,
    //   handler: function (to, from) {
    //     if (to.hasOwnProperty('row')) {
    //       this.row = to.row;
    //       this.option = to.option;
    //       const apiMethod = method[to.row.goodsType]['get'];
    //       apiMethod(to.row.id).then(res => {
    //         if (res.code === '200') {
    //           this.formData = res.data;
    //         }
    //       });
    //       if (to.type === 'look') {
    //         this.edit = false;
    //       }
    //     }
    //   }
    // }
  },
  created () {
    // this.editshow = this.show;
    // if (!this.data.row) {
    //   this.init()
    // } else {
    //   this.initAttachData = this.data.row.id;
    //   this.getGoodsAttach(this.data.row.id);
    // }
  },
  computed: {
    ...mapGetters(['common'])
  },
  methods: {
    ...mapMutations([
      'set_common'
    ]),
    openedit () {
      const { configType } = this.data;
      // this.getContent();
      this.editshow = this.show;
      this.inputDisabled = configType === 'look'
      if (!this.data.row) {
        this.init({});
        if (this.$refs.formData) {
          this.$refs.formData.resetFields();
        }
        this.formData = {
          no: '',
          useYears: '',
          address: '',
          mineralArea: '',
          goodsUse: '',
          mineralLevel1: '',
          mineralStorage: '',
          mineralMethods: '',
          mineralCoordinate: '',
          aggregateInvestment: '',
          abandonTerm: '',
          mineralProductionScale: '',
          oldGeologicalWork: '',
          mineralSituation: '',
          mineralOther: '',
          storage: '',
          cantonId: '',
          beginPrice: undefined,
          priceStep: undefined,
          earnestMoney: undefined,
          // hasReservePrice: 1,
          reservePrice: undefined
        };
        this.title = '新增矿区';
      } else {
        this.initAttachData = this.data.row.targetId;
        this.getGoodsAttach(this.data.row.targetId);
        this.title = '矿区详情';
        detail(this.initAttachData).then(res => {
          if (res.code === '200') {
            this.trust = res.data.trust;
            this.goods = {
              ...res.data.goods,
              businessType: res.data.target.businessType
            };
            this.target = res.data.target;
            this.formData = {
              ...this.formData,
              ...this.goods,
              beginPrice: this.target.beginPrice,
              priceStep: this.target.priceStep,
              earnestMoney: this.target.earnestMoney,
              // hasReservePrice: this.target.hasReservePrice,
              reservePrice: this.target.reservePrice
            };
            this.editData.canStamp = res.data.canStamp;
          }
        });
      }
    },
    closeedit () {
      this.editshow = false;
      this.editData = {};
      this.trust = {};
      this.goods = {};
      this.target = {};
      this.$refs.entrust.cancelForm();
      this.$refs.formData.resetFields();
      this.formData = {
        no: '',
        useYears: '',
        address: '',
        mineralArea: '',
        goodsUse: '',
        mineralLevel1: '',
        mineralStorage: '',
        mineralMethods: '',
        mineralCoordinate: '',
        aggregateInvestment: '',
        abandonTerm: '',
        mineralProductionScale: '',
        oldGeologicalWork: '',
        mineralSituation: '',
        mineralOther: '',
        storage: '',
        cantonId: '',
        beginPrice: undefined,
        priceStep: undefined,
        earnestMoney: undefined,
        // hasReservePrice: 1,
        reservePrice: undefined
      };
    },
    canceledit (type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    confirmedit () {
      this.submitForm();
    },
    getContent () {
      // if (!(this.common && this.common.contentOption && this.common.contentOption.length > 0)) {
        selectListByParentCode('4635').then(res => {
          if (res.code === '200') {
            const contentOption = res.data.map(item => {
              return {
                name: item.name,
                id: item.code
              }
            });
            this.set_common({
              ...this.common,
              contentOption
            });
            if(!this.data.row){
              this.formData.cantonId = res.data[0].code;
            }
          }
        })
      // }
    },
    init (data) {
      initMineTargetAttach(data).then(res => {
        if (res.code === '200') {
          this.initAttachData = res.data;
          this.getGoodsAttach(res.data)
        }
      })
    },
    getGoodsAttach (data) {
      mineTargetAttach(data).then(itemRes => {
        if (itemRes.code === '200') {
          this.attachData = itemRes.data;
          if (itemRes.data.length > 0) {
            this.activeName = [itemRes.data[0].id];
            this.getAttachList(itemRes.data[0].id);
          }
        }
      })
    },
    getAttachList (id) {
      attachList(id).then(res => {
        if (res.code === '200') {
          this.$set(this.attachDataList, id, res.data)
        }
      });
    },
    itemClick (val) {
      const name = val.name;
      if (!this.attachDataList[name]) {
        this.getAttachList(name);
      }
    },
    uploadChange (file) {
      this.uploadFileList = file.fileList;
    },
    uploadRemove (file) {
      this.uploadFileList = file.fileList;
    },
    beforeUpload (file) {
      return this;
    },
    uploadSubmit () {
      if (this.uploadFileList.length === 0) {
        this.$notify.error({
          title: '失败',
          message: '请先选择上传文件!!!',
          position: 'bottom-right'
        });
        return;
      }
      const wfForm = new FormData();
      wfForm.append('attachId', this.dialog.uploadId);
      wfForm.append('serviceCode', 'trans_goods');
      wfForm.append('serviceId', this.initAttachData);
      this.uploadFileList.forEach(file => {
        wfForm.append('file', file.raw);
      })
      uploadRequest(wfForm).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '文件上传成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.dialog.importFile = false;
          this.uploadFileList = [];
          this.$refs.upload.fileList.map(list => list.clearFiles);
          this.getAttachList(this.dialog.uploadId);
        } else {
          this.$notify.error({
            title: '失败',
            message: res.message,
            position: 'bottom-right'
          });
          return false;
        }
      })
    },
    singAction (type, {fileCode, id}) {
      const newmethod = {
        'download': {
          api: fileDownload,
          message: '下载成功'
        },
        'delete': {
          api: deleteFileByFileCode,
          message: '删除成功'
        }
      };
      if (fileCode) {
        const apiMethod = newmethod[type].api;
        const message = newmethod[type].message;
        apiMethod(fileCode).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message,
              type: 'success',
              position: 'bottom-right'
            });
            if (type === 'delete') {
              this.getAttachList(id);
            }
          } else {
            this.$notify.error({
              title: '失败',
              message: res.message,
              position: 'bottom-right'
            });
          }
        })
      }
    },
    attachSubmit () {
      this.$refs.attachModel.validate(valid => {
        if (valid) {
          const request = {
            ...this.attachModel,
            refId: this.initAttachData,
            refTableName: 'TRANS_TARGET'
          }
          saveAttach(request).then(res => {
            if (res.code === '200') {
              this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success',
                position: 'bottom-right'
              });
              this.dialog.addAttach = false;
              this.getGoodsAttach(this.initAttachData);
            } else {
              this.$notify.error({
                title: '失败',
                message: '请填写完整必填数据!!!',
                position: 'bottom-right'
              });
            }
          });
        }
      });
    },
    // 确定数据
    async submitForm () {
      const entrustStatus = await this.$refs.entrust.submitFormItem();
      if (!entrustStatus) return;
      this.$refs.formData.validate(valid => {
        // if (this.option === '探矿权') {
        //   delete formData.storage
        //   delete formData.cantonId
        // } else {
        //   delete formData.mineralStorage
        //   delete formData.mineralLevel1
        //   delete formData.mineralMethods
        //   delete formData.mineralProductionScale
        //   delete formData.remark
        // }
        if (valid) {
          const goodsTypeObj = TRADE_TYPE_OPTIONS.find(option => option.name === this.option);
          if (this.row) {
            this.goods = {
              ...this.goods,
              ...this.formData,
              id: this.goods.id,
              operateFlag: 'edit'
            };
          } else {
            this.goods = {
              ...this.goods,
              ...this.formData,
              id: this.initAttachData,
              goodsType: goodsTypeObj && goodsTypeObj.id,
              operateFlag: 'add'
            };
          }
          delete this.goods.beginPrice;
          delete this.goods.priceStep;
          delete this.goods.earnestMoney;
          delete this.goods.hasReservePrice;
          delete this.goods.reservePrice;
          const message = this.isAdd ? '申请委托成功' : '修改申请委托成功';
        if (!this.inputDisabled) {
          applyTrust({
            goods: this.goods,
            trust: this.trust,
            target: {
              ...this.target,
              id: this.isAdd ? this.initAttachData : this.target.id,
              businessType: this.goods.businessType,
              operateFlag: this.goods.operateFlag,
              beginPrice: this.formData.beginPrice,
              priceStep: this.formData.priceStep,
              earnestMoney: this.formData.earnestMoney,
              // hasReservePrice: this.formData.hasReservePrice,
              reservePrice: this.formData.reservePrice
            },
            byTrust: '1'
          }).then(res => {
            if (res.code === '200') {
              this.$notify({
                title: '成功',
                message,
                type: 'success',
                position: 'bottom-right'
              });
              this.canceledit('cancel');
              this.$_resetForm();
            }
          });
        } else if (this.data.row.canPush === 1) {
          commitTrust(this.data.row.targetId).then(res => {
            if (res.code === '200') {
              this.$notify({
                title: '成功',
                message: '受理成功',
                type: 'success',
                position: 'bottom-right'
              });
              this.canceledit('cancel');
            }
          });
        } else if (this.editData.canStamp === 1) {
          stampNotice(this.data.row.targetId).then(res => {
            if (res.code === '200') {
              this.$notify({
                title: '成功',
                message: '审核通过成功',
                type: 'success',
                position: 'bottom-right'
              });
              this.canceledit('cancel');
            }
          });
        }
      } else {
          this.$notify.error({
            title: '失败',
            message: '请填写完整必填数据!!!',
            position: 'bottom-right'
          });
          return false;
        }
      });
    },
    getEntrast (val) {
      this.trust = {
        ...this.trust,
        ...val
      };
    },
    cancelForm () {
      this.$refs.formData.resetFields();
    },
    changeBusinessType (val) {
      this.init({
        businessType: val,
        targetId: this.initAttachData
      });
    }
  }
};
</script>

<style lang="less">
#details.minTradeListDetail{
  background: #e6e6e6 !important;
  .el-tabs__content{
    padding: 0;
  }
  
  .box-card{
    background:rgba(255,255,255,1);
    border: none;
    box-shadow: none;
    // margin-bottom: 20px;
    border-radius: 0;
    &:first-child{
      margin-bottom: 0;
    }
    &:last-child{
      border-bottom: none;
    }
    .el-form-item {
      margin-bottom: 12px;
      .el-input__inner{
        text-align: left;
      }
    }
    /deep/.el-date-editor.el-input{
      width: 100%;
    }
    .el-card__header{
      padding: 0;
      border-bottom: none;
      .clearfix{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0 0 8px;
        border-bottom: 1px solid #cecece;
        >span{
          font-size: 16px;
          font-weight: 600;
          font-family: arial, 'Microsoft YaHei', 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', sans-serif, 'Droid Sans Fallback';
          display: flex;
          flex-direction: row;
          align-items: center;
          em{
            width:4px;
            height:16px;
            background:#065BDC;
            margin-right: 8px;
          }
        }
      }

    }
    /deep/.el-card__body{
      padding: 10px 0 0;
      .help{
        font-size: 20px;
      }
    }
  }
  .btnInfo{
    height: 70px;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #fff;
    box-shadow:0px -3px 4px 0px rgba(222,222,222,0.5);
    padding: 15px 20px;
    display: flex;
    justify-content: flex-end;
    box-sizing: border-box;
    button{
      width:88px;
      height:40px;
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
    }
    .resetBtn{
      border:1px solid rgba(37,115,241,1);
      // margin-right: 20px;
    }
    .submitBtn{
      background:rgba(37,115,241,1);
    }
  }
}
.box {
  // padding: 20px !important;
  width: 100%;
  height: 100%;
  // background: #e6e6e6 !important;
  .el-table__fixed-body-wrapper, .el-table__fixed-header-wrapper{
    z-index: 0;
  }
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
.radioGroupInput{
  height: 35px;
  .el-radio-group{
    align-items: center;
    display: flex;
    margin-right: 15px;
        .el-radio{
      margin-right: 10px;
    }
  }
  .el-input-number{
    display: flex;
    flex: 1;
    width: auto !important;
  }
  >span{
    display: flex;
    align-self: flex-end;
    line-height: initial;
  }
}
</style>
