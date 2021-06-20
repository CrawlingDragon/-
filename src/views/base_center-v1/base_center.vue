<template>
  <div class="base-center-container">
    <Header :indexHeader="false"></Header>
    <ul class="base-center-ul">
      <li v-for="item in baseList" :key="item.gid">
        <div
          class="title-bar van-hairline--bottom"
          @click="baseUrl(item.qrcode)"
        >
          <van-image fit="cover" class="img" :src="item.logo"></van-image>
          <div class="right-bar">
            <div class="name">
              {{ item.companyname }}
            </div>
            <div class="small-info">
              {{ item.introduce }}
            </div>
          </div>
        </div>
        <div class="farm-record">
          <div class="title">
            农事记录<span class="more" @click="more(item.gid)">更多 ></span>
          </div>
          <div class="farm-record-content">
            <div
              class="item van-hairline--bottom"
              v-for="it in item.farmerdata"
              :key="it"
            >
              <div class="left-time" @click="detail(it.id)">
                {{ it.addtime }}
              </div>
              <div class="text">
                <div class="p" @click="detail(it.id)">
                  {{ it.content }}
                </div>
                <van-image
                  class="img"
                  v-for="img in it.thumb_urls"
                  :key="img"
                  :src="img"
                  fit="cover"
                  @click="detail(it.id)"
                ></van-image>
                <div class="show-bar">
                  <div class="left-bar" @click="edit(it.id)">
                    <div class="edit-icon"></div>
                    更改
                  </div>
                  <div class="right-bar" @click="detail(it.id)">
                    <van-icon name="arrow" class="arrow" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-bar">
          <div class="issue-btn1" @click="goToIssueFram">
            <van-icon name="plus" class="issue-icon" />
            <span>发布农事</span>
          </div>
          <div
            class="share-btn2"
            @click="showPopup(item.companyname, item.logo, item.qrcode)"
          >
            <van-icon name="qr" class="share-icon" />
            <span>分享</span>
          </div>
        </div>
      </li>
    </ul>
    <van-empty description="暂无基地" v-show="noData"></van-empty>
    <van-popup v-model="popup_show" @click="popup_show = false">
      <div class="wrap">
        <van-image
          fit="cover"
          class="base-logo"
          :src="shareObj.logo"
        ></van-image>
        <div class="h4">{{ shareObj.companyname }}</div>
        <canvas id="canvas" ref="canvas" style="height:0"></canvas>
        <van-image fit="cover" :src="url" class="erweima"></van-image>
        <div class="small-title">长按扫码分享</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import { mapState } from "vuex";
import QRCode from "qrcode";
export default {
  name: "base_center",
  components: { Header },
  props: {},
  data() {
    return {
      baseList: [],
      popup_show: false,
      shareObj: "",
      url: "",
      noData: false
    };
  },
  computed: {
    ...mapState(["uid"])
  },
  watch: {},
  mounted() {
    this.getBaseData();
  },
  destroyed() {},
  methods: {
    getBaseData() {
      this.$axios
        .fetchGet("/API/User/getgbaselist", { uId: this.uid })
        .then(res => {
          if (res.data.code == 0) {
            this.baseList = res.data.data;
            this.noData = false;
          } else if (res.data.code == 201) {
            this.noData = true;
          }
        });
    },
    showPopup(companyname, logo, qrcode) {
      this.shareObj = { companyname, logo, qrcode };
      QRCode.toDataURL(qrcode)
        .then(url => {
          this.url = url;
          console.log(url);
        })
        .catch(err => {
          console.error(err);
        });
      this.popup_show = true;
    },
    more(gid) {
      this.$router.push({
        path: "/base_center_fram_history",
        query: { id: gid }
      });
    },
    goToIssueFram() {
      // 去发布农事
      this.$router.push({
        path: "/base_edit"
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
    },
    baseUrl(url) {
      window.location.href = url;
    }
  }
};
</script>
<style lang="stylus" scoped>
.base-center-container
  .base-center-ul
    margin-top 10px
    &.showrecord
      height 90vh
      overflow hidden
    li
      margin-bottom 10px
      background #fff
      .title-bar
        display flex
        height 105px
        align-items center
        .img
          width 75px
          height 75px
          margin 0 10px 0 12px
        .right-bar
          flex 1
          min-width 0
          margin-right 13px
          .name
            font-size: 20px;
            color: #333333;
            position relative
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
            word-break break-all
            margin-bottom 5px
            .edit-icon
              font-size 25px
              color #999999
              position absolute
              padding 3px
              right 0
              top 0
          .small-info
            overflow hidden
            text-overflow ellipsis
            display -webkit-box
            -webkit-line-clamp 2
            -webkit-box-orient vertical
            font-size: 12px;
            color: #999999;
            line-height 20px
      .farm-record
        padding 12px
        padding-top 0
        padding-bottom 0
        .title
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #999999;
          line-height 35px
          .more
            float right
            padding 0 5px
        .farm-record-content
          .item
            display flex
            margin-bottom 17px
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
              .img
                width 32%
                padding-bottom: 33%;/* padding百分比相对父元素宽度计算 */
                height: 0;//避免被内容撑开多余的高度
                margin-right 1%
                display inline-block
                margin-top 10px
                /deep/img
                  position absolute
              .show-bar
                height 40px
                display flex
                align-items center
                justify-content space-between
                .left-bar
                  float left
                  align-items center
                  font-size: 14px;
                  font-family: Microsoft YaHei;
                  font-weight: 400;
                  color: #999999;
                  display flex
                  .edit-icon
                    width 15px
                    height 15px
                    background url('./10.png') no-repeat
                    background-size 100%
                    display inline-block
                    margin-right 10px
                .right-bar
                  float right
                  .arrow
                    font-size 18px
                    color #999
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
.van-popup
  width 90%
  max-width 330px
  margin 0 auto
  height 450px
  background url('./popup_show.png') no-repeat
  background-size 100% 100%
  background-position center center
  .wrap
    text-align center
    .base-logo
      width 74px
      height 74px
      margin 37px auto 5px
    .h4
      font-size: 22px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #FFFFFF;
    .erweima
      width 155px
      height 155px
      margin 30px auto 15px
    .small-title
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #FFFFFF;
</style>
