<template>
  <div>
    <van-action-sheet
      v-model="zuowuShow"
      cancel-text="确定"
      @cancel="onZuowuCancel"
    >
      <div class="zuowuContent">
        <van-checkbox-group v-model="result">
          <div class="item" v-for="item in chooseData" :key="item">
            <div class="item-wrap">
              <van-checkbox :name="item">
                <template #icon="props">
                  <div
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    class="props"
                  >
                    {{ item }}
                  </div>
                </template>
              </van-checkbox>
            </div>
          </div>
        </van-checkbox-group>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
export default {
  name: "component_name",
  components: {},
  props: {
    chooseData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return { zuowuShow: false, result: [] };
  },
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    onZuowuCancel() {
      this.$emit("emitArray", this.result);
      this.zuowuShow = false;
    }
  }
};
</script>
<style lang="stylus" scoped>
.zuowuContent
  padding-left 15px
  padding-top 25px
  .item
    padding-right 15px
    margin-bottom 15px
    height 40px
    text-align center
    display inline-block
    min-width 25%
    .item-wrap
      position relative
      height 100%
      font-size 16px
      background #FAFAFA
      /deep/.van-checkbox
        width 100%
        height 100%
        display block
        position absolute
        left 0
        right 0
      /deep/.van-checkbox__icon
        position absolute
        width 100%
        height 100%
        position absolute
        left 0
        right 0
      .props
        line-height 38px
        text-align center
        margin 0
        width 100%
        border 1px solid #E5E5E5
      .activeIcon
        width 100%
        height 100%
        border 1px solid #155BBB
        color #155BBB
        background #F1FAFE
</style>
