<template>
  <div class="me_hospital-container">
    <Header :indexHeader="false"></Header>
    <ul class="me-ul" v-show="!noData && initShow">
      <li v-for="item in list" :key="item.id">
        <RecommendHospital :list="item"></RecommendHospital>
      </li>
    </ul>
    <div class="title" v-show="!noData && initShow">已加入{{total}}家医院</div>
    <van-empty description="您还没有加入过医院" v-if="noData"></van-empty>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import RecommendHospital from "@/components/recommend_hospital/recommend_hospital";
import { mapState } from "vuex";
export default {
  name: "meHospital",
  components: { Header, RecommendHospital },
  metaInfo: {
    title: "我加入的医院",
  },
  props: {},
  data() {
    return {
      list: [],
      total: "",
      noData: false,
      initShow: false,
    };
  },
  computed: {
    ...mapState(["uid"]),
  },
  created() {},
  watch: {},
  mounted() {
    this.getList();
  },
  destroyed() {},
  methods: {
    getList() {
      this.noData = false;
      this.$axios
        .fetchPost("API/user/myJoinHospital", { uId: this.uid })
        .then((res) => {
          if (res.data.code == 0) {
            this.list = res.data.data.list;
            this.total = res.data.data.total;
            this.initShow = true;
          } else if (res.data.code == 201) {
            this.noData = true;
          }
        });
    },
  },
};
</script>
<style lang="stylus" scoped>
.me_hospital-container
  .me-ul
    padding-left 12px
    column-gap 0
    column-count 2
    background #fff
    padding-bottom 15px
    padding-top 15px
    margin-top 10px
    li
      break-inside avoid
      margin-right 12px
      margin-bottom 15px
  .title
    font-size 12px
    color #999999
    padding 15px 0
    text-align center
</style>
