<template>
  <div class="base_location-container">
    <div id="container"></div>
  </div>
</template>
<script>

import AMapLoader from "@amap/amap-jsapi-loader";
export default {
  name: "baseLocation",
  components: {},
  metaInfo: {
    title: "基地",
  },
  props: {},
  data() {
    return {
      location: this.$route.query.location,
      startLngLat: 0,
      endLngLat: 0,
    };
  },
  computed: {},
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
        plugins: ["AMap.ToolBar", "Geolocation","AMap.Driving","Geocoder"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          let map = new AMap.Map("container", {
            resizeEnable: true,
            center: [116.397428, 39.90923], //地图中心点
            zoom: 13, //地图显示的缩放级别
          });
         
          AMap.plugin('AMap.Geocoder', function() {
            var geocoder = new AMap.Geocoder({})
            geocoder.getLocation(location, function(status, result) {
              if (status === 'complete' && result.info === 'OK') {
                // result中对应详细地理坐标信息
                console.log('result :>> ', result);
              }else{
                console.log('result :>> ', result);
              }
            })
          })
          AMap.plugin("AMap.Geolocation", function () {
            var geolocation = new AMap.Geolocation({
              // 是否使用高精度定位，默认：true
              enableHighAccuracy: true,
              // 设置定位超时时间，默认：无穷大
              timeout: 10000,
              // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
              buttonOffset: new AMap.Pixel(10, 20),
              //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
              zoomToAccuracy: true,     
              //  定位按钮的排放位置,  RB表示右下
              buttonPosition: 'RB'
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition(function(status,result){
                  if(status=='complete'){
                      onComplete(result)
                  }else{
                      onError(result)
                  }
            });
             function onComplete (data) {
              // data是具体的定位信息
              console.log('data :>> ', data);
              that.startLngLat = [data.position.lng,data.position.lat]
              
             var points = [{ keyword: '杭州滨江浙农科创园'},{ keyword:that.location}]
             console.log('points :>> ', points);
              AMap.plugin(['AMap.ToolBar','AMap.Driving'],function(){//异步同时加载多个插件
                  var toolbar = new AMap.ToolBar();
                  map.addControl(toolbar);
                  var driving = new AMap.Driving({
                  // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
                    policy: AMap.DrivingPolicy.LEAST_TIME
                  });//驾车路线规划
                  driving.search(points,function(){})
              });
            }

            function onError (error) {
              // 定位出错
              console.log('error :>> ', error);
            }
      })
        })
  }}
};
</script>
<style lang="stylus" scoped>
.base_location-container
  position fixed
  top 0px
  bottom 0
  left 0
  right 0
  width 100%
  #container
    height 100%
  .center
    position fixed
    right 15px
    bottom 30px
    background #155BBB
    padding 5px
    border-radius 5px
    color #fff
</style>
