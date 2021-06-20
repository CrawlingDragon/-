<template>
  <div class="hospital_nav-container">
    <van-image :src="caseImg" class="bj-img"></van-image>
    <div class="bg"></div>
    <div class="titles">
      <div class="left-title">会员服务</div>
      <div class="right-title">
        {{ hospitalIsStore == 1 ? "专属会员服务，一站式解决作物问题" : "网院" }}
      </div>
    </div>
    <ul class="nav-ul" :class="{ isstore: hospitalIsStore == 0 }">
      <li @click="goToOnline">
        <div class="icon icon01"></div>
        <p>线上网诊</p>
      </li>
      <li @click="goToZuo" v-if="hospitalIsStore == 1">
        <div class="icon icon02"></div>
        <p>坐诊巡诊</p>
      </li>
      <li @click="goToCeTu" v-if="hospitalIsStore == 1">
        <div class="icon icon03"></div>
        <p>测土配方</p>
      </li>
      <li @click="goToRegistration" v-if="hospitalIsStore == 1">
        <div class="icon icon04"></div>
        <p>专家挂号</p>
      </li>
      <li @click="goToAsk" v-if="hospitalIsStore == 1">
        <div class="icon icon05"></div>
        <p>提问</p>
      </li>
      <li @click="goToGoodBase" v-if="hospitalIsStore == 1">
        <div class="icon icon06"></div>
        <p>优质基地</p>
      </li>
      <li>
        <a
          :href="shareUrl + 'Home/Company/companyDetail/ucuid/' + ucuid"
          target="_blank"
          style="display:block;color: #AED0FF;"
        >
          <div class="icon icon07"></div>
          <p>农资店铺</p>
        </a>
      </li>
      <li v-if="hospitalIsStore == 0" @click="goToExpert()">
        <div class="icon icon04"></div>
        <p>专家</p>
      </li>
      <!-- <li @click="goToLive" v-if="hospitalIsStore == 0">
        <div class="icon icon12"></div>
        <p>直播</p>
      </li> -->
      <li v-if="hospitalIsStore == 1 && hospitalIsMember == 1" @click="isVip">
        <div class="icon icon08"></div>
        <p>已是会员</p>
      </li>
      <li
        v-if="hospitalIsStore == 1 && hospitalIsMember == 0"
        @click="goToApplyVip"
      >
        <div class="icon icon09"></div>
        <p class="p2">申请会员</p>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "hospitalNav",
  components: {},
  props: {
    ismember: {
      type: Number,
      default: 0
    },
    caseImg: {
      type: String,
      default:
        "http://www.114nz.com/statics/images/httpsxone.114nz.com_default.png"
    }
  },
  data() {
    return {
      bjSrc: "",
      shareUrl: process.env.VUE_APP_SHARE_URL
    };
  },
  computed: {
    ...mapState(["hospitalIsStore", "hospitalIsMember", "uid", "mid", "ucuid"])
  },
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    goToOnline() {
      // 路由 去线上网诊
      this.$router.push({ path: "hospital_online" }).catch(err => err);
    },
    goToZuo() {
      // 路由 坐诊巡诊
      if (this.uid == "" || this.uid == undefined) {
        this.$router.push({
          path: "/zuozhen_list"
        });
        return;
      }
      if (this.hospitalIsMember == 0) {
        this.$dialog
          .confirm({
            message: "抱歉坐诊巡诊是会员服务，请先申请加入医院再访问",
            cancelButtonText: "申请加入会员",
            confirmButtonText: "好的",
            cancelButtonColor: "#155BBB",
            confirmButtonColor: "#999"
          })
          .then(() => {})
          .catch(() => {
            this.$router.push({
              path: "/apply_vip"
            });
          });
      } else {
        this.$router.push({ path: "zuozhen_list" }).catch(err => err);
      }
    },
    goToCeTu() {
      // 路由 测土配方
      if (this.uid == "" || this.uid == undefined) {
        this.$router.push({
          path: "/cetu_list"
        });
        return;
      }
      if (this.hospitalIsMember == 0) {
        this.$dialog
          .confirm({
            message: "抱歉测土配方是会员服务，请先申请再访问",
            cancelButtonText: "申请加入会员",
            confirmButtonText: "好的",
            cancelButtonColor: "#155BBB",
            confirmButtonColor: "#999"
          })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
            this.$router.push({ path: "/apply_vip" });
          });
      } else {
        this.$router.push({ path: "cetu_list" }).catch(err => err);
      }
    },
    goToRegistration() {
      // 路由 专家挂号
      if (this.uid == "" || this.uid == undefined) {
        this.$router.push({
          path: "/expert_registration"
        });
        return;
      }
      if (this.hospitalIsMember == 0) {
        this.$dialog
          .confirm({
            message: "抱歉专家挂号是会员服务，请先申请加入医院再访问",
            cancelButtonText: "申请加入会员",
            confirmButtonText: "好的",
            cancelButtonColor: "#155BBB",
            confirmButtonColor: "#999"
          })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
            this.$router.push({
              path: "/apply_vip"
            });
          });
      } else {
        this.$router.push({ path: "/expert_registration" }).catch(err => err);
      }
    },
    goToAsk() {
      // 路由 提问
      if (this.uid == "" || this.uid == undefined) {
        this.$router.push({
          path: "/ask"
        });
        return;
      }
      if (this.hospitalIsMember == 0) {
        this.$dialog
          .confirm({
            message: "抱歉会员提问是会员服务，请先申请加入医院再访问",
            cancelButtonText: "申请加入会员",
            confirmButtonText: "好的",
            cancelButtonColor: "#155BBB",
            confirmButtonColor: "#999"
          })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
            this.$router.push({
              path: "/apply_vip"
            });
          });
      } else {
        this.$router
          .push({ path: "/ask", query: { from: "hospital" } })
          .catch(err => err);
      }
    },
    goToExpert() {
      // 路由 医院专家
      this.$router
        .push({
          path: "/hospital_expert"
        })
        .catch(err => err);
    },
    goToGoodBase() {
      // 路由 优质基地
      this.$router
        .push({
          path: "/good_base"
        })
        .catch(err => err);
    },
    goToApplyVip() {
      // 路由 申请会员
      this.$router
        .push({
          path: "/apply_vip"
        })
        .catch(err => err);
    },
    goToLive() {
      // 路由 直播
      this.$router.push({ path: "/live" }).catch(err => err);
    },
    isVip() {
      this.$dialog
        .confirm({
          message: "您已是新型庄稼医院会员",
          cancelButtonText: "查看会员权益",
          confirmButtonText: "好的",
          cancelButtonColor: "#155BBB",
          confirmButtonColor: "#999"
        })
        .then(() => {
          // on confirm
        })
        .catch(() => {
          // on cancel
          this.$router.push({
            path: "/vip"
          });
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
.hospital_nav-container
  padding 15px 0
  // background-image url('https://img.yzcdn.cn/vant/apple-2.jpg')
  background-color rgba(0, 0, 0, 0.5)
  background-size cover
  background-position center center
  position relative
  height 190px
  margin-bottom 10px
  z-index 1
  .bj-img
    position absolute
    width 100%
    height 100%
    left 0
    top 0
    z-index 0
  .bg
    position absolute
    width 100%
    height 100%
    background rgba(0, 0, 0, 0.7)
    left 0
    top 0
    z-index 1
  .titles
    z-index 2
    padding 0 12px
    position relative
    color #fff
    display flex
    justify-content space-between
  .nav-ul
    z-index 2
    position relative
    font-size 0
    margin-top 5px
    &.isstore
      margin-top 30px
    li
      font-size 12px
      display inline-block
      color #AED0FF
      width 25%
      margin-top 15px
      text-align center
      .icon01
        width 25px
        height 25px
        background url('./37.png') no-repeat
        background-size cover
        background-position center center
        margin 0 auto 10px
      .icon02
        width 25px
        height 24px
        background url('./44.png') no-repeat
        background-size cover
        background-position center center
        margin 0 auto 10px
      .icon03
        width 20px
        height 25px
        background url('./45.png') no-repeat
        background-size cover
        background-position center center
        margin 0 auto 10px
      .icon04
        width 25px
        height 25px
        background url('./38.png') no-repeat
        background-size cover
        background-position center center
        margin 0 auto 10px
      .icon05
        width 25px
        height 25px
        background url('./43.png') no-repeat
        background-size cover
        background-position center center
        margin 0 auto 10px
      .icon06
        width 25px
        height 25px
        background url('./42.png') no-repeat
        background-size cover
        background-position center center
        margin 0 auto 10px
      .icon07
        width 25px
        height 25px
        background url('./39.png') no-repeat
        background-size cover
        background-position center center
        margin 0 auto 10px
      .icon08
        width 25px
        height 25px
        background url('./41.png') no-repeat
        background-size cover
        background-position center center
        margin 0 auto 10px
      .icon09
        width 25px
        height 25px
        background url('./40.png') no-repeat
        background-size cover
        background-position center center
        margin 0 auto 10px
      .icon12
        width 25px
        height 25px
        background url('./53.png') no-repeat
        background-size cover
        background-position center center
        margin 0 auto 10px
      .p2
        color #ff6600
/deep/.van-dialog__content
  font-size 16px
  /deep/.van-dialog__message
    font-size 16px
</style>
