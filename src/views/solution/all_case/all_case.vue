<template>
  <div class="take-case-container">
    <ul v-if="!noData">
      <li v-for="item in caseArr" :key="item.id">
        <TakeCaseItem :item="item" @clickLook="clickCase"></TakeCaseItem>
      </li>
    </ul>
    <NoTake v-else></NoTake>
  </div>
</template>
<script>
import NoTake from "../no_take/no_take.vue";
import TakeCaseItem from "../take_case/take_case_item/take_case_item.vue";
import axios from "@/http";
import { mapState } from "vuex";
export default {
  name: "all_case",
  components: { NoTake, TakeCaseItem },
  props: {},
  data() {
    return { caseArr: [], noData: false, action: "template_list", pId: "" };
  },
  computed: { ...mapState(["uid"]) },
  watch: {
    action() {
      this.getCase();
    }
  },
  mounted() {
    this.getCase();
  },
  destroyed() {},
  methods: {
    clickCase(caseStatus) {
      //点击订阅或者取消
      console.log("caseStatus :>> ", caseStatus);
      this.action = caseStatus.status;
      this.pId = caseStatus.pId;
    },
    getCase() {
      axios
        .fetchGet("/API/User/getUserproject", {
          uId: this.uid,
          action: this.action,
          pId: this.pId
        })
        .then(res => {
          let data = res.data;
          if (data.code === 0) {
            this.caseArr = data.data;
          }
          if (data.errcode) {
            alert(data.message);
          }
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
.take-case-container
  padding-bottom 10px
  ul
    padding 0 12px
    li
      min-height 100px
      background #fff
      box-shadow: 0px 3px 15px 0px rgba(206, 215, 229, 0.75);
      border-radius: 15px;
      &:last-child .item-wrap
        border none
</style>
