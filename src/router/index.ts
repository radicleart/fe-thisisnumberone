import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import MainNavbar from '@/components/layout/MainNavbar.vue'
import MainFooter from '@/components/layout/MainFooter.vue'
import Login from '../views/Login.vue'
// import Profile from '../views/Profile.vue'
import Home from '../views/Home.vue'
import Donate from '../views/Donate.vue'
import ItemPreview from '../views/ItemPreview.vue'
import UploadItem from '../views/UploadItem.vue'
import UpdateItem from '../views/UpdateItem.vue'
import MyItems from '../views/MyItems.vue'
import HowItWorks from '../views/HowItWorks.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    components: { default: Home, header: MainNavbar }
  },
  {
    path: '/donate',
    name: 'donate',
    components: { default: Donate, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/login',
    name: 'login',
    components: { default: Login, header: MainNavbar }
  },
  {
    path: '/profile',
    name: 'profile',
    components: { default: ItemPreview, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/item-preview/:assetHash',
    name: 'item-preview',
    components: { default: ItemPreview, header: MainNavbar, footer: MainFooter },
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-item/:assetHash',
    name: 'edit-item',
    components: { default: UpdateItem, header: MainNavbar, footer: MainFooter },
    meta: { requiresAuth: true }
  },
  {
    path: '/upload-item',
    name: 'upload-item',
    components: { default: UploadItem, header: MainNavbar, footer: MainFooter },
    meta: { requiresAuth: true }
  },
  {
    path: '/my-items',
    name: 'my-items',
    components: { default: MyItems, header: MainNavbar, footer: MainFooter },
    meta: { requiresAuth: true }
  },
  {
    path: '/how-it-works',
    name: 'how-it-works',
    components: { default: HowItWorks, header: MainNavbar, footer: MainFooter }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    let myProfile = store.getters['authStore/getMyProfile']
    if (myProfile.loggedIn) {
      return next()
    } else {
      setTimeout(function () {
        myProfile = store.getters['authStore/getMyProfile']
        if (myProfile.loggedIn) {
          return next()
        } else {
          return next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        }
      }, 2000)
    }
  } else {
    return next() // make sure to always call next()!
  }
})

export default router
