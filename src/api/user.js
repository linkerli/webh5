import { axios } from "@/libs/request";

export const getuserInfo = params => {
    return axios.request({
      url: "user/user-info",
      method: "get",
      params
    });
  };
export const h5login = data => {
    return axios.request({
      url: "user/login",
      method: "post",
      data
    });
  };
