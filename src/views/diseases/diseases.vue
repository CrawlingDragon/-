<template>
  <div class="diseases-container">
    <Header header="x" @clickFastRightIcon="clickHeader" @rightIcon="showHeader"></Header>
    <div class="title" @click.stop="showBox" :class="{'lessIndex':titleZindex}">{{initDis}}
      <van-icon name="arrow-down" class="down" />
    </div>
    <div class="my-container"></div>
    <van-popup v-model="show" :get-container="getContainer" class="pop" :overlay="false" closeable>
      <div class="list">
        <div class="item" v-for="item in kindList" :key="item.catid" @click="changeDis(item)">{{item.catname}}</div>
      </div>
    </van-popup>
    <ul class="diseases-ul">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <li v-for="item in list" :key="item.id" @click="goToDetail(item)">
          <div class="wrap">
            <van-image class="img" :src="item.thumb" fit="cover"></van-image>
            <p class="p1">{{item.title}}</p>
          </div>
        </li>
      </van-list>
    </ul>
  </div>
</template>
<script>
import Header from "@/components/hospital_header/hospital_header";
import { mapState } from "vuex";
export default {
  name: "diseases",
  components: { Header },
  metaInfo: {
    title: "病虫害库",
  },
  props: {},
  data() {
    return {
      show: false,
      kindList: [],
      list: [],
      loading: false,
      finished: false,
      page: 0,
      catId: "",
      titleZindex: false,
      initDis: "蔬菜虫害",
    };
  },
  computed: {
    ...mapState(["mid"]),
  },
  watch: {
    $route() {},
  },
  created() {},
  mounted() {
    this.getKind();
  },
  destroyed() {},
  methods: {
    clickHeader() {
      this.titleZindex = false;
    },
    showHeader() {
      this.titleZindex = true;
      this.show = false;
    },
    changeDis(item) {
      //重新选择病虫害
      this.catId = item.catid;
      this.page = 0;
      this.list = [];
      this.show = false;
      this.onLoad();
      this.initDis = item.catname;
    },
    onLoad() {
      this.page += 1;
      this.$axios
        .fetchPost("/API/Picture/getList", {
          catId: this.catId,
          page: this.page,
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.list = this.list.concat(res.data.data);
            this.loading = false;
          } else if (res.data.code == 201) {
            this.finished = true;
          }
        });
    },
    getKind() {
      this.$axios
        .fetchPost("API/Picture/getCategorys", { mId: this.mid })
        .then((res) => {
          if (res.data.code == 0) {
            this.kindList = res.data.data;
          }
        });
    },
    // 返回一个特定的 DOM 节点，作为挂载的父节点
    getContainer() {
      return document.querySelector(".my-container");
    },
    showBox() {
      this.show = true;
    },
    goToDetail(item) {
      this.$router.push({
        path: "/diseases_detail",
        query: {
          catid: item.catid,
          id: item.id,
        },
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.diseases-container
  position relative
  & > .title
    position fixed
    left 12px
    color #155BBB
    z-index 5
    width 200px
    top 10px
    &.lessIndex
      z-index 3
  .pop
    width 100%
    height 200px
    top 141px
    padding 15px
    .list
      margin-bottom 15px
      color #333333
      font-size 15px
      & > .item
        padding 5px 9px
        display inline-block
        background #F6F6F6
        border-radius 4px
        margin-right 15px
        margin-bottom 10px
      &.list2
        & > .item
          padding 5px 15px
  .diseases-ul
    padding-left 12px
    font-size 0
    margin-top 10px
    li
      width 50%
      padding-right 12px
      display inline-block
      margin-bottom 20px
      .wrap
        .img
          width 100%
          height 127px
          background #FFDCC4
        .p1
          height 48px
          line-height 48px
          color #333
          font-size 15px
          padding-left 10px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          background #fff
</style>
