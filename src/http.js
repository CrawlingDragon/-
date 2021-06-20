import axios from "axios";
import QS from "qs";

axios.defaults.timeout = 8000;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=utf-8";
axios.defaults.baseURL = process.env.VUE_APP_API
//配置接口地址
// console.log(axios.defaults.baseURL);

//post 传参序列化，（添加请求拦截器）
axios.interceptors.request.use(
  config => {
    //在发送请求之前做什么事

    if (config.url === "/API/Wen/OssUploadFile") {
      return config;
    }
    if (config.method === "post") {
      config.data = QS.stringify(config.data);
    }
    return config;
  },
  error => {
    //console.log('错误的传参')
    return Promise.reject(error);
  }
);

//返回判断状态（添加响应拦截器）
axios.interceptors.response.use(
  res => {
    //处理响应数据
    if (res.data.success) {
      return Promise.resolve(res);
    }
    return res;
  },
  error => {
    return Promise.reject(error);
  }
);

//返回一个Promise（发送post请求）
export function fetchPost(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(
        response => {
          resolve(response);
        },
        err => {
          reject(err);
        }
      )
      .catch(error => {
        reject(error);
      });
  });
}

//返回一个Promise(发送get请求)
export function fetchGet(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params })
      .then(
        response => {
          resolve(response);
        },
        err => {
          reject(err);
        }
      )
      .catch(error => {
        reject(error);
      });
  });
}
export default {
  fetchPost,
  fetchGet
};
