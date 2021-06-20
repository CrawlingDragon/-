<template>
  <div class="video_detail-container">
    <Header :indexHeader="false"></Header>
    <div class="video-box">
      <video :src="detail.videourl" class="video" controls></video>
    </div>
    <div class="title">{{detail.title}}</div>
    <div class="text">{{detail.content}}</div>
  </div>
</template>
<script>
import Header from "@/components/header/header";
export default {
  name: "videoDetail",
  components: {
    Header,
  },
  props: {},
  data() {
    return {
      id: this.$route.query.id,
      detail: "",
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.getDetail();
  },
  destroyed() {},
  methods: {
    getDetail() {
      this.$axios
        .fetchPost("API/Video/getVideoDetail", { id: this.id })
        .then((res) => {
          if (res.data.code == 0) {
            this.detail = res.data.data;
          }
        });
    },
  },
};
</script>
<style lang="stylus" scoped>
.video_detail-container
  min-height 100%
  width 100%
  position absolute
  bottom 60px
  top 0px
  background #fff
  .video-box
    padding 15px
    padding-top 60px
    .video
      width 100%
      height auto
  .title
    font-size 18px
    color #333
    line-height 22px
    padding 0 12px
    margin-bottom 15px
  .text
    font-size 14px
    color #999
    line-height 18px
    padding 0 12px 20px
    margin-bottom 60px
</style>
