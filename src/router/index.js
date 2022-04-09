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
    path: '/survey/:acid',
    name: 'survey',
    component: () => import('@/views/Action/index.vue'),
    meta: {
      title: '问卷调查',
      showloading: false,
      noLogin: true,
    },
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
