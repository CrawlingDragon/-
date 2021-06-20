<template>
  <div class="base_location-container">
    <div id="container"></div>
  </div>
</template>
<script>

import AMap from "AMap";
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
    this.getaddress();
  },
  destroyed() {},
  methods: {
    
    getaddress() {
      
      let that = this;
      
        let map = new AMap.Map("container", {
          zoom: 18,
          center: [120.582633,29.988245]
        });
      AMap.plugin('AMap.Geocoder', function() {
        var geocoder = new AMap.Geocoder({
          // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        })

        geocoder.getLocation(that.location, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // result中对应详细地理坐标信息
            that.lng = result.geocodes[0].location.lng
            that.lat =  result.geocodes[0].location.lat
            
          }else{
            // console.log('失败result :>> ', result);
            that.$dialog.alert({
              message:"获取地址失败",
              confirmButtonText:'知道了'
            }).then(() => {
            // on close
            that.$router.go(-1)
          });
          }
          map.setCenter([that.lng, that.lat])
          var marker = new AMap.Marker({
              map:map,
              position:[that.lng,that.lat],
              label: {
                offset: new AMap.Pixel(20, 20),//修改label相对于maker的位置
                content: "点击图标打开高德地图"
            } 
            })
            map.add(marker);
           
            marker.on('click',function(){
             marker.markOnAMAP({
                name:that.location,
                position:marker.getPosition()
            })
            })
            AMap.plugin('AMap.ToolBar',function(){//异步加载插件
              var toolbar = new AMap.ToolBar();
              map.addControl(toolbar);
          });
            // map.addControl(new AMap.ToolBar());
            //
        })
      })
        
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
</style>
