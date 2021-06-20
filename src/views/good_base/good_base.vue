<template>
  <div class="good_base-container">
    <Header indexHeader="indexHeader" navHeader="优质基地"></Header>
    <ul class="base-ul" v-if="!noData">
      <li v-for="item in list" :key="item.id" @click="goToBaseDetail(item.id)">
        <div class="status" :class="{'glod':item.ctype == '8','base':item.ctype == '6','none':item.ctype == '0'}">{{item.ctype == '8'?'金牌认证':(item.ctype == '6'?'基地认证':'未认证')}}</div>
        <van-image class="img" :src="item.logo"></van-image>
        <div class="text">
          <div class="h2">{{item.name}}</div>
          <div class="p2">{{item.zwtype}} {{item.guimo}}亩</div>
          <div class="join-time">
            <van-image class="avator" round :src="item.avatar"></van-image>
            <div class="time">{{item.regtime}} 加入医院</div>
          </div>
        </div>
      </li>
    </ul>
    <div class="tip" v-if="!noData">申请庄稼医院会员，提交基地认证</div>
    <van-empty description="暂无基地" v-if="noData"></van-empty>
  </div>
</template>
<script>
import Header from "@/components/hospital_header/hospital_header";
import { mapState } from "vuex";

export default {
  name: "goodBase",
  components: { Header },
  props: {},
  metaInfo: {
    title: "优质基地",
  },
  data() {
    return {
      list: [],
      noData: false,
    };
  },
  computed: {
    ...mapState(["uid", "mid"]),
  },
  created() {},
  watch: {},
  mounted() {
    this.getBaseList(this.mid);
    // this.getBaseList(61214);
  },
  destroyed() {},
  methods: {
    getBaseList(mid) {
      // 或者基地列表
      this.$axios
        .fetchPost("/API/Mpublic/getFineBaseCom", {
          mId: mid,
          uId: this.uid,
          pagesize: 50,
          isall:'self'
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.list = res.data.data;
          } else if (res.data.code == 201) {
            this.noData = true;
          }
        });
    },
    goToBaseDetail(id) {
      this.$router.push({
        path: "/base_detail",
        query: { id: id },
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.good_base-container
  .base-ul
    margin-top 10px
    background #fff
    padding-left 12px
    li
      display flex
      padding 20px 0
      position relative
      border-bottom 1px solid #e5e5e5
      &:last-child
        border none
      .status
        position absolute
        left 0
        top 30px
        background #ff6600
        color #fff
        font-size 12px
        border-top-right-radius 100px
        border-bottom-right-radius 100px
        width 65px
        height 20px
        line-height 20px
        text-align center
        z-index 1
        font-size 12px
        &.gold
          background #ff6600
        &.base
          background #155BBB
        &.none
          background #838383
      .img
        width 105px
        height 105px
        margin-right 14px
      .text
        flex 1
        min-width 0
        .h2
          color #000000
          font-size 15px
          line-height 20px
        .p2
          font-size 12px
          color #999999
          margin-top 5px
        .join-time
          display flex
          align-items center
          margin-top 10px
          .avator
            width 30px
            height 30px
            margin-right 5px
          .time
            color #999
            font-size 12px
  .tip
    font-size 12px
    color #999
    padding 15px 0
    text-align center
</style>
