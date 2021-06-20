<template>
  <div class="ask-container">
    <Header :indexHeader="false"></Header>
    <HospitalHeader v-if="from == 'hospital'" navHeader="提问"></HospitalHeader>
    <div class="title">问题描述</div>
    <van-form @submit="onSubmit" class="from">
      <van-field
        v-model="message"
        rows="4"
        autosize
        type="textarea"
        placeholder="请输入具体问题描述"
        class="text"
        show-word-limit
        maxlength="300"
        name="message"
      />
      <van-field name="uploader" class="uploader">
        <template #input>
          <van-uploader
            v-model="uploader"
            :after-read="afterRead"
            :before-delete="deleteItem"
            accept="image/*"
            :max-count="9"
            :before-read="beforeRead"
          />
        </template>
      </van-field>
      <div class="choose-crop" @click="goToChooseCrop">
        <div class="left">作物</div>
        <!-- <div class="right" :class="{'location':crop != '请选择'}">{{crop}}</div> -->
        <van-field
          :value="crop"
          readonly
          class="right"
          :class="{ location: crop != '请选择' }"
          input-align="right"
          :border="false"
          name="crop"
        />
        <van-icon name="arrow" class="arrow" />
      </div>
      <div class="list" v-if="expert">
        <div class="left">咨询专家</div>
        <div class="right">{{ expert }}</div>
      </div>
      <div class="choose-crop" @click="reLocation">
        <div class="left">所在位置</div>
        <div
          class="right location"
          :class="{ fail: address == '定位中···' || address == '抱歉未定位到' }"
        >
          {{ address }}
        </div>
        <van-icon name="arrow" class="arrow" />
      </div>
      <div class="sub">
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
import AMap from "AMap";
import EXIF from "exif-js";
export default {
  name: "ask",
  components: { Header, Foot, HospitalHeader },
  props: {},
  metaInfo: {
    title: "提问"
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
      imgListTiny: [],
      ismember: "",
      isShaoxing: "",
      userInfo: "",
      locationTime: "first",
      submitBoolean: true,
      from: this.$route.query.from
    };
  },
  computed: {
    ...mapState(["uid", "mid"])
  },
  created() {},
  watch: {},
  mounted() {
    // this.getLocation();
    this.getCity();
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
      } else if (
        this.address == "定位中···"
        // &&  this.isShaoxing != "绍兴市"
      ) {
        this.$toast("地址定位中,请稍等");
        return;
      }
      this.subAsk();
    },
    goToChooseCrop() {
      //选择作物
      this.$router.push({
        path: "/ask/ask_choose_crop"
      });
    },
    getCrop(crop) {
      //选择作物
      this.crop = crop.name;
      this.fid = crop.fid;
    },
    beforeRead(file) {
      // console.log('file :>> ', file);
      let that = this;
      return new Promise(resolve => {
        EXIF.getData(file, function() {
          let Orientation;
          Orientation = EXIF.getTag(this, "Orientation");
          that.imgPress({ file: file, Orientation: Orientation }).then(res => {
            console.log("file :>> ", res);
            resolve(res.filePress);
          });
        });
      });
    },
    afterRead(file, detail) {
      // 图片上传
      let formData = new FormData();
      formData.append("urls[]", file.file);
      this.$axios.fetchPost("/API/Wen/OssUploadFile", formData).then(res => {
        // console.log("res :>> ", res);
        if (res.data.code == 0) {
          this.imgList.push(res.data.data);
          this.imgListTiny.push(res.data.data_tiny);
          // this.uploader.push({url:res.data.data,name:'img'})
        } else {
          this.$toast(res.data.message);
          let index = detail.index;
          this.uploader = this.uploader.splice(0, index, 1);
        }
      });
    },
    deleteItem(file, val) {
      let index = val.index;
      this.imgList = this.imgList.splice(0, index, 1);
      this.imgListTiny = this.imgList.splice(0, index, 1);
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
        picurl_tiny: this.imgListTiny.join(","),
        location: this.address
      };
      if (this.submitBoolean) {
        this.submitBoolean = false;
        this.$axios.fetchPost("API/Wen/addWenQuestion", obj).then(res => {
          this.$toast(res.data.message);
          if (res.data.code == 0) {
            setTimeout(() => {
              this.$router.push({ path: "/index_online" });
              this.submitBoolean = true;
            }, 1000);
          } else {
            this.submitBoolean = true;
          }
        });
      }
    },
    getMyAddress() {
      // 获取我的地址，是否加入医院
      this.$axios
        .fetchPost("API/User/userCenter", { uId: this.uid, mId: this.mid })
        .then(res => {
          if (res.data.code == 0) {
            // let myAddress = res.data.data.ismember;
            this.isShaoxing = res.data.data.residecity;
            this.ismember = res.data.data.ismember;
            this.userInfo = res.data.data;
          }
        });
    },
    reLocation() {
      // this.getLocation();
      this.getCity();
    },
    getCity() {
      let that = this;
      AMap.plugin("AMap.CitySearch", function() {
        var citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(function(status, result) {
          if (status === "complete" && result.info === "OK") {
            // 查询成功，result即为当前所在城市信息
            that.address = result.province + "," + result.city;
            // console.log("result :>> ", result);
          } else {
            that.address = "定位失败";
          }
        });
      });
    },
    getLocation() {
      let that = this;
      var map = new AMap.Map("container", {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 13 //初始地图级别
      });
      AMap.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：无穷大
          maximumAge: 0, //定位结果缓存0毫秒，默认：0
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
        function onComplete(data) {
          // data是具体的定位信息
          AMap.plugin("AMap.Geocoder", function() {
            var geocoder = new AMap.Geocoder({});
            var lnglat = [data.position.lng, data.position.lat];
            geocoder.getAddress(lnglat, function(status, result) {
              if (status === "complete" && result.info === "OK") {
                // result为对应的地理位置详细信息
                that.address = `${result.regeocode.addressComponent.province},${result.regeocode.addressComponent.city},${result.regeocode.addressComponent.district}`;
              }
            });
          });
        }
        function onError(error) {
          // 定位出错
          if (that.locationTime == "first") {
            that.address = "定位失败";
            that.locationTime = "noFirst";
            return;
          }
          if (error.message == "Geolocation permission denied") {
            //定位权限未打开
            //个人资料地址为空
            that.$dialog
              .alert({
                title: "定位失败",
                message: "检测到您未打开定位服务",
                confirmButtonText: "不显示地址",
                confirmButtonColor: "#155BBB"
              })
              .then(() => {
                // on close
                that.address = "定位失败";
              });
          }
        }
      });
    },
    imgPress({
      file,
      Orientation,
      rate = 1,
      maxSize = 20800,
      fileType = "file"
    }) {
      let that = this;
      return new Promise(resolve => {
        // new一个文件读取方法，监听文件读取
        let reader = new FileReader();
        reader.readAsDataURL(file);
        let img = new Image();
        reader.onload = function(e) {
          img.src = e.target.result;
        };
        img.onload = function() {
          let canvas = document.createElement("canvas");
          // let context = canvas.getContext('2d')
          // 文件大小KB
          const fileSizeKB = file.size / 1024;
          // 配置rate和maxSize的关系
          if (fileSizeKB * rate > maxSize) {
            rate = Math.floor((maxSize / fileSizeKB) * 10) / 10;
          }
          // 缩放比例，默认0.5
          // let targetW = canvas.width = this.width * rate
          // let targetH = canvas.height = this.height * rate
          // context.clearRect(0, 0, targetW, targetH)
          // context.drawImage(img, 0, 0, targetW, targetH)
          let width = this.width;
          let height = this.height;
          canvas.width = width;
          canvas.height = height;
          if (Orientation && Orientation != 1) {
            switch (Orientation) {
              case 6: // 旋转90度
                canvas.width = this.height;
                canvas.height = this.width;
                that.rotateImg(img, "left", canvas, width, height);
                break;
              case 3: // 旋转180度
                that.rotateImg(img, "right2", canvas, width, height);
                break;
              case 8: // 旋转-90度
                that.rotateImg(img, "right2", canvas, width, height);
                break;
              default:
                canvas.getContext("2d").drawImage(img, 0, 0, width, height);
                break;
            }
          } else {
            canvas.getContext("2d").drawImage(img, 0, 0, width, height);
          }

          if (fileType === "file" || fileType === "blob") {
            canvas.toBlob(
              function(blob) {
                resolve({
                  filePress:
                    fileType === "blob"
                      ? blob
                      : new File([blob], file.name, { type: file.type }),
                  base64: img.src
                });
              },
              "image/jpeg",
              0.4
            );
          } else {
            resolve({
              filePress:
                fileType === "base64" ? canvas.toDataURL(file.type) : null,
              base64: img.src
            });
          }
        };
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
      if (direction == "right") {
        step++;
        step > max_step && (step = min_step);
      } else if (direction == "right2") {
        step = 2;
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      var degree = (step * 90 * Math.PI) / 180;
      var ctx = canvas.getContext("2d");
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
    }
  }
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
