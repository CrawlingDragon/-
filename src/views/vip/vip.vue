<template>
  <div class="vip-container">
    <Header :indexHeader="false"></Header>
    <div class="content">
      <div class="icon"></div>
      <p class="h1">庄稼医院会员权益</p>
      <p class="p2">一站式解决作物问题</p>
      <ul>
        <li>
          <div class="left">线上网诊</div>
          <div class="right">享受医院专属答疑服务
          </div>
        </li>
        <li>
          <div class="left">坐诊巡诊</div>
          <div class="right">坐诊巡诊一站式解决作物问题</div>
        </li>
        <li>
          <div class="left">测土配方</div>
          <div class="right">土壤养分检测，科学种养</div>
        </li>
        <li>
          <div class="left">专家挂号</div>
          <div class="right">预约专家挂号，一对一服务</div>
        </li>
        <li>
          <div class="left">优质基地</div>
          <div class="right">优质基地认证背书农产品上行</div>
        </li>
        <li>
          <div class="left">农资团购</div>
          <div class="right">农资集体采购更优惠</div>
        </li>
        <li>
          <div class="left">培训会</div>
          <div class="right">线上线下相结合，农技提升更快</div>
        </li>
        <li>
          <div class="left">作物解决方案</div>
          <div class="right">全年作物解决方案，种植更安心</div>
        </li>
        <li>
          <div class="left">供应链金融</div>
          <div class="right">会员优先享受惠农贷款服务</div>
        </li>
      </ul>
      <div class="btn" @click="goToIntoHospital">选择医院加入会员<div class="free">免费</div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import { mapState } from "vuex";

export default {
  name: "vip",
  components: { Header },
  metaInfo: {
    title: "会员权益",
  },
  props: {},
  data() {
    return {
      user: "",
    };
  },
  created() {},
  computed: {
    ...mapState(["hospitalIsMember"]),
  },
  watch: {},
  mounted() {
    // this.getUserInfo();
  },
  destroyed() {},
  methods: {
    goToIntoHospital() {
      this.$router.push({
        path: "/into_hospital",
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.vip-container
  position fixed
  left 0
  right 0
  top 40px
  bottom 0
  background url('./80.png') no-repeat
  background-size 100% 100%
  background-position center center
  height 100%
  padding-bottom 60px
  .content
    overflow auto
    height 100%
    position relative
    .icon
      width 100px
      height 70px
      background url('./81.png') no-repeat
      background-size 100% 100%
      background-position center center
      margin 10px auto 0
    .h1
      font-size 23px
      font-family Adobe Heiti Std
      font-weight normal
      text-align center
      color rgba(255, 255, 255, 1)
      background linear-gradient(78deg, rgba(226, 167, 106, 1) 0%, rgba(246, 214, 156, 1) 53.7353515625%, rgba(226, 167, 106, 1) 100%)
      -webkit-background-clip text
      -webkit-text-fill-color transparent
    .p2
      font-size 16px
      font-family Adobe Heiti Std
      font-weight normal
      text-align center
      color rgba(255, 255, 255, 1)
      background linear-gradient(78deg, rgba(226, 167, 106, 1) 0%, rgba(246, 214, 156, 1) 53.7353515625%, rgba(226, 167, 106, 1) 100%)
      -webkit-background-clip text
      -webkit-text-fill-color transparent
    ul
      border 1px solid rgba(254, 211, 160, 0.3)
      border-radius 10px
      margin 15px 12px
      li
        display flex
        align-items center
        height 30px
        color #FFEECE
        font-size 12px
        border-bottom 1px solid rgba(254, 211, 160, 0.3)
        .left
          width 30%
          border-right 1px solid rgba(254, 211, 160, 0.3)
          text-align center
          height 30px
          line-height 30px
        .right
          width 70%
          padding-left 20px
    .btn
      position relative
      margin 35px 12px 0
      height 50px
      line-height 50px
      font-size 16px
      text-align center
      color #fff
      background #FF6600
      border-radius 4px
      .free
        position absolute
        right 10px
        top 10px
        color #fff
        font-size 12px
        line-height 12px
</style>
