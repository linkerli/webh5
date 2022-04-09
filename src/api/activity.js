import { axios } from "@/libs/request";


export const matchInfo = params => {
  return axios.request({
    url: "activity/detail",
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

