<template>
  <div class="no-take-wrap">
    <p>暂无数据</p>
    <div class="btn" @click="goLook">去订阅</div>
  </div>
</template>
<script>
export default {
  name: "no_take",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    goLook() {
      this.$router.replace({
        path: "/allCase"
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.no-take-wrap
  height 300px
  p
    padding-top 150px
    color #666666
    font-size 15px
    text-align center
  .btn
    width: 112px;
    height: 40px;
    background: #155BBB;
    border: 1px solid #155BBB;
    border-radius: 40px;
    font-size 15px
    color #fff
    text-align center
    line-height 40px
    margin 0 auto
    margin-top 30px
</style>
