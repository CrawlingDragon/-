<template>
  <div class="soil_detail-container">
    <Header header="logoHeader"></Header>
    <ul class="top">
      <li class="title">{{soil.title}}</li>
      <li>
        <div class="left">送样人</div>
        <div class="right">{{soil.username}}</div>
      </li>
      <li>
        <div class="left">种植作物</div>
        <div class="right">{{soil.fname}}</div>
      </li>
      <li>
        <div class="left">取样时间</div>
        <div class="right">{{soil.addtime}}</div>
      </li>
      <li>
        <div class="left">取样地址</div>
        <div class="right">{{soil.address}}</div>
      </li>
      <li class="title2">ID:{{soil.cetu_number}}</li>
    </ul>
    <ul class="mid">
      <li class="title">
        <div class="item item01">检查项目</div>
        <div class="item item02">结果</div>
        <div class="item item03">养分水平</div>
        <div class="item item04">单位</div>
      </li>
      <li v-for="it in soil.item" :key="it.name">
        <div class="item item01">{{it.name}}</div>
        <div class="item item02">{{it.hl}}</div>
        <div class="item item03">{{it.standard}}</div>
        <div class="item item04">{{it.unit}}</div>
      </li>
      <li class="description">结果描述：{{soil.hl_result || '无'}} </li>
    </ul>
    <ul class="bottom">
      <li class="title">处方信息</li>
      <li>
        <div class="left">处方专家</div>
        <div class="right">{{soil.chufang_expert || '无'}}</div>
      </li>
      <li>
        <div class="left">看诊结果</div>
        <div class="right">{{soil.chufang_result || '无'}}</div>
      </li>
    </ul>
    <ul class="bottom" v-show="products.length != 0">
      <li class="title">处方药({{products.length}})</li>
      <li class="chufang-li" v-for="item in soil.products" :key="item.id">
        <van-image fit="cover" :src="item.thumb_pic" class="chufang-img"></van-image>
        <div class="mid">
          <p class="p1">{{item.name}}</p>
          <p class="p2">规格:{{item.spec}} 单价:¥{{item.price}}</p>
        </div>
        <div class="number">x{{item.quantity}}</div>
      </li>
    </ul>
  </div>
</template>
<script>
import Header from "@/components/hospital_header/hospital_header";
export default {
  name: "soilDetail",
  components: { Header },
  metaInfo() {
    return {
      title: this.title,
    };
  },
  props: {},
  data() {
    return {
      id: this.$route.query.id,
      title: "",
      soil: "",
      products: "",
    };
  },
  computed: {},
  watch: {
    $route() {
      this.getDetail(this.id);
    },
  },
  mounted() {
    this.getDetail(this.id);
  },
  destroyed() {},
  methods: {
    getDetail(id) {
      this.$axios
        .fetchPost("/API/Treatment/testingsoilDetail", { id: id })
        .then((res) => {
          if (res.data.code == 0) {
            this.soil = res.data.data;
            this.title = res.data.data.title;
            this.products = res.data.data.products;
          }
        });
    },
  },
};
</script>
<style lang="stylus" scoped>
.soil_detail-container
  .top
    margin-top 10px
    background #fff
    li
      min-height 50px
      padding 15px 0
      border-bottom 1px solid #e5e5e5
      display flex
      align-items center
      padding-left 12px
      &:last-child
        border none
      &.title
        color #155BBB
        font-size 17px
      &.title2
        color #999999
        font-size 15px
      .left
        width 90px
        color #999999
      .right
        flex 1
        color #333
  .mid
    background #fff
    margin-top 10px
    li
      min-height 50px
      border-bottom 1px solid #e5e5e5
      font-size 15px
      color #333333
      padding 15px 0
      &:last-child
        border none
      .item
        padding 0 10px
        display inline-block
      .item01
        width 25%
      .item02
        width 15%
      .item03
        width 44%
      .item04
        width 16%
      &.title
        .item
          color #155BBB
    .description
      padding 20px 12px
  .bottom
    margin-top 10px
    background #fff
    li
      min-height 50px
      padding 15px 12px
      display flex
      border-bottom 1px solid #e5e5e5
      &:last-child
        border none
      .left
        width 100px
      .right
        flex 1
    .title
      font-size 15px
      color #155BBB
    .chufang-li
      display flex
      .chufang-img
        width 100px
        height 100px
        margin-right 10px
      .mid
        flex 1
        display flex
        flex-direction column
        justify-content space-between
        margin 0
        .p2
          color #999
          font-size 14px
</style>
