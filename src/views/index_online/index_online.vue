<template>
  <div
    class="index_online-container"
    ref="online"
    :class="{ addressOverflow: addressFlag }"
  >
    <Header></Header>

    <van-sticky :offset-top="30" @scroll="scroll">
      <div class="choose-box" v-show="secondNav">
        <div class="back" @click="goBack"></div>
        <div class="all" @click="openBox" v-if="false">
          {{ areaName }}
          <van-icon name="arrow-down" class="down" />
        </div>
        <div class="crop" @click="goToChooseCrop">
          {{ crop }}
          <van-icon name="arrow-down" class="down" />
        </div>
        <div class="address-box" v-show="addressFlag" v-if="false">
          <div class="wrap">
            <div class="item" @click="chooseAddress(9999, '全部地区')">
              全部地区
            </div>
            <div class="item" @click="chooseAddress(1111, '绍兴市')">
              绍兴市
            </div>
            <van-icon name="cross" class="cross" @click="addressFlag = false" />
          </div>
        </div>
      </div>
    </van-sticky>
    <!-- <van-loading v-if="onlineArr.length == 0" vertical /> -->
    <!-- <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      loosing-text="下拉刷新"
      success-duration="1000"
      animation-duration="600"
    > -->
    <div class="online-box">
      <ul class="o-ul" ref="ul">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <li v-for="item in onlineArr" :key="item.id">
            <OnlineItem :list="item" @preImage="preverImg"></OnlineItem>
          </li>
        </van-list>
      </ul>
    </div>
    <!-- </van-pull-refresh> -->
    <!-- <Foot></Foot> -->
  </div>
</template>
<script>
var Before_scollH = 0;
import Header from "@/components/header/header.vue";
import OnlineItem from "@/components/online_item/online_item";
import { ImagePreview } from "vant";
import { mapState } from "vuex";
// import Foot from "@/components/foot/foot";
export default {
  name: "indexOnline",
  metaInfo: {
    title: "网诊"
  },
  components: {
    Header,
    OnlineItem,
    [ImagePreview.Component.name]: ImagePreview.Component
  },
  beforeRouteLeave(to, from, next) {
    // ... to
    window.scrollTo(0, 0);
    next();
  },
  props: {},
  data() {
    return {
      addressFlag: false,
      onlineArr: [],
      fid: this.$route.query.fid,
      crop: this.$route.query.name || "作物",
      areaName: "全部",
      page: 0,
      loading: false,
      finished: false,
      area: "",
      scollType: "",
      secondNav: true
      // isLoading: false //下拉model
    };
  },
  computed: {
    ...mapState(["mid", "uid", "initMid"])
  },
  watch: {
    fid() {
      this.fid = this.$route.query.fid;
      this.onlineArr = [];
      this.page = 0;
      this.getIndexData();
      // console.log("1 :>> ", 1);
    },
    crop() {
      this.crop = this.$route.query.name;
      this.onlineArr = [];
      this.page = 0;
      this.getIndexData();
    },
    area() {
      this.onlineArr = [];
      this.page = 0;
      this.getIndexData();
    }
  },
  created() {},
  mounted() {
    window.addEventListener("scroll", this.scrollHandler);
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollHandler);
  },
  methods: {
    scrollHandler() {
      var After_scollH =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      var differH = After_scollH - Before_scollH;
      if (differH == 0) {
        return false;
      }
      this.scollType = differH > 0 ? "down" : "up";
      Before_scollH = After_scollH;
    },
    scroll(val) {
      if (val.isFixed) {
        if (this.scollType == "down") {
          //显示导航
          this.secondNav = false;
          // console.log('down :>> ');
        } else {
          //隐藏导航
          this.secondNav = true;
          // console.log('up :>> ');
        }
      }
    },
    onLoad() {
      this.getIndexData();
    },
    getIndexData() {
      // 获取首页数据
      this.page += 1;
      this.$axios
        .fetchPost("/API/Wen/index", {
          mId: this.initMid,
          fId: this.fid,
          areaId: this.area,
          page: this.page,
          uId: this.uid,
          isall: "all",
          location: window.localStorage.getItem("city")
        })
        .then(res => {
          if (res.data.code == 0) {
            this.onlineArr = this.onlineArr.concat(res.data.data);
            this.loading = false;
            // this.isLoading = false
            // this.isLoading = false
          } else if (res.data.code == 201) {
            this.finished = true;
          }
        });
    },
    chooseAddress(area, name) {
      this.area = area;
      // this.getIndexData();
      this.areaName = name;
      this.finished = false;
      this.addressFlag = false;
    },
    goBack() {
      this.$router.push({ path: "/index" });
    },
    openBox() {
      this.addressFlag = !this.addressFlag;
    },
    preverImg(item) {
      //网诊的图片预览
      ImagePreview({
        images: item.arr,
        startPosition: item.index,
        closeable: true
      });
    },
    goToChooseCrop() {
      this.$router.push({
        path: "/choose_crop",
        query: { crop: this.crop }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.index_online-container
  padding-bottom 50px
  .header-container
    z-index 3
  &.addressOverflow
    position fixed
    left 0
    top 40px
    right 0
    bottom 0
    z-index 2
    padding-bottom 0
  .choose-box
    height 40px
    display flex
    align-items center
    background #fff
    border-bottom 1px solid #e5e5e5
    position relative
    margin-top 10px
    z-index 2
    .back
      width 25px
      height 25px
      background url('./70.png') no-repeat
      background-size 25px 25px
      background-position center
      padding 0 13px
      box-sizing content-box
      margin-right 20px
    .all
      font-size 15px
      color #333
      padding-right 34px
      line-height 40px
      display flex
      align-items center
      .down
        margin-left 5px
        font-size 18px
        color #999999
    .crop
      font-size 15px
      color #333
      padding-right 34px
      line-height 40px
      display flex
      align-items center
      .down
        margin-left 5px
        font-size 18px
        color #999999
    .address-box
      position fixed
      left 0
      right 0
      // height 75px
      bottom -3px
      background rgba(0, 0, 0, 0.7)
      top 90px
      // background #fff
      border-bottom 1px solid #e5e5e5
      z-index 111
      overflow hidden
      .wrap
        height 75px
        display flex
        align-items center
        background #fff
        padding-left 12px
      .item
        width 75px
        background #F6F6F6
        height 25px
        color #333333
        border-radius 8px
        font-size 15px
        text-align center
        line-height 25px
        margin-right 15px
      .cross
        font-size 18px
        position absolute
        right 15px
        top 14px
        color #9D9D9D
  .online-box
    background #fff
    .title
      font-size 17px
      color #343434
      height 40px
      line-height 40px
      padding-left 12px
      border-bottom 1px solid #e5e5e5
    .o-ul
      margin-left 12px
      li
        width 100%
        border-bottom 1px solid #e5e5e5
        &:last-child
          border none
    .e-ul
      padding-top 10px
      display flex
      flex-wrap wrap
      margin-left 12px
      border-bottom 1px solid #e5e5e5
      padding-bottom 5px
      li
        width 50%
        padding-right 12px
        margin-bottom 10px
</style>
