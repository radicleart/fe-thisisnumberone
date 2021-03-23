/**
 * The auth store represents the state of the (session scoped) user in the Vue
 * application. This includes logged in state, profile and other state pertaining
 * directly to the user.
 */
import { AppConfig, UserSession, authenticate, showConnect } from '@stacks/connect'
import store from '@/store'

const origin = window.location.origin
const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })
const NETWORK = process.env.VUE_APP_NETWORK
const BLOCKSTACK_LOGIN = Number(process.env.VUE_APP_BLOCKSTACK_LOGIN)
const authFinished = function (o) {
  store.commit('authStore/setAuthResponse', o)
  store.dispatch('authStore/fetchMyAccount')
}
const authOptions = {
  sendToSignIn: false,
  redirectTo: '/',
  manifestPath: '/manifest.json',
  finished: authFinished,
  appDetails: {
    name: 'Risidio Music NFTs',
    icon: origin + '/img/logo.png'
  }
}
const getProfile = function () {
  let myProfile = {}
  try {
    const account = userSession.loadUserData()
    if (account) {
      const uname = account.username
      let name = account.profile.name
      if (uname && !name) {
        name = uname.substring(0, uname.indexOf('.'))
      }
      const isAdmin =
        uname === 'mike.personal.id' ||
        uname.indexOf('radicle') > -1 ||
        uname.indexOf('mijoco') > -1
      myProfile = {
        loggedIn: true,
        stxAddress: (NETWORK === 'mainnet') ? account.profile.stxAddress.mainnet : account.profile.stxAddress.testnet,
        superAdmin: isAdmin,
        name: name,
        description: account.profile.description,
        avatarUrl: account.profile.avatarUrl,
        username: account.username
      }
    }
    return myProfile
  } catch (err) {
    return myProfile
  }
}

const authStore = {
  namespaced: true,
  state: {
    myProfile: {
      username: null,
      loggedIn: false,
      showAdmin: false
    },
    appName: 'Risidio Music NFTs',
    appLogo: '/img/sticksnstones_logo.8217b8f7.png'
  },
  getters: {
    getMyProfile: state => {
      if (!state.myProfile) {
        return {
          loggedIn: false
        }
      }
      return state.myProfile
    }
  },
  mutations: {
    myProfile (state, myProfile) {
      state.myProfile = myProfile
    }
  },
  actions: {
    fetchMyAccount ({ commit }) {
      return new Promise(resolve => {
        if (userSession.isUserSignedIn()) {
          const profile = getProfile()
          commit('myProfile', profile)
          resolve(profile)
        } else if (userSession.isSignInPending()) {
          userSession.handlePendingSignIn().then(() => {
            const profile = getProfile()
            commit('myProfile', profile)
            resolve(profile)
          })
        } else {
          const profile = getProfile()
          commit('myProfile', profile)
          resolve(profile)
        }
      })
    },
    startLogin () {
      return new Promise(() => {
        if (BLOCKSTACK_LOGIN === 1) {
          showConnect(authOptions)
        } else {
          authenticate(authOptions)
        }
      })
    },
    startLogout ({ commit }) {
      return new Promise((resolve) => {
        if (userSession.isUserSignedIn()) {
          userSession.signUserOut(window.location.origin)
          commit('myProfile', getProfile())
        }
        resolve(getProfile())
      })
    }
  }
}
export default authStore
