<template>
  <div class="flexRow cardList">
    <div
      class="flexRow cardItem"
      v-for="(cardItem, index) in cardData"
      :key="cardItem.id"
    >
      <div class="flexCenter icon"><img :src="cardItem.icon" /></div>
      <div class="flexColumn cardInfo">
        <span>{{ cardItem.name }}</span>
        <span>{{ cardItem.num }}</span>
      </div>
      <span class="bg" :class="`bg${index + 1}`" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
// import { useRoute } from "vue-router";
import card1 from "@/common/images/home/img1.png";
import card2 from "@/common/images/home/img2.png";
import card3 from "@/common/images/home/img3.png";
import card4 from "@/common/images/home/img4.png";
import card5 from "@/common/images/home/img5.png";
import { getCount } from "@/api/dataBoard";
export default {
  name: "card",
  components: {},
  props: {
    siteId: {
      type: Number,
    },
  },
  setup(props: any) {
    const cardData = reactive([
      {
        id: "1",
        name: "学校",
        num: "0",
        icon: card1,
      },
      {
        id: "2",
        name: "教室",
        num: "0",
        icon: card2,
      },
      {
        id: "3",
        name: "网关",
        num: "0",
        icon: card3,
      },
      {
        id: "4",
        name: "设备",
        num: "0",
        icon: card4,
      },
      {
        id: "5",
        name: "总用电量",
        num: "0",
        icon: card5,
      },
    ]);
    const getCountData = (id: number) => {
      getCount(id).then((res: any) => {
        if (res.code == "200") {
          let { data } = res;
          cardData[0].num = data.totalSchoolCount || 0;
          cardData[1].num = data.totalClassCount || 0;
          cardData[2].num = data.totalGatewayCount || 0;
          cardData[3].num = data.totalDeviceCount || 0;
          cardData[4].num = data.totalPowerCount || 0;
        }
      });
    };
    onMounted(() => {});
    watch(
      () => props.siteId,
      (newVal, oldVal) => {
        getCountData(newVal);
      },
      { immediate: true }
    );
    return {
      cardData,
      getCountData,
    };
  },
};
</script>
<style lang="less" scoped>
.cardList {
  width: 100%;
  justify-content: space-between;
  margin-bottom: 40px;
  .cardItem {
    width: calc(20% - 13px); /*no*/
    position: relative;
    padding: 25px 20px;
    align-items: center;
    .bg {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      /* background: url("../../../../common/images/home/img6.png") #5bbdfe
        no-repeat center;
      background-repeat: no-repeat; */
      background-position: center;
      background-blend-mode: lighten; //给背景图上色
      background-size: cover;
      z-index: 1;
      border-radius: 4px;
    }
    .bg1 {
      background-image: url("../../../../common/images/home/img6.png"),
        linear-gradient(135deg, #8bd6fa, #53adf2);
    }
    .bg2 {
      background-image: url("../../../../common/images/home/img6.png"),
        linear-gradient(135deg, #8bd6fa, #53adf2);
    }
    .bg3 {
      background-image: url("../../../../common/images/home/img6.png"),
        linear-gradient(135deg, #84bbff, #5392f2);
    }
    .bg4 {
      background-image: url("../../../../common/images/home/img6.png"),
        linear-gradient(135deg, #5ec2ff, #3f84ef 97%);
    }
    .bg5 {
      background-image: url("../../../../common/images/home/img6.png"),
        linear-gradient(135deg, #84bbff, #5392f2);
    }
    .icon {
      width: 60px;
      margin-right: 10px; /*no*/
      z-index: 11;
    }
    .cardInfo {
      z-index: 11;
      align-items: flex-start;
      span {
        display: flex;
        font-size: 19px;
        font-family: PingFangSC, PingFangSC-Semibold;
        font-weight: 600;
        text-align: left;
        color: #ffffff;
        line-height: 28px; /*no*/
        text-shadow: 0px 2px 4px rgba(54, 145, 230, 0.91); /*no*/
        &:last-child {
          font-size: 27px;
        }
      }
    }
    &::before {
      content: "";
      // z-index: -1;
      position: absolute;
      width: calc(100% - 20px); /*no*/
      height: 100%;
      left: 50%;
      top: 10px; /*no*/
      transform: translateX(-50%);
      background: linear-gradient(
        135deg,
        rgba(139, 214, 250, 0.16),
        rgba(83, 173, 242, 0.16)
      );
      border-radius: 8px;
    }
    &::after {
      content: "";
      // z-index: -2;
      position: absolute;
      width: calc(100% - 40px); /*no*/
      height: 100%;
      left: 50%;
      top: 30px; /*no*/
      transform: translateX(-50%);
      background: linear-gradient(
        135deg,
        rgba(139, 214, 250, 0.16),
        rgba(83, 173, 242, 0.16)
      );
      border-radius: 8px;
      filter: blur(7px);
    }
    &:nth-of-type(2) {
      .icon {
        width: 69px;
      }
    }
    &:nth-of-type(3) {
      .icon {
        width: 53px;
      }
    }
    &:nth-of-type(4) {
      .icon {
        width: 42px;
      }
    }
    &:nth-of-type(5) {
      .icon {
        width: 41px;
      }
    }
  }
}
</style>
