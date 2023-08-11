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

export const getList = params => {
  return axios.request({
    url: "activity/list",
    method: "get",
    params
  });
};


export const submitmemberinfos = data => {
  return axios.request({
    url: "activity-user/submitcompare",
    method: "post",
    data
  });
};

export const submitother = data => {
  return axios.request({
    url: "activity-user/submitother",
    method: "post",
    data
  });
};

