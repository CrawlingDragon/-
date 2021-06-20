<template>
  <div class="item-wrap">
    <van-image class="img" fill="fill" :src="baseItem.logo">
      <div class="share"><ErweimaShare :item="baseItem"></ErweimaShare></div>
    </van-image>
    <div class="mid">
      <div class="text">{{ baseItem.companyname }}</div>
      <div class="btn1 btn" @click="management" v-if="baseItem.status === 1">
        农事管理
      </div>
      <div class="btn2 btn" @click="record" v-if="baseItem.status === 1">
        农事记录
      </div>
      <div class="checking" v-if="baseItem.status === 0">
        <van-icon name="clock-o" class="clock" />
        <span>审核中</span>
      </div>
      <div class="tack-case" v-if="baseItem.status === 2" @click="takeCase">
        去订阅方案
      </div>
    </div>
    <div class="right" @click="edit" v-if="baseItem.status !== 0">编辑 ></div>
  </div>
</template>
<script>
import ErweimaShare from "@/components/base/erweima_share/erweima_share";

export default {
  name: "base_center_item",
  components: { ErweimaShare },
  props: {
    baseItem: {
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
    edit() {
      this.$router.push({
        path: "/baseInfoEdit",
        query: { from: "edit" }
      });
    },
    management() {
      this.$router.push({
        name: "cropManagement",
        query: { pId: this.baseItem.pid, gId: this.baseItem.gid }
      });
    },
    record() {
      this.$router.push({
        name: "cropRecord",
        query: { pId: this.baseItem.pid, gId: this.baseItem.gid }
      });
    },
    takeCase() {
      this.$router.push({
        path: "/allCase"
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.item-wrap
  display flex
  align-items flex-start
  padding 15px 12px
  background #fff
  .img
    width 75px
    height 75px
    margin-right 10px
    border-radius: 8px;
    position relative
  /deep/.share
    position absolute
    right 2px
    bottom 2px
    width 30px
    height 30px
    border-radius 100%
    overflow hidden
    padding 5px
  .mid
    flex 1
    min-width 0
    padding-top 5px
    .text
      color #333333
      font-size 20px
      line-height 1.2
      margin-bottom 10px
    .btn
      display inline-block
      width 75px
      height 25px
      margin-right 9px
      border-radius: 25px;
      font-weight: 400;
      text-align center
      line-height 25px
      font-size 14px
      &.btn1
        background: #F1FAFE;
        border: 1px solid #155BBB;
        color: #155BBB;
      &.btn2
        color #FF6600
        background #FEF4ED
        border 1px solid #ff6600
    .checking
      font-size 14px
      color #ff6600
      display flex
      align-items center
      line-height 20px
      .clock
        font-size 20px
        margin-right 10px
    .tack-case
      width 95px
      height 26px
      line-height 26px
      text-align center
      background #ff6600
      border-radius 20px
      color #fff
      font-size 14px

  .right
    color #666666
    font-size 14px
    padding-left 10px
    padding-top 10px
</style>
