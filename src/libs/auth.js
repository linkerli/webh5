import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js';

const TokenKey = 'acction_token'
const AppInfo = 'appInfo'
const urId = 'userId'
const APP = 'APP'
const GID = 'GID'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getAPP() {
  return Cookies.get(APP)
}

export function setAPP(app) {
  return Cookies.set(APP, app)
}

export function removeAPP() {
  return Cookies.remove(APP)
}

export function getUid() {
  return Cookies.get(urId)
}

export function setUid(urid) {
  return Cookies.set(urId, urid)
}

export function removeUid() {
  return Cookies.remove(urId)
}

export function getGid() {
  return Cookies.get(GID)
}

export function setGid(gid) {
  return Cookies.set(GID, gid)
}

export function removeGid() {
  return Cookies.remove(GID)
}

export function getAppInfo() {
  return Cookies.get(AppInfo)
}

export function setAppInfo(menu) {
  return Cookies.set(AppInfo, menu)
}

export function removeAppInfo() {
  return Cookies.remove(AppInfo)
}

export function getBaseUrl() {
  return  process.env.VUE_APP_BASE_API
}

export function appencode(info) {
  var mix = "Zw7[:(fD\n"
  var ciphertext = CryptoJS.AES.encrypt(info, mix).toString();
  return encodeURIComponent(ciphertext);
}
