<template>
  <div class="foot-container">
    <van-tabbar v-model="myActive" route>
      <van-tabbar-item :to="indexRoute">
        <!-- @click="goToIndex"  -->
        <template #icon="props">
          <div
            class="icon"
            :class="props.active ? icon01.active : icon01.inactive"
          ></div>
        </template>
        首页
      </van-tabbar-item>
      <van-tabbar-item :to="hospital">
        <template #icon="props">
          <div
            class="icon"
            :class="props.active ? icon02.active : icon02.inactive"
          ></div>
        </template>
        进院
      </van-tabbar-item>
      <van-tabbar-item to="/ask">
        <template #icon="props">
          <div
            class="icon"
            :class="props.active ? icon03.active : icon03.inactive"
          ></div>
        </template>
        提问
      </van-tabbar-item>
      <van-tabbar-item to="/message">
        <template #icon="props">
          <div
            class="icon"
            :class="props.active ? icon04.active : icon04.inactive"
          ></div>
        </template>
        资讯
      </van-tabbar-item>
      <van-tabbar-item replace to="/me">
        <template #icon="props">
          <div
            class="icon"
            :class="props.active ? icon05.active : icon05.inactive"
          ></div>
        </template>
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "foot",
  components: {},
  props: {},
  data() {
    return {
      hospital: "/into_hospital",
      indexRoute: "/",
      myActive: "",
      icon01: {
        active: "icon01_active",
        inactive: "icon01_inactive"
      },
      icon02: {
        active: "icon02_active",
        inactive: "icon02_inactive"
      },
      icon03: {
        active: "icon03_active",
        inactive: "icon03_inactive"
      },
      icon04: {
        active: "icon04_active",
        inactive: "icon04_inactive"
      },
      icon05: {
        active: "icon05_active",
        inactive: "icon05_inactive"
      }
    };
  },
  computed: {
    ...mapState(["initMid"])
  },
  watch: {
    $route(newVal) {
      // console.log("newVal.name :>> ", newVal.name);
      this.getRouterName(newVal.name);
    }
  },
  mounted() {
    let name = this.$route.name;
    this.getRouterName(name);
  },
  destroyed() {},
  methods: {
    ...mapMutations(["setMid"]),
    getRouterName(name) {
      switch (name) {
        case "hospital":
          this.hospital = "/into_hospital";
          this.indexRoute = "/index";
          break;
        case "intoHospital":
          this.hospital = "/into_hospital";
          this.indexRoute = "/index";
          break;
        case "index":
          this.indexRoute = "/index";
          this.hospital = "/into_hospital";
          break;
        case "/":
          this.indexRoute = "/index";
          this.hospital = "/into_hospital";
          break;
        // case 'indexOnline':
        //   this.indexRoute = '/index_online'
        //   this.hospital = '/into_hospital'
        //   break
        case "me":
          this.indexRoute = "/";
          this.hospital = "/into_hospital";
      }
    },
    goToIndex() {
      // 路由 首页
      this.$router.push({ path: "/index" }).catch(err => err);
    },
    goToHospital() {
      // 路由 医院
      this.$router.push({ path: "/hospital" }).catch(err => err);
    },
    goToAsk() {
      // 路由 提问
      this.$router.push({ path: "/ask" }).catch(err => err);
    },
    goToMessage() {
      // 路由 资讯
      this.$router.push({ path: "/message" }).catch(err => err);
    },
    goToMe() {
      // 路由 我的
      this.$router.push({ path: "/me" }).catch(err => err);
    }
  }
};
</script>
<style lang="stylus" scoped>
.foot-container
  .van-tabbar
    left 50%
    transform translateX(-50%)
    max-width 640px
    width 100%
  .icon
    width 25px
    height 25px
  .icon01_active
    background url('./25.png') no-repeat
    background-size cover
    background-position center center
  .icon01_inactive
    background url('./15.png') no-repeat
    background-size cover
    background-position center center
  .icon02_active
    background url('./27.png') no-repeat
    background-size cover
    background-position center center
  .icon02_inactive
    background url('./16.png') no-repeat
    background-size cover
    background-position center center
  .icon03_active
    background url('./29.png') no-repeat
    background-size cover
    background-position center center
  .icon03_inactive
    background url('./17.png') no-repeat
    background-size cover
    background-position center center
  .icon04_active
    background url('./34.png') no-repeat
    background-size cover
    background-position center center
  .icon04_inactive
    background url('./18.png') no-repeat
    background-size cover
    background-position center center
  .icon05_active
    background url('./31.png') no-repeat
    background-size cover
    background-position center center
  .icon05_inactive
    background url('./19.png') no-repeat
    background-size cover
    background-position center center
</style>
