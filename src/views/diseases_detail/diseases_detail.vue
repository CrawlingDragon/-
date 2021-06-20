<template>
  <div class="diseases_detail-container">
    <Header :indexHeader="false"></Header>
    <div class="content">
      <div class="title">{{detail.title}}</div>
      <van-swipe class="my-swipe" :autoplay="4000" indicator-color="white">
        <van-swipe-item v-for="item in swiperImg" :key="item">
          <van-image fit="cover" :src="item.url"></van-image>
        </van-swipe-item>
      </van-swipe>
      <div class="text" v-html="detail.content"></div>
    </div>
    <div class="next" @click="goTonext">下一篇: {{nextTitle}} ></div>
  </div>
</template>
<script>
import Header from "@/components/header/header";
export default {
  name: "diseasesDetail",
  components: { Header },
  metaInfo: {
    title: "病虫害详情",
  },
  props: {},
  data() {
    return {
      catid: this.$route.query.catid,
      id: this.$route.query.id,
      detail: "",
      nextTitle: "",
      swiperImg: [],
    };
  },
  computed: {},
  watch: {
    $route() {
      this.catid = this.$route.query.catid;
      this.id = this.$route.query.id;
      this.getDetail();
    },
  },
  created() {},
  mounted() {
    this.getDetail();
  },
  destroyed() {},
  methods: {
    getDetail() {
      this.$axios
        .fetchPost("/API/Picture/getDetail", {
          catId: this.catid,
          id: this.id,
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.detail = res.data.data;
            this.nextTitle = res.data.data.next_page.title;
            this.swiperImg = res.data.data.pictureurls;
          }
        });
    },
    goTonext() {
      this.$router.push({
        path: "/diseases_detail",
        query: {
          catid: this.detail.next_page.catid,
          id: this.detail.next_page.id,
        },
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.diseases_detail-container
  padding-bottom 50px
  .text 
     word-break: break-all;
  .content
    margin-top 10px
    background #fff
    padding 0 12px 20px
    .title
      color #333333
      font-size 17px
      padding 15px 0 15px
  .next
    text-align right
    padding 20px 12px
    color #155BBB
    font-size 16px
    line-height 1.2
  .my-swipe
    height 200px
    margin-bottom 20px
</style>
