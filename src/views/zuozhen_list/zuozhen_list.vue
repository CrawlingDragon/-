<template>
  <div class="zuozhen_list-container">
    <Header header="indexHeader" navHeader="坐诊巡诊" :mid="mid"></Header>
    <ul>
      <li v-for="item in list" :key="item.id" @click="goToDetail(item.id)">
        <p class="p1">{{item.title}}</p>
        <p class="p2">{{item.showtime}}</p>
      </li>
    </ul>
    <van-empty description="暂无医院就诊记录" v-if="noData"></van-empty>
  </div>
</template>
<script>
import Header from "@/components/hospital_header/hospital_header";
import { mapState } from "vuex";

export default {
  name: "zuozhenList",
  components: { Header },
  metaInfo: {
    title: "坐诊巡诊",
  },
  props: {},
  data() {
    return {
      list: [],
      noData: false,
    };
  },
  computed: {
    ...mapState(["mid"]),
  },
  created() {},
  watch: {},
  mounted() {
    this.getOnlineList();
  },
  destroyed() {},
  methods: {
    getOnlineList() {
      this.noData = false;
      this.$axios
        .fetchPost("/API/Treatment/getWenzhen", { mId: this.mid })
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
</style>
