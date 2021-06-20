<template>
  <div class="ask-container">
    <Header :indexHeader="false"></Header>
    <HospitalHeader v-if="from == 'hospital'" navHeader='提问'></HospitalHeader>
    <div class="title">问题描述</div>
    <van-form @submit="onSubmit" class="from">
      <van-field v-model="message" rows="4" autosize type="textarea" placeholder="请输入具体问题描述" class="text" show-word-limit maxlength="300" name="message" />
      <van-field name="uploader" class="uploader">
        <template #input>
          <van-uploader v-model="uploader" :after-read="afterRead" :before-delete="deleteItem" accept="image/*"  :max-count="9" :before-read="beforeRead"/>
        </template>
      </van-field>
      <div class="choose-crop" @click="goToChooseCrop">
        <div class="left">作物</div>
        <!-- <div class="right" :class="{'location':crop != '请选择'}">{{crop}}</div> -->
        <van-field :value="crop" readonly class="right" :class="{ location: crop != '请选择' }" input-align="right" :border="false" name="crop" />
        <van-icon name="arrow" class="arrow" />
      </div>
      <div class="list" v-if="expert">
        <div class="left">咨询专家</div>
        <div class="right">{{ expert }}</div>
      </div>
      <div class="choose-crop" v-if="ismember == 0 && isShaoxing != '绍兴市'" @click="reLocation">
        <div class="left">所在位置</div>
        <div class="right location" :class="{'fail':address == '定位中···' || address == '抱歉未定位到'}">{{ address }}</div>
        <van-icon name="arrow" class="arrow" />
      </div>
      <div  class="sub">
        <van-button round block type="info" native-type="submit" class="btn">
          提交
        </van-button>
      </div>
      <div id="container" style="width:100px;height:0"></div>
    </van-form>
    <router-view @getCrop="getCrop"></router-view>
    <Foot></Foot>
  </div>
</template>

<script>
import Header from "@/components/header/header";
import HospitalHeader from "@/components/hospital_header/hospital_header";
import { mapState } from "vuex";
import Foot from "@/components/foot/foot";
export default {
  name: "ask",
  components: { Header, Foot ,HospitalHeader},
  props: {},
  metaInfo: {
    title: "提问",
  },
  data() {
    return {
      expert: this.$route.query.expert,
      expertId: this.$route.query.expertId,
      address: "定位中···",
      message: "",
      crop: "请选择",
      fid: "",
      uploader: [],
      imgList: [],
      ismember: '',
      isShaoxing: "",
      userInfo: "",
      locationTime:'first',
      submitBoolean:true,
      from:this.$route.query.from
    };
  },
  computed: {
    ...mapState(["uid", "mid"]),
  },
  created() {},
  watch: {
    ismember(newVal){
      if(newVal == 0 && this.isShaoxing != "绍兴市"){
        this.getLocation();
      }
    }
  },
  mounted() {
    this.getMyAddress();
  },
  destroyed() {},
  methods: {
    onSubmit(values) {
      if (values.message == "") {
        this.$toast("问题描述不能为空");
        return;
      } else if (values.message.length <= 9) {
        this.$toast("问题描述不能少余10个字");
        return;
      } else if (this.address == "定位中···" && this.ismember == 0 && this.isShaoxing != '绍兴市') {
        this.$toast("地址定位中,请稍等");
        return;
      }
      this.subAsk();
    },
    goToChooseCrop() {
      //选择作物
      this.$router.push({
        path: "/ask/ask_choose_crop",
      });
    },
    getCrop(crop) {
      //选择作物
      this.crop = crop.name;
      this.fid = crop.fid;
    },
    beforeRead(file){
      // console.log('file :>> ', file);
      let that = this
      return new Promise((resolve) => {
        that.imgPress({file:file}).then(res => {
          console.log('res :>> ', res);
          resolve(res.filePress);
        })
      })
    },
    afterRead(file,detail) {
      // 图片上传
      let formData = new FormData();
      formData.append("urls[]", file.file);
      this.$axios
        .fetchPost("/API/Wen/OssUploadFile", formData)
        .then((res) => {
          // console.log("res :>> ", res);
          if (res.data.code == 0) {
            this.imgList.push(res.data.data);
            // this.uploader.push({url:res.data.data,name:'img'})
          } else {
            this.$toast(res.data.message);
            let index = detail.index;
            this.uploader = this.uploader.splice(0, index, 1);
          }
        });
      // this.imgPress(file).then(res => {
      // formData.append("urls[]", res.filePress);
      // this.$axios
      //   .fetchPost("/API/Wen/OssUploadFile", formData)
      //   .then((res) => {
      //     // console.log("res :>> ", res);
      //     if (res.data.code == 0) {
      //       this.imgList.push(res.data.data);
      //       // this.uploader.push({url:res.data.data,name:'img'})
      //     } else {
      //       this.$toast(res.data.message);
      //       let index = detail.index;
      //       this.uploader = this.uploader.splice(0, index, 1);
      //     }
      //   });
      // })
      
    },
    deleteItem(file, val) {
      let index = val.index;
      this.imgList = this.imgList.splice(0, index, 1);
      return true;
    },
    subAsk() {
      let obj = {
        mId: this.mid, //mId
        uId: this.uid, //用户ID
        content: this.message, //发布内容
        fId: this.fid, //作物ID
        expertId: this.expertId,
        picurl: this.imgList.join(","),
        location: this.address,
      };
      if(this.submitBoolean){
      this.submitBoolean = false
      this.$axios.fetchPost("API/Wen/addWenQuestion", obj).then((res) => {
        this.$toast(res.data.message);
        if (res.data.code == 0) {
          setTimeout(() => {
            this.$router.push({ path: "/index_online" });
            this.submitBoolean = true
          }, 1000);
        }else{
           this.submitBoolean = true
        }
        
      });
      }
    },
    getMyAddress() {
      // 获取我的地址，是否加入医院
      this.$axios
        .fetchPost("API/User/userCenter", { uId: this.uid, mId: this.mid })
        .then((res) => {
          if (res.data.code == 0) {
            let myAddress = res.data.data.ismember;
            this.isShaoxing = res.data.data.residecity;
            this.ismember = res.data.data.ismember;
            this.userInfo = res.data.data;
            if (myAddress == 1 || this.isShaoxing == "绍兴市") {
              this.address = "";
            } else {
              // setTimeout(() => {
              //   this.getLocation();
              // },100)
             
            }
          }
        });
    },
    reLocation(){
      this.getLocation()
    },
    getLocation() {
      // let that = this;
      // console.log('开始定位。。。。 ');
      // AMapLoader.load({
      //   key: "8bda406ee72094ecc33b808e0c1d114c", // 申请好的Web端开发者Key，首次调用 load 时必填
      //   version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      //   plugins: ["Geolocation","Geocoder"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      // })
      //   .then((AMap) => {
      //     var map = new AMap.Map("container", {
      //       resizeEnable: true, //是否监控地图容器尺寸变化
      //       zoom: 13, //初始地图级别
      //     });
      //     AMap.plugin("AMap.Geolocation", function () {
      //       var geolocation = new AMap.Geolocation({
      //        enableHighAccuracy: true,//是否使用高精度定位，默认:true
      //         timeout: 10000,          //超过10秒后停止定位，默认：无穷大
      //         maximumAge: 0,           //定位结果缓存0毫秒，默认：0
      //         convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
      //         showButton: false,        //显示定位按钮，默认：true
      //         buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
      //         buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      //       });
      //        //替换方法
      //       map.addControl(geolocation);
      //       geolocation.getCurrentPosition(function (status, result) {
      //         if (status == "complete") {
      //           onComplete(result);
      //         } else {
      //           onError(result);
      //         }
      //       });
      //       function onComplete(data) {
      //         // data是具体的定位信息
      //       console.log('定位成功 :>> ', data);
      //        AMap.plugin('AMap.Geocoder', function() {
      //         var geocoder = new AMap.Geocoder({})
      //         var lnglat = [data.position.lng,data.position.lat]
      //         geocoder.getAddress(lnglat, function(status, result) {
      //           if (status === 'complete' && result.info === 'OK') {
      //               // result为对应的地理位置详细信息
      //             console.log('result :>> ', result.regeocode.addressComponent);
      //             that.address = `${result.regeocode.addressComponent.province},${result.regeocode.addressComponent.city},${result.regeocode.addressComponent.district}`;
      //           }
      //         })
      //       })
            
      //       }
      //       function onError(error) {
      //         // 定位出错
      //         console.log("定位失败",error);

      //         if(that.locationTime == 'first'){
      //           that.address = '抱歉未定位到';
      //           that.locationTime = 'noFirst'
      //           return
      //         }  
      //         let adressTitle =
      //           that.userInfo.resideprovince +
      //           "," +
      //           that.userInfo.residecity + (that.userInfo.residedist == '' ? '' :',' + that.userInfo.residedist)
      //          if(error.message == 'Geolocation permission denied'){
      //           //定位权限未打开
      //           if(that.userInfo.resideprovince == '' &&  that.userInfo.residecity == '' && that.userInfo.residedist == ''){
      //             //个人资料地址为空
      //             that.$dialog.alert({
      //                       title: "定位失败",
      //                       message:"检测到您未打开定位服务",
      //                       confirmButtonText: "不显示地址",
      //                       confirmButtonColor:'#155BBB'
      //                     })
      //                     .then(() => {
      //                       // on close
      //                       that.address = "";
      //                     });
      //           }else{
      //              //个人资料地址不为空
      //              that.$dialog.alert({
      //                               title: "定位失败",
      //                               message:"检测到您未打开定位服务,已自动切换至 " + adressTitle,
      //                               confirmButtonText: "好的",
      //                               confirmButtonColor:'#155BBB'
      //                             })
      //                             .then(() => {
      //                               // on close
      //                               that.address = adressTitle;
      //                             });
      //           }
                
      //         }else{
      //           //未打开定位权限
      //           if(that.userInfo.resideprovince == '' &&  that.userInfo.residecity == '' && that.userInfo.residedist == ''){
      //                   that.$dialog
      //                     .alert({
      //                       title: "定位失败",
      //                       message:
      //                         "抱歉未定位到您的所在地址,后期可以在“我的-编辑资料-所在地”完善信息",
      //                       confirmButtonText: "不显示地址",
      //                       confirmButtonColor:'#155BBB'
      //                     })
      //                     .then(() => {
      //                       // on close
      //                       that.address = "";
      //                     });
      //                         }else {
      //                           that.$dialog
      //                             .alert({
      //                               title: "定位失败",
      //                               message:
      //                                 "抱歉未定位到您的所在地址,已自动切换至 " + adressTitle,
      //                               confirmButtonText: "好的",
      //                               confirmButtonColor:'#155BBB'
      //                             })
      //                             .then(() => {
      //                               // on close
      //                               that.address = adressTitle;
      //                             });
      //                         }
      //         }
              
      //       }
      //     });
      //   })
      //   .catch(() => {
          
      //   });
    },
    imgPress ({ file, rate = 1, maxSize = 20800, fileType = 'file' }) {
    return new Promise(resolve => {
    // new一个文件读取方法，监听文件读取
    let reader = new FileReader()
    reader.readAsDataURL(file)
    let img = new Image()
    reader.onload = function (e) {
      img.src = e.target.result
    }
    img.onload = function () {
      let canvas = document.createElement('canvas')
      let context = canvas.getContext('2d')
      // 文件大小KB
      const fileSizeKB = file.size / 1024
      // 配置rate和maxSize的关系
      if (fileSizeKB * rate > maxSize) {
        rate = Math.floor(maxSize / fileSizeKB * 10) / 10
      }
      // 缩放比例，默认0.5
      let targetW = canvas.width = this.width * rate
      let targetH = canvas.height = this.height * rate
      context.clearRect(0, 0, targetW, targetH)
      context.drawImage(img, 0, 0, targetW, targetH)
      if (fileType === 'file' || fileType === 'blob') {
        canvas.toBlob(function (blob) {
          resolve({ filePress: fileType === 'blob' ? blob : new File([blob], file.name, { type: file.type }), base64: img.src })
        },"image/jpeg", 0.4)
      } else {
        resolve({ filePress: fileType === 'base64' ? canvas.toDataURL(file.type) : null, base64: img.src })
      }
    }
  })
},
  },
};
</script>
<style lang="stylus" scoped>
.ask-container
  height 100%
  background #fff
  position relative
  padding-bottom 0px
  .title
    background #fff
    color #333333
    font-size 16px
    line-height 16px
    padding 15px 12px 10px 12px
  .from
    background #fff
    .text
      margin-right 12px
      margin-left 12px
      width auto
      height 130px
      font-size 12px
      border 1px solid #e5e5e5
    .uploader
      padding 10px 12px
      border-bottom 1px solid #e5e5e5
      &.van-cell::after
        display none
    .choose-crop
      border-bottom 1px solid #e5e5e5
      display flex
      align-items center
      height 50px
      padding-left 12px
      .left
        width 106px
        color #333333
        font-size 16px
      .right
        flex 1
        color #999999
        text-align right
        /deep/.van-field__control
          color #999
          font-size 16px
        &.location
          color #333
          &.fail
            color #999
            /deep/.van-field__control
              color #999
          /deep/.van-field__control
            color #333
      .arrow
        font-size 12px
        color #999999
        margin 0 12px
    .list
      height 50px
      line-height 50px
      display flex
      align-items center
      justify-content space-between
      font-size 16px
      color #333
      padding 0 35px 0 12px
      border-bottom 1px solid #e5e5e5
    .sub
      background #ebebeb
      padding 16px
      padding-bottom 60px
      .btn
        margin-right 12px
        border-radius 4px
        background #155BBB
        font-size 15px
        color #fff
        width 100%
/deep/.van-field__control
  font-size 14px   
</style>
