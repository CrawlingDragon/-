import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: window.localStorage.getItem("token") || undefined, // 从缓存中获取token
    uid: window.localStorage.getItem("uid") || undefined, //登录用户uid
    initMid: window.localStorage.getItem("initMid") || "", //绍兴市顶级医院mid 63580    56915
    mid: window.localStorage.getItem("mid"), //医院mid
    headerLogo: window.localStorage.getItem("headerLogo"), // 全局头部的logo 图表
    headerText: window.localStorage.getItem("headerText"), // 全局头部的文案说明
    joinTime: window.localStorage.getItem("joinTime"), //用户加入医院的时间
    hospitalName: window.localStorage.getItem("hospitalName"), //医院名字
    hospitalIsStore: window.localStorage.getItem("hospitalIsStore"), //医院
    isMember: window.localStorage.getItem("isMember"), //是否是会员
    userName: window.localStorage.getItem("userName"), //用户名字
    userAvatar: window.localStorage.getItem("userAvatar"), //用户头像
    hospitalIsMember: window.localStorage.getItem("hospitalIsMember"), //是否是医院会员
    hospitalLogo: window.localStorage.getItem("hospitalLogo"), //医院主页logo
    aiExpertId: window.localStorage.getItem("aiExpertId"), //ai 智能专家id
    ucuid: window.localStorage.getItem("ucuid"), //农资店铺 ucuid
    logined: window.localStorage.getItem("logined") || 2,
    locationAddress: window.sessionStorage.getItem("locationAddress") || "init" //定位地址 如果为init表示初始化， 为空表示选择地址覆盖了定位地址  不为空表示已经选择了地址;
  },
  mutations: {
    setLocationAddress(state, data) {
      // 修改定位地址
      state.locationAddress = data;
      window.sessionStorage.setItem("locationAddress", data);
    },
    setHeaderLogo(state, data) {
      // 设置token
      state.headerLogo = data;
      window.localStorage.setItem("headerLogo", data);
    },
    setHeaderText(state, data) {
      // 设置token
      state.headerText = data;
      window.localStorage.setItem("headerText", data);
    },
    setToken(state, data) {
      // 设置token
      state.token = data;
      window.localStorage.setItem("token", data);
    },
    setUid(state, uid) {
      state.uid = uid;
      window.localStorage.setItem("uid", uid);
    },
    setInitMid(state, data) {
      state.initMid = data;
      window.localStorage.setItem("initMid", data);
    },
    setMid(state, mid) {
      state.mid = mid;
      window.localStorage.setItem("mid", mid);
    },
    clearMid() {
      window.localStorage.clearItem("mid");
    },
    setJoinTime(state, joinTime) {
      state.joinTime = joinTime;
      window.localStorage.setItem("joinTime", joinTime);
    },
    setHospitalName(state, hospitalName) {
      state.hospitalName = hospitalName;
      window.localStorage.setItem("hospitalName", hospitalName);
    },
    setHospitalIsStore(state, hospitalIsStore) {
      state.hospitalIsStore = hospitalIsStore;
      window.localStorage.setItem("hospitalIsStore", hospitalIsStore);
    },
    setIsMember(state, isMember) {
      state.isMember = isMember;
      window.localStorage.setItem("isMember", isMember);
    },
    setUserName(state, userName) {
      state.userName = userName;
      window.localStorage.setItem("userName", userName);
    },
    setUserAvatar(state, userAvatar) {
      state.userAvatar = userAvatar;
      window.localStorage.setItem("userAvatar", userAvatar);
    },
    setHospitalIsMember(state, hospitalIsMember) {
      state.hospitalIsMember = hospitalIsMember;
      window.localStorage.setItem("hospitalIsMember", hospitalIsMember);
    },
    setAiExpertId(state, aiExpertId) {
      state.aiExpertId = aiExpertId;
      window.localStorage.setItem("aiExpertId", aiExpertId);
    },
    setUcUid(state, ucuid) {
      state.ucuid = ucuid;
      window.localStorage.setItem("ucuid", ucuid);
    },
    setLogined(state, logined) {
      state.logined = logined;
      window.localStorage.setItem("logined", logined);
    },
    setHospitalLogo(state, hospitalLogo) {
      window.localStorage.setItem("hospitalLogo", hospitalLogo);
    }
  },
  actions: {},
  modules: {}
});
