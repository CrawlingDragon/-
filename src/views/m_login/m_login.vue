<template>
  <div class="m_login-container">
    <Header :indexHeader="false"></Header>
    <div class="title">短信快捷登录<span @click="goToSign">注册</span></div>
    <van-form @submit="onSubmit" class="from">
      <van-field
        v-model="mPhone"
        name="phone"
        placeholder="请输入手机号"
        :rules="[
          { validator: validatorPhone },
          { required: true, message: '请填写手机号' }
        ]"
      />
      <van-field
        v-model="mCode"
        name="code"
        center
        clearable
        placeholder="请输入4位验证码"
        maxlength="4"
        :rules="[{ required: true }]"
      >
        <template #button>
          <div class="btn" v-show="showBtn" @click="start">发送验证码</div>
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
      <div style="margin: 16px;margin-top:45px">
        <van-button
          round
          block
          type="info"
          native-type="submit"
          class="sub"
          :class="{ success: this.mPhone && this.mCode }"
        >
          登录
        </van-button>
      </div>
    </van-form>
    <div class="go-login" @click="goToLogin">账号密码登录</div>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import { mapMutations } from "vuex";
export default {
  name: "mLogin",
  metaInfo: {
    title: "短信快捷登录"
  },
  components: { Header },
  props: {},
  data() {
    return {
      showBtn: true,
      clickTrue: false,
      success: false,
      mPhone: "",
      mCode: ""
    };
  },
  created() {},
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    ...mapMutations(["setUid", "setIsMember", "setLogined"]),
    validatorPhone(val) {
      // 验证手机号码
      if (/^1(3|4|5|6|7|8|9)\d{9}$/.test(val)) {
        this.clickTrue = true;
      } else {
        this.clickTrue = false;
      }
      return /^1(3|4|5|6|7|8|9)\d{9}$/.test(val);
    },
    finish() {
      this.$refs.countDown.reset();
      this.showBtn = true;
      this.clickTrue = true;
    },
    onSubmit() {
      this.lgoinFn(this.mCode, this.mPhone);
    },
    start() {
      if (!this.clickTrue) {
        return;
      }
      this.sendPhone();
    },
    sendPhone() {
      //发送验证码
      this.$axios
        .fetchPost("API/Member/ServerSmsCode", {
          mobile: this.mPhone
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$toast(res.data.message);
            this.clickTrue = false;
            this.showBtn = false;
            setTimeout(() => {
              this.$refs.countDown.start();
            }, 100);
          } else {
            this.$toast(res.data.message);
          }
        });
    },
    lgoinFn(code, username) {
      this.$axios
        .fetchPost("API/Member/codelogin", { code, username })
        .then(res => {
          if (res.data.code == 0) {
            this.setUid(res.data.data.uid);
            this.setIsMember(res.data.data.ismember);
            this.setLogined(1);
            for (let i = 0; i < res.data.data.msg.length; i++) {
              this.createScript(res.data.data.msg[i]);
            }
            this.$router.push({
              path: "/"
            });
          }
          this.$toast(res.data.message);
        });
    },
    createScript(src) {
      let js = document.createElement("script");
      js.setAttribute("type", "text/javascript");
      js.src = src;
      document.getElementsByTagName("head")[0].appendChild(js);
    },
    goToSign() {
      this.$router.push({
        path: "/sign"
      });
    },
    goToLogin() {
      this.$router.push({
        path: "/login"
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.m_login-container
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
