<template>
  <div class="ask-container">
    <Header :indexHeader="false" v-if="from != 'hospital'"></Header>
    <HospitalHeader v-if="from == 'hospital'" navHeader='提问'></HospitalHeader>
    <div class="title">问题描述</div>
    <van-form @submit="onSubmit" class="from">
      <van-field v-model="message" rows="4" autosize type="textarea" placeholder="请输入具体问题描述" class="text" show-word-limit maxlength="300" name="message" />
      <van-field name="uploader" class="uploader">
        <template #input>
          <van-uploader v-model="uploader" :after-read="afterRead" :before-delete="deleteItem" accept="image/*"  :max-count="9" :multiple="false" id="upload"/>
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
import AMapLoader from "@amap/amap-jsapi-loader";
import Foot from "@/components/foot/foot";
import EXIF from 'exif-js'
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
      ismember: 0,
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
  watch: {},
  mounted() {
    this.getMyAddress();
    // console.log('Exif :>> ', Exif);
     window.vConsole = new window.VConsole({
        defaultPlugins: ['system', 'network', 'element', 'storage', 'performance'], // 可以在此设定要默认加载的面板
        maxLogNumber: 1000,
        onReady: function() {
            console.log('vConsole is ready.');
        },
        onClearLog: function() {
            console.log('on clearLog');
        }
    });
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
    afterRead(file,detail) {
      // 图片上传
      let Orientation
      // let img = document.getElementById('upload')
      let that = this
      EXIF.getData(file.file, function() {
        Orientation = EXIF.getTag(this, 'Orientation')
         let formData = new FormData();
        that.imgPress({file:file.file,Orientation:Orientation}).then(res => {
      formData.append("urls[]", res.filePress);
      that.$axios
        .fetchPost("/API/Wen/OssUploadFile", formData)
        .then((res) => {
          // console.log("res :>> ", res);
          if (res.data.code == 0) {
            that.imgList.push(res.data.data);
            // this.uploader.push({url:res.data.data})
          } else {
            that.$toast(res.data.message);
            let index = detail.index;
            that.uploader = that.uploader.splice(0, index, 1);
          }
        });
      })
      })
     
      
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
              // this.address = "浙江省,绍兴市";
              this.address = "";
            } else {
              this.getLocation();
            }
          }
        });
    },
    reLocation(){
      this.getLocation()
    },
    getLocation() {
      let that = this;
      AMapLoader.load({
        key: "23a2a13dc7fdd9a8af2ec7683b2f333e", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["Geolocation"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        Loca: {
          // 是否加载 Loca， 缺省不加载
          version: "1.3.2", // Loca 版本，缺省 1.3.2
        },
      })
        .then((AMap) => {
          new AMap.Map("container", {
            resizeEnable: true, //是否监控地图容器尺寸变化
            zoom: 13, //初始地图级别
          });
          AMap.plugin("AMap.Geolocation", function () {
            var geolocation = new AMap.Geolocation({
              // 是否使用高精度定位，默认：true
              enableHighAccuracy: false,
              // 设置定位超时时间，默认：无穷大
              timeout: 1000,
              maximumAge: 0,
              // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
              buttonOffset: new AMap.Pixel(10, 20),
              //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
              zoomToAccuracy: false,
              //  定位按钮的排放位置,  RB表示右下
              buttonPosition: "RB",
            });

            geolocation.getCurrentPosition(function (status, result) {
              if (status == "complete") {
                onComplete(result);
              } else {
                onError(result);
              }
            });

            function onComplete(data) {
              // data是具体的定位信息
              // console.log("data :>> ", data.addressComponent.province);
              // console.log("data :>> ", data.addressComponent.city);
              // console.log("data :>> ", data.addressComponent.district);
              that.address = `${data.addressComponent.province},${data.addressComponent.city},${data.addressComponent.district}`;
            }

            function onError() {
              // 定位出错
              // console.log("data :>> ", data);
              // that.locationTime
              // console.log('object :>> ', that.address);
             
              if(that.locationTime == 'first'){
                that.address = '抱歉未定位到';
                that.locationTime = 'noFirst'
                return
              }  
              let adressTitle =
                that.userInfo.resideprovince +
                "," +
                that.userInfo.residecity + (that.userInfo.residedist == '' ? '' :',' + that.userInfo.residedist)
              if(that.userInfo.resideprovince == '' &&  that.userInfo.residecity == '' && that.userInfo.residedist == ''){
                that.$dialog
                  .alert({
                    title: "定位失败",
                    message:
                      "抱歉未定位到您的所在地址,后期可以在“我的-编辑资料-所在地”完善信息",
                    confirmButtonText: "不显示地址",
                    confirmButtonColor:'#155BBB'
                  })
                  .then(() => {
                    // on close
                    that.address = "";
                  });
              }else {
                that.$dialog
                  .alert({
                    title: "定位失败",
                    message:
                      "抱歉未定位到您的所在地址,已自动切换至 " + adressTitle,
                    confirmButtonText: "好的",
                    confirmButtonColor:'#155BBB'
                  })
                  .then(() => {
                    // on close
                    that.address = adressTitle;
                  });
              }
            }
          });
        })
        .catch(() => {
          
        });
    },
    rotateImg(img, direction, canvas, width, height) {
  var min_step = 0;
  var max_step = 3;
  if (img == null) {
    return;
  }
  var step = 2;
  if (step == null) {
    step = min_step;
  }
  if (direction == 'right') {
    step++;
    step > max_step && (step = min_step);
  }else if(direction == 'right2'){
    step = 2;
  }else {
    step--;
    step < min_step && (step = max_step);
  }
  var degree = step * 90 * Math.PI / 180;
  var ctx = canvas.getContext('2d');
  switch (step) {
    case 0:
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      break;
    case 1:
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(degree);
      ctx.drawImage(img, 0, -height, width, height);
      break;
    case 2:
      canvas.width = width;
      canvas.height = height;
      ctx.rotate(degree);
      ctx.drawImage(img, -width, -height, width, height);
      break;
    case 3:
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(degree);
      ctx.drawImage(img, -width, 0, width, height);
      break;
    }
},
    imgPress({ file, Orientation, rate = 1, maxSize = 20800, fileType = 'file' }) {
      let that =this
    return new Promise(resolve => {
    // new一个文件读取方法，监听文件读取
    let reader = new FileReader()
    reader.readAsDataURL(file)
    let img = new Image()
    reader.onload = function (e) {
      img.src = e.target.result
    }
    // alert(Orientation)
    img.onload = function () {
      let canvas = document.createElement('canvas')
      // let context = canvas.getContext('2d')
      // 文件大小KB
      const fileSizeKB = file.size / 1024
      // 配置rate和maxSize的关系
      if (fileSizeKB * rate > maxSize) {
        rate = Math.floor(maxSize / fileSizeKB * 10) / 10
      }
      // 缩放比例，默认0.5
      // let targetW = canvas.width = this.width * rate
      // let targetH = canvas.height = this.height * rate
      // canvas.width = this.width;
      // canvas.height = this.width;
      // context.clearRect(0, 0, targetW, targetH)
      // context.drawImage(img, 0, 0, targetW, targetH)
    let width = this.width;
    let height = this.height;
    
  
      canvas.width = width;
      canvas.height = height;
      
      if(Orientation && Orientation != 1){
      switch(Orientation){
        case 6:     // 旋转90度
          canvas.width = this.height;
          canvas.height = this.width;
          that.rotateImg(img, 'left', canvas, width, height);
         
          break;
        case 3:// 旋转180度
         that.rotateImg(img, 'right2', canvas, width, height);
          break;
        case 8:     // 旋转-90度
        that.rotateImg(img, 'right2', canvas, width, height);
          break;
           default:
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          break;
      }}else{
       canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      }
      if (fileType === 'file' || fileType === 'blob') {
        canvas.toBlob(function (blob) {
          resolve({ filePress: fileType === 'blob' ? blob : new File([blob], file.name, { type: file.type }), base64: img.src })
        },"image/jpeg", 0.3)
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
