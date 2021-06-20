<template>
  <div class="into_hospital-conatiner">
    <Header></Header>

    <div class="box" v-if="list_joinin != '' && list_joinin != undefined">
      <div class="title">加入的医院</div>
      <ul>
        <li v-for="item in list_joinin" :key="item.id">
          <RecommendHospital :list="item"></RecommendHospital>
        </li>
      </ul>
    </div>
    <div class="box" v-if="list_fav != '' && list_fav != undefined">
      <div class="title">关注的医院</div>
      <ul>
        <li v-for="item in list_fav" :key="item.id">
          <RecommendHospital :list="item"></RecommendHospital>
        </li>
      </ul>
    </div>
    <div class="box" v-if="list_area != '' && list_area != undefined">
      <div class="title">庄稼医院</div>
      <ul>
        <li v-for="item in list_area" :key="item.id">
          <RecommendHospital :list="item"></RecommendHospital>
        </li>
      </ul>
    </div>
    <van-loading
      size="24px"
      vertical
      style="height:200px;padding-top:130px"
      v-if="loading"
      >加载中...</van-loading
    >
    <div id="container" style="display:none"></div>
    <Foot></Foot>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import RecommendHospital from "@/components/recommend_hospital/recommend_hospital";
import { mapMutations, mapState } from "vuex";
import Foot from "@/components/foot/foot";
// import AMapLoader from "@amap/amap-jsapi-loader";
import AMap from "AMap";
export default {
  name: "intoHospital",
  components: { Header, RecommendHospital, Foot },
  props: {},
  metaInfo: {
    title: "进院"
  },
  data() {
    return {
      list_joinin: "",
      list_fav: "",
      list_area: "",
      address: "", // 定位的地址
      location: "",
      loading: true
    };
  },
  computed: {
    ...mapState(["uid", "mid", "initMid"])
  },
  watch: {},
  created() {},
  mounted() {
    // this.getaddress();
    this.getList();
  },
  destroyed() {},
  methods: {
    ...mapMutations(["setHeaderLogo", "setHeaderText", "setInitMid"]),
    getaddress() {
      let that = this;
      let map = new AMap.Map("container", {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 11 //初始地图级别
      });
      AMap.plugin("AMap.Geolocation", function() {
        //开始定位
        // console.log('开始定位2222 :>> ');
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：无穷大
          maximumAge: 10000, //定位结果缓存0毫秒，默认：0
          convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: false, //显示定位按钮，默认：true
          buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20) //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        });
        //替换方法
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function(status, result) {
          if (status == "complete") {
            onComplete(result);
          } else {
            onError(result);
          }
        });
      });
      function onComplete(data) {
        AMap.plugin("AMap.Geocoder", function() {
          var geocoder = new AMap.Geocoder({});
          var lnglat = [data.position.lng, data.position.lat];
          geocoder.getAddress(lnglat, function(status, result) {
            if (status === "complete" && result.info === "OK") {
              // result为对应的地理位置详细信息
              // console.log("result :>> ", result);
              that.address = result.regeocode.addressComponent.district;
              that.location =
                result.regeocode.addressComponent.province +
                "," +
                result.regeocode.addressComponent.city +
                "," +
                result.regeocode.addressComponent.district;
              window.sessionStorage.setItem(
                "city",
                result.regeocode.addressComponent.city
              );
              window.sessionStorage.setItem("level", 2);
              // 获取头部文案和logo 和 mid
              that.$axios
                .fetchGet("/API/Index/changearea", {
                  areacity: result.regeocode.addressComponent.city,
                  level: 2
                })
                .then(res => {
                  if (res.data.code == 0) {
                    that.setHeaderLogo(res.data.data.logo);
                    that.setHeaderText(res.data.data.title);
                    that.setInitMid(res.data.data.mid);
                    that.getList(res.data.data.mid);
                  }
                });
            }
          });
        });
      }
      function onError(error) {
        console.log("定位失败 :>> ");
        console.log("error2 :>> ", error);
        that.$dialog.alert({
          message: "定位失败",
          confirmButtonText: "知道了",
          confirmButtonColor: "#155BBB"
        });
        that.address = "定位失败";
        setTimeout(() => {
          that.getList("定位失败");
        }, 100);
      }
    },
    getList() {
      let city = window.localStorage.getItem("city");
      let level = window.localStorage.getItem("level");
      this.$axios
        .fetchPost("API/Entrance/index", {
          uId: this.uid,
          location: city,
          level: level,
          mId: this.initMid
        })
        .then(res => {
          if (res.data.code == 0) {
            this.list_joinin = res.data.data.list_joinin;
            this.list_fav = res.data.data.list_fav;
            this.list_area = res.data.data.list_area;
            this.$nextTick(() => {
              this.loading = false;
            });
          }
        });
    }
    // getMyAddress() {
    //   this.$axios
    //     .fetchPost("Mobile/User/userCenter", {
    //       uId: this.uid,
    //       mId: this.mid,
    //     })
    //     .then((res) => {
    //       if (res.data.code == 0) {
    //         this.$nextTick(() => {
    //           this.loading = false;
    //         });
    //         let myAddress = res.data.data.ismember;
    //         if (myAddress == 1) {
    //           this.location = "浙江省,绍兴市";
    //           this.address = "绍兴市";
    //           setTimeout(() => {
    //             this.getList();
    //           }, 100);
    //         } else {
    //           setTimeout(() => {
    //             this.getaddress();
    //           }, 100);
    //         }
    //       }
    //     });
    // },
  }
};
</script>
<style lang="stylus" scoped>
.into_hospital-conatiner
  padding-bottom 50px
  .box
    margin-top 10px
    background #fff
    .title
      height 40px
      line-height 40px
      color #333
      font-size 17px
      border-bottom 1px solid #e5e5e5
      padding-left 12px
    ul
      margin-left 12px
      margin-top 10px
      padding-bottom 15px
      li
        width 50%
        display inline-block
        padding-right 12px
        padding-bottom 12px
        height 300px
        vertical-align top
        position relative
        .recommend-hospital-wrap
          height 100%
          /deep/.p3
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            padding-right 5px
          /deep/.p1
            padding-right 5px
          /deep/.p2
            padding-right 5px
          /deep/.number
           position absolute
           bottom 10px
</style>
