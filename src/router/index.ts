import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '@/store'
import { APP_CONSTANTS } from '@/app-constants'

// templates
import AboutNavbar from '@/components/layout/AboutNavbar.vue'
import MainFooter from '@/components/layout/MainFooter.vue'
import AdminNav from '@/views/mgmnt/AdminNav.vue'

// public pages
import HomeFooter from '@/components/layout/HomeFooter.vue'
import Login from '../views/Login.vue'
import Information from '../views/Information.vue'
// const Information = () => import('../views/Information.vue')
import ExhibitHere from '../views/ExhibitHere.vue'
import ManageProfile from '../views/ManageProfile.vue'

const Charity = () => import('../views/Charity.vue')
const About = () => import('../views/About.vue')
const NumberOne = () => import('../views/NumberOne.vue')
// const Charity = () => import('../views/Charity.vue')
// const AssetDetails = () => import('../views/AssetDetails.vue')
// const About = () => import('../views/About.vue')
// const NumberOne = () => import('../views/NumberOne.vue')

// Public Marketplace Routes
const ItemPreview = () => import('@/views/marketplace/ItemPreview.vue')
const AssetDetails = () => import('@/views/marketplace/AssetDetails.vue')
const MyNftLibrary = () => import('@/views/marketplace/MyNftLibrary.vue')
const NftGallery = () => import('@/views/marketplace/NftGallery.vue')
const UploadItem = () => import('@/views/marketplace/UploadItem.vue')
const UpdateItem = () => import('@/views/marketplace/UpdateItem.vue')

// Application Admin Routes
const ManageRegistry = () => import(/* webpackChunkName: "ManageRegistry" */ '@/views/mgmnt/ManageRegistry.vue')
const ManagePrivileges = () => import(/* webpackChunkName: "ManagePrivileges" */ '@/views/mgmnt/ManagePrivileges.vue')
const ManageRequests = () => import(/* webpackChunkName: "ManageRequests" */ '@/views/mgmnt/ManageRequests.vue')
const ManageCollections = () => import(/* webpackChunkName: "ManageCollections" */ '@/views/mgmnt/ManageCollections.vue')
const ManageCollection = () => import(/* webpackChunkName: "ManageCollection" */ '@/views/mgmnt/ManageCollection.vue')
const ManageOffers = () => import(/* webpackChunkName: "ManageOffers" */ '@/views/mgmnt/ManageOffers.vue')

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
    components: { default: NumberOne, header: AboutNavbar, footer: MainFooter },
    meta: { title: 'This is number one' }
  },
  {
    path: '/home',
    name: 'home',
    components: { default: NumberOne, header: AboutNavbar, footer: MainFooter },
    meta: { title: 'This is number one' }
  },
  {
    path: '/number-one',
    name: 'number-one',
    components: { default: NumberOne, header: AboutNavbar, footer: MainFooter },
    meta: { title: 'This is number one' }
  },
  {
    path: '/nft-gallery',
    alias: '/nft-market',
    name: 'nft-gallery',
    components: { default: NftGallery, header: AboutNavbar, footer: MainFooter },
    meta: { title: 'This is number one' }
  },
  {
    path: '/exhibit-here',
    name: 'exhibit-here',
    components: { default: ExhibitHere, header: AboutNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
      title: 'Join #1 and exhibit your artwork in decentralised gallery and marketplace'
    }
  },
  {
    path: '/about',
    name: 'about',
    components: { default: About, footer: MainFooter },
    meta: { title: 'About page' }
  },
  {
    path: '/login',
    name: 'login',
    components: { default: Login, header: AboutNavbar, footer: HomeFooter },
    meta: { title: 'Login page' }
  },
  {
    path: '/profile',
    name: 'profile',
    components: { default: ManageProfile, header: AboutNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
      title: 'Manage Profile'
    }
  },
  {
    path: '/information/:infoId',
    name: 'info-page',
    components: { default: Information, header: AboutNavbar, footer: MainFooter }
  },
  {
    path: '/charity/:charityId',
    name: 'charity-page',
    components: { default: Charity, header: AboutNavbar, footer: MainFooter }
  },
  {
    path: '/assets/:assetHash/:edition',
    name: 'asset-by-hash',
    components: { default: AssetDetails, header: AboutNavbar, footer: MainFooter },
    meta: { title: 'Asset informations' }
  },
  {
    path: '/nfts/:nftIndex',
    name: 'asset-by-index',
    components: { default: AssetDetails, header: AboutNavbar, footer: MainFooter },
    meta: {
      requiresAuth: false,
      requiresAdmin: false,
      title: 'NFT display'
    }
  },
  {
    path: '/item-preview/:assetHash/:edition',
    name: 'item-preview',
    components: { default: ItemPreview, header: AboutNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
      title: 'Item preview'
    }
  },
  {
    path: '/edit-item/:assetHash',
    name: 'edit-item',
    components: { default: UpdateItem, header: AboutNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: false
    }
  },
  {
    path: '/upload-item',
    name: 'upload-item',
    components: { default: UploadItem, header: AboutNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: false
    }
  },
  {
    path: '/my-nfts',
    name: 'my-nfts',
    components: { default: MyNftLibrary, header: AboutNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: false
    }
  },
  /**
   * admin section...
   */
  {
    path: '/mgmnt',
    name: 'registry',
    components: { default: ManageRegistry, adminNav: AdminNav, header: AboutNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/mgmnt/registry',
    name: 'registry',
    components: { default: ManageRegistry, adminNav: AdminNav, header: AboutNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/mgmnt/registry/:section',
    name: 'registry-section',
    components: { default: ManageRegistry, adminNav: AdminNav, header: AboutNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/mgmnt/offers',
    name: 'offers',
    components: { default: ManageOffers, header: AboutNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/mgmnt/manage-privileges',
    name: 'manage-privileges',
    components: { default: ManagePrivileges, adminNav: AdminNav, header: AboutNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/mgmnt/exhibit-requests',
    name: 'exhibit-requests',
    components: { default: ManageRequests, adminNav: AdminNav, header: AboutNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/mgmnt/manage-collections',
    name: 'manage-collections',
    components: { default: ManageCollections, adminNav: AdminNav, header: AboutNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/mgmnt/manage-collection',
    name: 'manage-collection',
    components: { default: ManageCollection, adminNav: AdminNav, header: AboutNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/mgmnt/manage-collections/:currentRunKey',
    name: 'manage-collection',
    components: { default: ManageCollection, adminNav: AdminNav, header: AboutNavbar, footer: MainFooter },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/mgmnt/app-admin',
    name: 'app-admin',
    components: { default: ManageRegistry, adminNav: AdminNav, header: AboutNavbar, footer: MainFooter },
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
      let counter = 0
      const myint = setInterval(function () {
        counter++
        myProfile = store.getters['rpayAuthStore/getMyProfile']
        if (myProfile && myProfile.loggedIn) {
          if (isPermitted(to, myProfile)) {
            return next()
          }
        }
        if (counter >= 5) {
          clearInterval(myint)
          return next({ path: '/home', query: { redirect: to.fullPath } })
        }
      }, 2000)
    }
  } else {
    return next() // make sure to always call next()!
  }
})

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags)
  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags)

  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title
  } else if (previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title
  }

  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el))

  if (!nearestWithMeta) return next()

  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta')

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key])
    })

    tag.setAttribute('data-vue-router-controlled', '')

    return tag
  }).forEach(tag => document.head.appendChild(tag))

  next()
})

export default router
