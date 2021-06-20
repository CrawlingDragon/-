<template>
  <!-- 资讯相关item -->
  <div class="Message_item-container">
    <div class="t">{{list.title}}</div>
    <van-image class="img" :src="list.thumb" radius="8px" fit="cover" v-if="list.thumb && list.thumb != ''"></van-image>
    <div class="time">{{list.inputtime}} <span v-show="index">{{list.mpublic_name}}</span></div>
  </div>
</template>
<script>
export default {
  name: "Message_item",
  components: {},
  props: {
    list: {
      type: Object,
      default: function () {
        return {};
      },
    },
    index: {
      type: Boolean,
      default: false,
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
    // goToMessageDetail(image) {
    //   //轮播图去资讯详情页
    //   this.$router.push({
    //     path: "/message_detail",
    //     query: { id: image.id, catid: image.catid },
    //   });
    // },
  },
};
</script>
<style lang="stylus" scoped>
.Message_item-container
  padding 15px 0
  padding-right 12px
  margin-left 12px
  .t
    font-size 14px
    color #333333
    line-height 16px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    word-break break-all
  .img
    width 100%
    height 115px
    border-radius 8px
    margin 7px 0 2px 0
  .time
    font-size 12px
    color #999999
    margin-top 8px
    span
      float right
</style>
