<template>
  <div class="choose_crop-container">
    <form action="/" class="from">
      <van-search
        v-model="value"
        show-action
        placeholder="请输入作物名"
        @search="onSearch"
        @cancel="onCancel"
        clearable
        @input="onSearch"
      />
    </form>
    <van-index-bar
      class="bar"
      :index-list="letterList"
      v-show="!searchResultShow"
    >
      <div v-for="item in list" :key="item.id">
        <van-index-anchor :index="item.letter" />
        <van-cell
          :title="it.name"
          v-for="it in item.index"
          :key="it.fid"
          @click="choose(it)"
        />
      </div>
    </van-index-bar>
    <ul class="search_result-ul" v-show="searchResultShow">
      <div class="noData" v-show="noResult">
        抱歉没有该作物,可选择<span
          class="other"
          @click="choose({ name: '其他', fid: 195 })"
          >其他</span
        >
      </div>
      <li v-for="item in searchResult" :key="item.fid" @click="choose(item)">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "askChooseCrop",
  metaInfo: {
    title: "选择作物"
  },
  components: {},
  props: {
    baseEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: "",
      list: [],
      hispitalList: [],
      cropName: this.$route.query.crop,
      searchResult: [],
      searchResultShow: false,
      noResult: false
    };
  },
  created() {},
  computed: {
    ...mapState(["uid"]),
    letterList() {
      let arr = [];
      this.list.forEach(el => {
        arr.push(el.letter);
      });
      return arr;
    },
    crops() {
      let arr = [];
      this.list.forEach(el => {
        arr = arr.concat(el.index);
      });
      return arr;
    }
  },
  watch: {
    searchResult(newVal) {
      if (newVal.length == 0) {
        this.noResult = true;
      } else {
        this.noResult = false;
      }
    }
  },
  mounted() {
    this.getCropList();
  },
  destroyed() {},
  methods: {
    onSearch(val) {
      this.searchResult = [];
      this.crops.forEach(el => {
        if (el.name.indexOf(val) >= 0) {
          this.searchResult.push(el);
        }
      });
      this.searchResultShow = true;
      if (val == "") {
        this.searchResultShow = false;
      }
    },
    choose(item) {
      //搜索历史 选择作物
      if (!this.baseEdit) {
        this.$router.go(-1);
      }

      this.$emit("getCrop", item);
      this.searchResultShow = false;
    },
    onCancel() {
      if (!this.baseEdit) {
        this.$router.go(-1);
      }
      let item = "cancel";
      this.$emit("getCrop", item);
      this.searchResultShow = false;
    },
    getCropList() {
      this.$axios
        .fetchPost("API/Mpublic/getCropIndexQuery", { uId: this.uid })
        .then(res => {
          if (res.data.code == 0) {
            this.list = res.data.data;
            this.hispitalList = res.data.historydata;
          }
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
.choose_crop-container
  padding-top 54px
  position relative
  position fixed
  background #fff
  left 0
  top 0
  right 0
  bottom 0
  z-index 333333
  overflow auto
  /deep/.van-field__control
    text-align left !important
  .content
    height auto
  .from
    position fixed
    top 0px
    left 0
    right 0
    z-index 1111
  .history-box
    margin-top 10px
    .title
      height 40px
      line-height 40px
      color #333333
      font-size 15px
      padding-left 12px
      background #fff
    .history-ul
      padding-left 12px
      font-size 0
      .small-title
        font-size 12px
        color #999999
        line-height 12px
        padding 15px 0
      li
        min-width 65px
        padding 0 5px
        height 25px
        line-height 25px
        color #333333
        background #fff
        font-size 15px
        display inline-block
        margin-right 15px
        margin-bottom 10px
        border-radius 8px
        text-align center
  .search_result-ul
    position absolute
    top 62px
    left 0
    right 0
    bottom 0
    background #EBEBEB
    z-index 111
    border-top 1px solid #e5e5e5
    li
      line-height 40px
      border-bottom 1px solid #e5e5e5
      background #fff
      height 40px
      color #333333
      font-size 14px
      padding 0 12px
    .noData
      height 300px
      padding-top 200px
      text-align center
      .other
        color #155BBB
</style>
