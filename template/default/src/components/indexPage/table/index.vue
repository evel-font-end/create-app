<template>
  <div id="indexTable">
    <titleTouch :title="title">
      <div class="module_table">
        <div class="menuList">
            <ul class="tab fs16 in_b va_m">
                <li
                  class="li"
                  :class="nodeId === option.id && 'current'"
                  v-for="(option,index) in nodeItems"
                  :key="`option.id${index}`"
                  @click.prevent.stop="changeNodeId(option.id)"
                >
                  <span>{{option.title}}</span>
                </li>
            </ul>
            <a class="fs14 c_5B fr clearfix more" @click.prevent.stop="goMore">更多</a>
        </div>
        <div class="content">
          <div
            class="in_b box"
             v-for="(item, index) in data.current"
            :key="`item.id${index}`"
            @click.prevent.stop="goDetail(item)"
          >
            <div>
              <h4 class="fs14 c_2c  in_b b">{{item.no}}<span class="fs12 in_b c_f new">最新</span></h4>
            </div>
            <div class="fs14 c_2c fw400 tx_r time">{{item.publishDate ? item.publishDate.split(" ")[0] : '暂无时间'}}</div>
          </div>
        </div>
      </div>
    </titleTouch>
  </div>
</template>

<script>
import titleTouch from '../tittle'
export default {
  components: {
    titleTouch
  },
  data () {
    return {
      nodeId: 'notice',
      nodeItems: [{
        title: '正在公告',
        id: 'notice'
      },
      // {
      //   title: '正在竞价',
      //   id: 'limitPrice'
      // }, 
      {
        title: '补充公告',
        id: 'supplementary'
      }],
      pageNo: 1,
      pageSize: 6,
      data: {
        current: [],
        limitPrice: [],
        notice: [],
        supplementary: []
      }
    };
  },
  props: {
    title: '',
    items: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init () {
      this.getData();
    },
    getData (id) {
      const parames = {
        data: {},
        pageSize: this.pageSize,
        pageNo: this.pageNo
      };
      if(this.items[this.nodeId] === undefined)return;
      const api = this.items[this.nodeId];
      if(api && this.data[this.nodeId].length === 0) {
        api(parames).then(res => {
          if(res.code === '200') {
            let data = {
              ...this.data,
            };
            data[this.nodeId] = res.data.data;
            data.current = res.data.data;
            this.data = data;
          }
        });
      } else {
        const data = {
          ...this.data,
          current: this.data[this.nodeId]
        }
        this.data = data;
      }
    },
    changeNodeId (id) {
      this.nodeId = id;
      this.getData();
    },
    goDetail (item) {
      this.$emit('onChange', item);
    },
    goMore() {
      this.$emit('onMore');
    }
  },
  watch: {
    item(val) {
    }
  }
};
</script>

<style lang="less">
#indexTable{
    .module_table {
      width: 100%;
      .menuList{
        margin: 0 0 20px;
        ul.tab {
          li {
            float: left;
            cursor: pointer;
            padding: 4px 11px;
            margin-right: 20px;
            position: relative;
            font-family: "MicrosoftYaHei";
            font-size: 16px;
            color: #353535;
          }
          li.current {
            color: #fff;
            background:linear-gradient(135deg,rgba(10,141,234,1) 0%,rgba(17,93,219,1) 100%);
          }
        }
        .more {
          cursor: pointer;
          padding: 3px 15px;
          background:rgba(238,238,238,1);
          border-radius:13px;
        }
      }
      .content{
        .box{
          box-sizing: border-box;
          min-height: 106px;
          width:385px;
          padding: 19px 20px 19px 31px;
          background:rgba(255,255,255,1);
          box-shadow:0px 0px 6px 0px rgba(163,163,163,0.5);
          position: relative;
          margin-right: 17px;
          margin-bottom: 20px;
          cursor: pointer;
          overflow: hidden;
          border: 1px solid transparent;
          box-sizing: border-box;
          &:hover{
            border: 1px solid #115edb;
          }
          &:after{
            content: '';
            width:4px;
            height:4px;
            background:rgba(17,94,219,1);
            position: absolute;
            top: 28px;
            left: 20px;
          }
          &:nth-child(3n){
            margin-right: 0;
          }
          h4{
            line-height: 24px;
            min-height: 48px;
          }
          .new{
            padding: 1px 11px;
            background:rgba(255,107,52,1);
            box-shadow:0px 2px 4px 0px rgba(255,175,150,0.5);
            border-radius:50px;
            margin-left: 10px;
            line-height: 17px;
          }
        }
      }
    }
}
</style>
