<template>
  <div
    class="ask_detail-container"
    :class="{ jiashicang: from == 'jiashicang' }"
  >
    <Header :indexHeader="false"></Header>
    <div class="online-box">
      <div class="top">
        <van-image
          round
          class="avator"
          :src="detail.avatar"
          @click="goToExpert(0, detail.authorid)"
        ></van-image>
        <div class="name">
          {{ detail.author }}
          <div class="time">{{ detail.addtime }} {{ detail.area }}</div>
        </div>
      </div>
      <div class="subsidy" v-if="detail.isbenefit == 1" @click="benefit"></div>
      <div class="text">{{ detail.content }}</div>
      <div class="img-list">
        <div
          class="item"
          v-for="(item, index) in detail.urls_tiny"
          :key="item"
          @click="preview(detail.urls, index)"
        >
          <van-image class="img" fit="cover" :src="item" lazy-load></van-image>
        </div>
      </div>
      <div class="bottom">
        <div class="left">
          <div class="icon icon1"></div>
          <div class="content">{{ detail.name }}</div>
        </div>
        <div class="right" v-if="detail.ishaveexpert">
          <div class="content">咨询专家</div>
          <van-image
            class="icon icon3"
            :src="detail.ishaveexpert.avatar"
            round
            @click="goToExpert(0, detail.ishaveexpert.expertid)"
          ></van-image>
        </div>
      </div>
    </div>
    <div class="answer-box" v-if="detail.replies != 0">
      <div class="title">解答 {{ detail.replies }}</div>
      <ul class="answer-ul">
        <li v-for="item in detail.answers" :key="item.pid">
          <div class="top">
            <van-image
              round
              fit="cover"
              :src="item.avatar"
              class="avator"
              @click="goToExpert(item.isexpert, item.authorid)"
            ></van-image>
            <div class="name">
              {{ item.name
              }}<span v-show="item.groupname != ''"
                >({{ item.groupname }})</span
              >
            </div>
            <div class="time">{{ item.addtime }}</div>
          </div>
          <div class="text">{{ item.content }}</div>
          <div class="image-ul">
            <div
              class="item"
              v-for="(it, index) in item.pic_urls_tiny"
              :key="it.id"
              @click="preview(item.urls, index)"
            >
              <van-image :src="it" fit="cover" class="answer-img"></van-image>
            </div>
          </div>
          <div class="lookat-yinongbao">{{ item.add_wenlist_tips }}</div>
          <div
            class="rote"
            @click="showPopupRote(item)"
            v-if="
              detail.isself == 1 &&
                item.isself == 0 &&
                item.score == '' &&
                item.isexpert != 0
            "
          >
            <div class="icon"></div>
            评分
          </div>
          <div
            class="roted-box"
            v-if="item.score != '' && item.score.viewstatus == 1"
          >
            <div class=" top">
              <van-image
                round
                :src="item.score.avatar"
                fit="cover"
                class="img"
                @click="goToExpert(item.isexpert, detail.authorid)"
              ></van-image>
              <div class="rig">
                <p class="p1">{{ item.score.name }}</p>
                <p class="p2">{{ item.score.addtime }}</p>
              </div>
            </div>
            <div class="star">
              <van-rate
                v-model="item.score.score"
                color="#ff6600"
                readonly
                size="27px"
              />
              <span v-if="item.score.score == 1">解答非常差</span>
              <span v-if="item.score.score == 2">解答差</span>
              <span v-if="item.score.score == 3">解答一般</span>
              <span v-if="item.score.score == 4">解答好</span>
              <span v-if="item.score.score == 5">解答很好</span>
            </div>
            <div class="txt">{{ item.score.content }}</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="answer-bar" @click="showPopup">
      <div class="border">我来回答</div>
    </div>
    <van-popup
      v-model="show"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '220px' }"
      class="van-popup-box"
    >
      <div class="sub subText" @click="sub" :class="{ content: message }">
        提交
      </div>
      <div class="message-box">
        <van-field
          v-model="message"
          rows="5"
          autosize
          type="textarea"
          maxlength="600"
          placeholder="我来回答"
          show-word-limit
          class="message"
        />
      </div>
    </van-popup>
    <van-popup
      v-model="showRote"
      position="bottom"
      :style="{ height: '234px' }"
      class="rotes"
    >
      <div class="sub subText" :class="{ content: true }" @click="subRemark">
        发表
      </div>
      <div class="title">评价 {{ author }}</div>
      <van-rate v-model="roteValue" color="#ff6600" size="27px" />
      <span v-if="roteValue == 1" class="rote-text">解答非常差</span>
      <span v-if="roteValue == 2" class="rote-text">解答差</span>
      <span v-if="roteValue == 3" class="rote-text">解答一般</span>
      <span v-if="roteValue == 4" class="rote-text">解答好</span>
      <span v-if="roteValue == 5" class="rote-text">解答很好</span>
      <van-field
        v-model="messageRote"
        rows="3"
        type="textarea"
        maxlength="200"
        :placeholder="'请评价' + author"
        show-word-limit
        class="message"
      />
    </van-popup>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import { mapState, mapMutations } from "vuex";
import { ImagePreview } from "vant";
export default {
  name: "askDetail",
  components: { Header, [ImagePreview.Component.name]: ImagePreview.Component },
  props: {},
  metaInfo: {
    title: "问答详情"
  },
  data() {
    return {
      tid: this.$route.query.tid,
      from: this.$route.query.from,
      show: false,
      showRote: false,
      message: "",
      roteValue: 1,
      messageRote: "",
      detail: "",
      pid: "",
      author: ""
    };
  },
  computed: {
    ...mapState(["uid", "uid"])
  },
  created() {},
  watch: {
    $route() {
      this.tid = this.$route.query.tid;
      this.getDetail();
    }
  },
  mounted() {
    this.getDetail();
  },
  destroyed() {},
  methods: {
    ...mapMutations(["setMid"]),
    getDetail() {
      // 解答详情
      this.$axios
        .fetchPost("API/Wen/detail", { tId: this.tid, uId: this.uid })
        .then(res => {
          if (res.data.code == 0) {
            this.detail = res.data.data;
          }
        });
    },
    showPopup() {
      this.show = true;
    },
    sub() {
      // 提交回复
      if (this.message == "") {
        return;
      }
      this.$axios
        .fetchPost("/API/Wen/addQuestionAnswers", {
          uId: this.uid,
          content: this.message,
          tId: this.tid
        })
        .then(res => {
          if (res.data.code == 0) {
            this.getDetail();
            this.message = "";
          }
          this.show = false;
          this.$toast(res.data.message);
        });
    },
    showPopupRote(item) {
      this.author = item.name;
      this.pid = item.pid;
      this.showRote = true;
    },
    subRemark() {
      // 发表评级
      this.$axios
        .fetchPost("API/User/pushAppraises", {
          uId: this.uid, // 用户id
          tId: this.tid, //问题id
          pId: this.pid, // 问题pid
          score: this.roteValue, //星级
          comment: this.messageRote //回答内容
        })
        .then(res => {
          if (res.data.code == 0) {
            this.showRote = false;
            this.getDetail();
            this.roteValue = 1;
            this.messageRote = "";
          }
          this.$toast(res.data.message);
        });
    },
    // onChangeRote(value) {
    //   // console.log("1 :>> ", value);
    // },
    preview(item, index) {
      //网诊的图片预览
      ImagePreview({
        images: item,
        startPosition: index,
        closeable: true
      });
    },
    goToExpert(isExpert, id) {
      // 路由 去个人中心主页 或者医院主页
      if (isExpert == 0 || isExpert == 1) {
        this.$router.push({
          path: "/expert",
          query: { id: id }
        });
      } else if (isExpert == 2) {
        this.setMid(id);
        this.$router.push({
          path: "/hospital"
        });
      }
    },
    benefit() {
      // 补助提示
      this.$dialog
        .alert({
          message: "回答该问题，能获得平台补助",
          confirmButtonText: "知道了",
          confirmButtonColor: "#155BBB"
        })
        .then(() => {
          // on close
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
.ask_detail-container
  padding-bottom 50px
  height 100%
  position absolute
  top 40px
  bottom 0
  right 0
  left 0
  .online-box
    margin-top 10px
    background #fff
    padding 12px
  .answer-box
    margin-top 10px
    background #ebebeb
    .title
      height 40px
      line-height 40px
      padding-left 12px
      color #333
      font-size 16px
      border-bottom 1px solid #e5e5e5
      background #fff
    .answer-ul
      padding-bottom 55px
      li
        border-bottom 1px solid #e5e5e5
        padding-right 12px
        padding-left 12px
        padding-top 15px
        padding-bottom 15px
        background #fff
        &:last-child
          border none
        & > .top
          display flex
          align-items center
          padding-bottom 10px
          .avator
            width 35px
            height 35px
            margin-right 15px
          .name
            color #333333
            font-size 15px
            flex 1
          .time
            color #999999
            font-size 12px
        .text
          color #666666
          font-size 14px
          line-height 20px
        .image-ul
          font-size 0
          padding 5px 0 0
          .item
            width 33.33%
            display inline-block
            padding-right 5px
            height auto
            margin-bottom 5px
            height 105px
            .answer-img
              height 100%
        .lookat-yinongbao
          font-size 14px
          color #999
        .rote
          display flex
          align-items center
          margin-top 10px
          color #155BBB
          font-size 12px
          .icon
            width 15px
            height 15px
            background url('./71.png') no-repeat
            background-size 100% 100%
            background-position center
            margin-right 10px
        .roted-box
          background rgba(243, 243, 243, 1)
          border-radius 5px
          margin-top 15px
          padding 10px
          & > .top
            display flex
            align-items center
            margin-bottom 6px
            .img
              width 35px
              height 35px
              margin-right 15px
            .rig
              .p1
                color #333333
                font-size 15px
              .p2
                color #999999
                font-size 12px
        .star
          color #666
          font-size 13px
          display flex
          align-items center
          padding-left 46px
          span
            margin-left 10px
            vertical-align middle
            margin-top 5px
        .txt
          padding-left 46px
          color #666666
          font-size 13px
          margin-top 10px
  .answer-bar
    height 50px
    position fixed
    bottom 0
    left 0
    right 0
    background #fff
    display flex
    align-items center
    .border
      border 1px solid #e5e5e5
      border-radius 5px
      margin 0 12px
      flex 1
      color #989898
      font-size 14px
      height 29px
      line-height 29px
      padding-left 10px
  .van-popup-box
    .sub
      color #999999
      font-size 15px
      text-align right
      height 50px
      line-height 50px
      padding-right 12px
    .message-box
      border-top 1px solid #e5e5e5
      height 175px
      .message
        height 100%
  .rotes
    padding 14px 12px
    .sub
      position absolute
      right 0
      top 0
      color #999
      font-size 12px
      padding 16px 12px
    .title
      color #333333
      font-size 15px
      margin-bottom 15px
      font-weight 400
    .rote-text
      color #666666
      font-size 13px
      vertical-align middle
      line-height 27px
      display inline-block
      vertical-align top
      margin-top 3px
      margin-left 20px
    .message
      height 100px
      border 1px solid #e5e5e5
      margin-top 10px
      /deep/.van-field__word-limit
        margin-top 0
.online-box
  position relative
  .top
    padding-top 15px
    display flex
    align-items center
    .avator
      width 35px
      height 35px
      margin-right 15px
    .name
      flex 1
      color #343434
      font-size 15px
      line-height 20px
    .time
      width auto
      font-size 12px
      color #9A9A9A
      line-height 20px
  .subsidy
    position absolute
    right 13px
    top 20px
    width 15px
    height 15px
    background url('./55.png') no-repeat
    background-size cover
    background-position center center
  .text
    color #666666
    font-size 14px
    line-height 22px
    margin 10px 0
  .img-list
    font-size 0
    .item
      width 33.33%
      height 105px
      padding-right 12px
      display inline-block
      margin-bottom 12px
      .img
        width 100%
        height 100%
  .bottom
    padding-bottom 14px
    padding-top 12px
    display flex
    justify-content space-between
    align-items center
    font-size 12px
    color #9A9A9A
    padding-right 12px
    .left
      display flex
      align-items center
      .icon
        width 15px
        height 15px
        background red
        margin-right 10px
        background url('./50.png') no-repeat
        background-size cover
        background-position center
    .right
      display flex
      align-items center
      .icon
        width 30px
        height 30px
        margin-left 15px
.subText
  &.content
    color #81b4f3 !important
.ask_detail-container
  &.jiashicang
    background #080f3e
    top 0
    padding-top 30px
    .header-container
      background  #0c3387
      max-width 1200px
      margin 0 auto
      /deep/.no_index_header
        color #fff
    .answer-bar
      background  #0c3387
      max-width 1200px
      margin 0 auto
    .online-box
      background  #0c3387
      max-width 1200px
      margin 0 auto
      .name
        color #81b4f3
      .time
        color #81b4f3
      .text
        color #81b4f3
      .bottom
        color #81b4f3
    .answer-box
      background  #0c3387
      color #81b4f3
      max-width: 1200px;
      margin: 0 auto;
      .name
        color #81b4f3 !important
      .time
        color #81b4f3 !important
      .text
        color #81b4f3 !important
      .lookat-yinongbao
        color #81b4f3 !important
      .title
        color #81b4f3
        border-bottom 1px solid #9d9d9d !important
        background  #0c3387
      .roted-box
        background: #010f47 !important
        .p1,.p2,.star,.txt
          color #81b4f3 !important
    .van-popup,.van-cell
      background  #0c3387
      .sub
       color #81b4f3 !important
    /deep/.van-field__control
      color #fff
    .answer-ul li
      border-bottom 1px solid #9d9d9d !important
      background  #0c3387
    .border
      border 1px solid #9d9d9d !important
</style>
