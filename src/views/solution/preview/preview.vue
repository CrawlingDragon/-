<template>
  <div class="preview">
    <Header :indexHeader="false" :goBackHeader="true"></Header>
    <van-sticky :offset-top="40">
      <div class="step-title-bar">
        <div class="title-content" ref="title">
          <div
            v-for="(item, index) in navBar"
            :key="item.classname"
            ref="item"
            class="item-wrap"
            :class="{ active: active1 === index }"
            @click="clickHandle(item, index)"
          >
            <div class="item">
              {{ item.classname }}
            </div>
            <van-icon name="arrow" class="arrow" />
          </div>
        </div>
      </div>
    </van-sticky>
    <div class="steps" v-for="item in caseArr" :key="item.id" ref="it">
      <div class="step-box">
        <div class="title">{{ item.classname }}</div>
        <div class="step" v-for="it in item.lists" :key="it.id">
          <div class="small-title">{{ it.classname }}</div>
          <div class="right">
            <div class="time">{{ it.timepoint }}</div>
            <div class="text">
              {{ it.content }}
            </div>
            <div class="pharmacy" v-if="it.druginfo.length !== 0">
              <div class="pharmacy-title">用药推荐：</div>
              <div
                class="pharmacy-item"
                v-for="drug in it.druginfo"
                :key="drug.specid"
              >
                <van-image class="img" :src="drug.thumb" fit="fill"></van-image>
                <div class="pharmacy-text">
                  <div class="p1">{{ drug.name }}</div>
                  <div class="p2">{{ drug.spec }}×{{ drug.price }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import axios from "@/http";
import { mapState } from "vuex";
export default {
  name: "preview",
  metaInfo: {
    title: "预览"
  },
  components: { Header },
  props: {},
  data() {
    return {
      w: 0,
      caseArr: [],
      active1: 0,
      top: 0,
      re: [],
      active: 0,
      offTop: []
    };
  },
  computed: {
    ...mapState(["uid"]),
    pId() {
      return this.$route.query.pId;
    },
    navBar() {
      let arr = [];
      if (this.caseArr.length !== 0) {
        this.caseArr.forEach((item, index) => {
          arr.push({
            classname: item.classname,
            index: index,
            option: this.offTop[index]
          });
        });
      }
      return arr;
    }
  },
  watch: {
    caseArr() {
      this.$nextTick(() => {
        this.re = this.$refs.it;
        this.re.forEach(item => {
          this.offTop.push(item.offsetTop - 100);
        });
      });
    }
  },
  mounted() {
    this.getPreviewData();
    window.addEventListener("scroll", this.handleScroll, false);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll, false);
  },
  methods: {
    clickHandle(top, index) {
      this.$nextTick(() => {
        this.active1 = index;
        this.top = this.$refs.it[index].offsetTop;
        window.scrollTo({
          top: this.top - 100,
          behavior: "smooth"
        });
      });
    },
    handleScroll() {
      const aa = document.documentElement.scrollTop;
      setTimeout(() => {
        const arr = [...this.navBar].reverse();
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].option <= aa) {
            this.active = arr.length - 1 - i;
            break;
          }
        }
      }, 200);
      this.active1 = this.active;
    },
    getPreviewData() {
      axios
        .fetchGet("/API/User/getUserproject", {
          uId: this.uid,
          action: "template_preview",
          pId: this.pId
        })
        .then(res => {
          let data = res.data;
          if (data.code === 0) {
            this.caseArr = data.data.list;
            this.getNavWidth();
            // this.$nextTick(() => {
            //   console.log("this. caseArr:>> ", this.caseArr);
            //   console.log("this.$refs.it :>> ", this.$refs.it);
            // });
          }
          if (data.errcode) {
            alert(data.message);
          }
        });
    },
    getNavWidth() {
      this.$nextTick(() => {
        this.$refs.item.forEach(it => {
          let w1 = it.offsetWidth;
          this.w += w1;
        });
        this.$refs.title.style.width = this.w + "px";
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.preview
  .step-title-bar
    width 100%
    overflow auto
    padding 10px 12px
    background #fff
    .title-content
      .item-wrap
        display inline-block
        .item
          padding 8px 13px
          background: #F1FAFE;
          border-radius: 8px;
          color #155BBB
          font-size 14px
          display inline-block
        .arrow
          display inline-block
          padding 0 9px
          vertical-align middle
          color #D5E3FD
          font-size 11px
        &:last-child
          .arrow
            display none
        &.active
          .item
            background #155BBB
            color #FFFFFF
  .steps
    background #fff
    padding-left 20px
    .step-box
      border-left 2px solid #D5E3FD;
      padding-left 16px
      .title
        font-size 17px
        color #155BBB
        font-weight: bold;
        position relative
        margin-bottom 20px
        &::before
          content ""
          width 18px
          height 18px
          border 5px solid #155BBB
          border-radius 100%
          position absolute
          left -26px
          top 0
          box-sizing border-box
          background #fff
      .step
        padding-bottom 20px
        .small-title
          font-size 15px
          color #333
          font-weight: bold;
          position relative
          &::before
            content ""
            width 15px
            height 15px
            border 3px solid #D5E3FD
            border-radius 100%
            position absolute
            left -25px
            top 2px
            box-sizing border-box
            background #155BBB
        .right
          margin-top 18px
          margin-right 12px
          background #F2F7F7
          position relative
          padding 10px 10px 10px
          color #666666
          font-size 15px
          line-height 1.2
          &:before
            content ''
            width 10px
            height 10px
            background url('./bj-icon.png') no-repeat
            background-size 100% 100%
            position absolute
            left 10px
            top -10px
          .time
            line-height 1.2
            margin-bottom 12px
          .text
            line-height 1.4
            margin-bottom 0
          .pharmacy
            .pharmacy-title
              margin-top 15px
            .pharmacy-item
              display flex
              margin-top 10px
              .img
                width 60px
                height 60px
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                margin-right 10px
              .pharmacy-text
                .p1
                  color #666666
                  font-size 14px
                  margin-bottom 10px
                  line-height 1.2
                .p2
                  color #999999
                  font-size 14px
</style>
