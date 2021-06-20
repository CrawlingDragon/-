<template>
  <div class="live-container">
    <Header :indexHeader="false" v-if="from == 'index'"></Header>
    <HospitalHeader indexHeader="indexHeader" navHeader="直播" v-else></HospitalHeader>
    <div class="program" @click="goLive" v-if="menum == 1">直播节目单</div>
    <ul class="live-ul">
      <li v-for="item in list" :key="item.id" @click.stop="liveHref(item.linkurl)">
        <van-image class="live-img" :src="item.thumb" fit="cover"></van-image>
        <div class="bottom">
          <div class="left">{{item.name}}</div>
          <div class="right">{{item.endtime}}</div>
        </div>
        <div class="hospital" @click.stop="goToHospital(item.mid)" v-if="from == 'index' && item.mname != ''">{{item.mname}}</div>
        <div class="status living" :class="{'living':item.status == '直播中','lived':item.status == '回放','before_live':item.status == '预告'}">{{item.status}}</div>
      </li>
    </ul>
    <van-empty :description="from == 'index'?'暂无直播,敬请期待':'本院暂无直播'" v-show="noData" />
    <div class="lookOther" @click="goToWholeLive" v-show="noData && from !='index'">查看其他直播</div>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import HospitalHeader from "@/components/hospital_header/hospital_header";
import { mapState, mapMutations } from "vuex";
export default {
  name: "live",
  components: { Header, HospitalHeader },
  metaInfo() {
    return {
      title: "直播",
    };
  },
  props: {},
  data() {
    return {
      list: [],
      menum: "",
      from: this.$route.query.from,
      noData: false,
    };
  },
  computed: {
    ...mapState(["mid", "initMid"]),
  },
  watch: {
    $route() {
      this.from = this.$route.query.from;
      this.getList();
    },
  },
  created() {},
  mounted() {
    this.getList();
  },
  destroyed() {},
  methods: {
    ...mapMutations(["setMid"]),
    getList() {
      this.noData = false;
      this.$axios
        .fetchPost("API/Live/getLiveList", { mId: this.mid,isall:this.from == 'index'?'all':'self' })
        .then((res) => {
          if (res.data.code == 0) {
            this.list = res.data.data;
            this.menum = res.data.hasmenu;
          } else if (res.data.code == 201) {
            this.noData = true;
          }
        });
    },
    liveHref(link) {
      window.location.href = link;
    },
    goLive() {
      this.$router.push({
        path: "/live_list",
        query: {
          mid: this.mid,
        },
      });
    },
    goToHospital(mid) {
      this.setMid(mid);
      this.$router.push({
        path: "/hospital",
      });
    },
    goToWholeLive() {
      this.setMid(this.initMid);
      this.$router.push({
        path: "/live",
        query: {
          from: "index",
        },
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.live-container
  .program
    width 80%
    margin 10px auto
    height 45px
    text-align center
    line-height 45px
    color #fff
    font-size 16px
    font-weight bold
    background linear-gradient(90deg, rgba(1, 181, 255, 1), rgba(0, 130, 254, 1))
    border-radius 8px
  .live-ul
    background #fff
    li
      padding 15px 12px 0
      border-bottom 1px solid #e5e5e5
      position relative
      &:last-child
        border-bottom none
      .live-img
        width 100%
        height 150px
      .bottom
        display flex
        justify-content space-between
        height 45px
        align-items center
        .left
          color #333333
          font-size 16px
        .right
          color #999999
          font-size 12px
      .status
        position absolute
        right 28px
        top 30px
        width 57px
        height 22px
        border-radius 23px
        text-align center
        line-height 22px
        font-size 12px
        color #fff
        &.living
          background #ff6600
        &.lived
          background #999999
        &.before_live
          background #155BBB
      .hospital
        color #155BBB
        text-align right
        padding-bottom 5px
  .lookOther
    line-height 40px
    font-size 18px
    color #155BBB
    text-align center
</style>
