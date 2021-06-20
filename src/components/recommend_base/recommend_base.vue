<template>
  <div class="recommend_base-container" @click="goToDetail(list.qrcode)">
    <!-- 192 -->
    <van-image class="img" :src="list.logo" fit="scale-down"></van-image>
    <div class="info-bar">
      <div class="name">{{ list.companyname }}</div>
      <div class="scale">规模：{{ list.guimo }}</div>
      <div class="crop">{{ list.zwtype }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "recommend_base",
  components: {},
  props: {
    list: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    goToDetail(href) {
      window.location.href = href;
    }
  }
};
</script>
<style lang="stylus" scoped>
.recommend_base-container
    font-size 0
    background #F6F6F6
    .img
        width 50%
        height 105px
        background #999999
        display inline-block
        vertical-align top
    .info-bar
        display inline-block
        width 50%
        background #F6F6F6
        height 88px
        padding 13px 10px 0
        vertical-align top
        line-height 1.2
        .name
            font-size: 16px;
            font-weight: 400;
            color: #333333;
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
            word-break break-all
            padding-bottom 10px
        .scale,.crop
            font-size: 14px;
            font-weight: 400;
            color: #999999;
            margin-bottom 5px
        .scale
          margin-bottom 2px
</style>
