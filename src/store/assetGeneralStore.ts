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
    }
  },
  mutations: {
    addRegisteredEmail (state, data) {
      state.emailData.push(data)
    },
    setTransactions (state, transactions) {
      state.transactions = transactions
    },
    setOffers (state, offers) {
      state.offers = offers
    }
  },
  actions: {
    fetchTransactions ({ commit, rootGetters }) {
      return new Promise(function (resolve, reject) {
        const authHeaders = rootGetters[APP_CONSTANTS.KEY_AUTH_HEADERS]
        axios.get(MESH_API_PATH + '/v2/secure/fetch/transactions', { headers: authHeaders }).then((response) => {
          commit('setOffers', response.data)
          resolve(response.data)
        }).catch((error) => {
          reject(new Error('Unable to fetch offers: ' + error))
        })
      })
    },
    fetchOffers ({ commit, rootGetters }) {
      return new Promise(function (resolve, reject) {
        const authHeaders = rootGetters[APP_CONSTANTS.KEY_AUTH_HEADERS]
        axios.get(MESH_API_PATH + '/v2/secure/fetch/offers', { headers: authHeaders }).then((response) => {
          commit('setOffers', response.data)
          resolve(response.data)
        }).catch((error) => {
          reject(new Error('Unable to fetch transactions: ' + error))
        })
      })
    },
    registerOfferOffChain ({ commit }, data: any) {
      return new Promise(function (resolve, reject) {
        axios.post(MESH_API_PATH + '/v2/register/offer', data).then(() => {
          commit('addOffer', data)
          resolve(data)
        }).catch((error) => {
          reject(new Error('Unable to register offer: ' + error))
        })
      })
    },
    registerForUpdates ({ commit }, data: any) {
      return new Promise(function (resolve, reject) {
        axios.post(MESH_API_PATH + '/v2/register/email', data).then((result) => {
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
