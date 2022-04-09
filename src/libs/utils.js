import CryptoJS from "crypto-js";
import config from "@/config";
import router from "@/router";
import moment from "moment";
import { Message } from "element-ui";

export default{
  isPc() {
    var ua = navigator.userAgent;

    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),

      isIphone =!ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),

      isAndroid = ua.match(/(Android)\s+([\d.]+)/),

      isMobile = isIphone || isAndroid;

    if(isMobile){
      return false;
    }else{
      return true;
    }
  },
  IsIdCardNo: function (idCard) {
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    //如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (regIdCard.test(idCard)) {
      if (idCard.length == 18) {
        var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
        var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
        var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
        for (var i = 0; i < 17; i++) {
          idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
        }
        var idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置
        var idCardLast = idCard.substring(17);//得到最后一位身份证号码
        //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
        if (idCardMod == 2) {
          if (idCardLast == "X" || idCardLast == "x") {
            return true;
            //alert("恭喜通过验证啦！");
          } else {
            return false;
            //alert("身份证号码错误！");
          }
        } else {
          //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
          if (idCardLast == idCardY[idCardMod]) {
            //alert("恭喜通过验证啦！");
            return true;
          } else {
            return false;
            //alert("身份证号码错误！");
          }
        }
      }
    } else {
      //alert("身份证格式不正确!");
      return false;
    }
  },
  islogin() {
    var user = localStorage.getItem("logininfo");
    var userInfo = JSON.parse(user)
    return userInfo != null && userInfo.id != undefined && userInfo.id;
  },
  getScrollHeight:function(){
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if(document.body){
      bodyScrollHeight = document.body.scrollHeight;
    }
    if(document.documentElement){
      documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
  },
  getWindowHeight:function(){
    var windowHeight = 0;
    if(document.compatMode == "CSS1Compat"){
      windowHeight = document.documentElement.clientHeight;
    }else{
      windowHeight = document.body.clientHeight;
    }
    return windowHeight;
  },
  iswechat:function(){
    var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i) ;
    if( !wechatInfo ) {
      return false;
    }else{
      return true;
    }
  },
  getScrollTop:function(){
    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    if(document.body){
      bodyScrollTop = document.body.scrollTop;
    }
    if(document.documentElement){
      documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
  }
}
export const getToken = () => {};

export const isPc = () => {
  var ua = navigator.userAgent;

  var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),

    isIphone =!ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),

    isAndroid = ua.match(/(Android)\s+([\d.]+)/),

    isMobile = isIphone || isAndroid;

  if(isMobile){
    return false;
  }else{
    return true;
  }
};
export const isJSON = str => {
  if (typeof str == "string") {
    try {
      if (str.indexOf("{") > -1) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  } else if (typeof str == "object") {
    return true;
  }
  return false;
};
export const checkMobile = str => {
  var re = /^1\d{10}$/;
  if (re.test(str)) {
    return true;
  } else {
    return false;
  }
};
export const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return [year, month, day].map(formatNumber).join("-");
};
export const formatDate = (date, fmt) => {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }

  let o = {
    "Y+": date.getFullYear(),
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };

  // 遍历这个对象
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? formatNumber(str) : str
      );
    }
  }
  return fmt;
};
export const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};
export const setLastRouter = to => {
  var { name, query, params } = to;
  var lastrouter = { name, query, params };
  return setStorage("loastroute", lastrouter, true);
};

export const getLastRouter = () => {
  return getStorage("loastroute");
};

export const isWeiXin = () => {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
};
export const setStorage = (name, value, encode) => {
  if (encode) {
    if (isJSON(value)) value = appencode(JSON.stringify(value));
    else value = appencode(value);
  }
  window.localStorage.setItem(name, value);
  value = appdecode(value);
  if (isJSON(value)) {
    return JSON.parse(value);
  } else {
    return value;
  }
};

export const removeStorage = name => {
  var value = window.localStorage.removeItem(name);
  if (value) {
    return true;
  } else {
    return false;
  }
};

export const clearStorage = () => {
  var value = window.localStorage.clear();
  if (value) {
    return true;
  } else {
    return false;
  }
};

export const getStorage = name => {
  var value = window.localStorage.getItem(name);
  if (!value) return "";
  value = appdecode(value);
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }

  // return JSON.parse(value);
};

export const appencode = info => {
  var mix = config.mixCode;
  var ciphertext = CryptoJS.AES.encrypt(info, mix).toString();
  return encodeURIComponent(ciphertext);
};

export const appdecode = ciphertext => {
  ciphertext = decodeURIComponent(ciphertext);
  var mix = config.mixCode;
  var bytes = CryptoJS.AES.decrypt(ciphertext, mix);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const goBack = url => {
  if (window.history.length > 1) {
    if (url == "/login" || url == "index") {
      router.replace({ name: "index" });
    } else {
      router.go(-1);
    }
    //
  } else {
    router.push({ name: "index" });
  }
};

export const islogin = () => {
  var userInfo = getStorage("userInfo");

  return userInfo != null && userInfo.urid != undefined && userInfo.urid;
};

export const checklogin = to => {
  if (!islogin()) {
    this.confirm('当前页面需要登录后才可访问,前往登录页面?',"提醒",{
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      setLastRouter(to); //设置登陆后的调转
      router.replace({ name: "login" });
    }).catch(() => {
      router.push({ name: "index" });
    });
  } else {
    return true;
  }
};

export const fromatMatchTime = e => {
  var currentt = moment().unix();
  if (currentt < e.reg_start_time) {
    return Object.assign(e, {
      btntext: "报名未开始",
      state: "未开始",
      fontcolor: "#FFFFFF",
      bgcolor: "rgba(128, 134, 149,.9)"
    });
  } else if (currentt > e.reg_start_time && currentt < e.reg_end_time) {
    return Object.assign(e, {
      regstate: 1,
      btntext: "立即报名",
      state: "报名中",
      fontcolor: "#FFFFFF",
      bgcolor: "rgba(25,190,107,.9)"
    });
  } else if (currentt > e.reg_end_time && currentt < e.start_time) {
    return Object.assign(e, {
      btntext: "报名已结束",
      state: "未开始",
      fontcolor: "#FFFFFF",
      bgcolor: "rgba(197, 200, 206,.9)"
    });
  } else if (currentt <= e.reg_end_time && currentt >= e.start_time) {
    return Object.assign(e, {
      btntext: "报名已结束",
      state: "进行中",
      fontcolor: "#FFFFFF",
      bgcolor: "rgba(25,190,107,.9)"
    });
  } else if (currentt >= e.end_time) {
    return Object.assign(e, {
      btntext: "报名已结束",
      state: "已结束",
      fontcolor: "#FFFFFF",
      bgcolor: "rgba(128, 134, 149,.9)"
    });
  } else {
    return Object.assign(e, {
      btntext: "报名已结束",
      state: "已结束",
      fontcolor: "#FFFFFF",
      bgcolor: "rgba(128, 134, 149,.9)"
    });
  }
};
