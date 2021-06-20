<template>
  <div class="fram-container">
    <Header :haveBackIcon="true">
      <div class="icon" @click="goBack">
        <van-icon name="arrow-left" class="back-icon" />
        <span class="back">返回</span>
      </div>
    </Header>
    <transition name="van-slide-right">
      <div class="fram_all-list">
        <div class="title">农事记录</div>
        <div class="farm-record-content">
          <FramItem
            v-for="item in list"
            :key="item.id"
            :item="item"
            @priview="imagePriview"
            @deteleHistory="updateDeteleHistory"
          ></FramItem>
        </div>
        <div class="bottom-bar van-hairline--top">
          <div class="issue-btn1" @click="goToIssueFram">
            <van-icon name="plus" class="issue-icon" />
            <span>发布农事</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import FramItem from "@/components/fram_item/fram_item";
import Header from "@/components/header/header";
import { ImagePreview } from "vant";

export default {
  name: "base_center_fram_history",
  components: {
    FramItem,
    Header,
    [ImagePreview.Component.name]: ImagePreview.Component
  },
  props: {},
  data() {
    return { id: 0, list: [] };
  },
  computed: {},
  watch: {},
  mounted() {
    // this.$toast.success("发布成功");
    this.getHistoryList();
  },
  destroyed() {},
  methods: {
    getHistoryList() {
      this.id = this.$route.query.id;
      this.$axios
        .fetchGet("API/User/getgbaserecordlist", { uId: this.id })
        .then(res => {
          if (res.data.code == 0) {
            this.list = res.data.data;
          }
        });
    },
    imagePriview(obj) {
      ImagePreview({
        images: obj.imgList,
        startPosition: obj.index,
        closeable: true
      });
    },
    updateDeteleHistory(id) {
      this.list = this.list.filter(item => {
        return item.id != id;
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    goToIssueFram() {
      // 去发布农事
      this.$router.push({
        path: "/base_edit"
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.fram-container
  .icon
    flex 1
    display flex
    align-items center
    color #999
  .back-icon
    font-size 20px
    color: #999999;
    padding-left 12px
    margin-right 5px
.fram_all-list
  padding 12px
  padding-top 0
  padding-bottom 0
  background #fff
  position absolute
  left 0
  right 0
  top 51px
  bottom 0
  overflow auto
  padding-bottom 61px
  .item
    &:last-child
      margin-bottom 0
  .title
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #999999;
    line-height 35px
  .bottom-bar
    padding 10px 12px 0px
    position fixed
    bottom 0
    left 50%
    transform translateX(-50%)
    height 61px
    background #fff
    width 100%
    max-width 640px
    .issue-btn1
      width 100%
      max-width 640px
      margin 0 auto
      height 40px
      border: 1px solid #155BBB;
      border-radius: 8px;
      text-align center
      line-height 40px
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #155BBB;
      .issue-icon
        font-size 18px
        font-weight bold
        top 2px
        margin-right 3px
</style>
