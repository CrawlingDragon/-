<template>
  <div class="base_location-container">
    <div id="container"></div>
    <div class='center'>
        <div id='bt' class="btmtip">22点击去高德地图</div>
    </div>
  </div>
</template>
<script>

// import AMapLoader from "@amap/amap-jsapi-loader";
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
      lng: 0,
      lat: 0,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // this.getaddress();
  },
  destroyed() {},
  methods: {
    
    getaddress() {
      
      // let that = this;
      // AMapLoader.load({
      //   key: "8bda406ee72094ecc33b808e0c1d114c", // 申请好的Web端开发者Key，首次调用 load 时必填
      //   version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      //   plugins: ["AMap.Marker", "AMap.ToolBar","AMap.Driving"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      // }).then((AMap) => {
      //   let map = new AMap.Map("container", {
      //     zoom: 18,
      //     center: [120.582633,29.988245]
      //   });
      //   var button = document.getElementById('bt');
      //   AMap.plugin(["AMap.Driving"], function() {
      //           var drivingOption = {
      //               policy:AMap.DrivingPolicy.LEAST_TIME,
      //               map:map
      //           };
      //           var driving = new AMap.Driving(drivingOption); //构造驾车导航类
      //           //根据起终点坐标规划驾车路线
      //           driving.search([{keyword:'北京站'},{keyword:'北京大学'}],function(status,result){
      //               button.onclick = function(){
      //                   driving.searchOnAMAP({
      //                       origin:result.origin,
      //                       destination:result.destination
      //                   });
      //               } 
      //           });
                
      //       });
      //       map.addControl(new AMap.ToolBar());
            





        //mowei
      // })   
    },

  }
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
  .center
    position: absolute;
    width: 100%;
    bottom: 24px; 
  .btmtip 
    cursor: pointer;
    border-radius: 5px;
    background-color: #0D9BF2;
    padding: 6px;
    width: 160px;
    color: white;
    margin: 0 auto;
        
</style>
