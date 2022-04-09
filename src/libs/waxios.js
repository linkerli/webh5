import axios from "axios";
import store from "@/store";
import router from "@/router";
import Qs from "qs";
import { Message,MessageBox } from 'element-ui'
import { removeStorage, goBack, getStorage } from "./utils";
import { getToken, getUid } from './auth'

class HttpRequestWechat {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.queue = {};
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      timeout: 20000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: 'Bearer ' + getToken()
      },
      paramsSerializer: function(params) {
        if (!params) params = {};
        var app = store.getters.app;
        var gid = store.getters.gid;
        var token = getToken()
        var urid = getUid()
        if(!params.gid){
          Object.assign(params, { app, gid });
        }
        if(token){
          Object.assign(params, { urid, token });
        }

        return Qs.stringify(params);
      },
      transformRequest: [
        function(data) {
          if (!data) {
            data = {};
          }
          var app = store.getters.app;
          var gid = store.getters.gid;
          if(!data.gid){
            Object.assign(data, { app, gid });
          }
          var token = getToken()
          var urid = getUid()
          if(token){
            Object.assign(data, { urid, token });
          }

          return Qs.stringify(data);
        }
      ]
    };
    return config;
  }
  destroy(url) {
    delete this.queue[url];
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        this.queue[url] = true;
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        this.destroy(url);
        const { data } = res;
        if (data.status == 200 || data.statusCode == 200) {
          //!!TODO move 定制
        } else if (data.status == 201 || data.message == "urid上传错误") {
          MessageBox('当前操作需要登录,立即登录?','提醒',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              //同时登陆
              removeStorage("userInfo");
              store.commit('user/updateShowlogin', {showlogin: true});
              router.replace({ name: "home" });
            })
            .catch(() => {
              goBack();
            });
        } else if (data.status == 205) {
          MessageBox(data.message,'提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              // on close
            })
            .catch(() => {
              goBack();
            });
        } else {
          Message({
            type: 'info',
            message: data.message
          });
        }

        return Promise.resolve(data);
        // return { data, status }
      },
      error => {
        console.log(error)
        let message = error.message||error;
        Message({
          type: 'info',
          message: message
        });
        // console.log(error.message);
        // console.log(error);
        this.destroy(url);
        return Promise.reject(error);
      }
    );
  }
  request(options) {
    if (options.method == "get" && !options.params) {
      options.params = { reget: 1 };
    }
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}
export default HttpRequestWechat;
