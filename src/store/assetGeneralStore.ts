import axios from 'axios'
import { APP_CONSTANTS } from '@/app-constants'

axios.defaults.withCredentials = true

const MESH_API_PATH = process.env.VUE_APP_RISIDIO_API + '/mesh'

const assetGeneralStore = {
  namespaced: true,
  state: {
    emailData: [],
    filters: [],
    offers: [],
    transactions: [],
    cacheState: 0,
    sig: null
  },
  getters: {
    getTransactions: state => {
      return state.transactions
    },
    getFilters: state => {
      return state.filters
    },
    getOffers: state => {
      return state.offers
    },
    getAllOffersForAsset: (state, getters, rootState, rootGetters) => assetHash => {
      if (!assetHash) return
      const dbOffers = rootGetters[APP_CONSTANTS.KEY_DB_OFFERS].filter((o) => o.assetHash === assetHash)
      const sortedOffers = dbOffers.sort(function compare (a, b) {
        if (a.amount < b.amount) {
          return 1
        } else if (a.amount > b.amount) {
          return -1
        } else {
          return 0
        }
      })
      return sortedOffers
    },
    getHighestOfferForAsset: (state, getters, rootState, rootGetters) => assetHash => {
      if (!assetHash) return
      let dbOffers = rootGetters[APP_CONSTANTS.KEY_DB_OFFERS].filter((o) => o.assetHash === assetHash)
      dbOffers = dbOffers.filter((o) => o.status > 0)
      const sortedOffers = dbOffers.sort(function compare (a, b) {
        if (a.amount < b.amount) {
          return 1
        } else if (a.amount > b.amount) {
          return -1
        } else {
          return 0
        }
      })
      return sortedOffers[0]
    }
  },
  mutations: {
    setTransactions (state, transactions) {
      state.transactions = transactions
    },
    setSig (state, sig) {
      state.sig = sig
    },
    setFilters (state, filters) {
      state.filters = filters
    },
    setCacheState (state, data) {
      state.cacheState = data
    }
  },
  actions: {
    cacheUpdate ({ dispatch }, data) {
      return new Promise(function () {
        const cacheUpdate = {
          type: 'token',
          functionName: data.functionName || 'general',
          nftIndex: (data.nftIndex) ? Number(data.nftIndex) : null,
          assetHash: data.assetHash,
          contractId: data.contractId
        }
        dispatch('rpayStacksContractStore/updateCache', cacheUpdate, { root: true })
      })
    },
    saveTokenFilter ({ commit }, tokenFilter) {
      return new Promise(function (resolve) {
        axios.post(MESH_API_PATH + '/v2/token-filter', tokenFilter).then((result) => {
          commit('addFilter', result.data)
          resolve(result.data)
        }).catch((error) => {
          resolve(new Error('Unable to find token filters: ' + error))
        })
      })
    },
    updateTokenFilter ({ commit, rootGetters }, tokenFilter) {
      return new Promise(function (resolve) {
        const authHeaders = rootGetters[APP_CONSTANTS.KEY_AUTH_HEADERS]
        axios.put(MESH_API_PATH + '/v2/token-filter', tokenFilter, authHeaders).then((result) => {
          commit('addFilter', result.data)
          resolve(result.data)
        }).catch((error) => {
          resolve(new Error('Unable to find token filters: ' + error))
        })
      })
    },
    deleteTokenFilter ({ commit }, filterId) {
      return new Promise(function (resolve) {
        axios.delete(MESH_API_PATH + '/v2/token-filter/' + filterId).then(() => {
          commit('addFilter', { filterId: filterId })
          resolve(filterId)
        }).catch((error) => {
          resolve(new Error('Unable to find token filters: ' + error))
        })
      })
    },
    fetchMetaData ({ state }, metaDataUrl) {
      return new Promise(function (resolve, reject) {
        axios.get(metaDataUrl).then((result) => {
          state.metaDataUrl = metaDataUrl
          resolve(result.data)
        }).catch((error) => {
          reject(new Error('Unable to find token filters: ' + error))
        })
      })
    },
    tokenFilters ({ commit }) {
      return new Promise(function (resolve) {
        axios.get(MESH_API_PATH + '/v2/token-filters').then((result) => {
          commit('setFilters', result.data)
          resolve(result.data)
        }).catch((error) => {
          resolve(new Error('Unable to find token filters: ' + error))
        })
      })
    },
    buildCacheAll ({ commit }) {
      return new Promise(function (resolve) {
        axios.get(MESH_API_PATH + '/v2/build-application-cache').then((result) => {
          commit('setCacheState', result.data)
          resolve(result.data)
        }).catch((error) => {
          resolve(new Error('Unable to build cache: ' + error))
        })
      })
    },
    buildCache ({ commit }, contractId) {
      return new Promise(function (resolve) {
        axios.get(MESH_API_PATH + '/v2/build-cache/' + contractId).then((result) => {
          commit('setCacheState', result.data)
          resolve(result.data)
        }).catch((error) => {
          resolve(new Error('Unable to build cache: ' + error))
        })
      })
    },
    clearCache ({ commit }, contractId) {
      return new Promise(function (resolve, reject) {
        // const authHeaders = rootGetters[APP_CONSTANTS.KEY_AUTH_HEADERS]
        axios.defaults.withCredentials = true
        axios.get(MESH_API_PATH + '/v2/clear-cache/' + contractId).then((result) => {
          commit('setCacheState', result.data)
          resolve(result.data)
        }).catch((error) => {
          reject(new Error('Unable to register email: ' + error))
        })
      })
    },
    buildSearchIndex ({ commit, rootGetters }, contractId) {
      return new Promise(function (resolve) {
        const authHeaders = rootGetters[APP_CONSTANTS.KEY_AUTH_HEADERS]
        axios.get(MESH_API_PATH + '/v2/gaia/indexFiles/' + contractId, authHeaders).then((result) => {
          commit('setCacheState', result.data)
          resolve(result.data)
        }).catch((error) => {
          resolve(new Error('Unable to build search index: ' + error))
        })
      })
    },
    clearSearchIndex ({ commit }, contractId) {
      return new Promise(function (resolve) {
        axios.get(MESH_API_PATH + '/v2/gaia/clearFiles/' + contractId).then((result) => {
          commit('setData', result.data)
          resolve(result.data)
        }).catch((error) => {
          resolve(new Error('Unable to build search clear: ' + error))
        })
      })
    },
    registerForUpdates ({ commit, rootGetters }, data) {
      return new Promise(function (resolve, reject) {
        const authHeaders = rootGetters[APP_CONSTANTS.KEY_AUTH_HEADERS]
        axios.post('http://127.0.0.1:8046/mesh/v2/register/email', data, authHeaders.headers).then((result) => {
          commit('addRegisteredEmail', data)
          resolve(result)
        }).catch((error) => {
          reject(new Error('Unable to register email: ' + error))
        })
      })
    }
  }
}
export default assetGeneralStore
