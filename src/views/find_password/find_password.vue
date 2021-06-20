<template>
  <div class="find_password-container">
    <Header :indexHeader="false"></Header>
    <div class="title">找回密码</div>
    <van-form @submit="onSubmit" class="from">
      <van-field
        v-model="findPhone"
        name="手机号"
        type="tel"
        placeholder="请输入手机号"
        :rules="[{ validator: validatorPhone }, { required: true }]"
      />
      <van-field
        v-model="findCode"
        name="验证码"
        center
        clearable
        placeholder="请输入4位验证码"
        maxlength="4"
        :rules="[{ required: true }]"
      >
        <template #button>
          <div class=" btn" v-if="showBtn" @click="start">发送验证码</div>
          <div v-show="!showBtn">
            <van-count-down
              ref="countDown"
              millisecond
              :time="60000"
              :auto-start="false"
              format="ss秒后重试"
              @finish="finish"
            />
          </div>
        </template>
      </van-field>
      <van-field
        v-model="findPassword"
        type="password"
        name="密码"
        placeholder="请输入密码（6-20位）"
        maxlength="20"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="findPassword2"
        type="password"
        name="密码"
        placeholder="请确认密码"
        maxlength="20"
        :rules="[{ validator: validatorPw2 }, { required: true }]"
      />
      <div style="margin: 16px;margin-top:45px">
        <van-button
          round
          block
          type="info"
          native-type="submit"
          class="sub"
          :class="{
            success: findPhone && findCode && findPassword && findPassword2
          }"
        >
          保存
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import { mapMutations } from "vuex";

export default {
  metaInfo: {
    title: "找回密码"
  },
  name: "findPassword",
  components: { Header },
  props: {},
  data() {
    return {
      showBtn: true,
      clickTrue: false,
      findPhone: "",
      findCode: "",
      findPassword: "",
      findPassword2: ""
    };
  },
  created() {},
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    ...mapMutations(["setUid"]),
    validatorPhone(val) {
      // 验证手机号码
      if (/^1(3|4|5|6|7|8|9)\d{9}$/.test(val)) {
        this.clickTrue = true;
      } else {
        this.clickTrue = false;
      }
      return /^1(3|4|5|6|7|8|9)\d{9}$/.test(val);
    },
    validatorPw2() {
      if (this.findPassword2 != "" && this.findPassword2 == this.findPassword) {
        return true;
      } else {
        return false;
      }
    },
    finish() {
      this.$refs.countDown.reset();
      this.showBtn = true;
      this.clickTrue = true;
    },
    onSubmit() {
      this.lookForPwd(this.findPhone, this.findCode, this.findPassword);
    },
    start() {
      if (!this.clickTrue) {
        return;
      }
      this.sendPhone();
      this.clickTrue = false;
      this.showBtn = false;
      setTimeout(() => {
        this.$refs.countDown.start();
      }, 100);
    },
    sendPhone() {
      //发送验证码
      this.$axios
        .fetchPost("API/Member/ServerSmsCode", {
          mobile: this.findPhone
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$toast(res.data.message);
          } else {
            this.$toast(res.data.message);
          }
        });
    },
    lookForPwd(API, code, password) {
      this.$axios
        .fetchPost("/API/Member/Backuppasswd", { API, code, password })
        .then(res => {
          this.$toast(res.data.message);
          if (res.data.code == 0) {
            this.setUid(res.data.data.uid);
            this.$router.push({
              path: "/"
            });
          }
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
.find_password-container
  height 100%
  position absolute
  left 0
  right 0
  background #fff
  .title
    font-size 24px
    color #333333
    text-align center
    margin 40px 0
    padding-left 40px
    span
      margin-left 19px
      font-size 15px
  .from
    width 80%
    margin 0 auto
    .sub
      background #BBBBBB
      border none
      &.success
        background #ff6600
        color #fff
  .go-login
    margin 15px 0
    text-align center
    color #ff6600
    font-size 15px
  .van-count-down
    color #999
    font-size 13px
</style>
