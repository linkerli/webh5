import HttpRequest from "./axios";
import HttpRequestWechat from "./waxios";
import config from "../config";
const baseUrl =
  process.env.NODE_ENV === "development"
    ? config.baseUrl.dev
    : config.baseUrl.pro
// const baseUrl2 =
//   process.env.NODE_ENV === "development"
//     ? config.baseUrl2.dev
//     : config.baseUrl2.pro

// const baseUrl3 =
//   process.env.NODE_ENV === "development"
//     ? config.baseUrl3.dev
//     : config.baseUrl3.pro

// export const axios3 = new HttpRequestWechat(baseUrl3);
export const axios = new HttpRequest(baseUrl);
// export const axios2 = new HttpRequest(baseUrl2);

