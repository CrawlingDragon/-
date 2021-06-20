<template>
  <div class="cetu_list-container">
    <Header :indexHeader="false"></Header>
    <!-- <HeaderHospital :header="headerKind" navHeader="测土配方" v-else></HeaderHospital> -->
    <ul class="cetu_ul">
      <li v-for="item in list" :key="item.id" @click="goToDetail(item.id)">
        <div class="top">
          <div class="title">
            {{item.title}}
          </div>
          <div class="time">{{item.showtime}}</div>
        </div>
        <div class="hospital">{{item.mpublic}}</div>
      </li>
    </ul>
    <van-empty description="暂无土壤检测报告" v-show="noData"></van-empty>
  </div>
</template>
<script>
import Header from "@/components/header/header";
// import HeaderHospital from "@/components/hospital_header/hospital_header";
import { mapState } from "vuex";

export default {
  name: "wholeCeTuList",
  components: { Header },
  props: {},
  metaInfo() {
    return {
      title: "土壤检测",
    };
  },
  created() {},
  data() {
    return {
      list: [],
      noData: false,
    };
  },
  computed: {
    ...mapState(["mid", "uid", "initMid"]),
  },
  watch: {},
  mounted() {
    this.getList();
  },
  destroyed() {},
  methods: {
    getList() {
      // 获取测土配方列表 医院
      this.noData = false;
      this.$axios
        .fetchPost("/API/Treatment/getTestingsoil", {
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
    getMeList(uid) {
      // 获取测土配方列表  个人
      this.$axios
        .fetchPost("/API/Treatment/getTestingsoil", { uId: uid })
        .then((res) => {
          if (res.data.code == 0) {
            this.list = res.data.data;
          }
        });
    },
    goToDetail(id) {
      this.$router.push({
        path: "/soil_detail",
        query: { id: id },
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.cetu_list-container
  .cetu_ul
    padding-left 12px
    background #fff
    margin-top 10px
    li
      border-bottom 1px solid #e5e5e5
      padding 14px 0 12px
      min-height 50px
      &:last-child
        border none
      .top
        display flex
        align-items center
        flex-wrap nowrap
        .title
          min-width 0
          flex 1
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          font-size 15px
          color #000
        .time
          width 100px
          margin-left 15px
          font-size 12px
          color #999
      .hospital
        width 100%
        color #999999
        font-size 12px
        line-height 22px
</style>
