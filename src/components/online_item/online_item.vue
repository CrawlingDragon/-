<template>
  <!-- 首页网珍 -->
  <div class="recommend_online-container">
    <div class="top" @click="goToExpert(list.authorid)">
      <van-image round class="avator" :src="list.avatar"></van-image>
      <div class="name">
        {{list.author}}
        <div class="time">{{list.addtime}} <span v-show="list.area">·</span> {{list.area}}</div>
      </div>
    </div>
    <div class="subsidy" v-if="list.isbenefit == 1"></div>
    <div class=" text" @click="goToDetail">{{list.title}}</div>
    <div class="img-list">
      <div class="item" v-for="(item,index) in list.pic_urls_tiny" :key="item" @click="preview(list.pic_urls,index)">
        <van-image class="img" fit="cover" :src="item" lazy-load></van-image>
      </div>
    </div>

    <div class="bottom" @click="goToDetail">
      <div class="left">
        <div class="icon icon1"></div>
        <div class="content">{{list.name}}</div>
      </div>
      <div class="right">
        <div class="icon icon2"></div>
        <div class="content">回复 {{list.replies}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "OnlineItem",
  components: {},
  props: {
    list: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    preview(arr, index) {
      // 图片依赖
      let obj = {
        arr: arr,
        index: index,
      };
      this.$emit("preImage", obj);
    },
    goToDetail() {
      // 去网诊详情页
      this.$router.push({
        path: "/ask_detail",
        query: { tid: this.list.tid },
      });
    },
    goToExpert(authorid) {
      this.$router.push({
        path: "/expert",
        query: {
          id: authorid,
        },
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.recommend_online-container
  position relative
  .top
    padding-top 15px
    display flex
    align-items center
    .avator
      width 35px
      height 35px
      margin-right 15px
    .name
      flex 1
      color #343434
      font-size 15px
      line-height 20px
    .time
      width auto
      font-size 12px
      color #9A9A9A
      line-height 20px
  .subsidy
    position absolute
    right 13px
    top 20px
    width 15px
    height 15px
    background url('./55.png') no-repeat
    background-size cover
    background-position center center
  .text
    color #666666
    font-size 14px
    line-height 22px
    margin 10px 0
  .img-list
    font-size 0
    .item
      width 33.33%
      height 105px
      padding-right 12px
      display inline-block
      margin-bottom 12px
      .img
        width 100%
        height 100%
  .bottom
    padding-bottom 14px
    padding-top 12px
    display flex
    justify-content space-between
    align-items center
    font-size 12px
    color #9A9A9A
    padding-right 12px
    .left
      display flex
      align-items center
      .icon
        width 15px
        height 15px
        background red
        margin-right 10px
        background url('./50.png') no-repeat
        background-size cover
        background-position center
    .right
      display flex
      align-items center
      .icon
        width 15px
        height 15px
        background red
        margin-right 10px
        background url('./51.png') no-repeat
        background-size cover
        background-position center
</style>
