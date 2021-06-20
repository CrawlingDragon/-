<template>
  <div class="index-container" ref="index">
    <Header :haveBackIcon="false" ref="header"></Header>
    <div class="swiper-box" ref="swiper">
      <van-swipe :autoplay="3000" :style="{ height: h }">
        <van-swipe-item
          v-for="image in swiperArr"
          :key="image.id"
          fit="cover"
          @click="goToMessageDetail(image)"
        >
          <van-image fit="cover" :src="image.thumb" lazy-load />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="nav-box">
      <div class="item" @click="goToAnswer">
        <div class="icon i1"></div>
        <p>找答案</p>
      </div>
      <div class="item">
        <a
          :href="shareStoreUrl"
          target="_blank"
          style="display:block;color:#000;"
        >
          <div class="icon i2"></div>
          <p>找农资</p>
        </a>
      </div>
      <div class="item" @click="goToExpert">
        <div class="icon i3"></div>
        <p>找专家</p>
      </div>
      <div class="item" @click="goToBase">
        <div class="icon i4"></div>
        <p>找基地</p>
      </div>
      <!-- <div class="item" @click="goToLive">
        <div class="icon i5"></div>
        <p>直播</p>
      </div> -->
    </div>
    <div class="base-box" v-show="baseList.length != 0">
      <div class="title van-hairline--bottom">
        推荐基地
        <div
          class="look-bar"
          @click="goToBaseList"
          v-show="baseList.length != 0"
        >
          更多 >
        </div>
      </div>
      <ul class="base-ul">
        <li v-for="item in baseList" :key="item.gid">
          <RecommendBase :list="item"></RecommendBase>
        </li>
      </ul>
    </div>
    <div class="hospital-box" v-show="hospitalArr.length != 0">
      <div class="title van-hairline--bottom">
        推荐医院
        <div
          class="look-bar"
          @click="lookMoreHospital"
          v-show="hospitalArr.length != 0"
        >
          找医院 >
        </div>
      </div>
      <ul class="h-ul">
        <li v-for="item in hospitalArr" :key="item.id">
          <RecommendHospital :list="item"></RecommendHospital>
        </li>
      </ul>
    </div>
    <div class="vip-box" @click="goToVip">
      <img src="./49.png" alt="" />
    </div>
    <div class="online-box" v-show="expertArr.length != 0">
      <div class="title van-hairline--bottom">
        推荐专家
        <div
          class="look-bar"
          @click="goToExpert"
          v-show="expertArr.length != 0"
        >
          找专家 >
        </div>
      </div>
      <ul class="e-ul">
        <li v-for="item in expertArr" :key="item.id">
          <RecommendExpert :list="item"></RecommendExpert>
        </li>
      </ul>
    </div>
    <div class="online-box">
      <div class="title van-hairline--bottom">
        网诊
        <div class="look-bar" @click="goToAnswer">找答案 ></div>
      </div>
      <ul class="o-ul">
        <li v-for="item in onlineArr" :key="item.id" ref="li">
          <OnlineItem :list="item" @preImage="preverImg"></OnlineItem>
        </li>
      </ul>
    </div>
    <Foot></Foot>
    <van-overlay :show="overlayShow" z-index="3">
      <van-loading type="spinner" class="loading" color="#333" />
    </van-overlay>
  </div>
</template>
<script>
import Header from "@/components/header/header.vue";
import RecommendBase from "@/components/recommend_base/recommend_base";
import RecommendHospital from "@/components/recommend_hospital/recommend_hospital";
import RecommendExpert from "@/components/recommend_expert/recommend_expert";
import OnlineItem from "@/components/online_item/online_item";
import { ImagePreview } from "vant";
import { mapMutations, mapState } from "vuex";
import Foot from "@/components/foot/foot";

export default {
  metaInfo: {
    title: "首页"
  },
  name: "index",
  components: {
    Header,
    RecommendBase,
    RecommendHospital,
    OnlineItem,
    RecommendExpert,
    Foot,
    [ImagePreview.Component.name]: ImagePreview.Component
  },
  props: {},
  data() {
    return {
      baseList: [],
      swiperArr: [],
      hospitalArr: [],
      expertArr: [],
      onlineArr: [],
      scrollInit: false,
      shareStoreUrl: process.env.VUE_APP_SHARE_URL,
      h: 0,
      city: window.localStorage.getItem("city"),
      overlay: false
    };
  },
  created() {},
  computed: {
    ...mapState(["initMid", "uid"]),
    overlayShow() {
      if (this.baseList.length === 0 && !this.overlay) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    $route() {
      this.$refs.index.scrollTo(0, 0);
      this.setInitMid(this.initMid);
      this.$refs.header.city = window.localStorage.getItem("city");
      this.city = window.localStorage.getItem("city");
    },
    initMid() {
      this.overlay = false;
      this.getIndexData();
    },
    city() {
      this.getIndexData();
    }
  },
  mounted() {
    this.initSwiperHeight();
    if (this.initMid != "") {
      this.getIndexData();
    }
    window.addEventListener("resize", this.initSwiperHeight);
  },
  // destroyed() { window.removeEventListener('scroll', this.scrollHandler)},
  methods: {
    ...mapMutations(["setInitMid"]),
    initSwiperHeight() {
      let w = this.$refs.swiper.offsetWidth;
      if (w >= 640) {
        w = 640;
      }
      this.h = w / (750 / 260) + "px";
    },
    // scrollHandler() {
    //   this.$nextTick(() => {
    //     // let l = this.onlineArr.length
    //     // let li = this.$refs.li[l - 1]
    //     if (this.scrollInit) {
    //       var scrollTop =
    //         document.documentElement.scrollTop || document.body.scrollTop;
    //       //变量windowHeight是可视区的高度
    //       var windowHeight =
    //         document.documentElement.clientHeight || document.body.clientHeight;
    //       //变量scrollHeight是滚动条的总高度
    //       var scrollHeight =
    //         document.documentElement.scrollHeight || document.body.scrollHeight;
    //       //滚动条到底部的条件
    //       if (scrollTop + windowHeight == scrollHeight) {
    //         //到了这个就可以进行业务逻辑加载后台数据了
    //         setTimeout(() => {
    //           this.$router.push({
    //             path: "/index_online"
    //           });
    //         }, 500);
    //       }
    //     }
    //   });
    // },

    getIndexData() {
      // 获取首页数据
      this.overlay = false;
      this.$axios
        .fetchPost("/API/Index/index", {
          mId: this.initMid,
          uId: this.uid,
          location: window.localStorage.getItem("city")
        })
        .then(res => {
          this.overlay = true;
          if (res.data.code == 0) {
            this.swiperArr = res.data.data.list_ad;
            this.hospitalArr = res.data.data.list_mpublic;
            this.expertArr = res.data.data.list_expert;
            this.onlineArr = res.data.data.list_wen;
            this.baseList = res.data.data.list_gbase;
            this.scrollInit = true;
            this.setInitMid(this.initMid);
          }
        });
    },
    goToLive() {
      this.setInitMid(this.initMid);
      this.$router.push({ path: "/live", query: { from: "index" } });
    },
    preverImg(item) {
      //网诊的图片预览
      ImagePreview({
        images: item.arr,
        startPosition: item.index,
        closeable: true
      });
    },
    goToAnswer() {
      //  去首页的的网诊
      this.$router.push({ path: "/index_online" }).catch(err => err);
    },
    goToExpert() {
      // 找专家
      this.$router.push({ path: "/look_expert" }).catch(err => err);
    },
    goToBase() {
      // 找基地
      this.$router.push({ path: "/whole_base_list" }).catch(err => err);
    },
    goToBaseList() {
      // 找基地
      this.$router.push({ path: "/whole_base_list" }).catch(err => err);
    },
    lookMoreHospital() {
      // 查找更多的医院
      this.$router.push({ path: "/into_hospital" }).catch(err => err);
    },
    goToVip() {
      this.$router.push({ path: "/vip" }).catch(err => err);
    },
    goToMessageDetail(image) {
      //轮播图去资讯详情页
      this.$router.push({
        path: "/message_detail",
        query: { id: image.id, catid: image.catid }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.index-container
  padding-bottom 50px
  .swiper-box
    width 100%
    margin-top 10px
    /deep/.van-image
      display block
      width 100%
      height 100%
  .nav-box
    height 100px
    display flex
    align-items center
    background #FFFFFF
    margin-bottom 10px
    .item
      flex 1
      text-align center
      .icon
        width 40px
        height 40px
        color #343434
        font-size 14px
        margin 0 auto
        margin-bottom 10px
        &.i1
          background url('./1.png') no-repeat center
          background-size cover
        &.i2
          background url('./2.png') no-repeat center
          background-size cover
        &.i3
          background url('./3.png') no-repeat center
          background-size cover
        &.i4
          background url('./4.png') no-repeat center
          background-size cover
        &.i5
          background url('./5.png') no-repeat center
          background-size cover
  .hospital-box,.base-box
    background #fff
    .title
      height 40px
      padding-left 12px
      line-height 40px
      font-size 17px
      color #343434
      overflow hidden
      box-sizing border-box
      position relative
      span
        margin-left 10px
        color #9A9A9A
        font-size 12px
      .look-bar
        position absolute
        right 12px
        top 0
        height 40px
        text-align center
        color #165CBC
        font-size 12px
        line-height 40px
    .h-ul
      padding 0 10px
      padding-top 10px
      padding-bottom 10px
      // height auto
      column-gap 10px
      column-count 2
      // margin-left 12px
      border-bottom 1px solid #e5e5e5
      display:inline-block;
      width: 100%;
      text-align: left;
      li
        break-inside avoid
        // padding-right 12px
        padding-bottom 10px
        break-after: right
        width 100%
    .base-ul
      padding 10px 12px
      border-bottom 1px solid #e5e5e5
      li
        width 100%
        margin-bottom 10px
  .vip-box
    width 100%
    margin-bottom 10px
    padding 5px 12px
    background #fff
    img
      display block
      width 100%
      height 100%
  .online-box
    background #fff
    margin-top 10px
    .title
      font-size 17px
      color #343434
      height 40px
      line-height 40px
      padding-left 12px
      background #fff
      position relative
      .look-bar
        position absolute
        right 12px
        top 0
        height 40px
        text-align center
        color #165CBC
        font-size 12px
        line-height 40px
    .o-ul
      margin-left 12px
      li
        width 100%
        border-bottom 1px solid #e5e5e5
    .e-ul
      padding-top 10px
      column-gap 0
      column-count 2
      margin-left 12px
      border-bottom 1px solid #e5e5e5
      padding-bottom 5px
      li
        break-inside avoid
        break-after: left
        padding-right 12px
        padding-bottom 10px
  .tips
    line-height 30px
    font-size 14px
    color #999
    text-align center
.van-overlay
  background rgba(235, 235, 235, .4)
  .loading
    position absolute
    left 50%
    top 50%
    transform translate(-50%,-50%)
</style>
