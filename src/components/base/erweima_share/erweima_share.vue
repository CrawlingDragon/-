<template>
  <div class="container">
    <div class="erweima-conatiner" @click="shareImage"></div>
    <van-overlay v-show="show" z-index="999">
      <div class="wrapper" @click="show = false" id="shareCanvas">
        <div class="share-box-img">
          <img :src="imgUrl" alt="" class="box-img" @click.stop />
        </div>
      </div>
    </van-overlay>
    <!-- style="z-index:-21" -->
    <div class="share-box before-show-box" ref="shareDom" style="z-index:-21">
      <img class="logo" :src="item.logo" />
      <p class="p1">{{ item.companyname }}</p>
      <van-image :src="url" class="share-img" fit="cover"></van-image>
      <p class="p2">长按识别二维码</p>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcode";
import html2canvas from "html2canvas";
export default {
  name: "erweima_share",
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
    return { popup_show: true, shareObj: "", url: "", show: "", imgUrl: "" };
  },
  computed: {},
  watch: {},
  mounted() {
    this.showPopup(this.item.companyname, this.item.logo, this.item.qrcode);
  },
  destroyed() {},
  methods: {
    shareImage() {
      this.show = true;
      html2canvas(this.$refs.shareDom, {
        useCORS: true,
        width: this.$refs.shareDom.clientWidth,
        height: this.$refs.shareDom.clientHeight,
        windowWidth: document.body.clientWidth,
        windowHeight: document.body.clientHeight,
        allowTaint: true,
        taintTest: false,
        x: 0,
        y: window.pageYOffset
      }).then(canvas => {
        let dataURL = canvas.toDataURL("image/png");
        this.imgUrl = dataURL;
        // document.getElementById("shareCanvas").appendChild(canvas);
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
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '../../../common/css/base.styl'
.container
  width 100%
  height 100%
.erweima-conatiner
  width 100%
  height 100%
  bj-image('./17')
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
.wrapper
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%
.share-box
  width 100%
  height 100%
  position relative
  background url('./popup_show.png') no-repeat
  background-position  center center
  background-size 105% 105%
  .bj-img
    position absolute
    top 0
    right 0
    height 100vh
    width 100%
    left 0
    z-index -1
  &.before-show-box
    color #fff
    position fixed
    left 0
    top 0
    bottom 0
    right 0
  .logo
    width 90px
    height 90px
    margin 28px auto 19px
    display block
  .p1
    font-size 23px
    font-weight bold
    color #FFFFFF
    margin-bottom 50px
    text-align center
  & > .share-img
    width 80%
    margin 0 auto
    display block
  .p2
    font-size 14px
    color #fff
    text-align center
    margin-top 35px
.share-box-img
  width 80%
  height 80%
  img
    display block
    width 100%
    height 100%
</style>
