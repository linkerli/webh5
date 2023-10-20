import axios from "axios";
import store from "@/store";
import router from "@/router";
import Qs from "qs";
import { Message,MessageBox } from 'element-ui'
import utils from "./utils";
import { getToken, getUid } from "./auth";

class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.queue = {};
  }
  getInsideConfig() {
    return {
      baseURL: this.baseUrl,
      timeout: 10e3,
    };
  }
  destroy(url) {
    delete this.queue[url];
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        let params = {}
        let urid = localStorage.getItem('urid')
        let token = localStorage.getItem('token')
        if (urid && token) {
          params = Object.assign(params, { urid, token });
          // config.headers.common['Authorization'] = 'Bearer ' + store.getters.getUserInfo.token // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
          }
          // console.log(params,'params')
          switch (config.method.toUpperCase()) {
              case 'GET':
                  config.params = { ...params, ...config.params };
                  break;
              default:
                  config.data = Qs.stringify({ ...params, ...config.data });
                  config.params = { token: params.token };
                  break;
          }

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
        // } else if (data.status == 202 || data.statusCode == 201) {
          // MessageBox.confirm('当前页面需要登录后才可访问,前往登录页面?',{
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'success'
          // }).then(() => {
          //   // console.log(to,'to')
          //   //   utils.setLastRouter(to)
          //     router.replace({name:'login'})
          // }).catch(() => {

          // });
        } else {
          Message({
            type: 'info',
            message:data.message
          });
        }

        return Promise.resolve(data);
        // return { data, status }
      },
      error => {
        // console.log(error)
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
