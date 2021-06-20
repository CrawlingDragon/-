<template>
  <div class="zuozhen_list-container">
    <Header :indexHeader="false"></Header>
    <ul v-if="!noData">
      <li v-for="item in list" :key="item.id" @click="goToDetail(item.id)">
        <p class="p1">{{item.title}}</p>
        <p class="p2">{{item.showtime}}<span class="hospital">{{item.mpublic}}</span></p>
      </li>
    </ul>
    <van-empty description="暂无医院就诊记录" v-if="noData"></van-empty>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import { mapState } from "vuex";
export default {
  name: "wholeZuoZhenList",
  metaInfo: {
    title: "我的坐诊巡诊",
  },
  components: { Header },
  props: {},
  data() {
    return {
      list: [],
      noData: false,
    };
  },
  computed: {
    ...mapState(["uid", "initMid"]),
  },
  watch: {},
  created() {},
  mounted() {
    this.getOnlineList();
  },
  destroyed() {},
  methods: {
    getOnlineList() {
      this.noData = false;
      this.$axios
        .fetchPost("/API/Treatment/getWenzhen", {
          uId: this.uid,
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.list = res.data.data;
          } else if (res.data.code == 201) {
            this.noData = true;
          }
        });
    },
    goToDetail(id) {
      this.$router.push({
        path: "zuozhen_detail",
        query: { id: id },
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.zuozhen_list-container
  ul
    margin-top 10px
    padding-left 12px
    background #fff
    li
      height 75px
      padding 17px 12px
      padding-left 0
      background #fff
      border-bottom 1px solid #e5e5e5
      &:last-child
        border none
      .p1
        color #000000
        font-size 15px
        margin-bottom 5px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
      .p2
        color #999999
        font-size 12px
        span
          float right
</style>
