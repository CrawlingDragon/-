<template>
  <div class="message-container">
    <Header></Header>
    <HospitalHeader
      v-if="false"
      indexHeader="indexHeader"
      navHeader="资讯"
    ></HospitalHeader>
    <ul class="message-ul" v-show="!noData">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <li
          v-for="item in list"
          :key="item.id"
          @click="goToMessageDetail(item.id, item.catid)"
        >
          <MessageItem :list="item" :index="true"></MessageItem>
        </li>
      </van-list>
    </ul>
    <van-empty description="暂无资讯" v-show="noData"></van-empty>
    <Foot></Foot>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import HospitalHeader from "@/components/hospital_header/hospital_header";
import MessageItem from "@/components/message_item/message_item";
import { mapState } from "vuex";
import Foot from "@/components/foot/foot";
export default {
  metaInfo: {
    title: "资讯列表"
  },
  name: "message",
  components: { Header, MessageItem, HospitalHeader, Foot },
  props: {},
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 0,
      noData: false
    };
  },
  computed: {
    ...mapState(["mid", "initMid"])
  },
  created() {},
  watch: {
    // $route(newVal){
    //   // console.log('newVal :>> ', newVal);
    // }
  },
  mounted() {},
  destroyed() {},
  methods: {
    onLoad() {
      this.getList();
    },
    getList() {
      this.page += 1;
      this.$axios
        .fetchPost("/API/News/index", {
          mId: this.initMid,
          page: this.page,
          location: window.localStorage.getItem("city")
        })
        .then(res => {
          if (res.data.code == 0) {
            this.loading = false;
            this.list = this.list.concat(res.data.data);
            if (res.data.data.length == 0) {
              this.finished = true;
              if (this.list.length == 0) {
                this.noData = true;
              }
            }
          } else if (res.data.code == 201) {
            this.finished = true;
            this.noData = false;
          }
        });
    },
    goToMessageDetail(id, catId) {
      // 路由  资讯详情页
      this.$router.push({
        path: "/message_detail",
        query: {
          id: id,
          catid: catId,
          from: "index"
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.message-container
   padding-bottom 55px
  .message-ul
    padding-left 12px
    background #fff
    li
      border-bottom 1px solid #e5e5e5
      &:last-child
        border-bottom none
</style>
