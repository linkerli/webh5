import { axios } from "@/libs/request";

export const getuserInfo = params => {
    return axios.request({
      url: "user/userinfo",
      method: "get",
      params
    });
  };
export const h5login = data => {
    return axios.request({
      url: "user/login-wx-wap",
      method: "post",
      data
    });
  };