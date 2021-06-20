<template>
  <!-- 首页推荐的header -->
  <div class="header-container ">
    <div class="wrap van-hairline--top van-hairline--bottom">
      <slot></slot>
      <div
        class="location van-hairline--right"
        v-if="indexHeader"
        @click="goToArea"
        v-show="!haveBackIcon"
      >
        {{ city }}<van-icon name="arrow-down" />
      </div>
      <div
        class="search-icon"
        v-if="indexHeader"
        @click="goToSearch"
        v-show="!haveBackIcon"
      >
        <van-icon name="search" />
      </div>
      <!-- <div class="tabbar" v-if="indexHeader">
        <div
          class="item"
          :class="{ active: tabbarActive == 0 }"
          @click="goToIndex"
        >
          推荐
        </div>
        <div
          class="item"
          :class="{ active: tabbarActive == 1 }"
          @click="goToOnline"
        >
          网诊
        </div>
      </div> -->
      <div
        class="no_index_header"
        v-if="!indexHeader && !goBackHeader"
        @click="clickLogo"
      >
        <van-image :src="headerLogo" class="logo"></van-image>
        {{ headerText }}
      </div>
      <div
        class="no_index_header"
        v-if="!indexHeader && goBackHeader"
        @click="routerBack"
      >
        <van-icon name="arrow-left" class="arrow-left" size="16" />
        <span class="back">返回</span>
      </div>
      <div class="right-nav van-hairline--left">
        <div class="index-icon" @click.stop="goToIndex">
          <!-- <van-icon name="wap-home-o" /> -->
        </div>
        <div class="fast-nav-icon" @click="openFastNav"></div>
      </div>
      <fastNav :showFlag="fastNavShowFlag" @changeFlag="closeFaseNav"></fastNav>
    </div>
  </div>
</template>
<script>
import AMap from "AMap";
import fastNav from "@/components/fast_nav/fast_nav";
import { mapMutations, mapState } from "vuex";
export default {
  name: "headers",
  components: { fastNav },
  props: {
    indexHeader: {
      type: Boolean,
      default: true
    },
    goBackHeader: {
      type: Boolean,
      default: false
    },
    haveBackIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fastNavShowFlag: false,
      user: {},
      city: window.localStorage.getItem("city") // 定位或者选择的地址
    };
  },
  computed: {
    ...mapState([
      "uid",
      "initMid",
      "headerLogo",
      "headerText",
      "locationAddress"
    ])
  },
  watch: {
    $route() {
      this.fastNavShowFlag = false;
    },
    city() {
      this.initLoca();
    }
  },
  mounted() {
    this.city = window.localStorage.getItem("city");
    if (this.locationAddress == "init") {
      this.initLoca();
    }
  },
  destroyed() {},
  methods: {
    initLoca() {
      let session_city = window.localStorage.getItem("city");
      let session_level = window.localStorage.getItem("level");
      if (this.locationAddress == "init") {
        //定位城市
        let that = this;
        AMap.plugin("AMap.CitySearch", function() {
          var citySearch = new AMap.CitySearch();
          citySearch.getLocalCity(function(status, result) {
            if (status === "complete" && result.info === "OK") {
              // 查询成功，result即为当前所在城市信息

              that.city = result.city;
              that.changeCity(result.city, 2);
              that.setLocationAddress(result.city);
              window.localStorage.setItem("city", result.city);
              window.localStorage.setItem("level", 2);
            } else {
              let errorCity = "定位失败";
              that.city = errorCity;
              that.changeCity(errorCity, 2);
              that.setLocationAddress(errorCity);
              window.localStorage.setItem("city", errorCity);
              window.localStorage.setItem("level", 2);
            }
          });
        });
        return;
      }
      if (session_city) {
        this.city = session_city;
        this.changeCity(session_city, session_level);
        return;
      }
    },
    changeCity(areacity, level) {
      // 获取地区mid
      level =
        areacity == ("北京市" || "上海市" || "天津市" || "重庆市") ? "1" : "2";
      this.$axios
        .fetchGet("API/Index/changearea", { areacity, level })
        .then(res => {
          if (res.data.code == 0) {
            this.setHeaderLogo(res.data.data.logo);
            this.setHeaderText(res.data.data.title);
            this.setInitMid(res.data.data.mid);
          }
        });
    },
    clickLogo() {
      this.$emit("clickLogoImg");
      this.$router.push({ path: "/index" }).catch(err => err);
    },
    routerBack() {
      this.$router.go(-1);
    },
    goToSearch() {
      // 路由  搜索网诊
      this.$router
        .push({
          path: "/search_online"
        })
        .catch(err => err);
      this.fastNavShowFlag = false;
    },
    goToOnline() {
      // 路由  网诊
      this.$router.push({ path: "/index_online" }).catch(err => err);
      this.fastNavShowFlag = false;
    },
    goToIndex() {
      // 路由 首页
      this.$router.push({ path: "/index" }).catch(err => err);
    },
    openFastNav() {
      // 打开快速导航
      this.fastNavShowFlag = !this.fastNavShowFlag;
    },
    closeFaseNav(boolean) {
      // 关闭快速导航
      this.fastNavShowFlag = boolean;
    },
    goToArea() {
      this.$router.push({
        path: "/area",
        query: { city: this.city }
      });
    },
    ...mapMutations([
      "setInitMid",
      "setLocationAddress",
      "setHeaderLogo",
      "setHeaderText"
    ])
  }
};
</script>
<style lang="stylus" scoped>
.header-container
  height 40px
  line-height 40px
  position fixed
  top 0
  right 0
  left 0
  z-index 2
  width 100%
  .wrap
    display flex
    max-width 640px
    width 100%
    margin 0 auto
    background #FFFFFF
    height 100%
  .location
    min-width 87px
    display flex
    align-items center
    justify-content center
    font-size: 15px;
    color: #333333;
    padding 0 3px
    & > i
        margin-left 5px
  .search-icon
    margin-left 20px
    margin-right 20px
    font-size 25px
    color #9D9D9D
    flex 1
    display flex
    align-items center
    .van-icon
      line-height inherit
  .tabbar
    font-size 15px
    line-height inherit
    flex 1
    & > .item
      display inline-block
      color #999999
      margin-right 20px
      box-sizing border-box
      &.active
        color #155BBB
        font-size 17px
        border-bottom 2px solid #155BBB
  .right-nav
    width 85px
    display flex
    justify-content space-around
    align-items center
    color #9D9D9D
    .index-icon
      display inline-block
      background url('./46.png') no-repeat
      background-position center center
      background-size 20px 20px
      width 20px
      height 20px
    .fast-nav-icon
      display inline-block
      background url('./sx_47.png') no-repeat
      background-position center center
      background-size 20px 20px
      width 20px
      height 20px
    .van-icon
      line-height inherit
  .no_index_header
    flex 1
    display flex
    align-items center
    color #333
    .logo
      width 20px
      height 20px
      margin-left 12px
      margin-right 10px
    .arrow-left
      color #999999
      margin-right 5px
      padding-left 12px
    .back
      color #999
      padding-right 5px
</style>
