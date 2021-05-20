import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '@/store'

// templates
import MainNavbar from '@/components/layout/MainNavbar.vue'
import MainFooter from '@/components/layout/MainFooter.vue'
import AdminNavbar from '@/components/layout/AdminNavbar.vue'

// public pages
import HomeFooter from '@/components/layout/HomeFooter.vue'
import Login from '../views/Login.vue'
// import Information from '../views/Information.vue'
const Information = () => import('../views/Information.vue')

const Charity = () => import('../views/Charity.vue')
const AssetDetails = () => import('../views/AssetDetails.vue')
const About = () => import('../views/About.vue')
const NumberOne = () => import('../views/NumberOne.vue')

// private pages
const Admin = () => import('../views/Admin.vue')
const OfferAdmin = () => import('../views/OfferAdmin.vue')
const ItemPreview = () => import('../views/ItemPreview.vue')
const UploadItem = () => import('../views/UploadItem.vue')
const UpdateItem = () => import('../views/UpdateItem.vue')
const MyItems = () => import('../views/MyItems.vue')

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
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'splash',
    components: { default: NumberOne, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/home',
    name: 'home',
    components: { default: NumberOne, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/number-one',
    name: 'number-one',
    components: { default: NumberOne, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/about',
    name: 'about',
    components: { default: About, footer: MainFooter }
  },
  {
    path: '/login',
    name: 'login',
    components: { default: Login, header: AdminNavbar, footer: HomeFooter }
  },
  {
    path: '/profile',
    name: 'profile',
    components: { default: ItemPreview, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/information/:infoId',
    name: 'info-page',
    components: { default: Information, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/charity/:charityId',
    name: 'charity-page',
    components: { default: Charity, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/assets/:assetHash',
    name: 'asset-by-hash',
    components: { default: AssetDetails, header: MainNavbar, footer: MainFooter }
  },
  // admin routes
  {
    path: '/item-preview/:assetHash',
    name: 'item-preview',
    components: { default: ItemPreview, header: AdminNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/offers',
    name: 'offers',
    components: { default: OfferAdmin, header: AdminNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/create',
    name: 'create',
    components: { default: UploadItem, header: AdminNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/admin',
    name: 'admin',
    components: { default: Admin, header: AdminNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/edit-item/:assetHash',
    name: 'edit-item',
    components: { default: UpdateItem, header: AdminNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/upload-item',
    name: 'upload-item',
    components: { default: UploadItem, header: AdminNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/my-items',
    name: 'my-items',
    components: { default: MyItems, header: AdminNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/my-items/:filter',
    name: 'my-items-filter',
    components: { default: MyItems, header: AdminNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
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
        return next({ path: '/home', query: { redirect: to.fullPath } })
      }
    } else {
      setTimeout(function () {
        myProfile = store.getters['rpayAuthStore/getMyProfile']
        if (myProfile.loggedIn) {
          if (isPermitted(to, myProfile)) {
            return next()
          } else {
            return next({ path: '/home', query: { redirect: to.fullPath } })
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
