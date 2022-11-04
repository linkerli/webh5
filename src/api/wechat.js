import { axios } from "@/libs/request";

export const jsapiConfig = data => {
    return axios.request({
      url: "api/mpjsconfig",
      method: "post",
      data
    });
  };