<template>
  <div class="item van-hairline--bottom">
    <div class="left-time" @click="detail(item.id)">{{ item.addtime }}</div>
    <div class="text">
      <div class="p" @click="detail(item.id)">
        {{ item.content }}
      </div>
      <van-image
        class="img"
        v-for="(img, index) in item.thumb_urls"
        :key="index"
        fit="cover"
        :src="img"
        @click="showPriviewImg(item.thumb_urls, index)"
      ></van-image>
      <div class="edit-bar">
        <div class="left" @click="edit(item.id)">
          <div class="edit-icon"></div>
          更改
        </div>
        <div class="detele" @click="deteleFramHistory(item.id)">
          <van-icon name="close" /><span>删除</span>
        </div>
        <div class="medicine-icon" @click="detail(item.id)">
          <van-icon name="arrow" class="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "fram_item",
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
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    showPriviewImg(imgList, index) {
      let obj = {
        imgList,
        index
      };
      this.$emit("priview", obj);
    },
    deteleFramHistory(id) {
      // 删除农事记录
      this.$dialog
        .confirm({
          message: "确定删除",
          confirmButtonColor: "#8BC34A"
        })
        .then(() => {
          // on confirm
          this.detetleHistory(id);
        })
        .catch(() => {
          // on cancel
        });
    },
    detetleHistory(id) {
      this.$axios.fetchGet("/API/User/delfarmerdata", { Id: id }).then(res => {
        if (res.data.code == 0) {
          this.$emit("deteleHistory", id);
        }
      });
    },
    edit(id) {
      this.$router.push({
        path: "/base_edit",
        query: { id: id }
      });
    },
    detail(id) {
      this.$router.push({
        path: "/base_fram_detail",
        query: { id: id }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.item
  display flex
  margin-bottom 17px
  padding-bottom 15px

  .left-time
    width 97px
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #333333;
  .text
    flex 1
    min-width 0
    .p
      font-size: 15px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      margin-bottom 10px
    .img
      width 32%
      padding-bottom: 33%; /* padding百分比相对父元素宽度计算 */
      height: 0; //避免被内容撑开多余的高度
      margin-right 1%
      display inline-block
      /deep/img
        position absolute
    .edit-bar
      display flex
      margin-top 13px
      align-items center
      justify-content space-between
      .left
        display flex
        align-items center
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #999999;
        .edit-icon
          width 15px
          height 15px
          background url('./10.png') no-repeat
          background-size 100%
          display inline-block
          margin-right 10px
      .detele
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #999999;
        display flex
        .van-icon-close
          font-size 20px
          margin-right 10px
      .medicine-icon
        display inline-block
        // font-size 20px
        color #999
        padding 0 10px
        // background url('./9.png') no-repeat
        background-size 100%
  .bottom-bar
    padding 0 12px 15px
    .issue-btn1
      width 60%
      display inline-block
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
    .share-btn2
      width 30%
      display inline-block
      float right
      height 40px
      border: 1px solid #155BBB;
      border-radius: 8px;
      text-align center
      line-height 40px
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #155BBB;
      .share-icon
        font-size 18px
        font-weight bold
        top 2px
        margin-right 3px
</style>
