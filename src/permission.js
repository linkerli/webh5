import router from './router'
import store from './store'
import { Message,MessageBox } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from './libs/auth.js'
NProgress.configure({ showSpinner: false }) // NProgress Configuration// no redirect whitelist
import utils from './libs/utils'
const LOGIN_PAGE_NAME = 'login';
const homeName = 'index';
var checkLogin = (to, token, next,from) => {
  if (!to.meta.noLogin) {
      if (!token && to.name !== LOGIN_PAGE_NAME) {
          store.dispatch("getUserInfo")
              .then(user => {
                  checkLogin(to, user.token, next,from);
              })
              .catch(() => {
                  // console.log(e)
                  // 未登录且要跳转的页面不是登录页 记录跳转地址后 登录成功后回调
                  MessageBox.confirm('当前页面需要登录后才可访问,前往登录页面?',{
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'success'
                  }).then(() => {
                      utils.setLastRouter(to)
                      next({
                          name: LOGIN_PAGE_NAME // 跳转到登录页
                      })
                  });

              });



      } else {
          // window.history.replaceState(null, null, window.location.href);
          next();
      }

  } else {
      if (token && to.name === LOGIN_PAGE_NAME) {
          // 已登录且要跳转的页面是登录页
          next({
              name: homeName // 跳转到homeName页
          })
      } else {
          next();
      }

  }
}
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  // determine whether the user has logged in
  if (!utils.iswechat()) {
    Message.error('请在微信中打开或使用微信扫描二维码');
    return
  }
  console.log(from,'from')
  let token = localStorage.getItem('token')

  checkLogin(to, token, next,from);

  NProgress.done()

})

router.afterEach((to) => {
  // finish progress bar
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (window.__wxjs_is_wkwebview) {  // IOS
    if (window.entryUrl == '' || window.entryUrl == undefined) {
        var url = `${window.location.origin}${to.fullPath}`
        window.entryUrl = url    // 将后面的参数去除
    }
  }
  NProgress.done()
})
