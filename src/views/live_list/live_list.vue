<template>
  <div class="live_list-container">
    <Header header="logoHeader"></Header>
    <div class="title">{{detail.title}}</div>
    <div class="hospital-name" @click="goToHospital()">{{detail.name}}</div>
    <div class="list-content" v-html="detail.content"></div>
  </div>
</template>
<script>
import Header from "@/components/hospital_header/hospital_header";
import { mapMutations } from "vuex";
export default {
  name: "liveList",
  metaInfo: {
    title: "直播节目单",
  },
  components: { Header },
  props: {},
  data() {
    return {
      detail: "",
      mid: this.$route.query.mid,
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.getDetail();
  },
  destroyed() {},
  methods: {
    ...mapMutations(["setMid"]),
    getDetail() {
      this.$axios
        .fetchPost("/API/Live/getLiveMenu", { mId: this.mid })
        .then((res) => {
          if (res.data.code == 0) {
            this.detail = res.data.data;
          }
        });
    },
    goToHospital() {
      this.setMid(this.detail.mid);
      this.$router.push({
        path: "/hospital",
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.live_list-container
  background #fff
  .list-content
    background #fff
  .title
    text-align center
    padding 0 12px
    padding 12px
    font-size 20px
  .hospital-name
    text-align right
    color #155BBB
    padding-right 12px
    margin-bottom 20px
    font-size 14px
  /deep/img
    max-width 100%
</style>
