<template>
  <div class="expert_detail-container">
    <Header :indexHeader="false"></Header>
    <div class="avator-box" v-if="person.name || person.avatar">
      <van-image class="avator" :src="person.avatar" fit="cover"></van-image>
      <p class="p1">{{person.name}}</p>
    </div>
    <ul class="info-ul" v-if="person.identity ==  1">
      <li v-if="person.skill">
        <div class="left">擅长</div>
        <div class="right">{{person.skill}}</div>
      </li>
      <li v-if="person.residecity">
        <div class="left">所在地</div>
        <div class="right">{{person.residecity}}</div>
      </li>
      <li v-if="person.company">
        <div class="left">单位</div>
        <div class="right">{{person.company}}</div>
      </li>
      <li v-if="person.position != ''">
        <div class="left">职称</div>
        <div class="right">{{person.position}}</div>
      </li>
      <li v-if="person.introduce != ''">
        <div class="left">简介</div>
        <div class="right">{{person.introduce}} </div>
      </li>
    </ul>
    <ul class="info-ul" v-if="person.identity !=  1">
      <li>
        <div class="left">种植作物</div>
        <div class="right">{{person.forum}} </div>
      </li>
    </ul>
  </div>
</template>
<script>
import Header from "@/components/header/header";
export default {
  name: "expertDetail",
  components: { Header },
  metaInfo: {
    title: "个人简介",
  },
  props: {},
  data() {
    return {
      id: this.$route.query.id,
      uid: this.$route.query.uid,
      person: "",
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getPersonDetail();
  },
  destroyed() {},
  methods: {
    getPersonDetail() {
      this.$axios
        .fetchPost("API/user/homepage", { id: this.id, uId: this.uid })
        .then((res) => {
          if (res.data.code == 0) {
            this.person = res.data.data;
          }
        });
    },
  },
};
</script>
<style lang="stylus" scoped>
.expert_detail-container
  .avator-box
    margin-top 10px
    height 150px
    align-items center
    display flex
    flex-wrap wrap
    flex-direction column
    justify-content center
    background #fff
    .avator
      width 65px
      height 65px
      border-radius 10px
      overflow hidden
      margin-bottom 18px
    .p1
      font-size 20px
      color #333333
  .info-ul
    margin-top 10px
    padding-left 12px
    background #fff
    li
      padding 16px 0
      padding-right 12px
      border-bottom 1px solid #e5e5e5
      min-height 50px
      display flex
      &:last-child
        border none
      .left
        width 66px
        color #999999
        font-size 15px
        padding-left 3px
      .right
        flex 1
        color #000000
        font-size 15px
        line-height 22px
</style>
