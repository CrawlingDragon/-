<template>
  <div class="message-container">
    <HospitalHeader indexHeader="indexHeader" navHeader="资讯"></HospitalHeader>
    <ul class="message-ul" v-if="!noData">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <li v-for="item in list" :key="item.id" @click="goToMessageDetail(item.id,item.catid)">
          <MessageItem :list="item"></MessageItem>
        </li>
      </van-list>
    </ul>
    <van-empty description="暂无资讯内容" v-if="noData" />
  </div>
</template>
<script>
import HospitalHeader from "@/components/hospital_header/hospital_header";
import MessageItem from "@/components/message_item/message_item";
import { mapState } from "vuex";

export default {
  metaInfo: {
    title: "资讯列表",
  },
  name: "hospitalMessage",
  components: { MessageItem, HospitalHeader },
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
  computed: {
    ...mapState(["mid"]),
  },
  created() {},
  watch: {
    $route() {
      // this.$emit("footer", false)
    },
  },
  mounted() {},
  destroyed() {},
  methods: {
    onLoad() {
      this.getList();
    },
    getList() {
      this.page += 1;
      this.noData = false;
      this.$axios
        .fetchPost("API/Mpublic/getNewslist", {
          mId: this.mid,
          page: this.page,
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.loading = false;
            this.list = this.list.concat(res.data.data);
          } else if (res.data.code == 201) {
            if (this.page == 1) {
              this.noData = true;
              this.finished = true;
            } else {
              this.finished = true;
            }
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
        },
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.message-container
  background #fff
  .message-ul
    margin-left 12px
    li
      border-bottom 1px solid #e5e5e5
      &:last-child
        border-bottom none
.van-empty
  background #ebebeb
</style>
