import { axios } from "@/libs/request";


export const matchInfo = params => {
  return axios.request({
    url: "activity/detail",
    method: "get",
    params
  });
};

export const getIndex = params => {
  return axios.request({
    url: "activity/index",
    method: "get",
    params
  });
};

export const getWxIndex = params => {
  return axios.request({
    url: "enterprise-wechat/index",
    method: "get",
    params
  });
};

export const getList = params => {
  return axios.request({
    url: "activity/list",
    method: "get",
    params
  });
};


export const submitmemberinfos = data => {
  return axios.request({
    url: "activity/submit-suv",
    method: "post",
    data
  });
};

export const submitother = data => {
  return axios.request({
    url: "activity/submitother",
    method: "post",
    data
  });
};

