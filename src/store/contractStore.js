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
  let retToken = null
  if (state.application) {
    const app = state.application
    if (app.tokenContract && app.tokenContract.tokens) {
      const index = app.tokenContract.tokens.findIndex((o) => o.tokenInfo.assetHash === ahash)
      if (index > -1) {
        retToken = app.tokenContract.tokens[index]
      }
    }
  }
  return retToken
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
        rootFile.records.forEach((gaiaAsset) => {
          const token = tokenFromHash(state, gaiaAsset.assetHash)
          if (token) {
            Object.assign(gaiaAsset, token)
          }
          commit('addGaiaAsset', gaiaAsset)
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

const subscribeApiNews = function (state, commit, connectUrl, contractId) {
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
    getGaiaAssets: state => {
      return state.gaiaAssets
    },
    getGaiaAssetsByOwner: state => owner => {
      return state.gaiaAssets.filter((o) => o.owner === owner)
    },
    getGaiaAssetByHash: state => ahash => {
      const index = state.gaiaAssets.findIndex((o) => o.assetHash === ahash)
      return state.gaiaAssets[index]
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
          subscribeApiNews(state, commit, MESH_API_PATH, contractId)
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
