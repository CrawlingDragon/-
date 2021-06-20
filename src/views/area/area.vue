<template>
  <div class="area-container">
    <Headers ref="header"></Headers>
    <van-overlay :show="show" class="loading" z-index="222">
      <div class="wrapper" @click.stop>
        <van-loading type="spinner" vertical />
      </div>
    </van-overlay>
    <div class="area-content" :class="{ searchBox: searchBox }">
      <form action="/">
        <van-search
          v-model="value"
          show-action
          clearable
          placeholder="输入城市名、拼音或字母查询"
          @search="onSearch"
          @input="onSearch"
          @cancel="onCancel"
          class="search-input"
          :class="{ searchBox: searchBox }"
        />
      </form>
      <div class="tip-title" v-show="localCity">定位/最近访问</div>
      <div
        class="choosed-area location"
        v-show="locationAddress != 'init'"
        @click="choose(locationAddress, 2)"
      >
        {{ locationAddress }}
      </div>
      <div
        class="choosed-area"
        v-show="localCity"
        @click="choose(localCity, localLevel)"
      >
        {{ localCity }}
      </div>
      <div class="tip-title">热门城市</div>
      <ul class="hot-city-ul">
        <li
          v-for="item in hotCity"
          :key="item.id"
          @click="choose(item.name, item.level)"
        >
          {{ item.name }}
        </li>
      </ul>
      <van-index-bar :sticky-offset-top="40" :index-list="indexList">
        <template v-for="item in computedList">
          <van-index-anchor :index="item.letter" :key="item.letter" />
          <van-cell
            :title="it.name"
            v-for="it in item.letterlist"
            :key="it.name"
            @click="choose(it.name, it.level)"
          />
        </template>
      </van-index-bar>
    </div>
    <div class="search-content" v-show="searchBox">
      <div
        class="item"
        v-for="item in searchAddress"
        :key="item.name"
        @click="choose(item.name, item.level)"
      >
        {{ item.name }}
      </div>
      <van-empty description="未搜索到符合条件的内容" v-show="noData" />
    </div>
  </div>
</template>
<script>
import Headers from "@/components/header/header";
import { mapState, mapMutations } from "vuex";
export default {
  name: "area_page",
  components: { Headers },
  props: {},
  data() {
    return {
      city: "",
      localCity: "",
      localLevel: "",
      value: "",
      hotCity: [],
      list: [],
      searchAddress: [],
      searchBox: false,
      noData: false,
      show: true
    };
  },
  computed: {
    ...mapState(["initMid", "locationAddress"]),
    initSearchListAll() {
      let arr = [];
      this.list.forEach(item => {
        arr = arr.concat(item.letterlist);
      });
      return arr;
    },
    computedList() {
      let arr = [];
      arr = this.list.filter(item => {
        return item.letterlist.length != 0;
      });
      return arr;
    },
    indexList() {
      let arr = [];
      this.list.forEach(item => {
        if (item.letterlist.length != 0) {
          arr.push(item.letter);
        }
      });
      return arr;
    }
  },
  watch: {},
  mounted() {
    this.getAreaList();
    this.city = this.$route.query.city;
    this.localCity = window.localStorage.getItem("city");
    this.localLevel = window.localStorage.getItem("level");
  },
  destroyed() {},
  methods: {
    ...mapMutations(["setHeaderLogo", "setHeaderText", "setInitMid"]),
    onSearch(val) {
      if (val != "") {
        this.page = 0;
        this.searchAddress = [];
        this.searchBox = true;
        this.filtrate(val);
        if (this.searchAddress.length == 0) {
          this.noData = true;
        } else {
          this.noData = false;
        }
      }
      if (val == "") {
        this.searchAddress = [];
        this.searchBox = false;
      }
    },
    filtrate(val) {
      this.initSearchListAll.forEach(item => {
        let name = item.name;
        if (name.includes(val)) {
          this.searchAddress.push(item);
        }
      });
    },
    onCancel() {
      this.searchBox = false;
    },
    choose(name, level) {
      window.localStorage.setItem("city", name);
      window.localStorage.setItem("level", level);
      this.$refs.header.city = name;
      setTimeout(() => {
        this.$router.go(-1);
        this.searchBox = false;
      }, 100);
    },
    getAreaList() {
      this.$axios
        .fetchGet("API/Position/getAreaPostion", { mId: this.initMid })
        .then(res => {
          if (res.data.code == 0) {
            this.hotCity = res.data.data.hotcity.letterlist;
            this.list = res.data.data.lists;
            this.show = false;
          }
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
.area-container
  background: #FFFFFF;
  .loading
    width 100%
    padding-top 50%
    height 100vh
  .area-content
    padding-top 12px
    padding-left 12px
    &.searchBox
      height 300px
      overflow hidden
      padding-top 60px
      position fixed
      top 40px
      right 0
      left 0
      z-index 3
    .search-input
      background: #EBEBEB;
      margin 0 12px 15px 0
      width auto
      border-radius 8px
      &.searchBox
        position fixed
        top 52px
        left 12px
        right 0
    .tip-title
      font-size 14px
      color: #999999;
      margin 15px 0
    .choosed-area
      min-width 23%
      display inline-block
      border: 1px solid #E5E5E5;
      border-radius: 8px;
      height 35px
      line-height 35px
      text-align center
      font-size: 16px;
      font-family: Microsoft YaHei;
      color: #333333;
      margin-right 12px
      &.location
        color #ff6600
        border 1px solid #ff6600
    .hot-city-ul
      font-size 0
      margin-right 12px
      li
        min-width 23%
        border: 1px solid #E5E5E5;
        border-radius: 8px;
        height 35px
        line-height 35px
        text-align center
        font-size: 16px;
        font-family: Microsoft YaHei;
        color: #333333;
        margin-right 2%
        display inline-block
        margin-bottom 10px
  .search-content
    position fixed
    left 0
    right 0
    bottom 0
    top 108px
    background #fff
    z-index 222
    overflow auto
    .item
      height 40px
      line-height 40px
      border-bottom 1px solid #e5e5e5
      text-indent 20px
</style>
