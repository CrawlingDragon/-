<template>
  <div class="look_expert-container">
    <Header></Header>
    <ul class="expert-ul">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <li v-for="item in list" :key="item.id">
          <RecommendExpert :list="item"></RecommendExpert>
        </li>
      </van-list>
    </ul>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import RecommendExpert from "@/components/recommend_expert/recommend_expert";
import { mapState } from "vuex";

export default {
  metaInfo() {
    return {
      title: "专家"
    };
  },
  name: "lookExpert",
  components: { Header, RecommendExpert },
  props: {},
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 0
    };
  },
  created() {},
  computed: {
    ...mapState(["initMid"])
  },
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    onLoad() {
      this.getExpertList();
    },
    getExpertList() {
      // 获取专家列表
      this.page += 1;
      this.$axios
        .fetchPost("/API/User/expertList", {
          mId: this.initMid,
          pagesize: 8,
          page: this.page,
          isall: "all",
          location: window.localStorage.getItem("city")
        })
        .then(res => {
          if (res.data.code == 0) {
            this.loading = false;
            this.list = this.list.concat(res.data.data);
          } else if (res.data.code == 201) {
            this.finished = true;
          }
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
.look_expert-container
  .expert-ul
    margin-top 10px
    background #fff
    padding-left 12px
    padding-top 10px
    padding-bottom 10px
    padding-bottom 60px
    li
      width 50%
      display inline-block
      padding-right 12px
      margin-bottom 10px
      vertical-align top
      .recommend_expert-container
        min-height 185px
        /deep/.time
          display none
</style>
