import { axios } from "@/libs/request";

export const getBinfo = params => {
  return axios.request({
    url: "enterprise/info",
    method: "get",
    params
  });
};

export const sendSms = data => {
  return axios.request({
    url: "sms/registerverify",
    method: "post",
    data
  });
};

export const shareinfos = data => {
  return axios.request({
    url: "api/shareinfos",
    method: "post",
    data
  });
};

export const setfaceshare = data => {
  return axios.request({
    url: "api/setfaceshare",
    method: "post",
    data
  });
};
export const getconfig = data => {
  return axios.request({
    url: "api/cosconfig",
    method: "post",
    data
  });
};
