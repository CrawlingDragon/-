<template>
  <div class="base_center-container">
    <ul class="ul">
      <li v-for="item in baseList" :key="item.gid">
        <BaseCenterItem :baseItem="item"></BaseCenterItem>
      </li>
    </ul>
    <van-empty description="暂无基地" v-show="noData">
      <div class="add-new-base" @click="addBase">新增基地</div>
    </van-empty>
  </div>
</template>
<script>
import BaseCenterItem from "../base_center_item/base_center_item.vue";
import axios from "@/http.js";
import { mapState } from "vuex";
export default {
  metaInfo: {
    title: "基地中心"
  },
  name: "base_center",
  components: { BaseCenterItem },
  props: {},
  data() {
    return { noData: false, baseList: [] };
  },
  computed: {
    ...mapState(["uid"])
  },
  watch: {},
  mounted() {
    this.getBaseCenterList();
  },
  destroyed() {},
  methods: {
    getBaseCenterList() {
      axios.fetchGet("/API/User/getgbaselist", { uId: this.uid }).then(res => {
        if (res.data.code == 0) {
          this.baseList = res.data.data;
        } else if (res.data.code === 201) {
          this.noData = true;
        }
      });
    },
    addBase() {
      this.$router.push({
        path: "/baseInfoEdit",
        query: { from: "add" }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.base_center-container
  .ul
    li
      margin-top 10px
  .add-new-base
    width: 112px;
    height: 40px;
    background: #155BBB;
    border: 1px solid #155BBB;
    border-radius: 40px;
    font-size: 15px;
    color: #FFFFFF;
    line-height 40px
    text-align center
</style>
