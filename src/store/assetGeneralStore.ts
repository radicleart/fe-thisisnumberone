import axios from 'axios'
import { APP_CONSTANTS } from '@/app-constants'

const MESH_API_PATH = process.env.VUE_APP_RISIDIO_API + '/mesh'

const assetGeneralStore = {
  namespaced: true,
  state: {
    emailData: [],
    offers: [],
    transactions: []
  },
  getters: {
    getTransactions: state => {
      return state.transactions
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
    addRegisteredEmail (state, data) {
      state.emailData.push(data)
    },
    setTransactions (state, transactions) {
      state.transactions = transactions
    }
  },
  actions: {
    fetchTransactions ({ commit }) {
      return new Promise(function (resolve, reject) {
        // const authHeaders = rootGetters[APP_CONSTANTS.KEY_AUTH_HEADERS]
        axios.get(MESH_API_PATH + '/v2/fetch/transactions').then((response) => {
          commit('setTransactions', response.data)
          resolve(response.data)
        }).catch((error) => {
          reject(new Error('Unable to fetch offers: ' + error))
        })
      })
    }
  }
}
export default assetGeneralStore
