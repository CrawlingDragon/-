<template>
  <div class="good_base-container">
    <Header></Header>
    <ul class="base-ul" v-show="!noData">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <li
          v-for="item in list"
          :key="item.id"
          @click="goToBaseDetail(item.qrcode)"
        >
          <div
            class="status"
            :class="{
              glod: item.ctype == '8',
              base: item.ctype == '6',
              none: item.ctype == '0'
            }"
          >
            {{
              item.ctype == "8"
                ? "金牌认证"
                : item.ctype == "6"
                ? "基地认证"
                : "未认证"
            }}
          </div>
          <van-image class="img" :src="item.logo"></van-image>
          <div class="text">
            <div class="h2">{{ item.name }}</div>
            <div class="p2">{{ item.zwtype }} {{ item.guimo }}</div>
            <div class="join-time">
              <van-image class="avator" round :src="item.avatar"></van-image>
              <div class="time">{{ item.regtime }} 加入医院</div>
            </div>
            <div class="hospital">
              <div class="icon"></div>
              <span>{{ item.mpublic }}</span>
            </div>
          </div>
        </li>
      </van-list>
    </ul>
    <van-empty description="暂无优质基地" v-show="noData"></van-empty>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import { mapState } from "vuex";

export default {
  name: "wholeBaseList",
  components: { Header },
  props: {},
  metaInfo: {
    title: "优质基地"
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 0,
      noData: false,
      baseUrl: "http://demo.datav.114nz.com/base_code/#/?gbasecode="
    };
  },
  computed: {
    ...mapState(["uid", "initMid"])
  },
  created() {},
  watch: {},
  mounted() {
    // this.getBaseList(this.mid);
    // this.getBaseList(63580);
  },
  destroyed() {},
  methods: {
    onLoad() {
      this.getBaseList();
    },
    getBaseList() {
      // 或者基地列表
      this.page += 1;
      this.$axios
        .fetchPost("/API/Mpublic/getFineBaseCom", {
          mId: this.initMid,
          page: this.page,
          isall: "all",
          location: window.localStorage.getItem("city")
        })
        .then(res => {
          if (res.data.code == 0) {
            this.list = this.list.concat(res.data.data);
            this.loading = false;
          } else if (res.data.code == 201) {
            if (this.page == 1) {
              this.noData = true;
            }
            this.finished = true;
          }
        });
    },
    goToBaseDetail(url) {
      window.location.href = url;
    }
  }
};
</script>
<style lang="stylus" scoped>
.good_base-container
  .base-ul
    margin-top 10px
    background #fff
    padding-left 12px
    li
      display flex
      padding 20px 0
      position relative
      border-bottom 1px solid #e5e5e5
      &:last-child
        border none
      .status
        position absolute
        left 0
        top 30px
        background #ff6600
        color #fff
        font-size 12px
        border-top-right-radius 100px
        border-bottom-right-radius 100px
        width 65px
        height 20px
        line-height 20px
        text-align center
        z-index 1
        font-size 12px
        &.gold
          background #ff6600
        &.base
          background #155BBB
        &.none
          background #838383
      .img
        width 105px
        height 105px
        margin-right 14px
      .text
        flex 1
        min-width 0
        .h2
          color #000000
          font-size 15px
          line-height 20px
        .p2
          font-size 12px
          color #999999
          margin-top 5px
        .join-time
          display flex
          align-items center
          margin-top 10px
          .avator
            width 30px
            height 30px
            margin-right 5px
          .time
            color #999
            font-size 12px
        .hospital
          display flex
          align-items center
          margin-top 10px
          color #999999
          font-size 12px
          margin-left 2px
          .icon
            width 20px
            height 20px
            margin-right 10px
            background url(./54.png) no-repeat
            background-size 100% 100%
            background-position center center
  .tip
    font-size 12px
    color #999
    padding 15px 0
    text-align center
</style>
