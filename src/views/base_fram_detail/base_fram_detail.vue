<template>
  <div class="base_edit-container">
    <Header :haveBackIcon="true">
      <div class="icon" @click="goBack">
        <van-icon name="arrow-left" class="back-icon" />
        <span class="back">返回</span>
      </div>
    </Header>
    <div class="edit-container">
      <van-form>
        <van-field
          class="case"
          readonly
          name="case"
          :value="caseValue"
          label="方案"
          placeholder="无"
        />
        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            ref="casePick"
            show-toolbar
            :columns="caseColumns"
            @confirm="onCaseConfirm"
            @cancel="showPicker = false"
            :key="caseValue"
          />
        </van-popup>
        <div>
          <van-field
            readonly
            clickable
            name="datetime"
            :value="date"
            label="时间"
            placeholder="无"
          />
          <van-calendar
            v-model="show"
            type="range"
            @confirm="onTimeConfirm"
            color="#155BBB"
            :min-date="minDate"
            :max-date="maxDate"
          />
          <div class="record " :class="{ 'record-more': ifHaveMoreText }">
            <div class="label">记录</div>
            <div
              class="text"
              :class="{ more: showTextMore && ifHaveMoreText }"
              ref="message"
            >
              {{ message }}
            </div>
            <div
              class="open-more"
              v-show="ifHaveMoreText"
              @click="showTextMore = !showTextMore"
            >
              {{ showTextMore ? "展开更多" : "收缩" }}
              <van-icon name="arrow-down" v-show="showTextMore" />
              <van-icon name="arrow-up" v-show="!showTextMore" />
            </div>
          </div>
          <!-- <van-field
            v-model="message"
            rows="2"
            autosize
            label="记录"
            type="textarea"
            maxlength="500"
            readonly
            placeholder="无"
            class="message"
          /> -->
          <van-field label="照片" v-show="imgList.length >= 1">
            <!-- <template #input>
              <van-uploader
                v-model="uploader"
                :after-read="afterRead"
                :before-delete="deleteItem"
                accept="image/*"
                :max-count="6"
                :before-read="beforeRead"
              />
            </template> -->
            <template #input>
              <van-image
                class="upload-img"
                v-for="(item, index) in imgList"
                :key="item"
                :src="item"
                fit="cover"
                @click="imagePriview(imgList, index)"
              ></van-image>
            </template>
          </van-field>
        </div>
        <div class="use-medicine" v-if="false">
          <div class="title">用药</div>
          <div
            class="add-box van-hairline--bottom"
            v-for="(item, index) in medicine"
            :key="item"
          >
            <van-icon
              name="cross"
              class="cross"
              @click="closeMedicine(index)"
            />
            <div class="medicine-li">
              <van-field
                readonly
                clickable
                name="picker"
                :value="value"
                label="名称"
                placeholder="请选择药品"
                @click="showPicker = true"
              />
              <van-popup v-model="showPicker" position="bottom">
                <van-picker
                  show-toolbar
                  :columns="columns"
                  @confirm="onConfirm"
                  @cancel="showPicker = false"
                />
              </van-popup>
            </div>
            <div>
              <van-field
                readonly
                clickable
                name="picker"
                :value="value"
                label="规格"
                placeholder="请选择规格"
              />
              <van-popup v-model="showPicker" position="bottom">
                <van-picker
                  show-toolbar
                  :columns="columns"
                  @confirm="onConfirm"
                  @cancel="showPicker = false"
                />
              </van-popup>
            </div>
            <van-field
              v-model="username"
              name="数量"
              label="数量"
              placeholder="请输入"
              class="number"
            />
          </div>
          <div class="add-btn-title" @click="addMedicine">增加</div>
        </div>
      </van-form>
      <div class="box" v-show="detailObj.druginfo">
        <div class="title">用药信息</div>
        <ul class="me-ul">
          <li v-for="item in detailObj.druginfo" :key="item.name">
            <van-image class="img" :src="item.pic" fit="cover"></van-image>
            <div class="mid">
              <p class="p1">{{ item.name }}</p>
              <p class="p2">规格：{{ item.spec }}</p>
            </div>
            <div class="right">×{{ item.quantity }}</div>
            <div class="bug-btn" @click="goToBug(item.url)">购买</div>
          </li>
        </ul>
      </div>
      <div class="box remark" v-show="resultinfo != ''">
        <div class="title">评论</div>
        <div class="remark-ul">
          <div class="item">
            <div class="name">
              {{ resultinfo.expertname }}
            </div>
            <div class="text">
              {{ resultinfo.result }}
            </div>
            <div class="time">{{ resultinfo.addtime }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/header/header";
import { mapState } from "vuex";
import EXIF from "exif-js";
import { imgPress } from "@/common/js/util";
import { ImagePreview } from "vant";
export default {
  name: "base_edit",
  components: { Header, [ImagePreview.Component.name]: ImagePreview.Component },
  props: {},
  data() {
    return {
      eitdObj: "", //编辑内容对象
      caseValue: "",
      caseId: "",
      caseColumns: [],
      showPicker: false,
      date: "",
      minDate: new Date(2010, 1, 1),
      maxDate: new Date(2030, 1, 1),
      show: false,
      message: "",
      uploader: [],
      imgList: [],
      medicine: [1, 2],
      haveMedicine: false,
      detailObj: "",
      resultinfo: "",
      ifHaveMoreText: false, //初始状态字数是否过多
      showTextMore: true
    };
  },
  computed: {
    ...mapState(["mid", "uid"]),
    id() {
      return this.$route.query.id;
    }
  },
  watch: {
    message(newVal) {
      if (newVal != "") {
        setTimeout(() => {
          let h = this.$refs.message.offsetHeight;
          if (h >= 73) {
            this.ifHaveMoreText = true;
          }
        }, 100);
      }
    }
  },
  mounted() {
    this.getCase();
    if (this.$route.query.id) {
      this.getEditData();
    }
  },
  destroyed() {},
  methods: {
    imagePriview(list, index) {
      ImagePreview({
        images: list,
        startPosition: index,
        closeable: true
      });
    },
    beforeRead(file) {
      return new Promise(resolve => {
        EXIF.getData(file, function() {
          let Orientation;
          Orientation = EXIF.getTag(this, "Orientation");
          imgPress({ file: file, Orientation: Orientation }).then(res => {
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
        if (res.data.code == 0) {
          this.imgList.push(res.data.data);
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
      return true;
    },
    getEditData() {
      this.$axios
        .fetchGet("API/User/getfarmerdata", {
          Id: this.id
        })
        .then(res => {
          if (res.data.code == 0) {
            let data = res.data.data;
            this.detailObj = data;
            this.caseValue = data.point_name;
            this.resultinfo = data.resultinfo;
            this.date = `${data.starttime}/${data.endtime}`;
            this.message = data.content;
            this.imgList = data.thumb_urls;
          }
        });
    },
    onCaseConfirm(value) {
      // 选择方案
      let r = this.$refs.casePick.getValues();
      if (r[2].pid == "") {
        this.caseId = r[0].id + "_" + r[1].id;
      } else {
        this.caseId = r[0].id + "_" + r[2].id;
      }
      this.caseValue = value.join("-");
      this.showPicker = false;
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onTimeConfirm(date) {
      const [start, end] = date;
      this.show = false;
      this.date = `${this.formatDate(start)}/${this.formatDate(end)}`;
    },
    issueFramData() {
      //发布农事
      let options = {};
      let sucessMessage = "";
      let url = "";
      if (this.$route.query.id) {
        // 修改农事 接口参数
        options = {
          planer: this.caseId,
          Id: this.$route.query.id,
          starttoendtime: this.date,
          content: this.message,
          picurl: this.imgList.join(",")
        };
        sucessMessage = "修改成功";
        url = "/API/User/subfarmerdata";
      } else {
        // 发布农事接口参数
        options = {
          planer: this.caseId,
          uId: this.uid,
          starttoendtime: this.date,
          content: this.message,
          picurl: this.imgList.join(",")
        };
        sucessMessage = "发布成功";
        url = "/API/User/addfarmerdata";
      }
      this.$axios.fetchPost(url, options).then(res => {
        if (res.data.code == 0) {
          this.$toast.success(sucessMessage);
          setTimeout(() => {
            this.$router.go(-1);
          }, 500);
        } else {
          this.$toast.fail(res.data.message);
        }
      });
    },
    getCase() {
      // 获取方案的节点数据
      this.$axios
        .fetchGet("API/User/getProjectlist", { mId: this.mid, pId: 16 })
        .then(res => {
          if (res.data.code == 0) {
            this.caseColumns = res.data.data;
          }
        });
    },
    closeMedicine(index) {
      console.log("index :>> ", index);
    },
    addMedicine() {
      this.medicine.push(1);
    },
    goBack() {
      this.$router.go(-1);
    },
    goToBug(url) {
      window.open(url, "_blank");
    }
  }
};
</script>
<style lang="stylus" scoped>
.base_edit-container
  .icon
    flex 1
    display flex
    align-items center
    color #999
  .back-icon
    font-size 20px
    color: #999999;
    padding-left 12px
    margin-right 5px
  .edit-container
    .case
      margin 10px 0
      height auto
    .use-medicine
      margin-top 15px
      .add-box
        position relative
        padding-right 20px
        background #fff
        .cross
          position absolute
          right 5px
          top 10px
          color: #999999;
          font-size 20px
          z-index 99999
          padding 5px
      & > .title
        margin-left 12px
        font-size: 15px;
        font-family: Microsoft YaHei;
        color: #333333;
        margin-bottom 5px
      /deep/.van-field__body
        border 1px solid #e5e5e5
        padding 5px
      .number
        /deep/.van-field__body
          width 50%
    .add-btn-title
      height 50px
      line-height 50px
      background #fff
      padding-left 12px
      color: #999999;
  .submit-wrap
    margin 35px 12px 0
    padding-bottom 35px
    overflow hidden
  /deep/.van-field__label
    width 50px
  .box
    .title
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      padding 10px 4px
    .me-ul
      background #fff
      & > li
        display flex
        position relative
        padding 15px 12px 10px
        .img
          width 95px
          height 95px
          border 1px solid #e5e5e5
          margin-right 10px
        .mid
          min-width 0
          flex 1
          .p1
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #333333;
            margin-top -4px
          .p2
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #999999;
            margin-top 10px
        .right
          width auto
          margin 0 5px
        .bug-btn
          position absolute
          bottom 10px
          right 10px
          width: 59px;
          height: 25px;
          border: 1px solid #FF6600;
          border-radius: 25px;
          font-size: 15px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #FF6600;
          line-height: 25px;
          text-align center
  .remark
     padding-bottom 20px
    .remark-ul
      background #fff
      padding-left 12px
      padding-right 12px
      .item
        padding 15px
        padding-right 0
        border-bottom 1px solid #e5e5e5
        &:last-child
          border none
        .name
          color #999999
          font-size 14px
          margin-bottom 10px
        .text
          color #333333
          font-size 15px
        .time
          color #999999
          font-size 14px
          margin-top 10px
  /deep/.van-field__control--custom
    display block
    .upload-img
      width 33%
      padding-bottom 33%
      margin-right .3%
      height 0
      img
        position absolute
  .record
    background #fff
    display flex
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 10px 16px;
    overflow: hidden;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
    background-color: #fff;
    margin 10px 0 0
    position relative
    &.record-more
      padding-bottom 30px
    .label
      width 50px
      margin-right 12px
    .text
      flex 1
      color: #323233;
      word-wrap: break-word;
      text-align: left;
      min-width 0
      text-align: left;
      position relative
      &.more
        display -webkit-box
        overflow hidden
        -webkit-line-clamp 3
        -webkit-box-orient vertical
        text-overflow ellipsis
    .open-more
      position absolute
      right 16px
      bottom 0
      color #333
      background #fff
      width 150px
      height 30px
      line-height 30px
      display flex
      align-items center
      text-align right
      justify-content flex-end

// .message
//   height 150px
//   /deep/.van-field__control
//     height 150px
//     display: -webkit-box;
//     overflow hidden
//     -webkit-line-clamp: 3;
//     -webkit-box-orient: vertical;
//     overflow: hidden;
//     text-overflow: ellipsis;
</style>
