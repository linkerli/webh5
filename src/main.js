import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'
import i18n from './lang'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import util from './libs/utils'
import WechatService from './libs/wechat'
import VHtmlPanel from '@/components/VHtmlPanel'
// import './theme.scss'
import { Loading, MessageBox, Message, Notification } from 'element-ui'
import '@/permission' // permission control
import VueClipboard from 'vue-clipboard2'
import VueResource from 'vue-resource'
import md5 from 'js-md5';
import StorageService from 'libs/storage'

Vue.use(util)
Vue.use(StorageService)
Vue.use(ElementUI)
Vue.use(WechatService)
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.prototype.$util = util
Vue.config.productionTip = false
Vue.prototype.$md5 = md5;

Vue.use(VHtmlPanel)
Vue.use(VueClipboard)
Vue.use(VueResource)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
