<template>
  <div class="hospital_fast_nav-container" v-show="showFlag">
    <div class="wrap">
      <div class="top">
        <div class="kind">医院导航</div>
        <van-icon name="cross" class="cross" @click="closeNav" />
      </div>
      <div class="nav-box">
        <div class="title">
          会员服务<span>专属会员服务，一站式解决作物问题</span>
        </div>
        <van-grid class="nav-ul" :border="false" :gutter="15">
          <van-grid-item text="线上网诊" @click="goToOnline" />
          <van-grid-item
            text="坐诊巡诊"
            @click="goToZuo"
            v-if="hospitalIsStore == 1"
          />
          <van-grid-item
            text="测土配方"
            @click="goToCeTu"
            v-if="hospitalIsStore == 1"
          />
          <van-grid-item
            text="专家挂号"
            @click="goToRegistration"
            v-if="hospitalIsStore == 1"
          />
          <van-grid-item text="资讯" @click="goToMessage" />
          <van-grid-item text="专家" @click="goToExpert" />
          <van-grid-item
            text="优质基地"
            @click="goToGoodBase"
            v-if="hospitalIsStore == 1"
          />
          <van-grid-item
            text="会员提问"
            @click="goToAsk"
            v-if="hospitalIsStore == 1"
          />
          <van-grid-item text="店铺" @click="goToShop" />
          <!-- <van-grid-item text="直播" @click="goToLive" /> -->
          <van-grid-item text="简介" @click="goToIntro" />
        </van-grid>
      </div>
      <div
        class="join-btn"
        v-if="hospitalIsStore == 1 && hospitalIsMember == 0"
        @click="goToApply"
      >
        申请加入医院
        <span class="free">免费</span>
      </div>
      <div class="joined" v-if="joinTime">{{ joinTime }} 加入医院成为会员</div>
      <div class="know-vip" @click="goToVip" v-show="hospitalIsStore == 1">
        了解更多会员权益 >
      </div>
      <div class="go-index" @click="gotoHospitalIndex">
        <div class="box">
          <van-image class="logo" :src="hospitalLogo"></van-image>
          <div class="name">{{ hospitalName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "hospitalFastNav",
  components: {},
  metaInfo() {
    return {
      title: this.$route.path == "/base_detail" ? "基地详情" : this.hospitalName
    };
  },
  props: {
    showFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      shareUrl: process.env.VUE_APP_SHARE_URL
    };
  },
  computed: {
    ...mapState([
      "mid",
      "uid",
      "joinTime",
      "hospitalName",
      "hospitalIsStore",
      "hospitalIsMember",
      "ucuid",
      "hospitalLogo"
    ])
  },
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    closeNav() {
      this.$emit("changeFlag", false);
    },
    goToOnline() {
      // 路由  网上巡诊
      this.$router
        .push({
          path: "hospital_online"
        })
        .catch(err => err);
      this.$emit("changeFlag", false);
    },
    goToZuo() {
      // 路由 坐诊巡诊
      if (this.uid == "" || this.uid == undefined) {
        this.$router.push({
          path: "zuozhen_list"
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
        this.$router
          .push({
            path: "zuozhen_list"
          })
          .catch(err => err);
      }
      this.$emit("changeFlag", false);
    },
    goToCeTu() {
      // 路由 测土配方
      if (this.uid == "" || this.uid == undefined) {
        this.$router.push({
          path: "cetu_list"
        });
        return;
      }
      if (this.hospitalIsMember == 0) {
        this.$dialog
          .confirm({
            message: "抱歉测土配方是会员服务，请先申请加入医院再访问",
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
          .push({
            path: "cetu_list"
          })
          .catch(err => err);
      }

      this.$emit("changeFlag", false);
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
        this.$router
          .push({
            path: "/expert_registration"
          })
          .catch(err => err);
      }
      this.$emit("changeFlag", false);
    },
    goToMessage() {
      // 路由 资讯
      this.$router.push({ path: "/hospital_message" }).catch(err => err);
      this.$emit("changeFlag", false);
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
        this.$router.push({ path: "/ask" }).catch(err => err);
      }
      this.$emit("changeFlag", false);
    },
    goToExpert() {
      // 路由 医院专家
      this.$router
        .push({
          path: "/hospital_expert"
        })
        .catch(err => err);
      this.$emit("changeFlag", false);
    },
    goToGoodBase() {
      // 路由 优质基地
      this.$router
        .push({
          path: "/good_base"
        })
        .catch(err => err);
      this.$emit("changeFlag", false);
    },
    goToLive() {
      // 路由 直播
      this.$router
        .push({
          path: "/live"
        })
        .catch(err => err);
      this.$emit("changeFlag", false);
    },
    goToIntro() {
      // 路由 简介
      this.$router.replace({
        path: "/hospital_intro"
      });
      // .catch((err) => err);
      this.$emit("changeFlag", false);
    },
    gotoHospitalIndex() {
      // 路由 去医院首页
      this.$router
        .push({
          path: "/hospital"
        })
        .catch(err => err);
      this.$emit("changeFlag", false);
    },
    goToVip() {
      this.$router
        .push({
          path: "/vip"
        })
        .catch(err => err);
      this.$emit("changeFlag", false);
    },
    goToApply() {
      this.$router
        .push({
          path: "/apply_vip"
        })
        .catch(err => err);
      this.$emit("changeFlag", false);
    },
    goToShop() {
      window.open(
        this.shareUrl + "/Home/Company/companyDetail/ucuid/" + this.ucuid,
        "_blank"
      );
    }
  }
};
</script>
<style lang="stylus" scoped>
.hospital_fast_nav-container
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  background #EBEBEB
  z-index 111
  .wrap
    background #fff
  .top
    display flex
    height 40px
    align-items center
    background #fff
    border-bottom 1px solid #e5e5e5
    .kind
      font-size 14px
      color #999999
      margin-left 12px
      flex 1
    .cross
      width 45px
      border-left 1px solid #e5e5e5
      height 100%
      text-align center
      font-size 15px
      line-height 40px
      color #9D9D9D
  .nav-box
    background #fff
    .title
      font-size 12px
      padding-left 12px
      line-height 41px
      color #333333
      span
        margin-left 9px
        color #999999
    .nav-ul
      font-size 0
      padding-bottom 20px
      border-bottom 1px solid #e5e5e5
      /deep/.van-grid-item__content
        background #F6F6F6
        padding 5px 8px
        border-radius 8px
  .join-btn
    width 80%
    margin 20px auto
    background #ff6600
    color #fff
    text-align center
    height 50px
    line-height 50px
    font-size 15px
    position relative
    border-radius 8px
    .free
      position absolute
      right 6px
      top 6px
      font-size 12px
      line-height 12px
  .know-vip
    color #155BBB
    font-size 12px
    margin 20px 0
    text-align center
  .go-index
    position absolute
    bottom 40px
    left 0
    right 0
    color #155BBB
    font-size 14px
    text-align center
    .box
      border 1px solid #155BBB
      border-radius 4px
      display inline-block
      padding 0 10px
      line-height 30px
      .logo
        display inline-block
        width 20px
        height 20px
        margin-right 5px
        vertical-align middle
      & > .name
        display inline-block
        vertical-align middle
  .joined
    color #999999
    font-size 12px
    text-align center
    margin 20px auto
</style>
