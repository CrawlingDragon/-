<template>
  <div class="expert_registration-container">
    <Header navHeader="专家挂号"></Header>
    <div class="registration-box">
      <div class="title">
        <div class="left"></div>
        <div class="mid">上午</div>
        <div class="right">下午</div>
      </div>
      <div class="item-box">
        <div class="item" v-for="item in list" :key="item.week">
          <div class=" left">
            {{item.week}} <br /> <span class="days">{{item.ymd}}</span>
          </div>
          <div class="mid">
            <div class="p1" v-if="item.data.am.realname == '无号源'" @click="clickNo">无号源</div>
            <div class="now" v-if="item.data.am.realname == '即将放号'" @click="rightNow">{{item.data.am.realname}}</div>
            <div class="number" v-if="item.data.am.realname != '无号源' && item.data.am.realname != '即将放号'" @click="registration(item.data.am,'上午')">总{{item.data.am.nums}} 剩{{item.data.am.surplus}}</div>
            <div class="expert" v-if="item.data.am.realname != '无号源'">{{item.data.am.realname}}</div>
          </div>
          <div class="right">
            <div class="p1" v-if="item.data.pm.realname == '无号源'" @click="clickNo">无号源</div>
            <div class="now" v-if="item.data.pm.realname == '即将放号'" @click="rightNow">{{item.data.pm.realname}}</div>
            <div class="number" v-if="item.data.pm.realname != '无号源' && item.data.pm.realname != '即将放号'" @click="registration(item.data.pm,'下午')">总{{item.data.pm.nums}} 剩{{item.data.pm.surplus}}</div>
            <div class=" expert" v-if="item.data.pm.realname != '无号源'">{{item.data.pm.realname}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/hospital_header/hospital_header";
import { mapState } from "vuex";
import { Dialog } from "vant";
export default {
  name: "expertRegistration",
  components: { Header, [Dialog.Component.name]: Dialog.Component },
  props: {},
  metaInfo: {
    title: "专家挂号",
  },
  data() {
    return {
      list: [],
    };
  },
  created() {},
  computed: {
    ...mapState(["mid", "uid"]),
  },
  watch: {},
  mounted() {
    this.getList();
  },

  destroyed() {},
  methods: {
    clickNo() {
      this.$toast("抱歉,该时间段没有专家号");
    },
    getList() {
      // 获取挂号-医院排版
      this.$axios
        .fetchPost("API/Mpublic/getSubscribeData", { mId: this.mid })
        .then((res) => {
          if (res.data.code == 0) {
            this.list = res.data.data;
          }
        });
    },
    registration(item, halfDay) {
      if (item.surplus == 0) {
        this.$toast("抱歉,该时间段没有专家号");
        return;
      }
      let title = `确定挂${this.timeFormat(parseInt(item.ymd) * 1000)}${halfDay}${
        item.realname
      }的号吗?`;

      let obj = {
        mId: this.mid,
        eId: item.eid,
        uId: this.uid,
        ymd: item.ymd,
        apm: item.apm,
      };

      this.$dialog
        .confirm({
          message: title,
          confirmButtonText:'取消',
          confirmButtonColor:'#999',
          cancelButtonText:'确定',
          cancelButtonColor:'#155BBB'
        })
        .then(() => {
          // on confirm
          
        })
        .catch(() => {
          // on cancel
          this.$axios
            .fetchPost("API/Mpublic/AddSubscribeData", obj)
            .then((res) => {
              if (res.data.code == 0) {
                this.getList();
                this.$dialog
                  .confirm({
                    title: "挂号成功",
                    message: res.data.message,
                    cancelButtonText: "挂号记录",
                    cancelButtonColor:"#155BBB",
                    confirmButtonText: "关闭",
                    confirmButtonColor:'#999'
                  })
                  .then(() => {
                    // on confirm
                    
                  })
                  .catch(() => {
                    // on cancel
                    this.$router.push({
                      path: "/me_registration",
                    });
                  });
              } else {
                this.$dialog.alert({
                  message: res.data.message,
                  confirmButtonText:'知道了',
                   confirmButtonColor:"#155BBB"
                }).then(() => {
                  // on close
                });
                // this.$toast(res.data.message);
              }
            });
        });
    },
    rightNow() {
      // 即将放号
      this.$toast("每天7点开始放号");
    },
    //时间戳转化成时间格式
    timeFormat(timestamp) {
      function add0(m) {
        return m < 10 ? "0" + m : m;
      }
      //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
      var time = new Date(timestamp);
      var month = time.getMonth() + 1;
      var date = time.getDate();
      return month + "月" + add0(date) + "日";
    },
  },
};
</script>
<style lang="stylus" scoped>
.expert_registration-container
  .title
    margin-top 10px
    background #fff
    height 40px
    line-height 40px
    font-size 0
    border-bottom 1px solid #e5e5e5
    padding 0 12px
    display flex
    & > div
      flex 1
      font-size 15px
      color #333
    .mid
      text-align center
      flex 2
    .right
      text-align center
      flex 2
  .item-box
    background #fff
    padding 0 12px
    .item
      background #fff
      border-bottom 1px solid #e5e5e5
      display flex
      height 75px
      align-items center
      justify-content center
      &:last-child
        border none
      & > div
        flex 1
      .left
        font-size 15px
        color #333
        .days
          color #999
          font-size 12px
      .mid, .right
        text-align center
        flex 2
        font-size 12px
        color #999
        .number
          color #155BBB
          padding 9px 12px
          border 1px solid #155BBB
          border-radius 4px
          display inline-block
          line-height 12px
          margin-bottom 5px
        .now
          color #999999
          padding 9px 12px
          border 1px solid #999999
          border-radius 4px
          display inline-block
          line-height 12px
          margin-bottom 5px
</style>
