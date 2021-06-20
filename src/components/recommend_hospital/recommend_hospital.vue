<template>
  <!-- 首页推荐医院列表 -->
  <div class="recommend-hospital-wrap" @click="goToIndexHospital">
    <van-image :src="list.logo" fit="cover" class="image" lazy-load />
    <p class="p1">{{ list.title }}</p>
    <p class="p2">{{ list.level }}·{{ list.issort }}医院</p>
    <p class="p3" v-show="list.zuowu != '暂未设置' && list.zuowu != ''">
      科室：{{ list.zuowu }}
    </p>
    <div class="number">
      <div class="expert" v-if="list.num_expert != 0">
        专家 {{ list.num_expert }}
      </div>
      <div class="line" v-show="list.num_expert != 0 && list.num_chufang != 0">
        |
      </div>
      <div class="online" v-if="list.num_chufang != 0">
        处方 {{ list.num_chufang }}
      </div>
      <div
        class="line"
        v-show="list.num_wen != 0 && list.isstore == 0"
        style="margin-left:10px"
      >
        |
      </div>
      <div class="online" v-if="list.num_wen != 0 && list.isstore == 0">
        网诊 {{ list.num_wen }}
      </div>
    </div>
    <div class="icon" v-show="list.isstore == 1"></div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  name: "Recommend_hospital",
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
    ...mapMutations(["setMid", "setHospitalName", "setHospitalIsStore"]),
    goToIndexHospital() {
      // 去医院首页
      this.setMid(this.list.mid);
      this.setHospitalName(this.list.title);
      this.setHospitalIsStore(this.list.isstore);
      this.$router.push({
        path: "/hospital"
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.recommend-hospital-wrap
  position relative
  padding-bottom 15px
  background #F5F5F5
  .image
    width 100%
    height 140px
    margin-bottom 5px
  .p1
    font-size 14px
    color #343434
    line-height 16px
    padding-left 10px
    margin-bottom 13px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    word-break break-all
  .p2
    color #9A9A9A
    font-size 12px
    line-height 14px
    margin-bottom 10px
    padding-left 10px
  .p3
    color #9A9A9A
    font-size 12px
    line-height 16px
    padding-left 10px
  .number
    font-size 12px
    color #343434
    margin-top 10px
    display flex
    align-items center
    padding-left 10px
    .expert
      margin-right 10px
    .online
      margin-left 10px
  .icon
    width 45px
    height 15px
    background url('./icon.png') no-repeat
    background-size cover
    background-position center
    position absolute
    right 0
    top 5px
</style>
