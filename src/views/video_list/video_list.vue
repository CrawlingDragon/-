<template>
  <div class="video_list-container">
    <Header :indexHeader="false"></Header>
    <ul class="video-ul">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <li v-for="item in list" :key="item.id" @click="goToDetal(item.id)">
          <van-image class="img" fit="cover" radius="5px" :src="item.thumb"></van-image>
          <p class="p1">{{item.title}}</p>
        </li>
      </van-list>
    </ul>
  </div>
</template>
<script>
import Header from "@/components/header/header";
export default {
  name: "videoList",
  components: { Header },
  metaInfo: {
    title: "培训视频",
  },
  props: {},
  data() {
    return {
      list: [],
      page: 0,
      loading: false,
      finished: false,
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    onLoad() {
      this.getList();
    },
    getList() {
      this.page += 1;
      this.$axios
        .fetchPost("API/Video/getVideoList", {
          page: this.page,
          pagesize: 7,
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.loading = false;
            this.list = this.list.concat(res.data.data);
          } else if (res.data.code == 201) {
            this.finished = true;
          }
        });
    },
    goToDetal(id) {
      this.$router.push({
        path: "/video_detail",
        query: { id: id },
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.video_list-container
  padding-bottom 60px
  .video-ul
    margin-top 10px
    li
      border-bottom 1px solid #e5e5e5
      padding 15px 12px 0 12px
      background #fff
      &:last-child
        border none
      .img
        width 100%
        height 150px
      .p1
        height 45px
        line-height 45px
        color #333
        font-size 16px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
</style>
