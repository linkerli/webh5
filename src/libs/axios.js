import axios from "axios";
import store from "@/store";
import router from "@/router";
import Qs from "qs";
import { Message,MessageBox } from 'element-ui'
import { removeStorage, goBack, getStorage } from "./utils";
import { getToken, getUid } from "./auth";

class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.queue = {};
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      timeout: 20000,
      paramsSerializer: function(params) {
        return Qs.stringify(params);
      },
      transformRequest: [
        function(data) {
          if (!data) {
            data = {};
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
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}
export default HttpRequest;
