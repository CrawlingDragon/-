<template>
  <div class="apply_vip_succeed-container">
    <Header header="indexHeader" navHeader="申请会员"></Header>
    <van-icon name="checked" class="icon" />
    <p class="p1">会员申请已提交</p>
    <p class="p2">中农在线会发短信告知你审核结果，请耐心等待</p>
    <div class="index-btn" @click="goToHospitalIndex">返回医院首页 </div>
  </div>
</template>
<script>
import Header from "@/components/hospital_header/hospital_header";
export default {
  metaInfo: {
    title: "申请会员",
  },
  name: "applyVipSucceed",
  components: { Header },
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    goToHospitalIndex() {
      this.$router.replace({ path: "/hospital" });
    },
  },
};
</script>
<style lang="stylus" scoped>
.apply_vip_succeed-container
  text-align center
  .icon
    font-size 50px
    color #155BBB
    margin-top 50px
  .p1
    font-size 15px
    color #333
    margin-top 15px
  .p2
    font-size 12px
    color #999999
    margin-top 20px
  .index-btn
    position fixed
    left 50%
    bottom 50px
    transform translateX(-50%)
    border 1px solid #155BBB
    border-radius 4px
    font-size 14px
    color #155BBB
    width 110px
    line-height 30px
    height 30px
</style>
