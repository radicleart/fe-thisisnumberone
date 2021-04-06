import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import MainNavbar from '@/components/layout/MainNavbar.vue'
import MainFooter from '@/components/layout/MainFooter.vue'
import Login from '../views/Login.vue'
// import Profile from '../views/Profile.vue'
import Home from '../views/Home.vue'
import AssetDetails from '../views/AssetDetails.vue'
import Admin from '../views/Admin.vue'
import Donate from '../views/Donate.vue'
import ItemPreview from '../views/ItemPreview.vue'
import UploadItem from '../views/UploadItem.vue'
import UpdateItem from '../views/UpdateItem.vue'
import MyItems from '../views/MyItems.vue'
import HowItWorks from '../views/HowItWorks.vue'
import store from '@/store'

Vue.use(VueRouter)

const isPermitted = function (to, profile) {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      return profile.superAdmin
    }
    return profile.loggedIn
  } else {
    return true
  }
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (profile.superAdmin) {
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    components: { default: Home, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/admin',
    name: 'admin',
    components: { default: Admin, header: MainNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
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
    path: '/assets/:assetHash',
    name: 'asset-by-hash',
    components: { default: AssetDetails, header: MainNavbar, footer: MainFooter },
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
    let myProfile = store.getters['rpayAuthStore/getMyProfile']
    if (myProfile && myProfile.loggedIn) {
      if (isPermitted(to, myProfile)) {
        return next()
      } else {
        return next({ path: '/404', query: { redirect: to.fullPath } })
      }
    } else {
      setTimeout(function () {
        myProfile = store.getters['rpayAuthStore/getMyProfile']
        if (myProfile.loggedIn) {
          if (isPermitted(to, myProfile)) {
            return next()
          } else {
            return next({ path: '/404', query: { redirect: to.fullPath } })
          }
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
