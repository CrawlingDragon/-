<template>
  <div class="solution-container">
    <Header :indexHeader="false" :goBackHeader="true"></Header>
    <div class="nav-bar van-hairline--bottom">
      <router-link class="nav" to="/takeCase" replace>订阅的方案</router-link>
      <router-link class="nav" to="/allCase" replace>全部方案</router-link>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Header from "@/components/header/header";

export default {
  name: "solution",
  metaInfo: {
    title: "作物解决方案"
  },
  components: { Header },
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {}
};
</script>
<style lang="stylus" scoped>
.solution-container
  .nav-bar
    height 50px
    line-height 50px
    display flex
    text-align center
    .nav
      flex 1
      color #666666
      font-size 15px
      background #fff
      &.router-link-active
        color #155BBB
        position relative
        &::after
          content ''
          position absolute
          left 50%
          bottom 0px
          width 30px
          height 3px
          background #155BBB
          border-radius: 3px;
          margin-left -15px
</style>
