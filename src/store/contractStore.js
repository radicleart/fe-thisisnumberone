import axios from 'axios'
import { AppConfig, UserSession } from '@stacks/connect'
import { Storage } from '@stacks/storage'
import Stomp from '@stomp/stompjs'
import SockJS from 'sockjs-client'

// Vue.use(Vuex)
let socket = null
let stompClient = null
const MESH_API_PATH = process.env.VUE_APP_API_MESH
const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })
const storage = new Storage({ userSession })

const tokenFromHash = function (state, ahash) {
  if (state.application) {
    const app = state.application
    if (app.tokenContract && app.tokenContract.tokens) {
      app.tokenContract.tokens.forEach((token) => {
        if (token.tokenInfo.assetHash === ahash) {
          return token
        }
      })
    }
  }
}

const fetchGaiaData = function (commit, state, data) {
  try {
    const index = state.gaiaAssets.findIndex((o) => o.assetHash === data.assetHash)
    if (index > -1) return // already read this file in current page session
    const options = {
      decrypt: false,
      username: data.gaiaUsername
    }
    storage.getFile(data.gaiaFilename, options).then((file) => {
      const rootFile = JSON.parse(file)
      if (rootFile && rootFile.records && rootFile.records.length > -1) {
        rootFile.records.forEach((asset) => {
          const token = tokenFromHash(asset.assetHash)
          if (token) {
            asset.nftIndex = token.nftIndex
            asset.saleData = token.saleData
            commit('addGaiaAsset', asset)
          }
        })
      }
    }).catch((error) => {
      console.log(error)
    })
  } catch (err) {
    console.log(err)
  }
}

const loadAssetsFromGaia = function (commit, state) {
  if (state.application) {
    const app = state.application
    if (app.tokenContract && app.tokenContract.tokens) {
      app.tokenContract.tokens.forEach((token) => {
        fetchGaiaData(commit, state, { gaiaFilename: app.gaiaFilename, gaiaUsername: token.tokenInfo.gaiaUsername, assetHash: token.tokenInfo.assetHash })
      })
    }
  }
}

const subscribeApiNews = function (dispatch, state, commit, connectUrl, contractId) {
  if (!socket) socket = new SockJS(connectUrl + '/api-news')
  if (!stompClient) stompClient = Stomp.over(socket)
  stompClient.connect({}, function () {
    stompClient.subscribe('/queue/rates-news', function (response) {
      const rates = JSON.parse(response.body)
      commit('setTickerRates', rates.tickerRates)
    })
    stompClient.subscribe('/queue/contract-news-' + contractId, function (response) {
      const application = JSON.parse(response.body)
      commit('setApplication', application)
      loadAssetsFromGaia(commit, state)
    })
  },
  function (error) {
    console.log(error)
  })
}

const contractStore = {
  namespaced: true,
  state: {
    application: null,
    tickerRates: null,
    gaiaAssets: []
  },
  getters: {
    getApplication: state => {
      return state.application
    },
    geGaiaAssets: state => {
      return state.gaiaAssets
    },
    geTokenFromHash: state => ahash => {
      return tokenFromHash(state, ahash)
    }
  },
  mutations: {
    setApplication (state, application) {
      state.application = application
    },
    setTickerRates (state, tickerRates) {
      state.tickerRates = tickerRates
    },
    addGaiaAsset (state, asset) {
      if (!state.gaiaAssets) return
      const index = state.gaiaAssets.findIndex((o) => o.assetHash === asset.assetHash)
      if (index === -1) {
        state.gaiaAssets.splice(0, 0, asset)
      } else {
        state.gaiaAssets.splice(index, 1, asset)
      }
    }
  },
  actions: {
    initialiseTheOne ({ state, dispatch, commit }) {
      return new Promise((resolve, reject) => {
        // if project id is set in config then read search index of this
        // project. Otherwise search projects recursively
        const contractId = STX_CONTRACT_ADDRESS + '.' + STX_CONTRACT_NAME
        const path = MESH_API_PATH + '/v2/appmap/' + contractId
        axios.get(path).then(response => {
          subscribeApiNews(dispatch, state, commit, MESH_API_PATH, contractId)
          commit('setApplication', response.data)
          loadAssetsFromGaia(dispatch, state)
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
      })
    }
  }
}
export default contractStore
