import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      title: '首页',
      showloading: false,
      noLogin: true,
    },
  },
  {
    path: '/data',
    name: 'data',
    component: () => import('@/views/Data/index.vue'),
    meta: {
      title: '列表',
      showloading: false,
      noLogin: true,
    },
  },
  {
    path: '/wx',
    name: 'wx',
    component: () => import('@/views/Wx/index.vue'),
    meta: {
      title: '列表',
      showloading: false,
      noLogin: true,
    },
  },
  {
    path: '/survey/:acid',
    name: 'survey',
    component: () => import('@/views/Action/index.vue'),
    meta: {
      title: '问卷调查',
      showloading: false,
      noLogin: false,
    },
  },
  {
    path: '/finish/:acid?',
    name: 'finish',
    component: () => import('@/views/Action/finish.vue'),
    meta: {
      title: '谢谢参与',
      showloading: false,
      noLogin: false,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
        import(/* webpackChunkName: "login" */ "@/views/Login/Login.vue"),
    meta: {
        title: "登录",
        noLogin: true,
    }
  },
  // {
  //   path: '/',
  //   name: 'home',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/match/index.vue')
  // },
]

const router = new Router({
  mode: 'history',
  base: '/',
  scrollBehavior: () => ({ y: 0 }),
  routes
})

export default router
