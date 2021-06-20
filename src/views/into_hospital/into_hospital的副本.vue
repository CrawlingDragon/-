<template>
  <div class="into_hospital-conatiner">
    <Header header="searchHeader" :address="address"></Header>

    <div class="box" v-if="list_joinin != ''">
      <div class="title">加入的医院</div>
      <ul>
        <li v-for="item in list_joinin" :key="item.id">
          <RecommendHospital :list="item"></RecommendHospital>
        </li>
      </ul>
    </div>
    <div class="box" v-if="list_fav != ''">
      <div class="title">关注的医院</div>
      <ul>
        <li v-for="item in  list_fav" :key="item.id">
          <RecommendHospital :list="item"></RecommendHospital>
        </li>
      </ul>
    </div>
    <div class="box" v-if="list_area != ''">
      <div class="title">庄稼医院</div>
      <ul>
        <li v-for="item in list_area" :key="item.id">
          <RecommendHospital :list="item"></RecommendHospital>
        </li>
      </ul>
    </div>
    <van-loading size="24px" vertical style="height:200px;padding-top:130px" v-if="loading">加载中...</van-loading>
    <div id="container" style="display:none"></div>
    <Foot></Foot>
  </div>
</template>
<script>
import Header from "@/components/hospital_header/hospital_header";
import RecommendHospital from "@/components/recommend_hospital/recommend_hospital";
import { mapState } from "vuex";
import Foot from "@/components/foot/foot";
import AMapLoader from "@amap/amap-jsapi-loader";
export default {
  name: "intoHospital",
  components: { Header, RecommendHospital, Foot },
  props: {},
  metaInfo: {
    title: "进院",
  },
  data() {
    return {
      list_joinin: "",
      list_fav: "",
      list_area: "",
      address: "", // 定位的地址
      // myAddress: "",
      location: "",
      loading: true,
      
    };
  },
  computed: {
    ...mapState(["uid", "mid"]),
  },
  watch: {},
  created() {},
  mounted() {
    this.getaddress();
  },
  destroyed() {},
  methods: {
    getaddress() {
      let that = this;
      AMapLoader.load({
        key: "8bda406ee72094ecc33b808e0c1d114c", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["Geolocation","Geocoder"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
         let map = new AMap.Map("container", {
            resizeEnable: true, //是否监控地图容器尺寸变化
            zoom: 11, //初始地图级别
          });
          
AMap.plugin("AMap.Geolocation", function () {
            var geolocation = new AMap.Geolocation({
             enableHighAccuracy: true,//是否使用高精度定位，默认:true
              timeout: 10000,          //超过10秒后停止定位，默认：无穷大
              maximumAge: 10000,           //定位结果缓存0毫秒，默认：0
              convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
              showButton: false,        //显示定位按钮，默认：true
              buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
              buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            });
             //替换方法
            map.addControl(geolocation);
            geolocation.getCurrentPosition(function (status, result) {
              if (status == "complete") {
                onComplete(result);
              } else {
                onError(result);
              }
            });
})
          function onComplete(data) {
            AMap.plugin('AMap.Geocoder', function() {
              var geocoder = new AMap.Geocoder({})
              var lnglat = [data.position.lng,data.position.lat]
              geocoder.getAddress(lnglat, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    // result为对应的地理位置详细信息
                // console.log('result :>> ', result);
                let city = result.regeocode.addressComponent.city
                if (city != "绍兴市") {
                that.location = "浙江省,绍兴市";
                that.address = "绍兴市";
                that.$dialog.alert({
                    message: "检测到你的地址不在绍兴市，已自动切换至绍兴市",
                    confirmButtonText: "知道了",
                    confirmButtonColor:"#155BBB"
                  })
                  } else if (city == "绍兴市") {
                    that.location = "浙江省,绍兴市," + result.regeocode.addressComponent.district;
                    that.address = result.regeocode.addressComponent.district;
                  }
                  setTimeout(() => {
                    that.getList();
                  }, 100);
                }
              })
            })
          }
          function onError() {
            // console.log('定位失败 :>> ');
            that.$dialog.alert({
                message: "定位失败,已自动切换到绍兴市",
                confirmButtonText: "知道了",
                confirmButtonColor:"#155BBB"
            })
            that.address = "绍兴市";
            setTimeout(() => {
              that.getList();
            }, 100);
          }
        })
        
    },
    getList() {
      this.$axios
        .fetchPost("API/Entrance/index", {
          uId: this.uid,
          location: this.location,
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.list_joinin = res.data.data.list_joinin;
            this.list_fav = res.data.data.list_fav;
            this.list_area = res.data.data.list_area;
            this.$nextTick(() => {
              this.loading = false;
            });
          }
        });
    },
    // getMyAddress() {
    //   this.$axios
    //     .fetchPost("API/User/userCenter", {
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
  },
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
