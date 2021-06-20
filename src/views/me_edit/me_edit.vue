<template>
  <div class="me_edit-container">
    <Header :indexHeader="false"></Header>
    <ul>
      <van-uploader class="upload" accept="image/*" :after-read="afterRead">
        <li>
          <div class="left">头像</div>
          <div class="mid">
            <van-image class="avator" fit="cover" round :src="avatar"></van-image>
          </div>
          <van-icon name="arrow" class="arrow" />
        </li>
      </van-uploader>
      <li>
        <div class="left">用户名</div>
        <div class="mid">{{ userName }}</div>
      </li>
      <li @click="clickName">
        <div class="left">名字</div>
        <div class="mid">{{ name }}</div>
        <van-icon name="arrow" class="arrow" v-if="identity == 0 && ismember == 0" />
      </li>
      <li @click="sexShow = true">
        <div class="left">性别</div>
        <div class="mid">{{ sex == '1'?'男':'女' }}</div>
        <van-icon name="arrow" class="arrow" />
      </li>
      <li @click="areaShow = true">
        <div class="left">所在地</div>
        <div class="mid">
          {{ resideprovince }}{{ residecity }}{{ residedist }}
        </div>
        <van-icon name="arrow" class="arrow" />
      </li>
    </ul>
    <van-dialog v-model="nameShow" title="修改名字" show-cancel-button @confirm="confirmName">
      <!-- 修改用户名 -->
      <van-field v-model="names" placeholder="请输入用户名" class="name" maxlength="10" />
    </van-dialog>
    <van-action-sheet v-model="sexShow" :actions="actions" @select="onSelect" />
    <!-- 选择性别 -->
    <van-popup v-model="areaShow" close-icon-position="top-left" position="bottom">
      <van-area title="选择所在地" :area-list="areaList" @confirm="confimArea" @cancel="cancelArea" />
    </van-popup>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import { mapState } from "vuex";
import areaList from "@/common/js/area.js";
export default {
  name: "meEdit",
  metaInfo: {
    title: "编辑资料",
  },
  components: { Header },
  props: {},
  data() {
    return {
      info: "",
      avatar: "",
      userName: "",
      name: "", //名字
      sex: "请选择", //性别
      nameShow: false,
      sexShow: false,
      areaShow: false,
      names: "",
      actions: [
        { name: "男", id: 1 },
        { name: "女", id: 0 },
      ],
      areaList: areaList,
      resideprovince: "", //省
      residecity: "", //市
      residedist: "", //区
      identity: 0, //1是专家，不允许改名字，0是普通人
      ismember: 0, //1是会员，不允许改名字，0可以修改
    };
  },
  computed: { ...mapState(["uid", "mid"]) },
  watch: {
    name(newVal, oldVal) {
      if (oldVal == "") {
        return false;
      }
      this.upDate();
    },
    sex(newVal, oldVal) {
      if (oldVal == "请选择") {
        return;
      }
      this.upDate();
    },
    residedist(newVal, oldVal) {
      if (oldVal == "") {
        return;
      }
      this.upDate();
    },
    residecity(newVal, oldVal) {
      if (oldVal == "") {
        return;
      }
      this.upDate();
    },
    resideprovince(newVal, oldVal){
      if (oldVal == "") {
        return;
      }
      this.upDate();
    }
  },
  mounted() {
    this.getInfo();
  },
  created() {},
  beforeDestroy() {
    // this.upDate();
  },
  destroyed() {},
  methods: {
  imgPress ({ file, rate = 1, maxSize = 800, fileType = 'file' }) {
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
      context.drawImage(img, 0, 0, targetW, targetH)

      if (fileType === 'file' || fileType === 'blob') {
        canvas.toBlob(function (blob) {
          resolve({ filePress: fileType === 'blob' ? blob : new File([blob], file.name, { type: file.type }), base64: img.src })
        },"image/jpeg", 0.7)
      } else {
        resolve({ filePress: fileType === 'base64' ? canvas.toDataURL(file.type) : null, base64: img.src })
      }
    }
  })
},
    afterRead(file) {
      let formData = new FormData();
      this.imgPress(file).then(res => {
        //  console.log('res :>> ', res);
        // console.log('res.filePress :>> ', res.filePress);
        // console.log('file.file :>> ', file.file);
        formData.append("urls[]",res.filePress);
        formData.append("uId", this.uid);
        this.$axios
          .fetchPost("/API/Wen/OssUploadFile", formData)
          .then((res) => {
            // console.log("res :>> ", res);
            if (res.data.code == 0) {
              this.avatar = res.data.data;
            }
            this.$toast(res.data.message);
          });
      })
      // console.log('file.file :>> ', file.file);
      // formData.append("urls[]", file.file);
      
    },
    getInfo() {
      this.$axios
        .fetchPost("/API/User/userCenter", { uId: this.uid, mId: this.mid })
        .then((res) => {
          if (res.data.code == 0) {
            let data = res.data.data;
            this.avatar = data.avatar;
            this.userName = data.username;
            this.name = data.realname;
            this.sex = data.gender;
            this.resideprovince = data.resideprovince || "请选择";
            this.residecity = data.residecity;
            this.residedist = data.residedist;
            this.identity = data.identity;
            this.ismember = data.ismember;
          }
        });
    },
    upDate() {
      //分开上传
      this.$axios
        .fetchPost("API/User/updateInfo", {
          uId: this.uid,
          gender: this.sex,
          realname: this.name,
          resideprovince: this.resideprovince,
          residecity: this.residecity,
          residedist: this.residedist,
        })
        .then((res) => {
          if (res.data.code == 0) {
            //
          }
          this.$toast(res.data.message);
        });
    },
    clickName() {
      if (this.identity == 1 || this.ismember == 1) {
        return;
      }
      this.nameShow = true;
      this.names = this.name;
    },
    confirmName() {
      this.name = this.names;
    },
    onSelect(item) {
      this.sex = item.id;
      this.sexShow = false;
    },
    confimArea(item) {
      this.areaShow = false;
      this.resideprovince = item[0].name;
      this.residecity = item[1].name;
      this.residedist = item[2].name;
    },
    cancelArea() {
      this.areaShow = false;
    },
  },
};
</script>
<style lang="stylus" scoped>
.me_edit-container
  ul
    margin-top 10px
    padding-left 12px
    background #fff
    .upload
      width 100%
      /deep/.van-uploader__input-wrapper
        width 100%
    li
      display flex
      align-items center
      height 50px
      border-bottom 1px solid #e5e5e5
      &:last-child
        border none
      .left
        width 90px
        color #333333
        font-size 16px
      .mid
        flex 1
        color #333333
        font-size 16px
        .avator
          width 40px
          height 40px
          margin-top 5px
      .arrow
        margin-right 12px
        margin-left 4px
        color #969799
        min-width 1em
        height 24px
        font-size 16px
        line-height 24px
  .name
    width 90%
    margin 10px auto
    border 1px solid #e5e5e5
    height 35px
    line-height 35px
    padding 0 12px
</style>
