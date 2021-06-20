<template>
  <div class="crop_management-container">
    <div class="nav-bar van-hairline--bottom" ref="h1">
      <router-link
        class="nav"
        :to="{
          path: '/cropManagement',
          query: { pId: this.$route.query.pId, gId: this.$route.query.gId }
        }"
        replace
      >
        农事管理
      </router-link>
      <router-link
        class="nav"
        :to="{
          path: '/cropRecord',
          query: { pId: this.$route.query.pId, gId: this.$route.query.gId }
        }"
        replace
        >农事记录</router-link
      >
    </div>
    <div class="progress-box van-hairline--bottom" ref="h2">
      <div v-for="it in navProgressList" :key="it.classname">
        <ProgressItem :item="it"></ProgressItem>
      </div>
    </div>
    <div class="period-box">
      <van-sticky :offset-top="40" @scroll="stickyChange">
        <div class="period-title-bar">
          <div class="title-content" ref="title">
            <div
              v-for="(item, index) in navProgressList"
              :key="item.classname"
              ref="item"
              class="item-wrap"
              :class="{ active: index == active1 }"
              @click="clickHandle(item, index)"
            >
              <div class="item">
                {{ item.classname }}
              </div>
              <van-icon name="arrow" class="arrow" />
            </div>
          </div>
        </div>
      </van-sticky>
      <div :class="{ paddingTop: isFixed }">
        <div
          ref="periods"
          v-for="item in management"
          :key="item.clasname"
          class="periods"
        >
          <Period :period="item"></Period>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Period from "./period.vue";
import ProgressItem from "./progress_item.vue";
import axios from "@/http";
import { mapState } from "vuex";
export default {
  name: "crop_management",
  components: { Period, ProgressItem },
  props: {},
  data() {
    return {
      w: 0,
      management: [],
      active1: 0,
      active: 0,
      isFixed: false,
      topArr: [] //各个dom的offsetTop
    };
  },
  computed: {
    ...mapState(["uid"]),
    pId() {
      // 农事管理的pId
      return this.$route.query.pId;
    },
    navProgressList() {
      // 头部的各时期进度条
      let arr = [];
      this.management.forEach((item, index) => {
        if (item.classname) {
          arr.push({
            classname: item.classname,
            percent: item.percent,
            option: this.topArr[index]
          });
        }
      });
      return arr;
    }
  },
  watch: {
    management() {
      this.$nextTick(() => {
        this.$refs.periods.forEach(item => {
          this.topArr.push(item.offsetTop - 100);
        });
      });
    }
  },
  mounted() {
    this.getmanagementData();
    window.addEventListener("scroll", this.scrollHander, false);
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollHander, false);
  },
  methods: {
    stickyChange(obj) {
      this.isFixed = obj.isFixed;
    },
    clickHandle(top, index) {
      this.$nextTick(() => {
        this.top = this.$refs.periods[index].offsetTop;

        window.scrollTo({
          top: this.top - 70,
          behavior: "smooth"
        });
        setTimeout(() => {
          this.active1 = index;
        }, 201);
      });
    },
    scrollHander() {
      const aa = document.documentElement.scrollTop;
      setTimeout(() => {
        const arr = [...this.navProgressList].reverse();
        for (var i = 0; i < arr.length; i++) {
          let option = arr[i].option;
          if (option <= aa) {
            this.active1 = this.active = arr.length - i - 1;
            break;
          }
        }
        this.active1 = this.active;
      }, 200);
    },
    getmanagementData() {
      // 获取农事管理数据
      axios
        .fetchGet("/API/User/getBaseTasklists", {
          pId: this.pId,
          uId: this.uid
        })
        .then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.management = data.data;
            this.getNavWidth();
          } else {
            alert(data.message);
          }
        });
    },
    getNavWidth() {
      // 导航左右滑动 初级效果
      this.$nextTick(() => {
        this.$refs.item.forEach(it => {
          let w1 = it.offsetWidth;
          this.w += w1;
        });
        this.$refs.title.style.width = this.w + "px";
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.van-progress
  background #D5E3FD
.crop_management-container
  .nav-bar
    height 50px
    line-height 50px
    display flex
    text-align center
    .nav
      flex 1
      color #666666
      font-size 15px
      background #fff
      &.router-link-active
        color #155BBB
        position relative
        &::after
          content ''
          position absolute
          left 50%
          bottom 0px
          width 30px
          height 3px
          background #155BBB
          border-radius: 3px;
          margin-left -15px
  .progress-box
    background #fff
    padding 10px 0
    .item
      display flex
      align-items center
      height 31px
      .left
        width 100px
        font-size 14px
        color #333
        padding 0 10px 0 10px
      .mid
        flex 1
        min-width 0
      .right
        width 60px
        text-align left
        padding-left 15px
        color #155BBB
        font-size 14px
  .period-box
    background #fff
    padding-top 20px
    .period-title-bar
      width 100%
      overflow auto
      padding 5px 12px
      background #fff
      .title-content
        .item-wrap
          display inline-block
          padding-right 12px
          .item
            padding 8px 13px
            background: #F1FAFE;
            border-radius: 8px;
            color #155BBB
            font-size 14px
            display inline-block
          .arrow
            display inline-block
            padding 0 9px
            vertical-align middle
            color #D5E3FD
            font-size 11px
          &:last-child
            .arrow
              display none
          &.active
            .item
              background #155BBB
              color #FFFFFF
// .paddingTop
//   padding-top 87px
</style>
