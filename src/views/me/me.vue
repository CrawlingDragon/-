<template>
  <div class="me-container">
    <Header :indexHeader="false"></Header>
    <div class="user-box" @click="goToExpert()">
      <!-- info.uid -->
      <van-image
        class="avator"
        round
        fit="cover"
        :src="info.avatar"
      ></van-image>
      <div class="mid">
        <p class="p1">
          {{ info.realname }}<span>{{ info.grouptitle }}</span>
        </p>
        <p class="p2">用户名:{{ info.username }}</p>
      </div>
      <div class="right" @click.stop="goToEdit">编辑 ></div>
    </div>
    <div class="my-ul">
      <van-cell title="加入的医院" to="/me_hospital" is-link>
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #icon>
          <div class="icon01"></div>
        </template>
      </van-cell>
      <van-cell title="挂号记录" to="/me_registration" is-link>
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #icon>
          <div class="icon02"></div>
        </template>
      </van-cell>
      <van-cell
        title="基地中心"
        :to="{ path: '/base_center', query: { id: info.uid } }"
        is-link
      >
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #icon>
          <div class="icon03"></div>
        </template>
      </van-cell>
      <van-cell
        title="作物解决方案"
        :to="{ path: '/solution', query: { id: info.bid } }"
        is-link
      >
        <template #icon>
          <div class="icon_zuowu"></div>
        </template>
      </van-cell>
      <van-cell title="土壤检测" :to="{ path: '/whole_cetu_list' }" is-link>
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #icon>
          <div class="icon04"></div>
        </template>
      </van-cell>
      <van-cell title="坐诊巡诊" to="/whole_zuozhen_list" is-link>
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #icon>
          <div class="icon05"></div>
        </template>
      </van-cell>
      <van-cell title="问答管理" to="/me_answer" is-link>
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #icon>
          <div class="icon06"></div>
        </template>
      </van-cell>
    </div>
    <van-cell
      title="个人主页"
      :to="{ path: '/expert', query: { from: 'my', id: uid } }"
      is-link
      style="margin-top:10px"
    >
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #icon>
        <div class="icon07"></div>
      </template>
    </van-cell>
    <van-cell title="我的关注" to="/me_attention" is-link>
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #icon>
        <div class="icon08"></div>
      </template>
    </van-cell>
    <van-cell
      title="联系客服 4008596318"
      is-link
      style="margin-top:10px"
      @click="callPhone"
    >
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #icon>
        <div class="icon09"></div>
        <a href="tel:4008596318" ref="tel"></a>
      </template>
    </van-cell>
    <Foot></Foot>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import { mapState } from "vuex";
import Foot from "@/components/foot/foot";
export default {
  name: "me",
  metaInfo: { title: "我的" },
  components: { Header, Foot },
  props: {},
  data() {
    return {
      info: "",
      active: 4
    };
  },
  computed: {
    ...mapState(["uid", "initMid"])
  },
  created() {},
  watch: {},
  mounted() {
    this.getInfo();
  },
  destroyed() {},
  methods: {
    getInfo() {
      this.$axios
        .fetchPost("/API/User/userCenter", {
          uId: this.uid,
          mId: this.initMid
        })
        .then(res => {
          if (res.data.code == 0) {
            this.info = res.data.data;
          }
        });
    },
    goToEdit() {
      this.$router.push({
        path: "/me_edit"
      });
    },
    callPhone() {
      this.$refs.tel.click();
    },
    goToExpert() {
      this.$router.push({
        path: "/expert",
        query: { id: this.uid, from: "my" }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '../../common/css/base.styl';
.me-container
  padding-bottom 60px
  .user-box
    display flex
    padding 20px 12px
    align-items center
    background #fff
    margin-bottom 10px
    margin-top 10px
    .avator
      width 65px
      height 65px
      margin-right 15px
    .mid
      flex 1
      .p1
        color #333333
        font-size 20px
        line-height 20px
        margin-bottom 5px
        span
          margin-left 12px
          color #999
          font-size 12px
      .p2
        color #999
        font-size 12px
    .right
      color #155BBB
      font-size 14px
      padding 0 12px 0 12px
  .my-ul
    .icon01
      width 18px
      height 18px
      background url('./62.png') no-repeat
      background-size 100%
      background-position center
      margin-right 10px
    .icon02
      width 18px
      height 18px
      background url('./60.png') no-repeat
      background-size 100%
      background-position center
      margin-right 10px
    .icon03
      width 18px
      height 18px
      bj-image('./15')
      background-size 100%
      background-position center
      margin-right 10px
    .icon_zuowu
      width 16px
      height 20px
      bj-image('./16')
      margin-right 10px
    .icon04
      width 18px
      height 18px
      background url('./63.png') no-repeat
      background-size 100%
      background-position center
      margin-right 10px
    .icon05
      width 18px
      height 18px
      background url('./64.png') no-repeat
      background-size 100%
      background-position center
      margin-right 10px
    .icon06
      width 18px
      height 18px
      background url('./59.png') no-repeat
      background-size 100%
      background-position center
      margin-right 10px
.icon07
  width 18px
  height 18px
  background url('./65.png') no-repeat
  background-size 100%
  background-position center
  margin-right 10px
.icon08
  width 18px
  height 18px
  background url('./66.png') no-repeat
  background-size 100%
  background-position center
  margin-right 10px
.icon09
  width 18px
  height 18px
  background url('./67.png') no-repeat
  background-size 100%
  background-position center
  margin-right 10px
.van-cell
  align-items center
</style>
