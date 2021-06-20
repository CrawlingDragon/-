<template>
  <div class="about-us">
    <Header :indexHeader="false"></Header>
    <div class="content">
      <!-- <p class="p1">
        绍兴市供销社（农合联）线上为农服务平台，包括电脑端、手机端，实现数字化会员管理、层级管理、服务数据监控、数据统计分析等功能，为农民提供在线问诊、病虫害图库、视频培训、人工智能识别、在线直播、土壤检测、优质农资商品交易等服务。
      </p>
      <p class="p1">绍兴市供销社（农合联）为农服务平台上的数据接入到省农合联平台，纳入浙江省供销社（农合联）庄稼医院为农服务体系内，同时，为绍兴市下属各个区县开发接入端口，下属各区县的服务数据归集到绍兴市供销社（农合联）为农服务平台上，以便于绍兴市供销社（农合联）对下属各个区县服务情况进行监督、考核和管理，实现绍兴地区庄稼医院一体化。</p>
      <van-image class="img" fit="cover" :src="require('./us.png')"></van-image> -->
      <p class="p1">{{ us.introduce }}</p>
    </div>
    <div class="bottom">
      <div class="small-title">申请开通庄稼医院，系统性服务会员</div>
      <div class="number">
        已开通
        <div class="num" v-for="item in mpnum" :key="item.id">{{ item }}</div>
        家医院
      </div>
      <div class="btn" @click="call">申请开通庄稼医院</div>
    </div>
    <div class="tip">
      <p class="p2">{{ address }}已开通{{ us.mpnum }}家庄稼医院</p>
      <p class="p2">收录{{ us.enum }}位专家</p>
      <p class="p2">处方{{ us.rnum }}次</p>
    </div>
    <a :href="'tel:' + tel" ref="tel"></a>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import { mapState } from "vuex";
export default {
  metaInfo: {
    title: "关于我们"
  },
  name: "aboutUs",
  components: { Header },
  props: {},
  data() {
    return {
      us: "",
      mpnumData: 0,
      tel: "",
      address: ""
    };
  },
  computed: {
    ...mapState(["initMid"]),
    mpnum() {
      let x = this.mpnumData;
      if (x < 10) {
        x = "0" + x;
      }
      return x.toString().split("");
    }
  },
  watch: {},
  mounted() {
    this.getAbout();
    this.address = window.sessionStorage.getItem("city");
  },
  destroyed() {},
  methods: {
    getAbout() {
      this.$axios
        .fetchPost("API/Mpublic/getAboutUs", { mId: this.initMid })
        .then(res => {
          if (res.data.code == 0) {
            this.us = res.data.data;
            this.mpnumData = res.data.data.mpnum;
            this.tel = res.data.data.telephone;
          }
        });
    },
    call() {
      var that = this;
      this.$dialog
        .confirm({
          title: "开通庄稼医院",
          message: "建院咨询请联系中农在线 <br/>" + this.tel,
          confirmButtonText: "取消",
          confirmButtonColor: "#999999",
          cancelButtonText: "拨打电话",
          cancelButtonColor: "#155BBB"
        })
        .then(() => {
          // on confirm
        })
        .catch(() => {
          // on cancel
          that.$refs.tel.click();
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
.about-us
  padding-bottom 40px
  .content
    margin-top 10px
    background #fff
    padding 15px 12px
    .p1
      color #333
      font-size 15px
      line-height 20px
      margin-bottom 20px
      &:last-child
        margin-bottom 0
  .bottom
    background #fff
    padding 12px
    margin-top 10px
    .small-title
      color #333333
      font-size 16px
      padding 8px 0 15px
      text-align center
    .number
      color #999999
      font-size 12px
      text-align center
      display flex
      align-items center
      justify-content center
      .num
        display inline-block
        width 27px
        height 38px
        line-height 38px
        border 1px dashed rgba(123, 179, 255, 1)
        border-radius 5px
        margin 0 5px
        font-size 30px
        color #333
        font-family HYLingXinJ
        font-weight bold
    .btn
      margin 20px 12px 0
      background #FF6600
      border-radius 4px
      color #FFFFFF
      font-size 15px
      height 50px
      line-height 50px
      text-align center
  .tip
    text-align center
    color #999999
    font-size 12px
    line-height 25px
    margin-top 25px
    padding-bottom 20px
</style>
