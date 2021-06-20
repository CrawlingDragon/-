<template>
  <div class="item-wrap">
    <van-image class="img" fit="fill" :src="item.icon" round></van-image>
    <div class="right">
      <div class="text">{{ item.classname }}</div>
      <div class="btns">
        <div class="btn look" @click="preview">预览</div>
        <div class="btn take" @click="clickTake" v-if="item.status == 0">
          订阅
        </div>
        <div class="cancel btn" @click="clickCancel" v-else>取消</div>
        <div class="cancel btn" v-if="item.status == 1" @click="management">
          农事管理
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "take_case_item",
  components: {},
  props: {
    item: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      re: require("../../../vip/80.png")
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    clickTake() {
      this.$dialog
        .confirm({
          message: "确定订阅",
          confirmButtonColor: "#155BBB"
        })
        .then(() => {
          // on confirm
          this.$emit("clickLook", { status: "dingyue", pId: this.item.id });
        })
        .catch(() => {
          // on cancel
        });
    },
    clickCancel() {
      this.$dialog
        .confirm({
          message: "确定取消",
          confirmButtonColor: "#155BBB"
        })
        .then(() => {
          // on confirm
          this.$emit("clickLook", { status: "templatedel", pId: this.item.id });
        })
        .catch(() => {
          // on cancel
        });
    },
    management() {
      // 农事管理
      this.$router.push({
        path: "/cropManagement",
        query: { pId: this.item.id, gId: this.item.gid }
      });
    },
    preview() {
      this.$router.push({
        path: "/preview",
        query: { pId: this.item.id, gId: this.item.gid }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.item-wrap
  height 100%
  display flex
  padding 20px 0
  margin 12px
  // box-shadow: 0px 3px 15px 0px rgba(206, 215, 229, 0.75);
  .img
    width 60px
    height 60px
    margin-right 14px
  .right
    flex 1
    min-width 0
    display flex
    flex-direction column
    justify-content center
    .text
      font-size 17px
      color #333333
      line-height 1.2
      margin-bottom 10px
    .btns
      font-size 0
      margin-right -12px
      .btn
        display inline-block
        height: 26px;
        padding 0 10px
        line-height 26px
        border-radius: 25px;
        text-align center
        margin-right 10px
        font-size 14px
        margin-bottom 5px
        &.look
          border: 1px solid #155BBB;
          background: #F1FAFE;
          color #155BBB
        &.take
          border: 1px solid #FF6600
          background #FEF4ED
          color #FF6600
        &.cancel
          background: #F6F6F6;
          border: 1px solid #999999;
</style>
