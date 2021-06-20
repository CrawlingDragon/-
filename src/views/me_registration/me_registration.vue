<template>
  <div class="me_registration-container">
    <Header :indexHeader="false"></Header>
    <ul>
      <li v-for="item in list" :key="item.id">
        <RegistrationItem :list="item"></RegistrationItem>
      </li>
      <div class="noData" v-if="noData">
        <div class="p1">暂无挂号记录</div>
        <div class="p2">申请庄稼医院会员，挂号专家咨询</div>
      </div>
    </ul>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import RegistrationItem from "@/components/register_item/register_item";
import { mapState } from "vuex";

export default {
  name: "meRegistration",
  components: { Header, RegistrationItem },
  props: {},
  metaInfo: {
    title: "挂号记录",
  },
  data() {
    return {
      list: [],
      noData: false,
    };
  },
  created() {},
  computed: {
    ...mapState(["uid"]),
  },
  watch: {},
  mounted() {
    this.getRegistration();
  },
  destroyed() {},
  methods: {
    getRegistration() {
      this.noData = false;
      this.$axios
        .fetchPost("/API/User/getSubscribe", { uId: this.uid })
        .then((res) => {
          if (res.data.code == 0) {
            this.list = res.data.data;
          } else if (res.data.code == 201) {
            this.noData = true;
          }
        });
    },
  },
};
</script>
<style lang="stylus" scoped>
.me_registration-container
  ul
    li
      margin-top 10px
      background #fff
      overflow hidden
      padding 0 12px
  .noData
    height 200px
    padding-top 150px
    text-align center
    .p1
      color #333333
      font-size 15px
    .p2
      font-size 12px
      color #999
      margin-top 10px
</style>
