<template>
  <div class="hospital_expert-container">
    <Header header="indexHeader" navHeader="专家"></Header>
    <ul class="expert-ul" v-if="!noData">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <li v-for="item in list" :key="item.id">
          <RecommendExpert :list="item"></RecommendExpert>
        </li>
      </van-list>
    </ul>
    <van-empty description="暂无医院专家" v-show="noData"></van-empty>
  </div>
</template>
<script>
import Header from "@/components/hospital_header/hospital_header";
import RecommendExpert from "@/components/recommend_expert/recommend_expert";
import { mapState } from "vuex";
export default {
  metaInfo: {
    title: "专家列表",
  },
  name: "hospitalExpert",
  components: { Header, RecommendExpert },
  props: {},
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 0,
      noData: false,
    };
  },
  created() {},
  computed: {
    ...mapState(["mid"]),
  },
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
        .fetchPost("API/User/expertList", { mId: this.mid, page: this.page,isall:'self' })
        .then((res) => {
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
  },
};
</script>
<style lang="stylus" scoped>
.hospital_expert-container
  .expert-ul
    margin-top 10px
    background #fff
    padding-left 12px
    // column-count 2
    // column-gap 0
    padding-top 10px
    padding-bottom 10px
    li
      padding-right 12px
      // break-inside avoid
      margin-bottom 10px
      width 50%
      display inline-block
      height 170px
      vertical-align top
      .recommend_expert-container
        height 100%
        position relative
        /deep/.top
          height 80px
          .right
            .address
              overflow hidden
              text-overflow ellipsis
              white-space nowrap
        /deep/.join
          position absolute
          bottom 5px
</style>
