<template>
  <div class="message_detail-container">
    <Header :indexHeader="false"></Header>
    <div class="content">
      <div class="title">{{detail.title}}</div>
      <div class="small-bar">
        <div class="left">{{detail.inputtime}} {{detail.copyfrom}}</div>
        <div class="right" @click="GoToHospital(mpublic.mid)">{{mpublic.title}}</div>
      </div>
      <div class="text" v-html="detail.content"></div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import { mapState } from "vuex";
export default {
  name: "messageDetail",
  components: { Header },
  metaInfo: {
    title: "资讯详情",
  },
  props: {},
  created() {},
  data() {
    return {
      id: this.$route.query.id,
      catid: this.$route.query.catid,
      detail: "",
      mpublic: "",
      from: this.$route.query.from,
    };
  },
  computed: {
    ...mapState(["mid"]),
  },
  watch: {
    $route() {
      this.id = this.$route.query.id;
      this.catid = this.$route.query.catid;
      this.getMessageDetail();
      this.from = this.$route.query.from
    },
  },
  mounted() {
    this.getMessageDetail();
  },
  destroyed() {},
  methods: {
    getMessageDetail() {
      this.$axios
        .fetchPost("/API/News/detail", {
          mId: this.mid,
          Id: this.id,
          catId: this.catid,
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.detail = res.data.data;
            this.mpublic = res.data.data.mpublic;
          }
        });
    },
    GoToHospital(mid) {
      this.$router.push({
        path: "/hospital",
        query: { mid: mid },
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.message_detail-container
  .content
    background #fff
    margin-top 10px
    padding 0 12px 20px
    .title
      color #333333
      font-size 17px
      line-height 20px
      padding-top 20px
      padding-bottom 14px
    .small-bar
      display flex
      justify-content space-between
      align-items center
      margin-bottom 25px
      .left
        color #999999
        font-size 12px
      .right
        color #155BBB
        font-size 12px
</style>
