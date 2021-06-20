<template>
  <div class="base_center-container">
    <Header :indexHeader="false" :goBackHeader="true"></Header>
    <router-view></router-view>
    <!-- <ul class="ul">
      <li v-for="item in 3" :key="item"><BaseCenterItem></BaseCenterItem></li>
    </ul> -->
  </div>
</template>
<script>
import Header from "@/components/header/header";
// import BaseCenterItem from "./base_center_item/base_center_item.vue";
export default {
  metaInfo: {
    title: "基地中心"
  },
  name: "base_center",
  components: { Header },
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {}
};
</script>
<style lang="stylus" scoped>
.base_center-container
  .ul
    li
      margin-top 10px
</style>
