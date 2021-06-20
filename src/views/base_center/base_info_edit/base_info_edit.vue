<template>
  <div class="edit-container">
    <van-form @submit="onSubmit">
      <van-field name="uploader" class="upload-box">
        <template #input>
          <van-uploader
            v-model="uploader"
            class="upload"
            :deletable="false"
            :after-read="afterRead"
            accept="image/*"
            :before-read="beforeRead"
          >
            <div class="icon"></div>
          </van-uploader>
        </template>
      </van-field>
      <van-field
        v-model="name"
        name="名称"
        label="名称"
        placeholder="请输入名称"
      >
        <template #button><van-icon name="arrow" class="arrow"/></template>
      </van-field>
      <van-field
        v-model="zuowu"
        name="作物种类"
        label="作物种类"
        placeholder="请选择作物种类"
        readonly
        @click="clickZuowu"
      >
        <template #button> <van-icon name="arrow" class="arrow"/></template>
      </van-field>
      <Checkbox
        :chooseData="ChooseData.zwtype"
        @emitArray="onZuowuCancel"
        ref="zuowu"
      ></Checkbox>
      <van-field
        v-model="time"
        name="供应时间"
        label="供应时间"
        placeholder="请选择供应时间"
        readonly
        @click="clickTime"
      >
        <template #button> <van-icon name="arrow" class="arrow"/></template>
      </van-field>
      <Checkbox
        :chooseData="ChooseData.supplytime"
        @emitArray="cancelTime"
        ref="time"
      ></Checkbox>
      <van-field
        v-model="scale"
        name="规模"
        label="规模"
        readonly
        placeholder="请输入规模"
        @click="guimoPicker = true"
        ><template #button> <van-icon name="arrow" class="arrow"/></template>
      </van-field>
      <van-popup v-model="guimoPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="ChooseData.guimo"
          @confirm="guimoConfirm"
          @cancel="guimoPicker = false"
        />
      </van-popup>

      <van-field
        v-model="module"
        name="经营模式"
        label="经营模式"
        placeholder="请输入经营模式"
        readonly
        @click="clickModule"
        ><template #button> <van-icon name="arrow" class="arrow"/></template>
      </van-field>
      <Checkbox
        :chooseData="ChooseData.pattern"
        @emitArray="cancelPattern"
        ref="pattern"
      ></Checkbox>
      <van-field
        v-model="areaname"
        name="所在地"
        label="所在地"
        placeholder="请选择所在地"
        readonly
        @click="addressPicker = true"
        ><template #button> <van-icon name="arrow" class="arrow"/></template>
      </van-field>
      <van-popup v-model="addressPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="ThreeTreeAddressColumns"
          @confirm="onAddressConfirm"
          @cancel="addressPicker = false"
        />
      </van-popup>
      <van-field
        v-model="sell"
        name="主营"
        label="主营"
        placeholder="请选择主营商品"
        readonly
        @click="sellShow = true"
        ><template #button> <van-icon name="arrow" class="arrow"/></template>
      </van-field>
      <AskChooseCrop
        v-show="sellShow"
        :baseEdit="true"
        @getCrop="chooseSell"
      ></AskChooseCrop>
      <van-field
        v-model="linkman"
        name="联系人"
        label="联系人"
        placeholder="请选择联系人"
        ><template #button> <van-icon name="arrow" class="arrow"/></template>
      </van-field>
      <van-field
        v-model="phone"
        name="号码"
        label="号码"
        placeholder="请输入号码"
        ><template #button> <van-icon name="arrow" class="arrow"/></template>
      </van-field>
      <van-field
        v-model="address"
        name="经营地址"
        label="经营地址"
        placeholder="请输入经营地址"
      >
        <template #button> <van-icon name="arrow" class="arrow"/></template>
      </van-field>
      <div class="company-box" style="margin-top:10px">
        <van-field
          v-model="typesname"
          name="企业类型"
          label="企业类型"
          placeholder="请输入企业类型"
          readonly
          @click="clickCompanyTypes"
        >
          <template #button> <van-icon name="arrow" class="arrow"/></template>
        </van-field>
        <van-popup v-model="typesnamePicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="ChooseData.types"
            @confirm="typesConfirm"
            @cancel="typesnamePicker = false"
          />
        </van-popup>
        <van-field
          v-model="genre"
          name="企业性质"
          label="企业性质"
          placeholder="请输入企业性质"
          @click="clickGenre"
          readonly
        >
          <template #button> <van-icon name="arrow" class="arrow"/></template>
        </van-field>
        <van-popup v-model="genrePicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="ChooseData.genre"
            @confirm="genreConfirm"
            @cancel="genrePicker = false"
          />
        </van-popup>
      </div>
      <div style="margin: 16px;">
        <van-button
          round
          block
          type="info"
          native-type="submit"
          class="submit"
          >{{ routeFrom == "edit" ? "修改" : "创建" }}</van-button
        >
      </div>
    </van-form>
    <van-popup
      v-model="popupShow"
      position="bottom"
      :style="{ height: '30%' }"
    />
  </div>
</template>
<script>
import axios from "@/http";
import { mapState } from "vuex";
import Checkbox from "./checkbox_sheet.vue";
import AskChooseCrop from "@/views/ask_choose_crop/ask_choose_crop";
import { exifImg } from "@/common/js/util.js";
export default {
  metaInfo: { title: 1 },
  name: "base_edit",
  components: { Checkbox, AskChooseCrop },
  props: {},
  data() {
    return {
      // 所在地以上 必填
      uploader: [{ url: "" }],
      name: "",
      zuowu: "",
      time: "",
      scale: "",
      scaleId: "",
      module: "",
      address: "",
      sell: "",
      sellShow: false,
      linkman: "",
      phone: "",
      areaname: "",
      areanameId: "", //地址三级联动的id
      genre: "",
      popupShow: false,
      ChooseData: "", //供选择的数据
      zuowuShow: true,
      checked: false,
      typesname: "",
      typesnameId: "",
      guimoPicker: false, //规模pick
      result: [],
      addressPicker: false, //地址三级联动
      ThreeTreeAddressColumns: [],
      typesnamePicker: false,
      genrePicker: false
    };
  },
  computed: {
    ...mapState(["uid"]),
    routeFrom() {
      return this.$route.query.from;
    }
  },
  watch: {},
  mounted() {
    if (this.routeFrom === "edit") {
      this.getBaseInfo();
    }
    this.getChooseData();
    this.getThreeTreeAddress();
  },
  destroyed() {},
  methods: {
    beforeRead(file) {
      // 上传图片之前，压缩图片
      return new Promise(resolve => {
        let img = exifImg(file).then(res => {
          return res;
        });
        resolve(img);
      });
    },
    afterRead(file, detail) {
      // 图片上传
      let formData = new FormData();
      formData.append("urls[]", file.file);
      formData.append("uId", this.uid);
      this.$axios.fetchPost("/API/Wen/OssUploadFile", formData).then(res => {
        if (res.data.code == 0) {
          // this.imgList.push(res.data.data);
          this.uploader = [{ url: res.data.data }];
          console.log("res.data :>> ", res.data);
        } else {
          this.$toast(res.data.message);
          console.log("detail :>> ", detail);
        }
      });
    },
    onSubmit(values) {
      console.log("values :>> ", values);
      this.updataBaseInfo();
    },
    clickZuowu() {
      this.$refs.zuowu.zuowuShow = true;
    },
    clickTime() {
      this.$refs.time.zuowuShow = true;
    },
    onZuowuCancel(arr) {
      //选择作物按钮
      if (arr.length === 0) return;
      this.zuowu = arr.join(",");
    },
    cancelTime(arr) {
      // 选择供应时间
      if (arr.length === 0) return;
      this.time = arr.join(",");
    },
    guimoConfirm(val) {
      // 确定规模
      this.guimoPicker = false;
      this.scale = val.text;
      this.scaleId = val.id;
    },
    clickModule() {
      //点击经营模式
      this.$refs.pattern.zuowuShow = true;
    },
    onAddressConfirm(val, index) {
      // 选择地址
      this.areanameId = this.ThreeTreeAddressColumns[index[0]].children[
        index[1]
      ].children[index[2]].id;
      this.areaname = val.join(" ");
      this.addressPicker = false;
    },
    cancelPattern(val) {
      // 确定经营模式
      if (val.length === 0) return;
      this.module = val.join(",");
    },
    clickCompanyTypes() {
      // 弹出企业类型选择
      this.typesnamePicker = true;
    },
    typesConfirm(val) {
      //确定选择企业类型
      this.typesname = val.text;
      this.typesnameId = val.id;
      this.typesnamePicker = false;
    },
    clickGenre() {
      // 点击弹出企业性质选择框
      this.genrePicker = true;
    },
    genreConfirm(val) {
      this.genre = val;
      this.genrePicker = false;
    },
    chooseSell(item) {
      //选择完主营之后
      this.sellShow = false;
      if (item == "cancel") return;
      this.sell = item.name;
    },
    getBaseInfo() {
      axios
        .fetchGet("/API/User/getCompanyinfo", { uId: this.uid })
        .then(res => {
          let data = res.data;
          if (data.code === 0) {
            this.name = data.data.title;
            this.zuowu = data.data.zwtype;
            this.time = data.data.supplytime;
            this.scale = data.data.guimo.text;
            this.scaleId = data.data.guimo.id;
            this.module = data.data.pattern;
            this.address = data.data.address;
            this.sell = data.data.products;
            this.linkman = data.data.linkman;
            this.phone = data.data.bile;
            this.areaname = data.data.areaname.text;
            this.areanameId = data.data.areaname.id;
            this.genre = data.data.genre;
            this.typesname = data.data.typesname.text;
            this.typesnameId = data.data.typesname.id;
            this.uploader = [{ url: data.data.logo }];
          }
        });
    },
    getChooseData() {
      // 基地选择数据
      this.$axios.fetchGet("/API/User/getBaseOptions").then(res => {
        let data = res.data;
        if (data.code == 0) {
          this.ChooseData = data.data;
        }
      });
    },
    getThreeTreeAddress() {
      this.$axios.fetchGet("/API/User/getLinkagelist").then(res => {
        let data = res.data;
        if (data.code === 0) {
          // console.log("data.data :>> ", data.data);
          this.ThreeTreeAddressColumns = data.data;
        }
      });
    },
    updataBaseInfo() {
      //更新基地信息/或者新建基地信息
      this.$axios
        .fetchPost("/API/User/subCompanyAttention", {
          uId: this.uid,
          title: this.name,
          zwtype: this.zuowu,
          guimo: this.scaleId,
          pattern: this.module,
          supplytime: this.time,
          areaid: this.areanameId,
          linkman: this.linkman,
          bile: this.phone,
          address: this.address,
          types: this.typesnameId,
          genre: this.genre,
          logo: this.uploader[0].url
        })
        .then(res => {
          let data = res.data;
          if (data.code === 0) {
            this.$toast(data.message);
            if (this.routeFrom === "add") {
              this.$router.replace({
                path: "/base_center"
              });
            }
            // console.log("data.data :>> ", data.data);
          }
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '../../../common/css/base.styl'
.edit-container
  padding-bottom 20px
  /deep/.van-field__control
    text-align right
    font-size 14px
  .upload-box
     position relative
    .van-uploader
      margin 0 auto
      position relative
      width 80px
      height 80px
      overflow hidden
    /deep/.van-uploader__input-wrapper
      position absolute
      width 80px
      height 80px
    .icon
      width 80px
      height 80px
      bj-image('./18')
      background-size 20px 20px
      background-position 55px 55px
      position absolute
      left 0
      top 0
.arrow
  margin-top -2px
  vertical-align middle
  color #999999
.submit
  background: #155BBB;
  border-radius: 8px;
  font-size 16px
.zuowuContent
  padding-left 15px
  padding-top 25px
  .item
    padding-right 15px
    margin-bottom 15px
    height 40px
    text-align center
    display inline-block
    width 25%
    .item-wrap
      position relative
      height 100%
      font-size 16px
      background #FAFAFA
      /deep/.van-checkbox
        width 100%
        height 100%
        display block
        position absolute
        left 0
        right 0
      /deep/.van-checkbox__icon
        position absolute
        width 100%
        height 100%
        position absolute
        left 0
        right 0
      .props
        line-height 38px
        text-align center
        margin 0
        width 100%
        border 1px solid #E5E5E5
      .activeIcon
        width 100%
        height 100%
        border 1px solid #155BBB
        color #155BBB
        background #F1FAFE
</style>
