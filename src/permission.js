import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from './libs/auth.js'
NProgress.configure({ showSpinner: false }) // NProgress Configuration// no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  // determine whether the user has logged in
  next()
  NProgress.done()

})

router.afterEach((to) => {
  // finish progress bar
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  NProgress.done()
})
