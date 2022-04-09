import config from "@/config";
import { getToken, setToken, removeToken, getAppInfo, setAppInfo, removeAppInfo, getAPP, setAPP, removeAPP, getUid, setUid, removeUid, getGid, setGid, removeGid } from '@/libs/auth'

const state = {
  token: getToken(),
  gid: getGid(),
  app: getAPP(),
  logininfo:'',
  routerinfo:'',
  showlogin:false,
  fullscreenLoading:false,
  userid: getUid(),
  appinfo: getAppInfo()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_GID: (state, gid) => {
    state.gid = gid
  },
  SET_APP: (state, app) => {
    state.app = app
  },
  updateShowlogin: (state,options) => {
    state.showlogin =   options.showlogin;
  },
  updateRouterinfo(state,options){
    state.routerinfo =   options;
    localStorage.setItem('routerinfo',JSON.stringify(options));
  },
  updateLogininfo: (state,options) => {
    state.logininfo =   options;
  },
  SET_USERID: (state, userid) =>{
    state.userid = userid
  },
  SET_APPINFO: (state, appinfo) =>{
    state.appinfo = appinfo
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
