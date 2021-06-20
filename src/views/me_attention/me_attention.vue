<template>
  <div class="me_attention-container">
    <Header :indexHeader="false"></Header>
    <van-tabs v-model="active" sticky title-active-color="#155BBB" color="#155BBB">
      <van-tab title="医院">
        <ul class="hospital-ul" v-if="!noDataHospital">
          <li v-for="item in hospitalList" :key="item.id">
            <RecommendHospital :list="item"></RecommendHospital>
          </li>
        </ul>
        <van-empty description="暂无关注医院" v-if="noDataHospital"></van-empty>
      </van-tab>
      <van-tab title="专家">
        <ul v-if="!noDataExpert">
          <li v-for="item in expertList" :key="item.id">
            <RecommendExpert :list="item"></RecommendExpert>
          </li>
        </ul>
        <van-empty description="暂无关注专家" v-if="noDataExpert"></van-empty>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import RecommendHospital from "@/components/recommend_hospital/recommend_hospital";
import RecommendExpert from "@/components/recommend_expert/recommend_expert";
import { mapState } from "vuex";

export default {
  metaInfo: {
    title: "我的关注",
  },
  name: "meAttention",
  components: { Header, RecommendExpert, RecommendHospital },
  props: {},
  data() {
    return {
      active: 0,
      hospitalList: [],
      expertList: [],
      noDataHospital: false,
      noDataExpert: false,
    };
  },
  computed: {
    ...mapState(["uid"]),
  },
  watch: {},
  mounted() {
    this.hospitals();
    this.experts();
  },
  destroyed() {},
  methods: {
    hospitals() {
      this.noDataHospital = false;
      this.$axios
        .fetchPost("API/user/getFavoriteHospital", {
          uId: this.uid,
          pagesize: 40,
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.hospitalList = res.data.data;
          } else if (res.data.code == 201) {
            this.noDataHospital = true;
          }
        });
    },
    experts() {
      this.noDataExpert = false;
      this.$axios
        .fetchPost("API/user/getFavoriteExpert", {
          uId: this.uid,
          pagesize: 40,
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.expertList = res.data.data;
          } else if (res.data.code == 201) {
            this.noDataExpert = true;
          }
        });
    },
  },
};
</script>
<style lang="stylus" scoped>
.me_attention-container
  ul
    column-count 2
    column-gap 0
    padding 12px 0 12px 12px
    background #fff
    margin-top 12px
    li
      break-inside avoid
      padding-right 12px
      margin-bottom 12px
      /deep/.join-number
        display none
</style>
