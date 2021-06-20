<template>
  <div class="crop_record-container">
    <div class="nav-bar van-hairline--bottom">
      <router-link
        class="nav"
        :to="{
          path: '/cropManagement',
          query: { pId: this.$route.query.pId, gId: this.$route.query.gId }
        }"
        replace
      >
        农事管理
      </router-link>
      <router-link
        class="nav"
        :to="{
          path: '/cropRecord',
          query: { pId: this.$route.query.pId, gId: this.$route.query.gId }
        }"
        replace
        >农事记录</router-link
      >
    </div>
    <div class="farm-record-content">
      <FramItem
        v-for="item in list"
        :key="item.id"
        :item="item"
        @priview="imagePriview"
        @deteleHistory="updateDeteleHistory"
      ></FramItem>
    </div>
  </div>
</template>
<script>
import FramItem from "@/components/fram_item/fram_item";
import { ImagePreview } from "vant";

export default {
  name: "crop_record",
  components: {
    FramItem,
    [ImagePreview.Component.name]: ImagePreview.Component
  },
  props: {},
  data() {
    return {
      list: []
    };
  },
  computed: {
    gId() {
      return this.$route.query.gId;
    }
  },
  watch: {},
  mounted() {
    this.getHistoryList();
  },
  destroyed() {},
  methods: {
    getHistoryList() {
      this.id = this.$route.query.id;
      this.$axios
        .fetchGet("API/User/getgbaserecordlist", { uId: this.gId })
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
.crop_record-container
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
.farm-record-content
  background #fff
  padding-top 15px
</style>
